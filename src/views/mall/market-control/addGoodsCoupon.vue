<template>
  <div>
    <info :isShop="false"></info>
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
