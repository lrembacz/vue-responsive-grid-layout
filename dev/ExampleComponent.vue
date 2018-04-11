<template>
    <div class="panel panel-default" :id="id">
        <div :class="headingClasses">
            <slot>Example component {{ id }}</slot>
        </div>
        <div class="panel-body">
            <list-responsive>
                <list-responsive-item
                        v-for="n in 3"
                        :w="w"
                        :wrap="2"
                        :key="n"
                >
                </list-responsive-item>
            </list-responsive>

        </div>
    </div>
</template>

<script>
import ListResponsive from './ui/list-responsive/ListResponsive.vue'
import ListResponsiveItem from './ui/list-responsive/ListResponsiveItem.vue'
import {GridItemComponentsMixins} from '../src/index.js'

export default {
    mixins: [GridItemComponentsMixins],
    components: {
        'list-responsive': ListResponsive,
        'list-responsive-item': ListResponsiveItem
    },
    props: {
        id: {
            required: true
        },
        cols: {
            required: true
        },
        w: {
            required: true
        }
    },
    computed: {
        headingClasses() {
            return {
                'panel-heading': true,
                'text-center' : true
            }
        },

    },
    mounted() {
        this.readys()
    },
}
</script>


<style>

</style>