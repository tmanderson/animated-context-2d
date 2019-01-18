import EASINGS, {EASE} from '../src/Easing';

/**
  [EASE.LINEAR]: (t: number) => t,
  [EASE.IN_QUAD]: (t: number) => t * t,
  [EASE.OUT_QUAD]: (t: number) => 1 - Math.pow(1 - t, 2),
  [EASE.IN_CUBIC]: (t: number) => t * t * t,
  [EASE.OUT_CUBIC]: (t: number) => 1 - Math.pow(1 - t, 3),
  [EASE.IN_QUARTIC]: (t: number) => t * t * t * t,
  [EASE.OUT_QUARTIC]: (t: number) => 1 - Math.pow(1 - t, 4),
  [EASE.IN_SINE]: (t: number) => Math.sin(t * PI2),
  [EASE.OUT_SINE]: (t: number) => 1 - Math.sin((1 - t) * PI2),
  [EASE.IN_EXPO]: (t: number) => Math.pow(Math.E, 5 * (t - 1)),
  [EASE.OUT_EXPO]: (t: number) => 1 - Math.pow(Math.E, -5 * t)
 */


describe('EASING', () => {
  test('linear', () => {
    const easingFn = EASINGS[EASE.LINEAR];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('quad.in', () => {
    const easingFn = EASINGS[EASE.IN_QUAD];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('quad.out', () => {
    const easingFn = EASINGS[EASE.OUT_QUAD];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('cubic.in', () => {
    const easingFn = EASINGS[EASE.IN_CUBIC];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('cubic.out', () => {
    const easingFn = EASINGS[EASE.OUT_CUBIC];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('quartic.in', () => {
    const easingFn = EASINGS[EASE.IN_QUARTIC];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('quartic.out', () => {
    const easingFn = EASINGS[EASE.OUT_QUARTIC];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('sine.in', () => {
    const easingFn = EASINGS[EASE.IN_SINE];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('sine.out', () => {
    const easingFn = EASINGS[EASE.OUT_SINE];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('expo.in', () => {
    const easingFn = EASINGS[EASE.IN_EXPO];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })

  test('expo.out', () => {
    const easingFn = EASINGS[EASE.OUT_EXPO];
    const range = new Array(10).fill(0).map((_, i) => easingFn(i / 9));
    const min = Math.min(...range);
    const max = Math.max(...range);
    expect(min).toBeLessThanOrEqual(0.01);
    expect(min).toBeGreaterThanOrEqual(-0.01);
    expect(max).toBeGreaterThanOrEqual(0.99);
    expect(max).toBeLessThanOrEqual(1.0);
  })
})