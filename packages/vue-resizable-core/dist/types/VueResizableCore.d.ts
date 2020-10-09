import Vue, { CreateElement, VNode } from 'vue';
import { ResizeHandleAxis } from './types';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    lastHandleRect: null;
    slack: null;
}, {
    lockAspectRatioFn(width: number, height: number, aspectRatio: number): [number, number];
    resetData(): void;
    runConstraints(width: number, height: number): [number, number];
    /**
     * Wrapper around drag events to provide more useful data.
     *
     * @param  {String} handlerName Handler name to wrap.
     * @param axis
     * @return {Function}           Handler function.
     */
    resizeHandler(handlerName: 'resize' | 'resizeStart' | 'resizeStop', axis: ResizeHandleAxis): Function;
    children(h: CreateElement): VNode | VNode[];
}, unknown, {
    width: number;
    height: number;
    draggableProps: any;
    handleSize: number[];
    lockAspectRatio: boolean;
    axis: string;
    minConstraints: number[];
    maxConstraints: number[];
    resizeHandles: string[];
    resizableHandleClass: any;
    transformScale: number;
}>;
export default _default;
