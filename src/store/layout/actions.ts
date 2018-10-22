import { ActionTree } from 'vuex';
import { LayoutState } from './types';
import { RootState } from '@/store';


export const actions: ActionTree<LayoutState, RootState> = {
    updateLayout({ commit }, { layout, breakpoint }): any {
        commit('setLayout', { layout, breakpoint });
    },
    updateBreakpoint({ commit }, { breakpoint }): any {
        commit('setBreakpoint', { breakpoint });
    },
    updateCols({ commit }, { cols }): any {
        commit('setCols', { cols });
    },
};
