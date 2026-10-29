import { useEffect, useRef, useState } from 'react';
import { SCREEN_RECT } from '../../config';
import { controls } from '../../controls';
import type { Game } from '../../games/types';
import style from './GameShell.module.less';

type Phase = 'start' | 'play' | 'over';

// Холст крупнее экрана, чтобы уменьшенные спрайты оставались чёткими
const SCALE = 3;
// После проигрыша зажатая стрелка не должна сразу перезапустить игру
const RESTART_DELAY = 600;

// Сохраняет результат, если это рекорд, и возвращает текущий рекорд
const saveRecord = (key: string, score: number) => {
  try {
    const record = Number(localStorage.getItem(key)) || 0;
    if (score <= record) return record;
    localStorage.setItem(key, String(score));
  } catch {}
  return score;
};

type Props = {
  title: string;
  hint: string;
  recordKey: string;
  createGame: () => Game;
};

export const GameShell = ({ title, hint, recordKey, createGame }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialGame] = useState(createGame);
  const gameRef = useRef(initialGame);
  const [phase, setPhase] = useState<Phase>('start');
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(() => saveRecord(recordKey, 0));
  const phaseRef = useRef(phase);
  const overAtRef = useRef(0);
  phaseRef.current = phase;

  const start = () => {
    gameRef.current = createGame();
    setScore(0);
    setPhase('play');
  };

  useEffect(
    () =>
      controls.subscribe(() => {
        const canRestart = performance.now() - overAtRef.current > RESTART_DELAY;
        if (phaseRef.current === 'start' || (phaseRef.current === 'over' && canRestart)) start();
      }),
    [],
  );

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const game = gameRef.current;
      if (phaseRef.current === 'play') {
        game.update(dt);
        setScore(game.score);
        if (game.isOver) {
          phaseRef.current = 'over';
          overAtRef.current = now;
          setRecord(saveRecord(recordKey, game.score));
          setPhase('over');
        }
      }
      game.draw(ctx);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      // Ушли на другой экран посреди игры — результат всё равно засчитывается в рекорд
      if (phaseRef.current === 'play') saveRecord(recordKey, gameRef.current.score);
    };
  }, []);

  return (
    <div className={style.shell}>
      <canvas
        ref={canvasRef}
        className={style.canvas}
        width={SCREEN_RECT.width * SCALE}
        height={SCREEN_RECT.height * SCALE}
      />
      {phase === 'play' && <div className={style.score}>{score}</div>}
      {phase === 'start' && (
        <div className={style.overlay}>
          <div className={style.title}>{title}</div>
          <div className={style.hint}>{hint}</div>
          <div>Рекорд: {record}</div>
          <button type="button" className={style.prompt} onClick={start}>
            Нажми любую стрелочку
          </button>
        </div>
      )}
      {phase === 'over' && (
        <div className={style.overlay}>
          <div className={style.title}>Игра окончена</div>
          <div>Счёт: {score}</div>
          <div>Рекорд: {record}</div>
          <button type="button" className={style.prompt} onClick={start}>
            Заново
          </button>
        </div>
      )}
    </div>
  );
};
