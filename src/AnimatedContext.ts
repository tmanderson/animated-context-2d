import { PathAttributes, Context2DLineCap, Context2DLineJoin } from './constants';
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
  attributes: PathAttributes;

  set fillStyle(color:string) {
    if (this.currentPath) this.currentPath.fillStyle = color;
    else this.attributes.fillStyle = color;
  }

  get fillStyle():string {
    return this.attributes.fillStyle;
  }

  set strokeStyle(color:string) {
    if (this.currentPath) this.currentPath.strokeStyle = color;
    this.attributes.strokeStyle = color;
  }

  get strokeStyle():string {
    return this.attributes.strokeStyle;
  }

  set lineWidth(width: number) {
    if (this.currentPath) this.currentPath.lineWidth = width;
    this.attributes.lineWidth = width;
  }

  get lineWidth(): number {
    return this.attributes.lineWidth;
  }

  set lineCap(cap: Context2DLineCap) {
    if (this.currentPath) this.currentPath.lineCap = cap;
    this.attributes.lineCap = cap;
  }

  get lineCap(): Context2DLineCap {
    return this.attributes.lineCap;
  }

  set lineJoin(join: Context2DLineJoin) {
    if (this.currentPath) this.currentPath.lineJoin = join;
    this.attributes.lineJoin = join;
  }

  get lineJoin(): Context2DLineJoin {
    return this.attributes.lineJoin;
  }

  set miterLimit(limit: number) {
    if (this.currentPath) this.currentPath.miterLimit = limit;
    this.attributes.miterLimit = limit;
  }

  get miterLimit(): number {
    return this.attributes.miterLimit;
  }

  constructor(canvas: HTMLCanvasElement, defaultEasing: EASE = EASE.LINEAR, FPS: number = 60) {
    this.attributes = new PathAttributes();
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
    this.currentPath.arc(...args);
  }

  arcTo(...args:[number, number, number, number, number]) {
    this.currentPath.arcTo(...args);
  }

  lineTo(...args:[number, number]) {
    this.currentPath.lineTo(...args);
  }

  moveTo(...args:[number, number]) {
    this.currentPath.moveTo(...args);
  }

  stroke() {
    this.currentPath.stroke().reset();
  }

  fill() {
    this.currentPath.fill().reset();
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
