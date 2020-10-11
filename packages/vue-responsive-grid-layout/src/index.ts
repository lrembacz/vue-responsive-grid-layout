import Vue from 'vue';
import { VueConstructor } from 'vue';
import { default as VueGridItem } from './VueGridItem.vue';
import { default as VueGridLayout } from './VueGridLayout.vue';
import { default as VueResponsiveGridLayout } from './VueResponsiveGridLayout.vue';
import { default as WidthProvider } from './WidthProvider';

declare global {
    interface Window {
        Vue?: VueConstructor<Vue>;
    }
}

export interface Options {
    vueGridItemName?: string;
    vueGridLayoutName?: string;
    vueResponsiveGridLayoutName?: string;
    widthProviderName?: string;
}

function install(Vue: VueConstructor<Vue>, options: Options = {}) {
    Vue.component(options.vueGridItemName || 'VueGridItem', VueGridItem);
    Vue.component(options.vueGridLayoutName || 'VueGridLayout', VueGridLayout);
    Vue.component(options.vueResponsiveGridLayoutName || 'VueResponsiveGridLayout', VueResponsiveGridLayout);
    Vue.component(options.widthProviderName || 'WidthProvider', WidthProvider);
}

if (
    // @ts-ignore
    process.env.ROLLUP_BUILD_FORMAT === 'umd' &&
    typeof window !== 'undefined' &&
    window.Vue &&
    window.Vue === Vue
) {
    window.Vue.use({ install: install });
}

export default {
    install,
}

export { VueGridItem, VueGridLayout, VueResponsiveGridLayout, WidthProvider };
