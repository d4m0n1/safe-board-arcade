import { useCallback, useState } from 'react';
import cn from 'classnames';
import type { Mode } from '../../config';
import { createAllAboard } from '../../games/allAboard';
import { createTreasureHunt } from '../../games/treasureHunt';
import { sound } from '../../sound';
import { Console } from '../Console';
import { Decor } from '../Decor';
import { GameShell } from '../GameShell';
import { TimeScreen } from '../TimeScreen';
import style from './App.module.less';

export const App = () => {
  // key меняется при каждом нажатии, чтобы повторное нажатие «Игра А» возвращало на старт игры
  const [screen, setScreen] = useState<{ mode: Mode; key: number }>({ mode: 'time', key: 0 });

  const [muted, setMuted] = useState(sound.isMuted);

  const toggleSound = () => {
    sound.setMuted(!muted);
    setMuted(!muted);
  };

  const selectMode = useCallback((mode: Mode) => setScreen((prev) => ({ mode, key: prev.key + 1 })), []);

  return (
    <div className={style.app}>
      <div className={style.stage}>
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
        <Decor />
      </div>
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
        <button
          type="button"
          className={cn(style.sound, muted && style.muted)}
          aria-label={muted ? 'Включить звук' : 'Выключить звук'}
          onClick={toggleSound}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
            <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11" />
            {muted && <path d="M3 3l18 18" />}
          </svg>
        </button>
      </div>
    </div>
  );
};
