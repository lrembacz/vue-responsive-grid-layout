import { ControlPosition, DraggableData, MouseTouchEvent } from './types';
import DraggableCore from '../VueDraggableCore';
export declare function snapToGrid(grid: [number, number], pendingX: number, pendingY: number): [number, number];
export declare function getControlPosition(e: MouseTouchEvent, touchIdentifier: number | null, draggableCore?: typeof DraggableCore): ControlPosition | null;
export declare function createCoreData(draggable: typeof DraggableCore, x: number, y: number): DraggableData;
