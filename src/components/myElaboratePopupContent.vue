<template>
  <div>
    <button @click="pushToViewStreamPage">Go</button>
  </div>
</template>

<style>
</style>

<script>
//import RequestStream from '@/components/RequestStream.vue'

export default {
  name: "main_page",
  data() {
    return {};
  },
  methods: {
    pushToViewStreamPage() {
      this.$emit("push-page");
    }
  }
};
</script>
