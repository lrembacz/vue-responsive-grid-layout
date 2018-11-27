<template>
    <div>
        Test
    </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class ComponentItem extends Vue {
    public name: string = 'ComponentItem';
}
</script>