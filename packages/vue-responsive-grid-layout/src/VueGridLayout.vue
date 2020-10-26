<template>
    <div
        :class="classes"
        :style="styles"
        @drop="isDroppable ? onDrop : noop"
        @dragLeave="isDroppable ? onDragLeave : noop"
        @dragEnter="isDroppable ? onDragEnter : noop"
        @dragOver="isDroppable ? onDragOver : noop"
    >
        <VueGridItem
            v-for="l in currentLayout"
            :key="l.i"
            :container-width="width"
            :cols="cols"
            :margin="margin"
            :container-padding="containerPadding || margin"
            :max-rows="maxRows"
            :row-height="rowHeight"
            :cancel="draggableCancel"
            :handle="draggableHandle"
            :is-draggable="isItemDraggable(l)"
            :is-resizable="isItemResizable(l)"
            :is-bounded="isItemBounded(l)"
            :use-c-s-s-transforms="useCSSTransforms && mounted"
            :use-percentages="!mounted"
            :transform-scale="transformScale"
            :w="l.w"
            :h.sync="l.h"
            :x="l.x"
            :y="l.y"
            :i="l.i"
            :min-h="l.minH"
            :min-w="l.minW"
            :max-w="l.maxW"
            :max-h="l.maxH"
            :static="l.static"
            :dropping-position="isDroppingItem ? droppingPosition : undefined"
            :resize-handles="l.resizeHandles || resizeHandles"
            :offset-parent="$el"
            :height-from-children="isHeightFromChildren(i)"
            @dragStart="onDragStart"
            @dragStop="onDragStop"
            @drag="onDrag"
            @resizeStart="onResizeStart"
            @resizeStop="onResizeStop"
            @resize="onResize"
            @heightChange="onHeightChange"
        >
            <slot name="item" :w="l.w" :h="l.h" :x="l.x" :y="l.y" :i="l.i"></slot>
        </VueGridItem>
        <VueGridItem
            v-show="activeDrag"
            class="vue-grid-placeholder"
            :cols="cols"
            :margin="margin"
            :transform-scale="transformScale"
            :use-c-s-s-transforms="useCSSTransforms"
            :is-bounded="false"
            :is-resizable="false"
            :is-draggable="false"
            :row-height="rowHeight"
            :container-width="width"
            :container-padding="containerPadding || margin"
            :max-rows="maxRows"
            :w="(activeDrag && activeDrag.w) || 0"
            :h="(activeDrag && activeDrag.h) || 0"
            :x="(activeDrag && activeDrag.x) || 0"
            :y="(activeDrag && activeDrag.y) || 0"
            :i="(activeDrag && activeDrag.i) || 'placeholder'"
        >
            <div />
        </VueGridItem>
    </div>
</template>
<script lang="ts">
import VueGridLayoutProps from './VueGridLayoutProps';
import isEqual from 'lodash.isEqual';
import debounce from 'javascript-debounce';
import {
    bottom,
    cloneLayoutItem,
    compact,
    DragOverEvent,
    getAllCollisions,
    getLayoutItem,
    GridDragEvent,
    GridResizeEvent,
    Layout,
    LayoutItem,
    moveElement,
    noop,
    synchronizeLayoutWithChildren
} from './lib/utils';
import { PropType } from 'vue';
import VueGridItem from './VueGridItem.vue';
import { calcXY, PositionParams } from './lib/calculateUtils';

const layoutClass = 'vue-grid-layout';

let isFirefox = false;
// Try...catch will protect from navigator not existing (e.g. node) or a bad implementation of navigator
try {
    isFirefox = /firefox/i.test(navigator.userAgent);
} catch (e) {
    /* Ignore */
}

let dragEnterCounter = 0;

export default VueGridLayoutProps.extend({
    name: 'VueGridLayout',
    components: { VueGridItem },
    props: {
        layout: {
            type: Array as PropType<Layout>,
            default: () => []
        }
    },
    data() {
        return {
            activeDrag: null,
            currentLayout: [],
            mounted: false,
            oldDragItem: null,
            oldLayout: null,
            oldResizeItem: null,
            droppingDOMNode: null,
            noop: noop
        };
    },
    computed: {
        classes() {
            return layoutClass;
        },
        styles() {
            return {
                height: this.containerHeight()
            };
        }
    },
    created() {
        this.currentLayout = this.layout;
    },
    mounted() {
        this.mounted = true;
        this.currentLayout = synchronizeLayoutWithChildren(this.layout, this.$children, this.cols, this.compactType);
        this.onLayoutMaybeChanged(this.currentLayout, this.layout);
    },
    watch: {
        layout: {
            handler(newLayout: Layout) {
                this.onLayoutMaybeChanged(newLayout, this.currentLayout);
            },
            deep: true
        }
    },
    methods: {
        onHeightChange: debounce(function() {
            const layout = synchronizeLayoutWithChildren(this.currentLayout, this.$children, this.cols, this.compactType);
            this.onLayoutMaybeChanged(layout, this.currentLayout);
        }, 0),
        isHeightFromChildren(i: string) {
            return Array.isArray(this.heightFromChildren)
                ? this.heightFromChildren.indexOf(i) !== -1
                : typeof this.heightFromChildren === 'boolean'
                    ? this.heightFromChildren
                    : false;
        },
        isItemDraggable(l: LayoutItem) {
            return typeof l.isDraggable === 'boolean' ? l.isDraggable : !l.static && this.isDraggable;
        },
        isItemResizable(l: LayoutItem) {
            return typeof l.isResizable === 'boolean' ? l.isResizable : !l.static && this.isResizable;
        },
        isItemBounded(l: LayoutItem) {
            return this.isItemDraggable(l) && this.isBounded && l.isBounded !== false;
        },
        containerHeight() {
            if (!this.autoSize) return;
            const nbRow = bottom(this.currentLayout);
            const containerPaddingY = this.containerPadding ? this.containerPadding[1] : this.margin[1];
            return nbRow * this.rowHeight + (nbRow - 1) * this.margin[1] + containerPaddingY * 2 + 'px';
        },
        /**
         * When dragging starts
         * @param {String} i Id of the child
         * @param {Number} x X position of the move
         * @param {Number} y Y position of the move
         * @param {Event} e The mousedown event
         * @param {Element} node The current dragging DOM element
         */
        onDragStart(i: string, x: number, y: number, { e, node }: GridDragEvent) {
            const { currentLayout } = this;
            const l = getLayoutItem(currentLayout, i);
            if (!l) return;

            this.oldDragItem = cloneLayoutItem(l);
            this.oldLayout = this.currentLayout;

            this.$emit('dragStart', currentLayout, l, l, null, e, node);
        },
        /**
         * Each drag movement create a new dragelement and move the element to the dragged location
         * @param {String} i Id of the child
         * @param {Number} x X position of the move
         * @param {Number} y Y position of the move
         * @param {Event} e The mousedown event
         * @param {Element} node The current dragging DOM element
         */
        onDrag(i: string, x: number, y: number, { e, node }: GridDragEvent) {
            const { oldDragItem, cols, compactType, preventCollision } = this;
            let { currentLayout } = this;
            const l = getLayoutItem(currentLayout, i);
            if (!l) return;

            // Create placeholder (display only)
            const placeholder = {
                w: l.w,
                h: l.h,
                x: l.x,
                y: l.y,
                placeholder: true,
                i: i
            };

            // Move the element to the dragged location.
            const isUserAction = true;
            currentLayout = moveElement(currentLayout, l, x, y, isUserAction, preventCollision, compactType, cols);

            this.$emit('drag', currentLayout, oldDragItem, l, placeholder, e, node);

            this.currentLayout = compact(currentLayout, compactType, cols);
            this.activeDrag = placeholder;
        },
        /**
         * When dragging stops, figure out which position the element is closest to and update its x and y.
         * @param  {String} i Index of the child.
         * @param {Number} x X position of the move
         * @param {Number} y Y position of the move
         * @param {Event} e The mousedown event
         * @param {Element} node The current dragging DOM element
         */
        onDragStop(i: string, x: number, y: number, { e, node }: GridDragEvent) {
            if (!this.activeDrag) return;
            const { oldDragItem, cols, preventCollision, compactType } = this;
            let { currentLayout } = this;
            const l = getLayoutItem(currentLayout, i);
            if (!l) return;

            // Move the element here
            const isUserAction = true;
            currentLayout = moveElement(currentLayout, l, x, y, isUserAction, preventCollision, compactType, cols);

            this.$emit('dragStop', currentLayout, oldDragItem, l, null, e, node);

            // Set state
            const newLayout = compact(currentLayout, compactType, cols);
            const { oldLayout } = this;

            this.activeDrag = null;
            this.currentLayout = newLayout;
            this.oldDragItem = null;
            this.oldLayout = null;

            this.onLayoutMaybeChanged(newLayout, oldLayout);
        },
        onLayoutMaybeChanged(newLayout: Layout, oldLayout?: Layout) {
            if (!oldLayout) oldLayout = this.currentLayout;

            if (!isEqual(oldLayout, newLayout)) {
                this.currentLayout = newLayout;
                this.$emit('layoutChange', newLayout);
            }
        },
        onResizeStart(i: string, w: number, h: number, { e, node }: GridResizeEvent) {
            const { currentLayout } = this;
            let l = getLayoutItem(currentLayout, i);
            if (!l) return;

            this.oldResizeItem = cloneLayoutItem(l);
            this.oldLayout = currentLayout;

            this.$emit('resizeStart', currentLayout, l, l, null, e, node);
        },
        onResize(i: string, w: number, h: number, { e, node }: GridResizeEvent) {
            const { currentLayout, oldResizeItem, cols, preventCollision, compactType } = this;
            const l: LayoutItem | undefined = getLayoutItem(currentLayout, i);
            if (!l) return;

            // Something like quad tree should be used
            // to find collisions faster
            let hasCollisions;
            if (preventCollision) {
                const collisions = getAllCollisions(currentLayout, { ...l, w, h }).filter(
                    layoutItem => layoutItem.i !== l.i
                );
                hasCollisions = collisions.length > 0;

                // If we're colliding, we need adjust the placeholder.
                if (hasCollisions) {
                    // adjust w && h to maximum allowed space
                    let leastX = Infinity,
                        leastY = Infinity;
                    collisions.forEach(layoutItem => {
                        if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x);
                        if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y);
                    });

                    if (Number.isFinite(leastX)) l.w = leastX - l.x;
                    if (Number.isFinite(leastY)) l.h = leastY - l.y;
                }
            }

            if (!hasCollisions) {
                // Set new width and height.
                l.w = w;
                l.h = h;
            }

            // Create placeholder element (display only)
            const placeholder = {
                w: l.w,
                h: l.h,
                x: l.x,
                y: l.y,
                static: true,
                i: i
            };

            this.$emit('resize', currentLayout, oldResizeItem, l, placeholder, e, node);

            // Re-compact the layout and set the drag placeholder.
            this.currentLayout = compact(currentLayout, compactType, cols);
            this.activeDrag = placeholder;
        },
        onResizeStop(i: string, w: number, h: number, { e, node }: GridResizeEvent) {
            const { currentLayout, oldResizeItem, compactType, cols } = this;
            let l = getLayoutItem(currentLayout, i);

            this.$emit('resizeStop', currentLayout, oldResizeItem, l, null, e, node);
            // this.resizeStop(layout, oldResizeItem, l, null, e, node);

            // Set state
            const newLayout = compact(currentLayout, compactType, cols);
            const { oldLayout } = this;

            this.activeDrag = null;
            this.currentLayout = newLayout;
            // this.$set(this, 'layout', newLayout);
            this.oldResizeItem = null;
            this.oldLayout = null;

            this.onLayoutMaybeChanged(newLayout, oldLayout);
        },
        // Called while dragging an element. Part of browser native drag/drop API.
        // Native event target might be the layout itself, or an element within the layout.
        onDragOver(e: DragOverEvent) {
            // we should ignore events from layout's children in Firefox
            // to avoid unpredictable jumping of a dropping placeholder
            // FIXME remove this hack
            if (isFirefox && e.nativeEvent.target.className.indexOf(layoutClass) === -1) {
                return false;
            }

            const { droppingItem, margin, cols, rowHeight, maxRows, width, containerPadding } = this;
            const { currentLayout } = this;
            // This is relative to the DOM element that this event fired for.
            const { layerX, layerY } = e.nativeEvent;
            const droppingPosition = { left: layerX, top: layerY, e };

            if (!this.droppingDOMNode) {
                const positionParams: PositionParams = {
                    cols,
                    margin,
                    maxRows,
                    rowHeight,
                    containerWidth: width,
                    containerPadding: containerPadding || margin
                };

                const calculatedPosition = calcXY(positionParams, layerY, layerX, droppingItem.w, droppingItem.h);

                this.droppingDOMNode = this.$createElement('div', { key: droppingItem.i });
                this.droppingPosition = droppingPosition;
                this.currentLayout = [
                    ...currentLayout,
                    {
                        ...droppingItem,
                        x: calculatedPosition.x,
                        y: calculatedPosition.y,
                        static: false,
                        isDraggable: true
                    }
                ];
            } else if (this.droppingPosition) {
                const { left, top } = this.droppingPosition;
                const shouldUpdatePosition = left != layerX || top != layerY;
                if (shouldUpdatePosition) {
                    this.droppingPosition = droppingPosition;
                }
            }

            e.stopPropagation();
            e.preventDefault();
        },
        removeDroppingPlaceholder() {
            const { droppingItem, cols } = this;
            const { currentLayout } = this;

            this.currentLayout = compact(
                (currentLayout as Layout).filter(l => l.i !== droppingItem.i),
                this.compactType,
                cols
            );
            this.droppingDOMNode = null;
            this.activeDrag = null;
            this.droppingPosition = undefined;
        },
        onDragLeave() {
            dragEnterCounter--;

            // onDragLeave can be triggered on each layout's child.
            // But we know that count of dragEnter and dragLeave events
            // will be balanced after leaving the layout's container
            // so we can increase and decrease count of dragEnter and
            // when it'll be equal to 0 we'll remove the placeholder
            if (dragEnterCounter === 0) {
                this.removeDroppingPlaceholder();
            }
        },
        onDragEnter() {
            dragEnterCounter++;
        },
        onDrop(e: Event) {
            const { droppingItem } = this;
            const { currentLayout } = this;
            const item = (currentLayout as Layout).find(l => l.i === droppingItem.i);

            // reset gragEnter counter on drop
            dragEnterCounter = 0;

            this.removeDroppingPlaceholder();

            this.$emit('drop', currentLayout, item, e);
        }
    }
});
</script>
