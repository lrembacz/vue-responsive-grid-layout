<template>
    <VueDraggableCore @start="onStart" @drag="onDrag" @stop="onStop">
        <div :class="classes">
            x: {{x}}
            y: {{y}}
            lastX: {{lastX}}
            lastY: {{lastY}}
        </div>
    </VueDraggableCore>
</template>

<script>
    export default {
        name: 'DraggableCore',
        data() {
            return {
                active: false,
                x: 0,
                y: 0,
                lastX: 0,
                lastY: 0,
            };
        },
        computed: {
            classes() {
                return {
                    box: true,
                    active: this.active,
                };
            },
        },
        methods: {
            onStart(e, coreData) {
                this.active = true;
                this.x = coreData.x;
                this.y = coreData.y
                this.lastX = coreData.lastX;
                this.lastY = coreData.lastY;
            },
            onDrag(e, coreData) {
                this.x = coreData.x;
                this.y = coreData.y
                this.lastX = coreData.lastX;
                this.lastY = coreData.lastY;
            },
            onStop(e, coreData) {
                this.active = false;
                this.x = coreData.x;
                this.y = coreData.y
                this.lastX = coreData.lastX;
                this.lastY = coreData.lastY;
            },
        },
    }
</script>
<style>
    .box {
        width: 100px;
        height: 100px;
        border: 2px #000 dotted;
    }
    .box.active {
        border: 4px green solid;
    }
</style>