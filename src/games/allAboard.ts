import { ALL_ABOARD, SCREEN_RECT } from '../config';
import type { Rect } from '../config';
import { controls } from '../controls';
import { drawSky, drawSprite, drawWaves, sprites } from './sprites';
import type { Game } from './types';

type Man = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  phase: 'run' | 'ready' | 'jump';
  timer: number;
  targetX: number;
};

const { gravity, pier, man, ship, sea, spawn } = ALL_ABOARD;
const MAN_SPRITES = { run: sprites.manRun, ready: sprites.manReady, jump: sprites.manJump };
// Человечек прыгает, когда добегает до края причала
const JUMP_X = pier.width - man.width / 2;
const SHIP_MAX_X = SCREEN_RECT.width - ship.width;
// Причал и море рисуются чуть ниже края экрана: нижние края картинок полупрозрачные
const BOTTOM_BLEED = 8;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const random = (min: number, max: number) => min + Math.random() * (max - min);
const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const manHitbox = (item: Man): Rect => ({
  x: item.x + (man.width - man.hitboxSize) / 2,
  y: item.y + (man.height - man.hitboxSize) / 2,
  width: man.hitboxSize,
  height: man.hitboxSize,
});

// Скорость прыжка, чтобы через flightTime центр человечка оказался над targetX на высоте палубы
const jump = (item: Man) => {
  const time = man.flightTime;
  const fromX = item.x + man.width / 2;
  const fromY = item.y + man.height / 2;
  const toY = ship.y + ship.hitbox.y + ship.hitbox.height / 2;
  item.vx = (item.targetX - fromX) / time;
  item.vy = (toY - fromY - (gravity * time * time) / 2) / time;
  item.phase = 'jump';
};

const moveMan = (item: Man, dt: number) => {
  if (item.phase === 'run') {
    item.x = Math.min(JUMP_X, item.x + man.runSpeed * dt);
    if (item.x === JUMP_X) {
      item.phase = 'ready';
      item.timer = man.readyTime;
    }
  } else if (item.phase === 'ready') {
    item.timer -= dt;
    if (item.timer <= 0) jump(item);
  } else {
    item.vy += gravity * dt;
    item.x += item.vx * dt;
    item.y += item.vy * dt;
  }
};

// Правый край картинки причала на всю высоту столбика, без стыков и повторов
const drawPier = (ctx: CanvasRenderingContext2D) => {
  const { pier: image } = sprites;
  if (!image.complete) return;
  const height = SCREEN_RECT.height - pier.y + BOTTOM_BLEED;
  const sourceWidth = (image.height * pier.width) / height;
  ctx.drawImage(image, image.width - sourceWidth, 0, sourceWidth, image.height, 0, pier.y, pier.width, height);
};

export const createAllAboard = (): Game => {
  let shipX = (ship.minX + SHIP_MAX_X) / 2;
  let men: Man[] = [];
  let elapsed = 0;
  let sinceSpawn = spawn.gap;
  let lastTargetX = shipX + ship.width / 2;

  // Точка падения выбирается так, чтобы кораблик успел доехать до неё от предыдущей
  const spawnMan = () => {
    const reach = ship.speed * sinceSpawn * spawn.reach;
    const minX = ship.minX + ship.width / 2;
    const maxX = SHIP_MAX_X + ship.width / 2;
    const targetX = random(clamp(lastTargetX - reach, minX, maxX), clamp(lastTargetX + reach, minX, maxX));
    men.push({ x: -man.width, y: pier.y - man.height, vx: 0, vy: 0, phase: 'run', timer: 0, targetX });
    lastTargetX = targetX;
    sinceSpawn = 0;
  };

  const game: Game = {
    score: 0,
    isOver: false,

    update(dt) {
      elapsed += dt;
      sinceSpawn += dt;

      const right = controls.isHeld('leftTop') || controls.isHeld('rightTop');
      const left = controls.isHeld('leftBottom') || controls.isHeld('rightBottom');
      shipX = clamp(shipX + (Number(right) - Number(left)) * ship.speed * dt, ship.minX, SHIP_MAX_X);

      const gap = Math.max(spawn.minGap, spawn.gap - spawn.gapDecrease * elapsed);
      const chance = Math.min(spawn.maxChance, spawn.chance + spawn.chanceGrowth * elapsed);
      if (men.length < spawn.maxMen && sinceSpawn >= gap && Math.random() < chance * dt) spawnMan();

      const shipHitbox = { ...ship.hitbox, x: shipX + ship.hitbox.x, y: ship.y + ship.hitbox.y };
      men.forEach((item) => moveMan(item, dt));
      const caught = men.filter((item) => item.vy > 0 && overlaps(manHitbox(item), shipHitbox));
      game.score += caught.length;
      men = men.filter((item) => caught.indexOf(item) === -1);
      // Скрылся под волной — не поймали
      if (men.some((item) => item.y > sea.y)) game.isOver = true;
    },

    draw(ctx) {
      drawSky(ctx);
      men.forEach((item) =>
        drawSprite(ctx, MAN_SPRITES[item.phase], { x: item.x, y: item.y, width: man.width, height: man.height }),
      );
      // elapsed растёт только в update, поэтому вне игры волны стоят
      drawWaves(ctx, sea.y, SCREEN_RECT.height - sea.y + BOTTOM_BLEED, elapsed * sea.speed);
      drawPier(ctx);
      // Медведь смотрит на причал, поэтому кораблик развёрнут влево
      drawSprite(ctx, sprites.ship, { x: shipX, y: ship.y, width: ship.width, height: ship.height }, true);
    },
  };

  return game;
};
