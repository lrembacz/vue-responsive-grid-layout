<template>
    <div :class="this.className">
        <slot :containerWidth="width" :layout="layout" :rowHeight="rowHeight" :cols="cols" :maxRows="maxRows">
        </slot>
        <VueGridItem
                v-if="activeDrag"
                :w="this.activeDrag.w"
                :h="this.activeDrag.h"
                :x="this.activeDrag.x"
                :y="this.activeDrag.y"
                :i="this.activeDrag.i"
                :className="'vue-grid-placeholder'"
                :containerWidth="this.width"
                :cols="this.cols"
                :containerPadding="this.containerPadding"
                :maxRows="this.maxRows"
                :rowHeight="this.rowHeight"
                :isDraggable="false"
                :isResizable="false"
                :useCSSTransforms="this.useCSSTransforms"
                :placeholder="true"
        >
        </VueGridItem>
    </div>
</template>

<script lang="ts">
import VueGridItem from './VueGridItem.vue';
import {Vue, Component, Prop, Watch, Provide, Mixins, Emit} from 'vue-property-decorator';
import isEqual from 'lodash/isEqual';
import {
    bottom,
    cloneLayoutItem,
    compact,
    getLayoutItem,
    moveElement,
    validateLayout,
    getAllCollisions,
    cloneLayout,
} from '@/lib/utils';


// Types
import {
    CompactType,
    GridResizeEvent,
    GridDragEvent,
    Layout,
    LayoutItem,
} from '@/lib/utils';

@Component({
    components: {
        VueGridItem,
    },
})
export default class VueGridLayout extends Vue {
    public name: string = 'VueGridLayout';
    public activeDrag: LayoutItem = null;
    public isMounted: boolean = false;
    public oldDragItem: LayoutItem = null;
    public oldLayout: Layout = null;
    public oldResizeItem: LayoutItem = null;
    public children: Vue[] = [];

    @Provide('eventBus')
    public eventBus = new Vue();

    @Prop({
        type: String,
        required: false,
        default: 'vue-grid-layout',
    })
    public className: string;

    @Prop({
        type: Object,
        required: false,
    })
    public styles: object;

    @Prop({
        type: Boolean,
        required: false,
    })
    public autoSize: boolean;

    @Prop({
        type: Number,
        required: false,
        default: 12,
    })
    public cols: number;

    @Prop({
        type: String,
        required: false,
        default: 'vertical',
    })
    public compactType: CompactType;

    @Prop({
        required: false,
        validator: (value) => {
            if (!value) {
                return true;
            }
            return validateLayout(value, 'layout');
        },
    })
    public layout: Layout;

    @Prop({
        type: Array,
        required: false,
        default: () => [5, 5],
    })
    public margin: [number, number];

    @Prop({
        type: Array,
        required: false,
        default: () => [5, 5],
    })
    public containerPadding: [number, number] | null;

    @Prop({
        type: Number,
        required: false,
        default: 10,
    })
    public rowHeight: number;

    @Prop({
        type: Number,
        required: false,
        default: Infinity,
    })
    public maxRows: number;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    public isDraggable: boolean;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    public isResizable: boolean;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    public preventCollision: boolean;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    public useCSSTransforms: boolean;

    @Prop({
        type: Number,
        required: true,
    })
    public width: number;

    public async created() {
        this.eventBus.$on('onDragStart', this.onDragStart);
        this.eventBus.$on('onDrag', this.onDrag);
        this.eventBus.$on('onDragStop', this.onDragStop);
        this.eventBus.$on('onResizeStart', this.onResizeStart);
        this.eventBus.$on('onResize', this.onResize);
        this.eventBus.$on('onResizeStop', this.onResizeStop);
        this.eventBus.$on('addChild', this.onChildAdded);
        this.eventBus.$on('removeChild', this.onChildRemoved);
    }

    public async beforeDestroyed() {
        this.eventBus.$off('onDragStart', this.onDragStart);
        this.eventBus.$off('onDrag', this.onDrag);
        this.eventBus.$off('onDragStop', this.onDragStop);
        this.eventBus.$off('onResizeStart', this.onResizeStart);
        this.eventBus.$off('onResize', this.onResize);
        this.eventBus.$off('onResizeStop', this.onResizeStop);
        this.eventBus.$off('addChild', this.onChildAdded);
        this.eventBus.$off('removeChild', this.onChildRemoved);
    }

    public async mounted() {
        this.isMounted = true;
        // Possibly call back with layout on mount. This should be done after correcting the layout width
        // to ensure we don't rerender with the wrong width.
        // this.onLayoutMaybeChanged(this.layout, this.layout);
    }

    /**
     * Calculates a pixel value for the container.
     * @return {String} Container height in pixels.
     */
    public containerHeight() {
        if (!this.autoSize) {
            return;
        }
        const nbRow = bottom(this.layout);
        const containerPaddingY = this.containerPadding
            ? this.containerPadding[1]
            : this.margin[1];
        return (
            nbRow * this.rowHeight +
            (nbRow - 1) * this.margin[1] +
            containerPaddingY * 2 +
            'px'
        );
    }

    /**
     * When dragging starts
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    public onDragStart(element: Vue, i: string, x: number, y: number, { e, node }: GridDragEvent) {
        const layout = cloneLayout(this.layout);
        const l = getLayoutItem(layout, i);
        if (!l) {
            return;
        }

        this.oldDragItem = cloneLayoutItem(l);
        this.oldLayout = cloneLayout(this.layout);

        // return (this.$emit as any)('onDragStart', layout, l, l, null, e, node);
    }

    /**
     * Each drag movement create a new dragelement and move the element to the dragged location
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    public onDrag(element: Vue, i: string, x: number, y: number, { e, node }: GridDragEvent) {
        const { oldDragItem, children } = this;
        let layout = cloneLayout(this.layout);
        const { oldLayout } = this;
        const { cols } = this;
        const l = getLayoutItem(layout, i);
        if (!l) {
            return;
        }

        // Create placeholder (display only)
        const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            i: 'placeholder',
        };

        // Move the element to the dragged location.
        const isUserAction = true;
        layout = moveElement(
            layout,
            children,
            l,
            x,
            y,
            isUserAction,
            this.preventCollision,
            this.compactType,
            cols,
        );

        layout = compact(layout, this.compactType, cols);

        // (this.$emit as any)('onDrag', layout, oldDragItem, l, placeholder, e, node);

        this.activeDrag = Object.assign({}, placeholder);

        this.onLayoutMaybeChanged(layout, oldLayout);
    }

    /**
     * When dragging stops, figure out which position the element is closest to and update its x and y.
     * @param  {String} i Index of the child.
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    public onDragStop(element: Vue, i: string, x: number, y: number, { e, node }: GridDragEvent) {
        const { oldDragItem, children } = this;
        let layout = cloneLayout(this.layout);
        const { cols, preventCollision } = this;
        const l = getLayoutItem(layout, i);
        if (!l) {
            return;
        }
        // Move the element here
        const isUserAction = true;
        layout = moveElement(
            layout,
            children,
            l,
            x,
            y,
            isUserAction,
            preventCollision,
            this.compactType,
            cols,
        );
        // this.$emit('onDragStop',layout, oldDragItem, l, null, e, node);
        // Set state
        const newLayout = compact(layout, this.compactType, cols);
        const { oldLayout } = this;

        this.activeDrag = null;
        this.oldDragItem = null;
        this.oldLayout = null;

        this.onLayoutMaybeChanged(newLayout, oldLayout, true);
    }

    public onLayoutMaybeChanged(newLayout: Layout, oldLayout?: Layout | null, last: boolean = false) {
        if (!oldLayout) {
            oldLayout = cloneLayout(this.layout);
        }
        if (!isEqual(oldLayout, newLayout)) {
            this.$emit('layout-update', newLayout, last);
        }
    }

    public onResizeStart(element: Vue, i: string, w: number, h: number, { e, node }: GridResizeEvent) {
        const layout = cloneLayout(this.layout);
        const l = getLayoutItem(layout, i);
        if (!l) {
            return;
        }
        this.oldResizeItem = cloneLayoutItem(l);
        this.oldLayout = cloneLayout(this.layout);

        // (this.$emit as any)('onResizeStart', layout, l, l, null, e, node);
    }

    public onResize(element: Vue, i: string, w: number, h: number, { e, node }: GridResizeEvent) {
        const { oldResizeItem } = this;
        const oldLayout = this.oldLayout;
        const layout = cloneLayout(this.layout);
        const { cols, preventCollision } = this;
        const l: LayoutItem | null = getLayoutItem(layout, i);
        if (!l) {
            return;
        }
        // Something like quad tree should be used
        // to find collisions faster
        let hasCollisions;
        if (preventCollision) {
            const collisions = getAllCollisions(layout, { ...l, w, h }).filter(
                (layoutItem) => layoutItem.i !== l.i,
            );
            hasCollisions = collisions.length > 0;
            // If we're colliding, we need adjust the placeholder.
            if (hasCollisions) {
                // adjust w && h to maximum allowed space
                let leastX = Infinity;
                let leastY = Infinity;
                collisions.forEach((layoutItem) => {
                    if (layoutItem.x > l.x) {
                        leastX = Math.min(leastX, layoutItem.x);
                    }
                    if (layoutItem.y > l.y) {
                        leastY = Math.min(leastY, layoutItem.y);
                    }
                });

                if (isFinite(leastX)) {
                    (l as LayoutItem).w = leastX - l.x;
                }
                if (isFinite(leastY)) {
                    (l as LayoutItem).h = leastY - l.y;
                }
            }
        }
        if (!hasCollisions) {
            // Set new width and height.
            (l as LayoutItem).w = w;
            (l as LayoutItem).h = h;
        }
        // Create placeholder element (display only)
        const placeholder = {
            w: l.w,
            h: l.h,
            x: l.x,
            y: l.y,
            immobile: true,
            i,
        };
        const newLayout = compact(layout, this.compactType, cols);

        // (this.$emit as any)('onResize', newLayout, oldResizeItem, l, placeholder, e, node);

        this.onLayoutMaybeChanged(newLayout, oldLayout);

        this.activeDrag = placeholder;
    }

    public onResizeStop(element: Vue, i: string, w: number, h: number, { e, node }: GridResizeEvent) {
        const { oldResizeItem } = this;
        const layout = cloneLayout(this.layout);
        const { cols } = this;
        const l = getLayoutItem(layout, i);

        // (this.$emit as any)('onResizeStop', layout, oldResizeItem, l, null, e, node);

        // Set state
        const newLayout = compact(layout, this.compactType, cols);
        const { oldLayout } = this;
        this.activeDrag = null;
        this.oldResizeItem = null;
        this.oldLayout = null;

        this.onLayoutMaybeChanged(newLayout, oldLayout, true);
    }

    public resizeAllItems(width: number, compactType: CompactType, defSize: boolean = false, mode: boolean = false) {
        if (width > this.cols) {
            width = this.cols;
        }

        const oldLayout = cloneLayout(this.layout);
        let currentLayout = cloneLayout(this.layout);
        currentLayout.forEach((layoutItem) => {
            const index = this.children.findIndex( (child) => {
                return layoutItem.i === child.$props.i;
            });
            const {canBeResizedWithAll, defaultSize} = this.children[index].$props;
            if (canBeResizedWithAll) {
                if (defSize === true) {
                    if (defaultSize > 0) {
                        layoutItem.w = defaultSize;
                    }
                }
                layoutItem.w = width;
            }
        });
        currentLayout = compact(currentLayout, compactType, this.cols);

        this.onLayoutMaybeChanged(currentLayout, oldLayout, mode);
    }

    public onChildAdded(child: Vue) {
        this.children.push(child);
        this.$emit('add-child', child);
    }

    public onChildRemoved(child: Vue) {
        const index = this.children.findIndex( (item) => {
            return item.$props.i === child.$props.i;
        });
        this.children.splice(index, 1);
        this.$emit('remove-child', child);
    }
}

</script>