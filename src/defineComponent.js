import Vue from 'vue';
// 订单列表自定义列组件
Vue.component('operation', {
  template: `<div class="table-operation-btns">
    <el-button type="success" size="mini" icon="el-icon-search" @click.stop.prevent="seeDetail(rowData,index)">查看订单</el-button>
  </div>`,
  data() {
    return {
      distribution: ''
    };
  },
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    // 查看详情
    seeDetail() {
      let params = { type: 'seeDetail', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    },
  },
  created() {
    this.distribution = sessionStorage.getItem('distrbutionType') ? sessionStorage.getItem('distrbutionType') : 1;
  },
});
// 员工管理
Vue.component('table-operation-employeeManage', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini"  icon="el-icon-edit" @click.stop.prevent="modifyEmployee(rowData,index)">编辑</el-button>
        <el-button type="success" size="mini"  icon="el-icon-edit" @click.stop.prevent="modifyPassword(rowData,index)">修改密码</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-warning" @click.stop.prevent="stop(rowData,index)" v-if="rowData.isDisable === 0">停用</el-button>
        <el-button type="success" size="mini"  icon="el-icon-success" @click.stop.prevent="start(rowData,index)" v-if="rowData.isDisable === -1">启用</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-delete" @click.stop.prevent="deleteEmployee(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    start() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'start',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    stop() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'stop',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    deleteEmployee() {
      // 参数根据业务场景随意构造
      let params = { type: 'delete', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    },
    modifyEmployee() {
      // 参数根据业务场景随意构造
      let params = { type: 'modifyEmployee', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    },
    modifyPassword() {
      // 参数根据业务场景随意构造
      let params = { type: 'modifyPassword', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 商品管理
Vue.component('table-operation-mall', {
  template: `<span>
        <el-button type="success" size="mini" icon="el-icon-edit" @click.stop.prevent="update(rowData,index)">更新库存</el-button>&nbsp;
        <el-button type="danger" size="mini" icon="el-icon-delete" @click.stop.prevent="deleteRow(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    update() {

      // 参数根据业务场景随意构造
      let params = { type: 'edit', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    },

    deleteRow() {

      // 参数根据业务场景随意构造
      let params = { type: 'delete', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);

    }
  }
});
/* <el-button type="primary" size="mini" plain icon="el-icon-goods" @click.stop.prevent="entrySelf(rowData,index)" v-if="rowData.orderStatus === '20' && distribution ==2 && rowData.isOtc === 1">确认订单并发货</el-button>
<el-button type="primary" size="mini" plain icon="el-icon-goods" @click.stop.prevent="entryInfo(rowData,index)" v-if="rowData.orderStatus === '20' && distribution ==1 && rowData.isOtc === 1">确认订单并发货</el-button>
<el-button type="primary" size="mini" plain icon="el-icon-search" @click.stop.prevent="seeInfo(rowData,index)" v-if="rowData.orderStatus == '30' && rowData.logisticsType === '美团'">查看配送详情</el-button>
<el-button type="primary" size="mini" plain icon="el-icon-edit-outline" @click.stop.prevent="print(rowData,index)"  v-if="rowData.orderStatus == '30'">打印</el-button> */
// 库存列表-选择商品
Vue.component('outNewList', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" icon="el-icon-success" @click.stop.prevent="querySelect(rowData,index)">确定选择</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    querySelect() {
      let params = { type: 'querySelect', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 库存导入失败列表
Vue.component('table-operation-fail', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" icon="el-icon-success" @click.stop.prevent="exports(rowData,index)">导出</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    exports() {
      let params = { type: 'exports', index: this.index, rowData: this.rowData };
      this.$emit('on-custom-comp', params);
    }
  }
});
// 商户列表操作
Vue.component('table-operation-business', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" icon="el-icon-search" @click.stop.prevent="seeInformation(rowData,index)">查看详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeInformation() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'seeInformation',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 优惠券列表操作
Vue.component('table-operation-marke', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini"  icon="el-icon-search" @click.stop.prevent="seeMarke(rowData,index)">查看</el-button>
        <el-button type="success" size="mini"  icon="el-icon-edit" @click.stop.prevent="editMarke(rowData,index)" v-if="rowData.state === 1">修改</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-warning" @click.stop.prevent="endMarke(rowData,index)" v-if="rowData.state === 1">结束</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-delete" @click.stop.prevent="delateMarke(rowData,index)" v-if="rowData.state === 1 || rowData.state === 2">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeMarke() {
      let params = {
        type: 'seeMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    editMarke() {
      let params = {
        type: 'editMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    endMarke() {
      let params = {
        type: 'endMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    delateMarke() {
      let params = {
        type: 'delateMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 礼单
Vue.component('table-operation-seegiftListDetail', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" icon="el-icon-search" @click.stop.prevent="seeOrderDetail(rowData,index)">查看订单详情</el-button>
        <el-button type="success" size="mini" icon="el-icon-search" @click.stop.prevent="seeGiftDetail(rowData,index)">查看礼包详情</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeOrderDetail() {
      let params = {
        type: 'seeOrderDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    seeGiftDetail() {
      let params = {
        type: 'seeGiftDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 结算清单
Vue.component('table-operation-detail', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" icon="el-icon-search" @click.stop.prevent="seeOrderDetail(rowData,index)">查看明细</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeOrderDetail() {
      let params = {
        type: 'seeOrderDetail',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 商城营销活动列表操作
Vue.component('table-operation-activit', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini"  icon="el-icon-search" @click.stop.prevent="seeMarke(rowData,index)">查看</el-button>
        <el-button type="success" size="mini"  icon="el-icon-edit" @click.stop.prevent="editMarke(rowData,index)" v-if="rowData.activityState === 2">修改</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-warning" @click.stop.prevent="endMarke(rowData,index)" v-if="rowData.activityState === 1">结束</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-delete" @click.stop.prevent="delateMarke(rowData,index)" v-if="rowData.activityState === 1 || rowData.activityState === 2 || rowData.activityState === 3">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeMarke() {
      let params = {
        type: 'seeMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    editMarke() {
      let params = {
        type: 'editMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    endMarke() {
      let params = {
        type: 'endMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    delateMarke() {
      let params = {
        type: 'delateMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// o2o营销活动列表操作
Vue.component('table-operation-activito2o', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini"  icon="el-icon-search" @click.stop.prevent="seeMarke(rowData,index)">查看</el-button>
        <el-button type="danger" size="mini"  icon="el-icon-warning" @click.stop.prevent="endMarke(rowData,index)" v-if="rowData.activityState === 1 || rowData.activityState === 2">结束</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    seeMarke() {
      let params = {
        type: 'seeMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    endMarke() {
      let params = {
        type: 'endMarke',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 活动详情商品列表操作
Vue.component('table-operation-detailGoods', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" @click.stop.prevent="detailgoods(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    detailgoods() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'detailgoods',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 活动详情换购商品列表操作
Vue.component('table-operation-regichGoods', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" @click.stop.prevent="detailgoods(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    detailgoods() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'detailgoods',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 活动详情买赠商品列表操作
Vue.component('table-operation-giftGoods', {
  template: `<span class="table-operation-btns">
        <el-button type="success" size="mini" @click.stop.prevent="selectgoods(rowData,index)">选择赠品</el-button>
        <el-button type="success" size="mini" @click.stop.prevent="detailgoods(rowData,index)">删除</el-button>
        </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    detailgoods() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'detailgoods',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    selectgoods() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'selectgoods',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  }
});
// 商品退款数量加减操作
Vue.component('table-operation-refundGoods', {
  template: `<span class="table-operation-btns">
  <el-input-number size="mini" v-model="rowData.count" :min="1" :max="max" @change="countChange"></el-input-number>
        </span>`,
  data: function() {
    return {
      max: this.rowData.count
    };
  },
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    countChange() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'countChange',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  },
});
// 下载报表操作
Vue.component('table-operation-down', {
  template: `<span class="table-operation-btns">
  <el-button type="success" size="mini" @click.stop.prevent="down(rowData,index)">下载</el-button>
  </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    down() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'down',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
  },
});
// 处方商品操作
Vue.component('table-operation-drugDetele', {
  template: `<span class="table-operation-btns">
  <el-button type="success" size="mini" icon="el-icon-edit" @click.stop.prevent="edit(rowData,index)">编 辑</el-button>
  <el-button type="success" size="mini" icon="el-icon-delete" @click.stop.prevent="deletes(rowData,index)">删 除</el-button>
  </span>`,
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    deletes() {
      // 参数根据业务场景随意构造
      let params = {
        type: 'deletes',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    },
    edit() {
      let params = {
        type: 'edit',
        index: this.index,
        rowData: this.rowData
      };
      this.$emit('on-custom-comp', params);
    }
  },
});