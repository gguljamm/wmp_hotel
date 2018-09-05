<template>
  <div>
    <button class="wishBtn"
      @click.stop="computedWishList.indexOf(hotelInfo.hotelId) >= 0 ? delWish(hotelInfo.hotelId) : addWish(hotelInfo)"
      :class="computedWishList.indexOf(hotelInfo.hotelId) >= 0 ? 'selected' : ''"></button>
    <div class="imgContainer"
      :style="{
        'background-image': getBg
      }"
    ><div></div></div>
    <div class="infoWrapper" ref="wrapper">
      <div ref="content" :style="{'margin-top': `-${scrollTop}px`}">
        <div class="hotelInfo" @click="submit()">
          <div>{{ hotelInfo.name }}</div>
          <div>{{ hotelInfo.address }}</div>
          <div>
            <span class="starWrapper" v-if="hotelInfo.star"><span class="star" v-for="x in parseInt(hotelInfo.star, 10)" :key="x"></span></span>
            <span v-if="hotelInfo.rating"><span v-if="!hotelInfo.numberOfReviews || !hotelInfo.star">평점: </span>{{ hotelInfo.rating * 2 }}</span>
            <span v-if="hotelInfo.numberOfReviews" class="thin"> ({{ format.numberFormat(hotelInfo.numberOfReviews) }}개 리뷰)</span>
          </div>
          <button class="imgMore"
            v-if="Array.isArray(hotelInfo.imageUrls) && hotelInfo.imageUrls.length > 1"
            @click.stop="$emit('open-pop', 'image')"
          >1/{{ hotelInfo.imageUrls.length }}</button>
        </div>
        <div class="agentList">
          <ul>
            <li
              v-for="(x, index) in getRoomPerAgent(hotelInfo.rooms)"
              :key="index"
              @click="exit(x)"
            ><button>
              <div><span class="signal">₩</span><span class="roboto">{{ format.numberFormat(parseInt(x.totalPrice)) }}</span></div>
              <div>1박평균 <span class="signal">₩</span><span class="roboto">{{ format.numberFormat(parseInt(x.pricePerNight)) }}</span></div>
              <div class="logo" :class="getClass(x.hotelVendorKind)"></div>
            </button></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Format from '../../util/format'
import Api from '../../api/api'
export default {
  props: ['index', 'hotelInfo', 'inputData', 'scrollTop', 'isPresent', 'mid', 'isFromApp', 'computedWishList'],
  data () {
    return {
      format: Format
    }
  },
  computed: {
    getBg () {
      return `url(${Array.isArray(this.hotelInfo.imageUrls) ? this.hotelInfo.imageUrls[0] : this.hotelInfo.imageUrls})`
    }
  },
  methods: {
    getPricePerDay (price) {
      return this.format.numberFormat(parseInt(price / this.format.getBetweenDay(this.inputData.checkin, this.inputData.checkout)))
    },
    getClass (vendorName) {
      let className = 'expedia'
      if (vendorName === 'BOOKING_DOT_COM') {
        className = 'booking'
      } else if (vendorName === 'AGODA') {
        className = 'agoda'
      }
      return className
    },
    getRoomPerAgent (roomList) {
      const agentList = []
      const returnList = []
      // 밴더당 최저가 1개
      for (let x = 0; x < roomList.length; x += 1) {
        if (agentList.indexOf(roomList[x].hotelVendorKind) < 0) {
          agentList.push(roomList[x].hotelVendorKind)
          returnList.push(roomList[x])
        }
      }
      // 동일 가격일 때, 부킹 -> 익스 -> 아고다 순서
      returnList.sort((a, b) => {
        if (a.totalPrice - b.totalPrice < 0) {
          return -1
        } else if (a.totalPrice - b.totalPrice > 0) {
          return 1
        }
        if (a.hotelVendorKind === 'BOOKING_DOT_COM' && (b.hotelVendorKind === 'AGODA' || b.hotelVendorKind === 'EXPEDIA')) {
          return -1
        } else if (a.hotelVendorKind === 'EXPEDIA' && b.hotelVendorKind === 'AGODA') {
          return -1
        } else {
          return 1
        }
      })
      return returnList
    },
    submit () {
      this.$emit('submit', this.hotelInfo)
    },
    exit (exitInfo) {
      if (this.mid) {
        const obj = {
          checkin: this.inputData.checkin,
          checkout: this.inputData.checkout,
          childrenAge: this.inputData.children.join(','),
          numAdult: this.inputData.adults,
          numChildren: this.inputData.children.length,
          numRoom: this.inputData.room,
          price: exitInfo.totalPrice,
          resultUrl: exitInfo.listUrl,
          searchedPlace: this.inputData.destination.cityName,
          uuid: exitInfo.uuid,
          vendor: exitInfo.hotelVendorKind,
          wonderHotelInfoId: exitInfo.hotelId
        }
        Api.sendLog(this.mid, obj)
        let description = ''
        description += `${this.format.dateFormat(this.inputData.checkin)} - ${this.format.dateFormat(this.inputData.checkout)} / `
        description += `${this.format.getBetweenDay(this.inputData.checkin, this.inputData.checkout)}박 | `
        description += `성인 ${this.inputData.adults}명, `
        if (this.inputData.children.length > 0) {
          description += `어린이 ${this.inputData.children.length}명, `
        }
        description += `객실 ${this.inputData.room}개`
        const arrParam = [
          exitInfo.hotelVendorKind === 'AGODA' ? 'agoda' : (exitInfo.hotelVendorKind === 'EXPEDIA' ? 'expedia' : 'booking'),
          encodeURIComponent(this.hotelInfo.name),
          encodeURIComponent(exitInfo.name),
          encodeURIComponent(description),
          encodeURIComponent(this.hotelInfo.imageUrls[0]),
          encodeURIComponent(exitInfo.listUrl)
        ]
        let url = `${window.location.origin}/loading/${arrParam.join('/')}`
        const pUserAgentString = navigator.userAgent
        const lUaMatches = pUserAgentString.match(/(.*?)\/(.*?)\s\((.*?)\)(.*)/i)
        if (lUaMatches) {
          const key = lUaMatches[4]
          if (key.match(/wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 위메프 앱
            const obj = {
              name: '원더호텔',
              value: url,
              type: 22
            }
            location.href = `wemakeprice://doEvent?wemakeprice_json_action=${encodeURIComponent(JSON.stringify(obj))}`
            return
          } else if (key.match(/wshop\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 원더쇼핑 앱
            const obj = {
              image: '',
              message: '',
              title: '원더호텔',
              type: 'externallink',
              url: url
            }
            location.href = `wshop://webview?cmd_id=1&json=${encodeURIComponent(JSON.stringify(obj))}`
            return
          }
        }
        window.open(url, '_blank')
      } else {
        document.getElementById('wmpHotelMenu').click()
      }
    },
    addWish (item) {
      window.EventBus.$emit('addWishHotel', item, this.inputData)
    },
    delWish (hotelId) {
      window.EventBus.$emit('delWishHotel', hotelId)
    }
  },
  mounted () {
    if (this.isPresent) {
      this.$emit('set-client-height', this.$refs.content.clientHeight)
    }
  }
}
</script>

<style scoped>
  .imgContainer{
    width: 100%;
    padding-bottom: 80%;
    background-size: cover;
    position: relative;
    background-position: center center;
  }
  .imgContainer > div:first-of-type{
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 250px;
    background-image: linear-gradient(to bottom, rgba(92, 110, 124, 0), #b18e79);
  }
  .infoWrapper{
    position:absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }
  .hotelInfo{
    padding: 180px 20px 0;
    position: relative;
  }
  .hotelInfo > *{
    color: #FFF;
  }
  .hotelInfo > div:first-of-type {
    font-size: 20px;
    font-weight: 500;
  }
  .hotelInfo > div:nth-of-type(2){
    font-size: 12px;
    letter-spacing: -.3px;
    margin-top: 4px;
    line-height: 17px;
    font-weight: 400;
  }
  .hotelInfo > div:nth-of-type(3){
    margin-top: 7px;
    font-size: 12px;
    letter-spacing: -.3px;
  }
  .hotelInfo > div:nth-of-type(2):before{
    width: 13px;
    height: 15px;
    float: left;
    content: '';
    margin-right: 5px;
    background: url(../../assets/location.svg) no-repeat;
  }
  .hotelInfo button.imgMore{
    position: absolute;
    right: 20px;
    bottom: 0;
    line-height: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    background-color: transparent;
    font-size: 12px;
  }
  .hotelInfo > button.imgMore:after{
    content: '';
    display: block;
    width: 22px;
    height: 22px;
    float: right;
    background-image: url(../../assets/plus.svg);
    margin-left: 4px;
  }
  .starWrapper{
    margin-right: 5px;
  }
  .starWrapper:after{
    content: '|';
    color: rgba(255, 255, 255, .3);
    margin-left: 5px;
  }
  .hotelInfo .star{
    margin-top: 4px;
    margin-right: 6px;
    float: left;
    width: 13px;
    height: 13px;
    background: url(../../assets/star.svg) no-repeat;
  }
  .hotelInfo .star:last-of-type{
    margin-right: 0;
  }
  .hotelInfo .thin{
    font-weight: 400;
  }
  .agentList{
    padding: 16px 20px 82px;
  }
  .agentList > ul > li > button{
    background-color: #EFF0F2;
    width: 100%;
    height: 74px;
    border-radius: 3px;
    margin-bottom: 4px;
    border: 0;
    padding: 0;
    position: relative;
    text-align: left;
    padding-left: 20px;
    font-weight: normal;
  }
  .agentList > ul > li:last-of-type > button{
    margin-bottom: 0;
  }
  .agentList > ul > li > button .logo{
    height: 20px;
    right: 18px;
    top: 30px;
    position: absolute;
    background-size: contain;
    background-repeat: no-repeat;
    width: 80px;
    background-position: right center;
  }
  .agentList > ul > li > button .logo.agoda{
    background-image: url(../../assets/vendor_agoda.svg)
  }
  .agentList > ul > li > button .logo.booking{
    background-image: url(../../assets/vendor_booking.png)
  }
  .agentList > ul > li > button .logo.expedia{
    background-image: url(../../assets/vendor_expedia.svg)
  }
  .agentList > ul > li > button > div:first-of-type{
    font-size: 24px;
    letter-spacing: -.5px;
    color: #111;
  }
  .agentList > ul > li > button > div:nth-of-type(2){
    font-size: 12px;
    color: #999;
  }
  .wishBtn{
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    z-index: 6;
    opacity: 0.9;
    background-color: rgba(26, 26, 28, 0.4);
    border: solid 1px rgba(26, 26, 28, 0.1);
    border-radius: 16px;
  }
  .wishBtn:before{
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: url(../../assets/heart.svg);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 20px;
  }
  .wishBtn.selected{
    opacity: 0.8;
    border: none;
    background-image: linear-gradient(315deg, #e26130, #efb07c);
  }
  .wishBtn.selected:before{
    background-image: url(../../assets/heart.svg);
    background-repeat: no-repeat;
    background-position: center center;
  }
</style>
