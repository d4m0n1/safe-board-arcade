export const loadRecord = (key: string) => {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
};

// Сохраняет результат, если это рекорд, и возвращает текущий рекорд
export const saveRecord = (key: string, score: number) => {
  const record = loadRecord(key);
  if (score <= record) return record;
  try {
    localStorage.setItem(key, String(score));
  } catch {}
  return score;
};
