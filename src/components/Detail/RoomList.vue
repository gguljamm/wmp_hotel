<template>
  <div>
    <div v-if="roomInfo.length === 0" class="noti">모든 객실이 매진되었습니다.</div>
    <ul v-else>
      <li class="roomList" v-for="(x, index) in sortedRoomList" :key="index" @click="exit(x)">
        <div>
          <div class="logo" :class="getVendorName(x.hotelVendorKind)"></div>
          <div class="table">
            <div>{{ x.name || 'Room' }}{{ x.information ? ' - ' + x.information : '' }}</div>
            <div class="price"><span class="signal">₩</span><span class="roboto">{{ format.numberFormat(parseInt(x.totalPrice)) }}</span></div>
          </div>
          <div class="addition">
            <div v-for="y in getAdditionInfo(x)" :key="y">{{ y }}</div>
          </div>
          <button class="exitBtn">예약</button>
        </div>
        <div class="bottom">
          <div></div>
          <div>1박당 <span class="signal">₩</span><span class="roboto">{{ format.numberFormat(parseInt(x.pricePerNight)) }}</span></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Format from '../../util/format'
import Api from '../../api/api'
export default{
  props: ['hotelInfo', 'roomInfo', 'period', 'mid', 'inputData', 'isFromApp'],
  data () {
    return {
      format: Format
    }
  },
  computed: {
    sortedRoomList () {
      const sorted = []
      for (let x = 0; x < this.roomInfo.length; x += 1) {
        if (this.roomInfo[x].totalPrice) {
          sorted.push(this.roomInfo[x])
        }
      }
      // 동일 가격일 때, 부킹 -> 익스 -> 아고다 순서
      sorted.sort((a, b) => {
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
      return sorted
    }
  },
  methods: {
    getVendorName (vendor) {
      let key = 'expedia'
      if (vendor === 'BOOKING_DOT_COM') {
        key = 'booking'
      } else if (vendor === 'AGODA') {
        key = 'agoda'
      }
      return key
    },
    getAdditionInfo (cityInfo) {
      const name = cityInfo.name
      const arr = []
      if (!name) {
        return arr
      }
      if (name.indexOf('환불불가') >= 0 || name.indexOf('환불 불가') >= 0 || name.indexOf('Non-refundable') >= 0) {
        arr.push('환불불가')
      }
      if (name.indexOf('조식포함') >= 0 || name.indexOf('조식 포함') >= 0) {
        arr.push('조식포함')
      }
      if (name.indexOf('현장결제') >= 0 || name.indexOf('현장 결제') >= 0) {
        arr.push('현장결제')
      }
      if (cityInfo.roomTags && cityInfo.roomTags.indexOf('FREE_BREAKFAST') >= 0 && arr.indexOf('조식 포함') < 0) {
        arr.push('조식포함')
      }
      if (cityInfo.roomTags && cityInfo.roomTags.indexOf('FREE_CANCELLATION') >= 0) {
        arr.push('무료취소')
      }
      return arr
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
          resultUrl: exitInfo.detailUrl,
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
          encodeURIComponent(exitInfo.detailUrl)
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
    }
  }
}
</script>

<style scoped>
  .roomList{
    border-bottom: 1px solid #ddd;
    cursor: pointer;
  }
  .roomList > div:first-of-type{
    padding: 26px 20px 28px;
    position: relative;
  }
  .logo{
    height: 21px;
    background-size: contain;
    background-repeat: no-repeat;
    width: 90px;
    background-position: left center;
    margin: 2px 0;
  }
  .logo.agoda{
    background-image: url(../../assets/vendor_agoda.svg)
  }
  .logo.booking{
    background-image: url(../../assets/vendor_booking.png)
  }
  .logo.expedia{
    background-image: url(../../assets/vendor_expedia.svg)
  }
  .table{
    display: table;
    width: 100%;
    padding-top: 7px;
  }
  .table > div{
    display: table-cell;
    vertical-align: top;
  }
  .table > div:first-of-type{
    width: 60%;
    font-size: 16px;
    font-weight: 500;
    padding-right: 12px;
  }
  .price{
    font-size: 24px;
    font-weight: normal;
    letter-spacing: -0.5px;
    color: #111;
    width: 40%;
    text-align: right;
    position: relative;
    top: -40px;
  }
  .bottom{
    height: 40px;
    line-height: 40px;
    background-color: #f5f4f0;
    padding: 0 20px;
    font-size: 12px;
    color: #999;
  }
  .bottom > div:first-of-type{
    float: left;
  }
  .bottom > div:last-of-type{
    float: right;
  }
  .addition {
    font-size: 0;
    margin-top: 12px;
  }
  .addition > div{
    display: inline-block;
    color: #FFF;
    height: 24px;
    line-height: 24px;
    font-size: 11px;
    font-weight: normal;
    background-color: rgba(166, 151, 143, .8);
    padding: 0 8px;
    margin-right: 1px;
  }
  .noti{
    padding: 50px;
    text-align: center;
    font-size: 16px;
  }
  .exitBtn{
    width: 75px;
    height: 33px;
    line-height: 33px;
    border-radius: 16.5px;
    background-color: #ff7e55;
    font-size: 14px;
    font-weight: 500;
    color: #FFF;
    position: absolute;
    right: 20px;
    top: 66px;
  }
</style>
