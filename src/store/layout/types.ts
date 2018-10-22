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

export interface ResponsiveLayout {
    lg?: Layout;
    md?: Layout;
    sm?: Layout;
    xs?: Layout;
    xxs?: Layout;
}

export type Breakpoint = string;

export interface Breakpoints {
    lg?: number;
    md?: number;
    sm?: number;
    xs?: number;
    xxs?: number;
}

export interface LayoutState {
    layouts?: ResponsiveLayout;
    breakpoint: Breakpoint;
    cols: number;
}
