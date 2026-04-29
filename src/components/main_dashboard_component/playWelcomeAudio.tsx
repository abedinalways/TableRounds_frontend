
export function playWelcomeAudio() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();

    ctx.resume().then(() => {
      const now = ctx.currentTime;

      /* ── Master compressor (glue / polish) ── */
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.knee.value = 10;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.25;
      comp.connect(ctx.destination);

      /* ── Algorithmic reverb (generated impulse response) ── */
      const convolver = ctx.createConvolver();
      const revLen = Math.floor(ctx.sampleRate * 2.4); // 2.4 s tail
      const revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = revBuf.getChannelData(ch);
        for (let i = 0; i < revLen; i++) {
          // Exponential noise decay — simulates a mid-sized room
          d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / revLen, 2.6);
        }
      }
      convolver.buffer = revBuf;

      const wetGain = ctx.createGain();
      wetGain.gain.value = 0.38; // 38 % wet
      convolver.connect(wetGain);
      wetGain.connect(comp);

      /* ── FM Bell voice ──
         Uses frequency modulation (carrier + modulator oscillators)
         to produce rich, natural bell/chime overtones — far warmer
         than a plain sine wave.                                     */
      const bell = (
        freq: number,
        t: number,
        vol: number,
        dur: number,
        pan = 0,
      ) => {
        // Modulator  (modRatio × carrier, high index at onset → bright attack)
        const modOsc = ctx.createOscillator();
        const modGain = ctx.createGain();
        modOsc.type = 'sine';
        modOsc.frequency.value = freq * 3.5;
        modGain.gain.setValueAtTime(freq * 8, t);
        modGain.gain.exponentialRampToValueAtTime(1, t + dur * 0.35); // index decay
        modOsc.connect(modGain);

        // Carrier
        const carOsc = ctx.createOscillator();
        carOsc.type = 'sine';
        carOsc.frequency.value = freq;
        modGain.connect(carOsc.frequency); // FM connection

        // Amplitude envelope  (instant attack, long exponential decay)
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(vol, t + 0.008);
        env.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        // Stereo placement
        const panner = ctx.createStereoPanner();
        panner.pan.value = pan;

        carOsc.connect(env);
        env.connect(panner);
        panner.connect(comp); // dry path
        panner.connect(convolver); // wet path

        modOsc.start(t);
        modOsc.stop(t + dur + 0.1);
        carOsc.start(t);
        carOsc.stop(t + dur + 0.1);
      };

      /* ── Warm bass pad (triangle wave — soft & fundamental) ── */
      const pad = (freq: number, t: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.12);
        gain.gain.linearRampToValueAtTime(0.04, t + dur - 0.25);
        gain.gain.linearRampToValueAtTime(0, t + dur);
        osc.connect(gain);
        gain.connect(comp);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      };

      /* ── Sequence: G major ascending resolution ──
         G4 → B4 → D5 → G5
         Uplifting, balanced, unmistakably "welcome".   */
      const notes = [
        { freq: 392.0, t: 0.0, vol: 0.2, dur: 1.3, pan: -0.25 }, // G4
        { freq: 493.88, t: 0.2, vol: 0.17, dur: 1.2, pan: -0.1 }, // B4
        { freq: 587.33, t: 0.4, vol: 0.15, dur: 1.1, pan: 0.1 }, // D5
        { freq: 783.99, t: 0.6, vol: 0.14, dur: 1.6, pan: 0.0 }, // G5 (peak)
      ];

      notes.forEach(n => bell(n.freq, now + n.t, n.vol, n.dur, n.pan));

      // Sub bass on G2 — felt more than heard, adds body
      pad(98.0, now + 0.05, 2.0);

      // Airy shimmer overtone on G6 at the peak note
      bell(1567.98, now + 0.62, 0.045, 0.9, 0.15);
    });
  } catch {
    // Audio blocked by browser — fail silently
  }
}