<template>
  <div id="wmpHotel" :class="{
    scrollDown,
    topOut
  } ">
    <Header
      :isLogin="mid ? true : false"
      :historyLength="historyLength"
      :isFromApp="isFromApp"
      :iosPopFlag="iosPopFlag"
      :wishList="wishList"
      @pop-alert="popAlert"
      @close-pop="closePop"
    ></Header>
    <div class="page"
      ref="wmpHotel"
    >
      <transition name="fade" mode="out-in">
        <router-view
          :key="getParamKey"
          :hotelList="hotelList"
          :hotelIndex="hotelIndex"
          :filterInfo="filterInfo"
          :sortCondition="sortCondition"
          :listingCondition="listingCondition"
          :mid="mid"
          :mapList="mapList"
          :selectedHotel="selectedHotel"
          :popping="popping"
          :lastScrollTop="lastScrollTop"
          :isFromApp="isFromApp"
          :waterfallState="waterfallState"
          :iosPopFlag="iosPopFlag"
          :recentList="recentList"
          :wishList="wishList"
          :selectNumFromMap="selectNumFromMap"
          :wishLoading="wishLoading"
          @hotel-index-change="hotelIndexChange"
          @hotel-index-reset="hotelIndexReset"
          @reset-filter-info="resetFilterInfo"
          @change-selected-hotel="changeSelectedHotel"
          @change-list-condition="changeListCondition"
          @last-scroll-top-change="lastScrollTopChange"
          @open-pop="openPop"
          @close-pop="closePop"
          @pop-alert="popAlert"
          @set-waterfall-state="setWaterfallState"
          @clear-waterfall-state="clearWaterfallState"
          @reset-recent-search="resetRecentSearch"
          @recent-del="recentDel"
        />
      </transition>
      <recent-search
        v-if="$route.params.popFlag === 'recentSearch' || iosPopFlag === 'recentSearch'"
        :recentList="recentList"
        @close-pop="closePop"
        @recent-del="recentDel"
      ></recent-search>
    </div>
    <iframe class="hide" v-if="iswmpapp" :src="wmpLoginUrl"></iframe>
    <iframe class="hide" v-if="$route.name !== 'auth' && !iswmpapp" :src="loginCheckUrl"></iframe>
    <Footer
      :mid="mid"
      :isFromApp="isFromApp"
      @pop-alert="popAlert"
      @open-pop="openPop"
    ></Footer>
    <alert
      v-if="alert.type === 'alert' || (alert.type === 'login' && !mid) || alert.type === 'loginHeader'"
      :alert="alert"
    ></alert>
  </div>
</template>

<script>
import Vue from 'vue'
import Router from 'vue-router'
import Search from './Search/Wrapper'
import HotelList from './HotelList/Wrapper'
import Detail from './Detail/Wrapper'
import Book from './Book/Wrapper'
import VueCookies from 'vue-cookies'
import Header from './Common/Header'
import Footer from './Common/Navigator'
import Error from './Common/Error'
import Oops from './Common/Oops'
import Api from '../api/api'
import Format from '../util/format'
import Alert from './Common/Alert'
import RecentSearch from './Common/RecentSearch'
import WishList from './WishList/Wrapper'
// import DeviceInfo from '../util/bp-device-info'

window.EventBus = new Vue()

const router = new Router({
  routes: [
    {
      path: '/:popFlag(destination|date|option|recentSearch)?',
      name: 'search',
      component: Search
    },
    {
      path: '/hotelList/:destination/:checkin/:checkout/:adults/:children/:room/:popFlag(search|map|filter|sort|destination|date|option|image|recentSearch)?',
      name: 'hotelList',
      component: HotelList
    },
    {
      path: '/detail/:destination/:checkin/:checkout/:adults/:children/:room/:hotelKey/:popFlag(image|recentSearch)?',
      name: 'detail',
      component: Detail
    },
    {
      path: '/book',
      name: 'book',
      component: Book
    },
    {
      path: '/oops',
      name: 'oops',
      component: Oops
    },
    {
      path: '/wish/:popFlag(image|recentSearch)?',
      name: 'wish',
      component: WishList
    },
    {
      path: '/*',
      name: '404',
      component: Error
    }
  ],
  mode: 'history'
})

router.afterEach((to, from) => {
  if (this.iosPopFlag !== 'map') {
    this.iosPopFlag = false
  }
  if (to.query.isStack) { // stack 으로 올린 것들은 중복을 방지하가 위해 return함
    return
  }
  if (window.gtm) {
    window.gtm.push({ event: 'nuxtRoute', pageType: 'PageView', pageUrl: to.fullPath })
  }
})

Vue.use(VueCookies)

export default {
  router,
  components: {
    Header,
    Footer,
    Alert,
    RecentSearch
  },
  data () {
    return {
      hotelList: {
        param: '',
        searchTime: '',
        list: [],
        totalCount: 0
      },
      hotelIndex: 0,
      filterInfo: {},
      sortCondition: 'BEST',
      mid: false,
      mapList: [],
      selectedHotel: {},
      listingCondition: 'list',
      loginCheckUrl: Api.isLoginCheck(),
      wmpLoginUrl: Api.wmpLoginUrl(),
      format: Format,
      historyLength: 0,
      scrollDown: false,
      lastScroll: 0,
      topOut: false,
      popping: false,
      lastScrollTop: 0,
      iswmpapp: false,
      isFromApp: false,
      alert: {
        type: '',
        message: ''
      },
      waterfallState: null,
      iosPopFlag: false,
      recentList: [],
      wishList: [],
      selectNumFromMap: -1,
      wishLoading: true
    }
  },
  computed: {
    getParamKey () {
      const key = []
      Object.keys(this.$route.params).forEach((x) => {
        if (x !== 'popFlag') {
          key.push(this.$route.params[x])
        }
      })
      return key.join('/')
    }
  },
  watch: {
    mid () {
      this.getWishHotel()
    }
  },
  methods: {
    popAlert (type, message, close) {
      this.alert.type = type
      this.alert.message = message
      this.alert.close = close
    },
    changeListCondition () {
      if (this.listingCondition === 'card') {
        this.listingCondition = 'list'
      } else {
        this.listingCondition = 'card'
      }
      if (this.listingCondition === 'card' && typeof window.orientation === 'undefined') {
        this.popAlert('alert', '모바일에 최적화된 화면입니다.')
      }
    },
    resetFilterInfo (filterInfo, sortCondition, list) {
      window.scrollTo(0, 0)
      this.filterInfo = filterInfo || {
        categories: [],
        stars: [],
        amenity: [],
        maxPrice: '',
        minPrice: ''
      }
      this.sortCondition = sortCondition || 'BEST'
      this.hotelList.param = ''
      this.hotelList.searchTime = ''
      this.hotelList.list = []
      this.hotelList.totalCount = 0
      this.hotelIndexReset(0)
      this.mapList = []
      this.selectedHotel = {}
      this.lastScrollTop = 0
      this.listingCondition = list || 'list'
      this.selectNumFromMap = -1
    },
    hotelIndexChange (num) {
      this.hotelIndex += num
    },
    hotelIndexReset (num) {
      this.hotelIndex = parseInt(num, 10)
    },
    changeSelectedHotel (hotelInfo) {
      this.selectedHotel = hotelInfo
    },
    openPop (flag) {
      if (this.isAppleSafari()) {
        this.iosPopFlag = flag
      } else {
        let path = this.$route.path
        if (this.$route.params.popFlag) {
          const arrPath = path.split('/')
          arrPath.pop()
          path = arrPath.join('/')
        }
        let url = `${path}/${flag}${window.location.search}${window.location.hash}`
        if (this.$route.path[this.$route.path.length - 1] === '/') {
          url = `${path}${flag}${window.location.search}${window.location.hash}`
        }
        this.$router.push(
          url
        )
        this.popping = 'open'
        setTimeout(() => {
          this.popping = false
          this.historyLength += 1
        }, 150)
      }
    },
    closePop () {
      if (this.isAppleSafari()) {
        if (this.$route.name === 'hotelList' && ['destination', 'date', 'option'].indexOf(this.iosPopFlag) >= 0) {
          this.iosPopFlag = 'search'
        } else {
          if (this.$route.params.popFlag && !this.iosPopFlag) {
            const arrPath = this.$route.path.split('/')
            arrPath.pop()
            this.$router.replace(
              `${arrPath.join('/') || '/'}${window.location.search}${window.location.hash}`
            )
          } else {
            this.iosPopFlag = false
          }
        }
      } else {
        if (!this.popping) {
          this.popping = 'close'
          setTimeout(() => {
            this.popping = false
            if (this.historyLength > 0) {
              window.history.back(1)
              this.historyLength -= 1
            } else {
              const objParams = this.$route.params
              if (objParams.popFlag) {
                const arrPath = this.$route.path.split('/')
                arrPath.pop()
                this.$router.replace(
                  `${arrPath.join('/') || '/'}${window.location.search}${window.location.hash}`
                )
              } else {
                this.$router.replace(`/${window.location.search}${window.location.hash}`)
              }
            }
          }, 150)
        }
      }
    },
    bodyScroll (e) {
      if (this.lastScroll < window.pageYOffset) {
        this.scrollDown = true
        if (window.pageYOffset > 50) {
          this.topOut = true
        } else {
          this.topOut = false
        }
      } else {
        this.scrollDown = false
        this.topOut = false
      }
      if (window.pageYOffset <= 0) {
        this.scrollDown = false
      }
      this.lastScroll = window.pageYOffset
    },
    lastScrollTopChange (resp) {
      this.lastScrollTop = resp || 0
    },
    setWaterfallState (state) {
      this.waterfallState = state
    },
    clearWaterfallState () {
      this.waterfallState = null
    },
    isAppleSafari () {
      const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/) // eslint-disable-line
      const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      if (isSafari && iOS) {
        return true
      } else {
        return false
      }
    },
    recentDel (index) {
      this.recentList.splice(index, 1)
      this.$cookies.set('bphotels', JSON.stringify(this.recentList), '30d', '/')
    },
    resetRecentSearch () {
      const recent = this.$cookies.get('bphotels')
      this.recentList = []
      if (recent) {
        const parseRecent = JSON.parse(recent)
        for (let x = parseRecent.length - 1; x >= 0; x -= 1) {
          this.recentList.push(parseRecent[x])
        }
      }
    },
    getWishHotel () {
      this.wishLoading = true
      Api.getWishHotel(this.mid).then((resp) => {
        this.wishLoading = false
        this.wishList = []
        if (resp.data.length > 0) {
          for (let x = 0; x < resp.data.length; x += 1) {
            this.wishList.push(resp.data[x])
          }
        }
      }).catch((e) => {
        this.wishLoading = false
        this.wishList = []
      })
    },
    addWishHotel (hotelInfo, obj) {
      if (this.mid) {
        const newObj = {
          destination: this.$route.params.destination,
          checkin: obj.checkin,
          checkout: obj.checkout,
          childrenAge: obj.children.join(','),
          id: '',
          mid: '',
          numAdult: obj.adults,
          numChildren: obj.children.length,
          numRoom: obj.room,
          price: parseInt(hotelInfo.rooms[0].totalPrice, 10),
          wonderHotelInfoId: hotelInfo.hotelId
        }
        Api.addWishHotel(this.mid, newObj).then((resp) => {
          if (resp.data !== -1) {
            this.popAlert('alert', '찜하기목록에 추가되었습니다.')
            this.getWishHotel()
          } else {
            this.popAlert('alert', '찜하기는 최대 10개까지 가능합니다.')
          }
        }).catch((e) => {
          this.popAlert('alert', '찜하기가 실패하였습니다. 확인 후 다시 시도해주세요.')
        })
      } else {
        document.getElementById('wmpHotelMenu').click()
      }
    },
    delWishHotel (hotelId) {
      for (let x = 0; x < this.wishList.length; x += 1) {
        if (this.wishList[x].wonderHotelInfoId === hotelId) {
          const delId = this.wishList[x].id
          Api.delWishHotel(this.mid, delId).then((resp) => {
            if (resp.data) {
              this.wishList.splice(x, 1)
              this.popAlert('alert', '찜하기목록에서 삭제되었습니다.')
            }
          })
          break
        }
      }
    },
    changeSelectNumFromMap (index) {
      this.selectNumFromMap = index
    },
    resetSelectedHotel () {
      this.selectedHotel = {}
    }
  },
  mounted () {
    window.EventBus.$on('popAlert', this.popAlert)
    window.EventBus.$on('getWishHotel', this.getWishHotel)
    window.EventBus.$on('addWishHotel', this.addWishHotel)
    window.EventBus.$on('delWishHotel', this.delWishHotel)
    window.EventBus.$on('change-select-num-from-map', this.changeSelectNumFromMap)
    window.EventBus.$on('reset-selected-hotel', this.resetSelectedHotel)
    this.lastScroll = window.pageYOffset
    this.resetFilterInfo()
    // const deviceInfo = DeviceInfo.deviceInfo(window)
    // console.log(deviceInfo)
    window.addEventListener('scroll', this.bodyScroll)
    document.getElementById('beforeLoading').style.display = 'none'
    document.getElementById('beforeLoading2').style.display = 'none'
  },
  destroyed () {
    window.removeEventListener('scroll', this.bodyScroll)
  },
  created () {
    if (window.location.href.indexOf('access_token') >= 0) {
      if (window.parent) {
        window.parent.location.href = window.location.href
      }
    }
    const pUserAgentString = navigator.userAgent
    const lUaMatches = pUserAgentString.match(/(.*?)\/(.*?)\s\((.*?)\)(.*)/i)
    if (lUaMatches) {
      const key = lUaMatches[4]
      if (key.match(/wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 위메프 앱
        this.iswmpapp = true
        this.isFromApp = true
      } else if (key.match(/wshop\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 원더쇼핑 앱
        this.isFromApp = true
      }
    }
    if (this.iswmpapp && (location.href.indexOf('is_login=true') >= 0 || location.href.indexOf('isLogin=true') >= 0)) {
      this.iswmpapp = false
    }
  }
}
</script>

<style scoped>
  .hide{
    position: absolute;
    height: 0;
    width: 0;
    left: -9999px;
    overflow: hidden;
  }
</style>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab');
  @import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);
  #wmpHotel{
    color: #333;
    overflow: hidden;
  }
  #wmpHotel .scrollable{
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  #wmpHotel > div.page{
    height: 100%;
    position: relative;
    padding-top: 48px;
  }
  #wmpHotel .roboto{
    font-family: 'Roboto Slab', serif !important;
  }
  #wmpHotel .signal{
    font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif !important;
  }
  #wmpHotel * {
    box-sizing: border-box;
    touch-action: manipulation;
    font-family: 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif;
  }
  ul, li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  button {
    padding: 0;
    background: none;
    border: 0;
    cursor: pointer;
    user-select: none;
  }
  button:focus{
    outline: none;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
