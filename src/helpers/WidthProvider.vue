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
                    this.width = document.documentElement.clientWidth || document.body.clientWidth;;
                    this.$emit('widthInit', this.width);
                    this.firstRender = true;
                })
            },
            handleResize (event) {
                this.$nextTick(() => {
                    this.width = document.documentElement.clientWidth || document.body.clientWidth;;
                    this.$emit('widthChange', this.width);
                })

            },

        },

    }
</script>
