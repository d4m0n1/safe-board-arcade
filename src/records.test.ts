import { describe, expect, it, vi } from 'vitest';
import { loadRecord, saveRecord } from './records';

const storage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => storage[key] ?? null,
  setItem: (key: string, value: string) => {
    storage[key] = value;
  },
});

describe('records', () => {
  it('сохраняет только результат лучше прежнего', () => {
    expect(loadRecord('test')).toBe(0);
    expect(saveRecord('test', 5)).toBe(5);
    expect(saveRecord('test', 3)).toBe(5);
    expect(saveRecord('test', 8)).toBe(8);
    expect(loadRecord('test')).toBe(8);
  });
});
