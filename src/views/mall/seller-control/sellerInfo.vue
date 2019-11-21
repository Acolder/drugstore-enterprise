<template>
  <div class="sellerInfo">
    <div class="info_box">
      <el-form :model="editData" :rules="rules" ref="editValidateForm" label-width="130px" size="small">
        <div class="info">
          <h2 class="item-header">商户信息</h2>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商户名称:" prop="sellerName">
                <el-input v-model="editData.sellerName" placeholder="请输入商户名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="商户类型:" prop="businessType">
                <el-select v-model="editData.businessType" size='small' placeholder="请选择商户类型">
                  <el-option
                    v-for="item in sellerCategory"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属品牌:" prop="brand">
                <el-input v-model="editData.brand" placeholder="请输入所属品牌"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="region">
              <el-form-item label="所属区域:" prop="addressDistrict">
                <el-select class="el-width1" v-model="editData.addressProvince" size='small' placeholder="省份">
                  <el-option
                    v-for="item in addressProvinceArray"
                    :key="item.provinceId"
                    :label="item.province"
                    :value="item.provinceId">
                  </el-option>
                </el-select>
                <el-select class="el-width1" v-model="editData.addressCity" size='small' placeholder="城市" @change="cityChange">
                  <el-option
                    v-for="item in addressCityArray"
                    :key="item.cityId"
                    :label="item.city"
                    :value="item.cityId">
                  </el-option>
                </el-select>
                <el-select class="el-width1" v-model="editData.addressDistrict" size='small' placeholder="区县">
                  <el-option
                    v-for="item in addressDistrictArray"
                    :key="item.areaId"
                    :label="item.area"
                    :value="item.areaId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所在地图位置:" prop="latitude">
                <div class="position" @click="seeMaP">
                  <span v-if="!position" class="ple">请选择地图位置</span>
                  <span v-if="position">{{position}}</span>
                  <i class="el-icon-location"></i>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址:" prop="detailAddress">
                <el-input v-model="editData.detailAddress" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机号:" prop="mobile">
                <el-input v-model="editData.mobile" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="info">
          <h2 class="item-header">账户信息</h2>
          <el-row>
            <el-col :span="12">
              <el-form-item label="开户人:" prop="accountHolder">
                <el-input v-model="editData.accountHolder" placeholder="请输入开户人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="开户行:" prop="openingBank">
                <el-select v-model="editData.openingBank" size='small'>
                  <el-option
                    v-for="item in bankList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="银行卡号:" prop="bankCardNumber">
                <el-input v-model="editData.bankCardNumber" placeholder="请输入银行卡号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="info">
          <h2 class="item-header">其他信息</h2>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商户法人:" prop="legalPerson">
                <el-input v-model="editData.legalPerson" placeholder="请输入商户法人"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:" prop="idCard">
                <el-input v-model="editData.idCard" placeholder="请输入身份证号"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系手机:" prop="contact">
                <el-input v-model="editData.contact" placeholder="请输入联系手机"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="info">
          <h2 class="item-header">附件</h2>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营业执照:" prop="businessLicense">
                <uploadSingleImg :imgUrl="editData.businessLicense" :fileName="'businessLicense'" @uploadSuccess="uploadbusinessLicense" @removeImg="removebusinessLicense"></uploadSingleImg>
                <el-input class="left" type="hidden" v-model="editData.businessLicense"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="药品经营许可证:" prop="drugLicenses">
                <uploadSingleImg :imgUrl="editData.drugLicenses" :fileName="'drugLicenses'" @uploadSuccess="uploaddrugLicenses" @removeImg="removedrugLicenses"></uploadSingleImg>
                <el-input class="left" type="hidden" v-model="editData.drugLicenses"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人身份证照片:" prop="idCardPhoto">
                <uploadSingleImg :imgUrl="editData.idCardPhoto" :fileName="'idCardPhoto'" @uploadSuccess="uploadidCardPhoto" @removeImg="removeidCardPhoto"></uploadSingleImg>
                <el-input class="left" type="hidden" v-model="editData.idCardPhoto"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="button-box">
          <el-button type="primary" @click="submit">提交审核</el-button>
        </div>
      </el-form>
    </div>
    <!-- 地图弹窗 -->
    <div :class="dialogVisible ? 'map_box' : 'none'">
      <div class="box_wrap">
        <!-- <el-input id="suggestId" size="20" placeholder="请输入地址"></el-input>
        <div id="searchResultPanel" style="border:1px solid #C0C0C0;width:150px;height:auto; display:none;"></div> -->
        <div class="baidumap" id="allmap"></div>
        <div class="map-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="query">确 定</el-button>
        </div>
        <i class="el-icon-close close" @click="close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import javaAjax from '@/utils/javaApiRequest';
import uploadImg from '@/components/upload/uploadImg';
import BMap from 'BMap';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      dialogVisible: false,
      editData: {
        sellerName: '', // 商户名称
        businessType: '', // 商户类型
        brand: '', // 所属品牌
        addressProvince: '', // 所属省份
        addressCity: '', // 城市
        addressDistrict: '', // 区县
        latitude: '', // 纬度
        longitude: '', // 经度
        detailAddress: '', // 详细地址
        mobile: '', // 手机号
        accountHolder: '', // 开户人
        openingBank: '', // 开户行
        bankCardNumber: '', // 银行卡号
        legalPerson: '', // 商户法人
        idCard: '', // 法人身份证号
        contact: '', // 法人联系方式
        businessLicense: '', // 营业执照
        drugLicenses: '', // 经营许可证
        idCardPhoto: '', // 法人身份证照片
      },
      position: '',
      address: '',
      addressProvinceArray: [],
      addressCityArray: [],
      addressDistrictArray: [],
      sellerCategory: [
        { value: '1', label: '商城' },
        { value: '2', label: '药店' },
        { value: '3', label: '药柜' },
        // { value: '4', label: '跨境电商' },
        // { value: '', label: '全部' }
      ],
      bankList: [
        { value: '1', label: '中国工商银行' },
        { value: '2', label: '中国农业银行' },
        { value: '3', label: '中国建设银行' },
        { value: '4', label: '中国银行' },
        { value: '5', label: '交通银行' },
        { value: '6', label: '中信银行' },
        { value: '7', label: '中国光大银行' },
        { value: '8', label: '华夏银行' },
        { value: '9', label: '中国明生银行' },
        { value: '10', label: '兴业银行' },
        { value: '11', label: '招商银行' },
        { value: '12', label: '平安银行' },
        { value: '13', label: '上海浦东发展银行' },
        { value: '14', label: '恒丰银行' },
        { value: '15', label: '浙商银行' },
        { value: '16', label: '渤海银行' },
        { value: '17', label: '中国邮政储蓄银行' },
      ],
      rules: {
        sellerName: [{ required: true, message: '请输入商户名称', trigger: 'blur' }],
        businessType: [{ required: true, message: '请选择商户类型', trigger: 'blur' }],
        // brand: [{ required: true, message: '请输入所属品牌', trigger: 'blur' }],
        addressDistrict: [{ required: true, message: '请选择完整的所属区域', trigger: 'change' }],
        latitude: [{ required: true, message: '请选择地图所在位置', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        mobile: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
        // accountHolder: [{ required: true, message: '请输入开户人', trigger: 'blur' }],
        // openingBank: [{ required: true, message: '请选择开户行', trigger: 'blur' }],
        bankCardNumber: [{ required: false, validator: this.validBanck, trigger: 'blur' }],
        // legalPerson: [{ required: true, message: '请输入商户法人', trigger: 'blur' }],
        idCard: [{ required: false, validator: this.validIDcard, trigger: 'blur' }],
        contact: [{ required: false, validator: this.validNotphone, trigger: 'blur' }],
        // businessLicense: [{ required: true, message: '请选择营业执照', trigger: 'blur' }],
        // drugLicenses: [{ required: true, message: '请选择经营许可证', trigger: 'blur' }],
        // idCardPhoto: [{ required: true, message: '请选择法人身份证照', trigger: 'blur' }],
      },
      map: '',
    };
  },
  watch: {
    'editData.addressProvince': function() {
      this.addressProvince = this.editData.addressProvince;
      this.getCitiesByProvincial(); // 获取市
      this.editData.addressDistrict = '';
      this.editData.addressCity = '';
    },
    'editData.addressCity': function() {
      this.addressCity = this.editData.addressCity;
      this.getAreasByCity(); // 获取区
      this.editData.addressDistrict = '';
    },
  },
  props: {
    isAdd: Boolean,
    id: String
  },
  computed: {
    ...mapGetters([
      'visitedViews',
    ]),
  },
  components: {
    'uploadSingleImg': uploadImg
  },
  methods: {
    seeMaP() {
      this.dialogVisible = true;
      this.ready();
    },
    close() {
      this.dialogVisible = false;
    },
    query() {
      this.dialogVisible = false;
      this.position = this.address;
    },
    cityChange() {
      // if (this.isAdd) {
      this.map.centerAndZoom(this.addressCityArray.find(x => x.cityId === this.editData.addressCity).city, 16);
      // }
    },
    // 百度地图
    ready() {
      let _self = this;
      // if (_self.editData.longitude !== '') {
      //   let new_point = new BMap.Point(this.editData.longitude, this.editData.latitude);
      //   _self.map.centerAndZoom(new_point, 16);
      //   let point = new BMap.Marker(new_point); // 创建坐标点
      //   _self.map.addOverlay(point);      // 将标注添加到地图中
      // }

      this.map.addEventListener('click', showInfo);
      function showInfo(e) {
        _self.editData.latitude = e.point.lat;
        _self.editData.longitude = e.point.lng;
        _self.address = '经度：' + e.point.lng + ',纬度：' + e.point.lat;
        _self.map.clearOverlays();
        _self.map.addOverlay(new BMap.Marker(e.point));
        _self.map.panTo(new BMap.Point(e.point.lng, e.point.lat));
      }
      // function G(id) {
      //   return document.getElementById(id);
      // }
      // let map = new BMap.Map('allmap');
      // map.enableScrollWheelZoom(true);      // 开启鼠标滚轮缩放
      // let lonat = { lng: _self.editData.longitude, lat: _self.editData.latitude };
      // let point = new BMap.Marker(lonat); // 创建坐标点
      // map.panTo(new BMap.Point(lonat.lng, lonat.lat));
      // map.centerAndZoom('深圳', 14);
      // let pointTOO = new BMap.Point(lonat.lng, lonat.lat);
      // if (!_self.editData.longitude) {
      //   // map.centerAndZoom('深圳', 14);  // 初始化地图,设置城市和地图级别。
      //   map.panTo(new BMap.Point(lonat.lng, lonat.lat));
      // } else {
      //   map.centerAndZoom('深圳', 14);
      // _self.map.panTo(new BMap.Point(lonat.lng, lonat.lat));
      // }

      // let new_point = new BMap.Point(lonat.lng, lonat.lat);
      // let marker = new BMap.Marker(new_point);  // 创建标注
      // map.addOverlay(point);
      // _self.map.panTo(new BMap.Point(lonat.lng, lonat.lat));
      // let ac = new BMap.Autocomplete(       // 建立一个自动完成的对象
      //   {
      //     'input': 'suggestId',
      //     'location': map
      //   });
      // ac.addEventListener('onhighlight', function(e) {  // 鼠标放在下拉列表上的事件
      //   let str = '';
      //   let _value = e.fromitem.value;
      //   let value = '';
      //   if (e.fromitem.index > -1) {
      //     value = _value.province + _value.city + _value.district + _value.street + _value.business;
      //   }
      //   str = 'FromItem<br />index = ' + e.fromitem.index + '<br />value = ' + value;
      //   value = '';
      //   if (e.toitem.index > -1) {
      //     _value = e.toitem.value;
      //     value = _value.province + _value.city + _value.district + _value.street + _value.business;
      //   }
      //   str += '<br />ToItem<br />index = ' + e.toitem.index + '<br />value = ' + value;
      //   G('searchResultPanel').innerHTML = str;
      // });
      // let myValue;
      // ac.addEventListener('onconfirm', function(e) {    // 鼠标点击下拉列表后的事件
      //   let _value = e.item.value;
      //   myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      //   G('searchResultPanel').innerHTML = 'onconfirm<br />index = ' + e.item.index + '<br />myValue = ' + myValue;
      //   setPlace(e);
      // });
      // function setPlace(e) {
      //   map.clearOverlays();    // 清除地图上所有覆盖物
      //   function myFun(e) {
      //     // console.log(e.Br[0].address);
      //     // _self.editData.latitude = e.Br[0].point.lat;
      //     // _self.editData.longitude = e.Br[0].point.lng;
      //     // _self.position = e.Br[0].address;
      //     // console.log('当前位置纬度：' + _self.ruleForm.latitude, '当前位置经度：' + _self.ruleForm.longitude);
      //     let pp = local.getResults().getPoi(0).point;    // 获取第一个智能搜索的结果
      //     console.log(pp);
      //     _self.editData.latitude = pp.lat;
      //     _self.editData.longitude = pp.lng;
      //     _self.address = local.ga.sd;
      //     map.centerAndZoom(pp, 18);
      //     map.addOverlay(new BMap.Marker(pp));    // 添加标注
      //   }
      //   let local = new BMap.LocalSearch(map, { // 智能搜索
      //     onSearchComplete: myFun
      //   });
      //   local.search(myValue);
      // }
      //
    },
    // 手机号验证
    isvalidPhone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    validPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入电话号码'));
      } else if (!this.isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    },
    // 银行卡验证
    isvalidBanck(str) {
      const reg = /^\d{16,19}$/;
      return reg.test(str);
    },
    validBanck(rule, value, callback) {
      if (value !== '') {
        if (!this.isvalidBanck(value)) {
          callback(new Error('请输入正确的银行卡号'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 非必填手机号验证
    isvalidNotphone(str) {
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    },
    validNotphone(rule, value, callback) {
      if (value !== '') {
        if (!this.isvalidNotphone(value)) {
          callback(new Error('请输入正确的手机号'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 身份证号验证
    isvalidIDcard(str) {
      const reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      const regs = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$/;
      return (reg.test(str) || regs.test(str));
    },
    validIDcard(rule, value, callback) {
      if (value !== '') {
        if (!this.isvalidIDcard(value)) {
          callback(new Error('请输入正确的身份证号'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 上传删除营业执照
    uploadbusinessLicense(data) {
      this.editData.businessLicense = data.url;
    },
    removebusinessLicense() {
      this.editData.businessLicense = '';
    },
    // 上传删除经营许可证
    uploaddrugLicenses(data) {
      this.editData.drugLicenses = data.url;
    },
    removedrugLicenses() {
      this.editData.drugLicenses = '';
    },
    // 上传删除身份证照片
    uploadidCardPhoto(data) {
      this.editData.idCardPhoto = data.url;
    },
    removeidCardPhoto() {
      this.editData.idCardPhoto = '';
    },
    getProvincials() {
      // 省
      javaAjax.post(`/mall_manage_seller/address/getProvincials`).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.map(item => {
            return {
              province: item.province,
              provinceId: item.provinceId
            };
          });
          this.addressProvinceArray = newData;
        }
      });
    },
    getCitiesByProvincial() {
      // 市
      javaAjax.post(`/mall_manage_seller/address/getCitiesByProvincial`, { provinceId: this.isAdd ? this.editData.addressProvince : this.addressProvince }).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.cities.map(item => {
            return {
              city: item.city,
              cityId: item.cityId,
              provinceId: item.provinceId,
            };
          });
          // console.log(newData);
          this.addressCityArray = newData;
        }
      });
    },
    getAreasByCity() {
      // 区
      javaAjax.post(`/mall_manage_seller/address/getAreasByCity`, { cityId: this.isAdd ? this.editData.addressCity : this.addressCity }).then((res) => {
        if (res.status === 200 && res.data.resultCode === '0') {
          let newData = res.data.resultData.cities[0].areas.map(item => {
            return {
              area: item.area,
              areaId: item.areaId,
              cityId: item.cityId
            };
          });
          this.addressDistrictArray = newData;
        }
      });
    },
    submit() {
      this.$refs['editValidateForm'].validate((valid) => {
        console.log(valid);
        if (valid) {
          let url = this.isAdd ? `/mall_manage_seller/authority/insertSellerUser` : '/mall_manage_seller/authority/updateSellerUser';
          javaAjax.post(url, this.editData).then((res) => {
            // console.log(res);
            if (res.status === 200 && res.data.resultCode === '0') {
              this.$message.success(res.data.msg);
              let currentName = this.$route.name;
              let currentTab = this.visitedViews.find((x) => x.name === currentName);
              this.$store.dispatch('delVisitedViews', currentTab).then((res) => {
                this.$router.push('/seller-control/toExamine');
              });
            }
          });
        }
      });
    },
    getDetail(item) {
      let param = {
        sellerUserId: this.id
      };
      let _self = this;
      javaAjax.post('/mall_manage_seller/authority/queryBusinessDetails', param).then(res => {
        // console.log(res.data.resultData);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.editData = res.data.resultData.sellerUser;
          // console.log(this.editData);
          this.addressProvince = res.data.resultData.provincialId;
          this.addressCity = res.data.resultData.cityId;
          this.editData.addressProvince = res.data.resultData.provincialId;
          this.position = '经度：' + res.data.resultData.sellerUser.longitude + ',纬度：' + res.data.resultData.sellerUser.latitude;
          setTimeout(() => {

            this.editData.addressCity = res.data.resultData.cityId;
            setTimeout(() => {
              this.editData.addressDistrict = res.data.resultData.areaId;
            }, 100);

          }, 100);
          // 获取的药店详情数据在地图上创建点
          let new_point = new BMap.Point(this.editData.longitude, this.editData.latitude);
          _self.map.centerAndZoom(new_point, 16);
          let point = new BMap.Marker(new_point); // 创建坐标点
          _self.map.addOverlay(point);      // 将标注添加到地图中
        }
      });
    },
    // translateCallback(data) {
    //   if (data.status === 0) {
    //     let marker = new BMap.Marker(data.points[0]);
    //     this.map.addOverlay(marker);
    //     let label = new BMap.Label('转换后的百度坐标（正确）', { offset: new BMap.Size(20, -10) });
    //     marker.setLabel(label); // 添加百度label
    //     this.map.setCenter(data.points[0]);
    //   }
    // }

    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    //   } else {
    //     alert('浏览器不支持地理定位。');
    //   }

    // showPosition(r) {
    //   console.log(r);
    // },
    // showError(err) {
    //   console.log(err);
    // }
  },
  mounted() {
    let _self = this;
    _self.map = new BMap.Map('allmap');
    _self.map.enableScrollWheelZoom(true);
    if (this.isAdd) { // 新增的时候获取位置信息创建地图中心点



      // JSON.parse('aaa');
      // let geolocation = new BMap.Geolocation();
      // geolocation.getCurrentPosition(function(r) {
      //   try {
      //     if (this.getStatus() === 0) {
      //       console.log(r);
      //       if (r.point) {
      //         // let new_point = new BMap.Point(r.point.lng, r.point.lat);
      //         // let convertor = new BMap.Convertor();
      //         // let pointArr = [];
      //         // pointArr.push(new_point);
      //         // setTimeout(function() {
      //         //   let new_point = new BMap.Point(r.point.lng, r.point.lat);
      //         //   _self.map.centerAndZoom(new_point, 16);
      //         //   let convertor = new BMap.Convertor();
      //         //   let pointArr = [];
      //         //   pointArr.push(new_point);
      //         //   convertor.translate(pointArr, 1, 5, _self.translateCallback);
      //         // });
      //         let new_point = new BMap.Point(r.point.lng, r.point.lat);
      //         _self.map.centerAndZoom(new_point, 16);
      //         let point = new BMap.Marker(new_point); // 创建坐标点
      //         _self.map.addOverlay(point);      // 将标注添加到地图中
      //         /* eslint-disable */
      //         point.setAnimation(BMAP_ANIMATION_BOUNCE);
      //         let label = new BMap.Label('我在这里哦', { offset: new BMap.Size(20, -10) });
      //         point.setLabel(label);
      //       } else {
      //         this.map.centerAndZoom('深圳', 16);
      //       }
      //     } else {
      //       this.map.centerAndZoom('深圳', 16);
      //     }

      //   }
      //   catch (error) {
      //     console.log(error);
      //   }
      // });
      this.map.centerAndZoom('深圳', 16);
    }
  },
  destroyed() {
    console.log('destroyed');
  },
  created() {
    // 获取省列表
    this.getProvincials();
    if (this.isAdd === false) {
      this.getDetail();
      // this.getCitiesByProvincial();
      // this.getAreasByCity();
    }
  }
};
</script>

<style lang="less" scoped>
.info_box{
  h2{
    height: 50px;
    line-height: 50px;
    padding-left: 15px;
    font-size: 18px;
  }
  .info{
    background: #fff;
    // padding: 20px 0px;
    // background: #cacaca;
    border: 1px solid #dcdfe6;
    margin-bottom: 15px;
    /deep/ .el-row{
      margin-top: 15px;
    }
    /deep/ .el-input__inner{
      width: 400px;
    }
    .position{
      width: 400px;
      height: 32px;
      background: #fff;
      line-height: 32px;
      cursor: pointer;
      padding-left: 15px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      color: #606266;
      .ple{
        color: #ccc;
      }
      i{
        float: right;
        margin-right: 10px;
        margin-top: 8px;
      }
    }
  }
  .region{
    /deep/ .el-input__inner{
      width: 104px;
    }
  }
  .button-box{
    padding-top: 20px;
    text-align: center;
    padding-bottom: 100px;
  }
}
// .baidumap{
//   height: 450px;
//   margin-top: 10px;
// }
// .sellerInfo .none{
//   z-index: -1;
//   opacity: 0;
//   width: 0;
//   height: 0;
//   position: absolute;
// }
// .map_box{
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background:rgba(0,0,0,0.5);
//   z-index: 10;
//   .box_wrap{
//     width: 800px;
//     height: 550px;
//     padding: 30px;
//     background: #fff;
//     position: absolute;
//     top: 0;
//     left: 0;
//     bottom: 0;
//     right: 0;
//     margin: auto;
//     z-index: 11;
//     .close{
//       position: absolute;
//       top: 8px;
//       right: 10px;
//       cursor: pointer;
//     }
//     .map-footer{
//       margin-top: 15px;
//       text-align: center;
//     }
//   }
// }
.sellerInfo .none{
  z-index: -10;
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.baidumap{
  width: 1250px;
  height: 450px;
}
.map_box{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:rgba(0,0,0,0.5);
  z-index: 10;
  .box_wrap{
    width: 1300px;
    height: 550px;
    padding: 30px;
    background: #fff;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: 11;
    .close{
      position: absolute;
      top: 8px;
      right: 10px;
      cursor: pointer;
    }
    .map-footer{
      margin-top: 15px;
      text-align: center;
    }
  }
}
</style>
