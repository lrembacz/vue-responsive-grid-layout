import { Vue } from 'vue-property-decorator';
import { Position } from '../lib/utils';
export interface Resizing {
    width: number;
    height: number;
}
export interface Dragging {
    top: number;
    left: number;
}
export default class GridItem extends Vue {
    resizing?: Resizing;
    dragging?: Dragging;
    isDragging: boolean | null;
    isMounted: boolean;
    componentHeight: number;
    eventBus: Vue;
    cols: number;
    containerWidth: number;
    rowHeight: number;
    margin: number[];
    maxRows: number;
    containerPadding: number[];
    x: number;
    y: number;
    w: number;
    h: number;
    minW: number;
    maxW: number;
    minH: number;
    maxH: number;
    i: string;
    onDragStart: () => void;
    onDrag: () => void;
    onDragStop: () => void;
    isDraggable: boolean;
    isResizable: boolean;
    immobile: boolean;
    canBeResizedWithAll: boolean;
    useCSSTransforms: boolean;
    usePercentages: boolean;
    className: string;
    dragContainerClass: string;
    handle: string;
    cancel: string;
    component: '';
    componentProps: object;
    defaultSize: number;
    resizableProps: object;
    draggableCoreProps: object;
    noTouchAction: boolean;
    touchAction: string;
    heightFromChildren: boolean;
    placeholder: boolean;
    onComponentHeightChanged(newVal: any, oldVal: any): void;
    readonly classes: {
        [x: string]: string | boolean;
        'vue-grid-immobile': boolean;
        'vue-grid-resizable': boolean;
        'vue-grid-resizable-resizing': boolean;
        'vue-grid-draggable': boolean;
        'vue-grid-draggable-dragging': boolean;
        'cssTransforms': boolean;
    };
    readonly styles: any;
    readonly maxWidth: number;
    readonly maxConstraints: number[];
    readonly minConstraints: number[];
    mounted(): Promise<void>;
    heightObserver(mutationsList: any, observer: any): void;
    beforeDestroy(): Promise<void>;
    calcColWidth(): number;
    getHeight(): any;
    calcWidth(): number;
    calcHeight(): number;
    /**
     * Return position on the page given an x, y, w, h.
     * left, top, width, height are all in pixels.
     * @param  {Number}  x             X coordinate in grid units.
     * @param  {Number}  y             Y coordinate in grid units.
     * @param  {Number}  w             W coordinate in grid units.
     * @param  {Number}  h             H coordinate in grid units.
     * @return {Position}                Object containing coords.
     */
    calcPosition(x: number, y: number, w: number, h: number): Position;
    calcXY(top: any, left: any): {
        x: number;
        y: number;
    };
    calcWH({ height, width }: {
        height: any;
        width: any;
    }): {
        w: number;
        h: number;
    };
    createStyle(pos: any): any;
    onDragHandler(handlerName: any): (e: any, { node, deltaX, deltaY }: {
        node: any;
        deltaX: any;
        deltaY: any;
    }) => void;
    onResizeHandler(handlerName: any): (e: any, { node, size }: {
        node: any;
        size: any;
    }) => void;
}
