<template>
    <div style="display:none;">
    </div>
</template>

<script type="text/javascript">

    export default{
        data() {
            return {
                width: 0,
                firstRender: false
            }
        },
        props: {
            selector: {
                type: String,
                required: false
            }
        },
        created() {
            window.addEventListener('resize', this.handleResize)
        },
        mounted() {
            this.init()
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.handleResize)
        },
        methods: {
            init () {
                this.$nextTick(() => {
                    if (this.selector) {
                        this.width = document.getElementById(this.selector).clientWidth;
                    } else {
                        this.width = this.$parent.$el.clientWidth;
                    }
                    this.$emit('widthInit', this.width);
                    this.firstRender = true;
                })
            },
            handleResize (event) {
                this.$nextTick(() => {
                    if (this.selector) {
                        this.width = document.getElementById(this.selector).clientWidth;
                    } else {
                        this.width = this.$parent.$el.clientWidth;
                    }
                    this.$emit('widthChange', this.width);
                })

            },

        },

    }
</script>
