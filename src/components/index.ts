import _Vue from 'vue';
import VueResponsiveGridLayout from './VueResponsiveGridLayout.vue';
import VueGridLayout from './VueGridLayout.vue';
import VueGridItem from './VueGridItem.vue';

declare global {
    interface Window {
        Vue: typeof _Vue;
    }
}

const install = (Vue: typeof _Vue): void => {
    Vue.component('VueResponsiveGridLayout', VueResponsiveGridLayout);
    Vue.component('VueGridLayout', VueGridLayout);
    Vue.component('VueGridItem', VueGridItem);
};

export default install;

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(install);
}

export {
    VueResponsiveGridLayout,
    VueGridLayout,
    VueGridItem,
};
