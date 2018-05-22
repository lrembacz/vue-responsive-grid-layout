<template>
    <div
            :class="classes"
            :style="styles"
    >
        <DraggableCore
                v-if="!placeholder"
                :onStart="onDragHandler('onDragStart')"
                :onDrag="onDragHandler('onDrag')"
                :onStop="onDragHandler('onDragStop')"
                :disabled="!isDraggable"
                :handle="handle"
                :cancel="cancel"
                :class="dragContainerClass"
                :noTouchAction="noTouchAction"
                :touchAction="touchAction"
        >
            <div
                    ref="item"
                    v-if="component"
                    :is="component"
                    v-bind="componentProps"
                    :onHeightUpdated="onHeightUpdated"
                    :updateHeight="updateHeight"
                    :cols="cols"
                    :w="w"
                    :h="h"

            ></div>
            <slot v-else
            ></slot>
        </DraggableCore>
        <Resizable
                v-if="!placeholder && isResizable"
                :w="calcWidth()"
                :h="calcHeight()"
                :onResizeStart="onResizeHandler('onResizeStart')"
                :onResize="onResizeHandler('onResize')"
                :onResizeStop="onResizeHandler('onResizeStop')"
                :minConstraints="minConstraints"
                :maxConstraints="maxConstraints"
                :className="'resizable'"
                ref="resize"
        >
            <div class="resizable-handle">
            </div>
        </Resizable>
    </div>
</template>

<script>
    import {eventBus} from './event-bus/eventBus.js'
    import * as utils from './utils/utils.js'
    import DraggableCore from 'vue-draggable-core'
    import Resizable from 'vue-resizable-core'
    import * as draggableUtils from './utils/draggableUtils.js'

    export default {
        data() {
            return {
                resizing: null,
                dragging: null,
                isDragging: null,
                mounted: false,
                componentHeight: 0,
                firstUpdateHeight: false
            }
        },
        props: {
            noTouchAction : {
                type: Boolean,
                default: true,
            },
            touchAction: {
                type: String,
                default: 'none',
            },
            heightFromChildren: {
                required: false,
                type: Boolean,
                default: false
            },

            containerWidth: {
                required: true,
                default: 0
            },

            // General grid attributes
            cols: {
                required: false,
                type: Number,
                default: 12,
            },

            rowHeight: {
                required: false,
                type: Number,
                default: 10
            },

            margin: {
                required: false,
                type: Array,
                default: () => [10, 10]
            },

            maxRows: {
                required: false,
                type: Number,
                default: Infinity
            },

            containerPadding: {
                required: false,
                type:Array,
                default: () => [5, 5]
            },

            // These are all in grid units
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

            // Id
            i: {
                type: String,
                required: true
            },

            // Flags
            isDraggable: {
                required: false,
                type: Boolean,
                default: true
            },

            isResizable: {
                required: false,
                type: Boolean,
                default: true
            },

            static: {
                required: false,
                type: Boolean,
                default: false
            },

            // Use CSS Transform
            useCSSTransforms: {
                required: false,
                type: Boolean,
                default: true
            },

            // Others
            className: {
                required: false,
                type: String,
                default: ""
            },

            dragContainerClass: {
                required: false,
                type: String,
                default: "vue-grid-draggable-container"
            },

            // Selector for draggable handle
            handle: {
                required: false,
                type: String,
                default: ""
            },

            cancel: {
                required: false,
                type: String,
                default: ""
            },

            onDragStart: {
                type: Function,
                default: () => {}
            },

            onDrag: {
                type: Function,
                default: () => {}
            },

            onDragStop: {
                type: Function,
                default: () => {}
            },

            placeholder: {
                type: Boolean,
                default: false
            },

            usePercentages: {
                required: false,
                type: Boolean,
                default: false
            },

            componentProps: {
                type: Object,
                required: false
            },

            component: {
                required: false
            },

            defaultSize: {
                required: false,
                default: 2
            },

            canBeResizedWithAll: {
                required: false,
                default: true,
                type: Boolean
            }
        },
        watch:{
            w(val) {
                if (val && (!this.placeholder && this.isResizable)) {
                    this.$refs.resize.width = this.calcWidth();
                }
            },
            h(val) {
                if (val && (!this.placeholder && this.isResizable)) {
                    this.$refs.resize.height = this.calcHeight();
                }
            }
        },
        components: {
            DraggableCore,
            Resizable
        },
        computed: {
            classes() {
                return {
                    "vue-grid-item" : true,
                    [this.className]: this.className,
                    'static': this.static,
                    "vue-grid-resizable": this.isResizable,
                    "vue-grid-resizable-resizing": Boolean(this.resizing),
                    "vue-grid-draggable": this.isDraggable,
                    "vue-grid-draggable-dragging": Boolean(this.dragging),
                    cssTransforms: this.useCSSTransforms
                }
            },
            styles() {
                let pos = this.calcPosition(this.x, this.y,this.w, this.h);
                return this.createStyle(pos);
            },
            maxWidth() {
                return this.calcPosition(0, 0, this.cols - this.x, 0).width;
            },
            maxConstraints() {
                const maxes = this.calcPosition(0, 0, this.maxW, this.maxH);
                return [
                    Math.min(maxes.width, this.maxWidth),
                    Math.min(maxes.height, Infinity)
                ];
            },
            minConstraints() {
                const mins = this.calcPosition(0, 0, this.minW, this.minH);
                return [mins.width, mins.height];
            }
        },
        methods: {
            calcColWidth() {
                return (
                    (this.containerWidth - this.margin[0] * (this.cols - 1) - this.containerPadding[0] * 2) / (this.cols)
                );
            },

            getHeight() {
                if (this.isDraggable === true)
                    return this.$children[0].$children[0].$el.offsetHeight;
            },

            calcWidth() {
                let out = this.calcPosition(this.x, this.y, this.w, this.h);

                return out.width;
            },

            calcHeight() {
                let out = this.calcPosition(this.x, this.y, this.w, this.h);

                return out.height;
            },

            calcPosition(x, y, w, h) {

                const colWidth = this.calcColWidth();

                const out = {
                    left: Math.round((colWidth + this.margin[0]) * x + this.containerPadding[0]),
                    top: Math.round((this.rowHeight + this.margin[1]) * y + this.containerPadding[1]),

                    width:
                        w === Infinity
                            ? w
                            : Math.round(colWidth * w + Math.max(0, w - 1) * this.margin[0]),
                    height:
                        h === Infinity
                            ? h
                            : Math.round(this.rowHeight * h + Math.max(0, h - 1) * this.margin[1])
                };

                if (this.resizing) {
                    out.width = Math.round(this.resizing.width);
                    out.height = Math.round(this.resizing.height);
                }

                if (this.dragging) {
                    out.top = Math.round(this.dragging.top);
                    out.left = Math.round(this.dragging.left);
                }

                return out;
            },

            calcXY(top, left) {
                const colWidth = this.calcColWidth();

                let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
                let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

                // Capping
                x = Math.max(Math.min(x, this.cols - this.w), 0);
                y = Math.max(Math.min(y, this.maxRows - this.h), 0);


                return { x, y };
            },

            calcWH( { height, width } ) {
                const colWidth = this.calcColWidth();

                let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]));
                let h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]));


                // Capping
                w = Math.max(Math.min(w, this.cols - this.x), 0);
                h = Math.max(Math.min(h, this.maxRows - this.y), 0);


                return { w, h };
            },

            createStyle(pos) {

                let style;
                // CSS Transforms support (default)
                if (this.useCSSTransforms) {
                    style = utils.setTransform(pos);
                } else {
                    // top,left (slow)
                    style = utils.setTopLeft(pos);

                    // This is used for server rendering.
                    if (this.usePercentages) {
                        style.left = utils.perc(pos.left / this.containerWidth);
                        style.width = utils.perc(pos.width / this.containerWidth);
                    }
                }

                return style;
            },


            onDragHandler(handlerName) {

                return (e, { node, deltaX, deltaY }) => {


                    const newPosition = { top: 0, left: 0 };

                    // Get new XY
                    switch (handlerName) {
                        case "onDragStart": {
                            const { offsetParent } = node.offsetParent;
                            if (!offsetParent) return;
                            const parentRect = offsetParent.getBoundingClientRect();
                            const clientRect = node.getBoundingClientRect();

                            newPosition.left =
                                clientRect.left - parentRect.left + offsetParent.scrollLeft;
                            newPosition.top =
                                clientRect.top - parentRect.top + offsetParent.scrollTop;

                            this.dragging = newPosition;

                            break;
                        }
                        case "onDrag":
                            if (!this.dragging)
                                throw new Error("onDrag called before onDragStart.");
                            newPosition.left = this.dragging.left + deltaX;
                            newPosition.top = this.dragging.top + deltaY;
                            this.dragging = newPosition;

                            break;
                        case "onDragStop":
                            if (!this.dragging)
                                throw new Error("onDragEnd called before onDragStart.");
                            newPosition.left = this.dragging.left;
                            newPosition.top = this.dragging.top;
                            this.dragging = null;

                            break;
                        default:
                            throw new Error(
                                "onDragHandler called with unrecognized handlerName: " + handlerName
                            );
                    }


                    const { x, y } = this.calcXY(newPosition.top, newPosition.left);


                    eventBus.$emit(handlerName, this, this.i, x, y, { e, node, newPosition });
                };
            },

            onResizeHandler(handlerName) {
                return (e, { node, size }) => {

                    const { cols, x, i, maxW, minW, maxH, minH } = this;
                    let newPos;
                    // Get new XY
                    if (this.heightFromChildren) {
                        this.componentHeight = Math.ceil(this.$refs.item.$el.offsetHeight);
                        newPos = this.calcWH({ height: this.componentHeight, width: size.width })
                    } else {
                        // Get new XY
                        newPos = this.calcWH(size);
                    }

                    let w = newPos.w;
                    let h = newPos.h;


                    // Cap w at numCols
                    w = Math.min(w, cols - x);
                    // Ensure w is at least 1
                    w = Math.max(w, 1);

                    // Min/max capping
                    w = Math.max(Math.min(w, maxW), minW);
                    h = Math.max(Math.min(h, maxH), minH);

                    this.resizing = handlerName === "onResizeStop" ? null : size;


                    eventBus.$emit(handlerName, this, i, w, h, { e, node, size });





                    //handler.call(this, i, w, h, { e, node, size });
                };
            },
            calcNewHeight(pos) {
                if (this.$refs.item) {

                    this.componentHeight = Math.ceil(this.$refs.item.$el.offsetHeight);

                    let { w, h } = this.calcWH({ height: this.componentHeight, width: pos.width });

                    eventBus.$emit('onResizeItem', this.i, w, h, 'updateHeight');
                } else {
                    if(this.$slots) {
                        if (this.$slots.default) {
                            if (this.$slots.default.length > 0) {
                                this.componentHeight = Math.ceil(this.$slots.default[0].elm.offsetHeight);

                                let { w, h } = this.calcWH({ height: this.componentHeight, width: pos.width });

                                eventBus.$emit('onResizeItem', this.i, w, h, 'updateHeight');
                            }
                        }
                    }
                }
            },
            onHeightUpdated() {
                if (!this.placeholder) {
                    if(this.heightFromChildren) {
                        this.updateHeight();
                    } else {
                        eventBus.$emit('onResizeItem', this.i, this.w, this.h, 'updateHeight');
                    }
                }
            },
            updateHeight() {
                let pos = this.calcPosition(this.x, this.y, this.w, this.h);

                this.$nextTick(() => {
                    this.calcNewHeight(pos);
                });

                if (this.firstUpdateHeight === false) {
                    eventBus.$emit('GridItemHeightUpdated', this.i);
                    this.firstUpdateHeight = true;
                }
            },
            onResizeItems(width) {

                if ((!this.placeholder)) {
                    if (this.canBeResizedWithAll) {
                        if (width === this.cols) {
                            this.$nextTick(() => {
                                eventBus.$emit('onMoveItem', this.i, 0, 0, "vertical");
                                eventBus.$emit('onResizeItem', this.i, width, this.h, 'resizeAll');
                            });
                        } else if (!width) {
                            this.$nextTick(() => {
                                eventBus.$emit('onResizeItem', this.i, this.defaultSize, this.h, 'resizeAll');
                                eventBus.$emit('onMoveItem', this.i, 0, 0, "horizontal");
                            });
                        } else {
                            this.$nextTick(() => {
                                eventBus.$emit('onResizeItem', this.i, width, this.h, 'resizeAll');
                                eventBus.$emit('onMoveItem', this.i, 0, 0, "horizontal");
                            });
                        }
                    } else {
                        eventBus.$emit('onMoveItem', this.i, 0, 0, "vertical");
                        eventBus.$emit('onResizeItem', this.i, this.w, this.h, 'resizeAll');
                    }
                }
            },
        },
        created() {
            this.minW = 1;
            this.maxW = Infinity;
            this.minH = 1;
            this.maxH = Infinity;

            eventBus.$on('updateItemsHeight', this.onHeightUpdated)
            eventBus.$on('resizeAllItems', this.onResizeItems)
        },
        mounted() {
            this.mounted = true;
            eventBus.$emit('GridItemMounted', this.i);
        },
        beforeDestroy() {
            this.mounted = false;
            eventBus.$off('updateItemsHeight', this.onHeightUpdated)
            eventBus.$off('resizeAllItems', this.onResizeItems)
        },
    }
</script>

<style scoped>
    .resizable-handle {
        position:absolute;
        width:20px;
        height:20px;
        bottom:0;
        right:0px;
        text-align:right;
    }
    .resizable-handle::after {
        content: "";
        position: absolute;
        right: 3px;
        bottom: 3px;
        width: 5px;
        height: 5px;
        border-right: 2px solid #000000;
        border-bottom: 2px solid #000000;
    }

    .vue-grid-draggable-container {
        width: 100%;
        height: 100%;
    }
</style>
