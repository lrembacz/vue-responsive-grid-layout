export declare type DraggableData = {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
};
export declare type Bounds = {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
};
export declare type ControlPosition = {
    x: number;
    y: number;
};
export declare type PositionOffsetControlPosition = {
    x: number | string;
    y: number | string;
};
export declare type MouseTouchEvent = MouseEvent & TouchEvent;
