<template>
    <VueGridLayout
        ref="layout"
        :margin="getIndentationValue(margin, currentBreakpoint)"
        :container-padding="getIndentationValue(containerPadding, currentBreakpoint)"
        :layout="currentLayout"
        :cols="currentCols"
        v-bind="$props"
        @layoutChange="onLayoutChange"
    >
        <slot slot="item" slot-scope="props" name="item" v-bind="props"></slot>
    </VueGridLayout>
</template>

<script lang="ts">
import { PropType } from 'vue';
import isEqual from 'lodash.isequal';

import { cloneLayout, synchronizeLayoutWithChildren, Layout } from './lib/utils';
import {
    getBreakpointFromWidth,
    getColsFromBreakpoint,
    findOrGenerateResponsiveLayout,
    ResponsiveLayout,
    Breakpoints,
    Breakpoint
} from './lib/responsiveUtils';
import VueGridLayout from './VueGridLayout.vue';
import VueGridLayoutProps from './VueGridLayoutProps';

/**
 * Get a value of margin or containerPadding.
 *
 * @param  {Array | Object} param Margin | containerPadding, e.g. [10, 10] | {lg: [10, 10], ...}.
 * @param  {String} breakpoint   Breakpoint: lg, md, sm, xs and etc.
 * @return {Array}
 */

export default VueGridLayoutProps.extend({
    name: 'VueResponsiveGridLayout',
    components: { VueGridLayout },
    props: {
        breakpoint: {
            type: String as PropType<Breakpoint>
        },
        breakpoints: {
            type: Object as PropType<Breakpoints>,
            default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 })
        },
        cols: {
            type: [Array, Object] as PropType<{ [key: string]: number }>,
            default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 })
        },
        layouts: {
            type: Object as PropType<ResponsiveLayout>,
            default: () => ({})
        },
        margin: {
            type: [Object, Array] as PropType<{ [key: string]: [number, number] } | [number, number]>,
            default: () => [10, 10]
        },
        containerPadding: {
            type: [Object, Array] as PropType<{ [key: string]: [number, number] } | [number, number]>,
            default: () => ({ lg: null, md: null, sm: null, xs: null, xxs: null })
        }
    },
    data() {
        return {
            currentLayout: [],
            currentBreakpoint: '',
            currentCols: 12,
            currentLayouts: {}
        };
    },
    watch: {
        layouts: {
            handler(newVal: ResponsiveLayout, oldVal: ResponsiveLayout) {
                if (!isEqual(newVal, oldVal)) {
                    this.currentLayout = findOrGenerateResponsiveLayout(
                        newVal,
                        this.breakpoints,
                        this.currentBreakpoint,
                        this.currentBreakpoint,
                        this.currentCols,
                        this.compactType
                    );
                    this.currentLayouts = newVal;
                }
            }
        },
        width(newVal, oldVal) {
            if (newVal != oldVal) {
                this.onWidthChange();
            }
        },
        breakpoints: {
            handler(newVal, oldVal) {
                if (!isEqual(newVal, oldVal)) {
                    this.onWidthChange();
                }
            },
            deep: true
        },
        breakpoint(newVal, oldVal) {
            if (newVal != oldVal) {
                this.onWidthChange();
            }
        },
        cols: {
            handler(newVal, oldVal) {
                if (!isEqual(newVal, oldVal)) {
                    this.onWidthChange();
                }
            },
            deep: true
        }
    },
    created() {
        this.generateInitialState();
    },
    methods: {
        generateInitialState() {
            const breakpoint = getBreakpointFromWidth(this.breakpoints, this.width);
            const colNo = getColsFromBreakpoint(breakpoint, this.cols);

            // Get the initial layout. This can tricky; we try to generate one however possible if one doesn't exist
            // for this layout.
            this.currentLayout = findOrGenerateResponsiveLayout(
                this.layouts,
                this.breakpoints,
                breakpoint,
                breakpoint,
                colNo,
                this.compactType
            );
            this.currentBreakpoint = breakpoint;
            this.currentCols = colNo;
        },
        // wrap layouts so we do not need to pass layouts to child
        onLayoutChange(layout: Layout) {
            this.$emit('layoutChange', layout, {
                ...this.layouts,
                [this.currentBreakpoint]: layout
            });
        },
        /**
         * When the width changes work through breakpoints and reset state with the new width & breakpoint.
         * Width changes are necessary to figure out the widget widths.
         */
        onWidthChange() {
            const newBreakpoint = this.breakpoint || getBreakpointFromWidth(this.breakpoints, this.width);

            const lastBreakpoint = this.currentBreakpoint;
            const newCols: number = getColsFromBreakpoint(newBreakpoint, this.cols);
            const newLayouts = { ...this.layouts };

            // Breakpoint change
            if (lastBreakpoint !== newBreakpoint) {
                // Preserve the current layout if the current breakpoint is not present in the next layouts.
                if (!(lastBreakpoint in newLayouts)) newLayouts[lastBreakpoint] = cloneLayout(this.currentLayout);

                // Find or generate a new layout.
                let layout = findOrGenerateResponsiveLayout(
                    newLayouts,
                    this.breakpoints,
                    newBreakpoint,
                    lastBreakpoint,
                    newCols,
                    this.compactType
                );

                // This adds missing items.
                layout = synchronizeLayoutWithChildren(layout, this.$refs.layout.$children, newCols, this.compactType);

                // Store the new layout.
                newLayouts[newBreakpoint] = layout;

                // events
                this.$emit('layoutChange', layout, newLayouts);
                this.$emit('onBreakpointChange', newBreakpoint, newCols);

                this.currentBreakpoint = newBreakpoint;
                this.currentLayout = layout;
                this.currentCols = newCols;
            }

            const margin = this.getIndentationValue(this.margin, newBreakpoint);
            const containerPadding = this.getIndentationValue(this.containerPadding, newBreakpoint);

            //call onWidthChange on every change of width, not only on breakpoint changes
            this.$emit('widthChange', this.width, margin, newCols, containerPadding);
        },
        getIndentationValue(param: { [key: string]: any } | any[], breakpoint: string): any {
            if (param == null) return null;
            return Array.isArray(param) ? param : param[breakpoint];
        }
    }
});
</script>
