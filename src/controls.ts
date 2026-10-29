export type Control = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

type Listener = (control: Control) => void;

let listeners: Listener[] = [];
const held: Record<Control, boolean> = { leftTop: false, leftBottom: false, rightTop: false, rightBottom: false };

// Игровые кнопки приставки. Игры подписываются на нажатия и не знают, мышь это или клавиатура.
export const controls = {
  press(control: Control) {
    held[control] = true;
    listeners.forEach((listener) => listener(control));
  },
  release(control: Control) {
    held[control] = false;
  },
  isHeld(control: Control) {
    return held[control];
  },
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  },
};
