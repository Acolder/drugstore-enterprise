<template>
<div class="add">
  <h2 class="title">添加商品</h2>
  <div class="main">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"  size="medium">
      <div class="item-wrapper first-item">
        <el-form-item label="分类" prop="categoryCode">
          <el-select v-model="ruleForm.categoryCode" placeholder="请选商品分类">
            <el-option label="保健品1" value="shanghai"></el-option>
            <el-option label="保健品2" value="beijing"></el-option>
            <el-option label="保健品3" value="beijing"></el-option>
            <el-option label="保健品4" value="beijing"></el-option>
            <el-option label="保健品5" value="beijing"></el-option>
            <el-option label="保健品6" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="ruleForm.productName"></el-input>
        </el-form-item>
        <el-form-item label="商品sku" class="productSku"  prop="productSku">
          <el-input v-model="ruleForm.productSku"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="商品主图">
        <el-upload
          class="upload-demo"
          action="http://upload.jkbat.com/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="ruleForm.productMainImage"
          :multiple="true"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="商品子图">
        <el-upload
          class="upload-demo"
          action="http://upload.jkbat.com/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="ruleForm.productMainImage"
          :multiple="true"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <div class="item-wrapper">
        <el-form-item label="商品标题" prop="productSubtitle">
          <el-input v-model="ruleForm.productSubtitle"></el-input>
        </el-form-item>
        <el-form-item label="计量单位" prop="product_unit">
          <el-input v-model="ruleForm.product_unit"></el-input>
        </el-form-item>
        <el-form-item label="条形码" prop="product_bar_code">
          <el-input v-model="ruleForm.product_bar_code"></el-input>
        </el-form-item>
      </div>
      <div class="item-wrapper">
        <el-form-item label="批注文号" prop="productApprovalNumber">
          <el-input v-model="ruleForm.productApprovalNumber"></el-input>
        </el-form-item>
        <el-form-item label="剂型" prop="productDosageForm">
          <el-input v-model="ruleForm.productDosageForm"></el-input>
        </el-form-item>
        <el-form-item label="储藏条件" prop="productStorageConditions">
          <el-input v-model="ruleForm.productStorageConditions"></el-input>
        </el-form-item>
      </div>
      <div class="item-wrapper">
        <el-form-item label="验收标准" prop="productAcceptanceCriteria">
          <el-input v-model="ruleForm.productAcceptanceCriteria"></el-input>
        </el-form-item>
        <el-form-item label="性状" prop="productCharacter">
          <el-input v-model="ruleForm.productCharacter"></el-input>
        </el-form-item>
        <el-form-item label="标准规格" prop="productSpecification">
          <el-input v-model="ruleForm.productSpecification"></el-input>
        </el-form-item>
      </div>
      <div class="item-wrapper">
        <el-form-item label="生产产地" prop="productProducingPlace">
          <el-input v-model="ruleForm.productProducingPlace"></el-input>
        </el-form-item>
        <el-form-item label="原产地" prop="productOriginPlace">
          <el-input v-model="ruleForm.productOriginPlace"></el-input>
        </el-form-item>
        <el-form-item label="商品市场价" prop="productMarkprice">
          <el-input v-model="ruleForm.productMarkprice"></el-input>
        </el-form-item>
      </div>
      <div class="item-wrapper">
        <el-form-item label="销量" prop="productSalesVolume">
          <el-input v-model="ruleForm.productSalesVolume"></el-input>
        </el-form-item>
      </div>
      <div class="textEditing">
        <el-form-item label="详情" prop="productDetail">
          <el-input type="textarea" v-model="ruleForm.productDetail"></el-input>
        </el-form-item>
      </div>
      <div class="item-wrapper lats-item">
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即添加</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import javaRequest from '@/utils/javaApiRequest';
export default {
  data() {
    return {
      ruleForm: {
        categoryCode: '',
        productName: '',
        productSku: '',
        productMainImage: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
        productSubImages: [{ name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }, { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }],
        productSubtitle: '',
        product_unit: '',
        product_bar_code: '',
        productApprovalNumber: '',
        productDosageForm: '',
        productStorageConditions: '',
        productAcceptanceCriteria: '',
        productCharacter: '',
        productSpecification: '',
        productProducingPlace: '',
        productOriginPlace: '',
        productMarkprice: '',
        productSalesVolume: '',
        productDetail: ''
      },
      rules: {
        categoryCode: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        productName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productSku: [
          { required: true, message: '请输入商品sku', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productSubtitle: [
          { required: true, message: '请输入商品标题', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        product_unit: [
          { required: true, message: '请输入计量单位', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        product_bar_code: [
          { required: true, message: '请输入条形码', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productApprovalNumber: [
          { required: true, message: '请输入批注文号', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productDosageForm: [
          { required: true, message: '请输入剂型', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productStorageConditions: [
          { required: true, message: '请输入储藏条件', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productAcceptanceCriteria: [
          { required: true, message: '请输入验收标准', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productCharacter: [
          { required: true, message: '请输入性状', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productSpecification: [
          { required: true, message: '请输入标准规格', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productProducingPlace: [
          { required: true, message: '请输入生产产地', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productOriginPlace: [
          { required: true, message: '请输入原产地', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productMarkprice: [
          { required: true, message: '请输入商品市场价', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productSalesVolume: [
          { required: true, message: '请输入商品销量', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        productDetail: [
          { required: true, message: '请输入详情', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      },
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
          javaRequest.post(`/mall/back/product/addProduct`, this.ruleForm).then((res) => {
            console.log(res);
            console.log('添加商品成功');
          });
        } else {
          console.log('添加商品失败');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style scoped lang="less">
.add{
  .title{
    color: #000;
    font-size: 20px;
    border-bottom: 1px solid #ccc;
    line-height: 40px;
    margin-bottom: 10px;
  }
  .main{
    margin: 50px 0;
    .el-input{
      width: 300px;
    }
    .el-select--medium{
      width: 300px;
      margin-right: 150px;
    }
    .el-form-item{
      margin-right: 50px;
    }
    .el-select.el-select--mini{
      width: 300px;
    }
    .item-wrapper{
      display: flex;
      padding-right: 150px;
    }
    .first-item{
      >div:nth-child(2){
        margin-right: 150px;
      }
    }
    .lats-item{
      justify-content: center;
      margin: 100px 0;
    }
  }
}
</style>
