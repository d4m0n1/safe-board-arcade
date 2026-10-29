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

// Координаты в играх — в пикселях экрана (507×324), их можно снять с референсов, вырезав экран.
// Скорости в пикселях в секунду, время в секундах.
export const ALL_ABOARD = {
  gravity: 500,
  pier: { width: 48, y: 195 },
  man: { width: 52, height: 50, runSpeed: 110, readyTime: 0.3, flightTime: 1.3, hitboxSize: 14 },
  ship: {
    width: 200,
    height: 111,
    y: 169,
    minX: 60,
    speed: 280,
    hitbox: { x: 60, y: 38, width: 80, height: 20 },
  },
  sea: { y: 235, speed: 20 },
  spawn: {
    // Пауза между человечками уменьшается со временем, но не ниже minGap
    gap: 1.6,
    minGap: 0.7,
    gapDecrease: 0.015,
    // Шанс появления в секунду растёт со временем, но не выше maxChance
    chance: 1,
    chanceGrowth: 0.05,
    maxChance: 3,
    maxMen: 4,
    // Доля пути, который кораблик успевает проехать до следующего приземления
    reach: 0.8,
  },
};

export const TREASURE_HUNT = {
  // Верхние края волн трёх линий, от дальней к ближней
  lanes: [105, 170, 235],
  waveHeight: 110,
  // Насколько ниже верхнего края своей волны находятся низ кораблика и предметов
  laneBaseline: 36,
  ship: {
    width: 180,
    height: 100,
    minX: 0,
    maxX: 310,
    speed: 260,
    // Линий в секунду при переходе и пауза перед повтором при зажатой кнопке
    laneSpeed: 7,
    laneRepeat: 0.3,
    hitbox: { x: 40, width: 100 },
  },
  items: {
    chest: { width: 44, height: 38, hitbox: { x: 6, width: 32 } },
    log: { width: 70, height: 44, hitbox: { x: 8, width: 54 } },
  },
  // Скорость моря растёт со временем, но не выше max
  speed: { start: 130, acceleration: 5, max: 280 },
  spawn: {
    // Расстояние между рядами предметов уменьшается, но не ниже minRowGap.
    // minRowGap должен быть больше ширины кораблика + бревна + пути за смену двух линий, иначе ряд не объехать
    rowGap: 400,
    minRowGap: 270,
    rowGapDecrease: 5,
    // Шанс, что в ряду два бревна вместо одного. Три бревна в ряду не бывает
    twoLogs: 0.2,
    twoLogsGrowth: 0.02,
    maxTwoLogs: 0.7,
    // Шанс сундука на свободной линии ряда
    chest: 0.4,
  },
};
