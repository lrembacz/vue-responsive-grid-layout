<template>
    <div
            :class='classes'
            :style='styles'
    >
        <DraggableCore
                :onStart="onDragHandler('onDragStart')"
                :onDrag="onDragHandler('onDrag')"
                :onStop="onDragHandler('onDragStop')"
                :disabled='!isDraggable || immobile'
                :handle='handle'
                :cancel='cancel'
                :class='dragContainerClass'
                :noTouchAction='noTouchAction'
                :touchAction='touchAction'
                :draggableCoreProps='draggableCoreProps'
        >
            <div
                v-if='component'
                :is='component'
                v-bind='componentProps'
                :cols='cols'
                :w='w'
                :h='h'
                ref="component"
            >
            </div>
            <slot
                :cols='cols'
                :w='w'
                :h='h'
                v-else
            >
            </slot>
        </DraggableCore>
        <Resizable
                v-if='isResizable'
                :w='calcWidth()'
                :h='calcHeight()'
                :onResizeStart="onResizeHandler('onResizeStart')"
                :onResize="onResizeHandler('onResize')"
                :onResizeStop="onResizeHandler('onResizeStop')"
                :minConstraints='minConstraints'
                :maxConstraints='maxConstraints'
                :className="'resizable'"
                :resizableProps='resizableProps'
        >
            <div class='resizable-handle'>
            </div>
        </Resizable>
    </div>
</template>

<script lang="ts">
import {Component, Vue, Prop, Inject, Watch} from 'vue-property-decorator';
import DraggableCore from 'vue-draggable-core';
import Resizable from 'vue-resizable-core';
import {perc, setTopLeft, setTransform} from '../lib/utils';
import {Position} from '../lib/utils';

export interface Resizing {
    width: number;
    height: number;
}

export interface Dragging {
    top: number;
    left: number;
}

@Component({
    components: {
        DraggableCore,
        Resizable,
    },
})
export default class GridItem extends Vue {
    public name: string = 'VueGridItem';
    public resizing: Resizing = null;
    public dragging: Dragging = null;
    public isDragging: boolean | null = null;
    public isMounted: boolean = false;
    public componentHeight: number = 0;

    @Inject('eventBus')
    public eventBus: Vue;

    @Prop({
        type: Number,
        required: false,
        default: 12,
    })
    public cols: number;

    @Prop({
        type: Number,
        required: true,
        default: 0,
    })
    public containerWidth: number;

    @Prop({
        type: Number,
        required: false,
        default: 10,
    })
    public rowHeight: number;

    @Prop({
        type: Array,
        required: false,
        default: () => [10, 10],
    })
    public margin: number[];

    @Prop({
        type: Number,
        required: false,
        default: Infinity,
    })
    public maxRows: number;

    @Prop({
        type: Array,
        required: false,
        default: () => [5, 5],
    })
    public containerPadding: number[];

    // CORDS

    @Prop({
        type: Number,
        required: true,
    })
    public x: number;

    @Prop({
        type: Number,
        required: true,
    })
    public y: number;

    @Prop({
        type: Number,
        required: true,
    })
    public w: number;

    @Prop({
        type: Number,
        required: true,
    })
    public h: number;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    public minW: number;

    @Prop({
        type: Number,
        required: false,
        default: Infinity,
    })
    public maxW: number;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    public minH: number;

    @Prop({
        type: Number,
        required: false,
        default: Infinity,
    })
    public maxH: number;

    // ID
    @Prop({
        type: String,
        required: true,
    })
    public i: string;

    // Functions
    @Prop({
        type: Function,
    })
    public onDragStart: () => void;

    @Prop({
        type: Function,
    })
    public onDrag: () => void;

    @Prop({
        type: Function,
    })
    public onDragStop: () => void;

    // Flags
    @Prop({
        type: Boolean,
        default: false,
    })
    public isDraggable: boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    public isResizable: boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    public immobile: boolean;

    @Prop({
        type: Boolean,
        default: true,
        required: false,
    })
    public canBeResizedWithAll: boolean;

    // Use CSS transforms instead of top/left
    @Prop({
        required: false,
        type: Boolean,
        default: true,
    })
    public useCSSTransforms: boolean;

    @Prop({
        required: false,
        type: Boolean,
        default: false,
    })
    public usePercentages: boolean;

    // Others
    @Prop({
        required: false,
        type: String,
        default: 'vue-grid-item',
    })
    public className: string;

    @Prop({
        required: false,
        type: String,
        default: 'vue-grid-draggable-container',
    })
    public dragContainerClass: string;

    // Selector for draggable handle
    @Prop({
        required: false,
        type: String,
        default: '',
    })
    public handle: string;

    // Selector for draggable cancel
    @Prop({
        required: false,
        type: String,
        default: '',
    })
    public cancel: string;

    // Child
    @Prop({
        type: String || Object || Function,
        required: false,
    })
    public component: '';

    @Prop({
        type: Object,
        required: false,
    })
    public componentProps: object;

    @Prop({
        type: Number,
        required: false,
        default: 2,
    })
    public defaultSize: number;

    // Internal components

    @Prop({
        type: Object,
        required: false,
    })
    public resizableProps: object;

    @Prop({
        type: Object,
        required: false,
    })
    public draggableCoreProps: object;

    @Prop({
        type: Boolean,
        default: true,
    })
    public noTouchAction: boolean;

    @Prop({
        type: String,
        default: 'none',
    })
    public touchAction: string;

    @Prop({
        required: false,
        type: Boolean,
        default: false,
    })
    public heightFromChildren: boolean;

    @Prop({
        required: false,
        type: Boolean,
        default: false,
    })
    public placeholder: boolean;

    @Watch('componentHeight')
    public onComponentHeightChanged(newVal, oldVal) {
        if (newVal) {
            if (!this.resizing) {
                const pos = this.calcPosition(this.x, this.y, this.w, this.h);
                const {w, h} = this.calcWH({ height: this.componentHeight, width: pos.width });
                this.$emit('update:w', w);
                this.$emit('update:h', h);
            }
        }
    }

    get classes() {
        return {
            [this.className]: this.className,
            'vue-grid-immobile': this.immobile,
            'vue-grid-resizable': this.isResizable,
            'vue-grid-resizable-resizing': Boolean(this.resizing),
            'vue-grid-draggable': this.isDraggable,
            'vue-grid-draggable-dragging': Boolean(this.dragging),
            'cssTransforms': this.useCSSTransforms,
        };
    }
    get styles() {
        const pos = this.calcPosition(this.x, this.y, this.w, this.h);
        return this.createStyle(pos);
    }
    get maxWidth() {
        return this.calcPosition(0, 0, this.cols - this.x, 0).width;
    }
    get maxConstraints() {
        const maxes = this.calcPosition(0, 0, this.maxW, this.maxH);
        return [
            Math.min(maxes.width, this.maxWidth),
            Math.min(maxes.height, Infinity),
        ];
    }
    get minConstraints() {
        const mins = this.calcPosition(0, 0, this.minW, this.minH);
        return [mins.width, mins.height];
    }

    public async mounted() {
        if (this.placeholder === false) {
            this.isMounted = true;
            this.eventBus.$emit('addChild', this);
            if (this.heightFromChildren) {
                if (this.component) {
                    this.componentHeight = (this.$refs.component as any)
                        .$el
                        .offsetHeight;
                    new MutationObserver(this.heightObserver).observe(
                        (this.$refs.component as any).$el,
                        {attributes: true},
                    );
                } else if (this.$slots.default[0]) {
                    this.componentHeight = (this.$slots.default[0] as any)
                        .elm.offsetHeight;
                    new MutationObserver(this.heightObserver).observe(
                        (this.$slots.default[0] as any).elm,
                        {attributes: true},
                    );
                }
            } else {
                new MutationObserver(this.heightObserver).observe(this.$el, {attributes: true});
            }
        }
    }

    public heightObserver(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                if (this.componentHeight !== mutation.target.offsetHeight) {
                    this.componentHeight = mutation.target.offsetHeight;
                }
            }
        }
    }

    public async beforeDestroy() {
        if (this.placeholder === false) {
            this.isMounted = false;
            this.eventBus.$emit('removeChild', this);
        }
    }

    public calcColWidth() {
        return (
            (this.containerWidth - this.margin[0] * (this.cols - 1) - this.containerPadding[0] * 2) / (this.cols)
        );
    }

    public getHeight() {
        if (this.isDraggable === true) {
            return ((this.$children[0].$children[0] as any).$el.offsetHeight) as any;
        }
    }

    public calcWidth() {
        const out = this.calcPosition(this.x, this.y, this.w, this.h);

        return out.width;
    }

    public calcHeight() {
        const out = this.calcPosition(this.x, this.y, this.w, this.h);

        return out.height;
    }

    /**
     * Return position on the page given an x, y, w, h.
     * left, top, width, height are all in pixels.
     * @param  {Number}  x             X coordinate in grid units.
     * @param  {Number}  y             Y coordinate in grid units.
     * @param  {Number}  w             W coordinate in grid units.
     * @param  {Number}  h             H coordinate in grid units.
     * @return {Position}                Object containing coords.
     */
    public calcPosition(
        x: number,
        y: number,
        w: number,
        h: number,
    ): Position {
        const { margin, containerPadding, rowHeight } = this;
        const colWidth = this.calcColWidth();

        const out = {
            left: Math.round((colWidth + margin[0]) * x + containerPadding[0]),
            top: Math.round((rowHeight + margin[1]) * y + containerPadding[1]),

            width:
                w === Infinity
                    ? w
                    : Math.round(colWidth * w + Math.max(0, w - 1) * margin[0]),
            height:
                h === Infinity
                    ? h
                    : Math.round(rowHeight * h + Math.max(0, h - 1) * margin[1]),
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
    }

    public calcXY(top, left) {
        const colWidth = this.calcColWidth();

        let x = Math.round((left - this.margin[0]) / (colWidth + this.margin[0]));
        let y = Math.round((top - this.margin[1]) / (this.rowHeight + this.margin[1]));

        x = Math.max(Math.min(x, this.cols - this.w), 0);
        y = Math.max(Math.min(y, this.maxRows - this.h), 0);

        return { x, y };
    }

    public calcWH( { height, width } ) {
        const colWidth = this.calcColWidth();

        let w = Math.round((width + this.margin[0]) / (colWidth + this.margin[0]));
        let h = Math.round((height + this.margin[1]) / (this.rowHeight + this.margin[1]));

        w = Math.max(Math.min(w, this.cols - this.x), 0);
        h = Math.max(Math.min(h, this.maxRows - this.y), 0);

        return { w, h };
    }

    public createStyle(pos) {
        let style;
        if (this.useCSSTransforms) {
            style = setTransform(pos);
        } else {
            style = setTopLeft(pos);

            if (this.usePercentages) {
                style.left = perc(pos.left / this.containerWidth);
                style.width = perc(pos.width / this.containerWidth);
            }
        }
        return style;
    }

    public onDragHandler(handlerName) {
        return (e, { node, deltaX, deltaY }) => {

            const newPosition: Dragging = {left: 0, top: 0};

            switch (handlerName) {
                case 'onDragStart': {
                    const { offsetParent } = node.offsetParent;
                    if (!offsetParent) {
                        return;
                    }
                    const parentRect = offsetParent.getBoundingClientRect();
                    const clientRect = node.getBoundingClientRect();

                    newPosition.left =
                        clientRect.left - parentRect.left + offsetParent.scrollLeft;
                    newPosition.top =
                        clientRect.top - parentRect.top + offsetParent.scrollTop;

                    this.dragging = { left: newPosition.left, top: newPosition.top };

                    break;
                }
                case 'onDrag':
                    if (!this.dragging) {
                        throw new Error('onDrag called before onDragStart.');
                    }

                    newPosition.left = this.dragging.left + deltaX;
                    newPosition.top = this.dragging.top + deltaY;
                    this.dragging = { left: newPosition.left, top: newPosition.top };

                    break;
                case 'onDragStop':
                    if (!this.dragging) {
                        throw new Error('onDragEnd called before onDragStart.');
                    }

                    newPosition.left = this.dragging.left;
                    newPosition.top = this.dragging.top;

                    this.dragging = null;

                    break;
                default:
                    throw new Error(
                        'onDragHandler called with unrecognized handlerName: ' + handlerName,
                    );
            }

            const newPos = this.calcXY(newPosition.top, newPosition.left);
            const x = Math.round(newPos.x);
            const y = Math.round(newPos.y);

            this.eventBus.$emit(handlerName, this, this.i, x, y, { e, node, newPosition });
        };
    }

    public onResizeHandler(handlerName) {
        return (e, { node, size }) => {

            const { cols, x, i, maxW, minW, maxH, minH } = this;
            let newPos;
            newPos = this.calcWH({width: size.width, height: size.height});

            let w = newPos.w;
            let h = newPos.h;

            w = Math.min(w, cols - x);
            w = Math.max(w, 1);

            w = Math.max(Math.min(w, maxW), minW);
            h = Math.max(Math.min(h, maxH), minH);

            this.resizing = handlerName === 'onResizeStop' ? null : size;

            this.eventBus.$emit(handlerName, this, i, w, h, { e, node, size });
        };
    }
}
</script>