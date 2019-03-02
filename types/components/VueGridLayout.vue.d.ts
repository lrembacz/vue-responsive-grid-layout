import { Vue } from 'vue-property-decorator';
import { CompactType, GridResizeEvent, GridDragEvent, Layout, LayoutItem } from '../lib/utils';
export default class VueGridLayout extends Vue {
    activeDrag?: LayoutItem;
    isMounted: boolean;
    oldDragItem?: LayoutItem;
    oldLayout?: Layout;
    oldResizeItem?: LayoutItem;
    children: Vue[];
    eventBus: Vue;
    className: string;
    styles: object;
    autoSize: boolean;
    cols: number;
    compactType: CompactType;
    layout: Layout;
    margin: [number, number];
    containerPadding: [number, number] | null;
    rowHeight: number;
    maxRows: number;
    isDraggable: boolean;
    isResizable: boolean;
    preventCollision: boolean;
    useCSSTransforms: boolean;
    width: number;
    created(): Promise<void>;
    beforeDestroyed(): Promise<void>;
    mounted(): Promise<void>;
    /**
     * Calculates a pixel value for the container.
     * @return {String} Container height in pixels.
     */
    containerHeight(): string;
    /**
     * When dragging starts
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDragStart(element: Vue, i: string, x: number, y: number, { e, node }: GridDragEvent): void;
    /**
     * Each drag movement create a new dragelement and move the element to the dragged location
     * @param {String} i Id of the child
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDrag(element: Vue, i: string, x: number, y: number, { e, node }: GridDragEvent): void;
    /**
     * When dragging stops, figure out which position the element is closest to and update its x and y.
     * @param  {String} i Index of the child.
     * @param {Number} x X position of the move
     * @param {Number} y Y position of the move
     * @param {Event} e The mousedown event
     * @param {Element} node The current dragging DOM element
     */
    onDragStop(element: Vue, i: string, x: number, y: number, { e, node }: GridDragEvent): void;
    onLayoutMaybeChanged(newLayout: Layout, oldLayout?: Layout | null, last?: boolean): void;
    onResizeStart(element: Vue, i: string, w: number, h: number, { e, node }: GridResizeEvent): void;
    onResize(element: Vue, i: string, w: number, h: number, { e, node }: GridResizeEvent): void;
    onResizeStop(element: Vue, i: string, w: number, h: number, { e, node }: GridResizeEvent): void;
    resizeAllItems(width: number, compactType: CompactType, defSize?: boolean, mode?: boolean): void;
    onChildAdded(child: Vue): void;
    onChildRemoved(child: Vue): void;
}
