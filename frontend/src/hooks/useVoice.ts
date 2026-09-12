"use client";

import { useState, useRef, useEffect } from "react";

export function useVoice(
  onTranscript: (text: string) =>void,
  timersRef: React.MutableRefObject<number[]>,
  setInput: (v: string) =>void,
) {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceAnalyzing, setIsVoiceAnalyzing] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [polishedDiff, setPolishedDiff] = useState(false);
  const [debugAudioUrl, setDebugAudioUrl] = useState<string | null>(null);
  const [debugBlobSize, setDebugBlobSize] = useState<number | null>(null);
  const [waveLevels, setWaveLevels] = useState<number[]>([0.3, 0.6, 0.9, 0.6, 0.3, 0.7, 0.4]);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const isListeningRef = useRef(false);
  const transcriptRef = useRef("");
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { if (!isPolishing) setPolishedDiff(false); }, [isPolishing]);

  useEffect(() => {
    if (!isListening && !isVoiceAnalyzing && !isPolishing) return;
    if ((isListening || isPolishing) && analyserRef.current) {
      let raf: number | null = null;
      const tick = () => {
        const analyser = analyserRef.current;
        if (!analyser || !isListeningRef.current) return;
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const bands = 7;
        const step = Math.floor(data.length / bands);
        const levels: number[] = [];
        let rms = 0;
        for (let i = 0; i < bands; i++) {
          let sum = 0;
          for (let j = 0; j < step; j++) sum += data[i * step + j];
          const avg = sum / step / 255;
          rms += avg * avg;
          levels.push(Math.min(1, 0.18 + avg * 0.88));
        }
        rms = Math.sqrt(rms / bands);
        const boosted = levels.map((l) =>Math.min(1, l * (0.75 + rms * 0.85)));
        setWaveLevels(boosted);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => { if (raf) cancelAnimationFrame(raf); };
    }
    if (isListening) {
      const id = window.setInterval(() => { setWaveLevels(Array.from({ length: 7 }, () => 0.25 + Math.random() * 0.55)); }, 120);
      return () =>clearInterval(id);
    }
    const id = window.setInterval(() => { setWaveLevels((prev) =>prev.map((_, i) => 0.35 + Math.abs(Math.sin(Date.now() / 380 + i)) * 0.55)); }, 120);
    return () =>clearInterval(id);
  }, [isListening, isVoiceAnalyzing, isPolishing]);

  const startVoiceAnalyzingFlow = (transcript: string) => {
    setVoiceTranscript(transcript);
    setIsListening(false);
    setIsVoiceAnalyzing(true);
    const t = window.setTimeout(() =>onTranscript(transcript), 900);
    timersRef.current.push(t);
  };

  const cancelVoice = () => {
    try { recognitionRef.current?.stop(); } catch {}
    try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
    try { streamRef.current?.getTracks().forEach((t) =>t.stop()); } catch {}
    try { audioContextRef.current?.close(); } catch {}
    audioContextRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
    setIsPolishing(false);
    setIsVoiceAnalyzing(false);
    setVoiceTranscript("");
    setPolishedDiff(false);
  };

  const toggleListen = async () => {
    if (isListeningRef.current) {
      try { recognitionRef.current?.stop(); } catch {}
      try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {}
      try { streamRef.current?.getTracks().forEach((t) =>t.stop()); } catch {}
      try { audioContextRef.current?.close(); } catch {}
      audioContextRef.current = null;
      analyserRef.current = null;
      setIsListening(false);
      return;
    }
    const startTime = Date.now();
    let mediaOk = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, sampleRate: { ideal: 16000 } as any, channelCount: { ideal: 1 } as any } as any,
      });
      streamRef.current = stream;
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      try {
        const ac = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        audioContextRef.current = ac;
        const analyser = ac.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.72;
        const src = ac.createMediaStreamSource(stream);
        src.connect(analyser);
        analyserRef.current = analyser;
      } catch {}
      mr.onstop = async () => {
        const wasListening = isListeningRef.current;
        const blob = new Blob(audioChunksRef.current, { type: mime });
        const webText = (transcriptRef.current || voiceTranscript || "").trim();
        try { if (blob.size > 0) { const url = URL.createObjectURL(blob); setDebugAudioUrl(prev => { if (prev) URL.revokeObjectURL(prev); return url; }); setDebugBlobSize(blob.size); } } catch {}
        const stopTracks = () => { try { stream.getTracks().forEach((t) =>t.stop()); } catch {} try { audioContextRef.current?.close(); } catch {} audioContextRef.current = null; analyserRef.current = null; };
        if (blob.size < 1000) {
          setIsListening(false); setIsPolishing(false); isListeningRef.current = false;
          if (webText && wasListening) startVoiceAnalyzingFlow(webText);
          else if (!webText && wasListening) { setVoiceTranscript("Không nghe rõ, vui lòng thử lại hoặc gõ..."); window.setTimeout(() =>setVoiceTranscript(""), 2500); }
          stopTracks(); return;
        }
        setIsListening(false); isListeningRef.current = false; setIsPolishing(true); if (webText) setVoiceTranscript(webText);
        const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        let backendText: string | null = null; let rawWhisper: string | null = null; let polished = false;
        try {
          const fd = new FormData(); fd.append("audio", blob, `voice-${Date.now()}.webm`); if (webText) fd.append("webSpeechText", webText);
          const ctrl = new AbortController(); const to = window.setTimeout(() =>ctrl.abort(), 6500);
          const res = await fetch(`${API}/voice/transcribe`, { method: "POST", body: fd, signal: ctrl.signal as any });
          window.clearTimeout(to);
          if (res.ok) { const data = await res.json(); if (data.text) { backendText = data.text; rawWhisper = data.rawWhisper || null; polished = !!data.polished; } }
          else { await res.text().catch(()=> ""); console.debug("Whisper HTTP", res.status); }
        } catch (e: any) { if (e?.name === 'AbortError') console.debug("Whisper timeout"); else console.debug("Whisper unavailable, using WebSpeech"); }
        const final = (backendText || webText || "").trim(); stopTracks();
        if (final && wasListening) {
          if (polished && rawWhisper && webText && backendText && backendText !== webText) {
            setVoiceTranscript(backendText); setPolishedDiff(true);
            window.setTimeout(() => { setIsPolishing(false); startVoiceAnalyzingFlow(final); }, 650);
          } else { setVoiceTranscript(final); setIsPolishing(false); startVoiceAnalyzingFlow(final); }
        } else if (wasListening) { setIsPolishing(false); setVoiceTranscript("Không nghe rõ, vui lòng thử lại hoặc gõ..."); window.setTimeout(() =>setVoiceTranscript(""), 2500); } else setIsPolishing(false);
      };
      mr.start(200); mediaOk = true;
    } catch (e) { console.warn("MediaRecorder not available", e); }
    const SR: any = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    if (SR) {
      const rec = new SR(); recognitionRef.current = rec; rec.lang = "vi-VN"; rec.continuous = true; rec.interimResults = true; rec.maxAlternatives = 3;
      let finalTranscript = ""; let lastSpeechAt = Date.now();
      rec.onstart = () => { setIsListening(true); setVoiceTranscript(""); transcriptRef.current = ""; setIsVoiceAnalyzing(false); lastSpeechAt = Date.now(); };
      rec.onresult = (e: any) => { let interim = ""; for (let i = e.resultIndex; i < e.results.length; i++) { const t = e.results[i][0].transcript; if (e.results[i].isFinal) finalTranscript += t + " "; else interim += t; } const cur = (finalTranscript + interim).trim(); if (cur) lastSpeechAt = Date.now(); setVoiceTranscript(cur); transcriptRef.current = cur; if (cur) setInput(cur); };
      rec.onerror = (e: any) => {
        const err = e?.error || ""; if (err === "no-speech" || err === "aborted") return;
        if (err === "network") { if ((rec as any)._fatal) return; console.debug("SpeechRecognition network fallback"); (rec as any)._fatal = true; try { rec.stop(); } catch {} let silenceMs = 0; const checkSilence = window.setInterval(() => { const analyser = analyserRef.current; if (!analyser || mediaRecorderRef.current?.state !== "recording") { window.clearInterval(checkSilence); return; } const data = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(data); let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i]; const avg = sum / data.length / 255; if (avg < 0.06) silenceMs += 120; else silenceMs = 0; if (silenceMs >= 1500) { window.clearInterval(checkSilence); try { mediaRecorderRef.current?.stop(); } catch {} } if (Date.now() - startTime > 8000) window.clearInterval(checkSilence); }, 120); const whisperStopTimer = window.setTimeout(() => { window.clearInterval(checkSilence); try { if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop(); } catch {} }, 8000); timersRef.current.push(whisperStopTimer); return; }
        if (err === "not-allowed" || err === "service-not-allowed" || err === "audio-capture" || err === "not-supported") { console.warn("SpeechRecognition not allowed:", err); (rec as any)._fatal = true; setIsListening(false); try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {} return; }
        console.warn("SpeechRecognition error", err, e);
      };
      let restartCount = 0;
      rec.onend = () => {
        if (!isListeningRef.current) return; if ((rec as any)._fatal) return;
        if (Date.now() - startTime > 15000) { try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {} setIsListening(false); const t = (finalTranscript || transcriptRef.current || voiceTranscript).trim(); if (t) startVoiceAnalyzingFlow(t); return; }
        if (Date.now() - lastSpeechAt < 1500 && finalTranscript.trim()) { try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {} setIsListening(false); startVoiceAnalyzingFlow(finalTranscript.trim()); return; }
        if (!finalTranscript.trim() && Date.now() - startTime < 12000 && restartCount < 3) { restartCount++; window.setTimeout(() => { try { rec.start(); } catch {} }, 300); return; }
        const t = (finalTranscript || transcriptRef.current || voiceTranscript).trim();
        if (t) { try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {} setIsListening(false); startVoiceAnalyzingFlow(t); }
        else if (Date.now() - startTime < 8000 && restartCount < 2) { restartCount++; window.setTimeout(() => { try { rec.start(); } catch {} }, 300); } else setIsListening(false);
      };
      try { rec.start(); } catch {}
      const to = window.setTimeout(() => { if (isListeningRef.current) { try { rec.stop(); } catch {} try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {} } }, 15000);
      timersRef.current.push(to); setIsListening(true); return;
    }
    if (mediaOk) {
      setIsListening(true); setVoiceTranscript(""); transcriptRef.current = "";
      let silenceMs2 = 0; const sid2 = window.setInterval(() => { const analyser = analyserRef.current; if (!analyser || mediaRecorderRef.current?.state !== "recording") { window.clearInterval(sid2); return; } const data = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(data); let sum = 0; for (let i = 0; i < data.length; i++) sum += data[i]; const avg = sum / data.length / 255; if (avg < 0.08) silenceMs2 += 150; else silenceMs2 = 0; if (silenceMs2 >= 1500) { window.clearInterval(sid2); try { mediaRecorderRef.current?.stop(); } catch {} } if (Date.now() - startTime > 8500) window.clearInterval(sid2); }, 150);
      const to = window.setTimeout(() => { window.clearInterval(sid2); if (isListeningRef.current) { try { mediaRecorderRef.current?.state === "recording" && mediaRecorderRef.current.stop(); } catch {} setIsListening(false); } }, 15000);
      timersRef.current.push(to);
    }
  };

  return { isListening, isVoiceAnalyzing, isPolishing, voiceTranscript, polishedDiff, waveLevels, debugAudioUrl, debugBlobSize, analyserRef, recognitionRef, mediaRecorderRef, setIsListening, setIsVoiceAnalyzing, setIsPolishing, setVoiceTranscript, toggleListen, cancelVoice, startVoiceAnalyzingFlow };
}
