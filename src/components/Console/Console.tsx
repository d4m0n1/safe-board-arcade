import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import cn from 'classnames';
import consoleImage from '../../assets/console.png';
import { BUTTONS, CONSOLE_SIZE, KEYS, SCREEN_RECT } from '../../config';
import type { ButtonId, Mode, Rect } from '../../config';
import { controls } from '../../controls';
import style from './Console.module.less';

const toPercent = ({ x, y, width, height }: Rect): CSSProperties => ({
  left: `${(x / CONSOLE_SIZE.width) * 100}%`,
  top: `${(y / CONSOLE_SIZE.height) * 100}%`,
  width: `${(width / CONSOLE_SIZE.width) * 100}%`,
  height: `${(height / CONSOLE_SIZE.height) * 100}%`,
});

const isMode = (id: ButtonId): id is Mode => id === 'gameA' || id === 'gameB' || id === 'time';

type Props = {
  children: ReactNode;
  onModeSelect: (mode: Mode) => void;
};

export const Console = ({ children, onModeSelect }: Props) => {
  const [pressed, setPressed] = useState<Partial<Record<ButtonId, boolean>>>({});

  const setButton = (id: ButtonId, isDown: boolean) => {
    setPressed((prev) => ({ ...prev, [id]: isDown }));
    if (!isDown) return;
    if (isMode(id)) onModeSelect(id);
    else controls.press(id);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const id = KEYS[event.code];
      if (!id) return;
      event.preventDefault();
      if (event.repeat) return;
      setButton(id, event.type === 'keydown');
    };
    // Если окно потеряло фокус с зажатой клавишей, keyup не придёт
    const releaseAll = () => setPressed({});
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    window.addEventListener('blur', releaseAll);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
      window.removeEventListener('blur', releaseAll);
    };
  }, [onModeSelect]);

  return (
    <div className={style.console} onContextMenu={(event) => event.preventDefault()}>
      <div className={style.screen} style={toPercent(SCREEN_RECT)}>
        {children}
      </div>
      <img className={style.body} src={consoleImage} alt="" draggable={false} />
      {BUTTONS.map(({ id, label, rect, round }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          className={cn(style.button, round && style.round, pressed[id] && style.pressed)}
          style={toPercent(rect)}
          onPointerDown={() => setButton(id, true)}
          onPointerUp={() => setButton(id, false)}
          onPointerLeave={() => pressed[id] && setButton(id, false)}
        />
      ))}
    </div>
  );
};
