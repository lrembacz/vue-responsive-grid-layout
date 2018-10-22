import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { layout } from './layout';

Vue.use(Vuex);

export interface RootState {
    modules?: object;
}


const store: StoreOptions<RootState> = {
    modules: {
        layout,
    },
};

export default new Vuex.Store<RootState>(store);
