export type DraggableData = {
    node: HTMLElement;
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    lastX: number;
    lastY: number;
};

export type Bounds = {
    left?: number;
    top?: number;
    right?: number;
    bottom?: number;
};
export type ControlPosition = { x: number; y: number };
export type PositionOffsetControlPosition = {
    x: number | string;
    y: number | string;
};

export type MouseTouchEvent = MouseEvent & TouchEvent;
