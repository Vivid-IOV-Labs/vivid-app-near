<template>
<v-ons-navigator swipeable :page-stack="pageStack" @push-page="pageStack.push($event)"></v-ons-navigator>
</template>

<style>
body {
    height: 100vh !important
}
</style>

<script>
//import RequestStream from '@/components/RequestStream.vue'
import Home from '@/components/Home.vue'

export default {
    name: 'main_page',
    data() {
        return {
            pageStack: [Home]
        };
    }
}
</script>
