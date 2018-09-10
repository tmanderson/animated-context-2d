import { EASE } from './Easing';
import AnimatedPath2D from './AnimatedPath';

export default class AnimatedContext2D {
  static EASE: Object = EASE;

  time: number = 0;
  frame: number = 0;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  paths: AnimatedPath2D[];

  defaultEasing: EASE;
  fps: number;
  frequency: number;
  running: boolean = false;

  constructor(canvas: HTMLCanvasElement, FPS: number = 60, defaultEasing: EASE = EASE.LINEAR) {
    this.canvas = canvas;
    this.paths = [];
    this.ctx = canvas.getContext('2d');
    this.fps = FPS;
    this.defaultEasing = defaultEasing;
    this.frequency = 1000 / this.fps;
  }

  path(duration: number, easing: EASE = this.defaultEasing) {
    const path = new AnimatedPath2D(duration, easing, this);
    this.paths.push(path);
    return path;
  }

  start() {
    this.running = true;
    window.requestAnimationFrame(this.tick);
  }

  tick = (ts) => {
    if (!this.running) return;
    if (ts - this.time < this.frequency)
      return window.requestAnimationFrame(this.tick);
    
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    this.paths.forEach(path => {
      path.render(this.ctx, this.frame, this.time);
    });

    window.requestAnimationFrame(this.tick);

    this.time = ts;
    this.frame += 1;
  }

  stop() {
    this.running = false;
  }
}