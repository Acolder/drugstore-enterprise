<template>
  <div class="offerlist">
    <info :activityType="5" :isEdit="true"></info>
  </div>
</template>

<script>
import info from './info';
export default {
  data() {
    return {};
  },
  components: {
    'info': info
  }
};
</script>

<style>

</style>
