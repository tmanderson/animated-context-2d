import ease, { EASE } from './Easing';
import AnimatedContext2D from './AnimatedContext';
import PathInstruction from './PathInstruction';

interface PathAttributes {
  fill?: boolean;
  fillStyle?: string;
  stroke?: boolean;
  strokeStyle?: string;
  size?: number;
  radius?: number;
}

const interpolate = (frames: number, easing: EASE, getPoint: Function): [number, number][] =>
  new Array(frames).fill(0).reduce((points, v, i) => points.concat([getPoint(ease[easing](i / (frames - 1)), i, points)]), []);

export default class AnimatedPath2D {
  defaultAttributes: PathAttributes;
  animate: boolean = true;

  ctx: AnimatedContext2D;

  origin: [number, number] = [0, 0];
  position: [number, number] = [0, 0];

  duration: number;
  easing: EASE;

  progress: number;
  instructions: PathInstruction[];
  complete: boolean = false;

  set fillStyle(color:string) {
    this.defaultAttributes.fillStyle = color;
  }

  get fillStyle(): string {
    return this.defaultAttributes.fillStyle;
  }

  set strokeStyle(color:string) {
    this.defaultAttributes.strokeStyle = color;
  }

  get strokeStyle(): string {
    return this.defaultAttributes.strokeStyle;
  }

  constructor(duration: number, easing: EASE, context: AnimatedContext2D) {
    this.ctx = context;
    this.defaultAttributes = { fillStyle: this.ctx.fillStyle, strokeStyle: this.ctx.strokeStyle };
    this.duration = duration;
    this.progress = 0;
    this.easing = easing;
    this.instructions = [];
  }

  moveTo(x: number, y: number) {
    this.instructions.push(
      new PathInstruction('moveTo', [[x, y]])
    );
    this.position = [ x, y ];
    return this;
  }

  lineTo(x: number, y: number, duration: number = this.duration) {
    const frames = Math.round(duration * this.ctx.fpms);
    this.instructions.push(
      new PathInstruction(
        'lineTo',
        interpolate(frames, this.easing, (t, i) => [
          // Easing position offset as well, this allows `lineTo` commands
          // to execute relative to the current canvas position
          this.position[0] - this.position[0] * t + x * t,
          this.position[1] - this.position[1] * t + y * t,
        ]),
        { ...this.defaultAttributes }
      )
    );

    this.position = [ x, y ];

    return this;
  }

  arcTo(x1:number, y1:number, x2: number, y2: number, r: number) {
    // const frames = Math.round(duration * this.ctx.fpms);
    // TODO
    return this;
  }

  arc(r: number, a1: number = 0, a2: number = 2 * Math.PI, duration: number = this.duration) {
    const frames = Math.round(duration * this.ctx.fpms);

    this.instructions.push(
      new PathInstruction(
        'arc',
        interpolate(frames, this.easing, (t, i, points) => [
          // After first angle, the remaining just use the previous angle's extent
          i ? points[i - 1][1] : a1,
          (a2 - a1) * t
        ]),
        { radius: r }
      )
    );

    return this;
  }

  stroke() {
    const currentInstruction = this.instructions[this.instructions.length - 1];

    if (currentInstruction) {
      currentInstruction.attributes.stroke = true;
      currentInstruction.attributes.strokeStyle = this.strokeStyle;
    } else {
      this.defaultAttributes.stroke = true;
      this.defaultAttributes.strokeStyle = this.strokeStyle;
    }
  }

  fill() {
    const currentInstruction = this.instructions[this.instructions.length - 1];

    if (currentInstruction) {
      currentInstruction.attributes.fill = true;
      currentInstruction.attributes.fillStyle = this.fillStyle;
    } else {
      this.defaultAttributes.fill = true;
      this.defaultAttributes.fillStyle = this.fillStyle;
    }
  }

  executeInstruction(ctx: CanvasRenderingContext2D, instruction: PathInstruction) {
    instruction.points.forEach((point, i, points) => {
      if (i === 0) ctx.beginPath();

      switch(instruction.method) {
        case 'moveTo':
          ctx.moveTo(...point);
          this.position = point;
        break;
        case 'lineTo':
          ctx.lineTo(...point);
          this.position = point;
        break;
        case 'arc':
          ctx.arc(
            this.position[0],
            this.position[1],
            instruction.attributes.radius,
            ...point
          );
      }
      // If we're on the last `point` in the instruction, check for stroke and fill
      // attributes
      if (i === points.length - 1) {
        if (instruction.attributes.fill) {
          ctx.fillStyle = instruction.attributes.fillStyle;
          ctx.fill();
        }

        if (instruction.attributes.stroke) {
          ctx.strokeStyle = instruction.attributes.strokeStyle;
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
  }
}
