import Vue from 'vue';
import { VueConstructor } from 'vue';
import VueDraggableCore from './VueDraggableCore';

declare global {
    interface Window {
        Vue?: VueConstructor<Vue>;
    }
}

export interface Options {
    vueDraggableCoreName?: string;
}

function install(Vue: VueConstructor<Vue>, options: Options = {}) {
    Vue.component(options.vueDraggableCoreName || 'VueDraggableCore', VueDraggableCore);
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

export { VueDraggableCore };
