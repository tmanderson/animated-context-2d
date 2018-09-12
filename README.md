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
const ctx = new AnimatedContext2D(canvas);

ctx.beginPath(500, AnimatedContext2D.EASE.OUT_CUBIC); // Note: the extra arguments
ctx.strokeStyle = 'red';
ctx.lineWidth = 2;
ctx.lineTo(canvas.width/2, canvas.height/2);
ctx.arc(50);
ctx.lineTo(canvas.width, 0);
ctx.stroke();

ctx.beginPath(2000, AnimatedContext2D.EASE.OUT_QUARTIC); // Note: the extra arguments
ctx.strokeStyle = 'green';
ctx.lineWidth = 10;
ctx.moveTo(canvas.width, canvas.height);
ctx.lineTo(canvas.width/2, canvas.height/2);
ctx.stroke();

ctx.beginPath(1000, AnimatedContext2D.EASE.IN_QUARTIC); // Note: the extra arguments
ctx.strokeStyle = 'blue';
ctx.lineWidth = 5;
ctx.moveTo(0, canvas.height);
ctx.lineTo(canvas.width/2, canvas.height/2);
ctx.stroke();
```

## Easing functions
- [x] `LINEAR`
- [x] `IN_QUAD`
- [x] `OUT_QUAD`
- [x] `IN_CUBIC`
- [x] `OUT_CUBIC`
- [x] `IN_QUARTIC`
- [x] `OUT_QUARTIC`
- [x] `IN_SINE`
- [x] `OUT_SINE`
- [x] `IN_EXPO`
- [x] `OUT_EXPO`

## Implementation Status
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
- [ ] `translate`
- [ ] `rotate`
- [ ] `skew`
