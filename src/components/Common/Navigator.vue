<template>
  <div class="footer">
    <div>
      <!--<a href="https://login.pre.wonders.app/wauth/authorize?response_type=token&client_id=wonderhotel_gdfrF_vVTh&state=kkkk1234&redirect_uri=http://localhost:8080">로그인</a>-->
      <!--<button @click="login" style="color: #FFF;">정보가져오기</button>-->
      <button @click="isFromApp ? close() : ''" :class="isFromApp ? 'active' : 'disable'"></button>
      <button @click="historyBack"></button>
      <button @click="home"></button>
      <button @click="wishList"></button>
      <button @click="recentList"></button>
      <button @click="share"></button>
    </div>
  </div>
</template>

<script>
import Api from '../../api/api'
import Format from '../../util/format'

export default {
  props: ['isFromApp', 'mid'],
  methods: {
    historyBack () {
      window.history.back(1)
    },
    home () {
      this.$router.push(
        `/${window.location.search}${window.location.hash}`
      )
    },
    recentList () {
      this.$emit('open-pop', 'recentSearch')
    },
    wishList () {
      if (!this.mid) {
        this.$router.push(
          `/wish${window.location.search}${window.location.hash}`
        )
      } else {
        document.getElementById('wmpHotelMenu').click()
      }
    },
    myPage () {
      window.open('http://www-stg.wonder-shopping.com/mypage/reservation/?svc=hotel', '_self')
    },
    share () {
      alert ('공유하기')
      return
      let obj = {}
      if (this.$route.name === 'hotelList') {
        const period = Format.getBetweenDay(this.$route.params.checkin, this.$route.params.checkout)
        obj = {
          title: `원더호텔 - ${this.$route.params.destination.split('|')[0]}`,
          description: `${this.$route.params.checkin} ~ ${this.$route.params.checkout} ${period}박 ${period + 1}일`,
          url: window.location.href.indexOf('?') >= 0 ? window.location.href.split('?')[0] : window.location.href.split('#')[0]
        }
      } else if (this.$route.name === 'detail') {
        const period = Format.getBetweenDay(this.$route.params.checkin, this.$route.params.checkout)
        obj = {
          title: `원더호텔 - ${document.getElementById('selectedHotelName').innerText}`,
          description: `${this.$route.params.checkin} ~ ${this.$route.params.checkout} ${period}박 ${period + 1}일`,
          url: window.location.href.indexOf('?') >= 0 ? window.location.href.split('?')[0] : window.location.href.split('#')[0]
        }
      } else {
        obj = {
          title: '원더호텔',
          description: '검색하기',
          url: window.location.origin
        }
      }
      obj.imageUrl = 'https://www.wonder-shopping.com/static/img/p/logo.png'
      console.log(obj)
      Api.kakaoShare(obj)
    },
    close () {
      location.href = 'wemakeprice://doEvent?cmd=close'
    }
  }
}
</script>

<style scoped>
  .footer{
    height: 48px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    overflow: hidden;
  }
  .footer > div{
    width: 100%;
    display: flex;
    height: 48px;
    background-color: #1a1a1c;
    transition: .3s ease;
    position: relative;
  }
  .scrollDown .footer, .scrollDown .footer *{
    pointer-events: none;
  }
  .scrollDown .footer > div{
    transform: translateY(48px);
  }
  .footer > div > button{
    flex: 1 0 48px;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
  }
  .footer > div > button.disable{
    opacity: .5;
  }
  .footer > div > button:first-of-type{
    background-image: url(../../assets/close_white.svg);
  }
  .footer > div > button:nth-of-type(2){
    background-image: url(../../assets/clamp_white.svg);
  }
  .footer > div > button:nth-of-type(3){
    background-image: url(../../assets/home.svg);
  }
  .footer > div > button:nth-of-type(4){
    background-image: url(../../assets/heart.svg);
  }
  .footer > div > button:nth-of-type(5){
    background-image: url(../../assets/time.svg);
    fill: #FFF;
  }
  .footer > div > button:nth-of-type(6){
    background-image: url(../../assets/share.svg);
  }
</style>
