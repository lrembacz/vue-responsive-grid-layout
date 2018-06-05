import { cloneLayout, compact, correctBounds } from "./utils";

export function getBreakpointFromWidth(
    breakpoints,
    width
) {
    const sorted = sortBreakpoints(breakpoints);
    let matching = sorted[0];
    for (let i = 1, len = sorted.length; i < len; i++) {
        const breakpointName = sorted[i];
        if (width > breakpoints[breakpointName]) matching = breakpointName;
    }
    return matching;
}

export function getColsFromBreakpoint(
    breakpoint,
    cols
) {
    if (!cols[breakpoint]) {
        throw new Error(
            "ResponsiveReactGridLayout: `cols` entry for breakpoint " +
            breakpoint +
            " is missing!"
        );
    }
    return cols[breakpoint];
}

export function findOrGenerateResponsiveLayout(
    layouts,
    breakpoints,
    breakpoint,
    lastBreakpoint,
    cols,
    compactType
) {
    let lastBreakpointLength;
    let breakpointLength;

    if (layouts[breakpoint]) {
        breakpointLength = layouts[breakpoint].length;
    }

    // If there is wrongly given lastBreakpoint
    if (layouts[lastBreakpoint]) {
        lastBreakpointLength = layouts[lastBreakpoint].length;
    }

    const breakpointsSorted = sortBreakpoints(breakpoints);

    const keys = Object.keys(layouts);
    let layoutsLength = [];

    keys.forEach((item) => {
        layoutsLength.push(layouts[item].length);
    })

    const max = Math.max(...layoutsLength);

    if (max !== breakpointLength) {
        for (let i = 0, len = breakpointsSorted.length; i < len; i++) {
            const b = breakpointsSorted[i];
            if (layouts[b]) {
                if (layouts[b].length === max) {
                    if (b === breakpoint) {
                        break;
                    } else {
                        breakpoint = b;
                    }
                }
            }
        }
    } else {
        return cloneLayout(layouts[breakpoint])
    }

    if (max !== lastBreakpointLength) {
        for (let i = 0, len = breakpointsSorted.length; i < len; i++) {
            const b = breakpointsSorted[i];
            if (layouts[b]) {
                if (layouts[b].length === max) {
                    if (b === lastBreakpoint) {
                        break;
                    } else {
                        lastBreakpoint = b;
                    }
                }
            }
        }
    }

    // Find or generate the next layout
    let layout = layouts[lastBreakpoint];

    const breakpointsAbove = breakpointsSorted.slice(
        breakpointsSorted.indexOf(breakpoint)
    );

    for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
        const b = breakpointsAbove[i];
        if (layouts[b]) {
            layout = layouts[b];
            break;
        }
    }

    layout = cloneLayout(layout || []); // clone layout so we don't modify existing items
    return compact(correctBounds(layout, { cols: cols }), compactType, cols);
}

export function sortBreakpoints(breakpoints) {
    const keys = Object.keys(breakpoints);
    return keys.sort(function(a, b) {
        return breakpoints[a] - breakpoints[b];
    });
}

