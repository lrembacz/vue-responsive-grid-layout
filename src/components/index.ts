import VueResponsiveGridLayout from './VueResponsiveGridLayout.vue';
import VueGridLayout from './VueGridLayout.vue';
import VueGridItem from './VueGridItem.vue';

const Components = {
    VueResponsiveGridLayout,
    VueGridLayout,
    VueGridItem,
};

function install(Vue) {
    Vue.component('vue-responsive-grid-layout', VueResponsiveGridLayout);
    Vue.component('vue-grid-layout', VueGridLayout);
    Vue.component('vue-grid-item', VueGridItem);
}

export {VueResponsiveGridLayout, VueGridLayout, VueGridItem, install};

export default Components;
