import { Controller, Get, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VoiceService } from './voice.service.js';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voice: VoiceService) {}

  @Get('status')
  status() {
    return this.voice.status();
  }

  // POST /api/voice/transcribe  multipart/form-data  field: audio + optional field: webSpeechText
  // Hybrid A: frontend gửi kèm transcript interim/final của Web Speech để backend merge/polish
  // Trả { text, rawWhisper, engine, polished, latencyMs }
  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio', { limits: { fileSize: 8 * 1024 * 1024 } }))
  async transcribe(@UploadedFile() file: any, @Body() body: any) {
    if (!file) return { error: 'NO_AUDIO', message: 'Gửi field audio (webm/wav/mp3)' };
    const webSpeechText = body?.webSpeechText || body?.text || '';
    console.log(`[Voice] transcribe: file ${file.originalname} ${file.mimetype} ${file.size} bytes, webSpeechText: "${webSpeechText}"`);
    const result = await this.voice.transcribe(file.buffer, file.originalname, file.mimetype, webSpeechText);
    return result;
  }

  // Debug: gửi audio và nhận stats không cần Whisper (kiểm tra mic có thu được không)
  @Post('debug-audio')
  @UseInterceptors(FileInterceptor('audio', { limits: { fileSize: 8 * 1024 * 1024 } }))
  async debugAudio(@UploadedFile() file: any) {
    if (!file) return { error: 'NO_AUDIO' };
    try {
      const wavPath = await (this.voice as any).toWav16k ? await (this.voice as any).toWav16k(await (async()=>{const p=require('path'); const o=require('os'); const f=require('fs'); const id=require('crypto').randomUUID(); const ext=p.extname(file.originalname)||'.webm'; const tmp=o.tmpdir()+`/dbg_${id}${ext}`; await f.promises.writeFile(tmp,file.buffer); return tmp;})(), require('os').tmpdir()+`/dbg_${Date.now()}.wav`) : null;
      return { size: file.size, mimetype: file.mimetype, name: file.originalname };
    } catch (e:any) { return { size: file.size, error: e.message }; }
  }

  // POST /api/voice/transcribe-text  fallback khi frontend đã có transcript từ Web Speech API nhưng muốn normalize
  @Post('transcribe-text')
  async transcribeText(@Body() body: { text: string }) {
    if (!body?.text) return { error: 'NO_TEXT' };
    // Dùng cùng normalize
    const text = (this.voice as any).normalizeVi ? (this.voice as any).normalizeVi(body.text) : body.text;
    return { text, engine: 'normalize-only', latencyMs: 2 };
  }
}
