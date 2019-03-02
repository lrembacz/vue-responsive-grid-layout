import {VueConstructor, PluginObject } from 'vue';
import VueResponsiveGridLayout from './VueResponsiveGridLayout.vue';
import VueGridLayout from './VueGridLayout.vue';
import VueGridItem from './VueGridItem.vue';

declare global {
    interface Window {
        Vue: VueConstructor;
    }
}

const install = (Vue: VueConstructor): void => {
    Vue.component('vue-responsive-grid-layout', VueResponsiveGridLayout);
    Vue.component('vue-grid-layout', VueGridLayout);
    Vue.component('vue-grid-item', VueGridItem);
};

const version = '__VERSION__';

const plugin: PluginObject<VueConstructor> = {
    install,
    version,
};
export default plugin;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

export {
    VueResponsiveGridLayout,
    VueGridLayout,
    VueGridItem,
};
