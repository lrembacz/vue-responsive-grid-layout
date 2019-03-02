import Vue from 'vue';
export interface LayoutItem {
    w: number;
    h: number;
    x: number;
    y: number;
    i: string;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    moved?: boolean;
    immobile?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
}
export declare type Layout = LayoutItem[];
export interface Position {
    left: number;
    top: number;
    width: number;
    height: number;
}
export interface DraggableCallbackData {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
}
export interface PartialPosition {
    left: number;
    top: number;
}
export interface Size {
    width: number;
    height: number;
}
export interface GridDragEvent {
    e: Event;
    node: HTMLElement;
    newPosition: PartialPosition;
}
export interface GridResizeEvent {
    e: Event;
    node: HTMLElement;
    size: Size;
}
export declare type VueChildren = Vue[];
export declare type EventCallback = (layout: Layout, oldItem: LayoutItem | null, newItem: LayoutItem | null, placeholder: LayoutItem | null, Event: any, HTMLElement: HTMLElement | null) => void;
export declare type CompactType = 'horizontal' | 'vertical';
export interface QueueJob {
    job: string;
    params?: any;
}
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
 * Comparing React `children` is a bit difficult. This is a good way to compare them.
 * This will catch differences in keys, order, and length.
 */
export declare function childrenEqual(a: Vue, b: Vue): boolean;
/**
 * Given two layoutitems, check if they collide.
 */
export declare function collides(l1: LayoutItem, l2: LayoutItem): boolean;
/**
 * Given a layout, compact it. This involves going down each y coordinate and removing gaps
 * between items.
 *
 * @param  {Array} layout Layout.
 * @param  {CompactType} compactType Whether or not to compact the layout
 *   vertically.
 * @param {number} cols number of columns
 * @return {Array}       Compacted Layout.
 */
export declare function compact(layout: Layout, compactType: CompactType, cols: number): Layout;
/**
 * Compact an item in the layout.
 */
export declare function compactItem(compareWith: Layout, l: LayoutItem, compactType: CompactType, cols: number, fullLayout: Layout): LayoutItem;
/**
 * Given a layout, make sure all elements fit within its bounds.
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
 * @param  {Array<Layout>}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export declare function getLayoutItem(layout: Layout, id: string): LayoutItem | null;
/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param {Layout} layout
 * @param  {LayoutItem} layoutItem Layout item.
 * @return {Object|null}  A colliding layout item, or undefined.
 */
export declare function getFirstCollision(layout: Layout, layoutItem: LayoutItem): LayoutItem | undefined;
export declare function getAllCollisions(layout: Layout, layoutItem: LayoutItem): LayoutItem[];
/**
 * Get all immobile elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of immobile layout items..
 */
export declare function getStatics(layout: Layout): LayoutItem[];
/**
 * Move an element. Responsible for doing cascading movements of other elements.
 *
 * @param  {Layout}     layout            Full layout to modify.
 * @param {VueChildren} children          Children of layout
 * @param  {LayoutItem} l                 element to move.
 * @param  {Number}     [x]               X position in grid units.
 * @param  {Number}     [y]               Y position in grid units.
 * @param isUserAction
 * @param preventCollision
 * @param compactType
 * @param cols
 */
export declare function moveElement(layout: Layout, children: VueChildren, l: LayoutItem, x: number, y: number, isUserAction: boolean, preventCollision: boolean, compactType: CompactType, cols: number): Layout;
/**
 * This is where the magic needs to happen - given a collision, move an element away from the collision.
 * We attempt to move it up if there's room, otherwise it goes below.
 *
 * @param  {Array} layout            Full layout to modify.
 * @param {VueChildren} children     Children of layout
 * @param  {LayoutItem} collidesWith Layout item we're colliding with.
 * @param  {LayoutItem} itemToMove   Layout item we're moving.
 * @param isUserAction
 * @param compactType
 * @param cols
 * @return {Layout} Layout
 */
export declare function moveElementAwayFromCollision(layout: Layout, children: VueChildren, collidesWith: LayoutItem, itemToMove: LayoutItem, isUserAction: boolean, compactType: CompactType, cols: number): Layout;
/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export declare function perc(num: number): string;
export declare function setTransform({ top, left, width, height }: Position): object;
export declare function setTopLeft({ top, left, width, height }: Position): object;
/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted immobile items first.
 */
export declare function sortLayoutItems(layout: Layout, compactType: CompactType): Layout;
export declare function sortLayoutItemsByRowCol(layout: Layout): Layout;
export declare function sortLayoutItemsByColRow(layout: Layout): Layout;
/**
 * Generate a layout using the initialLayout and children as a template.
 * Missing entries will be added, extraneous ones will be truncated.
 *
 * @param  {Array}  initialLayout Layout passed in through props.
 * @param  {VueChildren} children Children of parent layout
 * @param  {number} cols    Current columns number.
 * @param  {CompactType} compactType      Compaction option.
 * @return {Array}                Working layout.
 */
export declare function synchronizeLayoutWithChildren(initialLayout: Layout, children: VueChildren, cols: number, compactType: CompactType): Layout;
/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export declare function validateLayout(layout: Layout, contextName?: string): boolean;
export declare function autoBindHandlers(el: object, fns: string[]): void;
