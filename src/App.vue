<template id="main">
  <v-ons-navigator swipeable
    :page-stack="pageStack"
    @push-page="pageStack.push($event)"
  ></v-ons-navigator>
</template>

<style>
</style>

<script>
import RequestStream from '@/components/RequestStream.vue'

export default {
    name:'main',
    data() {
    return {
      pageStack: [RequestStream]
    };
  }
}
</script>