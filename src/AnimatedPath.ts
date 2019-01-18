import { PathAttributes, Context2DLineCap, Context2DLineJoin } from './constants';
import ease, { EASE } from './Easing';
import TransformMatrix from './TransformMatrix';
import AnimatedContext2D from './AnimatedContext';
import PathInstruction from './PathInstruction';

const interpolate = (frames: number, easing: EASE, getPoint: Function): [number, number][] =>
  new Array(frames).fill(0).reduce((points, v, i) =>
    points.concat([getPoint(ease[easing](i / (Math.max(2, frames) - 1)), i, points)]),
    []
  );

export default class AnimatedPath2D {
  attributes: PathAttributes;
  animate: boolean = true;
  transform: TransformMatrix;

  ctx: AnimatedContext2D;

  origin: [number, number] = [0, 0];
  position: [number, number] = [0, 0];

  duration: number;
  easing: EASE;

  progress: number;
  transforms: PathInstruction[];
  instructions: PathInstruction[];
  complete: boolean = false;

  set fillStyle(color:string) {
    this.attributes.fillStyle = color;
  }

  get fillStyle(): string {
    return this.attributes.fillStyle;
  }

  set strokeStyle(color:string) {
    this.attributes.strokeStyle = color;
  }

  get strokeStyle(): string {
    return this.attributes.strokeStyle;
  }

  set lineWidth(width: number) {
    this.attributes.lineWidth = width;
  }

  get lineWidth(): number {
    return this.attributes.lineWidth;
  }

  set lineCap(cap: Context2DLineCap) {
    this.attributes.lineCap = cap;
  }

  get lineCap(): Context2DLineCap {
    return this.attributes.lineCap;
  }

  set lineJoin(join: Context2DLineJoin) {
    this.attributes.lineJoin = join;
  }

  get lineJoin(): Context2DLineJoin {
    return this.attributes.lineJoin;
  }

  set miterLimit(limit: number) {
    this.attributes.miterLimit = limit;
  }

  get miterLimit(): number {
    return this.attributes.miterLimit;
  }

  constructor(duration: number, easing: EASE, context: AnimatedContext2D) {
    this.ctx = context;
    this.duration = duration;
    this.transform = new TransformMatrix();
    this.progress = 0;
    this.easing = easing;
    this.instructions = [];
    this.transforms = [];
    this.attributes = context.attributes.clone();
  }

  moveTo(x: number, y: number) {
    this.instructions.push(
      new PathInstruction('moveTo', [[x, y]], this.attributes.clone())
    );

    this.position = [ x, y ];

    return this;
  }

  translate(x: number, y: number, duration: number = this.duration) {
    const frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(
      new PathInstruction(
        'translate',
        interpolate(frames, this.easing, (t, i) => [
          // Easing position offset as well, this allows `lineTo` commands
          // to execute relative to the current canvas position
          this.position[0] - this.position[0] * t + x * t,
          this.position[1] - this.position[1] * t + y * t,
        ]),
        this.attributes.clone()
      )
    );

    return this;
  }

  scale(x: number, y: number, duration: number = this.duration) {
    const frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(
      new PathInstruction(
        'skew',
        interpolate(frames, this.easing, (t, i) => [
          // Easing position offset as well, this allows `lineTo` commands
          // to execute relative to the current canvas position
          x * t,
          y * t,
        ]),
        this.attributes.clone()
      )
    );

    return this;
  }

  skew(x: number, y: number, duration: number = this.duration) {
    const frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(
      new PathInstruction(
        'skew',
        interpolate(frames, this.easing, (t, i) => [
          x * t,
          y * t,
        ]),
        this.attributes.clone()
      )
    );

    return this;
  }

  rotate(a: number, duration: number = this.duration) {
    const frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(
      new PathInstruction(
        'rotate',
        interpolate(frames, this.easing, (t, i) => [
          a * t
        ]),
        this.attributes.clone()
      )
    );

    return this;
  }

  lineTo(x: number, y: number, duration: number = this.duration) {
    const frames = Math.ceil(duration * this.ctx.fpms);
    this.instructions.push(
      new PathInstruction(
        'lineTo',
        interpolate(frames, this.easing, (t, i) => [
          // Easing position offset as well, this allows `lineTo` commands
          // to execute relative to the current canvas position
          this.position[0] - this.position[0] * t + x * t,
          this.position[1] - this.position[1] * t + y * t,
        ]),
        this.attributes.clone()
      )
    );

    this.position = [ x, y ];

    return this;
  }

  rect(x: number, y: number, w: number, h:number, duration: number = this.duration) {
    const frames = Math.ceil(duration * this.ctx.fpms);
    this.instructions.push(
      new PathInstruction(
        'rect',
        interpolate(frames, this.easing, (t, i) => [
          x + (w * (1 - t))/2,
          y + (h * (1 - t))/2,
          w * t,
          h * t
        ]),
        this.attributes.clone()
      )
    );

    this.position = [ x - w/2, y - h/2 ];

    return this;
  }

  arcTo(x1:number, y1:number, x2: number, y2: number, r: number) {
    // const frames = Math.ceil(duration * this.ctx.fpms);
    // TODO
    return this;
  }

  arc(r: number, a1: number = 0, a2: number = 2 * Math.PI, anticlockwise: boolean = false, duration: number = this.duration) {
    const frames = Math.ceil(duration * this.ctx.fpms);
    const attributes = this.attributes.clone();

    attributes.radius = r;
    attributes.anticlockwise = anticlockwise;

    this.instructions.push(
      new PathInstruction(
        'arc',
        interpolate(frames, this.easing, (t, i, points) => {
          const p1 = anticlockwise ? a2 : a1;
          const p2 = anticlockwise ? a1 : a2;
          return [
            i ? points[i - 1][1] : p1,
            p1 + (p2 - p1) * t
          ]
        }),
        attributes
      )
    );
    return this;
  }

  stroke() {
    this.attributes.stroke = true;
    this.attributes.strokeStyle = this.strokeStyle;
    return this;
  }

  fill() {
    this.attributes.fill = true;
    this.attributes.fillStyle = this.fillStyle;
    return this;
  }

  executeInstruction(ctx: CanvasRenderingContext2D, instruction: PathInstruction) {
    instruction.points.forEach((point, i, points) => {
      if (i === 0) ctx.beginPath();

      switch(instruction.method) {
        case 'translate': return this.transform.translate(point[0], point[1]);
        case 'scale': return this.transform.scale(point[0], point[1]);
        case 'skew': return this.transform.skew(point[0], point[1]);
        case 'rotate': return this.transform.rotate(point[0]);
        case 'moveTo':
          ctx.moveTo(point[0], point[1]);
          this.position = [point[0], point[1]];
        break;
        case 'rect':
          if (i === points.length - 1) ctx.rect(...point);
        break;
        case 'lineTo':
          ctx.lineTo(point[0], point[1]);
          this.position = [point[0], point[1]];
        break;
        case 'arc':
          ctx.arc(
            this.position[0],
            this.position[1],
            instruction.attributes.radius,
            point[0],
            point[1],
            instruction.attributes.anticlockwise
          );
      }
      // If we're on the last `point` in the instruction, check for stroke and fill
      // attributes
      if (i === points.length - 1) {
        if (this.attributes.fill) {
          ctx.fillStyle = this.attributes.fillStyle;
          ctx.fill();
        }

        if (this.attributes.stroke) {
          ctx.strokeStyle = this.attributes.strokeStyle;
          ctx.lineWidth = this.attributes.lineWidth;
          ctx.lineCap = this.attributes.lineCap;
          ctx.lineJoin = this.attributes.lineJoin;
          ctx.stroke();
        }
      }
    });
  }

  /**
   * Renders this path at the given `frame` (relative to total internal frames)
   *
   * @param ctx The Canvas context that this path is rendering to
   * @param frame The frame number relative to this path's frames (ie. every frame for each animated instruction)
   * @param time The current global time of the parent canvas
   */
  render(ctx: CanvasRenderingContext2D, frame: number, time: number) {
    ctx.fillStyle = this.ctx.fillStyle;
    ctx.strokeStyle = this.ctx.strokeStyle;
    this.position = this.origin;
    // Transformations on path run first (as they affect all paths within)
    this.transforms.forEach((inst, i) => {
      this.executeInstruction(ctx, inst);
    });

    // First draw ALL paths that have completed...
    this.instructions.slice(0, this.progress).forEach((inst, i) => {
      ctx.beginPath();
      this.executeInstruction(ctx, inst);
    });

    if (this.complete || this.progress >= this.instructions.length) {
      this.complete = true;
      return this;
    }
    // Then execute the active instruction
    ctx.beginPath();
    this.executeInstruction(ctx, this.instructions[this.progress]);

    if (this.instructions[this.progress].progress >= 1) this.progress += 1;
    return this;
  }

  reset() {
    this.progress = 0;
    this.instructions.forEach(instruction => instruction.reset());
  }
}
