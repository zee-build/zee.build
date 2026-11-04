"""Voice and word-time a short reel from a spec, for the Short composition.

Usage: python build_short.py <spec.json> <out-props.json>
Spec: {"slug", "banner", "kicker", "scenes": [{"id", "say", "caption"?, "pause", "kind", ...}]}
Writes public/vo-<slug>.wav and the props file (the spec plus line and word timings).
"""
import json, os, re, subprocess, sys
from difflib import SequenceMatcher
from pathlib import Path
import numpy as np, soundfile as sf
from faster_whisper import WhisperModel
from kokoro_onnx import Kokoro

HERE = Path(__file__).parent
spec = json.load(open(sys.argv[1], encoding="utf-8"))
VOICE, SPEED = spec.get("voice", "am_michael"), spec.get("speed", 1.12)
models = Path(os.environ.get("KOKORO_DIR", Path.home() / "tools" / "kokoro"))
tts = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
whisper = WhisperModel("small", device="cpu", compute_type="int8")
tmp = HERE / "out" / spec["slug"]
tmp.mkdir(parents=True, exist_ok=True)


def transcribe(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-vn", "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    segments, _ = whisper.transcribe(np.frombuffer(raw, dtype=np.float32), word_timestamps=True, vad_filter=True)
    return [{"word": w.word.strip(), "start": w.start, "end": w.end} for s in segments for w in (s.words or []) if w.word.strip()]


def align(words, script):
    """Keep Whisper's timing but the script's spelling."""
    norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
    ops = SequenceMatcher(a=[norm(w["word"]) for w in words], b=[norm(s) for s in script], autojunk=False).get_opcodes()
    if sum(i2 - i1 for tag, i1, i2, _, _ in ops if tag == "equal") < 0.5 * len(script):
        return words
    out = []
    for tag, i1, i2, j1, j2 in ops:
        if tag == "equal":
            out += [{**words[i], "word": script[j]} for i, j in zip(range(i1, i2), range(j1, j2))]
        elif j2 > j1:
            if i2 > i1:
                t0, t1 = words[i1]["start"], words[i2 - 1]["end"]
            else:
                t0 = out[-1]["end"] if out else words[0]["start"]
                t1 = words[i1]["start"] if i1 < len(words) else t0 + 0.3 * (j2 - j1)
                t1 = max(t1, t0 + 0.15 * (j2 - j1))
            step = (t1 - t0) / (j2 - j1)
            out += [{"word": script[j], "start": t0 + k * step, "end": t0 + (k + 1) * step} for k, j in enumerate(range(j1, j2))]
    return out


rate, t = 24000, 0.15
audio, lines, words = [], [], []
for sc in spec["scenes"]:
    samples, rate = tts.create(sc["say"], voice=VOICE, speed=SPEED, lang="en-us")
    loud = np.flatnonzero(np.abs(samples) > 0.02)  # trim Kokoro's built-in silence
    pad = int(0.04 * rate)
    samples = samples[max(loud[0] - pad, 0): loud[-1] + pad]
    path = tmp / f"{sc['id']}.wav"
    sf.write(path, samples, rate)
    dur = len(samples) / rate
    ws = align(transcribe(path), sc.get("caption", sc["say"]).split())
    words += [{"word": w["word"], "start": round(float(w["start"]) + t, 3), "end": round(float(w["end"]) + t, 3), "line": sc["id"]} for w in ws]
    lines.append({"id": sc["id"], "start": round(t, 3), "end": round(t + dur, 3)})
    audio += [samples, np.zeros(int(sc.get("pause", 0.4) * rate), dtype=samples.dtype)]
    t += dur + sc.get("pause", 0.4)

full = np.concatenate([np.zeros(int(0.15 * rate), dtype=audio[0].dtype)] + audio)
sf.write(HERE / "public" / f"vo-{spec['slug']}.wav", full, rate)
json.dump({**spec, "lines": lines, "words": words, "total": round(t, 3)}, open(sys.argv[2], "w", encoding="utf-8"))
print(spec["slug"], "total", round(t, 2), "s,", len(words), "words")
