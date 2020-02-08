<template id="requestStream">
  <v-ons-page>
    <v-ons-toolbar>
      <div class="center">Request Stream</div>
    </v-ons-toolbar>
    <p style="text-align: center">
      This is the first page
      <v-ons-button @click="push">Push Page 2</v-ons-button>
    </p>
  </v-ons-page>
</template>

<style>
</style>

<script>
import SupplyStream from '@/components/SupplyStream.vue'

export default {
    name:'requestStream',
    methods: {
    push() {
      this.$emit('push-page', SupplyStream);
    }
  }
}
</script>