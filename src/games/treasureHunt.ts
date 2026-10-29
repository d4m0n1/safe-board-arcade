import { SCREEN_RECT, TREASURE_HUNT } from '../config';
import { controls } from '../controls';
import { clamp } from './math';
import { drawSky, drawSprite, drawWaves, sprites } from './sprites';
import type { Game } from './types';

type Kind = 'chest' | 'log';
type Item = { kind: Kind; lane: number; x: number };
type LaneButton = 'leftTop' | 'leftBottom';

const { lanes, waveHeight, laneBaseline, ship, items: itemSizes, speed, spawn } = TREASURE_HUNT;
const LAST_LANE = lanes.length - 1;
const ITEM_SPRITES = { chest: sprites.chest, log: sprites.log };

// Низ кораблика на дробной линии, пока он переходит между линиями
const shipBottom = (lane: number) => {
  const from = Math.floor(lane);
  const to = Math.min(from + 1, LAST_LANE);
  return lanes[from] + (lanes[to] - lanes[from]) * (lane - from) + laneBaseline;
};

const spawnRow = (twoLogsChance: number): Item[] => {
  const order = lanes.map((_, index) => index).sort(() => Math.random() - 0.5);
  const logCount = Math.random() < twoLogsChance ? 2 : 1;
  return order
    .map((lane, index): Item | null => {
      if (index < logCount) return { kind: 'log', lane, x: SCREEN_RECT.width };
      return Math.random() < spawn.chest ? { kind: 'chest', lane, x: SCREEN_RECT.width } : null;
    })
    .filter((item): item is Item => item !== null);
};

export const createTreasureHunt = (): Game => {
  let shipX = ship.minX;
  let lane = 1;
  let targetLane = 1;
  let items: Item[] = [];
  let elapsed = 0;
  let distance = 0;
  let sinceRow = spawn.rowGap;
  // Время до повторного перехода при зажатой кнопке, null — кнопка отпущена
  const repeatTimers: Record<LaneButton, number | null> = { leftTop: null, leftBottom: null };

  const handleLaneButton = (button: LaneButton, dt: number) => {
    const timer = repeatTimers[button];
    if (!controls.isHeld(button)) {
      repeatTimers[button] = null;
    } else if (timer !== null && timer > dt) {
      repeatTimers[button] = timer - dt;
    } else {
      targetLane = clamp(targetLane + (button === 'leftTop' ? -1 : 1), 0, LAST_LANE);
      repeatTimers[button] = ship.laneRepeat;
    }
  };

  const touchesShip = (item: Item) => {
    const { hitbox } = itemSizes[item.kind];
    const left = shipX + ship.hitbox.x;
    // Во время перехода кораблик считается на ближайшей линии
    return (
      item.lane === Math.round(lane) &&
      item.x + hitbox.x < left + ship.hitbox.width &&
      left < item.x + hitbox.x + hitbox.width
    );
  };

  const game: Game = {
    score: 0,
    isOver: false,

    update(dt) {
      elapsed += dt;
      const step = Math.min(speed.max, speed.start + speed.acceleration * elapsed) * dt;
      distance += step;
      sinceRow += step;

      const rowGap = Math.max(spawn.minRowGap, spawn.rowGap - spawn.rowGapDecrease * elapsed);
      if (sinceRow >= rowGap) {
        items = items.concat(spawnRow(Math.min(spawn.maxTwoLogs, spawn.twoLogs + spawn.twoLogsGrowth * elapsed)));
        sinceRow = 0;
      }

      handleLaneButton('leftTop', dt);
      handleLaneButton('leftBottom', dt);
      lane += clamp(targetLane - lane, -ship.laneSpeed * dt, ship.laneSpeed * dt);
      const forward = Number(controls.isHeld('rightTop')) - Number(controls.isHeld('rightBottom'));
      shipX = clamp(shipX + forward * ship.speed * dt, ship.minX, ship.maxX);

      items.forEach((item) => {
        item.x -= step;
      });
      const touched = items.filter(touchesShip);
      if (touched.some((item) => item.kind === 'log')) game.isOver = true;
      game.score += touched.length;
      items = items.filter((item) => touched.indexOf(item) === -1 && item.x + itemSizes[item.kind].width > 0);
    },

    draw(ctx) {
      drawSky(ctx);
      const shipLane = Math.round(lane);
      // Каждая следующая волна закрывает низ предметов предыдущей линии
      lanes.forEach((top, index) => {
        drawWaves(ctx, top, waveHeight, distance + index * 60);
        items
          .filter((item) => item.lane === index)
          .forEach((item) => {
            const { width, height } = itemSizes[item.kind];
            drawSprite(ctx, ITEM_SPRITES[item.kind], { x: item.x, y: top + laneBaseline - height, width, height });
          });
        if (index === shipLane) {
          drawSprite(ctx, sprites.ship, {
            x: shipX,
            y: shipBottom(lane) - ship.height,
            width: ship.width,
            height: ship.height,
          });
        }
      });
    },
  };

  return game;
};
