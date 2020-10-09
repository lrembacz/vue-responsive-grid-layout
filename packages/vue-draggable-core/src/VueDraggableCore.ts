import Vue, { CreateElement, PropType, VNode } from 'vue';
import {
    addEvent,
    addUserSelectStyles,
    getTouchIdentifier,
    matchesSelectorAndParentsTo,
    removeEvent,
    removeUserSelectStyles
} from './utils/domFns';
import { createCoreData, getControlPosition, snapToGrid } from './utils/postitionFns';
import log from './utils/log';
import { MouseTouchEvent } from './utils/types';

const eventsFor = {
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

let dragEventFor = eventsFor.mouse;

export type DraggableData = {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
};

export type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void;

export default Vue.extend({
    name: 'VueDraggableCore',
    props: {
        allowAnyClick: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        enableUserSelectHack: {
            type: Boolean,
            default: true
        },
        offsetParent: {
            type: Object as PropType<HTMLElement>,
            validator(value: any): boolean {
                return value && value.nodeType == 1;
            },
            default: null
        },
        grid: {
            type: [Array, Object] as PropType<[number, number]>,
            default: null
        },
        handle: {
            type: String,
            default: null
        },
        cancel: {
            type: String,
            default: null
        },
        scale: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            mounted: false,
            dragging: false,
            lastX: NaN,
            lastY: NaN,
            touchIdentifier: null
        };
    },
    mounted() {
        this.mounted = true;
        // Touch handlers must be added with {passive: false} to be cancelable.
        // https://developers.google.com/web/updates/2017/01/scrolling-intervention
        const thisNode = this.findDOMNode();

        // Add events if slot is default without scopes
        if (this.$slots['default']) {
            addEvent(thisNode, eventsFor.mouse.start, this.mouseDown);
            addEvent(thisNode, eventsFor.mouse.stop, this.mouseUp);
            addEvent(thisNode, eventsFor.touch.stop, this.touchEnd);
        }

        if (thisNode) {
            addEvent(thisNode, eventsFor.touch.start, this.touchStart, {
                passive: false
            });
        }
    },
    beforeDestroy() {
        this.mounted = false;
        // Remove any leftover event handlers. Remove both touch and mouse handlers in case
        // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
        const thisNode = this.findDOMNode();
        if (thisNode) {
            // Remove events if slot is default without scopes
            if (this.$slots['default']) {
                removeEvent(thisNode, eventsFor.mouse.start, this.mouseDown);
                removeEvent(thisNode, eventsFor.mouse.stop, this.mouseUp);
                removeEvent(thisNode, eventsFor.touch.stop, this.touchEnd);
            }

            const { ownerDocument } = thisNode;
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
        findDOMNode(): HTMLElement {
            return this.$refs && this.$refs.element ? this.$ref.element : this.$el;
        },
        handleDragStart(e: MouseTouchEvent) {
            // Make it possible to attach event handlers on top of this one.
            this.$emit('mousedown', e);

            // Only accept left-clicks.
            if (!this.allowAnyClick && e.button !== 0) return false;

            // Get nodes. Be sure to grab relative document (could be iframed)
            const thisNode = this.findDOMNode();
            if (!thisNode || !thisNode.ownerDocument || !thisNode.ownerDocument.body) {
                throw new Error('<DraggableCore> not mounted on DragStart!');
            }
            const { ownerDocument } = thisNode;

            // Short circuit if handle or cancel prop was provided and selector doesn't match.
            if (
                this.disabled ||
                !(e.target instanceof (ownerDocument.defaultView as any).Node) ||
                (this.handle && !matchesSelectorAndParentsTo(e.target as Node, this.handle, thisNode)) ||
                (this.cancel && matchesSelectorAndParentsTo(e.target as Node, this.cancel, thisNode))
            ) {
                return;
            }

            // Prevent scrolling on mobile devices, like ipad/iphone.
            // Important that this is after handle/cancel.
            if (e.type === 'touchstart') e.preventDefault();

            // Set touch identifier in component state if this is a touch event. This allows us to
            // distinguish between individual touches on multitouch screens by identifying which
            // touchpoint was set to this element.
            const touchIdentifier = getTouchIdentifier(e);
            this.touchIdentifier = getTouchIdentifier(e);

            // Get the current drag point from the event. This is used as the offset.
            const position = getControlPosition(e, touchIdentifier, this as any);
            if (position == null) return;
            const { x, y } = position;

            // Create an event object with all the data parents need to make a decision here.
            const coreEvent = createCoreData(this as any, x, y);

            log('DraggableCore: handleDragStart: %j', coreEvent);

            // Call event handler. If it returns explicit false, cancel.
            log('emitting @dragStart', coreEvent, e);
            const shouldUpdate = this.$emit('dragStart', coreEvent, e);
            if (shouldUpdate === false || this.mounted === false) return;

            // Add a style to the body to disable user-select. This prevents text from
            // being selected all over the page.
            if (this.enableUserSelectHack) addUserSelectStyles(ownerDocument);

            // Initiate dragging. Set the current x and y as offsets
            // so we know how much we've moved during the drag. This allows us
            // to drag elements around even if they have been moved, without issue.
            this.dragging = true;
            this.lastX = x;
            this.lastY = y;

            // Add events to the document directly so we catch when the user's mouse/touch moves outside of
            // this element. We use different events depending on whether or not we have detected that this
            // is a touch-capable device.
            addEvent(ownerDocument, dragEventFor.move, this.handleDrag);
            addEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
        },
        handleDrag(e: MouseTouchEvent) {
            // Get the current drag point from the event. This is used as the offset.
            const position = getControlPosition(e, this.touchIdentifier, this as any);
            if (position == null) return;
            let { x, y } = position;

            // Snap to grid if prop has been provided
            if (Array.isArray(this.grid)) {
                let deltaX = x - this.lastX,
                    deltaY = y - this.lastY;
                [deltaX, deltaY] = snapToGrid(this.grid, deltaX, deltaY);
                if (!deltaX && !deltaY) return; // skip useless drag
                (x = this.lastX + deltaX), (y = this.lastY + deltaY);
            }

            const coreEvent = createCoreData(this, x, y);

            log('DraggableCore: handleDrag: %j', coreEvent);

            // Call event handler. If it returns explicit false, cancel.
            log('emitting @drag', coreEvent, e);
            const shouldUpdate = this.$emit('drag', coreEvent, e);
            if (shouldUpdate === false || this.mounted === false) {
                try {
                    this.handleDragStop(new MouseEvent('mouseup') as MouseTouchEvent);
                } catch (err) {
                    // Old browsers
                    const event = (document.createEvent('MouseEvents') as any) as MouseEvent;
                    // I see why this insanity was deprecated
                    event.initMouseEvent(
                        'mouseup',
                        true,
                        true,
                        window,
                        0,
                        0,
                        0,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        null
                    );
                    this.handleDragStop(event as MouseTouchEvent);
                }
                return;
            }

            this.lastX = x;
            this.lastY = y;
        },
        handleDragStop(e: MouseTouchEvent) {
            if (!this.dragging) return;

            const position = getControlPosition(e, this.touchIdentifier, this as any);
            if (position == null) return;
            const { x, y } = position;
            const coreEvent = createCoreData(this as any, x, y);

            // Call event handler. If it returns explicit false, cancel.
            log('emitting @dragStop', coreEvent, e);
            const shouldContinue = this.$emit('dragStop', coreEvent, e);
            if (shouldContinue === false || this.mounted === false) return false;

            const thisNode = this.findDOMNode();
            if (thisNode) {
                // Remove user-select hack
                if (this.enableUserSelectHack) removeUserSelectStyles(thisNode.ownerDocument);
            }

            log('DraggableCore: handleDragStop: %j', coreEvent);

            // Reset the el.
            this.dragging = false;
            this.lastX = NaN;
            this.lastY = NaN;

            if (thisNode) {
                // Remove event handlers
                log('DraggableCore: Removing handlers');
                removeEvent(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
                removeEvent(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
            }
        },
        mouseDown(e: MouseTouchEvent) {
            dragEventFor = eventsFor.mouse; // on touchscreen laptops we could switch back to mouse

            return this.handleDragStart(e);
        },
        mouseUp(e: MouseTouchEvent) {
            dragEventFor = eventsFor.mouse;

            return this.handleDragStop(e);
        },
        // Same as onMouseDown (start drag), but now consider this a touch device.
        touchStart(e: MouseTouchEvent) {
            // We're on a touch device now, so change the event handlers
            dragEventFor = eventsFor.touch;

            return this.handleDragStart(e);
        },
        touchEnd(e: MouseTouchEvent) {
            // We're on a touch device now, so change the event handlers
            dragEventFor = eventsFor.touch;

            return this.handleDragStop(e);
        },
        children(h: CreateElement): VNode | VNode[] {
            if (this.$scopedSlots.default) {
                return this.$scopedSlots.default({
                    mouseDown: this.mouseDown,
                    mouseUp: this.mouseUp,
                    touchEnd: this.touchEnd
                });
            }
            if (this.$slots.default) {
                return this.$slots.default;
            }
            return h('div');
        }
    },
    render(h): VNode {
        const children = this.children(h);
        if (Array.isArray(children)) {
            return children[0];
        }
        return children;
    }
});
