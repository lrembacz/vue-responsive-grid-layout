import { Vue } from 'vue-property-decorator';
import { Layout, CompactType } from '../lib/utils';
import { Breakpoint } from '../lib/responsiveUtils';
export default class VueResponsiveGridLayout extends Vue {
    width: number;
    children: Vue[];
    isMounted: boolean;
    autoSize: boolean;
    cols: number;
    compactType: CompactType;
    margin: [number, number];
    containerPadding: [number, number] | null;
    rowHeight: number;
    maxRows: number;
    isDraggable: boolean;
    isResizable: boolean;
    preventCollision: boolean;
    useCSSTransforms: boolean;
    className: string;
    breakpoint: Breakpoint;
    breakpoints: {
        [key: string]: number;
    };
    colsAll: {
        [key: string]: number;
    };
    layouts: {
        [key: string]: Layout;
    };
    onChildrenChange(newVal: any, oldVal: any): void;
    handleResize(event: any): void;
    mounted(): void;
    created(): void;
    beforeDestroyed(): void;
    readonly listeners: {
        [x: string]: Function | Function[];
    };
    readonly attrs: {
        [x: string]: any;
    };
    initLayout(): void;
    onWidthChange(width: number): void;
    onLayoutUpdated(layout: Layout, last?: boolean): void;
    resizeAllItems(width: number, compactType: CompactType, defaultSize?: boolean, mode?: boolean): void;
    onChildAdded(child: Vue): void;
    onChildRemoved(child: Vue): void;
}
