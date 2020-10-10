import Vue, { CreateElement, VNode } from 'vue';
import { MouseTouchEvent } from './utils/types';
export declare type DraggableData = {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
};
export declare type DraggableEventHandler = (e: MouseEvent, data: DraggableData) => void;
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    mounted: boolean;
    dragging: boolean;
    lastX: number;
    lastY: number;
    touchIdentifier: null;
}, {
    findDOMNode(): HTMLElement;
    handleDragStart(e: MouseTouchEvent): false | undefined;
    handleDrag(e: MouseTouchEvent): void;
    handleDragStop(e: MouseTouchEvent): false | undefined;
    mouseDown(e: MouseTouchEvent): any;
    mouseUp(e: MouseTouchEvent): any;
    touchStart(e: MouseTouchEvent): any;
    touchEnd(e: MouseTouchEvent): any;
    children(h: CreateElement): VNode | VNode[];
}, unknown, {
    allowAnyClick: boolean;
    disabled: boolean;
    enableUserSelectHack: boolean;
    offsetParent: null;
    grid: [number, number];
    handle: string;
    cancel: string;
    scale: number;
}>;
export default _default;
