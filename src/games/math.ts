export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export const shuffle = <T>(array: T[]) => {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

export const random = (min: number, max: number) => min + Math.random() * (max - min);
