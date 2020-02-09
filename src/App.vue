<template id="main_page">
  <v-ons-navigator swipeable
    :page-stack="pageStack"
    @push-page="pageStack.push($event)"
  ></v-ons-navigator>
</template>

<style>

body {
  height:100vh!important
}
</style>

<script>
import RequestStream from '@/components/RequestStream.vue'

export default {
    name:'main_page',
    data() {
    return {
      pageStack: [RequestStream]
    };
  }
}
</script>