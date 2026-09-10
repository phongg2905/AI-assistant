#!/usr/bin/env python3
"""
TechWise Voice Transcribe — dùng repo ổn nhất cho mọi câu tiếng Việt
Ưu tiên: phostt Zipformer (qua HTTP) đã xử lý ở Node, ở đây chỉ faster-whisper + PhoWhisper
Repo: VinAIResearch/PhoWhisper (https://github.com/VinAIResearch/PhoWhisper) 844h Vi, WER 4.67% VIVOS
Fallback: openai/whisper small
Cài: pip install faster-whisper openai-whisper
Chạy: python scripts/transcribe.py <input.webm> <out.wav> vinai/PhoWhisper-small
Input: webm/wav/m4a/mp3 bất kỳ câu nào -> Output: text đã normalize
"""
import sys, subprocess, pathlib

def to_wav(inp, wav):
    try:
        subprocess.run(["ffmpeg","-y","-i",inp,"-ar","16000","-ac","1","-c:a","pcm_s16le",wav],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=12)
        return wav if pathlib.Path(wav).exists() else inp
    except:
        return inp

if len(sys.argv) < 4:
    print("usage: transcribe.py <input> <wav> <model>", file=sys.stderr); sys.exit(2)
inp, wav, model = sys.argv[1], sys.argv[2], sys.argv[3]
audio = to_wav(inp, wav)

# Thử faster-whisper + PhoWhisper (tốt nhất cho mọi câu Vi)
try:
    from faster_whisper import WhisperModel
    # model có thể là vinai/PhoWhisper-small trên HF, faster-whisper sẽ tự tải
    m = WhisperModel(model, device="cpu", compute_type="int8")
    segments, _info = m.transcribe(audio, language="vi", beam_size=5, vad_filter=True, without_timestamps=True)
    text = "".join(s.text for s in segments).strip()
    if text:
        print(text); sys.exit(0)
    raise ValueError("empty")
except Exception as e:
    # Fallback openai whisper
    try:
        import whisper
        # small đủ cho mọi câu, large tốt hơn nhưng nặng
        mname = "small" if "small" in model else "base"
        m = whisper.load_model(mname)
        res = m.transcribe(audio, language="vi", fp16=False)
        print(res["text"].strip()); sys.exit(0)
    except Exception as e2:
        print(f"both engines failed: {e} | {e2}", file=sys.stderr)
        sys.exit(1)
