<template>
  <div class="header">
    <div class="nav" :class="status === 1 ? 'nav-active' : ''" @click="goOnline">在线处方</div>
    <div class="nav" :class="status === 2 ? 'nav-active' : ''" @click="goHistorical">历史处方</div>
    <div class="nav" :class="status === 3 ? 'nav-active' : ''" @click="goPerson">就诊人管理</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: 1
    };
  },
  methods: {
    goOnline() {
      this.status = 1;
      this.$store.dispatch('delAllViews');
      this.$router.push('/invigorationRecipe/invigorationRecipe');
    },
    goHistorical() {
      this.status = 2;
      this.$store.dispatch('delAllViews');
      this.$router.push('/invigorationRecipe/historicalOct');
    },
    goPerson() {
      this.$store.dispatch('delAllViews');
      this.status = 3;
      this.$router.push('/invigorationRecipe/member');
    },
  },
  created() {
    if (this.$route.path === '/invigorationRecipe/invigorationRecipe' || this.$route.path === '/consultChat/index') {
      this.status = 1;
    } else if (this.$route.path === '/invigorationRecipe/historicalOct') {
      this.status = 2;
    } else if (this.$route.path === '/invigorationRecipe/member') {
      this.status = 3;
    }
  }
};
</script>

<style lang="less" scoped>
.header{
  display: flex;
  border-bottom: 1px solid #e9eaf2;
  .nav{
    width: 100px;
    line-height: 46px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
  }
  .nav-active{
    border-bottom: 2px solid #32d6e6;
    color: #32d6e6
  }
}

</style>
