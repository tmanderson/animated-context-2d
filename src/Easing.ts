const PI2 = Math.PI/2;

export enum EASE {
  LINEAR,
  IN_QUAD,
  OUT_QUAD,
  IN_CUBIC,
  OUT_CUBIC,
  IN_QUARTIC,
  OUT_QUARTIC,
  IN_SINE,
  OUT_SINE
}

export default {
  [EASE.LINEAR]: (t: number) => t,
  [EASE.IN_QUAD]: (t: number) => t * t,
  [EASE.OUT_QUAD]: (t: number) => 1 - Math.pow(1 - t, 2),
  [EASE.IN_CUBIC]: (t: number) => t * t * t,
  [EASE.OUT_CUBIC]: (t: number) => 1 - Math.pow(1 - t, 3),
  [EASE.IN_QUARTIC]: (t: number) => t * t * t * t,
  [EASE.OUT_QUARTIC]: (t: number) => 1 - Math.pow(1 - t, 4),
  [EASE.IN_SINE]: (t: number) => Math.sin(t * PI2),
  [EASE.OUT_SINE]: (t: number) => 1 - Math.sin((1 - t) * PI2)
}
