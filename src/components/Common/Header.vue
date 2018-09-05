<template>
  <div class="header" :class="isPopping">
    <div @click="historyBack"></div>
    <span @click="home">{{ $route.name === 'wish' ? '찜한 호텔' : '원더호텔' }}</span>
    <span v-if="$route.name === 'wish' && wishList.length > 0">({{ wishList.length }})</span>
    <a id="wmpHotelMenu" :class="isLogin ? 'on' : ''" @click="loginUri"></a>
  </div>
</template>

<script>
import Api from '../../api/api'
export default {
  props: ['isLogin', 'historyLength', 'isFromApp', 'iosPopFlag', 'wishList'],
  computed: {
    isPopping () {
      return this.iosPopFlag || this.$route.params.popFlag ? 'fixed' : ''
    }
  },
  methods: {
    historyBack () {
      if (this.$route.path === '/' && this.isFromApp) {
        location.href = 'wemakeprice://doEvent?cmd=close'
      } else {
        if (this.$route.name === 'detail' && this.iosPopFlag === 'map') {
          window.history.back(1)
        } else if (this.iosPopFlag) {
          this.$emit('close-pop')
        } else {
          window.history.back(1)
        }
      }
    },
    home () {
      this.$router.push(
        `/${window.location.search}${window.location.hash}`
      )
    },
    loginUri () {
      if (!this.isLogin) {
        this.$emit('pop-alert', 'loginHeader', '로그인이 필요한 서비스입니다.<br>로그인 하시겠습니까?')
      } else {
        const url = Api.mypageUrl()
        // const pUserAgentString = navigator.userAgent
        // const lUaMatches = pUserAgentString.match(/(.*?)\/(.*?)\s\((.*?)\)(.*)/i)
        // if (lUaMatches) {
        //   const key = lUaMatches[4]
        //   if (key.match(/wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 위메프 앱
        //     const obj = {
        //       name: '',
        //       value: `${url}&__wspview_type=40`,
        //       type: 22
        //     }
        //     location.href = `wemakeprice://doEvent?wemakeprice_json_action=${encodeURIComponent(JSON.stringify(obj))}`
        //     return
        //   } else if (key.match(/wshop\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 원더쇼핑 앱
        //     const obj = {
        //       image: '',
        //       message: '',
        //       title: '',
        //       type: 'search',
        //       url: `${url}`
        //     }
        //     location.href = `wshop://webview?cmd_id=1&json=${encodeURIComponent(JSON.stringify(obj))}`
        //     return
        //   }
        // }
        let isOldApp = false
        const pUserAgentString = navigator.userAgent
        const lUaMatches = pUserAgentString.match(/(.*?)\/(.*?)\s\((.*?)\)(.*)/i)
        if (lUaMatches) {
          const key = lUaMatches[4]
          if (key.match(/wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 위메프 앱
            if (key.match(/wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)[0].split('/')[1] === '4.33.0') { // 4.33.0 버전 체크
              isOldApp = true
            }
          }
        }
        if (isOldApp) {
          const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
          if (iOS) {
            if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.getWebViewType && window.webkit.messageHandlers.getWebViewType.postMessage &&
              (window.webkit.messageHandlers.getWebViewType.postMessage() === 40 || window.webkit.messageHandlers.getWebViewType.postMessage() === 10 ||
              window.webkit.messageHandlers.getWebViewType.postMessage() === '40' || window.webkit.messageHandlers.getWebViewType.postMessage() === '10')
            ) {
              window.open(url, '_blank')
              return
            }
          }
          location.href = `?cmd=open_web&url=${encodeURIComponent(url)}&title=${encodeURIComponent('원더호텔')}&type=0&animate=push`
        } else {
          window.open(url, '_blank')
        }
      }
    }
  }
}
</script>

<style scoped>
  .header{
    height: 48px;
    line-height: 48px;
    background-color: #1A1A1C;
    color: #fff;
    text-align: center;
    font-size: 20px;
    font-weight: normal;
    position: fixed;
    width: 100%;
    z-index: 10;
    transition: transform .3s ease;
  }
  .topOut .header{
    transform: translateY(-48px);
  }
  .header.fixed{
    transform: translateY(0) !important;
  }
  .header > div{
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
    top: 0;
    width: 48px;
    height: 48px;
    cursor: pointer;
  }
  .header > div:first-of-type{
    left: 8px;
    background-image: url(../../assets/clamp_white.svg);
  }
  .header > a{
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
    top: 0;
    width: 48px;
    height: 48px;
    cursor: pointer;
    right: 8px;
    background-image: url(../../assets/user.svg);
  }
  .header > a.on{
    width: 32px;
    height: 32px;
    top: 8px;
    right: 16px;
    background-color: #ff7e55;
    border-radius: 100%;
    background-size: 18px;
  }
  .header > a.on:after{
    content: 'ON';
    position: absolute;
    color: #ff7e55;
    width: 24px;
    height: 14px;
    font-size: 10px;
    line-height: 14px;
    right: -8px;
    top: 0;
    background-color: #FFF;
    border-radius: 10px;
    transform: scale(.7);
    font-weight: bold;
  }
  .header span{
    cursor: pointer;
  }
</style>
