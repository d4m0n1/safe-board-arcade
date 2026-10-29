type Note = { frequency: number; duration: number };

const note = (frequency: number, duration: number): Note => ({ frequency, duration });

// Короткие мелодии в духе пищалки «Электроники»: частота в герцах, длительность в секундах
const SOUNDS = {
  click: [note(880, 0.03)],
  screen: [note(523, 0.06), note(784, 0.08)],
  start: [note(523, 0.07), note(659, 0.07), note(784, 0.12)],
  catch: [note(660, 0.06), note(990, 0.1)],
  chest: [note(988, 0.05), note(1319, 0.12)],
  splash: [note(300, 0.07), note(200, 0.07), note(120, 0.15)],
  crash: [note(160, 0.08), note(90, 0.18)],
  gameOver: [note(392, 0.15), note(330, 0.15), note(262, 0.3)],
};

export type SoundName = keyof typeof SOUNDS;

const VOLUME = 0.05;
const MUTED_KEY = 'sound-muted';

let context: AudioContext | null = null;
let muted = false;
try {
  muted = localStorage.getItem(MUTED_KEY) === '1';
} catch {}

export const sound = {
  // delay в секундах, чтобы мелодия проигрыша не накладывалась на звук столкновения
  play(name: SoundName, delay = 0) {
    if (muted) return;
    // Браузер разрешает звук только после действия пользователя, поэтому контекст создаётся при первом звуке
    context = context ?? new AudioContext();
    let time = context.currentTime + delay;
    SOUNDS[name].forEach(({ frequency, duration }) => {
      const ctx = context as AudioContext;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'square';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(VOLUME, time);
      gain.gain.linearRampToValueAtTime(0, time + duration);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(time);
      oscillator.stop(time + duration);
      time += duration;
    });
  },
  isMuted() {
    return muted;
  },
  setMuted(value: boolean) {
    muted = value;
    try {
      localStorage.setItem(MUTED_KEY, value ? '1' : '0');
    } catch {}
  },
};
