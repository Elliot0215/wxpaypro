<template>
  <div>
    <canvas id='QRCode_header'> </canvas>
    <el-button style="display:block;margin:0 auto" @click='getQRCode()'>获取付款码</el-button>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import axios from 'axios'
export default {
  name: 'QRCode',
  data () {
    return {
      msg: '微信支付'
    }
  },
  methods: {
    getQRCode () {
      let url = '/api/wxpay/native/4'
      axios.post(url).then((reponse) => {
        console.log(reponse)
        let opts = {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          quality: 0.3,
          margin: 12,
          width: 200,
          height: 180,
          text: reponse.data.data.codeUrl,
          color: {
            dark: '#1e1e1e',
            light: '#fff'
          }
        }
        this.QRCodeMsg = reponse.data.data.codeUrl
        let msg = document.getElementById('QRCode_header')
        QRCode.toCanvas(msg, this.QRCodeMsg, opts, function (error) {
          console.log(error)
        })
      })
    }
  }
}
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
