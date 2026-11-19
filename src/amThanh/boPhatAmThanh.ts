// Bo tong hop am thanh bang Web Audio API (khong can tep am thanh ngoai)

class BoPhatAmThanh {
  private ctx: AudioContext | null = null;
  private batAm = true;
  private boDemNhacNen: number | null = null;
  private dangPhatNhac = false;
  private cheDoYeuVuong = false;

  private layContext(): AudioContext | null {
    if (!this.batAm || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public caiDatAmThanh(bat: boolean) {
    this.batAm = bat;
    if (!bat) {
      this.dungNhacNen();
    }
  }

  public phatAmNhanNut() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.06);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public phatAmBuocChan() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(145, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.055);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  public phatAmDaVo() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const doDai = Math.floor(ctx.sampleRate * 0.28);
    const buffer = ctx.createBuffer(1, doDai, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < doDai; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.07));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.27);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  }

  public phatAmKiemKhi() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(310, now + 0.2);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  }

  public phatAmGamYeuVuong() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(72, now + 0.42);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, now);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.46);
  }

  public phatAmChuongTranDau() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [220, 330, 440, 660].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.14 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.85);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    });
  }

  public phatAmDung() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const tanSo = [523.25, 659.25, 783.99];
    tanSo.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.065;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.11, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  }

  public phatAmSai() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(175, now);
    osc.frequency.exponentialRampToValueAtTime(98, now + 0.22);
    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  public phatAmNgoDao() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [392, 587.33, 783.99, 1174.66].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.12 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.15);
    });
  }

  public phatAmSamSet() {
    const ctx = this.layContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const doDai = Math.floor(ctx.sampleRate * 0.55);
    const buffer = ctx.createBuffer(1, doDai, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < doDai; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.14));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(140, now + 0.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.24, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);

    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(95, now);
    sub.frequency.exponentialRampToValueAtTime(38, now + 0.45);
    subGain.gain.setValueAtTime(0.18, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.5);
  }

  public batDauNhacNen(bat: boolean, yeuVuong = false) {
    if (!bat || !this.batAm) {
      this.dungNhacNen();
      return;
    }
    if (this.dangPhatNhac && this.cheDoYeuVuong === yeuVuong) return;
    this.dungNhacNen();
    if (typeof window === 'undefined') return;
    this.dangPhatNhac = true;
    this.cheDoYeuVuong = yeuVuong;

    const nguCung = yeuVuong
      ? [196.0, 220.0, 261.63, 293.66, 329.63, 392.0]
      : [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
    let buoc = 0;

    const choiNot = () => {
      if (!this.dangPhatNhac || !this.batAm) return;
      const ctx = this.layContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const f = nguCung[(buoc * 2 + (buoc % 3)) % nguCung.length];
      buoc++;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = yeuVuong ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(yeuVuong ? 0.032 : 0.024, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(
        0.0005,
        now + (yeuVuong ? 0.85 : 1.6)
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (yeuVuong ? 0.9 : 1.65));
    };

    choiNot();
    this.boDemNhacNen = window.setInterval(choiNot, yeuVuong ? 750 : 1800);
  }

  public dungNhacNen() {
    this.dangPhatNhac = false;
    if (this.boDemNhacNen !== null && typeof window !== 'undefined') {
      window.clearInterval(this.boDemNhacNen);
      this.boDemNhacNen = null;
    }
  }
}

export const boPhatAmThanh = new BoPhatAmThanh();
