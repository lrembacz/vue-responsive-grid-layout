import { DragOverEvent, GridDragEvent, GridResizeEvent, Layout, LayoutItem } from './lib/utils';
import { CreateElement, VNode } from 'vue';
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
    droppingItem: Partial<LayoutItem> | {
        i: string;
        h: number;
        w: number;
    };
    resizeHandles: string[];
} & import("vue").default, {
    activeDrag: null;
    currentLayout: never[];
    mounted: boolean;
    oldDragItem: null;
    oldLayout: null;
    oldResizeItem: null;
    droppingDOMNode: null;
}, {
    containerHeight(): string | undefined;
    /**
     * When dragging starts
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDragStart(i: string, x: number, y: number, { e, node }: GridDragEvent): void;
    /**
     * Each drag movement create a new dragelement and move the element to the dragged location
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDrag(i: string, x: number, y: number, { e, node }: GridDragEvent): void;
    /**
     * When dragging stops, figure out which position the element is closest to and update its x and y.
     * @param  {String} i Index of the child.
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDragStop(i: string, x: number, y: number, { e, node }: GridDragEvent): void;
    onLayoutMaybeChanged(newLayout: Layout, oldLayout?: Layout | undefined): void;
    onResizeStart(i: string, w: number, h: number, { e, node }: GridResizeEvent): void;
    onResize(i: string, w: number, h: number, { e, node }: GridResizeEvent): void;
    onResizeStop(i: string, w: number, h: number, { e, node }: GridResizeEvent): void;
    placeholderStyles(): {
        display: string;
    };
    /**
     * Create a placeholder object.
     * @return {Element} Placeholder div.
     */
    placeholder(h: CreateElement): VNode | null;
    /**
     * Given a grid item, set its style attributes & surround in a <Draggable>.
     * @return {Element}       Element wrapped in draggable and properly placed.
     * @param h
     * @param item
     * @param isDroppingItem
     */
    processGridItem(h: CreateElement, item: LayoutItem, isDroppingItem?: boolean | undefined): VNode | null;
    onDragOver(e: DragOverEvent): false | undefined;
    removeDroppingPlaceholder(): void;
    onDragLeave(): void;
    onDragEnter(): void;
    onDrop(e: Event): void;
}, unknown, {
    layout: Layout;
}>;
export default _default;
