import ease, { EASE } from './Easing';
import AnimatedContext2D from './AnimatedContext';

const MAX_STEP = 0.3;

interface Path2DInstruction {
  animate: boolean;
  points: [number, number][];
  method: string;

  additionalArgs?: [number];

  progress?: number;
  stroke?: boolean;
  fill?: boolean;
  arc?: boolean;
}

const interpolate = (frames: number, easing: EASE, getPoint: Function): [number, number][] =>
  new Array(frames).fill(0).map((v, i, points) => getPoint(ease[easing](i/ frames), i, points));

export default class AnimatedPath2D {
  animate: boolean = true;
  ctx: AnimatedContext2D;

  origin: [number, number] = [0, 0];
  position: [number, number] = [0, 0];

  duration: number;
  easing: EASE;

  progress: number;
  instructions: Path2DInstruction[];
  complete: boolean = false;

  constructor(duration: number, easing: EASE, context: AnimatedContext2D) {
    this.ctx = context;
    this.duration = duration;
    this.progress = 0;
    this.easing = easing;
    this.instructions = [];
  }

  moveTo(x: number, y: number) {
    this.instructions.push({
      points: [[x, y]],
      animate: this.animate,
      method: 'moveTo'
    });

    return this;
  }

  lineTo(x: number, y: number, duration: number = this.duration) {
    const frames = Math.floor(duration / this.ctx.frequency);

    this.instructions.push({
      points: [
        this.origin,
        ...interpolate(frames, this.easing, (t, i) => [
          x * t,
          y * t,
        ])
      ],
      animate: this.animate,
      stroke: true,
      method: 'lineTo'
    });

    return this;
  }

  arc(r: number, a1: number = 0, a2: number = 2 * Math.PI, duration: number = this.duration) {
    const frames = 2 * Math.floor(duration / this.ctx.frequency);

    this.instructions.push({
      points: interpolate(frames, this.easing, t => [
        r * Math.cos((a2 - a1) * t),
        r * Math.sin((a2 - a1) * t)
      ]),
      additionalArgs: [r],
      animate: this.animate,
      stroke: true,
      method: 'lineTo'
    });

    return this;
  }
  /**
   * Renders this path at the given `frame` (relative to total internal frames)
   *
   * @param ctx The Canvas context that this path is rendering to
   * @param frame The frame number relative to this path's frames (ie. every frame for each animated instruction)
   * @param time The current global time of the parent canvas
   */
  render(ctx: CanvasRenderingContext2D, frame: number, time: number) {
    this.position = this.origin;

    // First draw ALL paths that have completed...
    this.instructions.slice(0, this.progress).forEach(inst => {
      ctx.beginPath();
      let prevPoint: [number, number] = [
        this.position[0] + inst.points[0][0],
        this.position[1] + inst.points[0][1]
      ];

      inst.points.slice(1).forEach(nextPoint => {
        ctx[inst.method](...prevPoint.concat(nextPoint), ...inst.additionalArgs);

        prevPoint = [
          this.position[0] + nextPoint[0],
          this.position[1] + nextPoint[1]
        ];
      });

      if (inst.method === 'moveTo') this.position = prevPoint;
      else ctx.stroke();
    });

    if (this.complete || this.progress >= this.instructions.length) {
      this.complete = true;
      ctx.stroke();
      return this;
    }

    ctx.beginPath();

    const currentInstruction = this.instructions[this.progress];
    if (!currentInstruction.progress) currentInstruction.progress = 1;

    let prevPoint: [number, number] = [ this.position[0], this.position[1] ];

    currentInstruction.points.slice(0, currentInstruction.progress + 1)
      .forEach((point, i, instructions) => {
        const nextPoint = [ this.position[0] + point[0], this.position[1] + point[1] ];
        ctx[currentInstruction.method](...prevPoint.concat(nextPoint), ...currentInstruction.additionalArgs);
        prevPoint = nextPoint;
      });

    if (currentInstruction.method === 'moveTo') this.position = prevPoint;
    else ctx.stroke();

    currentInstruction.progress += 1;

    if (currentInstruction.progress >= currentInstruction.points.length)
      this.progress += 1;
  }

  reset() {
    this.progress = 0;
  }
}
