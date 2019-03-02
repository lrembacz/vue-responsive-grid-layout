import { VueConstructor, PluginObject } from 'vue';
import VueResponsiveGridLayout from './VueResponsiveGridLayout.vue';
import VueGridLayout from './VueGridLayout.vue';
import VueGridItem from './VueGridItem.vue';
declare global {
    interface Window {
        Vue: VueConstructor;
    }
}
declare const plugin: PluginObject<VueConstructor>;
export default plugin;
export { VueResponsiveGridLayout, VueGridLayout, VueGridItem };
