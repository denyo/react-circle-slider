(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["ReactCircleSliderHooked"] = factory(require("react"));
	else
		root["ReactCircleSliderHooked"] = factory(root["React"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _circle_slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CircleSlider", function() { return _circle_slider__WEBPACK_IMPORTED_MODULE_0__["CircleSlider"]; });




/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CircleSlider", function() { return CircleSlider; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


var THRESHOLD = 0.01;
var CircleSlider = function CircleSlider(_ref) {
  var _ref$value = _ref.value,
      value = _ref$value === void 0 ? 0 : _ref$value,
      _ref$size = _ref.size,
      size = _ref$size === void 0 ? 180 : _ref$size,
      _ref$stepSize = _ref.stepSize,
      stepSize = _ref$stepSize === void 0 ? 1 : _ref$stepSize,
      _ref$min = _ref.min,
      min = _ref$min === void 0 ? 0 : _ref$min,
      _ref$max = _ref.max,
      max = _ref$max === void 0 ? 100 : _ref$max,
      _ref$circleWidth = _ref.circleWidth,
      circleWidth = _ref$circleWidth === void 0 ? 5 : _ref$circleWidth,
      _ref$circleColor = _ref.circleColor,
      circleColor = _ref$circleColor === void 0 ? "#e9eaee" : _ref$circleColor,
      _ref$progressWidth = _ref.progressWidth,
      progressWidth = _ref$progressWidth === void 0 ? 20 : _ref$progressWidth,
      _ref$progressColor = _ref.progressColor,
      progressColor = _ref$progressColor === void 0 ? "#007aff" : _ref$progressColor,
      gradientColorFrom = _ref.gradientColorFrom,
      gradientColorTo = _ref.gradientColorTo,
      _ref$knobColor = _ref.knobColor,
      knobColor = _ref$knobColor === void 0 ? "#fff" : _ref$knobColor,
      _ref$knobRadius = _ref.knobRadius,
      knobRadius = _ref$knobRadius === void 0 ? 20 : _ref$knobRadius,
      _ref$disabled = _ref.disabled,
      disabled = _ref$disabled === void 0 ? false : _ref$disabled,
      _ref$shadow = _ref.shadow,
      shadow = _ref$shadow === void 0 ? true : _ref$shadow,
      _ref$showTooltip = _ref.showTooltip,
      showTooltip = _ref$showTooltip === void 0 ? false : _ref$showTooltip,
      _ref$valuePrefix = _ref.valuePrefix,
      valuePrefix = _ref$valuePrefix === void 0 ? "" : _ref$valuePrefix,
      _ref$valueSuffix = _ref.valueSuffix,
      valueSuffix = _ref$valueSuffix === void 0 ? "" : _ref$valueSuffix,
      _ref$tooltipSize = _ref.tooltipSize,
      tooltipSize = _ref$tooltipSize === void 0 ? 32 : _ref$tooltipSize,
      _ref$tooltipColor = _ref.tooltipColor,
      tooltipColor = _ref$tooltipColor === void 0 ? "#333" : _ref$tooltipColor,
      onChange = _ref.onChange,
      className = _ref.className;

  // takes care of min, max and stepSize
  var formatValue = function formatValue(input) {
    return Math.round((input || (value < min ? min : value > max ? max : value)) / stepSize) * stepSize;
  };

  var valueToAngle = function valueToAngle() {
    var newAngle = Math.round((formatValue() - min) / (max - min) * 360);
    return newAngle === 360 ? newAngle - THRESHOLD : newAngle % 360;
  };

  var angleToValue = function angleToValue(newAngle) {
    return formatValue(newAngle / (360 / (max - min))) + min;
  };

  var svgRef = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])();
  var prevX = Object(react__WEBPACK_IMPORTED_MODULE_0__["useRef"])(); // necessary since functional component

  var updateSliderFromEvent = function updateSliderFromEvent(event) {
    var rectSize = svgRef.current.getBoundingClientRect();
    var rectCenter = rectSize.width / 2;
    var x = event.clientX - rectSize.left - rectCenter;
    var y = event.clientY - rectSize.top - rectCenter;
    var angleBetweenTwoVectors = Math.atan2(y, x);
    var newAngle = Math.round(angleBetweenTwoVectors * 180 / Math.PI) + 90;

    if (x < 0 && y < 0) {
      newAngle += 360;
    } // prevent jumping from "< 360 to > 0" and "> 0 to < 360"


    if (y < 0) {
      if (prevX.current < 0 && x > 0) {
        newAngle = 360 - THRESHOLD; // can't go over 360
      } else if (prevX.current > 0 && x < 0) {
        newAngle = THRESHOLD; // can't go lower than 0
      } else {
        prevX.current = x;
      }
    } else {
      prevX.current = x;
    }

    onChange(angleToValue(newAngle));
  }; // mouse event handlers
  // --------------------
  // react event


  var handleMouseDown = function handleMouseDown(event) {
    event.preventDefault();
    svgRef.current.addEventListener("mousemove", handleMouseMove);
    svgRef.current.addEventListener("mouseup", handleMouseUp);
  }; // regular dom event


  var handleMouseMove = function handleMouseMove(event) {
    event.preventDefault();
    updateSliderFromEvent(event);
  }; // regular dom event


  var handleMouseUp = function handleMouseUp(event) {
    event.preventDefault();
    svgRef.current.removeEventListener("mousemove", handleMouseMove);
    svgRef.current.removeEventListener("mouseup", handleMouseUp);
  }; // touch event handlers
  // --------------------
  // react event


  var handleTouchStart = function handleTouchStart() {
    svgRef.current.addEventListener("touchmove", handleTouchMove);
    svgRef.current.addEventListener("touchend", handleTouchUp);
  }; // regular dom event


  var handleTouchMove = function handleTouchMove(event) {
    var targetTouches = event.targetTouches;
    var currentTouch = targetTouches.item(targetTouches.length - 1);
    updateSliderFromEvent(currentTouch);
  }; // regular dom event


  var handleTouchUp = function handleTouchUp() {
    svgRef.current.removeEventListener("touchmove", handleTouchMove);
    svgRef.current.removeEventListener("touchend", handleTouchUp);
  };

  var offset = shadow ? "5px" : "0px";
  var center = size / 2;
  var radius = center - Math.max(circleWidth, progressWidth, knobRadius * 2) / 2;
  var progressPath = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["buildPath"])({
    cx: center,
    cy: center,
    radius: radius + progressWidth / 2,
    startAngle: 0,
    endAngle: valueToAngle(),
    thickness: progressWidth
  });
  var knobCenter = Object(_helpers__WEBPACK_IMPORTED_MODULE_1__["polarToCartesian"])(center, center, radius, valueToAngle());
  var isAllGradientColorsAvailable = gradientColorFrom && gradientColorTo;
  return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("svg", {
    ref: svgRef,
    className: className,
    width: size,
    height: size,
    viewBox: "0 0 ".concat(size, " ").concat(size),
    onMouseDown: disabled ? undefined : handleMouseDown,
    onTouchStart: disabled ? undefined : handleTouchStart,
    style: {
      padding: offset,
      boxSizing: "border-box",
      touchAction: "none"
    }
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("g", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("circle", {
    style: {
      strokeWidth: circleWidth,
      stroke: circleColor,
      fill: "none"
    },
    r: radius,
    cx: center,
    cy: center
  }), isAllGradientColorsAvailable && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("defs", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("linearGradient", {
    id: "gradient",
    x1: "0",
    x2: "0",
    y1: "0",
    y2: "1"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("stop", {
    offset: "0%",
    stopColor: gradientColorFrom
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("stop", {
    offset: "100%",
    stopColor: gradientColorTo
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("path", {
    style: {
      stroke: "none",
      fill: isAllGradientColorsAvailable ? "url(#gradient)" : progressColor,
      fillRule: "evenodd"
    },
    d: progressPath
  }), shadow && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("filter", {
    id: "dropShadow",
    filterUnits: "userSpaceOnUse"
  }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("feGaussianBlur", {
    in: "SourceAlpha",
    stdDeviation: "3"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("feOffset", {
    dx: "2",
    dy: "2"
  }), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("feComponentTransfer", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("feFuncA", {
    type: "linear",
    slope: "0.3"
  })), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("feMerge", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("feMergeNode", null), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("feMergeNode", {
    in: "SourceGraphic"
  }))), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("circle", {
    style: {
      fill: knobColor,
      cursor: disabled ? "not-allowed" : "pointer"
    },
    filter: shadow ? "url(#dropShadow)" : "none",
    r: knobRadius,
    cx: knobCenter.x,
    cy: knobCenter.y
  }), showTooltip && react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("text", {
    x: size / 2,
    y: size / 2 + tooltipSize / 3,
    textAnchor: "middle",
    fontSize: tooltipSize,
    fontFamily: "Arial",
    fill: tooltipColor
  }, valuePrefix, formatValue(), valueSuffix)));
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "polarToCartesian", function() { return polarToCartesian; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "buildPath", function() { return buildPath; });
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}
function buildPath(_ref) {
  var cx = _ref.cx,
      cy = _ref.cy,
      radius = _ref.radius,
      startAngle = _ref.startAngle,
      endAngle = _ref.endAngle,
      thickness = _ref.thickness;
  var start = polarToCartesian(cx, cy, radius, endAngle);
  var end = polarToCartesian(cx, cy, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var cutoutRadius = radius - thickness;
  var start2 = polarToCartesian(cx, cy, cutoutRadius, endAngle);
  var end2 = polarToCartesian(cx, cy, cutoutRadius, startAngle);
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y, "L", cx, cy, "Z", "M", start2.x, start2.y, "A", cutoutRadius, cutoutRadius, 0, largeArcFlag, 0, end2.x, end2.y, "L", cx, cy, "Z"].join(" ");
}

/***/ })
/******/ ]);
});