<template>
  <el-container>
    <el-aside width="200px">菜单</el-aside>
    <el-container>
        <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
          <template slot="title">我的工作台</template>
          <el-menu-item index="2-1">选项1</el-menu-item>
          <el-menu-item index="2-2">选项2</el-menu-item>
          <el-menu-item index="2-3">选项3</el-menu-item>
          <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
          </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
        </el-menu>
      <el-main>
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
      </el-main>
      <el-footer>浙ICP备20009552号 © 2022二月科技有限公司 <a href="https://beian.miit.gov.cn/" target="_blank" class="text-col-3 mx-2 blue">浙ICP备20009552号-7</a></el-footer>
    </el-container>
  </el-container>
</template>

<script>
import QRCode from 'qrcode'
import axios from 'axios'
export default {
  name: 'QRCode',
  data () {
    return {
      tableData: [],
      selectIndex: '',
      orderNo: ''
    }
  },
  methods: {
    queryOrderStatus () {
      let url = '/api/orderInfo/query-order-status/' + this.orderNo
      axios.get(url).then((reponse) => {
        console.log(reponse.data.message)
        if (reponse.data.message === '成功' && reponse.data.code === 0) {
          // alert('支付成功')
          this.$message.success('支付成功')
          clearInterval(this.timer)
        }
      })
    },
    // 选择器事件处理
    handleSelectionChange (selection) {
      console.log(selection)
      if (selection[0] !== undefined) {
        this.selectIndex = selection[0].id
      } else {
        this.selectIndex = ''
      }
    },
    // 获取商品列表
    getTableData () {
      let url = '/api/product/list'
      this.tableData = []
      var that = this
      axios.get(url).then((reponse) => {
        console.log(reponse)
        that.tableData = reponse.data.data.productList
      })
    },
    // 获取对应商品的支付二维码
    getQRCode () {
      console.log('selectIndex:' + this.selectIndex)
      if (this.selectIndex === '') {
        alert('请选择商品')
        return
      }
      let url = '/api/wx-pay/native/' + this.selectIndex
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
        this.orderNo = reponse.data.data.orderNo
        let msg = document.getElementById('QRCode_header')
        QRCode.toCanvas(msg, this.QRCodeMsg, opts, function (error) {
          console.log(error)
        })
      })
      this.timer = setInterval(() => {
        this.queryOrderStatus()
      }, 3000)
    }
  },
  // 调用
  created () {
    this.getTableData()
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
body > .el-container {
  margin-bottom: 40px;
}
.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}
.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.button_get {
  margin-top: 10px;
}
</style>
