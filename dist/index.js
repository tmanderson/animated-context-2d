System.register("Easing", [], function (exports_1, context_1) {
    "use strict";
    var _a, PI2, EASE;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            PI2 = Math.PI / 2;
            (function (EASE) {
                EASE[EASE["LINEAR"] = 0] = "LINEAR";
                EASE[EASE["IN_QUAD"] = 1] = "IN_QUAD";
                EASE[EASE["OUT_QUAD"] = 2] = "OUT_QUAD";
                EASE[EASE["IN_CUBIC"] = 3] = "IN_CUBIC";
                EASE[EASE["OUT_CUBIC"] = 4] = "OUT_CUBIC";
                EASE[EASE["IN_QUARTIC"] = 5] = "IN_QUARTIC";
                EASE[EASE["OUT_QUARTIC"] = 6] = "OUT_QUARTIC";
                EASE[EASE["IN_SINE"] = 7] = "IN_SINE";
                EASE[EASE["OUT_SINE"] = 8] = "OUT_SINE";
            })(EASE || (EASE = {}));
            exports_1("EASE", EASE);
            exports_1("default", (_a = {},
                _a[EASE.LINEAR] = function (t) { return t; },
                _a[EASE.IN_QUAD] = function (t) { return t * t; },
                _a[EASE.OUT_QUAD] = function (t) { return 1 - Math.pow(1 - t, 2); },
                _a[EASE.IN_CUBIC] = function (t) { return t * t * t; },
                _a[EASE.OUT_CUBIC] = function (t) { return 1 - Math.pow(1 - t, 3); },
                _a[EASE.IN_QUARTIC] = function (t) { return t * t * t * t; },
                _a[EASE.OUT_QUARTIC] = function (t) { return 1 - Math.pow(1 - t, 4); },
                _a[EASE.IN_SINE] = function (t) { return Math.sin(t * PI2); },
                _a[EASE.OUT_SINE] = function (t) { return 1 - Math.sin((1 - t) * PI2); },
                _a));
        }
    };
});
System.register("AnimatedPath", ["Easing"], function (exports_2, context_2) {
    "use strict";
    var Easing_1, MAX_STEP, interpolate, AnimatedPath2D;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (Easing_1_1) {
                Easing_1 = Easing_1_1;
            }
        ],
        execute: function () {
            MAX_STEP = 0.3;
            interpolate = function (frames, easing, getPoint) {
                return new Array(frames).fill(0).map(function (v, i, points) { return getPoint(Easing_1["default"][easing](i / frames), i, points); });
            };
            AnimatedPath2D = /** @class */ (function () {
                function AnimatedPath2D(duration, easing, context) {
                    this.animate = true;
                    this.origin = [0, 0];
                    this.position = [0, 0];
                    this.complete = false;
                    this.ctx = context;
                    this.duration = duration;
                    this.progress = 0;
                    this.easing = easing;
                    this.instructions = [];
                }
                AnimatedPath2D.prototype.moveTo = function (x, y) {
                    this.instructions.push({
                        points: [[x, y]],
                        animate: this.animate,
                        method: 'moveTo'
                    });
                    return this;
                };
                AnimatedPath2D.prototype.lineTo = function (x, y, duration) {
                    if (duration === void 0) { duration = this.duration; }
                    var frames = Math.floor(duration / this.ctx.frequency);
                    this.instructions.push({
                        points: [
                            this.origin
                        ].concat(interpolate(frames, this.easing, function (t, i) { return [
                            x * t,
                            y * t,
                        ]; })),
                        animate: this.animate,
                        stroke: true,
                        method: 'lineTo'
                    });
                    return this;
                };
                AnimatedPath2D.prototype.arc = function (r, a1, a2, duration) {
                    if (a1 === void 0) { a1 = 0; }
                    if (a2 === void 0) { a2 = 2 * Math.PI; }
                    if (duration === void 0) { duration = this.duration; }
                    var frames = 2 * Math.floor(duration / this.ctx.frequency);
                    this.instructions.push({
                        points: interpolate(frames, this.easing, function (t) { return [
                            r * Math.cos((a2 - a1) * t),
                            r * Math.sin((a2 - a1) * t)
                        ]; }),
                        additionalArgs: [r],
                        animate: this.animate,
                        stroke: true,
                        method: 'lineTo'
                    });
                    return this;
                };
                /**
                 * Renders this path at the given `frame` (relative to total internal frames)
                 *
                 * @param ctx The Canvas context that this path is rendering to
                 * @param frame The frame number relative to this path's frames (ie. every frame for each animated instruction)
                 * @param time The current global time of the parent canvas
                 */
                AnimatedPath2D.prototype.render = function (ctx, frame, time) {
                    var _this = this;
                    this.position = this.origin;
                    // First draw ALL paths that have completed...
                    this.instructions.slice(0, this.progress).forEach(function (inst) {
                        ctx.beginPath();
                        var prevPoint = [
                            _this.position[0] + inst.points[0][0],
                            _this.position[1] + inst.points[0][1]
                        ];
                        inst.points.slice(1).forEach(function (nextPoint) {
                            ctx[inst.method].apply(ctx, prevPoint.concat(nextPoint).concat((inst.additionalArgs || [])));
                            prevPoint = [
                                _this.position[0] + nextPoint[0],
                                _this.position[1] + nextPoint[1]
                            ];
                        });
                        _this.position = prevPoint;
                        ctx.stroke();
                    });
                    if (this.complete || this.progress >= this.instructions.length) {
                        this.complete = true;
                        ctx.stroke();
                        return this;
                    }
                    ctx.beginPath();
                    var currentInstruction = this.instructions[this.progress];
                    if (!currentInstruction.progress)
                        currentInstruction.progress = 1;
                    var prevPoint = [this.position[0], this.position[1]];
                    currentInstruction.points.slice(0, currentInstruction.progress + 1)
                        .forEach(function (point, i, instructions) {
                        var nextPoint = [_this.position[0] + point[0], _this.position[1] + point[1]];
                        ctx[currentInstruction.method].apply(ctx, prevPoint.concat(nextPoint).concat((currentInstruction.additionalArgs || [])));
                        prevPoint = nextPoint;
                    });
                    this.position = prevPoint;
                    ctx.stroke();
                    currentInstruction.progress += 1;
                    if (currentInstruction.progress >= currentInstruction.points.length)
                        this.progress += 1;
                };
                AnimatedPath2D.prototype.reset = function () {
                    this.progress = 0;
                };
                return AnimatedPath2D;
            }());
            exports_2("default", AnimatedPath2D);
        }
    };
});
System.register("AnimatedContext", ["Easing", "AnimatedPath"], function (exports_3, context_3) {
    "use strict";
    var Easing_2, AnimatedPath_1, AnimatedContext2D;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (Easing_2_1) {
                Easing_2 = Easing_2_1;
            },
            function (AnimatedPath_1_1) {
                AnimatedPath_1 = AnimatedPath_1_1;
            }
        ],
        execute: function () {
            AnimatedContext2D = /** @class */ (function () {
                function AnimatedContext2D(canvas, FPS, defaultEasing) {
                    if (FPS === void 0) { FPS = 60; }
                    if (defaultEasing === void 0) { defaultEasing = Easing_2.EASE.LINEAR; }
                    var _this = this;
                    this.time = 0;
                    this.frame = 0;
                    this.running = false;
                    this.tick = function (ts) {
                        if (!_this.running)
                            return;
                        if (ts - _this.time < _this.frequency)
                            return window.requestAnimationFrame(_this.tick);
                        _this.ctx.clearRect(0, 0, _this.ctx.canvas.width, _this.ctx.canvas.height);
                        _this.paths.forEach(function (path) {
                            path.render(_this.ctx, _this.frame, _this.time);
                        });
                        window.requestAnimationFrame(_this.tick);
                        _this.time = ts;
                        _this.frame += 1;
                    };
                    this.canvas = canvas;
                    this.paths = [];
                    this.ctx = canvas.getContext('2d');
                    this.fps = FPS;
                    this.defaultEasing = defaultEasing;
                    this.frequency = 1000 / this.fps;
                }
                AnimatedContext2D.prototype.path = function (duration, easing) {
                    if (easing === void 0) { easing = this.defaultEasing; }
                    var path = new AnimatedPath_1["default"](duration, easing, this);
                    this.paths.push(path);
                    return path;
                };
                AnimatedContext2D.prototype.start = function () {
                    this.running = true;
                    window.requestAnimationFrame(this.tick);
                };
                AnimatedContext2D.prototype.stop = function () {
                    this.running = false;
                };
                AnimatedContext2D.EASE = Easing_2.EASE;
                return AnimatedContext2D;
            }());
            exports_3("default", AnimatedContext2D);
        }
    };
});
