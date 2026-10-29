export type Control = 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';

type Listener = (control: Control) => void;

let listeners: Listener[] = [];

// Игровые кнопки приставки. Игры подписываются на нажатия и не знают, мышь это или клавиатура.
export const controls = {
  press(control: Control) {
    listeners.forEach((listener) => listener(control));
  },
  subscribe(listener: Listener) {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  },
};
