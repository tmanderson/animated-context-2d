const PI2 = Math.PI/2;

export enum EASE {
  LINEAR="linear",
  IN_QUAD="in.quad",
  OUT_QUAD="out.quad",
  IN_CUBIC="in.cubic",
  OUT_CUBIC="out.cubic",
  IN_QUARTIC="in.quartic",
  OUT_QUARTIC="out.quartic",
  IN_SINE="in.sine",
  OUT_SINE="out.sine",
  IN_EXPO="in.expo",
  OUT_EXPO="out.expo"
}

export default {
  [EASE.LINEAR]: (t: number) => t,
  [EASE.IN_QUAD]: (t: number) => t * t + 2 * t * (1 - t),
  [EASE.OUT_QUAD]: (t: number) => 1 - Math.pow(1 - t, 2),
  [EASE.IN_CUBIC]: (t: number) => t * t * t,
  [EASE.OUT_CUBIC]: (t: number) => 1 - Math.pow(1 - t, 3),
  [EASE.IN_QUARTIC]: (t: number) => t * t * t * t + (1 - t * t * t * t) * t,
  [EASE.OUT_QUARTIC]: (t: number) => 1 - Math.pow(1 - t, 4),
  [EASE.IN_SINE]: (t: number) => Math.sin(t * PI2),
  [EASE.OUT_SINE]: (t: number) => 1 - Math.sin((1 - t) * PI2),
  [EASE.IN_EXPO]: (t: number) => Math.pow(Math.E, 5 * (t - 1)),
  [EASE.OUT_EXPO]: (t: number) => 1 - Math.pow(Math.E, -5 * t)
}
