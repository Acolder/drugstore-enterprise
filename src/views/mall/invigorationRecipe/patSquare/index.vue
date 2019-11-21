<template>
  <div class="invigorationRecipeList">
    <!-- <headers></headers> -->
    <div class="header_wrap">
      <div class="header">
        <div class="nav" :class="nav === 1 ? 'nav_active' : ''" @click="switchnav(1)">在线开方</div>
        <div class="nav" :class="nav === 2 ? 'nav_active' : ''" @click="switchnav(2)">历史处方</div>
      </div>
    </div>
    <info v-if="nav === 1" :item="item"></info>
    <list v-if="nav === 2" @edit="edit" @clenEdit="clenEdit"></list>
  </div>
</template>

<script>
import info from './info';
import list from './list';
export default {
  data() {
    return {
      nav: 1,
      item: null
    };
  },
  components: {
    'info': info,
    'list': list
  },
  methods: {
    switchnav(nav) {
      this.nav = nav;
    },
    edit(item) {
      this.nav = 1;
      console.log(item);
      this.item = item;
    },
    clenEdit() {
      this.item = null;
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../../../styles/common.less';
.invigorationRecipeList{
  // width: 1400px;
  background: #fff;
  margin: 0 auto;
  font-size: 14px;
  .header_wrap{
    height: 100px;
    background: #F7F8FA;
    .header{
      background: #fff;
      height: 80px;
      display: flex;
      .nav{
        font-size: 22px;
        line-height: 80px;
        margin: 0 50px;
        cursor: pointer;
      }
      .nav_active{
        color: @green-color;
        border-bottom: 4px solid @green-color;
      }
    }
  }
}
</style>
