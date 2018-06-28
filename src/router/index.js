import Vue from 'vue'
import Router from 'vue-router'
import Search from '@/components/Search/Wrapper'
import HotelList from '@/components/HotelList/Wrapper'
import Detail from '@/components/Detail/Wrapper'
import Book from '@/components/Book/Wrapper'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:popFlag?',
      name: 'search',
      component: Search
    },
    {
      path: '/hotelList/:destination/:checkin/:checkout/:adults/:children/:room',
      name: 'hotelList',
      component: HotelList
    },
    {
      path: '/detail/:key',
      name: 'detail',
      component: Detail
    },
    {
      path: '/book',
      name: 'book',
      component: Book
    }
  ]
})
