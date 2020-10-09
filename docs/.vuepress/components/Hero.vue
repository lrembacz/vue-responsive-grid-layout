<template>
    <div>
        <h1 class="h1">
            VueResponsiveGridLayout
        </h1>
        <p style="text-align: center;">Create responsive grid layouts with VueJs.</p>
        <div class="box">
            <router-link class="button" to="/guide/getting-started.html">Get started</router-link>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Hero',
    }
</script>

<style scoped lang="stylus">
    .h1 {
        font-size: 48px;
        text-align: center;
    }
    .button {
        font-size: 24px;
        border: 2px solid #42b983;
        color: #42b983;
        border-radius: 5px;
        padding: 10px 15px;
    }
    .box {
        padding: 30px 0;
        display: flex;
        justify-content: center;
        flex: 1 0 auto;
    }
</style>