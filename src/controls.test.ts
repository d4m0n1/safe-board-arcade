import { describe, expect, it } from 'vitest';
import { controls } from './controls';
import type { Control } from './controls';

describe('controls', () => {
  it('сообщает о нажатиях подписчикам и помнит зажатые кнопки', () => {
    const pressed: Control[] = [];
    const unsubscribe = controls.subscribe((control) => pressed.push(control));

    controls.press('leftTop');
    expect(controls.isHeld('leftTop')).toBe(true);
    controls.release('leftTop');
    expect(controls.isHeld('leftTop')).toBe(false);

    unsubscribe();
    controls.press('rightTop');
    controls.release('rightTop');
    expect(pressed).toEqual(['leftTop']);
  });
});
