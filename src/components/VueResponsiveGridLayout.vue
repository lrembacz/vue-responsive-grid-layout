<template>
    <VueGridLayout
        v-bind="attrs"
        v-on="listeners"
        @layout-update="onLayoutUpdated"
        @add-child="onChildAdded"
        @remove-child="onChildRemoved"
        :layout="layouts[breakpoint]"
        :width="width"
        :cols="cols"
        ref="layout"
    >
        <template slot-scope="props">
            <slot v-bind="props">
            </slot>
        </template>
    </VueGridLayout>
</template>

<script lang="ts">
import {Component, Vue, Prop, Watch} from 'vue-property-decorator';
import isEqual from 'lodash/isEqual';
import VueGridLayout from './VueGridLayout.vue';

import {
    Layout,
    cloneLayout,
    synchronizeLayoutWithChildren,
    validateLayout, CompactType, compact,
} from '@/lib/utils';
import {
    getBreakpointFromWidth,
    getColsFromBreakpoint,
    findOrGenerateResponsiveLayout,
    Breakpoint,
} from '@/lib/responsiveUtils';

@Component({
    name: 'VueResponsiveGridLayout',
    components: {
        VueGridLayout,
    },
})
export default class VueResponsiveGridLayout extends Vue {
    public width: number = 0;
    public children: Vue[] = [];
    public isMounted: boolean = false;

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

    // Responsive config
    @Prop({
        type: String,
        required: false,
        default: 'vue-responsive-grid-layout',
    })
    public className: string;

    @Prop({
        type: String,
        required: false,
        default: 'lg',
    })
    public breakpoint: Breakpoint;

    @Prop({
        type: Object,
        required: false,
        default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }),
    })
    public breakpoints: { [key: string]: number };

    @Prop({
        type: Object,
        required: false,
        default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }),
    })
    public colsAll: { [key: string]: number };

    @Prop({
        type: Object,
        required: false,
        default: () => ({}),
    })
    public layouts: { [key: string]: Layout };

    @Watch('children')
    public onChildrenChange(newVal, oldVal) {
        this.$nextTick( () => {
            this.initLayout();
        });
    }

    public handleResize(event) {
        this.width = this.$el.clientWidth;
        this.onWidthChange(this.width);
    }

    public mounted() {
        this.isMounted = true;
        this.width = this.$el.clientWidth;
        this.$nextTick( () => {
            this.initLayout();
        });
    }

    public created() {
        window.addEventListener('resize', this.handleResize);
    }

    public beforeDestroyed() {
        window.removeEventListener('resize', this.handleResize);
    }


    get listeners() {
        const {
            'layout-update': onLayoutChange,
            'add-child': addChild,
            'remove-child': removeChild, ...listeners} = this.$listeners;
        return listeners;
    }

    get attrs() {
        const {layout, cols, ...attrs} = this.$attrs;
        const {...props} = this.$props;
        const gather = {...props, ...attrs};
        return gather;
    }

    public initLayout() {
        if (this.isMounted && this.layouts instanceof Object) {
            const currentLayouts = JSON.parse(JSON.stringify(this.layouts));
            const breakpoints = JSON.parse(JSON.stringify(this.breakpoints));
            const { cols, colsAll } = this;
            const newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.width);
            const lastBreakpoint = this.breakpoint;
            const newCols = getColsFromBreakpoint(newBreakpoint, colsAll);
            if (lastBreakpoint !== newBreakpoint) {
                this.onWidthChange(this.width);
            }
            let layout = findOrGenerateResponsiveLayout(
                currentLayouts,
                breakpoints,
                newBreakpoint,
                lastBreakpoint,
                newCols,
                this.compactType,
            );
            layout = synchronizeLayoutWithChildren(
                layout,
                this.children,
                newCols,
                this.compactType,
            );

            layout = compact(layout, this.compactType, newCols);

            this.$set(currentLayouts, newBreakpoint, layout);

            this.$emit('layout-init', layout, currentLayouts, newCols, newBreakpoint);
        }
    }

    public onWidthChange(width: number) {
        this.width = width;
        const currentLayouts = JSON.parse(JSON.stringify(this.layouts));
        const breakpoints = JSON.parse(JSON.stringify(this.breakpoints));
        const { cols, colsAll } = this;
        const newBreakpoint = getBreakpointFromWidth(this.breakpoints, this.width);
        const lastBreakpoint = this.breakpoint;
        const newCols = getColsFromBreakpoint(newBreakpoint, colsAll);
        if (
            lastBreakpoint !== newBreakpoint ||
            this.breakpoints !== breakpoints ||
            cols !== newCols
        ) {
            let currentLayout = findOrGenerateResponsiveLayout(
                currentLayouts,
                breakpoints,
                newBreakpoint,
                lastBreakpoint,
                newCols,
                this.compactType,
            );
            currentLayout = synchronizeLayoutWithChildren(
                currentLayout,
                this.children,
                newCols,
                this.compactType,
            );
            currentLayout = compact(currentLayout, this.compactType, newCols);

            this.$set(currentLayouts, newBreakpoint,  currentLayout);
            this.$emit('breakpoint-change', newBreakpoint);
            this.$emit('layout-change',
                JSON.parse(JSON.stringify(currentLayout)), JSON.parse(JSON.stringify(currentLayouts)), newBreakpoint,
            );
            this.$emit('width-change', width, newCols);
        } else {
            this.$emit('width-change',  width,  newCols);
        }
    }

    public onLayoutUpdated(layout: Layout, last = false) {
        const layouts = JSON.parse(JSON.stringify(this.layouts));
        this.$emit('layout-update', layout, {
                ...layouts,
                [this.breakpoint]: layout,
            },
            last,
        );
    }

    public resizeAllItems(
        width: number,
        compactType: CompactType,
        defaultSize: boolean = false,
        mode: boolean = false,
    ) {
        (this.$refs.layout as any).resizeAllItems(width, compactType, defaultSize, mode);
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