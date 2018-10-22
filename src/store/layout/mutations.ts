import { MutationTree } from 'vuex';
import {LayoutState} from '@/store/layout/types';

export const mutations: MutationTree<LayoutState> = {
    setLayout(state, { layout, breakpoint }) {
        state.layouts = Object.assign({}, state.layouts, { [breakpoint]: layout} );
    },
    setCols(state, { cols }) {
        state.cols = cols;
    },
    setBreakpoint(state, { breakpoint }) {
        state.breakpoint = breakpoint;
    },
};
