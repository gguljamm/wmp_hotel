// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './WonderHotel'
import VueVirtualWaterfall from 'vue-virtual-waterfall'
import VueClipboard from 'vue-clipboard2'
import * as VueGoogleMaps from 'vue2-google-maps'

VueClipboard.config.autoSetContainer = true

Vue.use(VueVirtualWaterfall)
Vue.use(VueClipboard)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDCnnPFWN6CZe3NLlBc_aJI90RZyfltxrg',
    libraries: 'places'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
window.bpVue = new Vue({
  el: '#wonderHotel',
  components: { App },
  template: '<App/>'
})
