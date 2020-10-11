import Vue from 'vue';
import { VueConstructor } from 'vue';
import VueResizableCore from './VueResizableCore';
declare global {
    interface Window {
        Vue?: VueConstructor<Vue>;
    }
}
export interface Options {
    vueResizableCoreName?: string;
}
declare function install(Vue: VueConstructor<Vue>, options?: Options): void;
declare const _default: {
    install: typeof install;
};
export default _default;
export { VueResizableCore };
