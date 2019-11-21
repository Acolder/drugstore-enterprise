<template>
  <div class="party_com">
    <div class="party_com_header">
      <div class="nav" :class="status === 1 ? 'nav-active' : ''" @click="goOnline">在线审方</div>
      <div class="nav" :class="status === 2 ? 'nav-active' : ''" @click="goHistorical">历史审方</div>
    </div>
    <div class="main">
      <trialPartyInfos v-if="status === 1"></trialPartyInfos>
      <trialPartyHisLists v-else></trialPartyHisLists>
    </div>
  </div>
</template>

<script>
import trialPartyInfo from './trialPartyInfo';
import trialPartyHisList from './trialPartyHisList';
export default {
  data() {
    return {
      status: 1
    };
  },
  components: {
    'trialPartyInfos': trialPartyInfo,
    'trialPartyHisLists': trialPartyHisList
  },
  methods: {
    goOnline() {
      this.status = 1;
    },
    goHistorical() {
      this.status = 2;
    }
  }
};
</script>

<style lang="less" scoped>
.party_com{
  // width: 1400px;
  height: 100%;
  background: #fff;
  margin: 0 auto 15px;
  .party_com_header{
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
  .main{
    margin-top: 25px;
  }
}

</style>
