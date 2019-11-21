<template>
  <div>
    <info :isEdit="true" :isShop="false"></info>
  </div>
</template>

<script>
import info from './couponInfo';
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
