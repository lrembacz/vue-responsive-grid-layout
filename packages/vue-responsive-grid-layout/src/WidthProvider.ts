import Vue, { CreateElement, VNode } from 'vue';

export default Vue.extend({
    name: 'WidthProvider',
    props: {
        measureBeforeMount: {
            type: Boolean,
            default: false
        },
        width: {
            type: Number,
            required: false,
            default: null
        }
    },
    data() {
        return {
            currentWidth: 1280,
            mounted: false
        };
    },
    created() {
        if (this.width) {
            this.currentWidth = this.width;
        }
    },
    mounted() {
        window.addEventListener('resize', this.onWindowResize);
        this.mounted = true;
        this.$nextTick(() => {
            this.onWindowResize();
        })
    },
    beforeDestroy() {
        this.mounted = false;
        window.removeEventListener('resize', this.onWindowResize);
    },
    methods: {
        onWindowResize() {
            if (!this.mounted) {
                return;
            }
            const node = this.$el;
            if (node instanceof HTMLElement) {
                this.currentWidth = node.offsetWidth;
            }
        }
    },
    render(h: CreateElement): VNode {
        if (this.measureBeforeMount && !this.mounted) {
            return h('div');
        }
        return this.$scopedSlots.default
            ? this.$scopedSlots.default({
                  width: this.currentWidth
              })[0]
            : h();
    }
});
