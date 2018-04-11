<template>
    <div class="list-responsive">
        <slot></slot>
    </div>
</template>

<script>
    export default {
    }
</script>

<style scoped>
    .list-responsive {
        display:flex;
        flex-direction:row;
        flex-wrap:wrap;
    }
</style>