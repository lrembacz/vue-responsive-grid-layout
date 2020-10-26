import Vue from 'vue';
export declare type LayoutItem = {
    w: number;
    h?: number;
    x: number;
    y: number;
    i: string;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
    resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>;
    isBounded?: boolean;
};
export declare type Layout = LayoutItem[];
export declare type Position = {
    left: number;
    top: number;
    width: number;
    height: number;
};
export declare type VueDraggableCallbackData = {
    node: HTMLElement;
    x?: number;
    y?: number;
    deltaX: number;
    deltaY: number;
    lastX?: number;
    lastY?: number;
};
export declare type PartialPosition = {
    left: number;
    top: number;
};
export declare type DroppingPosition = {
    left: number;
    top: number;
    e: Event;
};
export declare type Size = {
    width: number;
    height: number;
};
export declare type GridDragEvent = {
    e: Event;
    node: HTMLElement;
    newPosition: PartialPosition;
};
export declare type GridResizeEvent = {
    e: Event;
    node: HTMLElement;
    size: Size;
};
export declare type DragOverEvent = MouseEvent & {
    nativeEvent: {
        layerX: number;
        layerY: number;
        target: {
            className: String;
        };
    };
};
export declare type EventCallback = (layout: Layout, oldItem?: LayoutItem, newItem?: LayoutItem, placeholder?: LayoutItem, event?: Event, element?: HTMLElement) => void;
export declare enum CompactType {
    horizontal = "horizontal",
    vertical = "vertical"
}
export declare function optionalNumber(number?: number): number;
/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export declare function bottom(layout: Layout): number;
export declare function cloneLayout(layout: Layout): Layout;
export declare function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem;
/**
 * Given two layoutitems, check if they collide.
 */
export declare function collides(l1: LayoutItem, l2: LayoutItem): boolean;
/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * Does not modify layout items (clones). Creates a new layout array.
 *
 * @param  {Array} layout Layout.
 * @param compactType
 * @param cols
 *   vertically.
 * @return {Array}       Compacted Layout.
 */
export declare function compact(layout: Layout, compactType: CompactType, cols: number): Layout;
/**
 * Compact an item in the layout.
 *
 * Modifies item.
 *
 */
export declare function compactItem(compareWith: Layout, l: LayoutItem, compactType: CompactType, cols: number, fullLayout: Layout): LayoutItem;
/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * Modifies layout items.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export declare function correctBounds(layout: Layout, bounds: {
    cols: number;
}): Layout;
/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export declare function getLayoutItem(layout: Layout, id: string): LayoutItem | undefined;
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param layout
 * @param  {Object} layoutItem Layout item.
 * @return {Object|undefined}  A colliding layout item, or undefined.
 */
export declare function getFirstCollision(layout: Layout, layoutItem: LayoutItem): LayoutItem | undefined;
export declare function getAllCollisions(layout: Layout, layoutItem: LayoutItem): Array<LayoutItem>;
/**
 * Get all static elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of static layout items..
 */
export declare function getStatics(layout: Layout): Array<LayoutItem>;
/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * Modifies layout items.
 *
 * @param  {Array}      layout            Full layout to modify.
 * @param  {LayoutItem} l                 element to move.
 * @param  {Number}     [x]               X position in grid units.
 * @param  {Number}     [y]               Y position in grid units.
 * @param isUserAction
 * @param preventCollision
 * @param compactType
 * @param cols
 */
export declare function moveElement(layout: Layout, l: LayoutItem, x: number | undefined, y: number | undefined, isUserAction: boolean | undefined, preventCollision: boolean | undefined, compactType: CompactType, cols: number): Layout;
/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 * @param isUserAction
 * @param compactType
 * @param cols
 */
export declare function moveElementAwayFromCollision(layout: Layout, collidesWith: LayoutItem, itemToMove: LayoutItem, isUserAction: boolean | undefined, compactType: CompactType, cols: number): Layout;
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export declare function perc(num: number): string;
export declare function setTransform({ top, left, width, height }: Position): Object;
export declare function setTopLeft({ top, left, width, height }: Position): Object;
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted static items first.
 */
export declare function sortLayoutItems(layout: Layout, compactType: CompactType): Layout;
/**
 * Sort layout items by row ascending and column ascending.
 *
 * Does not modify Layout.
 */
export declare function sortLayoutItemsByRowCol(layout: Layout): Layout;
/**
 * Sort layout items by column ascending then row ascending.
 *
 * Does not modify Layout.
 */
export declare function sortLayoutItemsByColRow(layout: Layout): Layout;
/**
 * Generate a layout using the initialLayout and children as a template.
 * Missing entries will be added, extraneous ones will be truncated.
 *
 * Does not modify initialLayout.
 *
 * @param  {Array}  initialLayout Layout passed in through props.
 * @param {Array} children
 * @param cols
 * @param compactType
 * @return {Array}                Working layout.
 */
export declare function synchronizeLayoutWithChildren(initialLayout: Layout, children: Vue[], cols: number, compactType: CompactType): Layout;
/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export declare function validateLayout(layout: Layout, contextName?: string): void;
export declare const noop: () => void;
