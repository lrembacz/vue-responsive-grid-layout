import _Vue from 'vue';
import VueResponsiveGridLayout from './VueResponsiveGridLayout.vue';
import VueGridLayout from './VueGridLayout.vue';
import VueGridItem from './VueGridItem.vue';
declare global {
    interface Window {
        Vue: typeof _Vue;
    }
}
declare const install: (Vue: typeof _Vue) => void;
export default install;
export { VueResponsiveGridLayout, VueGridLayout, VueGridItem, };