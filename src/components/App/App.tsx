import { useCallback, useState } from 'react';
import type { Mode } from '../../config';
import { Console } from '../Console';
import { TimeScreen } from '../TimeScreen';
import style from './App.module.less';

const GAME_TITLES = { gameA: 'Treasure Hunt', gameB: 'All Aboard!' };

export const App = () => {
  // key меняется при каждом нажатии, чтобы повторное нажатие «Игра А» возвращало на старт игры
  const [screen, setScreen] = useState<{ mode: Mode; key: number }>({ mode: 'time', key: 0 });

  const selectMode = useCallback((mode: Mode) => setScreen((prev) => ({ mode, key: prev.key + 1 })), []);

  return (
    <div className={style.app}>
      <Console onModeSelect={selectMode}>
        {screen.mode === 'time' ? (
          <TimeScreen />
        ) : (
          <div key={screen.key} className={style.placeholder}>
            {GAME_TITLES[screen.mode]}
          </div>
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
