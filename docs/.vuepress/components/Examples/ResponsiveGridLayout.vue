<template>
    <WidthProvider>
        <template v-slot:default="{width}">
            <div class="content" ref="offsetParent">
                <VueResponsiveGridLayout
                    :layouts="layouts"
                    :rowHeight="20"
                    :cols="cols"
                    :width="width"
                    @layoutChange="onLayoutChange"
                >
                    <template v-slot:item="{i}">
                        <span class="text">{{i}}</span>
                    </template>
                </VueResponsiveGridLayout>
            </div>
        </template>
    </WidthProvider>
</template>

<script>
    export default {
        name: 'ResponsiveGridLayout',
        data() {
            return {
                layouts: {
                    lg: [
                        {
                            i: "0",
                            x: 0,
                            y: 0,
                            w: 2,
                            h: 5,
                            draggable: true,
                            resizable: true
                        },
                        {
                            i: "1",
                            x: 2,
                            y: 0,
                            w: 2,
                            h: 2,
                            draggable: true,
                            resizable: true
                        },
                        {
                            i: "2",
                            x: 4,
                            y: 0,
                            w: 2,
                            h: 4,
                            draggable: true,
                            resizable: true,
                        },
                        {
                            i: "3",
                            x: 6,
                            y: 0,
                            w: 2,
                            h: 2,
                            draggable: true,
                            resizable: true
                        },
                    ]
                },
                cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
            };
        },
        methods: {
            onLayoutChange(layout, layouts) {
                this.layouts = layouts;
            }
        }
    }

</script>

<style scoped>
    #content {
        width: 100%;
    }
    .vue-grid-layout {
        background: #eee;
        margin-top: 10px;
    }
    .layoutJSON {
        background: #ddd;
        border: 1px solid black;
        margin-top: 10px;
        padding: 10px;
    }
    .columns {
        -moz-columns: 120px;
        -webkit-columns: 120px;
        columns: 120px;
    }
    .vue-grid-item {
        box-sizing: border-box;
    }
    .vue-grid-item:not(.vue-grid-placeholder) {
        background: #ccc;
        border: 1px solid black;
    }
    .vue-grid-item.resizing {
        opacity: 0.9;
    }
    .vue-grid-item.static {
        background: #cce;
    }
    .vue-grid-item .text {
        font-size: 24px;
        text-align: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        height: 24px;
    }
    .vue-grid-item.vue-grid-placeholder {
        background: red;
        opacity: 0.2;
        transition-duration: 100ms;
        z-index: 2;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
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
    .vue-resizable-handle-se {
        bottom: 0;
        right: 0;
        cursor: se-resize;
    }
</style>