import { GetterTree } from 'vuex';
import { LayoutState } from './types';
import { RootState } from '@/store';

export const getters: GetterTree<LayoutState, RootState> = {
    layout(state): string {
        return state.layouts[state.breakpoint];
    },
};
