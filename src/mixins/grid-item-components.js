export default {
    data() {
        return {
            height: 0,
            ready : false
        }
    },
    props: {
        onHeightUpdated: {
            type: Function
        }
    },
    watch: {
        ready(val) {
            if (val) {
                this.onHeightUpdated();
            }
        }
    },
    methods: {
        readys() {
            return () => {
                this.ready = true;
            }

        },
    }
}