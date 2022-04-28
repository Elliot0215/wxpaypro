import Vue from 'vue'
import Router from 'vue-router'
import QRCode from '@/components/QRCode'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'QRCode',
      component: QRCode
    }
  ]
})
