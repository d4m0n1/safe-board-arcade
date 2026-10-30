import { describe, expect, it, vi } from 'vitest';
import { ALL_ABOARD } from '../config';
import { createAllAboard, jump, moveMan } from './allAboard';
import type { Man } from './allAboard';

vi.mock('./sprites', () => ({ sprites: {}, drawSprite: vi.fn(), drawSky: vi.fn(), drawWaves: vi.fn() }));
vi.mock('../sound', () => ({ sound: { play: vi.fn() } }));

const { man, ship, pier } = ALL_ABOARD;

describe('All Aboard', () => {
  it('человечек прилетает в выбранную точку на высоте палубы', () => {
    const item: Man = { x: 0, y: pier.y - man.height, vx: 0, vy: 0, phase: 'ready', timer: 0, targetX: 300 };
    jump(item);
    const dt = 0.001;
    for (let time = dt; time <= man.flightTime; time += dt) moveMan(item, dt);

    const deckY = ship.y + ship.hitbox.y + ship.hitbox.height / 2;
    expect(Math.abs(item.x + man.width / 2 - item.targetX)).toBeLessThan(2);
    expect(Math.abs(item.y + man.height / 2 - deckY)).toBeLessThan(2);
  });

  it('если не двигать кораблик, кто-нибудь упадёт в воду', () => {
    const game = createAllAboard();
    for (let time = 0; time < 60 && !game.isOver; time += 1 / 60) game.update(1 / 60);
    expect(game.isOver).toBe(true);
  });
});
