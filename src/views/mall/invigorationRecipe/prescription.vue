<template>
  <div class="parscripeion">
    <div class="title">康美e抓药</div>
    <div class="img" id="print-img">
      <img :src="url" alt="">
    </div>
    <ul class="desctiom">
      <li>使用微信扫描二维码可以进行在线抓药、开方、中药代煎服务</li>
      <li>可以将二维码打印出来，放置收银台或其他相关区域，给客户提供相关服务。</li>
    </ul>
    <div class="download">
      <!-- <p>下载二维码</p>  @click="print"-->
      <a :href="url" download="二维码.png" target="view_window">下载图片</a>
      <!-- <a href="./img/icon-choose_wzfw.png" download>下载二维码</a> -->
    </div>
    <!-- <canvas id="myCanvas" width="200" height="100" style="border:1px solid #c3c3c3;"></canvas> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/utils/ajax';
import jQuery from 'jquery';
import { getLodop } from '@static/LodopFuncs.js';
export default {
  data() {
    return {
      url: ''
    };
  },
  computed: {
    ...mapGetters([
      'sellerID',
    ]),
  },
  methods: {
    getQRcode() {
      ajax.get('api/system/ezyqrcode/?business_id=' + this.sellerID).then(res => {
        console.log(res);
        if (res.status === 200 && res.data.code === 0 && res.data.data) {
          console.log(res.data.data);
          this.url = res.data.data.url;
        }
      });
    },
    print() {
      let LODOP = getLodop();
      console.log(document.getElementById('print-img').innerHTML);
      if (LODOP) {
        LODOP.PRINT_INIT('');
        LODOP.ADD_PRINT_HTM(0, 0, '100%', '100%', document.getElementById('print-img').innerHTML);
        LODOP.PREVIEW();
        // LODOP.PRINT();
      } else {
        setTimeout(() => {
          jQuery('font:first').attr('style', 'position: absolute;top: 50%;left: 50%;z-index: 1000;background: beige;padding: 10px;margin-top: -30px;margin-left: -227px;');
        }, 500);
      }
    },
    download() {
      let src = this.url;
      let canvas = document.createElement('canvas');
      let img = document.createElement('img');
      img.onload = function(e) {
        canvas.width = img.width;
        canvas.height = img.height;
        let context = canvas.getContext('2d');
        context.drawImage(img, 0, 0, img.width, img.height);
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        canvas.toBlob((blob) => {
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'aaa';
          link.click();
        }, 'image/jpeg');
      };
      img.setAttribute('crossOrigin', 'Anonymous');
      img.src = src;
    },
  },
  created() {
    this.getQRcode();
  }
};
</script>

<style lang="less" scoped>
@import '../../../styles/common.less';
.parscripeion{
  .title{
    margin-top: 100px;
    font-size: 22px;
    text-align: center;
  }
  .img{
    width: 400px;
    height: 400px;
    border: @line-border;
    margin: 50px auto;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .desctiom{
    width: 500px;
    margin: 20px auto;
    li{
      list-style: inside;
      margin-bottom: 10px;
    }
  }
  .download{
    width: 100px;
    height: 30px;
    border: @line-border;
    text-align: center;
    line-height: 30px;
    border-radius: 5px;
    margin: 10px auto;
    cursor: pointer;
  }
}

</style>
