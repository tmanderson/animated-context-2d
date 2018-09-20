export default class TransformMatrix {
    _skew: [number, number] = [0, 0];
    _rotation: number = 0;
    _scale: [number, number] = [1, 1];
    _translation: [number, number] = [0, 0];

    rows: [number, number, number][];

    constructor() {
      this.reset();
    }
  
    reset() {
      this._skew = [0, 0];
      this._rotation = 0;
      this._scale = [1, 1];

      this.rows = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
      ];
    }
  
    scale(x=1, y=x) {
      this._scale = [x, y];
      this.update();
    }
  
    skew(x=0, y=0) {
      this._skew = [x, y];
      this.update();
    }
  
    translate(x=0, y=0) {
      this.rows[2][0] = x;
      this.rows[2][1] = y;
    }
  
    rotate(t=0) {
      this._rotation = t;
      this.update();
    }
  
    update() {
      const x = this._scale[0], y = this._scale[1];
      const c = Math.cos(this._rotation), s = Math.sin(this._rotation);
  
      this.rows[0][0] = x * c;
      this.rows[0][1] = y * (Math.tan(this._skew[1]) - s);

      this.rows[1][0] = x * (Math.tan(this._skew[0]) + s);
      this.rows[1][1] = y * c;
    }
  
    args(): [number, number, number, number, number, number] {
      return [
        this.rows[0][0], this.rows[0][1],
        this.rows[1][0], this.rows[1][1],
        this.rows[2][0], this.rows[2][1]
      ];
    }
  }