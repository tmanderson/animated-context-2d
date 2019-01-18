# Animated Context 2D
Liven up your `CanvasRenderingContext2D` sketches with a little animation.

Animated Context 2D aims to implement the entirety of the CanvasRenderingContext2D
[API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

<img src="./images/example.gif" width="48%" alt="basic example" /><img src="./images/example-tree.gif" width="48%" alt="tree example" />

---

## Example
This example code is what is used in the above image. Notice it's nearly one-to-one
with the pre-existing `CanvasRenderingContext2D` API (only difference is the
specification of duration and easing function given to `beginPath`)

```js
const ctx = new AnimatedContext2D(canvas); // use this EXACTLY like `Context2D`, animations are FREE!

ctx.beginPath(500, "out.cubic"); // Note: the extra arguments
ctx.strokeStyle = 'red';
ctx.lineWidth = 2;
ctx.translate(100, 100);
ctx.rotate(Math.PI/4);
ctx.lineTo(canvas.width/2, canvas.height/2);
ctx.arc(50);
ctx.lineTo(canvas.width, 0);
ctx.stroke();
```

### API

### `class AnimatedContext2D(canvasElement, defaultEasing: EASE, FPS: number = 60)`

- `canvasElement` a `HTMLCanvasElement`
- `defaultEasing` the default easing function to use for all paths
- `FPS` frames-per-second. Defaults to 60

#### `AnimatedContext2D.beginPath(duration: number, easing: EASE)`

- `duration` in milliseconds.
- `easing` is any of [these](#easing-functions). Defaults to `AnimatedContext2D.defaultEasing`

The duration and easing are used for each path instruction. So the following

```js
// begin a new path, with 500ms animation durations using `in.quad` easing function
ctx.beginPath(500, "in.quad");
ctx.lineTo(10, 10);
ctx.rect(0, 0, 100, 100);
ctx.fill();
```

would take 500ms to complete and both the `lineTo` and `rect` would use `EASE.IN_QUAD`.

## [Easing functions](src/Easing.ts)
- [x] `LINEAR = ("linear")`
- [x] `IN_QUAD = ("in.quad")`
- [x] `OUT_QUAD = ("out.quad")`
- [x] `IN_CUBIC = ("in.cubic")`
- [x] `OUT_CUBIC = ("out.cubic")`
- [x] `IN_QUARTIC = ("in.quartic")`
- [x] `OUT_QUARTIC = ("out.quartic")`
- [x] `IN_SINE = ("in.sine")`
- [x] `OUT_SINE = ("out.sine")`
- [x] `IN_EXPO = ("in.expo")`
- [x] `OUT_EXPO = ("out.expo")`

## Animated Context2D Method Support
All Context2D methods are available on the `AnimatedContext` instance, so you
can use it just as you'd use `Context2D` itself. The methods listed below with
are those that support (or will support) animations.

- [x] `moveTo`
- [x] `fillStyle`
- [x] `lineStyle`
- [x] `lineTo`
- [x] `arc`
- [ ] `arcTo`
- [x] `lineWidth`
- [x] `lineCap`
- [x] `miterLimit`
- [ ] `transform`
- [x] `translate`
- [x] `rotate`
- [x] `skew`
- [x] `rect`
