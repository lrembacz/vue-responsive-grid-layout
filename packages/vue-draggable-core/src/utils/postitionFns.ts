import { isNum } from './shims';
import { getTouch, offsetXYFromParent } from './domFns';

import { Bounds, ControlPosition, DraggableData, MouseTouchEvent } from './types';
import DraggableCore from '../VueDraggableCore';

export function snapToGrid(grid: [number, number], pendingX: number, pendingY: number): [number, number] {
    const x = Math.round(pendingX / grid[0]) * grid[0];
    const y = Math.round(pendingY / grid[1]) * grid[1];
    return [x, y];
}

// Get {x, y} positions from event.
export function getControlPosition(
    e: MouseTouchEvent,
    touchIdentifier: number | null,
    draggableCore?: typeof DraggableCore
): ControlPosition | null {
    const touchObj = typeof touchIdentifier === 'number' ? getTouch(e, touchIdentifier) : null;
    if (typeof touchIdentifier === 'number' && !touchObj) return null; // not the right touch
    const node = findDOMNode(draggableCore as any);
    // User can provide an offsetParent if desired.
    const offsetParent = (draggableCore as any).offsetParent || node.offsetParent || node.ownerDocument.body;
    return offsetXYFromParent(touchObj || e, offsetParent, (draggableCore as any).scale);
}

// Create an data object exposed by <DraggableCore>'s events
export function createCoreData(draggable: typeof DraggableCore, x: number, y: number): DraggableData {
    const state = draggable;
    const isStart = !isNum((state as any).lastX);
    const node = findDOMNode(draggable);

    if (isStart) {
        // If this is our first move, use the x and y as last coords.
        return {
            node,
            deltaX: 0,
            deltaY: 0,
            lastX: x,
            lastY: y,
            x,
            y
        };
    } else {
        // Otherwise calculate proper values.
        return {
            node,
            deltaX: x - (state as any).lastX,
            deltaY: y - (state as any).lastY,
            lastX: (state as any).lastX,
            lastY: (state as any).lastY,
            x,
            y
        };
    }
}

// A lot faster than stringify/parse
function cloneBounds(bounds: Bounds): Bounds {
    return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.right,
        bottom: bounds.bottom
    };
}

function findDOMNode(draggable: typeof DraggableCore): HTMLElement {
    const node = (draggable as any).findDOMNode();
    if (!node) {
        throw new Error('<DraggableCore>: Unmounted during event!');
    }
    return node;
}
