'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Vue = require('vue');

var vueDraggableCore = require('vue-draggable-core');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

var VueResizableCore = Vue__default['default'].extend({
  name: 'VueResizableCore',
  props: {
    width: {
      type: Number,
      "default": 0
    },
    height: {
      type: Number,
      "default": 0
    },
    draggableProps: {
      type: Object,
      "default": undefined
    },
    handleSize: {
      type: [Array, Object],
      "default": function _default() {
        return [20, 20];
      }
    },
    lockAspectRatio: {
      type: Boolean,
      "default": false
    },
    axis: {
      type: String,
      "default": 'both'
    },
    minConstraints: {
      type: [Array, Object],
      "default": function _default() {
        return [20, 20];
      }
    },
    maxConstraints: {
      type: [Array, Object],
      "default": function _default() {
        return [Infinity, Infinity];
      }
    },
    resizeHandles: {
      type: Array,
      "default": ['se']
    },
    resizableHandleClass: {
      type: [Object, String, Array],
      "default": 'vue-resizable-handle'
    },
    transformScale: {
      type: Number,
      "default": 1
    }
  },
  data: function data() {
    return {
      lastHandleRect: null,
      slack: null
    };
  },
  beforeDestroy: function beforeDestroy() {
    this.resetData();
  },
  methods: {
    lockAspectRatioFn: function lockAspectRatioFn(width, height, aspectRatio) {
      height = width / aspectRatio;
      width = height * aspectRatio;
      return [width, height];
    },
    resetData: function resetData() {
      this.lastHandleRect = this.slack = null;
    },
    // Clamp width and height within provided constraints
    runConstraints: function runConstraints(width, height) {
      var _ref = [this.minConstraints, this.maxConstraints],
          min = _ref[0],
          max = _ref[1];
      if (!min && !max) return [width, height]; // If constraining to min and max, we need to also fit width and height to aspect ratio.

      if (this.lockAspectRatio) {
        var resizingHorizontally = height === this.height;

        if (resizingHorizontally) {
          var ratio = this.width / this.height;
          height = width / ratio;
          width = height * ratio;
        } else {
          // Take into account vertical resize with N/S handles on locked aspect
          // ratio. Calculate the change height-first, instead of width-first
          var _ratio = this.height / this.width;

          width = height / _ratio;
          height = width * _ratio;
        }
      }

      var oldW = width,
          oldH = height; // Add slack to the values used to calculate bound position. This will ensure that if
      // we start removing slack, the element won't Vue to it right away until it's been
      // completely removed.

      var _ref2 = this.slack || [0, 0],
          _ref3 = _slicedToArray(_ref2, 2),
          slackW = _ref3[0],
          slackH = _ref3[1];

      width += slackW;
      height += slackH;

      if (min) {
        width = Math.max(min[0], width);
        height = Math.max(min[1], height);
      }

      if (max) {
        width = Math.min(max[0], width);
        height = Math.min(max[1], height);
      } // If the width or height changed, we must have introduced some slack. Record it for the next iteration.


      this.slack = [slackW + (oldW - width), slackH + (oldH - height)];
      return [width, height];
    },

    /**
     * Wrapper around drag events to provide more useful data.
     *
     * @param  {String} handlerName Handler name to wrap.
     * @param axis
     * @return {Function}           Handler function.
     */
    resizeHandler: function resizeHandler(handlerName, axis) {
      var _this = this;

      return function (_ref4, e) {
        var node = _ref4.node,
            deltaX = _ref4.deltaX,
            deltaY = _ref4.deltaY;
        // Reset data in case it was left over somehow (should not be possible)
        if (handlerName === 'resizeStart') _this.resetData(); // Axis restrictions

        var canDragX = (_this.axis === 'both' || _this.axis === 'x') && axis !== 'n' && axis !== 's';
        var canDragY = (_this.axis === 'both' || _this.axis === 'y') && axis !== 'e' && axis !== 'w'; // No dragging possible.

        if (!canDragX && !canDragY) return; // Decompose axis for later use

        var axisV = axis[0];
        var axisH = axis[axis.length - 1]; // intentionally not axis[1], so that this catches axis === 'w' for example
        // Track the element being dragged to account for changes in position.
        // If a handle's position is changed between callbacks, we need to factor this in to the next callback.
        // Failure to do so will cause the element to "skip" when resized upwards or leftwards.

        var handleRect = node.getBoundingClientRect();

        if (_this.lastHandleRect != null) {
          // If the handle has repositioned on either axis since last render,
          // we need to increase our callback values by this much.
          // Only checking 'n', 'w' since resizing by 's', 'w' won't affect the overall position on page,
          if (axisH === 'w') {
            var deltaLeftSinceLast = handleRect.left - _this.lastHandleRect.left;
            deltaX += deltaLeftSinceLast;
          }

          if (axisV === 'n') {
            var deltaTopSinceLast = handleRect.top - _this.lastHandleRect.top;
            deltaY += deltaTopSinceLast;
          }
        } // Storage of last rect so we know how much it has really moved.


        _this.lastHandleRect = handleRect; // Reverse delta if using top or left drag handles.

        if (axisH === 'w') deltaX = -deltaX;
        if (axisV === 'n') deltaY = -deltaY; // Update w/h by the deltas. Also factor in transformScale.

        var width = _this.width + (canDragX ? deltaX / _this.transformScale : 0);
        var height = _this.height + (canDragY ? deltaY / _this.transformScale : 0); // Run user-provided constraints.

        var _this$runConstraints = _this.runConstraints(width, height);

        var _this$runConstraints2 = _slicedToArray(_this$runConstraints, 2);

        width = _this$runConstraints2[0];
        height = _this$runConstraints2[1];
        var dimensionsChanged = width !== _this.width || height !== _this.height; // Don't call 'onResize' if dimensions haven't changed.

        var shouldSkipCb = handlerName === 'resize' && !dimensionsChanged;

        if (!shouldSkipCb) {
          if (typeof e.persist === 'function') e.persist();

          _this.$emit(handlerName, {
            node: node,
            size: {
              width: width,
              height: height
            },
            handle: axis
          }, e);
        } // Reset internal data


        if (handlerName === 'resizeStop') _this.resetData();
      };
    },
    children: function children(h) {
      var _this2 = this;

      if (this.$scopedSlots["default"]) {
        return this.$scopedSlots["default"]({
          resizeHandles: this.resizeHandles.map(function (handleAxis) {
            return {
              axis: handleAxis,
              wrapper: vueDraggableCore.VueDraggableCore,
              props: _this2.draggableProps,
              on: {
                dragStop: _this2.resizeHandler('resizeStop', handleAxis),
                dragStart: _this2.resizeHandler('resizeStart', handleAxis),
                drag: _this2.resizeHandler('resize', handleAxis)
              },
              "class": "".concat(_this2.resizableHandleClass, " ").concat(_this2.resizableHandleClass, "-").concat(handleAxis)
            };
          })
        });
      }

      return h('div');
    }
  },
  render: function render(h) {
    var children = this.children(h);

    if (Array.isArray(children)) {
      return children[0];
    }

    return children;
  }
});
exports.VueResizableCore = VueResizableCore;
//# sourceMappingURL=vue-resizable-core.common.js.map
