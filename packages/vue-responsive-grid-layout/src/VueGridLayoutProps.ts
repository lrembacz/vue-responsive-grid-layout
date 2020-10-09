import Vue, { PropType } from 'vue';
import { CompactType, EventCallback, Layout, LayoutItem, noop } from './lib/utils';

export default Vue.extend({
    props: {
        width: {
            type: Number,
            required: true
        },
        autoSize: {
            type: Boolean,
            default: true
        },
        cols: {
            type: Number,
            default: 12
        },
        draggableCancel: {
            type: String,
            default: ''
        },
        draggableHandle: {
            type: String,
            default: ''
        },
        compactType: {
            type: String as PropType<CompactType>,
            default: CompactType.vertical
        },
        layout: {
            type: Array as PropType<Layout>,
            default: () => []
        },
        margin: {
            type: [Object, Array] as PropType<[number, number]>,
            default: () => [10, 10]
        },
        containerPadding: {
            type: [Object, Array, null] as PropType<[number, number] | null>,
            default: null
        },
        rowHeight: {
            type: Number,
            default: 150
        },
        maxRows: {
            type: Number,
            default: Infinity
        },
        isBounded: {
            type: Boolean,
            default: false
        },
        isDraggable: {
            type: Boolean,
            default: true
        },
        isResizable: {
            type: Boolean,
            default: true
        },
        isDroppable: {
            type: Boolean,
            default: false
        },
        preventCollision: {
            type: Boolean,
            default: false
        },
        useCSSTransforms: {
            type: Boolean,
            default: true
        },
        transformScale: {
            type: Number,
            default: 1
        },
        droppingItem: {
            type: Object as PropType<Partial<LayoutItem>>,
            default: () => ({
                i: '__dropping-elem__',
                h: 1,
                w: 1
            })
        },
        resizeHandles: {
            type: Array as PropType<Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>>,
            default: () => ['se']
        }
    }
});
