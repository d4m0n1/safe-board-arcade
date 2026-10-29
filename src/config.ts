import type { Control } from './controls';

export type Mode = 'gameA' | 'gameB' | 'time';
export type ButtonId = Control | Mode;
export type Rect = { x: number; y: number; width: number; height: number };

// Все координаты в пикселях картинки корпуса assets/console.png
export const CONSOLE_SIZE = { width: 1073, height: 628 };
export const SCREEN_RECT: Rect = { x: 282, y: 150, width: 507, height: 324 };

export const BUTTONS: { id: ButtonId; label: string; rect: Rect; round: boolean }[] = [
  { id: 'gameA', label: 'Игра А', rect: { x: 910, y: 74, width: 43, height: 24 }, round: false },
  { id: 'gameB', label: 'Игра Б', rect: { x: 910, y: 147, width: 43, height: 24 }, round: false },
  { id: 'time', label: 'Время', rect: { x: 910, y: 219, width: 43, height: 24 }, round: false },
  { id: 'leftTop', label: 'Левая верхняя', rect: { x: 97, y: 405, width: 49, height: 49 }, round: true },
  { id: 'leftBottom', label: 'Левая нижняя', rect: { x: 97, y: 514, width: 49, height: 49 }, round: true },
  { id: 'rightTop', label: 'Правая верхняя', rect: { x: 923, y: 405, width: 49, height: 49 }, round: true },
  { id: 'rightBottom', label: 'Правая нижняя', rect: { x: 923, y: 514, width: 49, height: 49 }, round: true },
];

// По event.code, чтобы не зависеть от раскладки. KeyF, Comma, KeyD — это клавиши А, Б, В
export const KEYS: Record<string, ButtonId> = {
  ArrowUp: 'leftTop',
  ArrowDown: 'leftBottom',
  ArrowRight: 'rightTop',
  ArrowLeft: 'rightBottom',
  KeyF: 'gameA',
  Comma: 'gameB',
  KeyD: 'time',
};
