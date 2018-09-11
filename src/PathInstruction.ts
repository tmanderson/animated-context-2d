interface PathAttributes {
  fill?: boolean;
  fillStyle?: string;
  stroke?: boolean;
  strokeStyle?: string;
  size?: number;
  radius?: number;
}

export default class PathInstruction {
  static instances: number = 0;

  private id:number = 0;
  private i: number = 0;
  private _points: [number, number][];

  attributes: PathAttributes;
  method: string;

  get progress() {
    return this.i / this._points.length;
  }

  get points() {
    const points = this._points.slice(0, this.i + 1);
    this.next();
    return points;
  }

  constructor(method: string, points: [number, number][], attributes?: PathAttributes) {
    this.id = ++PathInstruction.instances;
    this.method = method;
    this._points = points;
    this.attributes = attributes || {};
  }

  next() {
    this.i = Math.min(this._points.length, this.i + 1);
  }

  point() {
    return this._points[this.i];
  }
}
