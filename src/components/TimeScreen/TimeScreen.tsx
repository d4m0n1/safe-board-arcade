import { useEffect, useState } from 'react';
import sky from '../../assets/sky.jpg';
import wave from '../../assets/wave-line.png';
import style from './TimeScreen.module.less';

const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);

export const TimeScreen = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={style.screen} style={{ backgroundImage: `url(${sky})` }}>
      <div className={style.title}>SAFE BOARD</div>
      <div className={style.time}>
        {pad(now.getHours())}
        <span className={now.getSeconds() % 2 ? style.hidden : undefined}>:</span>
        {pad(now.getMinutes())}
      </div>
      <div className={style.wave} style={{ backgroundImage: `url(${wave})` }} />
    </div>
  );
};
