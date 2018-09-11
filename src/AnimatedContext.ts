import { EASE } from './Easing';
import AnimatedPath2D from './AnimatedPath';

/**
 * @class AnimatedContext2D
 */
export default class AnimatedContext2D {
  static EASE: Object = EASE;
  static AnimatedPath2D = AnimatedPath2D;

  frame: number = 0;
  time: number = 0;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  paths: AnimatedPath2D[];

  defaultEasing: EASE = EASE.LINEAR;
  defaultDuration: number = 500;
  /**
   * Target frames-per-second for this context
   * @type {number}
   */
  fps: number;
  /**
   * Target frames-per-millisecond
   * @type {number}
   */
  fpms: number;
  /**
   * Is the render loop running
   * @type {boolean}
   */
  running: boolean = false;
  /**
   * The current path being drawn
   * @type {AnimatedPath2D}
   */
  currentPath: AnimatedPath2D;

  _strokeStyle: string = 'rgba(0, 0, 0, 1)';
  _fillStyle: string = 'rgba(255, 255, 255, 1)';

  set fillStyle(color:string) {
    if (this.currentPath) this.currentPath.fillStyle = color;
    else this._fillStyle = color;
  }

  get fillStyle():string {
    return this._fillStyle;
  }

  set strokeStyle(color:string) {
    if (this.currentPath) this.currentPath.strokeStyle = color;
    else this._strokeStyle = color;
  }

  get strokeStyle():string {
    return this._strokeStyle;
  }

  constructor(canvas: HTMLCanvasElement, FPS: number = 60, defaultEasing: EASE = EASE.LINEAR) {
    this.canvas = canvas;
    this.paths = [];
    this.ctx = canvas.getContext('2d');
    this.fps = FPS;
    this.defaultEasing = defaultEasing;
    this.fpms = this.fps / 1000;
    this.start();
  }

  beginPath(duration:number = this.defaultDuration, easing: EASE = this.defaultEasing) {
    this.currentPath = new AnimatedPath2D(duration, easing, this);
    this.paths.push(this.currentPath);
  }

  arc(...args:[number, number, number, number]) {
    this.currentPath.arc(...args); // tslint:disable-line
  }

  arcTo(...args:[number, number, number, number, number]) {
    this.currentPath.arcTo(...args); // tslint:disable-line
  }

  lineTo(...args:[number, number]) {
    this.currentPath.lineTo(...args); // tslint:disable-line
  }

  moveTo(...args:[number, number]) {
    this.currentPath.moveTo(...args); // tslint:disable-line
  }

  stroke() {
    this.currentPath.stroke();
  }

  fill() {
    this.currentPath.fill();
  }

  start() {
    this.running = true;
    window.requestAnimationFrame(this.tick);
  }

  tick = (ts) => {
    if (!this.running) return;
    if (ts - this.time < this.fpms)
      return window.requestAnimationFrame(this.tick);

    this.ctx.fillStyle = this.fillStyle;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

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
