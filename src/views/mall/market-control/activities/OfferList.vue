<template>
  <div class="offerlist">
    <info :activityType="1" :isEdit="false"></info>
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
