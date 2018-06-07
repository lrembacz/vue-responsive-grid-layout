# VueResponsiveGridLayout
Responsive draggable and resizable grid layout for VueJS.
Its responsiveness is based on breakpoints (similar to Bootstrap).

It's based on https://github.com/STRML/react-grid-layout

# Demo

- https://jsfiddle.net/w768wv2f/11/ - component wrapped inside of `grid-item` 
with `heightFromChildren` prop used.
- https://jsfiddle.net/w768wv2f/12/ - simple component wrapped inside slot with 
own height taken from layout.

# Example

- Clone project.
- run `$ npm run dev`

# Usage
## NPM
```
npm install vue-responsive-grid-layout
```

## Registration
```
import {VueResponsiveGridLayout, VueGridItem } from 'vue-responsive-grid-layout'

Vue.component('vue-responsive-grid-layout', VueResponsiveGridLayout)
Vue.component('vue-grid-item', VueGridItem)
```

# API
```
FIX to responsivness

watch: {
    layouts: {
        handler: function(val, oldVal) {
            this.prepareLayoutsFromProps(this.layouts);
        },
        deep: true
    },
},

Layouts from props are deeply watched and currentLayout in component is synchronized with it.
It grants us ability to make layouts reactive and make the layouts possible to work with Vuex.
```


DEPREACTED

~~EDIT: FIX to Desynchronitizing~~

~~GridLayout has its own state now. Layouts from prop is taken only for the first time.~~

~~To change layout inside the component use switchLayout method.~~


Vue Responsive Grid Layout uses scoped slot inside to get some props.

`<slot :containerWidth="containerWidth" :layout="currentLayout" :cols="currentCols">`

You can use it to send containerWidth, currentLayout and cols for grid-items.

## Props VueResponsiveGridLayout

```
breakpoint: {
    type: String,
    required: false,
    default: 'lg'
},

cols: {
    type: Number,
    required: false,
    default: 12
},

rowHeight: {
    required: false,
    type: Number,
    default: 10
},

layouts: {
    type: Object,
    required: true,
},

// ("horizontal" | "vertical")
compactType: {
    type: String,
    required: false,
    default: "vertical"
},

preventCollision: {
    type: Boolean,
    required: false,
    default: false
},

breakpoints: {
    type: Object,
    required: false,
    default: () => { return { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 } }
},

colsAll: {
    type: Object,
    required: false,
    default: () => { return { lg: 12, md: 6, sm: 4, xs: 2, xxs: 1 } }
},

initOnStart : {
    type: Boolean,
    required: false,
    default: true
},

className : {
    required: false,
    type: String,
    default: ""
},

providerSelector: {
	required: false,
	type: String
},

disabled: {
    required: false,
    type: Boolean,
    default: false
},

makeUpdateOnWidthChange: {
    required: false,
    type: Boolean,
    default: true
}
```

## Description

### breakpoint

Actual breakpoint. Default is "lg".

### cols

Number of cols. Default is 12.

### layouts

Layouts object for example: 
```
{
    "lg" : [
        { x: 0, y: 0, w: 1, h: 1, i: "1" },
        { x: 1, y: 0, w: 1, h: 1, i: "2" },
    ],
    "md" : [
        { x: 0, y: 1, w: 1, h: 1, i: "1" },
        { x: 1, y: 1, w: 1, h: 1, i: "2" },
    ]
}
```
### compactType

Type of compacting layout. Default `"vertical"`.

~~verticalCompact~~ - deleted

~~Grants option to choose compacting type.~~

### preventCollision

Preventing collisions. Makes some grid items static.

### breakpoints

Breakpoints object which define width for breakpoints. 

Default `{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }`.

### rowHeight

Height of one grid unit row for placeholder.

### colsAll

Defines cols for given breakpoints.

Default `{ lg: 12, md: 6, sm: 4, xs: 2, xxs: 1 }`.

### initOnStart

Defines if GridLayout should be inited on start or wait for user to do that.

Helpful when we are waiting for data from API call.

### className

Defines additional classes for grid layout.
Default css class is `vue-responsive-grid-layout`.

### providerSelector

Defines selector for width-provider.
Default VueResponsiveGridLayout.

### disabled
When disabled, layout is not updating its state with props.

### makeUpdateOnWidthChange
When width is changed this props grants the updateLayout event call additionally

## Events VueResponsiveGridLayout

~~@layoutInit~~ - deleted

There is no more this event. It's `@layout-ready` now.

### @layout-ready()

This event is emitted when layouts object from props is ready to `initLayout()`.

### @layout-not-ready()

This event is emitted when layouts object is empty or null. `initLayout()` is not available.

### @layout-init({layout, cols})

This event is emitted when layout is inited, after `initLayout()` function.

### @layout-init-fail()

This event is emitted when layout is not inited due to error.

### @layout-switched({layout, cols, breakpoint, layouts})

Grants information that layouts object was switched.

### @layout-switched-failed()

This event is emitted when there was an error with switching.

### @layout-synchronize({ layout, layouts})

Event emitted after layout is synchronized.

### @layout-synchronize-failed()

This event is emitted when there was an error with synchronize.

### @breakpoint-change({breakpoint, cols})

Emitted after breakpoint is changed. 
It occurs when width is changed (window is resized etc.). 

### @layout-change({layout, layouts})

Emitted when layout is changed with `onWidthChange()`

### @width-change({width, cols})

Emitted after width of window is changed the.

### @width-change-failed()

Emitted after width changing is failed.

### @layout-height-updated({layout, layouts})

Grants information that all gridItems was height updated.

### @layout-height-updated-failed()

Emitted after there were errors with layout height updating.

### @layout-resized()

Grants information that all gridItems was resized with `resizeAllItems`.

### @layout-resized-failed()

Emitted after there were errors with layout resizing.

### @width-init({width})

Emitted after width is get from width-provider.

### @layout-update({layout, layouts, breakpoint})

Every time layout is updated it emits this event.

## Functions VueResponsiveGridLayout

### initLayout()

Function that runs initLayout when `initOnStart` is `true`.

We can use it for example: `this.$refs.layout.initLayout()`.

### updateItemsHeight(mode = true)

Function that updates all grid-items height. 
If `heightFromChildren` prop is true on `vue-grid-item`, height is updated based on DOM height.

### resizeAllItems(mode = false, cols = false)

Function resizes all grid-items width based on arguments.

* If mode is `false` and cols is `false`, then every grid-item gets its defaultSize.
* If mode is `true` and cols is `false`, then every grid-item gets width of the whole component.
* If cols is a number it makes every grid-item to get width represented by cols. 

### switchLayout(newLayouts)

Function grants abbility to change layouts object to new one.
It's good when we have more dashboards or something.

## Props VueGridItem

```
resizableProps : {
    type: Object,
    required: false
},
draggableCoreProps : {
    type: Object,
    required: false
},
noTouchAction : {
    type: Boolean,
    default: true,
},
touchAction: {
    type: String,
    default: 'none',
},
heightFromChildren: {
    required: false,
    type: Boolean,
    default: false
},
containerWidth: {
    required: true,
    default: 0
},
cols: {
    required: false,
    type: Number,
    default: 8,
},
rowHeight: {
    required: false,
    type: Number,
    default: 10
},
margin: {
    required: false,
    type: Array,
    default: () => [10, 10]
},
maxRows: {
    required: false,
    type: Number,
    default: Infinity
},
containerPadding: {
    required: false,
    type:Array,
    default: () => [5, 5]
},
x: {
    type: Number,
    required: true
},
y: {
    type: Number,
    required: true
},
w: {
    type: Number,
    required: true
},
h: {
    type: Number,
    required: true
},

i: {
    type: String,
    required: true
},
isDraggable: {
    required: false,
    type: Boolean,
    default: true
},
isResizable: {
    required: false,
    type: Boolean,
    default: true
},
static: {
    required: false,
    type: Boolean,
    default: false
},
useCSSTransforms: {
    required: false,
    type: Boolean,
    default: true
},
className: {
    required: false,
    type: String,
    default: ""
},
dragContainerClass: {
    required: false,
    type: String,
    default: "vue-grid-draggable-container"
},
handle: {
    required: false,
    type: String,
    default: ""
},
cancel: {
    required: false,
    type: String,
    default: ""
},

onDragStart: {
    type: Function,
    default: () => {}
},

onDrag: {
    type: Function,
    default: () => {}
},

onDragStop: {
    type: Function,
    default: () => {}
},

placeholder: {
    type: Boolean,
    default: false
},

 usePercentages: {
     required: false,
     type: Boolean,
     default: false
 },

componentprops: {
    type: Object,
    required: false
},

component: {
    required: false
},

defaultSize: {
    required: false,
    default: 2
},

canBeResizedWithAll: {
    required: false,
    default: true,
    type: Boolean
}
```
## Description

### resizableProps

Props for ResizableProps inside `vue-grid-item`.

### draggableCoreProps

Props for DraggableCore inside `vue-grid-item`.

### noTouchAction
If false, grantstouch-action: none; style to component. Preventing from scrolling on mobile devices.

Attention! : Be careful when using this prop. You can make scrolling off on mobile devices.

### touchAction
Define which touchAction are added. Default none;

### heightFromChildren

Defines if height of grid-item should be based on component inside or not.

### containerWidth

Width of container, it is needed to calculate the width of items.

### cols

Needed to calculate items width correctly.

### rowHeight

Height of one grid unit.

### margin

Margin of grid-items.

### maxRows

Max number of rows.

### containerPadding

Defines container padding.

### x, y, w, h

Defines position (x, y) and size (w, h) in grid units.

### i

Defines unique id of grid-item

### isDraggable

Defines if grids are draggable or not.

### isResizable

Defines if grids are resizable.

### static

Makes item static.

### useCSSTransforms

Uses transform css property for changing positions and size.

### className

Defines additional class names for grid item.

Default: 
* vue-grid-item
* [this.className]
* static
* vue-grid-resizable (if isResizable)
* vue-grid-resizable-resizing (if is resizing)
* vue-grid-draggable (if isDraggable)
* vue-grid-draggable-dragging (if is dragging)
* cssTransforms (if uses CSS transform)

### dragContainerClass

Defines classes for dragContainer. Default `vue-grid-draggable-container`.

### handle

Defines selector to dragging option.

### cancel

Defines selector that should be turnedoff from dragging.

### onDragStart

Callback function to handle draggingStart.

### onDrag

Callback function to handle dragging.

### onDragStop

Callback function to handle draggingStop.

### placeholder

Property for placeholder grid-item.

### usePercentages

Should be used on SSR (not tested hardly yet).

### componentProps

Props for component if it is given.

### component

Name of component that should be rendered inside grid-item.

### defaultSize 

It is default size of grid-item given in grid units. 

Needed when we want to resize all items to its default size for example.

### canBeResizedWithAll

When it is set to true. GridItem can be resized when calling `resizeAllItems`. 
Otherwise its not able to.

# License
MIT
