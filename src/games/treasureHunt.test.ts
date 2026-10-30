import { describe, expect, it, vi } from 'vitest';
import { TREASURE_HUNT } from '../config';
import { createTreasureHunt, spawnRow } from './treasureHunt';

vi.mock('./sprites', () => ({ sprites: {}, drawSprite: vi.fn(), drawSky: vi.fn(), drawWaves: vi.fn() }));
vi.mock('../sound', () => ({ sound: { play: vi.fn() } }));

const { lanes, ship, items, speed, spawn } = TREASURE_HUNT;

describe('Treasure Hunt', () => {
  it('в каждом ряду есть бревно и есть свободная от брёвен линия', () => {
    for (let i = 0; i < 1000; i++) {
      const row = spawnRow(1);
      const logs = row.filter((item) => item.kind === 'log');
      const rowLanes = row.map((item) => item.lane);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs.length).toBeLessThan(lanes.length);
      expect(rowLanes.filter((lane, index) => rowLanes.indexOf(lane) !== index)).toEqual([]);
    }
  });

  it('между рядами хватает места, чтобы объехать брёвна на максимальной скорости', () => {
    const laneSwitchDistance = (speed.max * (lanes.length - 1)) / ship.laneSpeed;
    expect(spawn.minRowGap).toBeGreaterThan(ship.hitbox.width + items.log.hitbox.width + laneSwitchDistance);
  });

  it('кораблик без управления рано или поздно врезается в бревно', () => {
    const game = createTreasureHunt();
    for (let time = 0; time < 60 && !game.isOver; time += 1 / 60) game.update(1 / 60);
    expect(game.isOver).toBe(true);
  });
});
