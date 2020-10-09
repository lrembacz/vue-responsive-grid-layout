export declare type Axis = 'both' | 'x' | 'y' | 'none';
export declare type ResizeHandleAxis = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne';
export declare type DragCallbackData = {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
};
export declare type ResizeCallbackData = {
    node: HTMLElement;
    size: {
        width: number;
        height: number;
    };
    handle: ResizeHandleAxis;
};
