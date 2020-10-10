import Vue from 'vue';
import { DroppingPosition, VueDraggableCallbackData, Position } from './lib/utils';
import { PositionParams } from './lib/calculateUtils';
declare const _default: import("vue/types/vue").ExtendedVue<Vue, {
    resizing: null;
    dragging: null;
    currentNode: null;
}, {
    pos(): Position;
    moveDroppingItem(oldVal?: Partial<DroppingPosition> | undefined): void;
    /**
     * This is where we set the grid item's absolute placement. It gets a little tricky because we want to do it
     * well when server rendering, and the only way to do that properly is to use percentage width/left because
     * we don't know exactly what the browser viewport is.
     * Unfortunately, CSS Transforms, which are great for performance, break in this instance because a percentage
     * left is relative to the item itself, not its container! So we cannot use them on the server rendering pass.
     *
     * @param  {Object} pos Position object with width, height, left, top.
     * @return {Object}     Style object.
     */
    createStyle(pos: Position): {
        [key: string]: string;
    };
    /**
     * onDragStart event handler
     * @param  {Object} callbackData  an object with node, delta and position information
     * @param  {Event}  e             event data
     */
    dragStart({ node }: VueDraggableCallbackData, e: Event): any;
    /**
     * onDrag event handler
     * @param  {Object} callbackData  an object with node, delta and position information
     * @param  {Event}  e             event data
     */
    drag({ node, deltaX, deltaY }: VueDraggableCallbackData, e: Event): any;
    /**
     * onDragStop event handler
     * @param  {Object} callbackData  an object with node, delta and position information
     * @param  {Event}  e             event data
     */
    dragStop({ node }: VueDraggableCallbackData, e: Event): any;
    /**
     * onResizeStop event handler
     * @param  {Object} callbackData  an object with node and size information
     * @param  {Event}  e             event data
     */
    resizeStop(callbackData: {
        node: HTMLElement;
        size: Position;
    }, e: Event): void;
    /**
     * onResizeStart event handler
     * @param  {Object} callbackData  an object with node and size information
     * @param  {Event}  e             event data
     */
    resizeStart(callbackData: {
        node: HTMLElement;
        size: Position;
    }, e: Event): void;
    /**
     * onResize event handler
     * @param  {Object} callbackData  an object with node and size information
     * @param  {Event}  e             event data
     */
    resize(callbackData: {
        node: HTMLElement;
        size: Position;
    }, e: Event): void;
    /**
     * Wrapper around drag events to provide more useful data.
     * All drag events call the function with the given handler name,
     * with the signature (index, x, y).
     *
     * @param node
     * @param size
     * @param e
     * @param  {String} handlerName Handler name to wrap.
     * @return {Function}           Handler function.
     */
    onResizeHandler({ node, size }: {
        node: HTMLElement;
        size: Position;
    }, e: Event, handlerName: string): void;
}, {
    classes: {
        'vue-grid-item': boolean;
        static: any;
        resizing: boolean;
        'vue-draggable': any;
        'vue-draggable-dragging': boolean;
        dropping: boolean;
        cssTransforms: any;
    };
    styles: any;
    newPos: any;
    getPositionParams: PositionParams;
    maxWidth: number | null;
    minConstraints: [number, number] | null;
    maxConstraints: [number, number] | null;
    posWidth: any;
    posHeight: any;
}, {
    cancel: string;
    handle: string;
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW: number;
    maxW: number;
    minH: number;
    maxH: number;
    resizeHandles: string[];
    cols: number;
    containerWidth: number;
    margin: [number, number];
    containerPadding: [number, number];
    rowHeight: number;
    maxRows: number;
    isDraggable: boolean;
    isResizable: boolean;
    isBounded: boolean;
    static: boolean;
    useCSSTransforms: boolean;
    usePercentages: boolean;
    transformScale: number;
    droppingPosition: DroppingPosition;
    draggableProps: any;
    resizableProps: any;
    tag: any;
    offsetParent: null;
}>;
/**
 * An individual item within a VueGridLayout.
 */
export default _default;
