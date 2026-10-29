import { useCallback, useState } from 'react';
import type { Mode } from '../../config';
import { createAllAboard } from '../../games/allAboard';
import { createTreasureHunt } from '../../games/treasureHunt';
import { Console } from '../Console';
import { GameShell } from '../GameShell';
import { TimeScreen } from '../TimeScreen';
import style from './App.module.less';

export const App = () => {
  // key меняется при каждом нажатии, чтобы повторное нажатие «Игра А» возвращало на старт игры
  const [screen, setScreen] = useState<{ mode: Mode; key: number }>({ mode: 'time', key: 0 });

  const selectMode = useCallback((mode: Mode) => setScreen((prev) => ({ mode, key: prev.key + 1 })), []);

  return (
    <div className={style.app}>
      <Console onModeSelect={selectMode}>
        {screen.mode === 'time' && <TimeScreen />}
        {screen.mode === 'gameA' && (
          <GameShell
            key={screen.key}
            title="Treasure Hunt"
            hint="Уклоняйтесь от брёвен и собирайте сундуки!"
            recordKey="treasure-hunt-record"
            createGame={createTreasureHunt}
          />
        )}
        {screen.mode === 'gameB' && (
          <GameShell
            key={screen.key}
            title="All Aboard!"
            hint="Заберите с собой в путешествие всех!"
            recordKey="all-aboard-record"
            createGame={createAllAboard}
          />
        )}
      </Console>
      <div className={style.hint}>
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> игровые кнопки
        </span>
        <span>
          <kbd>А</kbd> / <kbd>F</kbd> игра А
        </span>
        <span>
          <kbd>Б</kbd> / <kbd>,</kbd> игра Б
        </span>
        <span>
          <kbd>В</kbd> / <kbd>D</kbd> время
        </span>
      </div>
    </div>
  );
};
