import Vue, { CreateElement, PropType, VNode } from 'vue';
import { Axis, DragCallbackData, ResizeHandleAxis } from './types';
import { VueDraggableCore } from 'vue-draggable-core';

export default Vue.extend({
    name: 'VueResizableCore',
    props: {
        width: {
            type: Number,
            default: 0
        },
        height: {
            type: Number,
            default: 0
        },
        draggableProps: {
            type: Object,
            default: undefined
        },
        handleSize: {
            type: [Array, Object] as PropType<[number, number]>,
            default: () => [20, 20]
        },
        lockAspectRatio: {
            type: Boolean,
            default: false
        },
        axis: {
            type: String as PropType<Axis>,
            default: 'both'
        },
        minConstraints: {
            type: [Array, Object] as PropType<[number, number]>,
            default: () => [20, 20]
        },
        maxConstraints: {
            type: [Array, Object] as PropType<[number, number]>,
            default: () => [Infinity, Infinity]
        },
        resizeHandles: {
            type: Array as PropType<ResizeHandleAxis[]>,
            default: ['se']
        },
        resizableHandleClass: {
            type: [Object, String, Array],
            default: 'vue-resizable-handle'
        },
        transformScale: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            lastHandleRect: null,
            slack: null
        };
    },

    beforeDestroy() {
        this.resetData();
    },
    methods: {
        lockAspectRatioFn(width: number, height: number, aspectRatio: number): [number, number] {
            height = width / aspectRatio;
            width = height * aspectRatio;
            return [width, height];
        },
        resetData() {
            this.lastHandleRect = this.slack = null;
        },
        // Clamp width and height within provided constraints
        runConstraints(width: number, height: number): [number, number] {
            const [min, max] = [this.minConstraints, this.maxConstraints];
            if (!min && !max) return [width, height];

            // If constraining to min and max, we need to also fit width and height to aspect ratio.
            if (this.lockAspectRatio) {
                const resizingHorizontally = height === this.height;
                if (resizingHorizontally) {
                    const ratio = this.width / this.height;
                    height = width / ratio;
                    width = height * ratio;
                } else {
                    // Take into account vertical resize with N/S handles on locked aspect
                    // ratio. Calculate the change height-first, instead of width-first
                    const ratio = this.height / this.width;
                    width = height / ratio;
                    height = width * ratio;
                }
            }

            const [oldW, oldH] = [width, height];

            // Add slack to the values used to calculate bound position. This will ensure that if
            // we start removing slack, the element won't Vue to it right away until it's been
            // completely removed.
            let [slackW, slackH] = this.slack || [0, 0];
            width += slackW;
            height += slackH;

            if (min) {
                width = Math.max(min[0], width);
                height = Math.max(min[1], height);
            }
            if (max) {
                width = Math.min(max[0], width);
                height = Math.min(max[1], height);
            }

            // If the width or height changed, we must have introduced some slack. Record it for the next iteration.
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
        resizeHandler(handlerName: 'resize' | 'resizeStart' | 'resizeStop', axis: ResizeHandleAxis): Function {
            return ({ node, deltaX, deltaY }: DragCallbackData, e: any) => {
                // Reset data in case it was left over somehow (should not be possible)
                if (handlerName === 'resizeStart') this.resetData();

                // Axis restrictions
                const canDragX = (this.axis === 'both' || this.axis === 'x') && axis !== 'n' && axis !== 's';
                const canDragY = (this.axis === 'both' || this.axis === 'y') && axis !== 'e' && axis !== 'w';
                // No dragging possible.
                if (!canDragX && !canDragY) return;

                // Decompose axis for later use
                const axisV = axis[0];
                const axisH = axis[axis.length - 1]; // intentionally not axis[1], so that this catches axis === 'w' for example

                // Track the element being dragged to account for changes in position.
                // If a handle's position is changed between callbacks, we need to factor this in to the next callback.
                // Failure to do so will cause the element to "skip" when resized upwards or leftwards.
                const handleRect = node.getBoundingClientRect();
                if (this.lastHandleRect != null) {
                    // If the handle has repositioned on either axis since last render,
                    // we need to increase our callback values by this much.
                    // Only checking 'n', 'w' since resizing by 's', 'w' won't affect the overall position on page,
                    if (axisH === 'w') {
                        const deltaLeftSinceLast = handleRect.left - this.lastHandleRect.left;
                        deltaX += deltaLeftSinceLast;
                    }
                    if (axisV === 'n') {
                        const deltaTopSinceLast = handleRect.top - this.lastHandleRect.top;
                        deltaY += deltaTopSinceLast;
                    }
                }
                // Storage of last rect so we know how much it has really moved.
                this.lastHandleRect = handleRect;

                // Reverse delta if using top or left drag handles.
                if (axisH === 'w') deltaX = -deltaX;
                if (axisV === 'n') deltaY = -deltaY;

                // Update w/h by the deltas. Also factor in transformScale.
                let width = this.width + (canDragX ? deltaX / this.transformScale : 0);
                let height = this.height + (canDragY ? deltaY / this.transformScale : 0);

                // Run user-provided constraints.
                [width, height] = this.runConstraints(width, height);

                const dimensionsChanged = width !== this.width || height !== this.height;

                // Don't call 'onResize' if dimensions haven't changed.
                const shouldSkipCb = handlerName === 'resize' && !dimensionsChanged;
                if (!shouldSkipCb) {
                    if (typeof e.persist === 'function') e.persist();
                    this.$emit(handlerName, { node, size: { width, height }, handle: axis }, e);
                }

                // Reset internal data
                if (handlerName === 'resizeStop') this.resetData();
            };
        },
        children(h: CreateElement): VNode | VNode[] {
            if (this.$scopedSlots.default) {
                return this.$scopedSlots.default({
                    resizeHandles: this.resizeHandles.map((handleAxis: ResizeHandleAxis) => ({
                        axis: handleAxis,
                        wrapper: VueDraggableCore,
                        props: this.draggableProps,
                        on: {
                            dragStop: this.resizeHandler('resizeStop', handleAxis),
                            dragStart: this.resizeHandler('resizeStart', handleAxis),
                            drag: this.resizeHandler('resize', handleAxis)
                        },
                        class: `${this.resizableHandleClass} ${this.resizableHandleClass}-${handleAxis}`
                    }))
                });
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
