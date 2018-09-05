<template>
  <div id="wmpWrapper">
    <auth v-if="$route.name === 'auth'"></auth>
    <login v-else-if="$route.name === 'login'"></login>
    <link-loading v-else-if="$route.name === 'loading'"></link-loading>
    <home v-else></home>
  </div>
</template>

<script>
import Vue from 'vue'
import Router from 'vue-router'
import home from './components/Home'
import Auth from './components/Common/Auth'
import Login from './components/Common/PopLogin'
import LinkLoading from './components/Common/LinkLoading'

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      el: '#wmpWrapper'
    },
    {
      path: '/auth',
      name: 'auth',
      el: '#wmpWrapper'
    },
    {
      path: '/login/:redirect',
      name: 'login',
      el: '#wmpWrapper'
    },
    {
      path: '/loading/:agent/:hotelName/:roomName/:description/:imageUrl/:linkUrl',
      name: 'loading',
      el: '#wmpWrapper'
    }
  ],
  mode: 'history'
})

Vue.use(Router)

export default {
  router,
  components: {
    home,
    Auth,
    LinkLoading,
    Login
  }
}
</script>
