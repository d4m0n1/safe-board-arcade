export type Game = {
  score: number;
  isOver: boolean;
  update: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
};
