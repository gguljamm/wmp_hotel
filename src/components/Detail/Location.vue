<template>
  <div>
    <div class="img">
      <div class="icon"></div>
      <div><div>
        <div>{{ hotelInfo.name }}</div>
        <div>{{ hotelInfo.address }}</div>
        <div>
          <span class="starWrapper" v-if="hotelInfo.star"><span class="star" v-for="x in parseInt(hotelInfo.star, 10)" :key="x"></span></span>
          <span class="rating" v-if="hotelInfo.rating"><span v-if="!hotelInfo.numberOfReviews">평점: </span>{{ hotelInfo.rating * 2 }}</span>
          <span class="review" v-if="hotelInfo.numberOfReviews">&nbsp;{{ format.numberFormat(hotelInfo.numberOfReviews) }}개 리뷰</span>
        </div>
        <input ref="clipboard" class="clipboard" :value="hotelInfo.address" readonly>
        <button @click="clipboard">주소복사</button>
        <button @click="openMap">길찾기</button>
      </div></div>
    </div>
    <div class="near">
      <div>
        <span>주변 관광지</span>
        <div>
          <div>~500m</div>
          <div>~1km</div>
          <div>~5km</div>
          <div>5km이상</div>
        </div>
      </div>
      <ul>
        <li
          v-for="(x, index) in sortedNearList"
          :key="index"
          :class="getClassByDistance(x.distance * 1000)"
        >
          <span>{{(x.distance).toFixed(1) }}km</span>
          <span>{{ x.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Format from '../../util/format'
import Api from '../../api/apiTest'

export default {
  props: ['inputData', 'hotelInfo', 'nearList'],
  data () {
    return {
      format: Format
    }
  },
  computed: {
    sortedNearList () {
      let arr = []
      const vmThis = this
      if (this.nearList.length > 0) {
        arr = vmThis.nearList.sort((a, b) => {
          return a.distance - b.distance
        })
      }
      return arr
    }
  },
  methods: {
    getClassByDistance (distance) {
      let className = 'distance4'
      if (distance <= 500) {
        className = 'distance1'
      } else if (distance <= 1000) {
        className = 'distance2'
      } else if (distance <= 5000) {
        className = 'distance3'
      }
      return className
    },
    openMap () {
      let url = `https://google.com/maps/search/${this.hotelInfo.latitude},${this.hotelInfo.longitude}`
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
    },
    clipboard () {
      const vThis = this
      this.$copyText(this.hotelInfo.address).then(function (e) {
        vThis.$emit('pop-alert', '클립보드에 복사되었습니다.')
      }, function (e) {
        vThis.$emit('pop-alert', '클립보드에 복사가 실패했습니다.')
      })
    },
    getNearList () {
      const param = {
        location: `${this.hotelInfo.latitude}, ${this.hotelInfo.longitude}`
      }
      Api.nearPlace(param).then((resp) => {
        for (let x = 0; x < resp.data.length; x += 1) {
          this.nearList.push(resp.data[x])
        }
      })
    }
  },
  mounted () {
    if (!this.nearList.length > 0) {
      this.getNearList()
    }
  }
}
</script>

<style scoped>
  .img{
    width: 100%;
    padding-bottom: 73.3333%;
    background: url(../../assets/wmp_map.png) no-repeat;
    background-size: contain;
    position: relative;
  }
  .img .icon{
    width: 25px;
    height: 29px;
    position: absolute;
    background: url(../../assets/spot.svg) no-repeat;
    background-size: contain;
    top: 60px;
    left: 80px;
  }
  .img > div:not(.icon){
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 20px;
    padding: 0 20px;
  }
  .img > div > div{
    width: 100%;
    background-color: #FFF;
    padding: 20px 20px 65px;
    position: relative;
  }
  .img > div > div > button{
    position: absolute;
    bottom: 0;
    width: 50%;
    background-color: #b18e79;
    color: #FFF;
    height: 45px;
    font-size: 14px;
    font-weight: 500;
    border: 0;
    line-height: 45px;
  }
  .img > div > div > div:first-of-type{
    font-size: 16px;
    font-weight: 600;
  }
  .img > div > div > div:nth-of-type(2){
    font-size: 14px;
    color: #999;
    margin-top: 2px;
    margin-bottom: 4px;
  }
  .img > div > div > button:first-of-type{
    left: 0;
    border-right: 1px solid rgba(255, 255, 255, .3)
  }
  .img > div > div > button:first-of-type:before{
    content: '';
    background-image: url(../../assets/location1.svg);
    background-repeat: no-repeat;
    background-position: center center;
    height: 24px;
    width: 24px;
    display: inline-block;
    position: relative;
    top: 6px;
    margin-right: 6px;
  }
  .img > div > div > button:nth-of-type(2){
    left: 50%;
  }
  .img > div > div > button:nth-of-type(2):before{
    content: '';
    background-image: url(../../assets/location2.svg);
    background-repeat: no-repeat;
    background-position: center center;
    height: 24px;
    width: 24px;
    display: inline-block;
    position: relative;
    top: 6px;
    margin-right: 6px;
  }
  .img > div > div > div:nth-of-type(3){
    line-height: 20px;
    height: 20px;
  }
  .img > div > div > div:nth-of-type(3) > span{
    float: left;
  }
  .starWrapper{
    margin-right: 6px;
  }
  .starWrapper:after{
    content: '';
    margin-left: 6px;
    border-right: 1px solid #ccc;
    height: 12px;
    display: inline-block;
  }
  .star{
    margin-right: 3px;
    float: left;
    margin-top: 4px;
    width: 12px;
    height: 12px;
    background: url(../../assets/star.svg) no-repeat;
    background-size: cover;
  }
  .star:last-of-type{
    margin-right: 0;
  }
  .rating{
    font-size: 16px;
    font-weight: 600;
    color: #111;
  }
  .rating > span{
    font-size: 14px;
    font-weight: normal;
  }
  .review{
    font-size: 12px;
    color: #999;
  }
  .clipboard {
    opacity: 0;
    position: absolute;
    left: -9999px;
  }
  .near{
    padding: 40px 20px;
  }
  .near > div:first-of-type{
    font-size: 0;
    overflow: auto;
  }
  .near > div:first-of-type > span{
    font-size: 16px;
    font-weight: 600;
    color: #111;
  }
  .near > div:first-of-type > div{
    float: right;
    white-space: nowrap;
  }
  .near > div:first-of-type > div > div{
    display: inline-block;
    font-size: 12px;
    line-height: 19px;
    margin-right: 16px;
  }
  .near > div:first-of-type > div > div:last-of-type{
    margin-right: 0;
  }
  .near > div:first-of-type > div > div:before{
    content: '';
    float: left;
    width: 7px;
    height: 7px;
    margin-top: 5px;
    background-color: #18d812;
    border-radius: 100%;
    margin-right: 4px;
  }
  .near > div:first-of-type > div > div:nth-of-type(2):before{
    background-color: #ffc701;
  }
  .near > div:first-of-type > div > div:nth-of-type(3):before{
    background-color: #ff9202;
  }
  .near > div:first-of-type > div > div:nth-of-type(4):before{
    background-color: #ff3440;
  }
  .distance1{
    color: #18d812;
  }
  .distance2{
    color: #ffc701
  }
  .distance3{
    color: #ff9202;
  }
  .distance4{
    color: #ff3440;
  }
  .near ul{
    border-top: 1px solid #ddd;
    padding-top: 24px;
    padding-left: 10px;
    margin-top: 24px;
  }
  .near ul li{
    margin-bottom: 10px;
    min-height: 20px;
    overflow: auto;
  }
  .near ul li:before{
    content: '';
    width: 7px;
    height: 7px;
    background-color: #18d812;
    float:left;
    margin-top: 4px;
    margin-right: 5px;
    border-radius: 100%;
  }
  .near ul li.distance2:before{
    background-color: #ffc701;
  }
  .near ul li.distance3:before{
    background-color: #ff9202;
  }
  .near ul li.distance4:before{
    background-color: #ff3440;
  }
  .near ul li > span:nth-of-type(1){
    float: left;
    font-size: 12px;
    font-weight: 500;
    width: 50px;
    line-height: 20px;
  }
  .near ul li > span:nth-of-type(2) {
    color: #333 !important;
    font-size: 14px;
    font-weight: 500;
    float: left;
    line-height: 20px;
  }
</style>
