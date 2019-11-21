<template>
  <div class="invigorationRecipeList"  v-loading="loading">
    <div class="invigorationRecipeList_main">
      <el-form :model="patientForm" :rules="rulesPatient" size="small" ref="infoForm" label-width="100px" class="info_form_rule">
        <div class="box">
          <div class="box_title">就诊人信息</div>
          <div class="nvigtitle">
            <span class="nvigtitle_right" @click="selectList">
              <i class="right_icon"></i>
              列表中选择
            </span>
          </div>
          <el-form-item label="姓名" prop="username">
            <el-input v-model.trim="patientForm.username" placeholder="请输入就诊人姓名" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="patientForm.gender" class="sexRadio">
              <el-radio label="1">男</el-radio>
              <el-radio label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="就诊类型" prop="jiuzhenType">
            <el-radio-group v-model="patientForm.jiuzhenType" class="sexRadio">
              <el-radio label="1">复诊</el-radio>
              <el-radio label="0">初诊</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.trim="patientForm.age" placeholder="请输入就诊人年龄" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="tel">
            <el-input v-model.trim="patientForm.tel" placeholder="请输入就诊人手机号" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="主诉及辨证" prop="diagnosis">
            <el-input type="textarea" maxlength="200" autosize resize="none" placeholder="请如实填写病名、发病情况、目前病情症状，身体状况等" v-model.trim="patientForm.diagnosis"></el-input>
          </el-form-item>
          <el-form-item label="诊断" prop="zhenduan" class="zhenduan">
            <div class="zhenduan">
              <div class="zhenduan_head zhenduan_box">
                <div class="option_box"></div>
                <div class="desc_box">诊断名称</div>
              </div>
              <div class="zhenduan_body zhenduan_box" v-for="(item, index) in patientForm.zhenduan" :key="index">
                <div class="option_box">
                  <i class="el-icon-close zhenduan_close" @click="deleteZhenduan(index)"></i>
                </div>
                <div class="desc_box">
                  <el-form-item :prop="'zhenduan.' + index + '.value'"
                    :rules="{required: true, message: '请选择诊断名称', trigger: 'blur'}">
                    <!-- <el-select v-model="item.value" placeholder="请选择">
                      <el-option
                        v-for="item in zhenduanOption"
                        :key="item.zhenduan_code"
                        :label="item.zhenduan_name"
                        :value="item.zhenduan_code">
                      </el-option>
                    </el-select>
                     -->
                    <el-select
                        v-model.trim="item.value"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入诊断名称"
                        :remote-method="zhendaunMethod"
                        @visible-change="getZhenduanList(item.value)">
                        <el-option
                          v-for="(item,index) in zhenduanOption"
                          :key="index"
                          :label="item.zhenduan_name"
                          :value="item.zhenduan_name"
                          :disabled="item.disable">
                        </el-option>
                      </el-select>
                  </el-form-item>
                </div>
              </div>
              <div class="zhenduan_box zhenduan-foot" @click="addZhenduan">
                <span class="el-icon-plus foot_add">添加诊断</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <!-- <el-form-item label="推荐药品" prop="remarks">
          <el-button type="success" icon="el-icon-plus">新增药品</el-button>
        </el-form-item> -->
        <div class="box">
          <div class="box_title">推荐药品</div>
          <!-- <el-button type="success" icon="el-icon-plus" class="add_drug" @click="addDrug">新增药品</el-button> -->
          <div class="dryg_box">
            <ul class="t_head">
              <li class="t_head_li">
                <span class="t_head_item close"></span>
                <span class="t_head_item name">药品名称</span>
                <span class="t_head_item num">数量</span>
                <span class="t_head_item usage">用法</span>
                <span class="t_head_item frequency">频次</span>
                <span class="t_head_item consumption">用量</span>
              </li>
            </ul>
            <ul class="dryg_box_list" v-for="(item, index) in patientForm.docPrescriptionDetails" :key="index">
              <li>
                <span class="list_td_item close">
                  <i class="el-icon-close dryg_close" @click="deleteDrug(index)"></i>
                </span>
                  <span class="list_td_item name">
                    <el-form-item label="" :prop="'docPrescriptionDetails.' + index + '.medicines'" label-width="0px"
                    :rules="{required: true, message: '请输入药品名称', trigger: 'change'}">

                       <el-select
                        v-model="item.medicines"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入药品名称"
                        :remote-method="drugMethod"
                        @change="selectdrug($event,index)">
                        <el-option
                          v-for="(drug,i) in drugOpitn"
                          :key="i"
                          :label="drug.product_name + ' (' + drug.norms +')'"
                          :value="drug">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </span>
                  <span class="list_td_item num">
                    <el-form-item label="" :prop="'docPrescriptionDetails.' + index + '.dose'" label-width="0px"
                    :rules="[{required: true, validator: validNumber, trigger: 'change'}]">
                      <el-input v-model.trim="item.dose" placeholder="请输入数量" maxlength="3"></el-input>
                    </el-form-item>
                  </span>
                  <span class="list_td_item usage">
                    <el-form-item label="" :prop="'docPrescriptionDetails.' + index + '.usage_code'" label-width="0px"
                    :rules="{required: true, message: '请选择用法', trigger: 'change'}">
                      <el-select v-model="item.usage_code" placeholder="请选择用法" @change="selectusage($event,index)">
                        <el-option
                          v-for="(usage, i) in usageOption"
                          :key="i"
                          :label="usage.name"
                          :value="usage.code">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </span>
                  <span class="list_td_item frequency">
                    <el-form-item label="" :prop="'docPrescriptionDetails.' + index + '.MedPerDayCode'" label-width="0px"
                    :rules="{required: true, message: '请选择频次', trigger: 'change'}">
                      <el-select v-model="item.MedPerDayCode" placeholder="请选择频次" @change="selectfrequency($event,index)">
                        <el-option
                          v-for="(frequency, i) in frequencyOption"
                          :key="i"
                          :label="frequency.name"
                          :value="frequency.code">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </span>
                  <span class="list_td_item consumption">
                    <el-form-item label="" :prop="'docPrescriptionDetails.' + index + '.MedPerDos'" label-width="0px"
                    :rules="{required: true, message: '请填写用量', trigger: 'change'}">
                      <el-button type="button" @click="fillBtn(index)" v-if="!patientForm.docPrescriptionDetails[index].MedPerDos">请填写</el-button>
                      <el-button type="button" class="textBtn" @click="fillBtn(index,patientForm.docPrescriptionDetails[index].MedPerDos,patientForm.docPrescriptionDetails[index].MedPerDosUnit)" v-else>{{patientForm.docPrescriptionDetails[index].MedPerDos}}{{patientForm.docPrescriptionDetails[index].MedPerDosUnit}}</el-button>
                    </el-form-item>
                  </span>
              </li>
            </ul>
            <div class="dryg_box_foot" @click="addDrug">
              <span class="el-icon-plus foot_add">新增药品</span>
            </div>
          </div>
        </div>
      </el-form>
      <div class="btn">
        <el-button type="success" @click="save">保存</el-button>
        <el-button type="success" @click="startRogation">提交处方</el-button>
      </div>
      <el-dialog title="选择就诊人" :visible.sync="memberShow" center="" :modal-append-to-body="false" width="500px" class="member_list" @close="memberClose">
        <div class="seach">
          <el-input v-model.trim="membername" placeholder="就诊人姓名" maxlength="20"></el-input>
          <el-button type="success" @click="seach">搜索</el-button>
          <ul class="list_header">
            <li class="list_item">姓名</li>
            <li class="list_item">性别</li>
            <li class="list_item">年龄</li>
            <li class="list_item">手机号</li>
          </ul>
          <div class="list_wrap">
            <ul class="list" v-if="memberList.length > 0">
              <li class="list_item" v-for="(item,index) in memberList" :key="index" @click="selectMember(item)">
                <div class="item_box name">{{item.name}}</div>
                <div class="item_box" v-html="item.gender === 0 ? '女': '男'"></div>
                <div class="item_box">{{item.age}}岁</div>
                <div class="item_box">{{item.mobile}}</div>
              </li>
            </ul>
            <div class="no_data" v-if="memberList.length === 0">暂无就诊人~</div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="每次用量" :visible.sync="fillShow" :center='true' :modal-append-to-body="false" width="500px" @close="closeAfter" class="filldialog">
      <el-form :model="fillInfo" :inline="true" label-width="100px" size="small" :rules="fillrules" ref="fillFrom" class="fillFrom">
        <el-form-item label="数量" prop="num">
          <el-input v-model.trim="fillInfo.num" placeholder="请输入数量"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit">
          <el-input v-model.trim="fillInfo.unit" placeholder="请输入单位" maxlength="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="button" @click="fillShow = false">取 消</el-button>
        <el-button type="success" @click="fillQuery">确 定</el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
// import ajax from '@/utils/ajax';
// import $ from 'jquery';
import docajax from '@/utils/doctorApiRequest';
import { editMember, getMember } from '@/api/editMember';
import { getLoginID } from '@/utils/auth';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      patientForm: {
        username: '',
        gender: '1',
        age: '',
        tel: '',
        diagnosis: '', // 主诉
        jiuzhenType: '1',
        zhenduan: [
          { value: '' }
        ],
        docPrescriptionDetails: [
          {
            productId: '', // 商品id
            medicines: '', // 药品名称
            unit_price: '', // 药品单价
            dose: '', // 数量
            unit: '', // 单位
            usage_code: '', // 用法code
            m_usage: '', // 用法名称
            goods_norms: '', // 商品规格,
            goods_orgin: '', // 商品产地
            MedPerDos: '', // 用量
            MedPerDosUnit: '', // 用量单位
            MedPerDayCode: '', // 频次code
            MedPerDay: '', // 频次名称
          }
        ],
      },
      rulesPatient: {
        username: [{ required: true, message: '请输入就诊人姓名', trigger: 'change' }],
        gender: [{ required: true, message: '请选择就诊人性别', trigger: 'change' }],
        jiuzhenType: [{ required: true, message: '请选择就诊类型', trigger: 'change' }],
        age: [{ required: true, validator: this.validAge, trigger: 'change' }],
        tel: [{ required: true, validator: this.validMobile, trigger: 'change' }],
        diagnosis: [{ required: true, message: '请输入主诉及辨证', trigger: 'change' }],
        zhenduan: [{ required: true, message: '请选择诊断', trigger: 'change' }],
      },
      memberShow: false,
      membername: '', // 搜索就诊人字段
      memberList: [], // 就诊人数据源
      loading: false,
      drugOpitn: [], // 药品数据源
      usageOption: [], // 用法数据源
      frequencyOption: [], // 频次数据源
      zhenduanOption: [], // 诊断数据源
      fillShow: false,
      fillInfo: {
        num: '',
        unit: ''
      },
      fillrules: {
        num: [{ required: true, validator: this.validMoney, trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
      },
      docPrescriptionDetailsIndex: ''
    };
  },
  computed: {
    ...mapGetters([
      'name',
    ]),
  },
  props: {
    item: Object
  },
  methods: {
    // 判断是否有特殊字符
    // isSpeci(keyCode) {
    //   let specialKey = "[`~!#$^&*()=|{}':;',\\[\\].<>/?~！#￥……&*（）——|{}【】‘；：”“'。，、？]‘’";
    //   let realkey = String.fromCharCode(keyCode);
    //   return (specialKey.indexOf(realkey) >= 0);

    // },
    // 用量数量正则
    isvalidmoney(str) {
      const reg = /^\d{1,3}(?:\.\d{1,2})?$/;
      return reg.test(str);
    },
    validMoney(rule, value, callback) {
      console.log(value);
      if (!value) {
        callback(new Error('请输入数量'));
      } else if (!this.isvalidmoney(value)) {
        callback(new Error('数量只能是0-999的数字且最多两位小数'));
      }
      else if (value > 999) {
        callback(new Error('数量只能是0-999的数字且最多两位小数'));
      }
      else if (value <= 0) {
        callback(new Error('请输入正确数量'));
      }
      else {
        callback();
      }
    },
    // 正整数正则
    isvalidNumber(str) {
      const reg = /^[1-9]\d*$/;
      return reg.test(str);
    },
    validNumber(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入数量'));
      } else if (!this.isvalidNumber(value)) {
        callback(new Error('请输入正确的数量'));
      } else {
        callback();
      }
    },
    // 选择药品
    drugMethod(name) {
      // let a = '    哈哈哈';
      // a = $.trim(a);
      this.getDrugList(this.trim(name));
    },
    trim(s) {
      return s.replace(/(^\s*)|(\s*$)/g, '');
    },
    getDrugList(name) {
      docajax.get(`/api/ydsf/GetStoreProductInfoList?product_name=${name}&creator=${getLoginID()}`).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          this.drugOpitn = res.data.data;
        }
      });
    },
    selectdrug(item, index) {
      console.log(index);
      this.patientForm.docPrescriptionDetails[index].productId = item.product_id; // id
      this.patientForm.docPrescriptionDetails[index].unit_price = item.price; // 单价
      this.patientForm.docPrescriptionDetails[index].unit = item.unit; // 单位
      this.patientForm.docPrescriptionDetails[index].goods_norms = item.norms; // 规格
      this.patientForm.docPrescriptionDetails[index].goods_orgin = item.producing; // 产地
      this.patientForm.docPrescriptionDetails[index].medicines = item.product_name; // 名称
      // console.log(this.patientForm.docPrescriptionDetails[0]);
    },
    // 获取用法和频次
    getUseMedicineType(type) {
      docajax.get(`/api/order/getUseMedicineType/${type}`).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          if (type === 1) {
            this.usageOption = res.data.data;
          } else {
            this.frequencyOption = res.data.data;
          }
        }
      });
    },
    // 选择用法
    selectusage(item, index) {
      // console.log(item, index);
      // console.log(this.patientForm.docPrescriptionDetails[0].m_usage);
      this.patientForm.docPrescriptionDetails[index].m_usage = this.usageOption.find((x) => {
        return x.code === item;
      }).name;
      // console.log(a);
    },
    // 选择频次
    selectfrequency(item, index) {
      // console.log(item);
      this.patientForm.docPrescriptionDetails[index].MedPerDay = this.frequencyOption.find((x) => {
        return x.code === item;
      }).name;
    },
    validAge(rule, value, callback) {
      const reg = /^((1[0-9])|[1-9])?\d$/;
      if (value === '') {
        callback(new Error('请输入就诊人年龄'));
      } else if (!reg.test(value)) {
        callback(new Error('年龄只能为0-199的数字'));
      } else {
        callback();
      }
    },
    // 填写用量
    fillBtn(index, dos, unit) {
      this.fillShow = true;
      this.docPrescriptionDetailsIndex = index;
      this.fillInfo.num = dos ? Number(dos) : dos;
      this.fillInfo.unit = unit;
    },
    fillQuery() {
      let _self = this;
      this.$refs['fillFrom'].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.fillShow = false;
          _self.patientForm.docPrescriptionDetails[_self.docPrescriptionDetailsIndex].MedPerDos = _self.fillInfo.num;
          _self.patientForm.docPrescriptionDetails[_self.docPrescriptionDetailsIndex].MedPerDosUnit = _self.fillInfo.unit;
          console.log(_self.fillInfo);
        } else {
          return false;
        }
      });
    },
    closeAfter() {
      this.$refs['fillFrom'].resetFields();
    },
    // 验证手机号
    validMobile(rule, value, callback) {
      let mobileReg = /^1[3-9][0-9]\d{8}$/;
      if (value === '') {
        callback(new Error('请输入手机号码'));
      } else if (!mobileReg.test(value)) {
        callback(new Error('请输入有效的11位手机号码'));
      }
      else {
        callback();
      }
    },
    // 添加诊断
    addZhenduan() {
      this.patientForm.zhenduan.push({
        value: ''
      });
      this.zhenduanOption = [];
    },
    // 删除诊断
    deleteZhenduan(index) {
      if (this.patientForm.zhenduan.length === 1) {
        this.$message.warning('最后一个不能删除');
      } else {
        this.$confirm('确认删除该诊断?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.patientForm.zhenduan.splice(index, 1);
        });
      }
    },
    // 添加商品
    addDrug() {
      this.patientForm.docPrescriptionDetails.push({
        productId: '', // 商品id
        medicines: '', // 药品名称
        unit_price: '', // 药品单价
        dose: '', // 数量
        unit: '', // 单位
        usage_code: '', // 用法code
        m_usage: '', // 用法名称
        goods_norms: '', // 商品规格,
        goods_orgin: '', // 商品产地
        MedPerDos: '', // 用量
        MedPerDosUnit: '', // 用量单位
        MedPerDayCode: '', // 频次code
        MedPerDay: '', // 频次名称
      });
    },
    // 删除商品
    deleteDrug(index) {
      if (this.patientForm.docPrescriptionDetails.length === 1) {
        this.$message.warning('最后一个不能删除');
      } else {
        this.$confirm('确认删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.patientForm.docPrescriptionDetails.splice(index, 1);
        });
      }
    },
    // 选择就诊人
    selectMember(item) {
      this.getMemberLately(item);
    },
    // 获取就诊人最近开的处方
    getMemberLately(item) {
      let store_id = getLoginID();
      let patient_id = item.memberid;
      // let age = item.age;
      // let sex = item.gender;
      // let tel = item.mobile;
      console.log(item);
      docajax.get(`/api/ydsf/getuserlastprescription/${store_id}/${patient_id}`).then(res => {
        if (res.status === 200 && res.data.code === 0 && res.data.data) {
          console.log(res.data.data);
          let data = res.data.data;
          this.memberShow = false;
          if (data.docprescriptiondetails && data.docprescriptions) {
            this.patientForm.username = item.name;
            this.patientForm.gender = item.gender.toString();
            this.patientForm.age = item.age;
            this.patientForm.tel = item.mobile;
            this.patientForm.memberid = item.memberid;
            this.patientForm.diagnosis = data.docprescriptions.diagnosis;
            this.patientForm.zhenduan = data.docprescriptions.zhenduan.split(',').map(res => { return { value: res } });
            this.patientForm.docPrescriptionDetails = data.docprescriptiondetails.map(res => {
              return {
                productId: res.productId, // 商品id
                medicines: res.medicines, // 药品名称
                unit_price: res.unit_price, // 药品单价
                dose: res.dose, // 数量
                unit: res.unit, // 单位
                usage_code: res.usage_code, // 用法code
                m_usage: res.m_usage, // 用法名称
                goods_norms: res.goods_norms, // 商品规格,
                goods_orgin: res.goods_orgin, // 商品产地
                MedPerDos: res.medperdos, // 用量
                MedPerDosUnit: res.medperdosunit, // 用量单位
                MedPerDayCode: res.medperdaycode, // 频次code
                MedPerDay: res.medperday, // 频次名称
              };
            });
          } else {
            this.patientForm.username = item.name;
            this.patientForm.gender = item.gender.toString();
            this.patientForm.age = item.age;
            this.patientForm.tel = item.mobile;
            this.patientForm.memberid = item.memberid;
            this.patientForm.diagnosis = ''; // 主诉=
            this.patientForm.zhenduan = [
              { value: '' }
            ];
            this.patientForm.docPrescriptionDetails = [
              {
                productId: '', // 商品id
                medicines: '', // 药品名称
                unit_price: '', // 药品单价
                dose: '', // 数量
                unit: '', // 单位
                usage_code: '', // 用法code
                m_usage: '', // 用法名称
                goods_norms: '', // 商品规格,
                goods_orgin: '', // 商品产地
                MedPerDos: '', // 用量
                MedPerDosUnit: '', // 用量单位
                MedPerDayCode: '', // 频次code
                MedPerDay: '', // 频次名称
              }
            ];
          }
          // this.$message.success('提交成功');
          // this.$refs['infoForm'].resetFields();
        }
      });
    },
    startRogation() {
      let _self = this;
      this.$refs['infoForm'].validate((valid) => {
        if (valid) {
          if (_self.patientForm.jiuzhenType === '1') {
            this.loading = true;
            if (localStorage.getItem('squareinfo')) {
              localStorage.removeItem('squareinfo');
            }
            let data = {
              name: _self.patientForm.username,
              gender: _self.patientForm.gender,
              age: _self.patientForm.age,
              mobile: _self.patientForm.tel,
              memberid: _self.patientForm.memberid,
              description: '',
              is_default: 0,
            };
            editMember(data).then(res => {
              if (res) {
                console.log(res);
                let info = {
                  store_id: getLoginID(),
                  store_name: _self.name,
                  patient_id: res.data.memberid,
                  docPrescriptions: {
                    username: _self.patientForm.username,
                    gender: _self.patientForm.gender,
                    age: _self.patientForm.age,
                    tel: _self.patientForm.tel,
                    diagnosis: _self.patientForm.diagnosis,
                    zhenduan: _self.patientForm.zhenduan.map(res => { return res.value }).join(','),
                  },
                  docPrescriptionDetails: _self.patientForm.docPrescriptionDetails
                };
                console.log(info);
                this.sumbit(info);
              } else {
                this.loading = false;
              }
            });
          } else {
            this.$alert('只有复诊才能提交处方', '', {
              showClose: false,
              confirmButtonText: '确定',
              confirmButtonClass: 'cinfirmBtn',
              customClass: 'prompt'
            });
          }
        } else {
          return false;
        }
      });
    },
    sumbit(info) {
      docajax.post('/api/ydsf/submitprescription', info).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0) {
          console.log(res.data.data);
          this.$message.success('提交成功');
          this.patientForm = {
            username: '',
            gender: '1',
            age: '',
            tel: '',
            diagnosis: '', // 主诉
            jiuzhenType: '1',
            zhenduan: [
              { value: '' }
            ],
            docPrescriptionDetails: [
              {
                productId: '', // 商品id
                medicines: '', // 药品名称
                unit_price: '', // 药品单价
                dose: '', // 数量
                unit: '', // 单位
                usage_code: '', // 用法code
                m_usage: '', // 用法名称
                goods_norms: '', // 商品规格,
                goods_orgin: '', // 商品产地
                MedPerDos: '', // 用量
                MedPerDosUnit: '', // 用量单位
                MedPerDayCode: '', // 频次code
                MedPerDay: '', // 频次名称
              }
            ],
          };
          this.loading = false;
          this.$refs['infoForm'].resetFields();
        } else {
          this.loading = false;
        }
      });
    },
    save() {
      let _self = this;
      let info = _self.patientForm;
      info = JSON.stringify(info);
      localStorage.setItem('squareinfo', info);
      this.$message.success('保存成功');
    },
    seach() {
      this.getList();
    },
    selectList() {
      this.memberShow = true;
      this.getList();
    },
    memberClose() {
      this.membername = '';
    },
    getList() {
      let data = {
        name: this.membername,
        pageIndex: 1,
        pageSize: 550
      };
      getMember(data).then(res => {
        console.log(res);
        this.memberList = res.data;
      });
    },
    // 选择诊断
    // selectzhendaun(item) {
    //   console.log(item);
    // },
    zhendaunMethod(str) {
      console.log(str);
      if (this.trim(str)) {
        this.getZhenduanList(this.trim(str));
      }
    },
    getZhenduanList(name) {
      if (name) {
        docajax.get('/api/ydsf/zhenduanlist?zhenduanName=' + name).then(res => {
          console.log(res);
          if (res.status === 200 && res.data.code === 0) {
            this.zhenduanOption = res.data.data;
            for (let i = 0; i < this.patientForm.zhenduan.length; i++) {
              for (let j = 0; j < this.zhenduanOption.length; j++) {
                if (this.patientForm.zhenduan[i].value === this.zhenduanOption[j].zhenduan_name) {
                  this.zhenduanOption[j].disable = true;
                }
              }
            }
          }
        });
      }
    }
  },
  created() {
    this.getUseMedicineType(1);
    this.getUseMedicineType(2);
    let info = localStorage.getItem('squareinfo');
    console.log(info);
    if (info) {
      info = JSON.parse(info);
      this.patientForm = info;
    }
    if (this.item) {
      console.log(1);
      this.patientForm.username = this.item.docprescriptions.username;
      this.patientForm.gender = this.item.docprescriptions.gender.toString();
      this.patientForm.age = this.item.docprescriptions.age;
      this.patientForm.tel = this.item.docprescriptions.tel;
      this.patientForm.memberid = this.item.patient_id;
      this.patientForm.diagnosis = this.item.docprescriptions.diagnosis;
      this.patientForm.zhenduan = this.item.docprescriptions.zhenduan.split(',').map(res => { return { value: res } });
      this.patientForm.docPrescriptionDetails = this.item.docprescriptiondetails.map(res => {
        return {
          productId: res.productId, // 商品id
          medicines: res.medicines, // 药品名称
          unit_price: res.unit_price, // 药品单价
          dose: res.dose, // 数量
          unit: res.unit, // 单位
          usage_code: res.usage_code, // 用法code
          m_usage: res.m_usage, // 用法名称
          goods_norms: res.goods_norms, // 商品规格,
          goods_orgin: res.goods_orgin, // 商品产地
          MedPerDos: res.medperdos, // 用量
          MedPerDosUnit: res.medperdosunit, // 用量单位
          MedPerDayCode: res.medperdaycode, // 频次code
          MedPerDay: res.medperday, // 频次名称
        };
      });
    }
    console.log(this.patientForm);
  }
};
</script>

<style lang="less" scoped>
@import '../../../../styles/common.less';
.filldialog{
  .fillFrom{
    /deep/.el-input{
      width: 250px;
    }
  }
}
.invigorationRecipeList{
  // width: 1400px;
  background: #fff;
  margin: 0 auto;
  font-size: 14px;
  .invigorationRecipeList_main{
    padding-left: 40px;
    padding-top: 60px;
    padding-right: 40px;
  }
  .info_form_rule{
    /deep/.el-form-item.is-error{
       .el-input__inner{
         border-color: #dcdfe6;
       }
        .el-textarea__inner{
          border-color: #dcdfe6;
        }
    }
    /deep/.el-input{
      width: 320px;
    }
    /deep/.el-textarea{
      width: 650px;
      height: 112px;
      textarea{
        height: 100% !important;
      }
    }
    .sexRadio{
      /deep/.el-radio__input.is-checked{
        .el-radio__inner{
          background: #fff;
          border-color: @green-color;
          &::after{
            background: @green-color;
            width: 8px;
            height: 8px;
          }
        }
        +.el-radio__label{
          color: #606266;
        }
      }
    }
    .box{
      margin-bottom: 60px;
      .box_title{
        font-size: 14px;
        font-weight: 900;
      }
      .nvigtitle{
        height: 32px;
        width: 400px;
        line-height: 32px;
        .nvigtitle_right{
          float: right;
          color: @green-color;
          cursor: pointer;
          display: flex;
          align-items: center;
          .right_icon{
            display: inline-block;
            width: 18px;
            height: 15px;
            background: url('../img/icon_list.png') no-repeat;
            background-size: 100% 100%;
          }
        }
      }
      .zhenduan{
        width: 650px;
        .zhenduan_box{
          display: flex;
          .option_box{
            width: 100px;
            border-right: @line-border;
            text-align: center;
            line-height: 64px;
            .zhenduan_close{
              font-size: 12px;
                color: @white-color;
                cursor: pointer;
                background-color: @green-color;
                border-radius: 50%;
                padding: 4px;
                box-sizing: border-box;
                display: inline-block;
            }
          }
          .desc_box{
            flex: 1;
            text-align: center;
          }
        }
        .zhenduan_head{
          height: 40px;
          background: #f6f8f8;
          border: @line-border;
        }
        .zhenduan_body{
          border: @line-border;
          border-top: none;
          .desc_box{
            padding-top: 18px;
            /deep/.el-form-item {
              .el-form-item__content{
                width: 420px;
                margin: 0 auto;
                .el-input {
                  width: 420px;
                }
              }
            }
          }
        }
        .zhenduan-foot{
          margin-top: 10px;
          border: 1px dashed #ddd;
          height: 32px;
          cursor: pointer;
          .foot_add{
            line-height: 32px;
            color: @green-color;
            margin: 0 auto;
          }
        }
      }
      .add_drug{
        width: 100px;
        height: 32px;
        background-color: @green-color;
        border-color: @green-color;
        padding: 0;
        margin-top: 40px;
      }
      .dryg_box{
        // display: flex;
        margin-top: 40px;
        .t_head{
          height: 40px;
          background-color: #f6f8f8;
          border: @line-border;
          width: 1000px;
          .t_head_li{
            display: flex;
            flex-wrap: nowrap;
            // justify-content: space-between;
          }
          .t_head_item{
            display: flex;
            justify-content: space-around;
            flex-wrap: nowrap;
            width: 180px;
            text-align: center;
            line-height: 40px;
            display: inline-block;
            border-right: @line-border;
            box-sizing: border-box;
            &:nth-last-child(1) {
              border-right: none;
            }
          }
          .close{
            width: 38px;
            padding: 0;
          }
          .name{
            width: 240px;
          }
        }
        .dryg_box_list{
          border: @line-border;
          width: 100%;
          border-top: none;
          width: 1000px;
          li{
            display: flex;
            flex-wrap: nowrap;
            // justify-content: space-between;
            .list_td_item{
              width: 180px;
              // max-width: 240px;
              border-right: @line-border;
              display: inline-block;
              height: 64px;
              padding: 0 20px;
              box-sizing: border-box;
              &:nth-last-child(1) {
                border-right: none;
              }
            }
            .close{
              width: 38px;
              padding: 0;
              text-align: center;
              line-height: 64px;
              .dryg_close{
                font-size: 12px;
                color: @white-color;
                cursor: pointer;
                background-color: @green-color;
                border-radius: 50%;
                padding: 4px;
                box-sizing: border-box;
                display: inline-block;
              }
            }
            .name{
              width: 240px;
              /deep/.el-input{
                width: 200px;
              }
            }
          }
          /deep/.el-form-item{
            // margin-right: 15px;
            margin: 16px auto;
            .el-form-item__content{
              display: flex;
              justify-content: space-around;
              line-height: 32px;
            }
            .el-button{
              height: 32px;
              width: 140px;
              padding: 0;
              color: #c0c4cc;
              background: #fff;
              border-color: #dcdfe6;
            }
            .textBtn{
              color: #606266;
            }
            .el-input{
              width: 140px;
            }
          }
        }
        .dryg_box_foot{
          width: 1000px;
          margin-top: 10px;
          border: 1px dashed #ddd;
          height: 32px;
          cursor: pointer;
          text-align: center;
          .foot_add{
            line-height: 32px;
            color: @green-color;
            margin: 0 auto;
          }
        }
      }
    }
  }
  .btn{
    width: 1000px;
    padding-bottom: 22px;
    text-align: center;
    /deep/.el-button{
      background: @green-color;
      border-color: @green-color;
      width: 140px;
    }
  }
  .member_list{
    /deep/.el-input{
      width: 360px;
    }
    /deep/.el-button{
      background: @green-color;
      border-color: @green-color;
    }
    .list_header{
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #dcdfe6;
      .list_item{
        width: 90px;
        height: 50px;
        text-align: center;
        line-height: 50px;
        &:nth-last-child(1){
          width: 140px;
        }
      }
    }
    .list_wrap{
      width: 430px;
      overflow: hidden;
      .list{
        max-height: 600px;
        min-height: 300px;
        width: 450px;
        overflow-y: scroll;
        &::-webkit-scrollbar{
          display: none
        }
        .list_item{
          height: 50px;
          line-height: 50px;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          .item_box{
            width: 90px;
            text-align: center;
            &:nth-last-child(1){
              width: 140px;
            }
          }
          .name{
            .hidden-vertical(1);
          }
        }
      }
      .no_data{
        height: 300px;
        text-align: center;
        padding-top: 130px;
      }
    }
  }
}
</style>
