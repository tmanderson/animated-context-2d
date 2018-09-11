export enum Context2DLineCap {
  Butt = "butt",
  Round = "round",
  Square = "square",
}

export enum Context2DLineJoin {
  Bevel = "bevel",
  Round = "round",
  Miter = "miter",
}

interface IPathAttributes {
  fill?: boolean
  stroke?: boolean
  radius?: number
  fillStyle: string
  strokeStyle: string
  lineWidth: number
  miterLimit: number
  lineCap: Context2DLineCap
  lineJoin: Context2DLineJoin
}

export class PathAttributes implements IPathAttributes {
  fill?: boolean;
  stroke?: boolean;
  radius?: number;
  fillStyle: string = 'rgba(255, 255, 255, 1)';
  strokeStyle: string = 'rgba(0, 0, 0, 1)';
  lineWidth: number = 1;
  miterLimit: number = 10;
  lineCap: Context2DLineCap = Context2DLineCap.Butt;
  lineJoin: Context2DLineJoin = Context2DLineJoin.Miter;

  constructor(attributes?: IPathAttributes) {
    Object.assign(this, attributes || {});
  }

  clone(): PathAttributes {
    return new PathAttributes({
      fill: this.fill,
      stroke: this.stroke,
      radius: this.radius,
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      miterLimit: this.miterLimit,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin
    });
  }
}
