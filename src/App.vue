<template>
  <div id="app">
      <VueResponsiveGridLayout
        :style="{border: '1px solid #000'}"
        @layout-update="onLayoutUpdate"
        @layout-change="onLayoutChange"
        @layout-init="onLayoutInit"
        @width-change="onWidthChange"
        @breakpoint-change="onBreakpointChange"
        :layouts="layouts"
        :compactType="'vertical'"
        :breakpoint="breakpoint"
        :cols="cols"
        ref="layout"
      >
        <template slot-scope="props">
          <VueGridItem v-for="item in props.layout"
                  :i="item.i"
                  :w.sync="item.w"
                  :h.sync="item.h"
                  :x="item.x"
                  :y="item.y"
                  :containerWidth="props.containerWidth"
                  :rowHeight="props.rowHeight"
                  :isDraggable="true"
                  :isResizable="true"
                  :className="'grid-item'"
                  :cols="props.cols"
                  :heightFromChildren="false"
                  :maxRows="props.maxRows"
          >
              <div>Test</div>
          </VueGridItem>
        </template>
      </VueResponsiveGridLayout>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import VueResponsiveGridLayout from './components/VueResponsiveGridLayout.vue';
import VueGridItem from './components/VueGridItem.vue';
import ComponentItem from './components/ComponentItem.vue';
import {namespace} from 'vuex-class';
import {Breakpoint, ResponsiveLayout} from './lib/responsiveUtils';
import {Layout} from './lib/utils';

const layoutModule = namespace('layout');

@Component({
    name: 'app',
    components: {
        VueResponsiveGridLayout,
        VueGridItem,
        ComponentItem,
    },
})
export default class App extends Vue {
  @layoutModule.State('layouts') public layouts;
  @layoutModule.State('breakpoint') public breakpoint;
  @layoutModule.State('cols') public cols;

  @layoutModule.Action('updateLayout') public updateLayout;
  @layoutModule.Action('updateBreakpoint') public updateBreakpoint;
  @layoutModule.Action('updateCols') public updateCols;

  public onLayoutUpdate(layout: Layout, layouts: ResponsiveLayout, last) {
      this.updateLayout({layout, breakpoint: this.breakpoint});
  }

  public onLayoutChange(layout: Layout, layouts: ResponsiveLayout, breakpoint: Breakpoint) {
      this.updateLayout({layout, breakpoint});
  }

  public onLayoutInit(layout, currentLayouts, cols, breakpoint) {
      this.updateCols({cols});
      this.updateBreakpoint({breakpoint});
      this.updateLayout({layout, breakpoint});
  }

  public onBreakpointChange(breakpoint: Breakpoint) {
      this.updateBreakpoint({breakpoint});
  }

  public onWidthChange(width: number, cols: number) {
      this.updateCols({cols});
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
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
  border-right: 2px solid #000000;
  border-bottom: 2px solid #000000;
}
.vue-grid-draggable-container {
  width: 100%;
  height: 100%;
}
.grid-item {
  border: 1px dotted #000;
}
.vue-grid-placeholder {
  background: #ddd; border: 2px dashed #aaa;
}

.vue-grid-layout {
  width: 100%;
  display:block;
  position:relative;
  height: 100%;
}
</style>
