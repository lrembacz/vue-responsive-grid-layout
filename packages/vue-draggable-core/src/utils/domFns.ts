import { findInArray, isFunction } from './shims';

import { ControlPosition, PositionOffsetControlPosition, MouseTouchEvent } from './types';

let matchesSelectorFunc = '';

export function matchesSelector(el: Node, selector: string): boolean {
    if (!matchesSelectorFunc) {
        matchesSelectorFunc = findInArray(
            ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'],
            function(method: any) {
                return isFunction((el as any)[method]);
            }
        );
    }

    if (!isFunction((el as any)[matchesSelectorFunc])) return false;

    return (el as any)[matchesSelectorFunc](selector);
}

// Works up the tree to the draggable itself attempting to match selector.
export function matchesSelectorAndParentsTo(el: Node, selector: string, baseNode: Node): boolean {
    let node: Node | null = el;
    do {
        if (matchesSelector(node, selector)) return true;
        if (node === baseNode) return false;
        node = node.parentNode;
    } while (node);

    return false;
}

export function addEvent(el: Node, event: string, handler: Function, inputOptions?: Object): void {
    if (!el) return;
    const options = { capture: true, ...inputOptions };
    if (el.addEventListener) {
        el.addEventListener(event, handler as EventListener, options);
    } else if ((el as any).attachEvent) {
        (el as any).attachEvent('on' + event, handler);
    } else {
        (el as any)['on' + event] = handler;
    }
}

export function removeEvent(el: Node, event: string, handler: Function, inputOptions?: Object): void {
    if (!el) return;
    const options = { capture: true, ...inputOptions };
    if (el.removeEventListener) {
        el.removeEventListener(event, handler as EventListener, options);
    } else if ((el as any).detachEvent) {
        (el as any).detachEvent('on' + event, handler);
    } else {
        (el as any)['on' + event] = null;
    }
}

// Get from offsetParent
export function offsetXYFromParent(
    evt: { clientX: number; clientY: number },
    offsetParent: HTMLElement,
    scale: number
): ControlPosition {
    const isBody = offsetParent === offsetParent.ownerDocument.body;
    const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

    const x = (evt.clientX + offsetParent.scrollLeft - offsetParentRect.left) / scale;
    const y = (evt.clientY + offsetParent.scrollTop - offsetParentRect.top) / scale;

    return { x, y };
}

export function getTouch(e: MouseTouchEvent, identifier: number): { clientX: number; clientY: number } {
    return (
        (e.targetTouches && findInArray(e.targetTouches, (t: any) => identifier === t.identifier)) ||
        (e.changedTouches && findInArray(e.changedTouches, (t: any) => identifier === t.identifier))
    );
}

export function getTouchIdentifier(e: MouseTouchEvent): number | null {
    if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
    if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
    return null;
}

// Note we're passing `document` b/c we could be iframed
export function addUserSelectStyles(doc: Document) {
    if (!doc) return;
    let styleEl = doc.getElementById('vue-draggable-style-el');
    if (!styleEl) {
        styleEl = doc.createElement('style');
        (styleEl as HTMLStyleElement).type = 'text/css';
        styleEl.id = 'vue-draggable-style-el';
        styleEl.innerHTML = '.vue-draggable-transparent-selection *::-moz-selection {all: inherit;}\n';
        styleEl.innerHTML += '.vue-draggable-transparent-selection *::selection {all: inherit;}\n';
        doc.getElementsByTagName('head')[0].appendChild(styleEl);
    }
    if (doc.body) addClassName(doc.body, 'vue-draggable-transparent-selection');
}

export function removeUserSelectStyles(doc: Document) {
    if (!doc) return;
    try {
        if (doc.body) removeClassName(doc.body, 'vue-draggable-transparent-selection');
        const selection = doc.getSelection();
        if (selection) {
            selection.empty();
        } else {
            // Remove selection caused by scroll, unless it's a focused input
            // (we use doc.defaultView in case we're in an iframe)
            const selection = (doc.defaultView || window).getSelection();
            if (selection && selection.type !== 'Caret') {
                selection.removeAllRanges();
            }
        }
    } catch (e) {
        // probably IE
    }
}

export function addClassName(el: HTMLElement, className: string) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
            el.className += ` ${className}`;
        }
    }
}

export function removeClassName(el: HTMLElement, className: string) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
    }
}
