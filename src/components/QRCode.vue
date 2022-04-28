<template>
  <div>
    <canvas id='QRCode_header'> </canvas>
    <div>
      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="title"
          label="商品名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格(分)"
          width="180">
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="180">
        </el-table-column>
        <el-table-column
          prop="author"
          label="作者">
        </el-table-column>
      </el-table>
    </div>
    <div class="button_get">
      <el-button style="display:block;margin:0 auto" @click='getQRCode()'>获取付款码</el-button>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import axios from 'axios'
export default {
  name: 'QRCode',
  data () {
    return {
      tableData: [],
      selectIndex: ''
    }
  },
  methods: {
    handleSelectionChange (selection) {
      if (selection[0] !== undefined) {
        this.selectIndex = selection[0].id
      }
    },

    getTableData () {
      let url = '/api/product/list'
      this.tableData = []
      var that = this
      axios.get(url).then((reponse) => {
        console.log(reponse)
        that.tableData = reponse.data.data.productList
      })
    },

    getQRCode () {
      let url = '/api/wxpay/native/' + this.selectIndex
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
  },
  created () {
    this.getTableData()
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
.button_get {
  margin-top: 10px;
}
</style>
