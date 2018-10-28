import { Module } from 'vuex';
import { actions } from './actions';
import { mutations } from './mutations';
import { getters } from './getters';
import { LayoutState } from './types';
import { RootState } from '@/store';

export const state: LayoutState = {
    layouts: {
        lg: [
            {
                i: '1',
                x: 2,
                y: 6,
                h: 6,
                w: 2,
            },
            {
                i: '2',
                x: 0,
                y: 0,
                h: 6,
                w: 2,
            },
            {
                i: '3',
                x: 2,
                y: 0,
                h: 6,
                w: 2,
            },
            {
                i: '4',
                x: 4,
                y: 0,
                h: 6,
                w: 2,
            },
        ],
    },
    cols: 12,
    breakpoint: 'lg',

};

const namespaced: boolean = true;

export const layout: Module<LayoutState, RootState> = {
    namespaced,
    state,
    actions,
    getters,
    mutations,
};
