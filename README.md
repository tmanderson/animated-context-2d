# Animated Context 2D
Liven up your `CanvasRenderingContext2D` sketches with a little animation.

Animated Context 2D aims to implement the entirety of the CanvasRenderingContext2D
[API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

![Example of Animated Context](./images/example.gif)

## Example
This example code is what is used in the above image. Notice it's nearly one-to-one
with the pre-existing `CanvasRenderingContext2D` API (only difference is the
specification of duration and easing function given to `beginPath`)

```js
const ctx = new AnimatedContext2D(canvas);

ctx.beginPath(500, AnimatedContext2D.EASE.OUT_CUBIC);
ctx.strokeStyle = 'blue';
ctx.lineTo(canvas.width/2, canvas.height/2);
ctx.stroke();
ctx.strokeStyle = 'red';
ctx.arc(50);
ctx.stroke();
ctx.fill();
ctx.strokeStyle = 'green';
ctx.lineTo(canvas.width, 0);
ctx.stroke();

ctx.beginPath(2000, AnimatedContext2D.EASE.OUT_QUARTIC); // Note: the extra arguments
ctx.moveTo(canvas.width, canvas.height);
ctx.lineTo(canvas.width/2, canvas.height/2);
ctx.stroke();

ctx.beginPath(1000, AnimatedContext2D.EASE.IN_QUARTIC); // Note: the extra arguments
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
- [ ] `BOUNCE_IN`
- [ ] `BOUNCE_OUT`
- [ ] `ELASTIC_IN`
- [ ] `ELASTIC_OUT`

## Implementation Status
- [x] `moveTo`
- [x] `fillStyle`
- [x] `lineStyle`
- [x] `lineTo`
- [x] `arc`
- [ ] `arcTo`
- [ ] `lineWidth`
- [ ] `transform`
- [ ] `translate`
- [ ] `rotate`
- [ ] `skew`
