<template>
    <div>
        <button @click="onReset" :style="{'marginTop': '10px'}">Reset this element's width/height</button>
        <div class="layoutRoot">
            <VueResizableCore
                    class="box"
                    :height="height"
                    :width="width"
                    @resize="onResize"
                    :resizeHandles="['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']"
            >
                <template v-slot:default="props">
                    <div class="box" :style="{width: width + 'px', height: height + 'px'}">
                        <span class="text">Raw use of Resizable. 200x200, all Resize Handles.</span>
                        <component
                                v-for="resizeHandle in props.resizeHandles"
                                :is="resizeHandle.wrapper"
                                v-bind="resizeHandle.props"
                                v-on="resizeHandle.on"
                                :key="resizeHandle.axis"
                        >
                            <template>
                                <span :class="resizeHandle.class"></span>
                            </template>
                        </component>
                    </div>
                </template>
            </VueResizableCore>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ResizableCore',
        data() {
            return {
                width: 200,
                height: 200,
                absoluteWidth: 200,
                absoluteHeight: 200,
                absoluteLeft: 0,
                absoluteTop: 0,
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
            onReset() {
                this.width = 200;
                this.height = 200;
            },
            onResize({element, size, handle}, event) {
                this.width = size.width;
                this.height = size.height;
            },
        },
    }
</script>
<style>
    .layoutRoot {
        display: flex;
        background: #eee;
        margin-bottom: 20px;
        flex-wrap: wrap;
    }
    .box {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: #ccc;
        border: 1px solid black;
        text-align: center;
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
        position: relative;
        margin: 20px 20px 10px 20px;
    }
    .box .text {
        text-align: center;
    }
    .vue-resizable {
        position: relative;
    }
    .vue-resizable-handle {
        position: absolute;
        width: 20px;
        height: 20px;
        background-repeat: no-repeat;
        background-origin: content-box;
        box-sizing: border-box;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+');
        background-position: bottom right;
        padding: 0 3px 3px 0;
    }
    .vue-resizable-handle-sw {
        bottom: 0;
        left: 0;
        cursor: sw-resize;
        transform: rotate(90deg);
    }
    .vue-resizable-handle-se {
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }
    .vue-resizable-handle-nw {
        top: 0;
        left: 0;
        cursor: nw-resize;
        transform: rotate(180deg);
    }
    .vue-resizable-handle-ne {
        top: 0;
        right: 0;
        cursor: ne-resize;
        transform: rotate(270deg);
    }
    .vue-resizable-handle-w,
    .vue-resizable-handle-e {
        top: 50%;
        margin-top: -10px;
        cursor: ew-resize;
    }
    .vue-resizable-handle-w {
        left: 0;
        transform: rotate(135deg);
    }
    .vue-resizable-handle-e {
        right: 0;
        transform: rotate(315deg);
    }
    .vue-resizable-handle-n,
    .vue-resizable-handle-s {
        left: 50%;
        margin-left: -10px;
        cursor: ns-resize;
    }
    .vue-resizable-handle-n {
        top: 0;
        transform: rotate(225deg);
    }
    .vue-resizable-handle-s {
        bottom: 0;
        transform: rotate(45deg);
    }
</style>