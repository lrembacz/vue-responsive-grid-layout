import Vue from 'vue';
import { CompactType, Layout, LayoutItem } from './lib/utils';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, unknown, unknown, unknown, {
    width: number;
    autoSize: boolean;
    cols: number;
    draggableCancel: string;
    draggableHandle: string;
    compactType: CompactType;
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
    droppingItem: Partial<LayoutItem> | {
        i: string;
        h: number;
        w: number;
    };
    resizeHandles: string[];
}>;
export default _default;
