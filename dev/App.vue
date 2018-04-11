<template>
    <div id="wrapper" style="align-items: stretch;width: 100%; height: 100%;">
        <div style="position:relative;width:100%;height:100%;">
            <div style="height: 30px;">
                <div class="pull-right">
                    <div @click="gridMode()" class="btn btn-md"><span class="glyphicon glyphicon-th-large"></span></div>
                    <div @click="listMode()" class="btn btn-md"><span class="glyphicon glyphicon-list"></span></div>
                </div>
            </div>
            <vue-responsive-grid-layout
                    @layout-update="updateLayout"
                    @layout-change="changeLayout"
                    @layout-init="initLayout"
                    @layout-resized="resizedLayout"
                    @width-init="initWidth"
                    @width-change="changeWidth"
                    @breakpoint-change="changeBreakpoint"
                    :layouts="layouts"
                    :cols="cols"
                    :compactType="'vertical'"
                    :verticalCompact="true"
                    :initOnStart="false"
                    :breakpoint="breakpoint"
                    :breakpoints="breakpoints"
                    :colsAll="colsAll"
                    ref="layout"
            >
                <template slot-scope="props">
                    <vue-grid-item
                        v-for="item in props.layout"
                        v-if="item.i"
                        :key="item.i"
                        :x="item.x"
                        :y="item.y"
                        :w="item.w"
                        :h="item.h"
                        :i="item.i"
                        :cols="props.cols"
                        :containerWidth="props.containerWidth"
                        :component="components[item.i].component"
                        :componentProps="{ id : item.i}"
                        :defaultSize="components[item.i].defaultSize"
                        :isDraggable="isDraggable"
                        :isResizable="isResizable"
                        :heightFromChildren="true"
                    >
                    </vue-grid-item>
                </template>
            </vue-responsive-grid-layout>
        </div>
    </div>
</template>

<script type="text/javascript">
 import {VueResponsiveGridLayout, VueGridItem } from '../src/index.js'

export default{
    data() {
        return {
            layouts: {
                "lg": [
                    { x: 0, y: 0, w: 2, h: 3, i: "1"},
                    { x: 2, y: 0, w: 2, h: 3, i: "2"},
                    { x: 4, y: 0, w: 2, h: 3, i: "3"},
                    { x: 0, y: 3, w: 2, h: 3, i: "4"}
                ]
            },
            breakpoint: "lg",
            components: {
                "1": { i: "1", component: "example-component", defaultSize: 2},
                "2": { i: "2", component: "example-component", defaultSize: 2},
                "3": { i: "3", component: "example-component", defaultSize: 2},
                "4": { i: "4", component: "example-component", defaultSize: 2},
            },
            cols: 10,
            breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
            colsAll: { lg: 10, md: 8, sm: 6, xs: 4, xxs: 2 },
            isDraggable: true,
            isResizable: true,
        }
    },
    components: {
        'vue-responsive-grid-layout': VueResponsiveGridLayout,
        'vue-grid-item': VueGridItem
    },
    methods: {
        initLayout({layout, cols}) {
            this.cols = cols;
        },
        initWidth({width}) {
            this.containerWidth = width;
            this.$refs.layout.initLayout();
        },
        changeWidth({width, newCols}) {
            this.containerWidth = width;
            this.cols = newCols;
            this.$nextTick( ()=> {
                this.$refs.layout.updateItemsHeight();
            });
        },
        updateLayout({layout, breakpoint}) {
            let filtered;
            filtered = layout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})

            this.layouts[breakpoint] = filtered;

        },
        changeBreakpoint({breakpoint, cols}) {
            this.cols = cols;
            this.breakpoint = breakpoint;
        },

        changeLayout({layout, breakpoint}) {
            let filtered;
            filtered = layout.map( (item) => { return { x: item.x, y: item.y, w: item.w, h: item.h, i: item.i }})
            this.layouts[breakpoint] = filtered;
        },

        gridMode() {
            this.$refs.layout.resizeAllItems(false, false);
        },

        listMode() {
            this.$refs.layout.resizeAllItems(true, false);
        },
        resizedLayout() {
            console.log('layout resized')
        }
    },

}
</script>

<style>
    html {
        height: 100%;
    }

    body {
        height: 100%;
    }

    #content {
        padding: 0px 20px;
        min-height: 100vh;
        transition: all 0.3s;
        width: 100%;
    }
    .resizable-handle {
        position:absolute;
        width:20px;
        height:20px;
        bottom:0;
        right:0px;
        text-align:right;
    }
    .resizable-handle::after {
        content: "";
        position: absolute;
        right: 3px;
        bottom: 3px;
        width: 5px;
        height: 5px;
        border-right: 2px solid #FFFFFF;
        border-bottom: 2px solid #FFFFFF;
    }
</style>
