<template>
    <div :class="classes">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            w: {
                required: true,
            },
            wrap: {
                required: false,
                default: 2
            }
        },
        computed: {
            classes() {
                return {
                    'list-item-responsive' : true,
                    'list-item-wraped' : (this.w > this.wrap),
                }
            }
        }
    }
</script>

<style>
    .list-item-responsive {
        height: 25px;
        /*background:blue;*/
        border-bottom:1px solid #ddd;
        width:100%;
        padding: 2px 0px;
        margin: 1px 0px;
    }

    .list-item-wraped {
        width:150px;
        margin:2px 2px 2px 2px;
        text-align: center;
    }

    .lg {
        margin: 0px;
        padding: 1px;
        height: auto;
        text-align: left;
    }

    .list-item-wraped > div > td > span.off {
        display: none;
    }
</style>
