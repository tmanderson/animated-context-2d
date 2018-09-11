var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
System.register("PathInstruction", [], function (exports_2, context_2) {
    "use strict";
    var PathInstruction;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            PathInstruction = /** @class */ (function () {
                function PathInstruction(method, points, attributes) {
                    this.id = 0;
                    this.i = 0;
                    this.id = ++PathInstruction.instances;
                    this.method = method;
                    this._points = points;
                    this.attributes = attributes || {};
                }
                Object.defineProperty(PathInstruction.prototype, "progress", {
                    get: function () {
                        return this.i / this._points.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PathInstruction.prototype, "points", {
                    get: function () {
                        var points = this._points.slice(0, this.i + 1);
                        this.next();
                        return points;
                    },
                    enumerable: true,
                    configurable: true
                });
                PathInstruction.prototype.next = function () {
                    this.i = Math.min(this._points.length, this.i + 1);
                };
                PathInstruction.prototype.point = function () {
                    return this._points[this.i];
                };
                PathInstruction.instances = 0;
                return PathInstruction;
            }());
            exports_2("default", PathInstruction);
        }
    };
});
System.register("AnimatedPath", ["Easing", "PathInstruction"], function (exports_3, context_3) {
    "use strict";
    var Easing_1, PathInstruction_1, interpolate, AnimatedPath2D;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (Easing_1_1) {
                Easing_1 = Easing_1_1;
            },
            function (PathInstruction_1_1) {
                PathInstruction_1 = PathInstruction_1_1;
            }
        ],
        execute: function () {
            interpolate = function (frames, easing, getPoint) {
                return new Array(frames).fill(0).reduce(function (points, v, i) { return points.concat([getPoint(Easing_1.default[easing](i / (frames - 1)), i, points)]); }, []);
            };
            AnimatedPath2D = /** @class */ (function () {
                function AnimatedPath2D(duration, easing, context) {
                    this.animate = true;
                    this.origin = [0, 0];
                    this.position = [0, 0];
                    this.complete = false;
                    this.ctx = context;
                    this.defaultAttributes = { fillStyle: this.ctx.fillStyle, strokeStyle: this.ctx.strokeStyle };
                    this.duration = duration;
                    this.progress = 0;
                    this.easing = easing;
                    this.instructions = [];
                }
                Object.defineProperty(AnimatedPath2D.prototype, "fillStyle", {
                    get: function () {
                        return this.defaultAttributes.fillStyle;
                    },
                    set: function (color) {
                        this.defaultAttributes.fillStyle = color;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnimatedPath2D.prototype, "strokeStyle", {
                    get: function () {
                        return this.defaultAttributes.strokeStyle;
                    },
                    set: function (color) {
                        this.defaultAttributes.strokeStyle = color;
                    },
                    enumerable: true,
                    configurable: true
                });
                AnimatedPath2D.prototype.moveTo = function (x, y) {
                    this.instructions.push(new PathInstruction_1.default('moveTo', [[x, y]]));
                    this.position = [x, y];
                    return this;
                };
                AnimatedPath2D.prototype.lineTo = function (x, y, duration) {
                    var _this = this;
                    if (duration === void 0) { duration = this.duration; }
                    var frames = Math.round(duration * this.ctx.fpms);
                    this.instructions.push(new PathInstruction_1.default('lineTo', interpolate(frames, this.easing, function (t, i) { return [
                        // Easing position offset as well, this allows `lineTo` commands
                        // to execute relative to the current canvas position
                        _this.position[0] - _this.position[0] * t + x * t,
                        _this.position[1] - _this.position[1] * t + y * t,
                    ]; }), __assign({}, this.defaultAttributes)));
                    this.position = [x, y];
                    return this;
                };
                AnimatedPath2D.prototype.arcTo = function (x1, y1, x2, y2, r) {
                    // const frames = Math.round(duration * this.ctx.fpms);
                    // TODO
                    return this;
                };
                AnimatedPath2D.prototype.arc = function (r, a1, a2, duration) {
                    if (a1 === void 0) { a1 = 0; }
                    if (a2 === void 0) { a2 = 2 * Math.PI; }
                    if (duration === void 0) { duration = this.duration; }
                    var frames = Math.round(duration * this.ctx.fpms);
                    this.instructions.push(new PathInstruction_1.default('arc', interpolate(frames, this.easing, function (t, i, points) { return [
                        // After first angle, the remaining just use the previous angle's extent
                        i ? points[i - 1][1] : a1,
                        (a2 - a1) * t
                    ]; }), { radius: r }));
                    return this;
                };
                AnimatedPath2D.prototype.stroke = function () {
                    var currentInstruction = this.instructions[this.instructions.length - 1];
                    if (currentInstruction) {
                        currentInstruction.attributes.stroke = true;
                        currentInstruction.attributes.strokeStyle = this.strokeStyle;
                    }
                    else {
                        this.defaultAttributes.stroke = true;
                        this.defaultAttributes.strokeStyle = this.strokeStyle;
                    }
                };
                AnimatedPath2D.prototype.fill = function () {
                    var currentInstruction = this.instructions[this.instructions.length - 1];
                    if (currentInstruction) {
                        currentInstruction.attributes.fill = true;
                        currentInstruction.attributes.fillStyle = this.fillStyle;
                    }
                    else {
                        this.defaultAttributes.fill = true;
                        this.defaultAttributes.fillStyle = this.fillStyle;
                    }
                };
                AnimatedPath2D.prototype.executeInstruction = function (ctx, instruction) {
                    var _this = this;
                    instruction.points.forEach(function (point, i, points) {
                        if (i === 0)
                            ctx.beginPath();
                        switch (instruction.method) {
                            case 'moveTo':
                                ctx.moveTo.apply(ctx, point);
                                _this.position = point;
                                break;
                            case 'lineTo':
                                ctx.lineTo.apply(ctx, point);
                                _this.position = point;
                                break;
                            case 'arc':
                                ctx.arc.apply(ctx, [_this.position[0],
                                    _this.position[1],
                                    instruction.attributes.radius].concat(point));
                        }
                        // If we're on the last `point` in the instruction, check for stroke and fill
                        // attributes
                        if (i === points.length - 1) {
                            if (instruction.attributes.fill) {
                                ctx.fillStyle = instruction.attributes.fillStyle;
                                ctx.fill();
                            }
                            if (instruction.attributes.stroke) {
                                ctx.strokeStyle = instruction.attributes.strokeStyle;
                                ctx.stroke();
                            }
                        }
                    });
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
                    ctx.fillStyle = this.ctx.fillStyle;
                    ctx.strokeStyle = this.ctx.strokeStyle;
                    this.position = this.origin;
                    // First draw ALL paths that have completed...
                    this.instructions.slice(0, this.progress).forEach(function (inst, i) {
                        ctx.beginPath();
                        _this.executeInstruction(ctx, inst);
                    });
                    if (this.complete || this.progress >= this.instructions.length) {
                        this.complete = true;
                        return this;
                    }
                    // Then execute the active instruction
                    ctx.beginPath();
                    this.executeInstruction(ctx, this.instructions[this.progress]);
                    if (this.instructions[this.progress].progress >= 1)
                        this.progress += 1;
                    return this;
                };
                AnimatedPath2D.prototype.reset = function () {
                    this.progress = 0;
                };
                return AnimatedPath2D;
            }());
            exports_3("default", AnimatedPath2D);
        }
    };
});
System.register("AnimatedContext", ["Easing", "AnimatedPath"], function (exports_4, context_4) {
    "use strict";
    var Easing_2, AnimatedPath_1, AnimatedContext2D;
    var __moduleName = context_4 && context_4.id;
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
                    this.frame = 0;
                    this.time = 0;
                    this.defaultEasing = Easing_2.EASE.LINEAR;
                    this.defaultDuration = 500;
                    /**
                     * Is the render loop running
                     * @type {boolean}
                     */
                    this.running = false;
                    this._strokeStyle = 'rgba(0, 0, 0, 1)';
                    this._fillStyle = 'rgba(255, 255, 255, 1)';
                    this.tick = function (ts) {
                        if (!_this.running)
                            return;
                        if (ts - _this.time < _this.fpms)
                            return window.requestAnimationFrame(_this.tick);
                        _this.ctx.fillStyle = _this.fillStyle;
                        _this.ctx.fillRect(0, 0, _this.ctx.canvas.width, _this.ctx.canvas.height);
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
                    this.fpms = this.fps / 1000;
                    this.start();
                }
                Object.defineProperty(AnimatedContext2D.prototype, "fillStyle", {
                    get: function () {
                        return this._fillStyle;
                    },
                    set: function (color) {
                        if (this.currentPath)
                            this.currentPath.fillStyle = color;
                        else
                            this._fillStyle = color;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(AnimatedContext2D.prototype, "strokeStyle", {
                    get: function () {
                        return this._strokeStyle;
                    },
                    set: function (color) {
                        if (this.currentPath)
                            this.currentPath.strokeStyle = color;
                        else
                            this._strokeStyle = color;
                    },
                    enumerable: true,
                    configurable: true
                });
                AnimatedContext2D.prototype.beginPath = function (duration, easing) {
                    if (duration === void 0) { duration = this.defaultDuration; }
                    if (easing === void 0) { easing = this.defaultEasing; }
                    this.currentPath = new AnimatedPath_1.default(duration, easing, this);
                    this.paths.push(this.currentPath);
                };
                AnimatedContext2D.prototype.arc = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var _a;
                    (_a = this.currentPath).arc.apply(_a, args); // tslint:disable-line
                };
                AnimatedContext2D.prototype.arcTo = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var _a;
                    (_a = this.currentPath).arcTo.apply(_a, args); // tslint:disable-line
                };
                AnimatedContext2D.prototype.lineTo = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var _a;
                    (_a = this.currentPath).lineTo.apply(_a, args); // tslint:disable-line
                };
                AnimatedContext2D.prototype.moveTo = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var _a;
                    (_a = this.currentPath).moveTo.apply(_a, args); // tslint:disable-line
                };
                AnimatedContext2D.prototype.stroke = function () {
                    this.currentPath.stroke();
                };
                AnimatedContext2D.prototype.fill = function () {
                    this.currentPath.fill();
                };
                AnimatedContext2D.prototype.start = function () {
                    this.running = true;
                    window.requestAnimationFrame(this.tick);
                };
                AnimatedContext2D.prototype.stop = function () {
                    this.running = false;
                };
                AnimatedContext2D.EASE = Easing_2.EASE;
                AnimatedContext2D.AnimatedPath2D = AnimatedPath_1.default;
                return AnimatedContext2D;
            }());
            exports_4("default", AnimatedContext2D);
        }
    };
});
