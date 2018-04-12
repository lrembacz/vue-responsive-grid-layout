<template>
    <div :class="classes">
        <slot :containerWidth="containerWidth" :layout="currentLayout" :cols="cols">
        </slot>
        <grid-item class="vue-grid-placeholder"
            :containerWidth="containerWidth"
            v-show="isDragging || isResizing"
            :isDraggable="false"
            :x="placeholder.x"
            :y="placeholder.y"
            :w="placeholder.w"
            :h="placeholder.h"
            :i="placeholder.i"
            :placeholder="true"
            :cols="cols"
        style="border:1px dotted #ddd;">
        </grid-item>

        <width-provider
            @widthChange="onWidthChange"
            @widthInit="onWidthInit">
        </width-provider>
    </div>
</template>

<script>
    import WidthProvider from './helpers/WidthProvider.vue'
    import {eventBus} from './event-bus/eventBus.js'
    import GridItem from './VueGridItem.vue'
    import {
        getLayoutItem,
        cloneLayoutItem,
        moveElement,
        compact,
        getAllCollisions,
        cloneLayout,
        synchronizeLayoutWithChildren
    } from './utils/utils'
    import * as _ from "lodash";
    import {
        findOrGenerateResponsiveLayout,
        getBreakpointFromWidth,
        getColsFromBreakpoint
    } from "./utils/ResponsiveUtils";

    export default {
        components: {
            'grid-item' : GridItem,
            'width-provider': WidthProvider
        },
        props: {

            breakpoint: {
                type: String,
                required: false,
                default: 'lg'
            },
            cols: {
                type: Number,
                required: false,
                default: 12
            },
            layouts: {
                type: Object,
                required: true,
            },
            // ("horizontal" | "vertical")
            compactType: {
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
            breakpoints: {
                type: Object,
                required: false,
                default: () => { return { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 } }
            },
            colsAll: {
                type: Object,
                required: false,
                default: () => { return { lg: 12, md: 6, sm: 4, xs: 2, xxs: 1 } }
            },
            initOnStart : {
                type: Boolean,
                required: false,
                default: true
            },
            className : {
                required: false,
                type: String,
                default: ""
            },
        },
        watch: {
            layouts(val) {
                if (val) {
                    this.currentLayout = JSON.parse(JSON.stringify(this.layouts[this.breakpoint]));
                    this.currentLayouts = JSON.parse(JSON.stringify(this.layouts));
                }
            },
            inited(val) {
                if (this.inited) {
                    if (this.initOnStart) {
                        this.initLayout();
                    }
                }
            }
        },
        computed: {
            classes() {
                return {
                    "vue-responsive-grid-layout": true,
                    [this.className]: this.className
                }
            },
        },
        data() {
            return {
                containerWidth: 0,
                currentLayout: [],
                isDragging: false,
                isResizing: false,
                oldDragItem: {},
                oldLayout: [],
                placeholder: {
                    x : 0,
                    y : 0,
                    w : 0,
                    h : 0,
                    i : '-1'
                },
                activeDrag : null,
                ready: false,
                inited: false,
                itemsResized: 0,
                currentLayouts: {},
                currentBreakpoint: null,
                currentCols: null

            }
        },
        created() {
            eventBus.$on('onDragStart', this.onDragStart);
            eventBus.$on('onDrag', this.onDrag);
            eventBus.$on('onDragStop', this.onDragStop);
            eventBus.$on('onResizeStart', this.onResizeStart);
            eventBus.$on('onResize', this.onResize);
            eventBus.$on('onResizeStop', this.onResizeStop);
            eventBus.$on('onResizeItem', this.onResizeItem);
            eventBus.$on('onMoveItem', this.moveItem);
        },

        methods: {
            onWidthInit(width) {
                this.containerWidth = width;
                this.inited = true;
                this.$emit('width-init', {width});
            },
            initLayout () {
                if (this.inited) {
                    this.currentLayouts = JSON.parse(JSON.stringify(this.layouts));
                    this.currentBreakpoint = JSON.parse(JSON.stringify(this.breakpoint));
                    this.currentCols = JSON.parse(JSON.stringify(this.cols));

                    const breakpoint = getBreakpointFromWidth(this.breakpoints, this.containerWidth);
                    const cols = getColsFromBreakpoint(breakpoint, this.colsAll);

                    if (this.currentBreakpoint === breakpoint) {
                    } else {
                        this.onWidthChange(this.containerWidth);
                    }

                    const layout = findOrGenerateResponsiveLayout(
                        this.currentLayouts,
                        this.breakpoints,
                        breakpoint,
                        "lg",
                        cols,
                        this.compactTypeState()
                    );

                    this.currentLayout = layout;
                    this.currentBreakpoint = breakpoint;
                    this.currentCols = cols;

                    this.$emit('layout-init', {layout, cols});
                    this.ready = true;

                    // Provided to make sure that components are re-rendered
                    // Sometimes event handlers makes the errors
                    this.$nextTick( ()=> {
                        this.updateItemsHeight();
                    })
                }
            },

            synchronizeLayout() {
                let newLayout = synchronizeLayoutWithChildren(
                    this.currentLayout,
                    this.currentCols,
                    this.compactType
                );

                 let filtered;
                 filtered = newLayout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})

                 this.currentLayout = filtered;

                this.$set(this.currentLayouts, this.currentBreakpoint,  filtered);

                this.$nextTick( ()=> {
                    this.updateItemsHeight();
                })

                this.$emit('layout-synchronize', { layout: this.currentLayout, layouts: this.currentLayouts});
            },
            onWidthChange(width) {
                this.containerWidth = width;
                const { breakpoints, currentCols, colsAll, currentLayouts } = this;
                const newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.containerWidth);

                const lastBreakpoint = this.currentBreakpoint;
                const newCols = getColsFromBreakpoint(newBreakpoint, colsAll);

                if (
                    lastBreakpoint !== newBreakpoint ||
                    this.breakpoints !== breakpoints ||
                    currentCols !== newCols
                ) {
                    if (!(lastBreakpoint in currentLayouts))
                        currentLayouts[lastBreakpoint] = cloneLayout(this.layout);

                    let currentLayout = findOrGenerateResponsiveLayout(
                        currentLayouts,
                        breakpoints,
                        newBreakpoint,
                        lastBreakpoint,
                        newCols,
                        this.compactTypeState()
                    );

                    currentLayout = synchronizeLayoutWithChildren(
                        currentLayout,
                        newCols,
                        this.compactTypeState()
                    );

                    this.$set(currentLayouts, newBreakpoint,  currentLayout);

                    this.$emit('layout-change',{layout: currentLayout, breakpoint: newBreakpoint});
                    this.$emit('breakpoint-change',{breakpoint: newBreakpoint, cols: newCols});

                    // this.breakpoint= newBreakpoint;
                    this.currentLayout = currentLayout;
                    this.currentBreakpoint = newBreakpoint;
                    this.currentCols = newCols;
                    // this.cols = newCols;
                }

                this.$emit('width-change', {width, newCols})
            },
            updateItemsHeight() {
                eventBus.$emit('updateItemsHeight');
            },
            resizeAllItems(mode = false, cols = false) {

                this.itemsResized = 0;

                if ((mode === false) && (cols === false)) {
                    eventBus.$emit('resizeAllItems');
                }

                if ((mode === true) && (cols === false)) {
                    eventBus.$emit('resizeAllItems', this.currentCols);
                }

                if ((cols !== false) && (typeof cols === 'number')) {
                    eventBus.$emit('resizeAllItems', cols);
                }

            },
            compactTypeState() {
                return this.verticalCompact === false ? null : this.compactType;
            },
            onResizeItem(id, w, newH, mode = false) {
                const index = this.currentLayout.findIndex(item => item.i === id)
                if (index !== -1) {
                    this.resizeItem(id, w, newH);
                    if (mode) {
                        this.itemsResized++;

                        if (this.itemsResized === this.currentLayout.length) {
                            this.$emit('layout-resized');
                            this.$nextTick( () => {
                                this.synchronizeLayout();
                            })
                        }
                    }
                }

            },

            onLayoutMaybeChanged(newLayout, oldLayout, end = false) {
                if (!oldLayout) oldLayout = this.currentLayout;
                if (!_.isEqual(oldLayout, newLayout)) {
                    const newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.containerWidth);
                    this.currentBreakpoint = newBreakpoint;
                    this.$emit('layout-update', {layout: newLayout, breakpoint: newBreakpoint, end});
                }
            },
            resizeItem(i, w, h) {



                const { currentLayout } = this;
                const oldLayout = JSON.parse(JSON.stringify(this.currentLayout));
                const { currentCols, preventCollision } = this;
                const l = getLayoutItem(currentLayout, i);

                let hasCollisions;
                if (preventCollision) {
                    const collisions = getAllCollisions(currentLayout, { ...l, w, h }).filter((layoutItem) => layoutItem.i !== l.i);
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

                this.currentLayout = compact(currentLayout, this.compactTypeState(), currentCols);
                this.setCurrentLayout(this.currentLayout);

                this.onLayoutMaybeChanged(this.currentLayout, oldLayout, true);
            },
            moveItem(i, x, y, compactType = this.compactTypeState()) {
                let { currentLayout, currentCols } = this;
                let l = getLayoutItem(currentLayout, i);
                if (!l) return;


                this.oldDragItem = cloneLayoutItem(l);
                this.oldLayout = this.currentLayout;

                this.isDragging = true;

                currentLayout = moveElement(
                    currentLayout,
                    l,
                    x,
                    y,
                    false,
                    this.preventCollision,
                    compactType,
                    currentCols
                );

                const newLayout = compact(currentLayout, compactType, currentCols);

                const { oldLayout } = this;

                this.currentLayout = newLayout;

                this.activeDrag = null;
                this.currentLayout = newLayout;
                this.setCurrentLayout(newLayout);
                this.oldDragItem = null;
                this.oldLayout = null;
                this.isDragging = false;

                this.onLayoutMaybeChanged(newLayout, oldLayout, true);

            },

            onDragStart (element, i, x, y, { e, node, newPosition }) {

                const { currentLayout } = this;
                let l = getLayoutItem(currentLayout, i);
                if (!l) return;


                this.oldDragItem = cloneLayoutItem(l);
                this.oldLayout = this.currentLayout;


                return this.$emit('onDragStart', currentLayout, l, l, null, e, node);
            },


            onDrag (element, i, x, y, { e, node, newPosition }) {

                const { oldDragItem } = this;
                let { currentLayout } = this;
                const { currentCols } = this;
                let l = getLayoutItem(currentLayout, i);
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
                currentLayout = moveElement(
                    currentLayout,
                    l,
                    x,
                    y,
                    isUserAction,
                    this.preventCollision,
                    this.compactTypeState(),
                    currentCols
                );

                const newLayout = compact(currentLayout, this.compactTypeState(), currentCols);

                this.$emit('onDrag', currentLayout, oldDragItem, l, this.placeholder, e, node);

                const { oldLayout } = this;

                this.currentLayout = newLayout;

                this.setCurrentLayout(newLayout);

                this.activeDrag = this.placeholder;

                this.onLayoutMaybeChanged(newLayout, oldLayout);
            },


            onDragStop (element, i, x, y, { e, node, newPosition }) {
                const { oldDragItem } = this;
                let { currentLayout } = this;
                const { currentCols, preventCollision } = this;
                const l = getLayoutItem(currentLayout, i);
                if (!l) return;

                // Move the element here
                const isUserAction = true;
                currentLayout = moveElement(
                    currentLayout,
                    l,
                    x,
                    y,
                    isUserAction,
                    preventCollision,
                    this.compactTypeState(),
                    currentCols
                );

                this.$emit('onDragStop', currentLayout, oldDragItem, l, null, e, node);

                // Set state
                const newLayout = compact(currentLayout, this.compactTypeState(), currentCols);
                const { oldLayout } = this;

                this.activeDrag = null;
                this.currentLayout = newLayout;

                this.setCurrentLayout(newLayout);

                this.oldDragItem = null;
                this.oldLayout = null;
                this.isDragging = false;

                this.onLayoutMaybeChanged(newLayout, oldLayout, true);
            },

            onResizeStart (element, i, w, h, { e, node }) {
                const { currentLayout } = this;
                let l = getLayoutItem(currentLayout, i);
                if (!l) return;

                this.oldResizeItem = cloneLayoutItem(l);
                this.oldLayout = this.currentLayout;

                this.$emit('onResizeStart', currentLayout, l, l, null, e, node);
            },

            onResize (element, i, w, h, { e, node }) {

                const { currentLayout, oldResizeItem } = this;
                const { currentCols, preventCollision } = this;
                const l = getLayoutItem(currentLayout, i);
                if (!l) return;

                // Something like quad tree should be used
                // to find collisions faster
                let hasCollisions;
                if (preventCollision) {
                    const collisions = getAllCollisions(currentLayout, { ...l, w, h }).filter((layoutItem) => layoutItem.i !== l.i);
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

                this.$emit('onResize', currentLayout, oldResizeItem, l, this.placeholder, e, node);



                const { oldLayout } = this;

                this.currentLayout = compact(currentLayout, this.compactTypeState(), currentCols);

                this.setCurrentLayout(this.currentLayout);

                this.activeDrag = this.placeholder;

                this.onLayoutMaybeChanged(this.currentLayout, oldLayout);

            },

            onResizeStop (element, i, w, h, { e, node }) {

                const { currentLayout, oldResizeItem } = this;
                const { currentCols } = this;
                let l = getLayoutItem(currentLayout, i);

                this.$emit('onResizeStop', currentLayout, oldResizeItem, l, null, e, node);

                // Set state
                const newLayout = compact(currentLayout, this.compactTypeState(), currentCols);
                const { oldLayout } = this;

                this.isResizing = false;
                this.activeDrag = null;
                this.currentLayout = newLayout;
                this.setCurrentLayout(newLayout);

                this.oldResizeItem = null;
                this.oldLayout = null;

                this.onLayoutMaybeChanged(newLayout, oldLayout, true);
            },

            setCurrentLayout(newLayout) {
                let filtered;
                filtered = newLayout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})
                this.$set(this.currentLayouts, this.currentBreakpoint, filtered);
            }
        },
        beforeDestroy() {
            eventBus.$off('onDragStart', this.onDragStart);
            eventBus.$off('onDrag', this.onDrag);
            eventBus.$off('onDragStop', this.onDragStop);
            eventBus.$off('onResizeStart', this.onResizeStart);
            eventBus.$off('onResize', this.onResize);
            eventBus.$off('onResizeStop', this.onResizeStop);
            eventBus.$off('onMoveItem', this.moveItem);
            eventBus.$off('onResizeItem', this.onResizeItem);
        }
    }
</script>
