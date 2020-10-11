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
declare function install(Vue: VueConstructor<Vue>, options?: Options): void;
declare const _default: {
    install: typeof install;
};
export default _default;
export { VueGridItem, VueGridLayout, VueResponsiveGridLayout, WidthProvider };
