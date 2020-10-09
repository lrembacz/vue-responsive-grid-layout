import { Layout } from './lib/utils';
import { ResponsiveLayout, Breakpoints } from './lib/responsiveUtils';
import VueGridLayout from './VueGridLayout.vue';
declare const _default: import("vue/types/vue").ExtendedVue<{
    width: number;
    autoSize: boolean;
    cols: number;
    draggableCancel: string;
    draggableHandle: string;
    compactType: import("./lib/utils").CompactType;
    layout: Layout;
    margin: number[];
    containerPadding: [number, number] | null;
    rowHeight: number;
    maxRows: number;
    isBounded: boolean;
    isDraggable: boolean;
    isResizable: boolean;
    isDroppable: boolean;
    preventCollision: boolean;
    useCSSTransforms: boolean;
    transformScale: number;
    droppingItem: Partial<import("./lib/utils").LayoutItem> | {
        i: string;
        h: number;
        w: number;
    };
    resizeHandles: string[];
} & VueGridLayout, {
    currentLayout: never[];
    currentBreakpoint: string;
    currentCols: number;
    currentLayouts: {};
}, {
    generateInitialState(): void;
    onLayoutChange(layout: Layout): void;
    /**
     * When the width changes work through breakpoints and reset state with the new width & breakpoint.
     * Width changes are necessary to figure out the widget widths.
     */
    onWidthChange(): void;
    getIndentationValue(param: any[] | {
        [key: string]: any;
    }, breakpoint: string): any;
}, unknown, {
    breakpoint: string;
    breakpoints: Breakpoints;
    cols: {
        [key: string]: number;
    };
    layouts: ResponsiveLayout;
    margin: number[] | {
        [key: string]: [number, number];
    };
    containerPadding: [number, number] | {
        [key: string]: [number, number];
    } | {
        lg: null;
        md: null;
        sm: null;
        xs: null;
        xxs: null;
    };
}>;
/**
 * Get a value of margin or containerPadding.
 *
 * @param  {Array | Object} param Margin | containerPadding, e.g. [10, 10] | {lg: [10, 10], ...}.
 * @param  {String} breakpoint   Breakpoint: lg, md, sm, xs and etc.
 * @return {Array}
 */
export default _default;
