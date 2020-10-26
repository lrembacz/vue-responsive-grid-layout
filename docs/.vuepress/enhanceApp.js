import { VueDraggableCore } from "vue-draggable-core";
import { VueResizableCore } from "vue-resizable-core";
import { VueResponsiveGridLayout, VueGridLayout, VueGridItem, WidthProvider } from 'vue-responsive-grid-layout';

export default ({ Vue }) => {
    Vue.component('VueDraggableCore', VueDraggableCore);
    Vue.component('VueResizableCore', VueResizableCore);
    Vue.component('VueResponsiveGridLayout', VueResponsiveGridLayout);
    Vue.component('VueGridLayout', VueGridLayout);
    Vue.component('VueGridItem', VueGridItem);
    Vue.component('WidthProvider', WidthProvider);

    Vue.prototype.$__VERSION__ = process.env.VERSION
}