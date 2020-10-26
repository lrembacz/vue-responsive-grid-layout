'use strict';

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Vue = require('vue');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e : {
    'default': e
  };
}

var Vue__default = /*#__PURE__*/_interopDefaultLegacy(Vue);

function findInArray(array, cb) {
  for (var i = 0, length = array.length; i < length; i++) {
    if (cb.apply(cb, [array[i], i, array])) return array[i];
  }
}

function isFunction(func) {
  return typeof func === 'function' || Object.prototype.toString.call(func) === '[object Function]';
}

function isNum(num) {
  return typeof num === 'number' && !isNaN(num);
}

var matchesSelectorFunc = '';

function matchesSelector(el, selector) {
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = findInArray(['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'], function (method) {
      return isFunction(el[method]);
    });
  }

  if (!isFunction(el[matchesSelectorFunc])) return false;
  return el[matchesSelectorFunc](selector);
} // Works up the tree to the draggable itself attempting to match selector.


function matchesSelectorAndParentsTo(el, selector, baseNode) {
  var node = el;

  do {
    if (matchesSelector(node, selector)) return true;
    if (node === baseNode) return false;
    node = node.parentNode;
  } while (node);

  return false;
}

function addEvent(el, event, handler, inputOptions) {
  if (!el) return;

  var options = _objectSpread({
    capture: true
  }, inputOptions);

  if (el.addEventListener) {
    el.addEventListener(event, handler, options);
  } else if (el.attachEvent) {
    el.attachEvent('on' + event, handler);
  } else {
    el['on' + event] = handler;
  }
}

function removeEvent(el, event, handler, inputOptions) {
  if (!el) return;

  var options = _objectSpread({
    capture: true
  }, inputOptions);

  if (el.removeEventListener) {
    el.removeEventListener(event, handler, options);
  } else if (el.detachEvent) {
    el.detachEvent('on' + event, handler);
  } else {
    el['on' + event] = null;
  }
} // Get from offsetParent


function offsetXYFromParent(evt, offsetParent, scale) {
  var isBody = offsetParent === offsetParent.ownerDocument.body;
  var offsetParentRect = isBody ? {
    left: 0,
    top: 0
  } : offsetParent.getBoundingClientRect();
  var x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
  var y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;
  return {
    x: x,
    y: y
  };
}

function getTouch(e, identifier) {
  return e.targetTouches && findInArray(e.targetTouches, function (t) {
    return identifier === t.identifier;
  }) || e.changedTouches && findInArray(e.changedTouches, function (t) {
    return identifier === t.identifier;
  });
}

function getTouchIdentifier(e) {
  if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
  return null;
} // Note we're passing `document` b/c we could be iframed


function addUserSelectStyles(doc) {
  if (!doc) return;
  var styleEl = doc.getElementById('vue-draggable-style-el');

  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'vue-draggable-style-el';
    styleEl.innerHTML = '.vue-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
    styleEl.innerHTML += '.vue-draggable-transparent-selection *::selection {all: inherit;}\n';
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
  }

  if (doc.body) addClassName(doc.body, 'vue-draggable-transparent-selection');
}

function removeUserSelectStyles(doc) {
  if (!doc) return;

  try {
    if (doc.body) removeClassName(doc.body, 'vue-draggable-transparent-selection');
    var selection = doc.getSelection();

    if (selection) {
      selection.empty();
    } else {
      // Remove selection caused by scroll, unless it's a focused input
      // (we use doc.defaultView in case we're in an iframe)
      var _selection = (doc.defaultView || window).getSelection();

      if (_selection && _selection.type !== 'Caret') {
        _selection.removeAllRanges();
      }
    }
  } catch (e) {// probably IE
  }
}

function addClassName(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (!el.className.match(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)")))) {
      el.className += " ".concat(className);
    }
  }
}

function removeClassName(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp("(?:^|\\s)".concat(className, "(?!\\S)"), 'g'), '');
  }
}

function snapToGrid(grid, pendingX, pendingY) {
  var x = Math.round(pendingX / grid[0]) * grid[0];
  var y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
} // Get {x, y} positions from event.


function getControlPosition(e, touchIdentifier, draggableCore) {
  var touchObj = typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null;
  if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch

  var node = findDOMNode(draggableCore); // User can provide an offsetParent if desired.

  var offsetParent = draggableCore.offsetParent || node.offsetParent || node.ownerDocument.body;
  return offsetXYFromParent(touchObj || e, offsetParent, draggableCore.scale);
} // Create an data object exposed by <DraggableCore>'s events


function createCoreData(draggable, x, y) {
  var state = draggable;
  var isStart = !isNum(state.lastX);
  var node = findDOMNode(draggable);

  if (isStart) {
    // If this is our first move, use the x and y as last coords.
    return {
      node: node,
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x: x,
      y: y
    };
  } else {
    // Otherwise calculate proper values.
    return {
      node: node,
      deltaX: x - state.lastX,
      deltaY: y - state.lastY,
      lastX: state.lastX,
      lastY: state.lastY,
      x: x,
      y: y
    };
  }
}

function findDOMNode(draggable) {
  var node = draggable.findDOMNode();

  if (!node) {
    throw new Error('<DraggableCore>: Unmounted during event!');
  }

  return node;
}

var eventsFor = {
  touch: {
    start: 'touchstart',
    move: 'touchmove',
    stop: 'touchend'
  },
  mouse: {
    start: 'mousedown',
    move: 'mousemove',
    stop: 'mouseup'
  }
};
var dragEventFor = eventsFor.mouse;
var VueDraggableCore = Vue__default['default'].extend({
  name: 'VueDraggableCore',
  props: {
    allowAnyClick: {
      type: Boolean,
      "default": false
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    enableUserSelectHack: {
      type: Boolean,
      "default": true
    },
    offsetParent: {
      validator: function validator(value) {
        return value && value.nodeType == 1;
      },
      "default": null
    },
    grid: {
      type: [Array, Object],
      "default": null
    },
    handle: {
      type: String,
      "default": null
    },
    cancel: {
      type: String,
      "default": null
    },
    scale: {
      type: Number,
      "default": 1
    }
  },
  data: function data() {
    return {
      mounted: false,
      dragging: false,
      lastX: NaN,
      lastY: NaN,
      touchIdentifier: null
    };
  },
  mounted: function mounted() {
    this.mounted = true; // Touch handlers must be added with {passive: false} to be cancelable.
    // https://developers.google.com/web/updates/2017/01/scrolling-intervention

    var thisNode = this.findDOMNode();

    if (thisNode) {
      // Add events if slot is default without scopes
      if (this.$slots['default']) {
        addEvent(thisNode, eventsFor.mouse.start, this.mouseDown);
        addEvent(thisNode, eventsFor.mouse.stop, this.mouseUp);
        addEvent(thisNode, eventsFor.touch.stop, this.touchEnd);
      }

      addEvent(thisNode, eventsFor.touch.start, this.touchStart, {
        passive: false
      });
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.mounted = false; // Remove any leftover event handlers. Remove both touch and mouse handlers in case
    // some browser quirk caused a touch event to fire during a mouse move, or vice versa.

    var thisNode = this.findDOMNode();

    if (thisNode) {
      // Remove events if slot is default without scopes
      if (this.$slots['default']) {
        removeEvent(thisNode, eventsFor.mouse.start, this.mouseDown);
        removeEvent(thisNode, eventsFor.mouse.stop, this.mouseUp);
        removeEvent(thisNode, eventsFor.touch.stop, this.touchEnd);
      }

      var ownerDocument = thisNode.ownerDocument;
      removeEvent(ownerDocument, eventsFor.mouse.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.touch.move, this.handleDrag);
      removeEvent(ownerDocument, eventsFor.mouse.stop, this.handleDragStop);
      removeEvent(ownerDocument, eventsFor.touch.stop, this.handleDragStop);
      removeEvent(thisNode, eventsFor.touch.start, this.touchStart, {
        passive: false
      });
      if (this.enableUserSelectHack) removeUserSelectStyles(ownerDocument);
    }
  },
  methods: {
    // Vue Strict Mode compatibility: if `nodeRef` is passed, we will use it instead of trying to find
    // the underlying DOM node ourselves. See the README for more information.
    findDOMNode: function findDOMNode() {
      return this.$refs && this.$refs.element ? this.$ref.element : this.$el;
    },
    handleDragStart: function handleDragStart(e) {
      // Make it possible to attach event handlers on top of this one.
      this.$emit('mousedown', e); // Only accept left-clicks.

      if (!this.allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false; // Get nodes. Be sure to grab relative document (could be iframed)

      var thisNode = this.findDOMNode();

      if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
        throw new Error('<DraggableCore> not mounted on DragStart!');
      }

      var ownerDocument = thisNode.ownerDocument; // Short circuit if handle or cancel prop was provided and selector doesn't match.

      if (this.disabled || !(e.target instanceof ownerDocument.defaultView.Node) || this.handle && !matchesSelectorAndParentsTo(e.target, this.handle, thisNode) || this.cancel && matchesSelectorAndParentsTo(e.target, this.cancel, thisNode)) {
        return;
      } // Prevent scrolling on mobile devices, like ipad/iphone.
      // Important that this is after handle/cancel.


      if (e.type === 'touchstart') e.preventDefault(); // Set touch identifier in component state if this is a touch event. This allows us to
      // distinguish between individual touches on multitouch screens by identifying which
      // touchpoint was set to this element.

      var touchIdentifier = getTouchIdentifier(e);
      this.touchIdentifier = getTouchIdentifier(e); // Get the current drag point from the event. This is used as the offset.

      var position = getControlPosition(e, touchIdentifier, this);
      if (position == null) return;
      var x = position.x,
          y = position.y; // Create an event object with all the data parents need to make a decision here.

      var coreEvent = createCoreData(this, x, y);
      var shouldUpdate = this.$emit('dragStart', coreEvent, e);
      if (shouldUpdate === false || this.mounted === false) return; // Add a style to the body to disable user-select. This prevents text from
      // being selected all over the page.

      if (this.enableUserSelectHack) addUserSelectStyles(ownerDocument); // Initiate dragging. Set the current x and y as offsets
      // so we know how much we've moved during the drag. This allows us
      // to drag elements around even if they have been moved, without issue.

      this.dragging = true;
      this.lastX = x;
      this.lastY = y; // Add events to the document directly so we catch when the user's mouse/touch moves outside of
      // this element. We use different events depending on whether or not we have detected that this
      // is a touch-capable device.

      addEvent(ownerDocument, dragEventFor.move, this.handleDrag);
      addEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
    },
    handleDrag: function handleDrag(e) {
      // Get the current drag point from the event. This is used as the offset.
      var position = getControlPosition(e, this.touchIdentifier, this);
      if (position == null) return;
      var x = position.x,
          y = position.y; // Snap to grid if prop has been provided

      if (Array.isArray(this.grid)) {
        var deltaX = x - this.lastX,
            deltaY = y - this.lastY;

        var _snapToGrid = snapToGrid(this.grid, deltaX, deltaY);

        var _snapToGrid2 = _slicedToArray(_snapToGrid, 2);

        deltaX = _snapToGrid2[0];
        deltaY = _snapToGrid2[1];
        if (!deltaX && !deltaY) return; // skip useless drag

        x = this.lastX + deltaX, y = this.lastY + deltaY;
      }

      var coreEvent = createCoreData(this, x, y);
      var shouldUpdate = this.$emit('drag', coreEvent, e);

      if (shouldUpdate === false || this.mounted === false) {
        try {
          this.handleDragStop(new MouseEvent('mouseup'));
        } catch (err) {
          // Old browsers
          var event = document.createEvent('MouseEvents'); // I see why this insanity was deprecated

          event.initMouseEvent('mouseup', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
          this.handleDragStop(event);
        }

        return;
      }

      this.lastX = x;
      this.lastY = y;
    },
    handleDragStop: function handleDragStop(e) {
      if (!this.dragging) return;
      var position = getControlPosition(e, this.touchIdentifier, this);
      if (position == null) return;
      var x = position.x,
          y = position.y;
      var coreEvent = createCoreData(this, x, y);
      var shouldContinue = this.$emit('dragStop', coreEvent, e);
      if (shouldContinue === false || this.mounted === false) return false;
      var thisNode = this.findDOMNode();

      if (thisNode) {
        // Remove user-select hack
        if (this.enableUserSelectHack) removeUserSelectStyles(thisNode.ownerDocument);
      } // Reset the el.


      this.dragging = false;
      this.lastX = NaN;
      this.lastY = NaN;

      if (thisNode) {
        removeEvent(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
        removeEvent(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
      }
    },
    mouseDown: function mouseDown(e) {
      dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

      return this.handleDragStart(e);
    },
    mouseUp: function mouseUp(e) {
      dragEventFor = eventsFor.mouse;
      return this.handleDragStop(e);
    },
    // Same as onMouseDown (start drag), but now consider this a touch device.
    touchStart: function touchStart(e) {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return this.handleDragStart(e);
    },
    touchEnd: function touchEnd(e) {
      // We're on a touch device now, so change the event handlers
      dragEventFor = eventsFor.touch;
      return this.handleDragStop(e);
    },
    children: function children(h) {
      if (this.$scopedSlots["default"]) {
        return this.$scopedSlots["default"]({
          mouseDown: this.mouseDown,
          mouseUp: this.mouseUp,
          touchEnd: this.touchEnd
        });
      }

      if (this.$slots["default"]) {
        return this.$slots["default"];
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

function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  Vue.component(options.vueDraggableCoreName || 'VueDraggableCore', VueDraggableCore);
}

var index = {
  install: install
};
exports.VueDraggableCore = VueDraggableCore;
exports["default"] = index;
//# sourceMappingURL=vue-draggable-core.common.js.map
