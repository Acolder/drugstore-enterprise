<template>
  <div class="night">
    <el-form :model="nightForm" :rules="rules" ref="nightForm" class="wrap">
      <h2>营业状态</h2>
      <div class="box">
        <p class="status" v-if="nightForm.businessType === '0'">营业中</p>
        <p class="status" v-if="nightForm.businessType === '1'">待营业</p>
        <p class="status" v-if="nightForm.businessType === '-1'">已歇业</p>
      </div>
      <h2>营业设置</h2>
      <!-- <el-form-item label="是否支持夜间购药：" prop="isSupport">
        <el-radio-group v-model="nightForm.isSupport">
          <el-radio label="1">夜间购药（22:00-次日9:00）</el-radio>
          <el-radio label="-1">不支持夜间购药</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <div class="box">
        <el-form-item label="营业控制：" prop="isBusiness">
          <el-radio v-model="nightForm.isBusiness" :label="0">正常营业</el-radio>
          <el-radio v-model="nightForm.isBusiness" :label="-1">停止营业</el-radio>
        </el-form-item>
        <el-form-item label="营业日期：" prop="businessDate">
          <el-checkbox-group v-model="nightForm.businessDate" @change="handleDataChange">
            <el-checkbox v-for="item in date" :label="item.value" :key="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleAllDataChange">每天</el-checkbox>
        </el-form-item>
        <el-form-item label="营业时间：" prop="businessHours" class="time">
          <div v-for="(item,index) in nightForm.businessHours" :key="index" class="buswrap">
            <el-time-select
            placeholder="起始时间"
            v-model="item.businessBeginDate"
            :editable="false"
            :picker-options="{
              start: '00:00',
              step: '00:10',
              end: '23:50',
              minTime: index === 0 ? '' : index === 1 ? nightForm.businessHours[0].businessEndDate : index === 2 ? nightForm.businessHours[1].businessEndDate : '00:00',
              maxTime: item.businessEndDate,
            }"
            :disabled="index<nightForm.businessHours.length - 1 && nightForm.businessHours.length > 1 ? true : false">
            </el-time-select>
            <span>至</span>
            <el-time-select
              placeholder="歇业时间"
              v-model="item.businessEndDate"
              :editable="false"
              :picker-options="{
                start: '00:00',
                step: '00:10',
                end: '23:50',
                minTime: item.businessBeginDate
              }"
              :disabled="index<nightForm.businessHours.length - 1 && nightForm.businessHours.length > 1 ? true : false">
            </el-time-select>
            <i class="el-icon-circle-plus add" @click="addbus" v-if="index === 0"></i>
            <i class="el-icon-minus mint" @click="mintbus(index)" v-else></i>
          </div>
        </el-form-item>
      </div>
      <h2>配送设置</h2>
      <div class="seeting box">
        <!-- <el-form-item label="配送距离范围：" prop="distanceRange">
          <el-input v-model="nightForm.distanceRange"></el-input>公里
        </el-form-item> -->
        <el-form-item label="配送区域范围：" prop="range">
          <div class="btn-wrap">
            <div class="button-box" v-for="(item,index) in nightForm.range" :key="index">
              <i class="el-icon-error button-delete" @click="deleteButton(index)"></i>
              <el-button>{{item}}</el-button>
            </div>
            <i class="el-icon-circle-plus add" @click="addRegion"></i>
          </div>
        </el-form-item>
        <el-form-item label="默认配送方式：" prop="orderTransport">
          <el-radio v-model="nightForm.orderTransport" label="美团配送" v-if="type === '2'">第三方配送</el-radio>
          <el-radio v-model="nightForm.orderTransport" label="自行配送" v-if="type === '2'">自行配送</el-radio>
          <el-radio v-model="nightForm.orderTransport" label="普通物流" v-if="type === '1'">普通物流</el-radio>
        </el-form-item>
        <el-form-item label="自行配送验证：" prop="isValidateCode">
          <el-radio v-model="nightForm.isValidateCode" :label="1">开启</el-radio>
          <el-radio v-model="nightForm.isValidateCode" :label="0">关闭</el-radio>
        </el-form-item>
      </div>
      <div class="bottom-box">
        <el-button type="warning" size="small" @click="reset">重置</el-button>
        <el-button type="success" size="small" @click="save">保存</el-button>
      </div>
    </el-form>
    <el-dialog title="选择配送区域" width="500px" :visible.sync="rangeShow" :modal-append-to-body="false">
      <div class="content">
        <span class="region" :class="{'selectActive': item.value === 2}" v-for="(item,index) in regionList" :key="index" @click="select(item)">{{item.name}}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="rangeShow = false">取 消</el-button>
        <el-button type="success" @click="query">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      checkAll: false,
      isIndeterminate: false,
      nightForm: {
        // isSupport: '1',
        range: [],
        businessDate: [],
        businessHours: [
          {
            businessBeginDate: '',
            businessEndDate: '',
          }
        ],
        orderTransport: '美团配送',
        isBusiness: '',
        isValidateCode: ''
        // distanceRange: 3
      },
      rangeShow: false,
      rules: {
        // isSupport: [{ required: true, message: '请选择是否支持夜间配送', trigger: 'change' }],
        businessDate: [{ required: true, message: '请选择营业日期', trigger: 'change' }],
        businessHours: [{ required: true, validator: this.validTime, trigger: 'blur' }],
        // businessEndDate: [{ required: true, message: '请选择歇业时间', trigger: 'blur' }],
        // distanceRange: [{ required: true, message: '请输入配送距离', trigger: 'blur' }],
        // range: [{ required: true, message: '请选择配送范围', trigger: 'blur' }],
        // orderTransport: [{ required: true, message: '请选默认择配送方式', trigger: 'blur' }],
        isBusiness: [{ required: true, message: '请选择营业状态', trigger: 'change' }],
        // isValidateCode: [{ required: true, message: '请选择自行配送验证', trigger: 'change' }],
      },
      date: [
        { value: '1', name: '星期一' },
        { value: '2', name: '星期二' },
        { value: '3', name: '星期三' },
        { value: '4', name: '星期四' },
        { value: '5', name: '星期五' },
        { value: '6', name: '星期六' },
        { value: '0', name: '星期天' },
      ],
      selectData: [],
      regionList: [],
      type: ''
    };
  },
  watch: {
    'nightForm': {
      handler: function() {
      // if (this.nightForm.businessBeginDate > this.nightForm.businessEndDate) {
      //   this.nightForm.businessEndDate = '';
      // }
        console.log(12);
      },
      deep: true,
    }
  },
  methods: {
    isvalidTime(array) {
      let a = false;
      for (let i = 0; i < array.length; i++) {
        console.log(array[i]);
        if (array[i].businessBeginDate && array[i].businessEndDate) {
          a = true;
        } else {
          a = false;
          return;
        }
      }
      return a;
    },
    // value[value.length - 1].businessBeginDate === '' || value[value.length - 1].businessEndDate === ''
    validTime(rule, value, callback) {
      if (!this.isvalidTime(value)) {
        callback(new Error('请输入完整的营业时间'));
      } else {
        callback();
      }
    },
    // 重置
    reset() {
      this.nightForm = {
        range: [],
        businessDate: [],
        // distanceRange: 3,
        // businessBeginDate: '',
        // businessEndDate: '',
        businessHours: [
          {
            businessBeginDate: '',
            businessEndDate: '',
          }
        ],
        Hours: [],
        orderTransport: '美团配送',
        isBusiness: '',
        isValidateCode: ''
      };
      this.checkAll = false;
      for (let a = 0; a < this.regionList.length; a++) {
        this.regionList[a].value = 1;
      }
    },
    // 添加营业时间
    addbus() {
      if (this.nightForm.businessHours.length < 3) {
        if (this.nightForm.businessHours[this.nightForm.businessHours.length - 1].businessBeginDate && this.nightForm.businessHours[this.nightForm.businessHours.length - 1].businessEndDate) {
          this.nightForm.businessHours.push({
            businessBeginDate: this.nightForm.businessHours[this.nightForm.businessHours.length - 1].businessEndDate,
            businessEndDate: '',
          });
        } else {
          this.$message.warning('请先选择完当前时间在添加！');
        }
      } else {
        this.$message.warning('最多只能添加三个时间段');
      }

    },
    mintbus(index) {
    // 删除
      this.nightForm.businessHours.splice(index, 1);
    },
    // 选择营业日期
    handleDataChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === 7;
    },
    handleAllDataChange(value) {
      let list = ['1', '2', '3', '4', '5', '6', '0'];
      this.nightForm.businessDate = value ? list : [];
      // this.checkAll = true;
    },
    // 保存
    save() {
      let _self = this;
      _self.$refs['nightForm'].validate((valid) => {
        if (valid) {
          for (let a = 0; a < this.nightForm.businessHours.length; a++) {
            if (this.nightForm.businessHours[a].businessBeginDate && this.nightForm.businessHours[a].businessEndDate) {
              console.log(1);
            } else {
              console.log(2);
            }
            this.nightForm.businessHours[a] = this.nightForm.businessHours[a].businessBeginDate + '-' + this.nightForm.businessHours[a].businessEndDate;
          }
          let param = {
            // isNightShopping: _self.nightForm.isSupport,
            nightRange: _self.nightForm.range.join(','),
            businessDate: _self.nightForm.businessDate.join(','),
            isBusiness: _self.nightForm.isBusiness,
            isValidateCode: _self.nightForm.isValidateCode,
            businessHours: this.nightForm.businessHours.join(','),
            orderTransport: _self.nightForm.orderTransport
            // distanceRange: _self.nightForm.distanceRange,
          };
          javaRequest.post('/mall_manage_seller/back/nightShopping/saveNightShopping', param).then((res) => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              sessionStorage.setItem('orderTransport', param.orderTransport);
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.getRange();
            }
          });
        } else {
          return false;
        }
      });
    },
    // 添加范围
    addRegion() {
      console.log(this.nightForm.businessHours);
      this.rangeShow = true;
      if (this.nightForm.range) {
        this.selectData = this.nightForm.range.map(res => {
          return {
            name: res,
            value: 2
          };
        });
      }
    },
    // 选择范围
    select(item) {
      if (item.value === 2) {
        item.value = 1;
        for (let a = 0; a < this.selectData.length; a++) {
          if (this.selectData[a].name === item.name) {
            this.selectData.splice(a, 1);
          }
        }
      } else {
        item.value = 2;
        this.selectData.push(item);
      }
    },
    // 确定选择范围
    query() {
      let list = this.selectData.map(res => {
        return res.name;
      });
      this.nightForm.range = list;
      this.rangeShow = false;
    },
    // 删除选择的范围
    deleteButton(index) {
      for (let a = 0; a < this.regionList.length; a++) {
        if (this.regionList[a].name === this.nightForm.range[index]) {
          this.regionList[a].value = 1;
        }
      }
      this.nightForm.range.splice(index, 1);
    },
    // 获取营业设置
    getRange() {
      javaRequest.post('/mall_manage_seller/back/nightShopping/queryNightShopping').then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          console.log(res);
          if (res.data.resultData) {
            this.type = res.data.resultData.type;
            this.nightForm = {
              range: res.data.resultData.nightRange ? res.data.resultData.nightRange.split(',') : [],
              businessDate: res.data.resultData.businessDate ? res.data.resultData.businessDate.split(',') : [],
              Hours: res.data.resultData.businessHours ? res.data.resultData.businessHours.split(',') : [],
              isBusiness: res.data.resultData.isBusiness,
              isValidateCode: res.data.resultData.isValidateCode,
              orderTransport: res.data.resultData.orderTransport,
              businessHours: [],
              businessType: res.data.resultData.businessType
            };
            if (this.nightForm.businessDate.length === 7) {
              this.checkAll = true;
            }
            for (let a = 0; a < this.regionList.length; a++) {
              for (let i = 0; i < this.nightForm.range.length; i++) { if (this.regionList[a].name === this.nightForm.range[i]) {
                this.regionList[a].value = 2;
              } }
            }
            if (this.nightForm.Hours.length === 0) {
              console.log(1111);
              this.nightForm.businessHours.push({
                businessBeginDate: '',
                businessEndDate: '',
              });
            } else {
              for (let a = 0; a < this.nightForm.Hours.length; a++) {
                let datas = {
                  businessBeginDate: this.nightForm.Hours[a].split('-')[0],
                  businessEndDate: this.nightForm.Hours[a].split('-')[1],
                };
                this.nightForm.businessHours.push(datas);
              }
            }
          } else {
            console.log('否');
            this.nightForm = {
              range: [],
              businessDate: [],
              businessHours: [
                {
                  businessBeginDate: '',
                  businessEndDate: '',
                }
              ],
              orderTransport: '美团配送',
              businessType: '1',
              isBusiness: '',
              isValidateCode: '',
            };
          }
        }
        console.log(this.nightForm);
      });
    },
    getRegion() {
      javaRequest.post('/mall_manage_seller/back/nightShopping/queryCityRegion').then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          this.regionList = res.data.resultData.map(res => {
            return {
              name: res.name,
              value: 1
            };
          });
        }
      });
    }
  },
  created() {
    setTimeout(() => {
      this.getRange();
    }, 300);
    this.getRegion();
  }
};
</script>

<style lang="less" scoped>
.wrap{
  margin: 30px;
  padding: 30px 0;
  h2{
    line-height: 60px;
    // background: #f2f2f2;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  }
}
.time{
  /deep/.el-form-item__error{
    margin-left: 93px;
  }
}
.buswrap{
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  margin-left: 93px;
}
.night{
  // width: 500px;
  // margin: 0 auto;
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  // padding: 30px;
  background: #fff;
  .add{
    font-size: 40px;
    color: #67c23a;
    cursor: pointer;
    margin-left: 15px;
  }
  .mint{
    font-size: 36px;
    color: #fff;
    cursor: pointer;
    margin-left: 15px;
    background: #67c23a;
    border-radius: 50%;
  }
  .box{
    padding-left: 70px;
    padding-top: 30px;
    /deep/ .el-range-separator{
      width: 32px;
    }
    .status{
      font-size: 24px;
      color: red;
      padding-bottom: 15px;
    }
  }
  .button-box{
    position: relative;
    display: inline-block;
    margin-left: 25px;
    &:hover{
      .button-delete{
        display: block;
      }
    }
    /deep/ .el-button{
      cursor: auto;
    }
    .button-delete{
      position: absolute;
      top: 0;
      right: 0;
      color: #cacaca;
      cursor: pointer;
      display: none;
    }
  }
  .btn-wrap{
    display: flex;
    align-items: center;
  }
  .content{
    // border-bottom: 1px solid #cacaca;
    // border-top: 1px solid #cacaca;
    // height: 85px;
    // padding-top: 30px;
    .region{
      display: inline-block;
      width: 70px;
      height: 35px;
      text-align: center;
      line-height: 35px;
      border: 1px solid #ccc;
      margin-left: 20px;
      margin-bottom: 20px;
      cursor: pointer;
    }
    .selectActive{
      background: #67c23a;
      color: #fff;
      border-radius: 5px;
    }
  }
  .bottom-box{
    text-align: center;
    /deep/ .el-button--small, .el-button--small.is-round{
      margin-right: 30px;
      padding: 16px 48px;
      font-size: 16px;
    }
  }
  /deep/ .el-dialog__body{
    border-bottom: 1px solid #edf1f2;
    border-top: 1px solid #edf1f2;
  }
  /deep/ .el-checkbox-group{
    display: inline-block;
    margin-right: 30px;
  }
  .seeting{
    /deep/ .el-input{
      width: 50px;
      margin-right: 5px;
    }
    /deep/ .el-input__inner{
      width: 50px;
      height: 30px;
    }
  }
}

</style>
