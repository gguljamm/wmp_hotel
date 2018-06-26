import Vue from 'vue'
import Router from 'vue-router'
import Search from '@/components/Search/Wrapper'
import HotelList from '@/components/HotelList/Wrapper'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'search',
      component: Search
    },
    {
      path: '/hotelList/:destination/:checkin/:checkout/:adults/:children/:room',
      name: 'hotelList',
      component: HotelList
    }
  ]
})
