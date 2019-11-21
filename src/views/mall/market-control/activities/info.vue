<template>
  <div class="info">
    <el-form :model="info" :inline="true" :rules="rules" ref="editValidateForm" label-width="98px" size="small" class="forms">
      <div class="info_box">
        <h2 class="title item-header">基础信息</h2>
        <div class="inbfo-item">
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动名称:" prop="activityName">
                <el-input v-model="info.activityName" placeholder="活动名称（10个字以内）" maxlength="10"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="起止时间:" prop="endDate">
                <div class="date-box">
                  <el-date-picker
                  v-model="info.startDate"
                  type="datetime"
                  placeholder="选择开始时间"
                  default-time="00:00:00"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH">
                  </el-date-picker>
                至
                  <el-date-picker
                  v-model="info.endDate"
                  type="datetime"
                  placeholder="选择结束时间"
                  default-time="23:00:00"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH"
                  :picker-options="pickerOptions">
                  </el-date-picker>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activityType === 2">
            <el-col :span="12">
              <el-form-item label="满减规则:" prop="reduce" class="fullReduce">
                <span>满</span>
                <el-input v-model.number="info.full" placeholder="金额" maxlength="10"></el-input>
                <span>减</span>
                <el-input v-model.number="info.reduce" placeholder="金额" maxlength="10"></el-input>
                <span style="color:#999">(最多可输入两位小数)</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row  v-if="activityType === 3">
            <el-col :span="12">
              <el-form-item label="折扣类型:" prop="discountType" class="discount">
                <el-select v-model.number="info.discountType" placeholder="请选择">
                  <el-option label="全场折扣" :value="1"></el-option>
                  <el-option label="商品折扣" :value="2"></el-option>
                </el-select>
                <span v-if="info.discountType === 1">
                  <el-input v-model="discount" placeholder="折扣" maxlength="10"></el-input>
                  <span>折</span>
                </span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="可参与群体:" prop="participableGroup">
                <el-select v-model="info.participableGroup" placeholder="请选择">
                  <el-option label="全部用户" :value="1"></el-option>
                  <el-option label="活动期间的新用户" :value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="选择商品:" prop="quantityOfActiveCommodities">
                <el-button type="default" size="medium" icon="el-icon-plus" @click="addRepurchase(1)">添加商品</el-button>
                <span>（已选择{{info.quantityOfActiveCommodities ? info.quantityOfActiveCommodities : 0}}个）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="activityType === 5">
            <el-col :span="12">
              <el-form-item label="换购商品:" prop="selectedRepurchaseNumber">
                <el-button type="default" size="medium" icon="el-icon-plus" @click="addRepurchase(2)">添加商品</el-button>
                <span>（已选择{{info.selectedRepurchaseNumber ? info.selectedRepurchaseNumber : 0}}个）</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="info_box table_from" v-if="info.commodityScope.length > 0">
        <el-form-item label="" prop="commodityScope">
          <!-- 特价商品表 -->
          <h2 class="title item-header">商品信息</h2>
          <div class="table">
            <v-table ref="data_table"
            :cell-edit-done="cellEditDone"
            column-width-drag
            is-horizontal-resize
            style="width:100%"
            :columns="activityType === 1 ? Columns : activityType === 2 ? fullColumns : activityType === 3 ? countColums : activityType === 4 ? giftcolums : activityType === 5 ? chaseColums : []"
            :table-data="info.commodityScope"
            row-hover-color="#eee"
            row-click-color="#edf7ff"
            @on-custom-comp="customCompFunc"></v-table>
          </div>
        </el-form-item>
      </div>
        <!-- 换购商品表 -->
      <div class="info_box table_from" v-if="activityType === 5 && info.repurchaseJson.length > 0">
        <el-form-item label="" prop="repurchaseJson">
          <h2 class="title">换购商品信息</h2>
          <div class="table">
            <v-table ref="data_table"
            :cell-edit-done="cellEditrepurchase"
            column-width-drag
            is-horizontal-resize
            style="width:100%"
            :columns="subchaseColums"
            :table-data="info.repurchaseJson"
            row-hover-color="#eee"
            row-click-color="#edf7ff"
            @on-custom-comp="customComprequireFunc"></v-table>
          </div>
        </el-form-item>
      </div>
      <div class="btnBox">
        <el-button type="warning" @click="submit" v-if="!isEdit">确认创建</el-button>
        <el-button type="warning" @click="submit" v-else>确认修改</el-button>
      </div>
    </el-form>
    <!-- 商品弹窗 -->
    <el-dialog title="选择商品" :visible.sync="mallShow" :center='true' :modal-append-to-body="false" width="1600px">
      <goods v-if="mallShow" @getGoods="getGoods" :goodsData="isRequrch === 1 ? info.commodityScope : isRequrch === 2 ? info.repurchaseJson : []" :limit="limit"></goods>
    </el-dialog>
  </div>
</template>

<script>
import goods from '../outGoodsList';
import { getType } from '@/utils/auth';
import javaRequest from '@/utils/javaApiRequest';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      isDiscount: true,
      rowIndex: '',
      limit: null, // 可选条数
      isRequrch: null, // 选择的商品类型 1特价 2 换购 3 赠品
      mallShow: false, // 显示隐藏商品弹框
      outMallListUrl: `${process.env.WEB_HOST}/outMallList`,
      discount: '', // 全场折扣多少
      time: [], // 时间
      info: {
        activityName: '', // 名字
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        participableGroup: '', // 可参与群体(1.全部用户 2.活动期间的新用户)
        activityType: this.activityType, // 活动类型（1.特价商品 2.商品满减 3.商品折扣 4.商品买赠 5.商品换购）
        full: '', // 满
        reduce: '', // 减
        discountType: '', // 折扣类型（1.全场折扣 2.商品折扣）
        quantityOfActiveCommodities: '', // 活动商品数量
        selectedRepurchaseNumber: '', // 已换购数量
        commodityScope: [], // 参与活动的商品
        // giftJson: [], // 赠品
        repurchaseJson: [] // 换购商品
      },
      // columns: this.activityType === 1 ? this.Columns() : this.activityType === 2 ? this.fullColumns() : this.activityType === 3 ? this.countColums() : '',
      rules: {
        activityName: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        endDate: [{ required: true, message: '请选择起止时间', trigger: 'blur' }],
        participableGroup: [{ required: true, message: '请选择可参与群体', trigger: 'change' }],
        quantityOfActiveCommodities: [{ required: true, validator: this.valiCommon, trigger: 'blur' }],
        selectedRepurchaseNumber: [{ required: true, validator: this.valiChase, trigger: 'blur' }],
        reduce: [{ required: true, validator: this.validNew, trigger: 'blur' }],
        discountType: [{ required: true, validator: this.validType, trigger: 'change' }],
        commodityScope: [{ required: true, validator: this.validScope, trigger: 'blur' }],
        repurchaseJson: [{ required: true, validator: this.validRepur, trigger: 'blur' }]
      },
      detail: ''
    };
  },
  computed: {
    ...mapGetters([
      'visitedViews',
      'sidebarStatus'
    ]),
    giftcolums() {
      // 自定义买赠商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '换购商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson1', title: '赠品名称', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson2', title: '赠品价格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'giftJson3', title: '赠送数量', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'giftJson4', title: '赠品库存', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-giftGoods', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
          continue;
        }
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        if (item.field === 'giftJson1') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData['giftJson'][0] ? rowData['giftJson'][0].giftName : '';
            console.log(v);
            return v || '-';
          };
        }
        if (item.field === 'giftJson2') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let v = rowData['giftJson'][0].giftPrice;
            let v = rowData['giftJson'][0] ? rowData['giftJson'][0].giftPrice : '';
            return v || '-';
          };
        }
        if (item.field === 'giftJson3') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let v = rowData['giftJson'][0].quantityOfDonation;
            let v = rowData['giftJson'][0] ? rowData['giftJson'][0].quantityOfDonation : '';
            return v || '-';
          };
        }
        if (item.field === 'giftJson4') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            // let v = rowData['giftJson'][0].numberOfGifts;
            let v = rowData['giftJson'][0] ? rowData['giftJson'][0].numberOfGifts : '';
            return v || '-';
          };
        }
      }
      return columns;
    },
    countColums() {
      // 自定义折扣商品表格
      let _self = this;
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'discount', title: '折扣', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: _self.info.discountType === 2 ? true : false },
        { field: 'participableProductNumber', title: '参与活动商品库存', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-detailGoods', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
          continue;
        }
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    fullColumns() {
      // 自定义满减商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        // { field: 'specialOffer', title: '特价', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true, isShow: false },
        { field: 'participableProductNumber', title: '参与活动商品库存', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-detailGoods', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
          continue;
        }
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
        // item.formatter = function (rowData, rowIndex, pagingIndex, field) {
        //   let value = rowData[field];
        //   if (value) {
        //     return value;
        //   } else {
        //     return '-';
        //   }
        // };
      }
      return columns;
    },
    Columns() {
      // 自定义特价商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'specialOffer', title: '特价', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'participableProductNumber', title: '参与活动商品库存', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-detailGoods', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
          continue;
        }
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    chaseColums() {
      // 自定义换购活动商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'productName', title: '商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'originalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-detailGoods', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
          continue;
        }
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
    subchaseColums() {
      // 自定义换购商品表格
      let columns = [
        {
          field: 'custome', title: '序号', width: 50, titleAlign: 'center', columnAlign: 'center',
          formatter: function (rowData, rowIndex, pagingIndex, field) {
            let index = 0 * 10 + rowIndex + 1;
            return index <= 3 ? '<span style="color:red;font-weight: bold;">' + index + '</span>' : index;
          }, isFrozen: true, isResize: true
        },
        { field: 'repurchaseProductName', title: '换购商品名称', width: 150, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'repurchaseOriginalPrice', title: '原价', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true },
        { field: 'repurchaseProductPrice', title: '换购商品价格', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'repurchaseProductNumber', title: '换购商品库存', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        // { field: 'clipCoupon', title: '是否可使用优惠券', width: 60, titleAlign: 'center', columnAlign: 'center', isResize: true, isEdit: true },
        { field: 'operation', title: '操作', width: 240, titleAlign: 'center', columnAlign: 'center', componentName: 'table-operation-regichGoods', isResize: true }
      ];
      for (let i = 0; i < columns.length; i++) {
        let item = columns[i];
        if (i < 1 || i === 10) {
          continue;
        }
        if (item.field === 'clipCoupon') {
          item.formatter = function (rowData, rowIndex, pagingIndex, field) {
            let v = rowData[field];
            let stateList = {
              '0': '否',
              '1': '是',
            };
            let value = stateList[v];
            return value || '-';
          };
        }
      }
      return columns;
    },
  },
  watch: {
    'time': function() {
      this.info.startDate = this.time[0] + ':00';
      this.info.endDate = this.time[1] + ':00';
    },
    'info.discountType': function() {
      if (this.isDiscount) {
        console.log(1);
        this.info.commodityScope = [];
        this.info.quantityOfActiveCommodities = 0;
        this.discount = '';
      }
    },
    'sidebarStatus': function (value, oldValue) {
      this.$refs['data_table'].resize();
    },
  },
  components: {
    'goods': goods
  },
  props: {
    activityType: Number,
    isEdit: Boolean
  },
  methods: {
    // 换购商品验证
    validRepur(rule, value, callback) {
      console.log(value);
      for (let i = 0; i < value.length; i++) {
        if (value[i].repurchaseProductPrice === '') {
          callback(new Error('请输入商品换购价格'));
        } else {
          callback();
        }
      }
    },
    // 换购商品数量验证
    valiChase(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择换购商品'));
      } else {
        callback();
      }
    },
    // 活动商品数量验证
    valiCommon(rule, value, callback) {
      if (!value) {
        callback(new Error('请选择活动商品'));
      } else {
        callback();
      }
    },
    // 活动商品验证
    validScope(rule, value, callback) {
      console.log(value[0].giftJson);
      for (let i = 0; i < value.length; i++) {
        if (value[i].specialOffer === '' && this.activityType === 1) {
          callback(new Error('请输入商品特价'));
        } else if (value[i].discount === '' && this.activityType === 3) {
          callback(new Error('请输入商品折扣'));
        } else if (value[i].giftJson.length === 0 && this.activityType === 4) {
          console.log(value[i].giftJson + '2222');
          callback(new Error('请选择赠品'));
        } else {
          callback();
        }
      }
    },
    // 折扣规则验证
    isvalidType(str) {
      const reg = /^(?!0(\.0{1,2})?$)(\d(\.\d{1,2})?)$/;
      return reg.test(str);
    },
    validType(rule, value, callback) {
      if (value === '') {
        callback(new Error('请选择折扣类型'));
      } else if (value === 1 && !this.discount) {
        callback(new Error('请输入满减折扣'));
      } else if (value === 1 && !this.isvalidType(this.discount)) {
        callback(new Error('请输入正确满减折扣'));
      } else {
        callback();
      }
    },
    // 满减规则验证
    isvalidmoney(str) {
      const reg = /^[0-9]+([.]{1}[0-9]{1,2})?$/;
      return reg.test(str);
    },
    validNew(rule, value, callback) {
      if (value === '' || this.info.full === '') {
        callback(new Error('请输入满减规则'));
      } else if (value >= this.info.full || !this.isvalidmoney(value) || !this.isvalidmoney(this.info.full)) {
        callback(new Error('请输入正确满减规则'));
      } else {
        callback();
      }
    },
    customCompFunc(param) {
      // 自定义列
      if (param.type === 'detailgoods') {
        this.info.commodityScope.splice(param.rowIndex, 1);
        this.info.quantityOfActiveCommodities = this.info.commodityScope.length;
      } else if (param.type === 'selectgoods') {
        this.isRequrch = 3;
        this.mallShow = true;
        this.limit = 1;
        this.rowIndex = param.index;
      }
    },
    customComprequireFunc(param) {
      // 自定义列
      if (param.type === 'detailgoods') {
        this.info.repurchaseJson.splice(param.rowIndex, 1);
        this.info.selectedRepurchaseNumber = this.info.repurchaseJson.length;
      }
    },
    // 单元格编辑回调
    cellEditDone(newValue, oldValue, rowIndex, rowData, field) {
      let a = '';
      if (field === 'clipCoupon') { // 是否使用优惠券
        if (newValue === '是') {
          a = '1';
        } else {
          a = '0';
        }
        this.info.commodityScope[rowIndex][field] = a;
      } else if (field === 'giftJson3') { // 赠送数量
        if (newValue > 0 && newValue <= 10) {
          this.info.commodityScope[rowIndex]['giftJson'][0].quantityOfDonation = Math.floor(newValue);
        } else {
          this.info.commodityScope[rowIndex]['giftJson'][0].quantityOfDonation = 1;
        }
      } else if (field === 'giftJson4') { // 赠品库存
        if (newValue >= 0 && newValue <= rowData['giftJson'][0]['productStock']) {
          this.info.commodityScope[rowIndex]['giftJson'][0].numberOfGifts = Math.floor(newValue);
        } else {
          this.info.commodityScope[rowIndex]['giftJson'][0].numberOfGifts = rowData['giftJson'][0]['productStock'];
        }
      } else if (field === 'participableProductNumber') { // 活动商品库存
        if (newValue >= 0 && newValue <= rowData['productStock']) {
          this.info.commodityScope[rowIndex][field] = Math.floor(newValue);
        } else {
          this.info.commodityScope[rowIndex][field] = rowData['productStock'];
        }
      } else if (field === 'specialOffer') { // 特价
        if (newValue < rowData['originalPrice']) {
          console.log(newValue);
          this.info.commodityScope[rowIndex][field] = Number(newValue).toFixed(2);
        } else {
          this.info.commodityScope[rowIndex][field] = 0;
        }
      } else if (field === 'discount') { // 折扣
        if (this.isvalidType(newValue)) {
          this.info.commodityScope[rowIndex][field] = newValue;
        } else {
          this.info.commodityScope[rowIndex][field] = 1;
        }
      } else {
        this.info.commodityScope[rowIndex][field] = newValue;
      }

    },
    // 换购商品单元格编辑回调
    cellEditrepurchase(newValue, oldValue, rowIndex, rowData, field) {
      // let a = '';
      if (field === 'repurchaseProductNumber') { // 换购商品库存
        if (newValue < rowData['productStock']) {
          this.info.repurchaseJson[rowIndex][field] = Math.floor(newValue);
        } else {
          this.info.repurchaseJson[rowIndex][field] = rowData['productStock'];
        }
      } if (field === 'repurchaseProductPrice') { // 换购价格
        if (newValue < rowData['repurchaseOriginalPrice']) {
          this.info.repurchaseJson[rowIndex][field] = Number(newValue).toFixed(2);
        } else {
          this.info.repurchaseJson[rowIndex][field] = 0;
        }
      } else {
        this.info.repurchaseJson[rowIndex][field] = newValue;
      }
    },
    addRepurchase(item) {
    // 添加商品
      this.isRequrch = item;
      this.mallShow = true;
    },
    getGoods(data) {
      // 选择商品回调
      this.mallShow = false;
      if (this.isRequrch === 2) { // 换购商品
        let array = data.map(res => {
          return {
            businessType: getType(), // 商户类型
            productId: res.productId,
            repurchaseProductName: res.po.productName,
            repurchaseOriginalPrice: res.productPrice,
            repurchaseProductPrice: '', // 换购价格
            repurchaseProductNumber: res.productStock, // 换购数量
            productStock: res.productStock, // 库存
            // clipCoupon: 0, // 是否可使用优惠券
            productType: 7 // 商品类型
          };
        });
        this.info.repurchaseJson = this.info.repurchaseJson.concat(array);
        this.info.repurchaseJson = this.uniq(this.info.repurchaseJson);
        this.info.selectedRepurchaseNumber = this.info.repurchaseJson.length;
      } else if (this.isRequrch === 1) { // 活动的商品
        let array = data.map(res => {
          return {
            businessType: getType(), // 商户类型
            productId: res.productId,
            productName: res.po.productName,
            originalPrice: res.productPrice,
            specialOffer: '', // 特价
            participableProductNumber: res.productStock, // 参与活动商品数量
            productStock: res.productStock, // 库存
            clipCoupon: 0, // 是否可使用优惠券
            discount: this.info.discountType === 1 ? this.discount : '', //  折扣
            productType: this.activityType, // 商品类型
            giftJson: []
          };
        });
        this.info.commodityScope = this.info.commodityScope.concat(array);
        this.info.commodityScope = this.uniq(this.info.commodityScope);
        this.info.quantityOfActiveCommodities = this.info.commodityScope.length;
      } else if (this.isRequrch === 3) { // 赠品
        console.log(3);
        this.info.commodityScope[this.rowIndex].giftJson = [];
        let obj = {
          parentProductId: this.info.commodityScope[this.rowIndex].productId, // 父id
          productId: data[0].productId, // 赠品id
          giftName: data[0].po.productName, // 赠品名称
          giftPrice: data[0].productPrice, // 赠品价格
          quantityOfDonation: 1, // 赠送数量
          numberOfGifts: data[0].productStock, // 赠品数量
          productStock: data[0].productStock, // 赠品库存
          productType: 6, // 类型 6（赠品）
          businessType: getType(), // 商户类型
        };
        this.info.commodityScope[this.rowIndex].giftJson.push(obj);
        console.log(this.info.commodityScope[this.rowIndex].giftJson);
        // this.giftcolums();
      }

    },

    // 将对象元素转换成字符串以作比较
    obj2key(obj, keys) {
      let n = keys.length;
      let key = [];
      while (n--) {
        key.push(obj[keys[n]]);
      }
      return key.join('|');
    },
    // 数组去重
    uniq(array) {
      let arr = [];
      let hash = {};
      for (let i = 0, j = array.length; i < j; i++) {
        let k = this.obj2key(array[i], ['productId']);
        if (!(k in hash)) {
          hash[k] = true;
          arr.push(array[i]);
        }
      }
      return arr;
    },
    submit() {
      // 11
      console.log(1);
      this.$refs['editValidateForm'].validate((valid) => {
        console.log(valid);
        if (valid) {
          let param = '';
          this.info.startDate = this.info.startDate + ':00';
          this.info.endDate = this.info.endDate + ':00';
          if (this.isEdit) {
            param = {
              usedParam: this.detail,
              param: this.info
            };
          } else {
            param = this.info;
          }
          let url = this.isEdit ? '/mall_manage_seller/back/marketing/activities/updateMarketingActivities' : '/mall_manage_seller/back/marketing/activities/addMarketingActivities';
          javaRequest.post(url, param).then((res) => {
            console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
              let currentName = this.$route.name;
              let currentTab = this.visitedViews.find((x) => x.name === currentName);
              this.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                this.$router.push('/market-control/activities/list');
              });
            }
          });
        }
      });
    },
    // 获取修改数据
    getEditData() {
      let param = {
        marketingActivitiesId: this.$route.query.id
      };
      javaRequest.post('/mall_manage_seller/back/marketing/activities/queryActivityDetails', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.detail = res.data.resultData;
          this.isDiscount = false;
          this.info = {
            marketingActivitiesId: res.data.resultData.marketingActivitiesId,
            activityName: res.data.resultData.activityName,
            activityState: res.data.resultData.activityState,
            startDate: res.data.resultData.startDate,
            endDate: res.data.resultData.endDate,
            participableGroup: res.data.resultData.participableGroup,
            activityType: res.data.resultData.activityType,
            full: res.data.resultData.full,
            reduce: res.data.resultData.reduce,
            discountType: res.data.resultData.discountType,
            quantityOfActiveCommodities: res.data.resultData.quantityOfActiveCommodities,
            selectedRepurchaseNumber: res.data.resultData.selectedRepurchaseNumber,
            commodityScope: res.data.resultData.commodityScope,
            repurchaseJson: res.data.resultData.repurchaseJson,
          };
          this.time = [res.data.resultData.startDate, res.data.resultData.endDate];
          console.log(res.data.resultData.commodityScope);
          this.discount = res.data.resultData.discountType === 1 ? res.data.resultData.commodityScope[0].discount : '';
          // this.info.discountType === 1 ? this.discount
          console.log(this.info);
          // this.isDiscount = true;
          setTimeout(() => {
            this.isDiscount = true;
          }, 1000);
        }
      });
    }
  },
  created() {
    if (this.isEdit) {
      this.getEditData();
    }
  }
};
</script>

<style lang="less" scoped>
.info_box{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  width: 100%;
  /deep/ .el-input{
    display: inline
  }
  .title{
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    background: #fff;
    font-size: 18px;
  }
  .inbfo-item{
    padding-top: 15px;
    padding-left: 15px;
  }
  .forms{
    padding-left: 30px;
    padding-top: 20px;
  }
}
.fullReduce{
  /deep/ .el-input__inner{
    width: 100px;
    // display: inline;
  }
}
.discount{
  /deep/ .el-input__inner{
    width: 60px;
  }
  /deep/ .el-select{
    width: 215px;
    /deep/ .el-input__inner{
      width: 100%;
    }
  }
}
.table{
  padding: 30px 20px;
}
.btnBox{
  margin-top: 80px;
  display: flex;
  justify-content: space-around;
}
.date-box{
  display: flex;
  height: 35px;
  align-items: center;
}
.table_from{
  /deep/.el-form-item__content{
    width: 100%;
  }
  /deep/.el-form-item.el-form-item--small{
    width: 100%;
  }
}
</style>
