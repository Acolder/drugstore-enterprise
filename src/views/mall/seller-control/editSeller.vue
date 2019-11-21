<template>
  <div>
    <info :isAdd="false" :id="id"></info>
  </div>
</template>

<script>
import info from './sellerInfo';
export default {
  data() {
    return {
      id: this.$route.query.id
    };
  },
  components: {
    'info': info
  }
};
</script>

<style>

</style>
