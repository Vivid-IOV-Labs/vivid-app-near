<template>
  <v-ons-navigator swipeable :page-stack="pageStack" @push-page="pageStack.push($event)" @back-page="pageStack.pop()"></v-ons-navigator>
</template>

<style>
@import "css/app.css";
</style>

<script>
//import RequestStream from '@/components/RequestStream.vue'
import Home from "@/components/Home.vue";

export default {
  name: "main_page",
  data() {
    return {
      pageStack: [Home]
    };
  }
  //   mounted() {
  //     this.importAll(
  //       require.context(
  //         "../node_modules/leaflet-extra-markers/dist/img",
  //         true,
  //         /\.png$/
  //       )
  //     );
  //   }
};
</script>
