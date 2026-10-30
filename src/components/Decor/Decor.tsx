import bear from '../../assets/decor/bear.png';
import bubble1 from '../../assets/decor/bubble1.png';
import bubble3 from '../../assets/decor/bubble3.png';
import bubble7 from '../../assets/decor/bubble7.png';
import star from '../../assets/decor/star.png';
import treasure from '../../assets/decor/treasure.png';
import style from './Decor.module.less';

const ITEMS = [
  { src: bear, className: style.bear },
  { src: treasure, className: style.chest },
  { src: star, className: style.starLeft },
  { src: star, className: style.starRight },
  { src: bubble1, className: style.bubbleLeft },
  { src: bubble3, className: style.bubbleRight },
  { src: bubble7, className: style.bubbleTop },
];

// Украшения вокруг приставки. Позиции в процентах от её размера, поэтому масштабируются вместе с ней
export const Decor = () => (
  <>
    {ITEMS.map(({ src, className }) => (
      <img key={className} className={className} src={src} alt="" draggable={false} />
    ))}
  </>
);
