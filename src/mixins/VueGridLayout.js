import {eventBus} from '../event-bus/eventBus'
import GridItem from '../VueGridItem.vue'
import {getLayoutItem, cloneLayoutItem, moveElement, compact, getAllCollisions} from '../utils/utils'
import * as _ from "lodash";

export default {
    components: {
        'grid-item': GridItem
    },
    props: {
        cols: {
            type: Number,
            required: true,
            default: 8
        },
        layoutProp: {
            type: Array,
            required: true,
        },
        // ("horizontal" | "vertical")
        compactTypeProp: {
            type: String,
            required: false,
            default: "vertical"
        },
        verticalCompact: {
            type: Boolean,
            required: false,
            default: true
        },
        preventCollision: {
            type: Boolean,
            required: false,
            default: false
        },
        containerWidth: {
            type: Number,
            required: true
        },
    },
    watch: {
        layoutProp(val) {
            if (val) {
                this.layout = JSON.parse(JSON.stringify(this.layoutProp));
            }
        },
    },
    data() {
        return {
            layout: [],
            isDragging: false,
            isResizing: false,
            oldDragItem: {},
            oldLayout: [],
            placeholder: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                i: '-1'
            },
            activeDrag: null,
            childrenMounted: [],
            childrenHightUpdated: [],

        }
    },
    created() {
        this.layout = JSON.parse(JSON.stringify(this.layoutProp));

        eventBus.$on('onDragStart', this.onDragStart);
        eventBus.$on('onDrag', this.onDrag);
        eventBus.$on('onDragStop', this.onDragStop);
        eventBus.$on('onResizeStart', this.onResizeStart);
        eventBus.$on('onResize', this.onResize);
        eventBus.$on('onResizeStop', this.onResizeStop);

        eventBus.$on('GridItemMounted', this.gridItemMounted);
        eventBus.$on('GridItemHeightUpdated', this.gridItemHeightUpdated);
    },

    methods: {
        updateItemsHeight() {
            this.$events.fire('rgl-updateItemsHeight');
        },
        resizeMaxAllItems() {
            this.$events.fire('rgl-resizeAllItems', this.cols);
        },
        resizeDefaultAllItems() {
            this.$events.fire('rgl-resizeAllItems');
        },
        compactType() {
            return this.verticalCompact === false ? null : this.compactTypeProp;
        },
        gridItemMounted(i) {
            const count = this.layout.length;
            this.childrenMounted.push(i);
            const childrenCount = this.childrenMounted.length;

            if ((count) === childrenCount) {
                console.log('onChildrenMounted');
                this.$emit('onChildrenMounted');
            }
        },
        gridItemHeightUpdated(i) {
            const count = this.layout.length;
            this.childrenHightUpdated.push(i);
            const childrenCount = this.childrenHightUpdated.length;

            console.log('count', count);
            console.log('childrenCount', childrenCount);
            if ((count) === childrenCount) {
                console.log('onChildrenHeightUpdated');
                this.$emit('onChildrenHeightUpdated');
                eventBus.$off('GridItemHeightUpdated', this.gridItemHeightUpdated);
            }
        },
        onLayoutMaybeChanged(newLayout, oldLayout, end = false) {
            if (!oldLayout) oldLayout = this.layout;
            if (!_.isEqual(oldLayout, newLayout)) {
                this.$emit('layout-update', newLayout, end);
            }
        },
        resizeItem(i, w, h) {

            console.log(i, w, h)


            const {layout} = this;
            const oldLayout = JSON.parse(JSON.stringify(this.layout));
            const {cols, preventCollision} = this;
            const l = getLayoutItem(layout, i);

            let hasCollisions;
            if (preventCollision) {
                const collisions = getAllCollisions(layout, {...l, w, h}).filter((layoutItem) => layoutItem.i !== l.i);
                hasCollisions = collisions.length > 0;

                // If we're colliding, we need adjust the placeholder.
                if (hasCollisions) {
                    // adjust w && h to maximum allowed space
                    let leastX = Infinity, leastY = Infinity;
                    collisions.forEach((layoutItem) => {
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

            this.layout = compact(layout, this.compactType(), cols);

            this.onLayoutMaybeChanged(this.layout, oldLayout, true);
        },
        moveItem(i, x, y, compactType = this.compactType()) {
            let {layout, cols} = this;
            let l = getLayoutItem(layout, i);
            if (!l) return;


            this.oldDragItem = cloneLayoutItem(l);
            this.oldLayout = this.layout;

            this.isDragging = true;

            layout = moveElement(
                layout,
                l,
                x,
                y,
                false,
                this.preventCollision,
                compactType,
                cols
            );

            const newLayout = compact(layout, compactType, cols);

            const {oldLayout} = this;

            this.$emit('layout-change', layout);

            this.layout = newLayout;

            this.activeDrag = null;
            this.layout = newLayout;
            this.oldDragItem = null;
            this.oldLayout = null;
            this.isDragging = false;

            this.onLayoutMaybeChanged(newLayout, oldLayout, true);

        },

        onDragStart(element, i, x, y, {e, node, newPosition}) {

            const {layout} = this;
            let l = getLayoutItem(layout, i);
            if (!l) return;


            this.oldDragItem = cloneLayoutItem(l);
            this.oldLayout = this.layout;


            return this.$emit('onDragStart', layout, l, l, null, e, node);
        },


        onDrag(element, i, x, y, {e, node, newPosition}) {

            const {oldDragItem} = this;
            let {layout} = this;
            const {cols} = this;
            let l = getLayoutItem(layout, i);
            if (!l) return;

            // Create placeholder (display only)
            this.placeholder = {
                w: l.w,
                h: l.h,
                x: l.x,
                y: l.y,
                i: i
            };

            this.isDragging = true;

            // Move the element to the dragged location.
            const isUserAction = true;
            layout = moveElement(
                layout,
                l,
                x,
                y,
                isUserAction,
                this.preventCollision,
                this.compactType(),
                cols
            );

            console.log(this.compactType())

            const newLayout = compact(layout, this.compactType(), cols);

            this.$emit('onDrag', layout, oldDragItem, l, this.placeholder, e, node);

            const {oldLayout} = this;

            this.$emit('layout-change', layout);

            this.layout = newLayout;

            this.activeDrag = this.placeholder;

            this.onLayoutMaybeChanged(newLayout, oldLayout);
        },


        onDragStop(element, i, x, y, {e, node, newPosition}) {
            const {oldDragItem} = this;
            let {layout} = this;
            const {cols, preventCollision} = this;
            const l = getLayoutItem(layout, i);
            if (!l) return;

            // Move the element here
            const isUserAction = true;
            layout = moveElement(
                layout,
                l,
                x,
                y,
                isUserAction,
                preventCollision,
                this.compactType(),
                cols
            );

            this.$emit('onDragStop', layout, oldDragItem, l, null, e, node);

            // Set state
            const newLayout = compact(layout, this.compactType(), cols);
            const {oldLayout} = this;

            this.activeDrag = null;
            this.layout = newLayout;
            this.oldDragItem = null;
            this.oldLayout = null;
            this.isDragging = false;

            //this.$emit('onLayoutChange', newLayout);

            this.onLayoutMaybeChanged(newLayout, oldLayout, true);
        },

        onResizeStart(element, i, w, h, {e, node}) {
            const {layout} = this;
            let l = getLayoutItem(layout, i);
            if (!l) return;

            this.oldResizeItem = cloneLayoutItem(l);
            this.oldLayout = this.layout;

            // this.setState({
            //     oldResizeItem: cloneLayoutItem(l),
            //     oldLayout: this.state.layout
            // });

            this.$emit('onResizeStart', layout, l, l, null, e, node);
        },

        onResize(element, i, w, h, {e, node}) {

            const {layout, oldResizeItem} = this;
            const {cols, preventCollision} = this;
            const l = getLayoutItem(layout, i);
            if (!l) return;

            // Something like quad tree should be used
            // to find collisions faster
            let hasCollisions;
            if (preventCollision) {
                const collisions = getAllCollisions(layout, {...l, w, h}).filter((layoutItem) => layoutItem.i !== l.i);
                hasCollisions = collisions.length > 0;

                // If we're colliding, we need adjust the placeholder.
                if (hasCollisions) {
                    // adjust w && h to maximum allowed space
                    let leastX = Infinity, leastY = Infinity;
                    collisions.forEach((layoutItem) => {
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

            this.isResizing = true;
            // Create placeholder element (display only)
            this.placeholder = {
                w: l.w,
                h: l.h,
                x: l.x,
                y: l.y,
                static: true,
                i: i
            };

            this.$emit('onResize', layout, oldResizeItem, l, this.placeholder, e, node);


            const {oldLayout} = this;

            this.layout = compact(layout, this.compactType(), cols);
            this.activeDrag = this.placeholder;

            this.onLayoutMaybeChanged(this.layout, oldLayout);

        },

        onResizeStop(element, i, w, h, {e, node}) {

            const {layout, oldResizeItem} = this;
            const {cols} = this;
            let l = getLayoutItem(layout, i);

            this.$emit('onResizeStop', layout, oldResizeItem, l, null, e, node);

            // Set state
            const newLayout = compact(layout, this.compactType(), cols);
            const {oldLayout} = this;

            this.isResizing = false;
            this.activeDrag = null;
            this.layout = newLayout;
            this.oldResizeItem = null;
            this.oldLayout = null;

            this.onLayoutMaybeChanged(newLayout, oldLayout, true);
        },
    },
    events: {

        'gi-onResizeItem'(id, w, newH) {
            const index = this.layoutProp.findIndex(item => item.i === id)
            if (index !== -1) {
                this.resizeItem(id, w, newH);
            }
        },

        'gi-onMoveItem'(id, x, y, compactType) {
            //console.log('onMoveItem')
            this.moveItem(id, x, y, compactType);
        },

    },
    beforeDestroy() {
        eventBus.$off('onDragStart', this.onDragStart);
        eventBus.$off('onDrag', this.onDrag);
        eventBus.$off('onDragStop', this.onDragStop);
        eventBus.$off('onResizeStart', this.onResizeStart);
        eventBus.$off('onResize', this.onResize);
        eventBus.$off('onResizeStop', this.onResizeStop);
    }
}