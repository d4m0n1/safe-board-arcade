import bearShip from '../assets/bear-ship.png';
import chest from '../assets/chest.png';
import jumpGuy from '../assets/jump-guy.png';
import log from '../assets/log.png';
import pier from '../assets/pier.png';
import readyGuy from '../assets/ready-guy.png';
import runGuy from '../assets/run-guy.png';
import sky from '../assets/sky.jpg';
import wave from '../assets/wave-line.png';
import { SCREEN_RECT } from '../config';
import type { Rect } from '../config';

const load = (src: string) => {
  const image = new Image();
  image.src = src;
  return image;
};

export const sprites = {
  ship: load(bearShip),
  chest: load(chest),
  log: load(log),
  pier: load(pier),
  sky: load(sky),
  wave: load(wave),
  manRun: load(runGuy),
  manReady: load(readyGuy),
  manJump: load(jumpGuy),
};

export const drawSprite = (ctx: CanvasRenderingContext2D, image: HTMLImageElement, rect: Rect, flip = false) => {
  if (!image.complete) return;
  const { x, y } = rect;
  if (!flip) {
    ctx.drawImage(image, x, y, rect.width, rect.height);
    return;
  }
  ctx.save();
  ctx.translate(x + rect.width, y);
  ctx.scale(-1, 1);
  ctx.drawImage(image, 0, 0, rect.width, rect.height);
  ctx.restore();
};

export const drawSky = (ctx: CanvasRenderingContext2D) =>
  drawSprite(ctx, sprites.sky, { x: 0, y: 0, width: SCREEN_RECT.width, height: SCREEN_RECT.height });

// Полоса из повторяющейся картинки волны, сдвинутая влево на offset
export const drawWaves = (ctx: CanvasRenderingContext2D, top: number, height: number, offset: number) => {
  const { wave: image } = sprites;
  if (!image.complete) return;
  const width = Math.ceil((height * image.width) / image.height);
  for (let x = -(offset % width); x < SCREEN_RECT.width; x += width) {
    drawSprite(ctx, image, { x, y: top, width, height });
  }
};
