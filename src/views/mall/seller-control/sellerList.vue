<template>
  <div class="toExamine">
    <info :isExamine="false"></info>
  </div>
</template>

<script>
import info from './listInfo';
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
