<template>
    <VueDraggableCore
        v-bind="draggableProps"
        :handle="handle"
        :cancel="`.vue-resizable-handle${cancel ? ',' + cancel : ''}`"
        :disabled="!isDraggable"
        :offset-parent="offsetParent"
        @dragStart="dragStart"
        @drag="drag"
        @dragStop="dragStop"
    >
        <template slot-scope="draggableCoreProps">
            <VueResizableCore
                v-bind="resizableProps"
                :draggable-props="{
                    ...(resizableProps.draggableProps && resizableProps.draggableProps),
                    disabled: !isResizable
                }"
                :width="newPos.width"
                :height="newPos.height"
                :min-constraints="minConstraints"
                :max-constraints="maxConstraints"
                :transform-scale="transformScale"
                :resize-handles="resizeHandles"
                :offset-parent="offsetParent"
                @resizeStart="resizeStart"
                @resize="resize"
                @resizeStop="resizeStop"
            >
                <template slot-scope="resizableCoreProps">
                    <component
                        :is="tag"
                        :class="classes"
                        :style="styles"
                        @mousedown="draggableCoreProps.mouseDown"
                        @mouseup="draggableCoreProps.mouseUp"
                        @touchend="draggableCoreProps.touchEnd"
                    >
                        <slot />
                        <component
                            :is="resizeHandle.wrapper"
                            v-for="resizeHandle in resizableCoreProps.resizeHandles"
                            :key="resizeHandle.axis"
                            v-bind="resizeHandle.props"
                            v-on="resizeHandle.on"
                        >
                            <span v-show="isResizable && !static" :class="[resizeHandle.class, !isResizable && 'vue-resizable-hide']"></span>
                        </component>
                    </component>
                </template>
            </VueResizableCore>
        </template>
    </VueDraggableCore>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import isEqual from 'lodash.isEqual';
import { DroppingPosition, perc, VueDraggableCallbackData, setTopLeft, setTransform, Position } from './lib/utils';
import {
    calcGridColWidth,
    calcGridItemPosition,
    calcGridItemWHPx,
    calcWH,
    calcXY,
    clamp,
    PositionParams
} from './lib/calculateUtils';
import { VueDraggableCore } from 'vue-draggable-core';
import { VueResizableCore } from 'vue-resizable-core';

type PartialPosition = { top: number; left: number };

/**
 * An individual item within a VueGridLayout.
 */
export default Vue.extend({
    name: 'VueGridItem',
    components: {
        VueDraggableCore,
        VueResizableCore
    },
    props: {
        cancel: {
            type: String,
            default: ''
        },
        handle: {
            type: String,
            default: ''
        },
        i: {
            type: String,
            required: true
        },
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
        w: {
            type: Number,
            required: true
        },
        h: {
            type: Number,
            required: true
        },
        minW: {
            type: Number,
            default: 1
        },
        maxW: {
            type: Number,
            default: Infinity
        },
        minH: {
            type: Number,
            validator(value: number): boolean {
                return value >= 1;
            },
            default: 1
        },
        maxH: {
            type: Number,
            default: Infinity
        },
        resizeHandles: {
            type: Array as PropType<Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>>,
            default: () => ['sw']
        },
        cols: {
            type: Number,
            required: true
        },
        containerWidth: {
            type: Number,
            required: true
        },
        margin: {
            type: [Array, Object] as PropType<[number, number]>,
            required: true
        },
        containerPadding: {
            type: [Array, Object] as PropType<[number, number]>,
            required: true
        },
        rowHeight: {
            type: Number,
            required: true
        },
        maxRows: {
            type: Number,
            required: true
        },
        isDraggable: {
            type: Boolean
        },
        isResizable: {
            type: Boolean
        },
        isBounded: {
            type: Boolean
        },
        static: {
            type: Boolean,
            default: false
        },
        useCSSTransforms: {
            type: Boolean,
            default: true
        },
        usePercentages: {
            type: Boolean,
            default: false
        },
        transformScale: {
            type: Number,
            default: 1
        },
        droppingPosition: {
            type: Object as PropType<DroppingPosition>,
            default: null
        },
        draggableProps: {
            type: Object,
            default: () => ({})
        },
        resizableProps: {
            type: Object,
            default: () => ({})
        },
        tag: {
            type: [Object, Function, String],
            default: 'div'
        },
        offsetParent: {
            validator(value: any): boolean {
                return value && value.nodeType == 1;
            },
            default: null
        }
    },
    data() {
        return {
            resizing: null,
            dragging: null,
            currentNode: null
        };
    },
    computed: {
        classes() {
            return {
                'vue-grid-item': true,
                static: this.static,
                resizing: Boolean(this.resizing),
                'vue-draggable': this.isDraggable,
                'vue-draggable-dragging': Boolean(this.dragging),
                dropping: Boolean(this.droppingPosition),
                cssTransforms: this.useCSSTransforms
            };
        },
        styles() {
            return this.createStyle(this.pos());
        },
        newPos() {
            return this.pos();
        },
        getPositionParams(): PositionParams {
            return {
                cols: this.cols,
                containerPadding: this.containerPadding,
                containerWidth: this.containerWidth,
                margin: this.margin,
                maxRows: this.maxRows,
                rowHeight: this.rowHeight
            };
        },
        maxWidth(): number | null {
            return this.isResizable
                ? calcGridItemPosition(this.getPositionParams, 0, 0, this.cols - this.x, 0).width
                : null;
        },
        minConstraints(): [number, number] | null {
            if (this.isResizable) {
                const mins = calcGridItemPosition(this.getPositionParams, 0, 0, this.minW, this.minH);
                return [mins.width, mins.height];
            }
            return null;
        },
        maxConstraints(): [number, number] | null {
            if (this.isResizable) {
                const maxes = calcGridItemPosition(this.getPositionParams, 0, 0, this.maxW, this.maxH);
                return [Math.min(maxes.width, this.maxWidth), Math.min(maxes.height, Infinity)];
            }
            return null;
        },
        posWidth() {
            const pos = this.pos;
            return pos ? pos.width : 0;
        },
        posHeight() {
            const pos = this.pos;
            return pos ? pos.height : 0;
        }
    },
    watch: {
        'droppingPosition.left'(newVal: DroppingPosition, oldVal: DroppingPosition) {
            if (!isEqual(newVal, oldVal)) {
                this.moveDroppingItem(oldVal);
            }
        },
        'droppingPosition.top'(newVal: DroppingPosition, oldVal: DroppingPosition) {
            if (!isEqual(newVal, oldVal)) {
                this.moveDroppingItem(oldVal);
            }
        }
    },
    mounted() {
        this.moveDroppingItem({});
    },
    methods: {
        pos() {
            return calcGridItemPosition(this.getPositionParams, this.x, this.y, this.w, this.h, this);
        },
        // // When a droppingPosition is present, this means we should fire a move event, as if we had moved
        // // this element by `x, y` pixels.
        moveDroppingItem(oldVal?: Partial<DroppingPosition>): void {
            if (!this.droppingPosition) return;

            const prevDroppingPosition = (oldVal && oldVal) || {
                left: 0,
                top: 0
            };

            const shouldDrag =
                (this.dragging && this.droppingPosition.left !== prevDroppingPosition.left) ||
                this.droppingPosition.top !== prevDroppingPosition.top;

            if (!this.dragging) {
                this.$emit(
                    'dragStart',
                    {
                        node: this.$el as HTMLElement,
                        deltaX: this.droppingPosition.left,
                        deltaY: this.droppingPosition.top
                    },
                    this.droppingPosition.e
                );
            } else if (shouldDrag) {
                const deltaX = this.droppingPosition.left - ((this.dragging as unknown) as PartialPosition).left;
                const deltaY = this.droppingPosition.top - ((this.dragging as unknown) as PartialPosition).top;

                this.$emit(
                    'drag',
                    {
                        node: this.$el as HTMLElement,
                        deltaX,
                        deltaY
                    },
                    this.droppingPosition.e
                );
            }
        },
        /**
         * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
         * well when server rendering, and the only way to do that properly is to use percentage width/left because
         * we don't know exactly what the browser viewport is.
         * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
         * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
         *
         * @param  {Object} pos Position object with width, height, left, top.
         * @return {Object}     Style object.
         */
        createStyle(pos: Position): { [key: string]: string } {
            // const { usePercentages, containerWidth, useCSSTransforms } = this;

            let style;
            // CSS Transforms support (default)
            if (this.useCSSTransforms) {
                style = setTransform(pos);
            } else {
                // top,left (slow)
                style = setTopLeft(pos);

                // This is used for server rendering.
                if (this.usePercentages) {
                    (style as any).left = perc(pos.left / this.containerWidth);
                    (style as any).width = perc(pos.width / this.containerWidth);
                }
            }

            return style as any;
        },
        /**
         * onDragStart event handler
         * @param  {Object} callbackData  an object with node, delta and position information
         * @param  {Event}  e             event data
         */
        dragStart({ node }: VueDraggableCallbackData, e: Event): any {
            const newPosition: PartialPosition = { top: 0, left: 0 };

            // TODO: this wont work on nested parents
            const offsetParent = this.offsetParent || node.offsetParent;
            if (!offsetParent) return;
            const parentRect = offsetParent.getBoundingClientRect();
            const clientRect = node.getBoundingClientRect();
            const cLeft = clientRect.left / this.transformScale;
            const pLeft = parentRect.left / this.transformScale;
            const cTop = clientRect.top / this.transformScale;
            const pTop = parentRect.top / this.transformScale;
            newPosition.left = cLeft - pLeft + offsetParent.scrollLeft;
            newPosition.top = cTop - pTop + offsetParent.scrollTop;
            this.dragging = { ...newPosition };

            // Call callback with this data
            const { x, y } = calcXY(this.getPositionParams, newPosition.top, newPosition.left, this.w, this.h);

            this.$emit('dragStart', this.i, x, y, { e, node, newPosition });
            // return onDragStart.call(this, i, x, y, { e, node, newPosition });
        },
        /**
         * onDrag event handler
         * @param  {Object} callbackData  an object with node, delta and position information
         * @param  {Event}  e             event data
         */
        drag({ node, deltaX, deltaY }: VueDraggableCallbackData, e: Event): any {
            deltaX /= this.transformScale;
            deltaY /= this.transformScale;

            if (!this.dragging) {
                throw new Error('onDrag called before onDragStart.');
            }
            let top = this.dragging.top + deltaY;
            let left = this.dragging.left + deltaX;

            const positionParams = this.getPositionParams;

            // Boundary calculations; keeps items within the grid
            if (this.isBounded) {
                const { offsetParent } = node;

                if (offsetParent) {
                    const { margin, rowHeight } = this;
                    const bottomBoundary = offsetParent.clientHeight - calcGridItemWHPx(this.h, rowHeight, margin[1]);
                    top = clamp(top, 0, bottomBoundary);

                    const colWidth = calcGridColWidth(positionParams);
                    const rightBoundary = this.containerWidth - calcGridItemWHPx(this.w, colWidth, margin[0]);
                    left = clamp(left, 0, rightBoundary);
                }
            }

            const newPosition: PartialPosition = { top, left };
            this.dragging = { ...newPosition };
            // this.$set(this.dragging, top, newPosition.top);
            // this.$set(this.dragging, left, newPosition.left);

            // Call callback with this data
            const { x, y } = calcXY(positionParams, top, left, this.w, this.h);
            this.$emit('drag', this.i, x, y, { e, node, newPosition });
            // return onDrag.call(this, i, x, y, { e, node, newPosition });
        },
        /**
         * onDragStop event handler
         * @param  {Object} callbackData  an object with node, delta and position information
         * @param  {Event}  e             event data
         */
        dragStop({ node }: VueDraggableCallbackData, e: Event): any {
            if (!this.dragging) {
                throw new Error('onDragEnd called before onDragStart.');
            }
            const { left, top } = this.dragging;
            const newPosition: PartialPosition = { top, left };
            this.dragging = null;

            const { x, y } = calcXY(this.getPositionParams, top, left, this.w, this.h);
            this.$emit('dragStop', this.i, x, y, { e, node, newPosition });
            // return onDragStop.call(this, i, x, y, { e, node, newPosition });
        },
        /**
         * onResizeStop event handler
         * @param  {Object} callbackData  an object with node and size information
         * @param  {Event}  e             event data
         */
        resizeStop(callbackData: { node: HTMLElement; size: Position }, e: Event) {
            this.onResizeHandler(callbackData, e, 'resizeStop');
        },
        /**
         * onResizeStart event handler
         * @param  {Object} callbackData  an object with node and size information
         * @param  {Event}  e             event data
         */
        resizeStart(callbackData: { node: HTMLElement; size: Position }, e: Event) {
            this.onResizeHandler(callbackData, e, 'resizeStart');
        },
        /**
         * onResize event handler
         * @param  {Object} callbackData  an object with node and size information
         * @param  {Event}  e             event data
         */
        resize(callbackData: { node: HTMLElement; size: Position }, e: Event) {
            this.onResizeHandler(callbackData, e, 'resize');
        },
        /**
         * Wrapper around drag events to provide more useful data.
         * All drag events call the function with the given handler name,
         * with the signature (index, x, y).
         *
         * @param node
         * @param size
         * @param e
         * @param  {String} handlerName Handler name to wrap.
         * @return {Function}           Handler function.
         */
        onResizeHandler({ node, size }: { node: HTMLElement; size: Position }, e: Event, handlerName: string) {
            // const { cols, x, y, i, maxH, minH } = this;
            let { minW, maxW } = this;

            // Get new XY
            let { w, h } = calcWH(this.getPositionParams, size.width, size.height, this.x, this.y);

            // minW should be at least 1
            minW = Math.max(minW, 1);

            // maxW should be at most (cols - x)
            maxW = Math.min(maxW, this.cols - this.x);

            // Min/max capping
            w = clamp(w, minW, maxW);
            h = clamp(h, this.minH, this.maxH);

            this.resizing = handlerName === 'resizeStop' ? null : { ...size };
            this.$emit(handlerName, this.i, w, h, { e, node, size });
            // handler.call(this, i, w, h, { e, node, size });
        }
    }
});
</script>
