<template>
  <div class="seller_info">
    <el-container class="seller_container_wrapper">
      <el-header class="header_wrap" height="60px">
       <layoutHeader></layoutHeader>
      </el-header>
      <el-main class="main_wrap">
        <div class="step">
          <div class="step_item" :class="step >= 1 ? ' step_item_act' : ''">
            <div class="nu">1</div>
            <span class="text">店铺信息</span>
          </div>
          <div class="step_item" :class="step >= 2 ? ' step_item_act' : ''">
            <div class="nu">2</div>
            <span class="text">资质信息</span>
            <div class="line"></div>
          </div>
          <!-- <div class="step_item" :class="step >= 3 ? ' step_item_act' : ''">
            <div class="nu">3</div>
            <div class="text">收款信息</div>
            <div class="line"></div>
          </div> -->
        </div>
        <div class="info_from">
          <el-form :model="infoFormOne" :rules="rulesOne" ref="infoFormOne" label-width="125px" class="info_form_rule"  v-show="step === 1">
            <div class="step_one">
              <el-form-item label="门店名称" prop="sellerName">
                <el-input v-model.trim="infoFormOne.sellerName" placeholder="请输入门店名称" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="sellerUserName">
                <el-input v-model.trim="infoFormOne.sellerUserName" placeholder="请输入联系人" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="联系人电话" prop="contact">
                <el-input v-model.trim="infoFormOne.contact" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="门店电话" prop="mobile">
                <el-input v-model.trim="infoFormOne.mobile" placeholder="请输入门店电话" maxlength="20"></el-input>
              </el-form-item>
              <div class="addressRegion">
                <el-form-item label="门店区域" prop="addressProvince">
                  <el-select v-model="infoFormOne.addressProvince" placeholder="请选择省份">
                    <el-option v-for="(item, index) in provinceOptions" :key="index" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="addressCity" class="region_left">
                  <el-select v-model="infoFormOne.addressCity" placeholder="请选择城市">
                    <el-option v-for="(item, index) in cityOptions" :key="index" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="" prop="addressDistrict" class="region_left">
                  <el-select v-model="infoFormOne.addressDistrict" placeholder="请选择区县">
                    <el-option v-for="(item, index) in areaOptions" :key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="门店地址" prop="detailAddress">
                <el-input v-model.trim="infoFormOne.detailAddress" placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <el-form-item label="门店坐标" prop="latitude">
                <div class="map_warp">
                  <div id="map"></div>
                  <!-- <el-input v-model.trim="infoForm.detailAddress" placeholder="请输入门店详细地址详细地址，越详细定位越精准"></el-input> -->
                  <input type="text" class="map_input" id="suggestId" placeholder="请输入门店详细地址详细地址，越详细定位越精准">
                </div>
              </el-form-item>
              <el-form-item label="门脸照片" prop="frontPhotos">
                <div class="upload">
                  <uploadSingleImg :imgUrl="infoFormOne.frontPhotos" :fileName="'frontPhotos'" @uploadSuccess="uploadfrontPhotos" @removeImg="removefrontPhotos"></uploadSingleImg>
                </div>
              </el-form-item>
              <div class="demo">
                <el-tooltip placement="top"  effect="light">
                  <div slot="content"><img src="./img/ml.png" alt=""></div>
                  <div class="img">
                    <img src="./img/ml.png" alt="">
                    <div class="example">示例</div>
                  </div>
                </el-tooltip>
                <div class="dec">
                  门脸照需拍出完整门匾，门框，需在开门营业状态下完成拍摄（建议正对门店2米处拍摄）。支持JPG、JPEG、PNG格式 大小不超过5M
                </div>
              </div>
              <el-form-item label="门店照片" prop="storePhotos">
                <div class="upload">
                  <uploadSingleImg :imgUrl="infoFormOne.storePhotos" :fileName="'storePhotos'" @uploadSuccess="uploadstorePhotos" @removeImg="removestorePhotos"></uploadSingleImg>
                </div>
              </el-form-item>
              <div class="demo">
                <el-tooltip placement="top"  effect="light">
                  <div slot="content"><img src="./img/md.png" alt=""></div>
                  <div class="img">
                    <img src="./img/md.png" alt="">
                    <div class="example">示例</div>
                  </div>
                </el-tooltip>
                <div class="dec">
                  店内照需真实反映店铺环境（收银台，货架）。支持JPG、JPEG、PNG格式 大小不超过5M
                </div>
              </div>
              <el-form-item label="门店logo" prop="storeLogo">
                <div class="upload">
                  <uploadSingleImg :imgUrl="infoFormOne.storeLogo" :fileName="'storeLogo'" @uploadSuccess="uploadstoreLogo" @removeImg="removestoreLogo"></uploadSingleImg>
                </div>
              </el-form-item>
              <div class="demo">
                <el-tooltip placement="top"  effect="light">
                  <div slot="content"><img src="./img/logo.png" alt=""></div>
                  <div class="img">
                    <img src="./img/logo.png" alt="">
                    <div class="example">示例</div>
                  </div>
                </el-tooltip>
                <div class="dec">
                  上传与店铺气质吻合的logo，能提高用户进店的概率。支持JPG、JPEG、PNG格式 大小不超过500K
                </div>
              </div>
              <div class="btn">
                <el-button @click="save(5)">保存</el-button>
                <el-button @click="onStpeTow">下一步</el-button>
              </div>
            </div>
          </el-form>
          <el-form :model="infoFormTow" :rules="rulesTwo" ref="infoFormTow" label-width="125px" class="info_form_rule"  v-show="step === 2">
            <div class="step_tow">
              <el-form-item label="营业执照" prop="businessLicense">
                <div class="upload">
                  <uploadSingleImg :imgUrl="infoFormTow.businessLicense" :fileName="'businessLicense'" @uploadSuccess="uploadbusinessLicense" @removeImg="removebusinessLicense"></uploadSingleImg>
                </div>
              </el-form-item>
              <div class="demo">
                <el-tooltip placement="top"  effect="light">
                  <div slot="content"><img src="./img/yxzz.png" alt=""></div>
                  <div class="img">
                    <img src="./img/yxzz.png" alt="">
                    <div class="example">示例</div>
                  </div>
                </el-tooltip>
                <div class="dec">
                  <p>1. 需文字清晰、边框完整、露出国徽</p>
                  <p>2. 拍复印件需加盖印章，可用有效特许证件代替。支持JPG、JPEG、PNG格式 大小不超过500K</p>
                </div>
              </div>
              <el-form-item label="营业执照名称" prop="businessLicenseName">
                <el-input v-model.trim="infoFormTow.businessLicenseName" placeholder="请输入营业执照上的名称" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="注册号/统一社会信用代码" prop="registrationNumber" class="rester_nu">
                <el-input type="age" v-model.number="infoFormTow.registrationNumber" placeholder="请输入营业执照上的注册号" autocomplete="off" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="法定代表人" prop="legalPerson">
                <el-input v-model.trim="infoFormTow.legalPerson " placeholder="请输入店铺法定代表人的真实姓名"></el-input>
              </el-form-item>
              <el-form-item label="经营场所" prop="premises">
                <el-input v-model.trim="infoFormTow.premises" placeholder="请输入营业执照上的住所地址"></el-input>
              </el-form-item>
              <div class="addressRegion busiRegion">
                <el-form-item label="营业执照有效期" :prop="validityAbled ? '' : 'start'">
                <el-date-picker :disabled="validityAbled" v-model="infoFormTow.start" type="date" placeholder="开始时间" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions2"></el-date-picker>
                </el-form-item>
                <el-form-item :prop="validityAbled ? '' : 'validity'" class="region_right">
                <el-date-picker :disabled="validityAbled" v-model="infoFormTow.validity" type="date" placeholder="结束时间" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
                <el-checkbox v-model="infoFormTow.longtime">长期有效</el-checkbox>
              </div>
              <el-form-item label="注册/成立日期" prop="recordDate">
                <el-date-picker v-model="infoFormTow.recordDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions2"></el-date-picker>
              </el-form-item>
              <el-form-item label="发证/登记机关" prop="registrationAuthority">
                <el-input v-model.trim="infoFormTow.registrationAuthority" placeholder="请输入执照发证登记机关" maxlength="20"></el-input>
              </el-form-item>
              <el-form-item label="核准日期" prop="approvalDate">
                <el-date-picker v-model="infoFormTow.approvalDate" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" :picker-options="pickerOptions2"></el-date-picker>
              </el-form-item>
              <el-form-item label="法人身份证照片正面" prop="idPhotoPositive" class="rester_nu">
                <div class="upload">
                  <uploadSingleImg :imgUrl="infoFormTow.idPhotoPositive" :fileName="'idPhotoPositive'" @uploadSuccess="uploadidPhotoPositive" @removeImg="removeidPhotoPositive"></uploadSingleImg>
                </div>
              </el-form-item>
              <div class="demo">
                <el-tooltip placement="top"  effect="light">
                  <div slot="content"><img src="./img/sfzz.png" alt=""></div>
                  <div class="img">
                    <img src="./img/sfzz.png" alt="">
                    <div class="example">示例</div>
                  </div>
                </el-tooltip>
                <div class="dec">
                  需清晰拍摄出证件文字信息。支持JPG、JPEG、PNG格式 大小不超过500K
                </div>
              </div>
              <el-form-item label="法人身份证照片反面" prop="idPhotoNegative" class="rester_nu">
                <div class="upload">
                  <uploadSingleImg :imgUrl="infoFormTow.idPhotoNegative" :fileName="'idPhotoNegative'" @uploadSuccess="uploadidPhotoNegative" @removeImg="removeidPhotoNegative"></uploadSingleImg>
                </div>
              </el-form-item>
              <div class="demo">
                <el-tooltip placement="top"  effect="light">
                  <div slot="content"><img src="./img/sfzz2.png" alt=""></div>
                  <div class="img">
                    <img src="./img/sfzz2.png" alt="">
                    <div class="example">示例</div>
                  </div>
                </el-tooltip>
                <div class="dec">
                  需清晰拍摄出证件文字信息。支持JPG、JPEG、PNG格式 大小不超过500K
                </div>
              </div>
              <el-form-item label="药品经营许可证" prop="drugLicenses">
                <div class="upload">
                  <uploadSingleImg :imgUrl="infoFormTow.drugLicenses" :fileName="'drugLicenses'" @uploadSuccess="uploaddrugLicenses" @removeImg="removerugLicenses"></uploadSingleImg>
                </div>
              </el-form-item>
              <div class="demo">
                <el-tooltip placement="top"  effect="light">
                  <div slot="content"><img src="./img/ypjyxk.png" alt=""></div>
                  <div class="img">
                    <img src="./img/ypjyxk.png" alt="">
                    <div class="example">示例</div>
                  </div>
                </el-tooltip>
                <div class="dec">
                  需文字清晰、边框完整。支持JPG、JPEG、PNG格式 大小不超过500K
                </div>
              </div>
              <div class="btn">
                <el-button @click="onStpe(1)">返回上一步</el-button>
                <el-button @click="save(5)">保存</el-button>
                <el-button @click="onStpeThree">提交审核</el-button>
              </div>
            </div>
          </el-form>
          <!-- <el-form :model="infoFormThree" :rules="rulesThree" ref="infoFormThree" label-width="125px" class="info_form_rule"  v-show="step === 3">
            <div class="step_three">
              <el-form-item label="账户类型" prop="paymentAccountType">
                <el-radio-group v-model="infoFormThree.paymentAccountType">
                  <el-radio :label="'个人账户'">个人账户</el-radio>
                  <el-radio :label="'公司账户'">公司账户</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="开户行" prop="openingBank">
                <el-select v-model="infoFormThree.openingBank" placeholder="请选择开户行">
                    <el-option v-for="(item, index) in bankList" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="开户人姓名" prop="accountHolder">
                <el-input v-model.trim="infoFormThree.accountHolder" placeholder="请输入开户人"></el-input>
              </el-form-item>
              <el-form-item label="银行卡号" prop="bankCardNumber">
                <el-input v-model.trim="infoFormThree.bankCardNumber" placeholder="请输入银行卡号"></el-input>
              </el-form-item>
              <div class="btn">
                <el-button @click="onStpe(2)">返回上一步</el-button>
                <el-button @click="save(5)">保存</el-button>
                <el-button @click="submit(1)">提交审核</el-button>
              </div>
            </div>
          </el-form> -->
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import layoutHeader from '@/components/header/header';
import BMap from 'BMap';
import { city } from '@/utils/city';
import uploadImg from '@/components/upload/uploadImg';
import javaAjax from '@/utils/javaApiRequest';
import { validatePhone, validateName } from '@/utils/validate';
import { formatDate } from '@/utils/date';
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      validityAbled: false,
      infoFormOne: {
        sellerName: '', // 商户名称
        sellerUserName: '', // 联系人
        contact: '', // 联系人电话
        mobile: '', // 门店电话
        addressProvince: '', // 门店省份
        addressCity: '', // 门店城市
        addressDistrict: '', // 门店区县
        detailAddress: '', // 详细地址
        latitude: '', // 纬度
        longitude: '', // 经度
        frontPhotos: '', // 门脸照片
        storePhotos: '', // 门店照片
        storeLogo: '', // 门店logo
      },
      infoFormTow: {
        businessLicense: '', // 营业执照
        businessLicenseName: '', // 营业执照名称
        registrationNumber: '', // 注册号
        legalPerson: '', // 法定代表人
        premises: '', // 经营场所
        start: '', // 开始时间
        validity: '', // 营业执照有效期
        longtime: '', // 长期有效
        recordDate: '', // 注册成立日期
        registrationAuthority: '', // 执照发证登记机关
        approvalDate: '', // 核准日期
        idPhotoPositive: '', // 身份证正面
        idPhotoNegative: '', // 身份证反面
        drugLicenses: '', // 药品经营许可证
      },
      infoFormThree: {
        paymentAccountType: '', // 账户类型
        openingBank: '', // 开户行
        accountHolder: '', // 开户人
        bankCardNumber: '', // 银行卡号
      },
      // infoForm: {
      //   sellerName: '', // 商户名称
      //   businessType: '3', // 商家类型   （1.仓库、2.药柜、3.药店)
      //   brand: '', // 所属品牌
      //   sellerUserName: '', // 联系人
      //   contact: '', // 联系人电话
      //   mobile: '', // 门店电话
      //   addressProvince: '', // 门店省份
      //   addressCity: '', // 门店城市
      //   addressDistrict: '', // 门店区县
      //   detailAddress: '', // 详细地址
      //   latitude: '113.222', // 纬度
      //   longitude: '26.334', // 经度
      //   frontPhotos: '', // 门脸照片
      //   storePhotos: '', // 门店照片
      //   storeLogo: '', // 门店logo
      //   businessLicense: '', // 营业执照
      //   businessLicenseName: '', // 营业执照名称
      //   registrationNumber: '', // 注册号
      //   legalPerson: '', // 法定代表人
      //   premises: '', // 经营场所
      //   validity: '', // 营业执照有效期
      //   recordDate: '', // 注册成立日期
      //   registrationAuthority: '', // 执照发证登记机关
      //   approvalDate: '', // 核准日期
      //   idPhotoPositive: '', // 身份证正面
      //   idPhotoNegative: '', // 身份证反面
      //   drugLicenses: '', // 药品经营许可证
      //   accountType: '', // 账户类型
      //   openingBank: '', // 开户行
      //   accountHolder: '', // 开户人
      //   bankCardNumber: '', // 银行卡号
      //   auditStatus: '', // 状态  1.提交 5、暂时保存
      // },
      step: 1,
      provinceOptions: city(), // 省列表
      cityOptions: [], // 市列表
      areaOptions: [], // 区列表
      map: '',
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
      ], // 开户行列表
      rulesOne: {
        sellerName: [{ required: true, message: '请输入门名称', trigger: 'blur' }],
        sellerUserName: [{ required: true, validator: this.validSellerUserName, trigger: 'blur' }],
        contact: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
        mobile: [{ required: true, validator: this.validmobile, trigger: 'blur' }],
        addressProvince: [{ required: true, message: '请选择门店省份', trigger: 'change' }],
        addressCity: [{ required: true, message: '请选择门店城市', trigger: 'change' }],
        addressDistrict: [{ required: true, message: '请选择门店区县', trigger: 'change' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        latitude: [{ required: true, message: '请选择门店坐标', trigger: 'change' }],
        frontPhotos: [{ required: true, message: '请选择门脸照片', trigger: 'blur' }],
        storePhotos: [{ required: true, message: '请选择门店照片', trigger: 'blur' }],
        storeLogo: [{ required: true, message: '请选择门店logo', trigger: 'blur' }],
      },
      rulesTwo: {
        businessLicense: [{ required: true, message: '请选择营业执照', trigger: 'blur' }],
        businessLicenseName: [{ required: true, validator: this.validBeines, trigger: 'blur' }],
        registrationNumber: [{ required: true, validator: this.validNu, trigger: 'blur' }],
        legalPerson: [{ required: true, validator: this.validSellerUserName, trigger: 'blur' }],
        premises: [{ required: true, message: '请输入经营场所', trigger: 'blur' }],
        start: [{ required: true, message: '请选择营业执照有效期', trigger: 'blur' }],
        validity: [{ required: true, message: '请选择营业执照有效期', trigger: 'blur' }],
        recordDate: [{ required: true, message: '请选择注册/成立日期', trigger: 'blur' }],
        registrationAuthority: [{ required: true, validator: this.validChinese, trigger: 'blur' }],
        approvalDate: [{ required: true, message: '请选择核准日期', trigger: 'blur' }],
        idPhotoPositive: [{ required: true, message: '请选择身份证正面照片', trigger: 'blur' }],
        idPhotoNegative: [{ required: true, message: '请选择身份证反面照片', trigger: 'blur' }],
        drugLicenses: [{ required: true, message: '请选择药品经营许可证', trigger: 'blur' }],
      },
      rulesThree: {
        paymentAccountType: [{ required: true, message: '请选择账户类型', trigger: 'blur' }],
        openingBank: [{ required: true, message: '请选择开户行', trigger: 'blur' }],
        accountHolder: [{ required: true, validator: this.validSellerUserName, trigger: 'blur' }],
        bankCardNumber: [{ required: true, validator: this.validBanck, trigger: 'blur' }],
      },
      opts: {
        width: 200,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title: '<p style="color:red;border-bottom:1px solid #dcdfe6">已将坐标定位为</p>', // 信息窗口标题
      },
      // rules: {
      //   sellerName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
      //   sellerUserName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
      //   contact: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
      //   mobile: [{ required: true, validator: this.validPhone, trigger: 'blur' }],
      //   addressProvince: [{ required: true, message: '请选择门店省份', trigger: 'change' }],
      //   addressCity: [{ required: true, message: '请选择门店城市', trigger: 'change' }],
      //   addressDistrict: [{ required: true, message: '请选择门店区县', trigger: 'change' }],
      //   detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
      //   latitude: [{ required: true, message: '请选择门店坐标', trigger: 'change' }],
      //   frontPhotos: [{ required: true, message: '请选择门脸照片', trigger: 'blur' }],
      //   storePhotos: [{ required: true, message: '请选择门店照片', trigger: 'blur' }],
      //   storeLogo: [{ required: true, message: '请选择门店logo', trigger: 'blur' }],
      //   businessLicense: [{ required: true, message: '请选择营业执照', trigger: 'blur' }],
      //   businessLicenseName: [{ required: true, message: '请输入营业执照名称', trigger: 'blur' }],
      //   registrationNumber: [{ required: true, message: '请输入注册号', trigger: 'blur' }],
      //   legalPerson: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
      //   premises: [{ required: true, message: '请输入经营场所', trigger: 'blur' }],
      //   validity: [{ required: true, message: '请选择营业执照有效期', trigger: 'blur' }],
      //   recordDate: [{ required: true, message: '请选择注册/成立日期', trigger: 'blur' }],
      //   registrationAuthority: [{ required: true, message: '请输入执照发证登记机关', trigger: 'blur' }],
      //   approvalDate: [{ required: true, message: '请选择核准日期', trigger: 'blur' }],
      //   idPhotoPositive: [{ required: true, message: '请选择身份证正面照片', trigger: 'blur' }],
      //   idPhotoNegative: [{ required: true, message: '请选择身份证反面照片', trigger: 'blur' }],
      //   drugLicenses: [{ required: true, message: '请选择药品经营许可证', trigger: 'blur' }],
      //   accountType: [{ required: true, message: '请选择账户类型', trigger: 'blur' }],
      //   openingBank: [{ required: true, message: '请选择开户行', trigger: 'blur' }],
      //   accountHolder: [{ required: true, message: '请输入开户人', trigger: 'blur' }],
      //   bankCardNumber: [{ required: true, message: '请输入银行卡号', trigger: 'blur' }],
      // }
    };
  },
  watch: {
    'infoFormOne.addressProvince': function() {
      if (this.infoFormOne.addressProvince) {
        this.cityOptions = this.provinceOptions.find(x => x.name === this.infoFormOne.addressProvince).city;
        this.infoFormOne.addressCity = '';
        this.infoFormOne.addressDistrict = '';
      }
    },
    'infoFormOne.addressCity': function() {
      if (this.infoFormOne.addressCity) {
        this.areaOptions = this.cityOptions.find(x => x.name === this.infoFormOne.addressCity).districtAndCounty;
        this.infoFormOne.addressDistrict = '';
      }
    },
    'infoFormTow.longtime': function() {
      if (this.infoFormTow.longtime) {
        this.validityAbled = true;
        this.infoFormTow.validity = '';
        this.infoFormTow.start = '';
      } else {
        this.validityAbled = false;
      }
    }
  },
  components: {
    'layoutHeader': layoutHeader,
    'uploadSingleImg': uploadImg
  },
  methods: {
    // 手机号
    validPhone(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入手机号码'));
      } else if (!validatePhone(value)) {
        callback(new Error('请输入正确的11位手机号码'));
      } else {
        callback();
      }
    },
    // 门店电话
    validmobile(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入门店号码'));
      } else if (!this.isvalidmobile(value)) {
        callback(new Error('门店号码只能是数字或者-'));
      } else {
        callback();
      }
    },
    isvalidmobile(str) {
      let reg = /^([\d\-\/]){1,20}$/;
      return reg.test(str);
    },
    isvalidSellerName(str) {
      let reg = /^(?!\d+$)[\da-zA-Z]+$/;
      return reg.test(str);
    },
    // 门店名称
    validSellerName(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入门店名称'));
      } else if (!this.isvalidChinese(value)) {
        callback(new Error('门店名称只能是中文字符'));
      } else {
        callback();
      }
    },
    validSellerUserName(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入姓名'));
      } else if (!validateName(value)) {
        callback(new Error('姓名不能包括数字或者特殊字符'));
      } else {
        callback();
      }
    },
    // 营业注册号
    isValidNu(str) {
      let reg = /^([0-9a-zA-Z]){1,20}$/;
      return reg.test(str);
    },
    validNu(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入营业注册号'));
      } else if (!this.isValidNu(value)) {
        callback(new Error('营业注册号只能是数字或者字母'));
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
      if (!value) {
        callback(new Error('请输入银行卡号'));
      } else if (!this.isvalidBanck(value)) {
        callback(new Error('请输入符合规范的银行卡号'));
      } else {
        callback();
      }
    },
    // 中文字符验证
    isvalidChinese(str) {
      const reg = /^[\u4e00-\u9fa5\S]{1,20}$/;
      return reg.test(str);
    },
    validChinese(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入发证/登记机关'));
      } else if (!this.isvalidChinese(value)) {
        callback(new Error('请输入纯中文的发证/登记机关'));
      } else {
        callback();
      }
    },
    // 营业执照
    validBeines(rule, value, callback) {
      if (!value) {
        callback(new Error('请输入营业执照名称'));
      } else if (!this.isvalidChinese(value)) {
        callback(new Error('营业执照名称只能是纯中文字符'));
      } else {
        callback();
      }
    },
    // 下一步到第二步
    onStpeTow() {
      this.$refs['infoFormOne'].validate((valid, param) => {
        if (valid) {
          this.step = 2;
        } else {
          this.$alert('提交失败，请修改标红信息', '提示', {
            showClose: false,
            type: 'warning',
            center: true,
            showCancelButton: false
          });
          return false;
        }
      });
    },
    // 第三步
    onStpeThree() {
      // this.$refs['infoFormTow'].resetFields();
      this.$refs['infoFormTow'].validate((valid, param) => {
        if (valid) {
          // this.step = 3;
          this.save(1);
        } else {
          this.$alert('提交失败，请修改标红信息', '提示', {
            showClose: false,
            type: 'warning',
            center: true,
            showCancelButton: false
          });
          return false;
        }
      });
    },
    // 步骤
    onStpe(nu) {
      this.step = nu;
    },
    // 上传门脸照片
    uploadfrontPhotos(data) {
      this.infoFormOne.frontPhotos = data.url;
    },
    removefrontPhotos() {
      this.infoFormOne.frontPhotos = '';
    },
    // 上传门店照片
    uploadstorePhotos(data) {
      this.infoFormOne.storePhotos = data.url;
    },
    removestorePhotos() {
      this.infoFormOne.storePhotos = '';
    },
    // 上传门店logo
    uploadstoreLogo(data) {
      this.infoFormOne.storeLogo = data.url;
    },
    removestoreLogo() {
      this.infoFormOne.storeLogo = '';
    },
    // 上传营业执照
    uploadbusinessLicense(data) {
      this.infoFormTow.businessLicense = data.url;
    },
    removebusinessLicense() {
      this.infoFormTow.businessLicense = '';
    },
    // 上传身份证正面照
    uploadidPhotoPositive(data) {
      this.infoFormTow.idPhotoPositive = data.url;
    },
    removeidPhotoPositive() {
      this.infoFormTow.idPhotoPositive = '';
    },
    // 上传身份证反面
    uploadidPhotoNegative(data) {
      this.infoFormTow.idPhotoNegative = data.url;
    },
    removeidPhotoNegative() {
      this.infoFormTow.idPhotoNegative = '';
    },
    // 上传药品经营许可证
    uploaddrugLicenses(data) {
      this.infoFormTow.drugLicenses = data.url;
    },
    removerugLicenses() {
      this.infoFormTow.drugLicenses = '';
    },
    submit(nu) {
      // 提交
      this.$refs['infoFormThree'].validate((valid, param) => {
        if (valid) {
          this.save(nu);
        } else {
          this.$alert('提交失败，请修改标红信息', '提示', {
            showClose: false,
            type: 'warning',
            center: true,
            showCancelButton: false
          });
          return false;
        }
      });
    },
    // 保存
    save(nu) {
      let info = {
        sellerName: this.infoFormOne.sellerName, // 商户名称
        businessType: '2', // 商家类型   （1.仓库、2.药店、3.药柜)
        sellerUserName: this.infoFormOne.sellerUserName, // 联系人
        contact: this.infoFormOne.contact, // 联系人电话
        mobile: this.infoFormOne.mobile, // 门店电话
        addressProvince: this.infoFormOne.addressProvince, // 门店省份
        addressCity: this.infoFormOne.addressCity, // 门店城市
        addressDistrict: this.infoFormOne.addressDistrict, // 门店区县
        detailAddress: this.infoFormOne.detailAddress, // 详细地址
        latitude: this.infoFormOne.latitude, // 纬度
        longitude: this.infoFormOne.longitude, // 经度
        frontPhotos: this.infoFormOne.frontPhotos, // 门脸照片
        storePhotos: this.infoFormOne.storePhotos, // 门店照片
        storeLogo: this.infoFormOne.storeLogo, // 门店logo
        businessLicense: this.infoFormTow.businessLicense, // 营业执照
        businessLicenseName: this.infoFormTow.businessLicenseName, // 营业执照名称
        registrationNumber: this.infoFormTow.registrationNumber, // 注册号
        legalPerson: this.infoFormTow.legalPerson, // 法定代表人
        premises: this.infoFormTow.premises, // 经营场所
        validity: this.infoFormTow.longtime ? '长期有效' : this.infoFormTow.start + '~' + this.infoFormTow.validity, // 营业执照有效期
        recordDate: this.infoFormTow.recordDate ? this.infoFormTow.recordDate : '', // 注册成立日期
        registrationAuthority: this.infoFormTow.registrationAuthority, // 执照发证登记机关
        approvalDate: this.infoFormTow.approvalDate ? this.infoFormTow.approvalDate : '', // 核准日期
        idPhotoPositive: this.infoFormTow.idPhotoPositive, // 身份证正面
        idPhotoNegative: this.infoFormTow.idPhotoNegative, // 身份证反面
        drugLicenses: this.infoFormTow.drugLicenses, // 药品经营许可证
        paymentAccountType: this.infoFormThree.paymentAccountType, // 账户类型
        openingBank: this.infoFormThree.openingBank, // 开户行
        accountHolder: this.infoFormThree.accountHolder, // 开户人
        bankCardNumber: this.infoFormThree.bankCardNumber, // 银行卡号
        auditStatus: nu, // 状态  1.提交 5、暂时保存
      };
      let url = this.$route.query.id ? '/mall_manage_seller/authority/updateSellerUser' : `/mall_manage_seller/authority/insertSellerUser`;
      if (this.$route.query.id) {
        info.sellerUserId = this.$route.query.id;
      }
      javaAjax.post(url, info).then((res) => {
        // console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.$message.success(res.data.msg);
          this.$router.push('/sellerAdd');
        }
      });
    },
    getDetail() {
      let param = {
        sellerUserId: this.$route.query.id
      };
      javaAjax.post('/mall_manage_seller/authority/queryBusinessDetails', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          let sellerUser = res.data.resultData.sellerUser;
          this.infoFormOne = {
            sellerName: sellerUser.sellerName, // 商户名称
            sellerUserName: sellerUser.sellerUserName, // 联系人
            contact: sellerUser.contact, // 联系人电话
            mobile: sellerUser.mobile, // 门店电话
            addressProvince: sellerUser.addressProvince, // 门店省份
            addressCity: sellerUser.addressCity, // 门店城市
            addressDistrict: sellerUser.addressDistrict, // 门店区县
            detailAddress: sellerUser.detailAddress, // 详细地址
            latitude: sellerUser.latitude, // 纬度
            longitude: sellerUser.longitude, // 经度
            frontPhotos: sellerUser.frontPhotos, // 门脸照片
            storePhotos: sellerUser.storePhotos, // 门店照片
            storeLogo: sellerUser.storeLogo, // 门店logo
          };
          this.infoFormTow = {
            businessLicense: sellerUser.businessLicense, // 营业执照
            businessLicenseName: sellerUser.businessLicenseName, // 营业执照名称
            registrationNumber: sellerUser.registrationNumber, // 注册号
            legalPerson: sellerUser.legalPerson, // 法定代表人
            premises: sellerUser.premises, // 经营场所
            start: sellerUser.validity === '长期有效' ? '' : sellerUser.validity.split('~')[0], // 开始时间
            validity: sellerUser.validity === '长期有效' ? '' : sellerUser.validity.split('~')[1], // 营业执照有效期
            recordDate: sellerUser.recordDate ? formatDate(sellerUser.recordDate) : '', // 注册成立日期
            registrationAuthority: sellerUser.registrationAuthority, // 执照发证登记机关
            approvalDate: sellerUser.recordDate ? formatDate(sellerUser.approvalDate) : '', // 核准日期
            idPhotoPositive: sellerUser.idPhotoPositive, // 身份证正面
            idPhotoNegative: sellerUser.idPhotoNegative, // 身份证反面
            drugLicenses: sellerUser.drugLicenses, // 药品经营许可证
            longtime: sellerUser.validity === '长期有效' ? true : false
          };
          this.infoFormThree = {
            paymentAccountType: sellerUser.paymentAccountType, // 账户类型
            openingBank: sellerUser.openingBank, // 开户行
            accountHolder: sellerUser.accountHolder, // 开户人
            bankCardNumber: sellerUser.bankCardNumber, // 银行卡号
          };
          setTimeout(() => {
            this.infoFormOne.addressCity = sellerUser.addressCity;
            setTimeout(() => {
              this.infoFormOne.addressDistrict = sellerUser.addressDistrict;
            }, 100);
          }, 100);
          // this.detailData = res.data.resultData.sellerUser;
          if (sellerUser.longitude) {
            let new_point = new BMap.Point(sellerUser.longitude, sellerUser.latitude);
            this.map.centerAndZoom(new_point, 16);
            let marker = new BMap.Marker(new_point);  // 创建标注
            this.map.addOverlay(marker);              // 将标注添加到地图中
            let geoc = new BMap.Geocoder();
            let point = { lat: Number(sellerUser.latitude), lng: Number(sellerUser.longitude) };
            console.log(point);
            let _self = this;
            geoc.getLocation(new_point, function(rs) {
              console.log(rs);
              let addComp = rs.addressComponents;
              let detailAddress = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
              let infoWindow = new BMap.InfoWindow(`地址：${detailAddress}`, _self.opts);  // 创建信息窗口对象
              _self.map.openInfoWindow(infoWindow, new_point); // 开启信息窗口
            });
          }
        }
      });
    },
    // 切换药店
    switchSeller() {
      let param = {
        sellerUserId: this.$route.query.id
      };
      javaAjax.post('/mall_manage_seller/authority/updateSellerId', param).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.resultCode === '0') {
          this.getDetail();
        }
      });
    }
  },
  created() {
    if (this.$route.query.id) {
      this.switchSeller();
    }
  },
  mounted() {
    let _self = this;
    // 创建地图实例
    _self.map = new BMap.Map('map');
    _self.map.enableScrollWheelZoom(true);
    this.map.centerAndZoom('深圳', 16);
    // 信息窗口
    // let opts = {
    //   width: 200,     // 信息窗口宽度
    //   height: 100,     // 信息窗口高度
    //   title: '<p style="color:red;border-bottom:1px solid #dcdfe6">已将坐标定位为</p>', // 信息窗口标题
    // };
    // 建立一个自动完成的对象
    let ac = new BMap.Autocomplete(
      {
        'input': 'suggestId',
        'location': _self.map
      }
    );
    let myValue = '';
    // 监听点击下拉框
    ac.addEventListener('onconfirm', function(e) {
      console.log(e);
      let _value = e.item.value;
      myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      setPlace();
    });
    let pp = '';
    // 智能搜索
    function setPlace() {
      console.log(myValue);
      _self.map.clearOverlays();    // 清除地图上所有覆盖物
      function myFun() {
        pp = local.getResults().getPoi(0).point;    // 获取第一个智能搜索的结果
        console.log(pp);
        _self.infoFormOne.latitude = pp.lat;
        _self.infoFormOne.longitude = pp.lng;
        _self.map.centerAndZoom(pp, 16);
        _self.map.addOverlay(new BMap.Marker(pp));    // 添加标注
        let infoWindow = new BMap.InfoWindow(`地址：${myValue}`, _self.opts);  // 创建信息窗口对象
        _self.map.openInfoWindow(infoWindow, pp); // 开启信息窗口
      }
      let local = new BMap.LocalSearch(_self.map,
        { onSearchComplete: myFun }// 智能搜索
      );
      local.search(myValue);
    }
    // 点击地图
    this.map.addEventListener('click', showInfo);
    let geoc = new BMap.Geocoder();
    function showInfo(e) {
      console.log(e.point);
      _self.infoFormOne.latitude = e.point.lat;
      _self.infoFormOne.longitude = e.point.lng;
      _self.map.clearOverlays();
      _self.map.addOverlay(new BMap.Marker(e.point));
      _self.map.panTo(new BMap.Point(e.point.lng, e.point.lat));
      geoc.getLocation(e.point, function(rs) {
        console.log(rs);
        let addComp = rs.addressComponents;
        // let nuText = addComp.streetNumber ? '号' : '';
        let detailAddress = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
        let infoWindow = new BMap.InfoWindow(`地址：${detailAddress}`, _self.opts);  // 创建信息窗口对象
        _self.map.openInfoWindow(infoWindow, e.point); // 开启信息窗口
      });
    }
  }
};
</script>

<style lang="less" scoped>
.seller_info{
  width: 100%;
  padding-bottom: 50px;
  background: #F7F8FA;
  .header_wrap{
    box-shadow: 0 2px 6px 0 #F1F1F6;
    background: #FFF;
  }
  .main_wrap{
    width: 1000px;
    margin: 30px auto 0;
    background: #fff;
    .step{
      height: 80px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
      padding-left: 110px;
      .step_item{
        &:nth-child(2) {
          .text{
            &::after{
              width: 0;
            }
          }
        }
        display: flex;
        align-items: center;
        width: 300px;
        position: relative;
        .nu{
          width: 30px;
          height: 30px;
          background: #333;
          color: #fff;
          line-height: 30px;
          text-align: center;
          border-radius: 50%;
        }
        .text{
          flex: 1;
          padding-left: 10px;
          &::after{
            border-bottom: 1px solid #d2d2d2;
            content: '';
            right: 5px;
            top: 50%;
            position: absolute;
            display: block;
            width: 180px;
            z-index: 1;
            color: #d2d2d2;
          }
        }
      }
      .step_item_act{
        .nu{
          background: #00cdd3;
        }
        .text{
          color: #00cdd3;
          &::after{
            border-bottom: 1px solid #00cdd3;
          }
        }
      }
    }
    .info_from{
      margin-top: 50px;
      padding-left: 70px;
      /deep/.is-success{
        .el-input__inner{
          border-color: #dcdfe6;
        }
      }
      /deep/.el-checkbox{
        display: flex;
        align-items: center;
        height: 40px;
        margin-left: 15px;
      }
      .info_form_rule{
        /deep/.el-input{
          width: 460px;
        }
        /deep/.el-form-item__label{
          padding-right: 20px;
          font-size: 13px;
        }
        .map_warp{
          position: relative;
          #map{
            width: 700px;
            height: 430px;
            border: 1px solid #d2d2d2;
          }
          .map_input{
            position: absolute;
            top: 15px;
            left: 140px;
            width: 420px;
            height: 40px;
            border: 1px solid #dcdfe6;
            background: #fff;
            border-radius: 4px;
            color: #606266;
            padding: 0 15px;
            &::-webkit-input-placeholder{
              color: #C0C4CC
            }
            &:-moz-placeholder{
              color: #C0C4CC
            }
            &:placeholder{
              color: #C0C4CC
            }
          }
        }
        .addressRegion{
          display: flex;
          .region_left{
            /deep/.el-form-item__content{
              margin-left: 20px !important;
            }
          }
          /deep/.el-input{
            width: 140px;
          }
        }
        .busiRegion{
          .region_right{
            /deep/.el-form-item__content{
              margin-left: 20px !important;
            }
          }
          /deep/.el-input{
            width: 220px;
          }
        }
        .upload{
          .load{
            width: 100px;
            height: 80px;
            border: 1px solid #d2d2d2;
            background: url('./img/imgupload_bg.png') no-repeat;
            background-size: 100% 100%;
            cursor: pointer;
          }
        }
        .demo{
          margin-left: 125px;
          margin-bottom: 20px;
          width: 600px;
          height: 130px;
          border: 1px solid #d2d2d2;
          margin-top: 20px;
          background-color: #fafafa;
          padding: 20px;
          display: flex;
          .img{
            width: 100px;
            height: 80px;
            position: relative;
            img{
              width: 100px;
              height: 80px;
            }
            .example{
              position: absolute;
              background-color: rgba(0,0,0,.5);
              color: #fff;
              width: 38px;
              height: 18px;
              line-height: 18px;
              bottom: 0;
              right: 0;
              font-size: 12px;
              text-align: center;
              border-top-left-radius: 10px;
            }
          }
          .dec{
            padding: 0px 0 0 20px;
            color: #858692;
            line-height: 22px;
          }
        }
        .rester_nu{
          margin-left: -75px;
          /deep/.el-form-item__label{
            width: 200px !important;
          }
          // /deep/.el-form-item__error{
          //   // left: 75px;
          // }
          /deep/.el-form-item__content{
            margin-left: 200px !important;
          }
        }
        .btn{
          text-align: center;
          /deep/.el-button{
            background: #0ccdd3;
            border-color: #0ccdd3;
            span{
              color: #fff;
              font-size: 14px;
              line-height: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
