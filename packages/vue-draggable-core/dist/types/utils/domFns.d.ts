import { ControlPosition, PositionOffsetControlPosition, MouseTouchEvent } from './types';
export declare function matchesSelector(el: Node, selector: string): boolean;
export declare function matchesSelectorAndParentsTo(el: Node, selector: string, baseNode: Node): boolean;
export declare function addEvent(el: Node, event: string, handler: Function, inputOptions?: Object): void;
export declare function removeEvent(el: Node, event: string, handler: Function, inputOptions?: Object): void;
export declare function offsetXYFromParent(evt: {
    clientX: number;
    clientY: number;
}, offsetParent: HTMLElement, scale: number): ControlPosition;
export declare function getTranslation({ x, y }: ControlPosition, positionOffset: PositionOffsetControlPosition, unitSuffix: string): string;
export declare function getTouch(e: MouseTouchEvent, identifier: number): {
    clientX: number;
    clientY: number;
};
export declare function getTouchIdentifier(e: MouseTouchEvent): number | null;
export declare function addUserSelectStyles(doc: Document): void;
export declare function removeUserSelectStyles(doc: Document): void;
export declare function addClassName(el: HTMLElement, className: string): void;
export declare function removeClassName(el: HTMLElement, className: string): void;
