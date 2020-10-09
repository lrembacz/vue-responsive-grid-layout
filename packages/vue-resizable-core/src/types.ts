export type Axis = 'both' | 'x' | 'y' | 'none';

export type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';

export type DragCallbackData = {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
};

export type ResizeCallbackData = {
    node: HTMLElement;
    size: { width: number; height: number };
    handle: ResizeHandleAxis;
};
