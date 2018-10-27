# VueResponsiveGridLayout 1.1.0
Responsive draggable and resizable grid layout for VueJS.
Its responsiveness is based on breakpoints (similar to Bootstrap).

It's based on https://github.com/STRML/react-grid-layout

# News

Now you can make both normal and responsive layout. 

It works with Vuex nice as well. 

And it's partly coded in Typescript.

# Demo

Working on it.

# Example

- Clone project.
- run `$ npm run serve`

# Usage
## NPM
```
npm install vue-responsive-grid-layout
```

## Registration
```
import {VueResponsiveGridLayout, VueGridItem, VueGridLayout } from 'vue-responsive-grid-layout'

Vue.component('vue-responsive-grid-layout', VueResponsiveGridLayout)
Vue.component('vue-grid-item', VueGridItem)
Vue.component('vue-grid-layout', VueGridLayout)
```

## Registration as plugin
```
import Vue from 'vue'
import VueResponsiveGridLayout from 'vue-responsive-grid-layout'

Vue.use(VueResponsiveGridLayout)
```

## Simple example
```
<template>
    <VueResponsiveGridLayout
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
              :immobile.sync="item.immobile"
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
</template>

<script>

export default {
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
```

# API
```
Works with Vuex.
```

Vue Responsive Grid Layout uses scoped slot inside to get some props.

`<slot :containerWidth="width" :layout="layout" :rowHeight="rowHeight" :cols="cols" :maxRows="maxRows">`

You can use it to send containerWidth, layout, rowHeight, cols and maxRows for grid-items.

### .sync 
```
Sync modifier is used on `w` and `h` props to make them reactive for external changes, 
when :heightFromChildren is set to `true`
```

## Props VueResponsiveGridLayout

```
@Prop({
    type: Object,
    required: false,
})
public styles: object;

@Prop({
    type: Boolean,
    required: false,
})
public autoSize: boolean;

@Prop({
    type: Number,
    required: false,
    default: 12,
})
public cols: number;

@Prop({
    type: String,
    required: false,
    default: '',
})
public draggableCancel: string;

@Prop({
    type: String,
    required: false,
    default: '',
})
public draggableHandle: string;

@Prop({
    type: String,
    required: false,
    default: 'vertical',
})
public compactType: CompactType;

@Prop({
    required: false,
    validator: (value) => {
        if (!value) {
            return true;
        }
        return validateLayout(value, 'layout');
    },
})
public layout: Layout;

@Prop({
    type: Array,
    required: false,
    default: () => [5, 5],
})
public margin: [number, number];

@Prop({
    type: Array,
    required: false,
    default: () => [5, 5],
})
public containerPadding: [number, number] | null;

@Prop({
    type: Number,
    required: false,
    default: 10,
})
public rowHeight: number;

@Prop({
    type: Number,
    required: false,
    default: Infinity,
})
public maxRows: number;

@Prop({
    type: Boolean,
    required: false,
    default: true,
})
public isDraggable: boolean;

@Prop({
    type: Boolean,
    required: false,
    default: true,
})
public isResizable: boolean;

@Prop({
    type: Boolean,
    required: false,
    default: false,
})
public preventCollision: boolean;

@Prop({
    type: Boolean,
    required: false,
    default: true,
})
public useCSSTransforms: boolean;

// Responsive config
@Prop({
    type: String,
    required: false,
    default: 'vue-responsive-grid-layout',
})
public className: string;

@Prop({
    type: String,
    required: false,
    default: 'lg',
})
public breakpoint: Breakpoint;

@Prop({
    type: Object,
    required: false,
    default: () => ({ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }),
})
public breakpoints: { [key: string]: number };

@Prop({
    type: Object,
    required: false,
    default: () => ({ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }),
})
public colsAll: { [key: string]: number };

@Prop({
    type: Object,
    required: false,
    default: () => ({}),
})
public layouts: { [key: string]: Layout };

@Prop({
    type: Boolean,
    required: false,
    default: true,
})
public isMounted: boolean;
```

## Events VueResponsiveGridLayout
```
@layout-update(layout: Layout, layouts: ResponsiveLayout, last: boolean)

@layout-change(layout: Layout, layouts: ResponsiveLayout, breakpoint: Breakpoint)

@layout-init(layout: Layout, layouts: ResponsiveLayout, cols: number, breakpoint: Breakpoint);

@width-change(width: number, cols: number)

@breakpoint-change(breakpoint: Breakpoint)

@add-child(child: Vue)

@remove-child(child: Vue)
```

## Function on VueResponsiveGridLayout
```
resizeAllItems(width: number, compactType: CompactType)
```

## Props VueGridLayout

```
@Prop({
    type: String,
    required: false,
    default: 'vue-grid-layout',
})
public className: string;

@Prop({
    type: Object,
    required: false,
})
public styles: object;

@Prop({
    type: Boolean,
    required: false,
})
public autoSize: boolean;

@Prop({
    type: Number,
    required: false,
    default: 12,
})
public cols: number;

@Prop({
    type: String,
    required: false,
    default: '',
})
public draggableCancel: string;

@Prop({
    type: String,
    required: false,
    default: '',
})
public draggableHandle: string;

@Prop({
    type: String,
    required: false,
    default: 'vertical',
})
public compactType: CompactType;

@Prop({
    required: false,
    validator: (value) => {
        if (!value) {
            return true;
        }
        return validateLayout(value, 'layout');
    },
})
public layout: Layout;

@Prop({
    type: Array,
    required: false,
    default: () => [5, 5],
})
public margin: [number, number];

@Prop({
    type: Array,
    required: false,
    default: () => [5, 5],
})
public containerPadding: [number, number] | null;

@Prop({
    type: Number,
    required: false,
    default: 10,
})
public rowHeight: number;

@Prop({
    type: Number,
    required: false,
    default: Infinity,
})
public maxRows: number;

@Prop({
    type: Boolean,
    required: false,
    default: true,
})
public isDraggable: boolean;

@Prop({
    type: Boolean,
    required: false,
    default: true,
})
public isResizable: boolean;

@Prop({
    type: Boolean,
    required: false,
    default: false,
})
public preventCollision: boolean;

@Prop({
    type: Boolean,
    required: false,
    default: true,
})
public useCSSTransforms: boolean;

@Prop({
    type: Number,
    required: true,
})
public width: number;
```

## Events VueGridLayout
```
@layout-update(layout: Layout, last: boolean)

@add-child(child: Vue)

@remove-child(child: Vue)
```

## Description

Working on it.

## Props VueGridItem

```
@Prop({
    type: Number,
    required: false,
    default: 12,
})
public cols: number;

@Prop({
    type: Number,
    required: true,
    default: 0,
})
public containerWidth: number;

@Prop({
    type: Number,
    required: false,
    default: 10,
})
public rowHeight: number;

@Prop({
    type: Array,
    required: false,
    default: () => [10, 10],
})
public margin: number[];

@Prop({
    type: Number,
    required: false,
    default: Infinity,
})
public maxRows: number;

@Prop({
    type: Array,
    required: false,
    default: () => [5, 5],
})
public containerPadding: number[];

// CORDS

@Prop({
    type: Number,
    required: true,
})
public x: number;

@Prop({
    type: Number,
    required: true,
})
public y: number;

@Prop({
    type: Number,
    required: true,
})
public w: number;

@Prop({
    type: Number,
    required: true,
})
public h: number;

@Prop({
    type: Number,
    required: false,
    default: 0,
})
public minW: number;

@Prop({
    type: Number,
    required: false,
    default: Infinity,
})
public maxW: number;

@Prop({
    type: Number,
    required: false,
    default: 0,
})
public minH: number;

@Prop({
    type: Number,
    required: false,
    default: Infinity,
})
public maxH: number;

// ID
@Prop({
    type: String,
    required: true,
})
public i: string;

// Functions
@Prop({
    type: Function,
})
public onDragStart: () => void;

@Prop({
    type: Function,
})
public onDrag: () => void;

@Prop({
    type: Function,
})
public onDragStop: () => void;

// Flags
@Prop({
    type: Boolean,
    default: false,
})
public isDraggable: boolean;

@Prop({
    type: Boolean,
    default: false,
})
public isResizable: boolean;

@Prop({
    type: Boolean,
    default: false,
})
public immobile: boolean;

@Prop({
    type: Boolean,
    default: true,
    required: false,
})
public canBeResizedWithAll: boolean;

// Use CSS transforms instead of top/left
@Prop({
    required: false,
    type: Boolean,
    default: true,
})
public useCSSTransforms: boolean;

@Prop({
    required: false,
    type: Boolean,
    default: false,
})
public usePercentages: boolean;

// Others
@Prop({
    required: false,
    type: String,
    default: 'vue-grid-item',
})
public className: string;

@Prop({
    required: false,
    type: String,
    default: 'vue-grid-draggable-container',
})
public dragContainerClass: string;

// Selector for draggable handle
@Prop({
    required: false,
    type: String,
    default: '',
})
public handle: string;

// Selector for draggable cancel
@Prop({
    required: false,
    type: String,
    default: '',
})
public cancel: string;

// Child
@Prop({
    type: Vue,
    required: false,
})
public component: Vue;

@Prop({
    type: Object,
    required: false,
})
public componentProps: object;

@Prop({
    type: Number,
    required: false,
    default: 2,
})
public defaultSize: number;

// Internal components

@Prop({
    type: Object,
    required: false,
})
public resizableProps: object;

@Prop({
    type: Object,
    required: false,
})
public draggableCoreProps: object;

@Prop({
    type: Boolean,
    default: true,
})
public noTouchAction: boolean;

@Prop({
    type: String,
    default: 'none',
})
public touchAction: string;

@Prop({
    required: false,
    type: Boolean,
    default: false,
})
public heightFromChildren: boolean;

@Prop({
    required: false,
    type: Boolean,
    default: false,
})
public placeholder: boolean;
```
## Description

Working on it.

# License
MIT
