<template>
    <div :class="classes">
        <slot :containerWidth="containerWidth" :layout="currentLayout" :cols="currentCols">
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
                   :cols="currentCols"
                   :rowHeight="rowHeight"
                   style="border:1px dotted #ddd;">
        </grid-item>

        <width-provider
                :selector="providerSelector"
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
            rowHeight: {
                required: false,
                type: Number,
                default: 10
            },
            cols: {
                type: Number,
                required: false,
                default: 12
            },
            layouts: {
                required: true,
                validator: value => {
                    return value instanceof Object || null;
                }
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
            providerSelector: {
                required: false,
                type: String
            },
            disabled: {
                required: false,
                type: Boolean,
                default: false
            }
        },
        watch: {
            layouts(val) {
                if ((val instanceof Object) && this.inited  && !this.disabled) {
                    this.currentLayout = JSON.parse(JSON.stringify(this.layouts[this.breakpoint]));
                    this.currentLayouts = JSON.parse(JSON.stringify(this.layouts));
                    this.ready = true;
                    this.$emit('layout-ready');
                } else if (val === null || val === {}) {
                    this.ready = false;
                    this.$emit('layout-not-ready');
                }
            },
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
                inited: false,
                itemsResized: 0,
                currentLayouts: {},
                currentBreakpoint: null,
                currentCols: null,
                ready: false

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
            eventBus.$on('onMoveItem', this.onMoveItem);

            this.$on('layout-ready', this.readyLayout);
        },

        methods: {
            onWidthInit(width) {
                this.containerWidth = width;
                this.inited = true;
                this.$emit('width-init', {width});
            },
            readyLayout() {
                if (this.initOnStart) {
                    this.initLayout();
                }
            },
            initLayout () {
                if (this.inited && this.layouts instanceof Object && this.ready) {
                    this.currentLayouts = JSON.parse(JSON.stringify(this.layouts));
                    this.currentBreakpoint = JSON.parse(JSON.stringify(this.breakpoint));
                    this.currentCols = JSON.parse(JSON.stringify(this.cols));

                    const breakpoint = getBreakpointFromWidth(this.breakpoints, this.containerWidth);
                    const cols = getColsFromBreakpoint(breakpoint, this.colsAll);

                    if (this.currentBreakpoint === breakpoint) {
                    } else {
                        this.onWidthChange(this.containerWidth);
                    }

                    let layout = findOrGenerateResponsiveLayout(
                        this.currentLayouts,
                        this.breakpoints,
                        breakpoint,
                        breakpoint,
                        cols,
                        this.compactTypeState()
                    );

                    layout = synchronizeLayoutWithChildren(
                        layout,
                        cols,
                        this.compactTypeState()
                    );

                    this.currentLayout = layout;
                    this.currentBreakpoint = breakpoint;
                    this.currentCols = cols;

                    // Provided to make sure that components are re-rendered
                    // Sometimes event handlers makes the errors
                    this.$nextTick( ()=> {
                        this.onUpdateItemsHeight().then( response => {
                            this.$emit('layout-init', {layout, cols});
                        }).catch(err => {
                            this.$emit('layout-init-failed');
                        })
                    })
                }
            },

            switchLayout(newLayouts) {
                if (newLayouts instanceof Object && this.ready) {
                    this.currentLayouts = JSON.parse(JSON.stringify(newLayouts));

                    const breakpoint = getBreakpointFromWidth(this.breakpoints, this.containerWidth);
                    const cols = getColsFromBreakpoint(breakpoint, this.colsAll);

                    const layout = findOrGenerateResponsiveLayout(
                        this.currentLayouts,
                        this.breakpoints,
                        breakpoint,
                        this.currentBreakpoint,
                        cols,
                        this.compactTypeState()
                    );

                    let newLayout = synchronizeLayoutWithChildren(
                        layout,
                        cols,
                        this.compactTypeState()
                    );

                    this.currentBreakpoint = breakpoint;
                    this.currentCols = cols;

                    let filtered;
                    filtered = newLayout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})

                    this.currentLayout = filtered;

                    this.$set(this.currentLayouts, this.currentBreakpoint,  filtered);

                    // Provided to make sure that components are re-rendered
                    // Sometimes event handlers makes the errors
                    this.$nextTick( ()=> {
                        this.onUpdateItemsHeight(true).then( response => {
                            this.$emit('layout-switched', {layout: this.currentLayout, cols: this.currentCols, breakpoint: this.currentBreakpoint, layouts: this.currentLayouts});
                        }).catch(err => {
                            this.$emit('layout-switched-failed');
                        })
                    })
                }
            },

            synchronizeLayout() {
                this.makeSynchronization().then( ()=> {
                    this.$nextTick( ()=> {
                        this.onUpdateItemsHeight(true).then( response => {
                            this.$emit('layout-synchronize', { layout: this.currentLayout, layouts: this.currentLayouts});
                        }).catch(err => {
                            this.$emit('layout-synchronize-failed');
                        })
                    })
                })
            },
            makeSynchronization() {
                return new Promise( (resolve) => {
                    let newLayout = synchronizeLayoutWithChildren(
                        this.currentLayout,
                        this.currentCols,
                        this.compactTypeState()
                    );

                    let filtered;
                    filtered = newLayout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})

                    this.currentLayout = filtered;

                    this.$set(this.currentLayouts, this.currentBreakpoint,  filtered);

                    resolve(true);
                })
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
                        currentLayouts[lastBreakpoint] = cloneLayout(this.currentLayout);

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

                    this.currentLayout = currentLayout;
                    this.currentBreakpoint = newBreakpoint;
                    this.currentCols = newCols;
                    this.$set(this.currentLayouts, newBreakpoint,  currentLayout);

                    this.$emit('breakpoint-change',{breakpoint: newBreakpoint});

                    this.$nextTick( ()=> {
                        this.onUpdateItemsHeight(true).then( response => {
                            this.$emit('layout-change',{layout: this.currentLayout, layouts: this.currentLayouts});
                            this.$emit('width-change', {width: width, cols: newCols});
                        }).catch(err => {
                            this.$emit('width-change-failed');
                        })
                    })

                } else {
                    this.$emit('width-change', {width: width, cols: newCols})
                }


            },
            updateItemsHeight(mode = true) {
                this.onUpdateItemsHeight(mode).then( response => {
                    this.$emit('layout-height-updated', {layouts: this.currentLayouts, layout: this.currentLayout});
                }).catch(err => {
                    this.$emit('layout-height-updated-failed');
                })
            },
            onUpdateItemsHeight(mode) {
                return new Promise( (resolve) => {
                    let itemsHeightUpdated = this.currentLayout ? this.currentLayout.length : -1;

                    eventBus.$emit('updateItemsHeight', ({newLayout, oldLayout}) => {
                        itemsHeightUpdated--;

                        if (itemsHeightUpdated === 0) {
                            if (mode)
                                this.onLayoutMaybeChanged(newLayout, oldLayout, mode);
                            resolve({newLayout, oldLayout})
                        }
                    });
                })
            },
            resizeAllItems(mode = false, cols = false) {
                this.onResizeAllItems(mode, cols).then(response => {
                    this.onUpdateItemsHeight(true).then( ({newLayout, oldLayout}) => {
                        this.$emit('layout-resized', {layouts: this.currentLayouts, layout: this.currentLayout});
                    }).catch(err => {
                        this.$emit('layout-resized-failed');
                    })
                })
            },
            onResizeAllItems(mode = false, cols = false) {
                return new Promise( (resolve) => {
                    let itemsResized = this.currentLayout ? this.currentLayout.length : -1;

                    if ((mode === false) && (cols === false)) {
                        eventBus.$emit('resizeAllItems', null, ({newLayout, oldLayout}) => {
                            itemsResized--;

                            if (itemsResized === 0) {
                                resolve({newLayout, oldLayout})
                            }
                        });
                    }

                    if ((mode === true) && (cols === false)) {
                        eventBus.$emit('resizeAllItems', this.currentCols, ({newLayout, oldLayout}) => {
                            itemsResized--;

                            if (itemsResized === 0) {
                                resolve({newLayout, oldLayout})
                            }
                        });
                    }

                    if ((cols !== false) && (typeof cols === 'number')) {
                        eventBus.$emit('resizeAllItems', cols, ({newLayout, oldLayout}) => {
                            itemsResized--;

                            if (itemsResized === 0) {
                                resolve({newLayout, oldLayout})
                            }
                        });
                    }
                });

            },
            compactTypeState() {
                return this.verticalCompact === false ? null : this.compactType;
            },
            onResizeItem(id, w, newH, mode = false, callback) {
                const index = this.currentLayout.findIndex(item => item.i === id)
                if (index !== -1) {
                    this.resizeItem(id, w, newH).then( ({newLayout, oldLayout}) => {
                        if (mode === 'resizeAll') {
                            if (callback)
                                callback({newLayout, oldLayout})
                        }
                        if (mode === 'updateHeight') {
                            if (callback)
                                callback({newLayout, oldLayout})
                        }
                    });
                }
            },

            onLayoutMaybeChanged(newLayout, oldLayout, mode = false) {
                if (!oldLayout) oldLayout = this.currentLayout;
                if (!_.isEqual(oldLayout, newLayout) || mode) {
                    const newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.containerWidth);
                    this.currentBreakpoint = newBreakpoint;
                    this.$emit('layout-update', {layout: newLayout, layouts: this.currentLayouts, breakpoint: newBreakpoint});
                }
            },
            resizeItem(i, w, h) {
                return new Promise( (resolve) => {
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

                    resolve({newLayout: this.currentLayout, oldLayout: oldLayout});
                })
                // this.onLayoutMaybeChanged(this.currentLayout, oldLayout, true);
            },
            onMoveItem(i, x, y, compactType = this.compactTypeState(), callback) {
                const index = this.currentLayout.findIndex(item => item.i === i)
                if (index !== -1) {
                    this.moveItem(i, x, y, compactType, callback).then( ({newLayout, oldLayout}) => {
                        if (callback)
                            callback({newLayout, oldLayout})
                    });
                }
            },

            moveItem(i, x, y, compactType = this.compactTypeState()) {
                return new Promise( (resolve) => {
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

                    resolve({newLayout: this.currentLayout, oldLayout: oldLayout});
                })
                // this.onLayoutMaybeChanged(newLayout, oldLayout);

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

                this.onLayoutMaybeChanged(newLayout, oldLayout);
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
            eventBus.$off('onMoveItem', this.onMoveItem);
            eventBus.$off('onResizeItem', this.onResizeItem);

            this.$off('layoutInit', this.readyLayout);
        }
    }
</script>