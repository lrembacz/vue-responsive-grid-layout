import { CompactType, Layout } from './utils';
export declare type Breakpoint = string;
export declare type DefaultBreakpoints = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';
export declare type ResponsiveLayout = {
    [breakpoint: string]: Layout;
};
export declare type Breakpoints = {
    [breakpoint: string]: number;
};
/**
 * Given a width, find the highest breakpoint that matches is valid for it (width > breakpoint).
 *
 * @param  {Object} breakpoints Breakpoints object (e.g. {lg: 1200, md: 960, ...})
 * @param  {Number} width Screen width.
 * @return {String}       Highest breakpoint that is less than width.
 */
export declare function getBreakpointFromWidth(breakpoints: Breakpoints, width: number): Breakpoint;
/**
 * Given a breakpoint, get the # of cols set for it.
 * @param  {String} breakpoint Breakpoint name.
 * @param  {Object} cols       Map of breakpoints to cols.
 * @return {Number}            Number of cols.
 */
export declare function getColsFromBreakpoint(breakpoint: Breakpoint, cols: Breakpoints): number;
/**
 * Given existing layouts and a new breakpoint, find or generate a new layout.
 *
 * This finds the layout above the new one and generates from it, if it exists.
 *
 * @param  {Object} layouts     Existing layouts.
 * @param  {Array} breakpoints All breakpoints.
 * @param  {String} breakpoint New breakpoint.
 * @param  {String} lastBreakpoint
 * @param  {String} breakpoint Last breakpoint (for fallback).
 * @param  {Number} cols       Column count at new breakpoint.
 * @param  {CompactType} compactType
 *   vertically.
 * @return {Array}             New layout.
 */
export declare function findOrGenerateResponsiveLayout(layouts: ResponsiveLayout, breakpoints: Breakpoints, breakpoint: Breakpoint, lastBreakpoint: Breakpoint, cols: number, compactType: CompactType): Layout;
/**
 * Given breakpoints, return an array of breakpoints sorted by width. This is usually
 * e.g. ['xxs', 'xs', 'sm', ...]
 *
 * @param  {Object} breakpoints Key/value pair of breakpoint names to widths.
 * @return {Array}              Sorted breakpoints.
 */
export declare function sortBreakpoints(breakpoints: Breakpoints): Array<Breakpoint>;
