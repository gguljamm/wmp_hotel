<template>
  <div class="alertWrapper" @click="close">
    <div @click.stop>
      <div>
        <div>
          <div>알림</div>
          <div v-for="(x, index) in alert.message.split('<br>')" :key="index">{{ x }}</div>
        </div>
      </div>
      <div v-if="alert.type==='alert'" class="alert">
        <button @click="close">확인</button>
      </div>
      <div v-else-if="alert.type==='login'" class="login">
        <button @click="login">로그인 특가보기</button>
        <button @click="close">그냥보기</button>
      </div>
      <div v-else-if="alert.type==='loginHeader'" class="login">
        <button @click="login">로그인</button>
        <button @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../api/api'
export default {
  props: ['alert'],
  methods: {
    login () {
      let isApp = false
      const pUserAgentString = navigator.userAgent
      const lUaMatches = pUserAgentString.match(/(.*?)\/(.*?)\s\((.*?)\)(.*)/i)
      if (lUaMatches) {
        const key = lUaMatches[4]
        if (key.match(/wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 위메프 앱
          isApp = true
        } else if (key.match(/wshop\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 원더쇼핑 앱
          isApp = true
        }
      }
      const url = window.location.origin.indexOf('localhost') >= 0 ? window.location.href : `https://${window.location.host}${window.location.pathname}`
      this.close()
      if (isApp) {
        const loginUrl = `/login/${encodeURIComponent(url)}`
        window.open(loginUrl, '_self')
      } else {
        window.open(Api.isLoginCheck(encodeURIComponent(url)), '_self')
      }
    },
    close () {
      const close = this.alert.close
      this.alert.type = ''
      this.alert.message = ''
      this.alert.close = ''
      if (close === 'main') {
        this.$router.replace(`/${window.location.search}${window.location.hash}`)
      }
    }
  }
}
</script>

<style scoped>
  .alertWrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(38, 38, 40, .7);
    z-index: 21;
  }
  .alertWrapper > div{
    position: absolute;
    width: 296px;
    left: 50%;
    margin-left: -148px;
    top: 50%;
    height: 234px;
    margin-top: -117px;
    background-color: #FFF;
    text-align: center;
  }
  .alertWrapper > div > div:first-of-type{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 52px;
    right: 0;
  }
  .alertWrapper > div > div > div:first-of-type{
    font-size: 14px;
    color: #1a1a1c;
    padding: 0 36px;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  .alertWrapper > div > div > div:first-of-type > div:first-of-type{
    font-size: 20px;
    margin-bottom: 8px;
  }
  .alertWrapper > div > div:nth-of-type(2){
    height: 52px;
    font-size: 0;
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
  }
  .alertWrapper > div > div:nth-of-type(2) button{
    border: 0;
    box-shadow: inset 0 1px 0 0 #ebebeb;
    height: 52px;
    background-color: #FFF;
    font-size: 16px;
    color: #1a1a1c;
  }
  .alertWrapper > div > div:nth-of-type(2).alert > button{
    width: 100%;
  }
  .alertWrapper > div > div:nth-of-type(2).login > button{
    width: 50%;
    font-size: 14px;
  }
  .alertWrapper > div > div:nth-of-type(2).login > button:first-of-type{
    background-color: #1a1a1c;
    color: #FFF;
   }
</style>
