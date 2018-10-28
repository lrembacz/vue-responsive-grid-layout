import { cloneLayout, compact, correctBounds } from './utils';

import { CompactType, Layout } from './utils';
import {bottom, cloneLayoutItem, getLayoutItem, VueChildren} from '@/lib/utils';
import Vue from 'vue';

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

/**
 * Given a width, find the highest breakpoint that matches is valid for it (width > breakpoint).
 *
 * @param  {Object} breakpoints Breakpoints object (e.g. {lg: 1200, md: 960, ...})
 * @param  {Number} width Screen width.
 * @return {String}       Highest breakpoint that is less than width.
 */
export function getBreakpointFromWidth(
    breakpoints: Breakpoints,
    width: number,
): Breakpoint {
    const sorted = sortBreakpoints(breakpoints);
    let matching = sorted[0];
    for (let i = 1, len = sorted.length; i < len; i++) {
        const breakpointName = sorted[i];
        if (width > breakpoints[breakpointName]) {
            matching = breakpointName;
        }
    }
    return matching;
}

/**
 * Given a breakpoint, get the # of cols set for it.
 * @param  {String} breakpoint Breakpoint name.
 * @param  {Object} cols       Map of breakpoints to cols.
 * @return {Number}            Number of cols.
 */
export function getColsFromBreakpoint(
    breakpoint: Breakpoint,
    cols: Breakpoints,
): number {
    if (!cols[breakpoint]) {
        throw new Error(
            'VueResponsiveGridLayout: `cols` entry for breakpoint ' +
            breakpoint +
            ' is missing!',
        );
    }
    return cols[breakpoint];
}

/**
 * Given existing layouts and a new breakpoint, find or generate a new layout.
 *
 * This finds the layout above the new one and generates from it, if it exists.
 *
 * @param  {Object} layouts     Existing layouts.
 * @param  {Breakpoints} breakpoints All breakpoints.
 * @param  {Breakpoint} breakpoint New breakpoint.
 * @param  {Breakpoint} lastBreakpoint Last breakpoint (for fallback).
 * @param  {Number} cols       Column count at new breakpoint.
 * @param  {CompactType} compactType Whether or not to compact the layout
 *   vertically.
 * @return {Array}             New layout.
 */
export function findOrGenerateResponsiveLayout(
    layouts: ResponsiveLayout,
    breakpoints: Breakpoints,
    breakpoint: Breakpoint,
    lastBreakpoint: Breakpoint,
    cols: number,
    compactType: CompactType,
): Layout {
    let lastBreakpointLength;
    let breakpointLength;

    if (layouts[breakpoint]) {
        breakpointLength = layouts[breakpoint].length;
    }

    const breakpointsSorted = sortBreakpoints(breakpoints);

    const keys = Object.keys(layouts);
    const layoutsLength = [];

    keys.forEach((item) => {
        layoutsLength.push(layouts[item].length);
    });

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
        return cloneLayout(layouts[breakpoint]);
    }

    // If there is wrongly given lastBreakpoint
    if (layouts[lastBreakpoint]) {
        lastBreakpointLength = layouts[lastBreakpoint].length;
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
        breakpointsSorted.indexOf(breakpoint),
    );

    for (let i = 0, len = breakpointsAbove.length; i < len; i++) {
        const b = breakpointsAbove[i];
        if (layouts[b]) {
            layout = layouts[b];
            break;
        }
    }
    layout = cloneLayout(layout || []); // clone layout so we don't modify existing items
    return compact(correctBounds(layout, { cols }), compactType, cols);
}

/**
 * Given breakpoints, return an array of breakpoints sorted by width. This is usually
 * e.g. ['xxs', 'xs', 'sm', ...]
 *
 * @param  {Object} breakpoints Key/value pair of breakpoint names to widths.
 * @return {Array}              Sorted breakpoints.
 */
export function sortBreakpoints(breakpoints: Breakpoints): Breakpoint[] {
    const keys: string[] = Object.keys(breakpoints);
    return keys.sort((a, b) => {
        return breakpoints[a] - breakpoints[b];
    });
}
