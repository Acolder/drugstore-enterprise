
<template>
  <div class="upload-wrapper">
    <div v-show="limit-imgList.length>0">
        <div class="upload_box" @click="openLocals" v-loading="uploadLoading"></div>
        <!-- <el-button type="default" plain icon="el-icon-upload" @click="openPrompt">添加网络图片</el-button> -->
      <form :id="fileName+'Form'" enctype="multipart/form-data" style="display:none;">
        <el-input type="file" :name="fileName" @change="fileChanged" v-model="filePath" class="selectfile" />
        <!-- <el-button icon="el-icon-picture" plain @click="openPrompt" class="appendNetImg">添加网络图片</el-button> -->
      </form>
    </div>
    <div class="img-wrapper" v-show="limit-imgList.length<=0">
      <el-tag v-for="(url,index) in imgList" :key="index" closable @close="removeImg(url)" v-if="url">
        <img :src="url" alt="" />
      </el-tag>
    </div>
  </div>
</template>
<style lang="less" scoped>
.upload_box{
  width: 100px;
  height: 80px;
  border: 1px solid #d2d2d2;
  background: url('./img/imgupload_bg.png') no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
}
.btn-wrapper {
  /deep/.el-button {
    border: 1px dotted #dcdfe6;
    width: 160px;
  }
}
.img-wrapper {
  padding: 10px 0;
  zoom: 1;
  &::after {
    display: block;
    clear: both;
    content: "";
    visibility: hidden;
    height: 0;
  }
}
.selectfile {
  width: auto;
  /deep/.el-input__inner {
    border: none;
    padding: 0;
  }
}
.appendNetImg {
  float: right;
  border: none;
}
.el-tag {
  height: auto;
  line-height: 0!;
  background-color: #fff;
  border: none;
  &:hover {
    cursor: pointer;
  }
  /deep/.el-icon-close {
    right: 5px;
    top: -20px;
    border-radius: 50%;
    background: red;
    color: #fff;
  }
}

.pload-wrapper {
  float: left;
}

img {
  height: 80px;
  width: 80px;
  float: left;
  border: 1px dashed #dcdfe6;
}

span {
  float: left;
}
</style>
<script>
import $ from 'jquery';
import axios from 'axios';
import { base64Decrypt } from '@/utils/auth';
export default {
  data() {
    return {
      filePath: '',
      imgUrlList: '',
      uploadLoading: false,
    };
  },
  computed: {
    imgList: {
      get: function () {
        // console.log(this.imgUrl);
        let urls = this.imgUrl;
        if (urls) {
          let list = this.imgUrl.split(',');
          return list;
        } else {
          return [];
        }
      }
    }
  },
  props: {
    // file控件名称
    fileName: {
      type: String,
      required: true
    },
    // 图片地址,多个图片用逗号隔开
    imgUrl: {
      type: String,
      default: '',
      required: true
    },
    // 上传数量
    limit: {
      type: Number,
      default: 1
    },
    isMark: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    openLocals() {
      $(`input[type='file'][name='${this.fileName}']`).click();
    },
    openPrompt() {
      let _self = this;
      this.$prompt('请输入网络地址,多张图片地址用","号隔开。', '添加网络图片', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/,
        inputErrorMessage: '图片地址不正确'
      }).then(({ value }) => {
        let array = value.split(',');
        let count = _self.limit - (array.length + _self.imgList.length);
        if (count < 0) {
          this.$message({
            type: 'error',
            message: '添加失败，添加图片数超出限额！'
          });
          return false;
        }
        _self.appendImgUrl(value);
        _self.$emit('uploadSuccess', { url: value }, _self.imgUrlList);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    preview(url) {
      this.$alert(`<img src="${url}" alt=''/>`, '', {
        dangerouslyUseHTMLString: true,
        customClass: 'reviewImg'
      });
    },
    // 删除 imgUrl的图片url
    removeImgUrl(url) {
      let array = [];
      for (let i = 0; i < this.imgList.length; i++) {
        let item = this.imgList[i];
        if (item !== url) {
          array.push(item);
        }
      }
      let value = array.join(',');
      this.imgUrlList = value;
    },
    // 添加 imgUrl的图片url
    appendImgUrl(url) {
      let array = this.imgList;
      array.push(url);
      let value = array.join(',');
      this.imgUrlList = value;
      // console.log(this.imgUrlList);
    },
    // 删除一张图片
    removeImg(url) {
      let _self = this;
      _self.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _self.filePath = '';
        _self.removeImgUrl(url);
        _self.$emit('removeImg', _self.imgUrlList);
      }).catch(() => {
        _self.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    fileChanged() {
      if (this.isMark) {
        this.uploadMarkImage();
      } else {
        this.uploadImage();
      }
    },
    uploadImage() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
        _self.$alert('仅支持.jpg、.png、.jpeg、的图片格式', '提示');
        return;
      }
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      axios.post(`${process.env.UPLOAD_HOST}`, formdata1, config).then((response) => {
        _self.uploadLoading = false;
        let data = response.data;
        if (data) {
          // console.log(data);
          let resultObj = data;
          _self.appendImgUrl(resultObj[0].url);
          _self.$emit('uploadSuccess', resultObj[0], _self.imgUrlList);
        }
      });
    },
    // 打水印上传
    uploadMarkImage() {
      let _self = this;
      let fileElement = $(`input[type='file'][name='${_self.fileName}']`);
      let filename = fileElement.val();
      let ext = filename.substring(filename.lastIndexOf('.')).toLowerCase();
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
        _self.$alert('仅支持.jpg、.png、.jpeg的图片格式', '提示');
        return;
      }
      _self.uploadLoading = true;
      let file = fileElement[0].files[0];
      let formdata1 = new FormData();
      formdata1.append('file', file, file.name);
      formdata1.append('doCondense', '0');
      let config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };
      axios.post(`${process.env.MALL_BASE_HOST}/mall_manage/back/file/markAndUploadImg`, formdata1, config).then((response) => {
        _self.uploadLoading = false;
        let str = base64Decrypt(response.data);
        let data = JSON.parse(str);
        if (data && Number(data.resultCode) === 0) {
          _self.appendImgUrl(data.resultData);
          _self.$emit('uploadSuccess', data.resultData, _self.imgUrlList);
        } else {
          let msg = data.msg;
          msg = msg ? msg : '上传失败！';
          _self.$alert(msg, '提示');
        }
      });
    }
  },
};

</script>
