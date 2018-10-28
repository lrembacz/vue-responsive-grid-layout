import isEqual from 'lodash/isEqual';
import {Vue} from 'vue/types/vue';

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

export type Layout = LayoutItem[];

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

export type VueChildren = Vue[];

// All callbacks are of the signature (layout, oldItem, newItem, placeholder, e).
export type EventCallback = (
    layout: Layout,
    oldItem: LayoutItem | null,
    newItem: LayoutItem | null,
    placeholder: LayoutItem | null,
    Event,
    HTMLElement: HTMLElement | null,
) => void;
export type CompactType = 'horizontal' | 'vertical';

export interface QueueJob {
    job: string;
    params?: any;
}

const isProduction = process.env.NODE_ENV === 'production';
const DEBUG = false;

/**
 * Return the bottom coordinate of the layout.
 *
 * @param  {Array} layout Layout array.
 * @return {Number}       Bottom coordinate.
 */
export function bottom(layout: Layout): number {
    let max = 0;
    let bottomY = 0;
    for (let i = 0, len = layout.length; i < len; i++) {
        bottomY = layout[i].y + layout[i].h;
        if (bottomY > max) {
            max = bottomY;
        }
    }
    return max;
}

export function cloneLayout(layout: Layout): Layout {
    const newLayout = Array(layout.length);
    for (let i = 0, len = layout.length; i < len; i++) {
        newLayout[i] = cloneLayoutItem(layout[i]);
    }
    return newLayout;
}

// Fast path to cloning, since this is monomorphic
export function cloneLayoutItem(layoutItem: LayoutItem): LayoutItem {
    return {
        w: layoutItem.w,
        h: layoutItem.h,
        x: layoutItem.x,
        y: layoutItem.y,
        i: layoutItem.i,
        minW: layoutItem.minW,
        maxW: layoutItem.maxW,
        minH: layoutItem.minH,
        maxH: layoutItem.maxH,
        moved: Boolean(layoutItem.moved),
        immobile: Boolean(layoutItem.immobile),
        // These can be null
        isDraggable: layoutItem.isDraggable,
        isResizable: layoutItem.isResizable,
    };
}

/**
 * Comparing React `children` is a bit difficult. This is a good way to compare them.
 * This will catch differences in keys, order, and length.
 */
export function childrenEqual(a: Vue, b: Vue): boolean {
    return isEqual(a, b);
}

/**
 * Given two layoutitems, check if they collide.
 */
export function collides(l1: LayoutItem, l2: LayoutItem): boolean {
    if (l1.i === l2.i) {
        return false; // same element
    }
    if (l1.x + l1.w <= l2.x) {
        return false; // l1 is left of l2
    }
    if (l1.x >= l2.x + l2.w) {
        return false; // l1 is right of l2
    }
    if (l1.y + l1.h <= l2.y) {
        return false; // l1 is above l2
    }
    if (l1.y >= l2.y + l2.h) {
        return false; // l1 is below l2
    }
    return true; // boxes overlap
}

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
export function compact(
    layout: Layout,
    compactType: CompactType,
    cols: number,
): Layout {
    // Statics go in the compareWith array right away so items flow around them.
    const compareWith = getStatics(layout);
    // We go through the items by row and column.
    const sorted = sortLayoutItems(layout, compactType);
    // Holding for new items.
    const out = Array(layout.length);

    for (let i = 0, len = sorted.length; i < len; i++) {
        let l = cloneLayoutItem(sorted[i]);

        // Don't move immobile elements
        if (!l.immobile) {
            l = compactItem(compareWith, l, compactType, cols, sorted);

            // Add to comparison array. We only collide with items before this one.
            // Statics are already in this array.
            compareWith.push(l);
        }

        // Add to output array to make sure they still come out in the right order.
        out[layout.indexOf(sorted[i])] = l;

        // Clear moved flag, if it exists.
        l.moved = false;
    }

    return out;
}

const heightWidth = { x: 'w', y: 'h' };
/**
 * Before moving item down, it will check if the movement will cause collisions and move those items down before.
 */
function resolveCompactionCollision(
    layout: Layout,
    item: LayoutItem,
    moveToCoord: number,
    axis: 'x' | 'y',
) {
    const sizeProp = heightWidth[axis];
    item[axis] += 1;
    const itemIndex = layout
        .map((layoutItem) => {
            return layoutItem.i;
        })
        .indexOf(item.i);

    // Go through each item we collide with.
    for (let i = itemIndex + 1; i < layout.length; i++) {
        const otherItem = layout[i];
        // Ignore immobile items
        if (otherItem.immobile) {
            continue;
        }

        // Optimization: we can break early if we know we're past this el
        // We can do this b/c it's a sorted layout
        if (otherItem.y > (item.y + item.h)) {
            break;
        }

        if (collides(item, otherItem)) {
            resolveCompactionCollision(
                layout,
                otherItem,
                moveToCoord + item[sizeProp],
                axis,
            );
        }
    }

    item[axis] = moveToCoord;
}

/**
 * Compact an item in the layout.
 */
export function compactItem(
    compareWith: Layout,
    l: LayoutItem,
    compactType: CompactType,
    cols: number,
    fullLayout: Layout,
): LayoutItem {
    const compactV = compactType === 'vertical';
    const compactH = compactType === 'horizontal';
    if (compactV) {
        // Bottom 'y' possible is the bottom of the layout.
        // This allows you to do nice stuff like specify {y: Infinity}
        // This is here because the layout must be sorted in order to get the correct bottom `y`.
        l.y = Math.min(bottom(compareWith), l.y);
        // Move the element up as far as it can go without colliding.
        while (l.y > 0 && !getFirstCollision(compareWith, l)) {
            l.y--;
        }
    } else if (compactH) {
        l.y = Math.min(bottom(compareWith), l.y);
        // Move the element left as far as it can go without colliding.
        while (l.x > 0 && !getFirstCollision(compareWith, l)) {
            l.x--;
        }
    }

    // Move it down, and keep moving it down if it's colliding.
    while (getFirstCollision(compareWith, l)) {
        if (compactH) {
            resolveCompactionCollision(fullLayout, l, getFirstCollision(compareWith, l).x
                + getFirstCollision(compareWith, l).w, 'x');
        } else {
            resolveCompactionCollision(fullLayout, l, getFirstCollision(compareWith, l).y
                + getFirstCollision(compareWith, l).h, 'y');
        }
        // Since we can't grow without bounds horizontally, if we've overflown, let's move it down and try again.
        if (compactH && l.x + l.w > cols) {
            l.x = cols - l.w;
            l.y++;
        }
    }
    return l;
}

/**
 * Given a layout, make sure all elements fit within its bounds.
 *
 * @param  {Array} layout Layout array.
 * @param  {Number} bounds Number of columns.
 */
export function correctBounds(
    layout: Layout,
    bounds: { cols: number },
): Layout {
    const collidesWith = getStatics(layout);
    for (let i = 0, len = layout.length; i < len; i++) {
        const l = layout[i];
        // Overflows right
        if (l.x + l.w > bounds.cols) {
            l.x = bounds.cols - l.w;
        }
        // Overflows left
        if (l.x < 0) {
            l.x = 0;
            l.w = bounds.cols;
        }
        if (!l.immobile) {
            collidesWith.push(l);
        } else {
            // If this is immobile and collides with other immobiles, we must move it down.
            // We have to do something nicer than just letting them overlap.
            while (getFirstCollision(collidesWith, l)) {
                l.y++;
            }
        }
    }
    return layout;
}

/**
 * Get a layout item by ID. Used so we can override later on if necessary.
 *
 * @param  {Array<Layout>}  layout Layout array.
 * @param  {String} id     ID
 * @return {LayoutItem}    Item at ID.
 */
export function getLayoutItem(layout: Layout, id: string): LayoutItem | null {
    for (let i = 0, len = layout.length; i < len; i++) {
    if (layout[i].i === id) {
        return layout[i];
    }
}
}

/**
 * Returns the first item this layout collides with.
 * It doesn't appear to matter which order we approach this from, although
 * perhaps that is the wrong thing to do.
 *
 * @param {Layout} layout
 * @param  {LayoutItem} layoutItem Layout item.
 * @return {Object|null}  A colliding layout item, or undefined.
 */
export function getFirstCollision(
    layout: Layout,
    layoutItem: LayoutItem,
): LayoutItem | undefined {
    for (let i = 0, len = layout.length; i < len; i++) {
    if (collides(layout[i], layoutItem)) {
        return layout[i];
    }
}
}

export function getAllCollisions(
    layout: Layout,
    layoutItem: LayoutItem,
): LayoutItem[] {
    return layout.filter((l) => collides(l, layoutItem));
}

/**
 * Get all immobile elements.
 * @param  {Array} layout Array of layout objects.
 * @return {Array}        Array of immobile layout items..
 */
export function getStatics(layout: Layout): LayoutItem[] {
    return layout.filter((l) => l.immobile);
}

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
export function moveElement(
    layout: Layout,
    children: VueChildren,
    l: LayoutItem,
    x: number,
    y: number,
    isUserAction: boolean,
    preventCollision: boolean,
    compactType: CompactType,
    cols: number,
): Layout {
    if (children) {
        const index = children.findIndex( (item) => item.$props.i === l.i);
        if (index >= 0) {
            if (children[index].$props.immobile === true) {
                return layout;
            }
        }
    }

    if (l.immobile) {
        return layout;
    }

    // Short-circuit if nothing to do.
    if (l.y === y && l.x === x) {
        return layout;
    }

    log(`Moving element ${l.i} to [${String(x)},${String(y)}] from [${l.x},${l.y}]`);
    const oldX = l.x;
    const oldY = l.y;

    // This is quite a bit faster than extending the object
    if (typeof x === 'number') {
        l.x = x;
    }
    if (typeof y === 'number') {
        l.y = y;
    }
    l.moved = true;

    // If this collides with anything, move it.
    // When doing this comparison, we have to sort the items we compare with
    // to ensure, in the case of multiple collisions, that we're getting the
    // nearest collision.
    let sorted = sortLayoutItems(layout, compactType);
    const movingUp =
        compactType === 'vertical' && typeof y === 'number' ? oldY >= y
            : compactType === 'horizontal' && typeof x === 'number' ? oldX >= x
            : false;
    if (movingUp) {
        sorted = sorted.reverse();
    }
    const collisions = getAllCollisions(sorted, l);

    // There was a collision; abort
    if (preventCollision && collisions.length) {
        log(`Collision prevented on ${l.i}, reverting.`);
        l.x = oldX;
        l.y = oldY;
        l.moved = false;
        return layout;
    }

    // Move each item that collides away from this element.
    for (let i = 0, len = collisions.length; i < len; i++) {
        const collision = collisions[i];
        log(
            `Resolving collision between ${l.i} at [${l.x},${l.y}] and ${
                collision.i
                } at [${collision.x},${collision.y}]`,
        );

        // Short circuit so we can't infinite loop
        if (collision.moved) {
            continue;
        }

        // Don't move immobile items - we have to move *this* element away
        if (collision.immobile) {
            layout = moveElementAwayFromCollision(
                layout,
                children,
                collision,
                l,
                isUserAction,
                compactType,
                cols,
            );
        } else {
            layout = moveElementAwayFromCollision(
                layout,
                children,
                l,
                collision,
                isUserAction,
                compactType,
                cols,
            );
        }
    }

    return layout;
}

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
export function moveElementAwayFromCollision(
    layout: Layout,
    children: VueChildren,
    collidesWith: LayoutItem,
    itemToMove: LayoutItem,
    isUserAction: boolean,
    compactType: CompactType,
    cols: number,
): Layout {
    const compactH = compactType === 'horizontal';
    // Compact vertically if not set to horizontal
    const compactV = compactType !== 'horizontal';
    const preventCollision = false; // we're already colliding

    // If there is enough space above the collision to put this element, move it there.
    // We only do this on the main collision as this can get funky in cascades and cause
    // unwanted swapping behavior.
    if (isUserAction) {
        // Reset isUserAction flag because we're not in the main collision anymore.
        isUserAction = false;

        // Make a mock item so we don't modify the item here, only modify in moveElement.
        const fakeItem: LayoutItem = {
            x: compactH ? Math.max(collidesWith.x - itemToMove.w, 0) : itemToMove.x,
            y: compactV ? Math.max(collidesWith.y - itemToMove.h, 0) : itemToMove.y,
            w: itemToMove.w,
            h: itemToMove.h,
            i: '-1',
        };

        // No collision? If so, we can go up there; otherwise, we'll end up moving down as normal
        if (!getFirstCollision(layout, fakeItem)) {
            log(
                `Doing reverse collision on ${itemToMove.i} up to [${fakeItem.x},${
                    fakeItem.y
                    }].`,
            );
            return moveElement(
                layout,
                children,
                itemToMove,
                compactH ? fakeItem.x : undefined,
                compactV ? fakeItem.y : undefined,
                isUserAction,
                preventCollision,
                compactType,
                cols,
            );
        }
    }

    return moveElement(
        layout,
        children,
        itemToMove,
        compactH ? itemToMove.x + 1 : undefined,
        compactV ? itemToMove.y + 1 : undefined,
        isUserAction,
        preventCollision,
        compactType,
        cols,
    );
}

/**
 * Helper to convert a number to a percentage string.
 *
 * @param  {Number} num Any number
 * @return {String}     That number as a percentage.
 */
export function perc(num: number): string {
    return num * 100 + '%';
}

export function setTransform({ top, left, width, height }: Position): object {
    // Replace unitless items with px
    const translate = `translate(${left}px,${top}px)`;
    return {
        transform: translate,
        WebkitTransform: translate,
        MozTransform: translate,
        msTransform: translate,
        OTransform: translate,
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
    };
}

export function setTopLeft({ top, left, width, height }: Position): object {
    return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
    };
}

/**
 * Get layout items sorted from top left to right and down.
 *
 * @return {Array} Array of layout objects.
 * @return {Array}        Layout, sorted immobile items first.
 */
export function sortLayoutItems(
    layout: Layout,
    compactType: CompactType,
): Layout {
    if (compactType === 'horizontal') {
        return sortLayoutItemsByColRow(layout);
    } else {
        return sortLayoutItemsByRowCol(layout);
    }
}

export function sortLayoutItemsByRowCol(layout: Layout): Layout {
    return [].concat(layout).sort((a, b) => {
        if (a.y > b.y || (a.y === b.y && a.x > b.x)) {
            return 1;
        } else if (a.y === b.y && a.x === b.x) {
            // Without this, we can get different sort results in IE vs. Chrome/FF
            return 0;
        }
        return -1;
    });
}

export function sortLayoutItemsByColRow(layout: Layout): Layout {
    return [].concat(layout).sort((a, b) => {
        if (a.x > b.x || (a.x === b.x && a.y > b.y)) {
            return 1;
        }
        return -1;
    });
}

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
export function synchronizeLayoutWithChildren(
    initialLayout: Layout,
    children: VueChildren,
    cols: number,
    compactType: CompactType,
): Layout {
    initialLayout = initialLayout || [];

    // Generate one layout item per child.
    let layout: Layout = [];
    if (children.length > 0) {
        children.map( (child: Vue) => {
            const props = child.$props;
            const key = props.i;
            const exists = getLayoutItem(initialLayout, String(key));
            if (exists) {
                layout.push(cloneLayoutItem(exists));
            } else {
                const {x, y, w, h, immobile} = props;

                if (x !== undefined && y !== undefined && w !== undefined && h !== undefined && key !== undefined ) {
                    layout.push(cloneLayoutItem({ x, y, w, h, immobile: immobile ? immobile : false, i: String(key)}));
                } else {
                    layout.push(cloneLayoutItem({
                        w: 1,
                        h: 1,
                        x: 0,
                        y: bottom(layout),
                        i: String(key),
                    }));
                }

            }
        });
    } else {
        layout = initialLayout;
    }

    // Correct the layout.
    layout = correctBounds(layout, { cols });
    layout = compact(layout, compactType, cols);

    return layout;
}

/**
 * Validate a layout. Throws errors.
 *
 * @param  {Array}  layout        Array of layout items.
 * @param  {String} [contextName] Context name for errors.
 * @throw  {Error}                Validation error.
 */
export function validateLayout(
    layout: Layout,
    contextName: string = 'Layout',
): boolean {
    const subProps = ['x', 'y', 'w', 'h'];
    if (!Array.isArray(layout)) {
        throw new Error(contextName + ' must be an array!');
    }

    for (const lay of layout) {
        const item = lay;
        for (const subProp of subProps) {
            if (typeof item[subProp] !== 'number') {
                throw new Error(
                    'GridLayout: ' +
                    contextName +
                    '[' +
                    lay +
                    '].' +
                    subProp +
                    ' must be a number!',
                );
            }
        }
        if (item.i && typeof item.i !== 'string') {
            throw new Error(
                'GridLayout: ' + contextName + '[' + lay + '].i must be a string!',
            );
        }
        if (item.immobile !== undefined && typeof item.immobile !== 'boolean') {
            throw new Error(
                'GridLayout: ' +
                contextName +
                '[' +
                lay +
                '].immobile must be a boolean!',
            );
        }
    }
    return true;
}

// Flow can't really figure this out, so we just use Object
export function autoBindHandlers(el: object, fns: string[]): void {
    fns.forEach((key) => (el[key] = el[key].bind(el)));
}

function log(...args) {
    if (!DEBUG) {
        return;
    }
    // eslint-disable-next-line no-console
    console.log(...args);
}
