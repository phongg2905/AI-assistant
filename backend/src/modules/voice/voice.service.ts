import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { spawn } from 'child_process';

// Hybrid A: Web Speech realtime (frontend interim) + Whisper polish cuối
// Model ưu tiên: Xenova/whisper-small đa ngôn ngữ (ổn định, 80MB quantized)
// Thử PhoWhisper nếu có trên HF, fallback về whisper-small nếu fail
let _pipeline: any = null;
let _env: any = null;
let _modelId: string | null = null;
let _warmupDone = false;

async function getPipeline(): Promise<{ pipe: any; modelId: string }> {
  if (_pipeline) return { pipe: _pipeline, modelId: _modelId! };
  const { pipeline, env } = await import('@xenova/transformers');
  _env = env;
  env.allowLocalModels = false;
  env.allowRemoteModels = true;
  // @ts-ignore
  env.backends.onnx.wasm.numThreads = 1;
  // Thử PhoWhisper trước (chính xác Vi hơn), fallback whisper-small
  const candidates = ['Xenova/whisper-small', 'Xenova/whisper-tiny'];
  let lastErr: any = null;
  for (const mid of candidates) {
    try {
      _pipeline = await pipeline('automatic-speech-recognition', mid, { quantized: true } as any);
      _modelId = mid;
      _warmupDone = true;
      return { pipe: _pipeline, modelId: mid };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

async function warmupPipeline() {
  if (_warmupDone) return;
  try {
    await getPipeline();
  } catch {}
}

@Injectable()
export class VoiceService {
  private readonly logger = new Logger(VoiceService.name);

  async onModuleInit() {
    // Warmup không block startup, tải model nền để lần đầu không delay 15s
    setTimeout(() => warmupPipeline().then(() => this.logger.log(`Voice warmup done: ${_modelId}`)).catch(() => {}), 2000);
  }

  // Hybrid A polish: Web Speech realtime (đã hiện từng chữ ở frontend) + Whisper sửa cuối
  // webSpeechText: transcript từ frontend interim/final để so sánh & merge
  async transcribe(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    webSpeechText?: string,
  ): Promise<{ text: string; engine: string; latencyMs: number; rawWhisper?: string; polished: boolean }> {
    const start = Date.now();
    const tmpDir = os.tmpdir();
    const id = randomUUID();
    const ext = path.extname(originalName) || '.webm';
    const tmpInput = path.join(tmpDir, `tw_${id}_in${ext}`);
    const tmpWav = path.join(tmpDir, `tw_${id}_out.wav`);
    await fs.promises.writeFile(tmpInput, buffer);

    try {
      const wavPath = await this.toWav16k(tmpInput, tmpWav);
      const audioData = await this.readWavAsFloat32(wavPath);
      this.logger.debug(`Whisper input: ${audioData.length} samples (~${(audioData.length/16000).toFixed(2)}s) blob ${buffer.length} bytes`);
      if (audioData.length < 16000 * 0.6) throw new Error('audio too short');
      // VAD đơn giản: nếu RMS quá thấp (im lặng) thì bỏ Whisper để tránh hallucination
      let sumSq = 0; for (let i = 0; i < audioData.length; i++) sumSq += audioData[i]*audioData[i];
      const rms = Math.sqrt(sumSq / audioData.length);
      let peak = 0; for (let i = 0; i < audioData.length; i++) peak = Math.max(peak, Math.abs(audioData[i]));
      this.logger.log(`Audio stats: ${audioData.length} samples (~${(audioData.length/16000).toFixed(2)}s) RMS ${rms.toFixed(4)} peak ${peak.toFixed(3)} blob ${buffer.length} bytes`);
      if (rms < 0.005) throw new Error(`audio too silent (rms ${rms.toFixed(4)} low)`);

      const whisperTask = (async () => {
        const { pipe, modelId } = await getPipeline();
        // Giảm hallucination: temperature thấp, no_repeat
        const result: any = await pipe(audioData, { language: 'vi', task: 'transcribe', temperature: 0, no_repeat_ngram_size: 3 } as any);
        const raw = (result.text || '').trim();
        if (!raw) throw new Error('empty transcript');
        // Blacklist hallucination phổ biến — nếu dính thì coi như fail để fallback webText
        const hallucinated = ['một mức tất cả mọi người', 'một mực tất cả mọi người', 'cảm ơn các bạn đã theo dõi', 'hẹn gặp lại các bạn', 'xin chào tất cả mọi người', 'cảm ơn bạn đã xem video'];
        const lower = raw.toLowerCase();
        if (hallucinated.some(h => lower.includes(h))) {
          this.logger.warn(`Hallucination detected: "${raw}" -> fallback`);
          throw new Error(`whisper hallucination: "${raw}"`);
        }
        this.logger.log(`Whisper raw: "${raw}"`);
        return { raw, modelId };
      })();
      const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('whisper timeout 5.5s')), 5500));
      const { raw, modelId } = await Promise.race([whisperTask, timeout]) as any;
      const whisperNorm = this.normalizeVi(raw);
      let finalText = whisperNorm;
      let polished = true;
      if (webSpeechText && webSpeechText.trim()) {
        const webNorm = this.normalizeVi(webSpeechText.trim());
        finalText = this.mergeHybrid(webNorm, whisperNorm);
        polished = finalText !== webNorm;
      }
      return { text: finalText, engine: `embedded:${modelId}`, latencyMs: Date.now() - start, rawWhisper: whisperNorm, polished };
    } catch (e: any) {
      this.logger.debug(`Whisper polish failed, giữ WebSpeech: ${e?.message || e}`);
      if (webSpeechText && webSpeechText.trim()) {
        return { text: this.normalizeVi(webSpeechText.trim()), engine: 'web-speech-only', latencyMs: Date.now() - start, polished: false };
      }
      return { text: '', engine: 'web-speech-fallback', latencyMs: Date.now() - start, polished: false };
    } finally {
      await fs.promises.unlink(tmpInput).catch(() => {});
      await fs.promises.unlink(tmpWav).catch(() => {});
    }
  }

  private async toWav16k(input: string, output: string): Promise<string> {
    const ffmpegPath: string = await (async () => {
      try {
        const { createRequire } = await import('module');
        const require = createRequire(import.meta.url);
        return require('ffmpeg-static') as string;
      } catch {
        try {
          const mod: any = await import('ffmpeg-static');
          return (mod.default || mod) as string;
        } catch {
          return 'ffmpeg';
        }
      }
    })();
    return new Promise((resolve, reject) => {
      const proc = spawn(ffmpegPath, ['-y', '-i', input, '-ar', '16000', '-ac', '1', '-c:a', 'pcm_s16le', output], { stdio: ['ignore', 'pipe', 'pipe'] });
      let err = '';
      proc.stderr.on('data', (d) => (err += d.toString()));
      proc.on('close', (code) => {
        if (code === 0 && fs.existsSync(output)) resolve(output);
        else reject(new Error(`ffmpeg exit ${code}: ${err}`));
      });
      proc.on('error', reject);
      setTimeout(() => { try { proc.kill(); } catch {}; reject(new Error('ffmpeg timeout')); }, 8000);
    });
  }

  private async readWavAsFloat32(wavPath: string): Promise<Float32Array> {
    const mod: any = await import('wavefile');
    const WaveFile = mod.WaveFile || mod.default?.WaveFile || mod.default;
    if (!WaveFile) throw new Error('WaveFile not found');
    const buf = await fs.promises.readFile(wavPath);
    const wav = new WaveFile(buf);
    if ((wav.fmt as any).sampleRate !== 16000) (wav as any).toSampleRate(16000);
    if ((wav.fmt as any).numChannels !== 1) (wav as any).toMono();
    // wavefile getSamples với ArrayType Float32Array đã trả -1..1, nhưng nếu wav là int16 thì cần chuẩn hóa
    let samples: any = wav.getSamples(false, Float32Array);
    let float = Array.isArray(samples) ? (samples[0] as Float32Array) : (samples as Float32Array);
    // Fallback nếu vẫn trả Int16Array hoặc giá trị >1
    if (float.length > 0 && Math.abs(float[0]) > 1.5) {
      const tmp = new Float32Array(float.length);
      for (let i = 0; i < float.length; i++) tmp[i] = (float as any)[i] / 32768;
      float = tmp;
    }
    // Cắt silence đầu/cuối để giảm hallucination
    float = this.trimSilence(float, 16000);
    return float;
  }

  private trimSilence(data: Float32Array, sr: number): Float32Array {
    const win = Math.floor(sr * 0.02); // 20ms
    let start = 0, end = data.length;
    for (let i = 0; i < data.length - win; i += win) {
      let s = 0; for (let j = 0; j < win; j++) s += Math.abs(data[i+j]);
      if (s / win > 0.015) { start = Math.max(0, i - win*2); break; }
    }
    for (let i = data.length - win; i >= 0; i -= win) {
      let s = 0; for (let j = 0; j < win; j++) s += Math.abs(data[i+j]);
      if (s / win > 0.015) { end = Math.min(data.length, i + win*3); break; }
    }
    if (end - start < data.length * 0.5) return data.subarray(start, end);
    return data;
  }

  // Merge heuristic: giữ bản rõ intent hơn (có số + từ khóa CNTT/Valorant)
  private mergeHybrid(web: string, whisper: string): string {
    const hasBudget = (s: string) => /\d+\s*(tr|triệu)/i.test(s);
    const hasKeyword = (s: string) => /(cntt|lập trình|valorant|gaming|genshin|mỏng|nhẹ|oled|ai|data)/i.test(s);
    const webScore = (hasBudget(web) ? 2 : 0) + (hasKeyword(web) ? 1 : 0) + (web.length > 8 ? 1 : 0);
    const whScore = (hasBudget(whisper) ? 2 : 0) + (hasKeyword(whisper) ? 1 : 0) + (whisper.length > 8 ? 1 : 0);
    // Nếu Whisper có budget mà Web không -> dùng Whisper
    if (whScore > webScore) return whisper;
    if (webScore > whScore) return web;
    // Hòa -> ưu tiên Whisper nếu dài hơn & không rỗng, ngược lại giữ Web (ít hallucination hơn)
    if (whisper.length >= web.length * 0.85 && whisper.length > 5) return whisper;
    return web;
  }

  status() {
    return { modelId: _modelId, warmupDone: _warmupDone, ready: !!_pipeline };
  }

  private normalizeVi(text: string): string {
    let t = text.trim();
    const map: Record<string, string> = {
      'mười chín': '19', 'mười tám': '18', 'mười bảy': '17', 'mười sáu': '16', 'mười lăm': '15',
      'mười bốn': '14', 'mười ba': '13', 'mười hai': '12', 'mười một': '11', 'mười': '10',
      'hai mươi': '20', 'hai chục': '20', 'ba mươi': '30',
    };
    // Thay cụm dài trước để tránh "mười tám" -> "10 tám"
    for (const [k, v] of Object.entries(map)) t = t.replace(new RegExp(`\\b${k}\\b`, 'gi'), v);
    t = t.replace(/(\d+)\s*tr\b/gi, '$1tr').replace(/(\d+)\s*triệu/gi, '$1 triệu');
    t = t.replace(/\bc\s*n\s*t\s*t\b/gi, 'CNTT').replace(/va\s*lô\s*ran/gi, 'Valorant');
    return t;
  }
}
