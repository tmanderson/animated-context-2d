(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.AnimatedContext2D = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var constants_1 = require("./constants");

var Easing_1 = require("./Easing");

var AnimatedPath_1 = __importDefault(require("./AnimatedPath"));
/**
 * @class AnimatedContext2D
 */


var AnimatedContext2D =
/** @class */
function () {
  function AnimatedContext2D(canvas, defaultEasing, FPS) {
    if (defaultEasing === void 0) {
      defaultEasing = Easing_1.EASE.LINEAR;
    }

    if (FPS === void 0) {
      FPS = 60;
    }

    var _this = this;

    this.frame = 0;
    this.time = 0;
    this.defaultEasing = Easing_1.EASE.LINEAR;
    this.defaultDuration = 500;
    /**
     * Is the render loop running
     * @type {boolean}
     */

    this.running = false;

    this.tick = function (ts) {
      if (!_this.running) return;
      if (ts - _this.time < _this.frameRate) return window.requestAnimationFrame(_this.tick);
      _this.ctx.fillStyle = _this.fillStyle;

      _this.ctx.fillRect(0, 0, _this.ctx.canvas.width, _this.ctx.canvas.height);

      _this.paths.forEach(function (path) {
        var _a;

        _this.ctx.save();

        (_a = _this.ctx).transform.apply(_a, path.transform.args());

        path.render(_this.ctx, _this.frame, _this.time);

        _this.ctx.restore();
      });

      window.requestAnimationFrame(_this.tick);
      _this.time = ts;
      _this.frame += 1;
    };

    this.attributes = new constants_1.PathAttributes();
    this.canvas = canvas;
    this.paths = [];
    this.ctx = canvas.getContext('2d');
    this.fps = FPS;
    this.defaultEasing = defaultEasing;
    this.fpms = this.fps / 1000;
    this.frameRate = 1000 / this.fps; // Adding any Context2D methods NOT handled by animated-context-2D

    for (var k in this.ctx) {
      if (k in this || typeof this.ctx[k] !== 'function') continue;
      this[k] = this.ctx[k].bind(this.ctx);
    }

    this.start();
  }

  Object.defineProperty(AnimatedContext2D.prototype, "fillStyle", {
    get: function get() {
      return this.attributes.fillStyle;
    },
    set: function set(color) {
      if (this.currentPath) this.currentPath.fillStyle = color;else this.attributes.fillStyle = color;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedContext2D.prototype, "strokeStyle", {
    get: function get() {
      return this.attributes.strokeStyle;
    },
    set: function set(color) {
      if (this.currentPath) this.currentPath.strokeStyle = color;
      this.attributes.strokeStyle = color;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedContext2D.prototype, "lineWidth", {
    get: function get() {
      return this.attributes.lineWidth;
    },
    set: function set(width) {
      if (this.currentPath) this.currentPath.lineWidth = width;
      this.attributes.lineWidth = width;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedContext2D.prototype, "lineCap", {
    get: function get() {
      return this.attributes.lineCap;
    },
    set: function set(cap) {
      if (this.currentPath) this.currentPath.lineCap = cap;
      this.attributes.lineCap = cap;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedContext2D.prototype, "lineJoin", {
    get: function get() {
      return this.attributes.lineJoin;
    },
    set: function set(join) {
      if (this.currentPath) this.currentPath.lineJoin = join;
      this.attributes.lineJoin = join;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedContext2D.prototype, "miterLimit", {
    get: function get() {
      return this.attributes.miterLimit;
    },
    set: function set(limit) {
      if (this.currentPath) this.currentPath.miterLimit = limit;
      this.attributes.miterLimit = limit;
    },
    enumerable: true,
    configurable: true
  });

  AnimatedContext2D.prototype.beginPath = function (duration, easing) {
    if (duration === void 0) {
      duration = this.defaultDuration;
    }

    if (easing === void 0) {
      easing = this.defaultEasing;
    }

    this.currentPath = new AnimatedPath_1.default(duration, easing, this);
    this.paths.push(this.currentPath);
  };

  AnimatedContext2D.prototype.arc = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var x = args[0],
        y = args[1],
        r = args[2],
        startAngle = args[3],
        endAngle = args[4],
        anticlockwise = args[5],
        duration = args[6];
    this.currentPath.moveTo(x, y);
    this.currentPath.arc(r, startAngle, endAngle, anticlockwise, duration);
  };

  AnimatedContext2D.prototype.arcTo = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var _a;

    (_a = this.currentPath).arcTo.apply(_a, args);
  };

  AnimatedContext2D.prototype.lineTo = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var _a;

    (_a = this.currentPath).lineTo.apply(_a, args);
  };

  AnimatedContext2D.prototype.moveTo = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var _a;

    (_a = this.currentPath).moveTo.apply(_a, args);
  };

  AnimatedContext2D.prototype.translate = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var _a;

    (_a = this.currentPath).translate.apply(_a, args);
  };

  AnimatedContext2D.prototype.skew = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var _a;

    (_a = this.currentPath).skew.apply(_a, args);
  };

  AnimatedContext2D.prototype.rect = function (x0, y0, w, h) {
    this.currentPath.rect(x0, y0, w, h);
  };

  AnimatedContext2D.prototype.rotate = function (angle) {
    this.currentPath.rotate(angle);
  };

  AnimatedContext2D.prototype.scale = function () {
    var args = [];

    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }

    var _a;

    (_a = this.currentPath).scale.apply(_a, args);
  };

  AnimatedContext2D.prototype.stroke = function () {
    this.currentPath.stroke().reset();
  };

  AnimatedContext2D.prototype.fill = function () {
    this.currentPath.fill().reset();
  };

  AnimatedContext2D.prototype.createLinearGradient = function (x0, y0, x1, y1) {
    return this.ctx.createLinearGradient(x0, y0, x1, y1);
  };

  AnimatedContext2D.prototype.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
    return this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
  };

  AnimatedContext2D.prototype.start = function () {
    this.running = true;
    window.requestAnimationFrame(this.tick);
  };

  AnimatedContext2D.prototype.stop = function () {
    this.running = false;
  };

  AnimatedContext2D.EASE = Easing_1.EASE;
  AnimatedContext2D.AnimatedPath2D = AnimatedPath_1.default;
  return AnimatedContext2D;
}();

exports.default = AnimatedContext2D;

},{"./AnimatedPath":2,"./Easing":3,"./constants":6}],2:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Easing_1 = __importDefault(require("./Easing"));

var TransformMatrix_1 = __importDefault(require("./TransformMatrix"));

var PathInstruction_1 = __importDefault(require("./PathInstruction"));

var interpolate = function interpolate(frames, easing, getPoint) {
  return new Array(frames).fill(0).reduce(function (points, v, i) {
    return points.concat([getPoint(Easing_1.default[easing](i / (Math.max(2, frames) - 1)), i, points)]);
  }, []);
};

var AnimatedPath2D =
/** @class */
function () {
  function AnimatedPath2D(duration, easing, context) {
    this.animate = true;
    this.origin = [0, 0];
    this.position = [0, 0];
    this.complete = false;
    this.ctx = context;
    this.duration = duration;
    this.transform = new TransformMatrix_1.default();
    this.progress = 0;
    this.easing = easing;
    this.instructions = [];
    this.transforms = [];
    this.attributes = context.attributes.clone();
  }

  Object.defineProperty(AnimatedPath2D.prototype, "fillStyle", {
    get: function get() {
      return this.attributes.fillStyle;
    },
    set: function set(color) {
      this.attributes.fillStyle = color;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedPath2D.prototype, "strokeStyle", {
    get: function get() {
      return this.attributes.strokeStyle;
    },
    set: function set(color) {
      this.attributes.strokeStyle = color;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedPath2D.prototype, "lineWidth", {
    get: function get() {
      return this.attributes.lineWidth;
    },
    set: function set(width) {
      this.attributes.lineWidth = width;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedPath2D.prototype, "lineCap", {
    get: function get() {
      return this.attributes.lineCap;
    },
    set: function set(cap) {
      this.attributes.lineCap = cap;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedPath2D.prototype, "lineJoin", {
    get: function get() {
      return this.attributes.lineJoin;
    },
    set: function set(join) {
      this.attributes.lineJoin = join;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(AnimatedPath2D.prototype, "miterLimit", {
    get: function get() {
      return this.attributes.miterLimit;
    },
    set: function set(limit) {
      this.attributes.miterLimit = limit;
    },
    enumerable: true,
    configurable: true
  });

  AnimatedPath2D.prototype.moveTo = function (x, y) {
    this.instructions.push(new PathInstruction_1.default('moveTo', [[x, y]], this.attributes.clone()));
    this.position = [x, y];
    return this;
  };

  AnimatedPath2D.prototype.translate = function (x, y, duration) {
    var _this = this;

    if (duration === void 0) {
      duration = this.duration;
    }

    var frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(new PathInstruction_1.default('translate', interpolate(frames, this.easing, function (t, i) {
      return [// Easing position offset as well, this allows `lineTo` commands
      // to execute relative to the current canvas position
      _this.position[0] - _this.position[0] * t + x * t, _this.position[1] - _this.position[1] * t + y * t];
    }), this.attributes.clone()));
    return this;
  };

  AnimatedPath2D.prototype.scale = function (x, y, duration) {
    if (duration === void 0) {
      duration = this.duration;
    }

    var frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(new PathInstruction_1.default('skew', interpolate(frames, this.easing, function (t, i) {
      return [// Easing position offset as well, this allows `lineTo` commands
      // to execute relative to the current canvas position
      x * t, y * t];
    }), this.attributes.clone()));
    return this;
  };

  AnimatedPath2D.prototype.skew = function (x, y, duration) {
    if (duration === void 0) {
      duration = this.duration;
    }

    var frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(new PathInstruction_1.default('skew', interpolate(frames, this.easing, function (t, i) {
      return [x * t, y * t];
    }), this.attributes.clone()));
    return this;
  };

  AnimatedPath2D.prototype.rotate = function (a, duration) {
    if (duration === void 0) {
      duration = this.duration;
    }

    var frames = Math.ceil(duration * this.ctx.fpms);
    this.transforms.push(new PathInstruction_1.default('rotate', interpolate(frames, this.easing, function (t, i) {
      return [a * t];
    }), this.attributes.clone()));
    return this;
  };

  AnimatedPath2D.prototype.lineTo = function (x, y, duration) {
    var _this = this;

    if (duration === void 0) {
      duration = this.duration;
    }

    var frames = Math.ceil(duration * this.ctx.fpms);
    this.instructions.push(new PathInstruction_1.default('lineTo', interpolate(frames, this.easing, function (t, i) {
      return [// Easing position offset as well, this allows `lineTo` commands
      // to execute relative to the current canvas position
      _this.position[0] - _this.position[0] * t + x * t, _this.position[1] - _this.position[1] * t + y * t];
    }), this.attributes.clone()));
    this.position = [x, y];
    return this;
  };

  AnimatedPath2D.prototype.rect = function (x, y, w, h, duration) {
    if (duration === void 0) {
      duration = this.duration;
    }

    var frames = Math.ceil(duration * this.ctx.fpms);
    this.instructions.push(new PathInstruction_1.default('rect', interpolate(frames, this.easing, function (t, i) {
      return [x + w * (1 - t) / 2, y + h * (1 - t) / 2, w * t, h * t];
    }), this.attributes.clone()));
    this.position = [x - w / 2, y - h / 2];
    return this;
  };

  AnimatedPath2D.prototype.arcTo = function (x1, y1, x2, y2, r) {
    // const frames = Math.ceil(duration * this.ctx.fpms);
    // TODO
    return this;
  };

  AnimatedPath2D.prototype.arc = function (r, a1, a2, anticlockwise, duration) {
    if (a1 === void 0) {
      a1 = 0;
    }

    if (a2 === void 0) {
      a2 = 2 * Math.PI;
    }

    if (anticlockwise === void 0) {
      anticlockwise = false;
    }

    if (duration === void 0) {
      duration = this.duration;
    }

    var frames = Math.ceil(duration * this.ctx.fpms);
    var attributes = this.attributes.clone();
    attributes.radius = r;
    attributes.anticlockwise = anticlockwise;
    this.instructions.push(new PathInstruction_1.default('arc', interpolate(frames, this.easing, function (t, i, points) {
      var p1 = anticlockwise ? a2 : a1;
      var p2 = anticlockwise ? a1 : a2;
      return [i ? points[i - 1][1] : p1, p1 + (p2 - p1) * t];
    }), attributes));
    return this;
  };

  AnimatedPath2D.prototype.stroke = function () {
    this.attributes.stroke = true;
    this.attributes.strokeStyle = this.strokeStyle;
    return this;
  };

  AnimatedPath2D.prototype.fill = function () {
    this.attributes.fill = true;
    this.attributes.fillStyle = this.fillStyle;
    return this;
  };

  AnimatedPath2D.prototype.executeInstruction = function (ctx, instruction) {
    var _this = this;

    instruction.points.forEach(function (point, i, points) {
      if (i === 0) ctx.beginPath();

      switch (instruction.method) {
        case 'translate':
          return _this.transform.translate(point[0], point[1]);

        case 'scale':
          return _this.transform.scale(point[0], point[1]);

        case 'skew':
          return _this.transform.skew(point[0], point[1]);

        case 'rotate':
          return _this.transform.rotate(point[0]);

        case 'moveTo':
          ctx.moveTo(point[0], point[1]);
          _this.position = [point[0], point[1]];
          break;

        case 'rect':
          if (i === points.length - 1) ctx.rect.apply(ctx, point);
          break;

        case 'lineTo':
          ctx.lineTo(point[0], point[1]);
          _this.position = [point[0], point[1]];
          break;

        case 'arc':
          ctx.arc(_this.position[0], _this.position[1], instruction.attributes.radius, point[0], point[1], instruction.attributes.anticlockwise);
      } // If we're on the last `point` in the instruction, check for stroke and fill
      // attributes


      if (i === points.length - 1) {
        if (_this.attributes.fill) {
          ctx.fillStyle = _this.attributes.fillStyle;
          ctx.fill();
        }

        if (_this.attributes.stroke) {
          ctx.strokeStyle = _this.attributes.strokeStyle;
          ctx.lineWidth = _this.attributes.lineWidth;
          ctx.lineCap = _this.attributes.lineCap;
          ctx.lineJoin = _this.attributes.lineJoin;
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
    this.position = this.origin; // Transformations on path run first (as they affect all paths within)

    this.transforms.forEach(function (inst, i) {
      _this.executeInstruction(ctx, inst);
    }); // First draw ALL paths that have completed...

    this.instructions.slice(0, this.progress).forEach(function (inst, i) {
      ctx.beginPath();

      _this.executeInstruction(ctx, inst);
    });

    if (this.complete || this.progress >= this.instructions.length) {
      this.complete = true;
      return this;
    } // Then execute the active instruction


    ctx.beginPath();
    this.executeInstruction(ctx, this.instructions[this.progress]);
    if (this.instructions[this.progress].progress >= 1) this.progress += 1;
    return this;
  };

  AnimatedPath2D.prototype.reset = function () {
    this.progress = 0;
    this.instructions.forEach(function (instruction) {
      return instruction.reset();
    });
  };

  return AnimatedPath2D;
}();

exports.default = AnimatedPath2D;

},{"./Easing":3,"./PathInstruction":4,"./TransformMatrix":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _a;

var PI2 = Math.PI / 2;
var EASE;

(function (EASE) {
  EASE["LINEAR"] = "linear";
  EASE["IN_QUAD"] = "in.quad";
  EASE["OUT_QUAD"] = "out.quad";
  EASE["IN_CUBIC"] = "in.cubic";
  EASE["OUT_CUBIC"] = "out.cubic";
  EASE["IN_QUARTIC"] = "in.quartic";
  EASE["OUT_QUARTIC"] = "out.quartic";
  EASE["IN_SINE"] = "in.sine";
  EASE["OUT_SINE"] = "out.sine";
  EASE["IN_EXPO"] = "in.expo";
  EASE["OUT_EXPO"] = "out.expo";
})(EASE = exports.EASE || (exports.EASE = {}));

exports.default = (_a = {}, _a[EASE.LINEAR] = function (t) {
  return t;
}, _a[EASE.IN_QUAD] = function (t) {
  return t * t + 2 * t * (1 - t);
}, _a[EASE.OUT_QUAD] = function (t) {
  return 1 - Math.pow(1 - t, 2);
}, _a[EASE.IN_CUBIC] = function (t) {
  return t * t * t;
}, _a[EASE.OUT_CUBIC] = function (t) {
  return 1 - Math.pow(1 - t, 3);
}, _a[EASE.IN_QUARTIC] = function (t) {
  return t * t * t * t + (1 - t * t * t * t) * t;
}, _a[EASE.OUT_QUARTIC] = function (t) {
  return 1 - Math.pow(1 - t, 4);
}, _a[EASE.IN_SINE] = function (t) {
  return Math.sin(t * PI2);
}, _a[EASE.OUT_SINE] = function (t) {
  return 1 - Math.sin((1 - t) * PI2);
}, _a[EASE.IN_EXPO] = function (t) {
  return Math.pow(Math.E, 5 * (t - 1));
}, _a[EASE.OUT_EXPO] = function (t) {
  return 1 - Math.pow(Math.E, -5 * t);
}, _a);

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var PathInstruction =
/** @class */
function () {
  function PathInstruction(method, points, attributes) {
    this.id = 0;
    this.i = 0;
    this.id = ++PathInstruction.instances;
    this.method = method;
    this._points = points;
    this.attributes = attributes;
  }

  Object.defineProperty(PathInstruction.prototype, "progress", {
    get: function get() {
      return this.i / this._points.length;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(PathInstruction.prototype, "points", {
    get: function get() {
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

  PathInstruction.prototype.reset = function () {
    this.i = 0;
  };

  PathInstruction.instances = 0;
  return PathInstruction;
}();

exports.default = PathInstruction;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TransformMatrix =
/** @class */
function () {
  function TransformMatrix() {
    this._skew = [0, 0];
    this._rotation = 0;
    this._scale = [1, 1];
    this._translation = [0, 0];
    this.reset();
  }

  TransformMatrix.prototype.reset = function () {
    this._skew = [0, 0];
    this._rotation = 0;
    this._scale = [1, 1];
    this.rows = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  };

  TransformMatrix.prototype.scale = function (x, y) {
    if (x === void 0) {
      x = 1;
    }

    if (y === void 0) {
      y = x;
    }

    this._scale = [x, y];
    this.update();
  };

  TransformMatrix.prototype.skew = function (x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this._skew = [x, y];
    this.update();
  };

  TransformMatrix.prototype.translate = function (x, y) {
    if (x === void 0) {
      x = 0;
    }

    if (y === void 0) {
      y = 0;
    }

    this.rows[2][0] = x;
    this.rows[2][1] = y;
  };

  TransformMatrix.prototype.rotate = function (t) {
    if (t === void 0) {
      t = 0;
    }

    this._rotation = t;
    this.update();
  };

  TransformMatrix.prototype.update = function () {
    var x = this._scale[0],
        y = this._scale[1];
    var c = Math.cos(this._rotation),
        s = Math.sin(this._rotation);
    this.rows[0][0] = x * c;
    this.rows[0][1] = y * (Math.tan(this._skew[1]) - s);
    this.rows[1][0] = x * (Math.tan(this._skew[0]) + s);
    this.rows[1][1] = y * c;
  };

  TransformMatrix.prototype.args = function () {
    return [this.rows[0][0], this.rows[0][1], this.rows[1][0], this.rows[1][1], this.rows[2][0], this.rows[2][1]];
  };

  return TransformMatrix;
}();

exports.default = TransformMatrix;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Context2DLineCap;

(function (Context2DLineCap) {
  Context2DLineCap["Butt"] = "butt";
  Context2DLineCap["Round"] = "round";
  Context2DLineCap["Square"] = "square";
})(Context2DLineCap = exports.Context2DLineCap || (exports.Context2DLineCap = {}));

var Context2DLineJoin;

(function (Context2DLineJoin) {
  Context2DLineJoin["Bevel"] = "bevel";
  Context2DLineJoin["Round"] = "round";
  Context2DLineJoin["Miter"] = "miter";
})(Context2DLineJoin = exports.Context2DLineJoin || (exports.Context2DLineJoin = {}));

var PathAttributes =
/** @class */
function () {
  function PathAttributes(attributes) {
    this.fillStyle = 'rgba(255, 255, 255, 1)';
    this.strokeStyle = 'rgba(0, 0, 0, 1)';
    this.lineWidth = 1;
    this.miterLimit = 10;
    this.lineCap = Context2DLineCap.Butt;
    this.lineJoin = Context2DLineJoin.Miter;
    Object.assign(this, attributes || {});
  }

  PathAttributes.prototype.clone = function () {
    return new PathAttributes({
      fill: this.fill,
      stroke: this.stroke,
      radius: this.radius,
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      miterLimit: this.miterLimit,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      anticlockwise: this.anticlockwise
    });
  };

  return PathAttributes;
}();

exports.PathAttributes = PathAttributes;

},{}],7:[function(require,module,exports){
"use strict";

var _AnimatedContext = require("./AnimatedContext");

var _AnimatedContext2 = _interopRequireDefault(_AnimatedContext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _AnimatedContext2.default;

},{"./AnimatedContext":1}]},{},[7])(7)
});
