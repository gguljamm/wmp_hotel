<template>
  <div class="mapWrapper">
    <button class="research"
      :class="researchShow ? 'show' : ''"
      @click="!isLoading ? research() : ''"
    >
      <span v-if="!isLoading">이 지역 다시 검색하기</span>
      <span v-else>호텔 불러오는 중</span>
    </button>
    <div
      v-if="inputData.destination.country === 'kr' && false"
    >
      <!-- 한국일때 map 넣을 공간 (제약식 false 제거) -->
    </div>
    <GmapMap
      v-else
      :center="center"
      :zoom="14"
      style="width: 100%; height: 100%"
      @center_changed="move"
      :options="{
        disableDefaultUI: true,
        gestureHandling: 'greedy'
      }"
    >
      <GmapMarker
        v-for="(m, index) in markers"
        :key="m.key"
        :position="m.position"
        :icon="{
          url: getIconUrl(m.active),
          size: {width: 69, height: 29, f: 'px', b: 'px'}
        }"
        @click="clickMarker(index)"
        :clickable="true"
        :label="{
          text: `₩${format.numberFormat(parseInt(mapList[index].rooms[0].totalPrice, 10))}`,
          color: '#FFF',
          fontFamily: 'Roboto Slab',
          fontSize: '12px'
        }"
        :zIndex="m.active ? 1 : 0"
        :labelClass="'my-custome-class-for-label'"
      ></GmapMarker>
    </GmapMap>
    <div class="selectedHotelInfo" :class="selectedIndex >= 0 ? 'show' : ''" @click="submit(mapList[selectedIndex], selectedIndex)">
      <div v-if="selectedIndex >= 0">
        <button @click.stop="popClose"></button>
        <div class="img"
          :style="{'background-image': `url(${mapList[selectedIndex].imageUrls[0]})`}"
        ></div>
        <div class="hotelInfo">
          <div>{{ mapList[selectedIndex].name }}</div>
          <div>
            <span class="starWrapper" v-if="mapList[selectedIndex].star"><span class="star" v-for="x in parseInt(mapList[selectedIndex].star, 10)" :key="x"></span></span>
            <span class="rating" v-if="mapList[selectedIndex].rating"><span v-if="!mapList[selectedIndex].numberOfReviews">평점: </span>{{ mapList[selectedIndex].rating * 2 }}</span>
            <span class="review" v-if="mapList[selectedIndex].numberOfReviews">&nbsp;{{ format.numberFormat(mapList[selectedIndex].numberOfReviews) }}개 리뷰</span>
          </div>
          <div>
            <span class="price" v-if="mapList[selectedIndex].rooms[0]"><span class="signal">₩</span><span class="roboto">{{ format.numberFormat(parseInt(mapList[selectedIndex].rooms[0].totalPrice)) }}</span></span>
            <span v-else>전 객실 매진</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Format from '../../util/format'
import Api from '../../api/api'

export default {
  name: 'HotelMap',
  props: ['inputData', 'hotelList', 'mid', 'mapList', 'selectNumFromMap'],
  data () {
    let center = {
      lat: Number(this.inputData.destination.lat),
      lng: Number(this.inputData.destination.lng)
    }
    // 제주도 검색시 중앙이 한라산이어서 제주시로 변경
    if (this.inputData.destination.label === '제주도') {
      center = {
        lat: 33.5060005187988,
        lng: 126.53099822998
      }
    }
    return {
      center,
      selectedIndex: this.selectNumFromMap,
      timeout: false,
      format: Format,
      researchShow: false,
      lastCenter: {
        lat: Number(this.inputData.destination.lat),
        lng: Number(this.inputData.destination.lng)
      },
      isLoading: false
    }
  },
  computed: {
    exceptSoldOutList () {
      const arr = []
      for (let x = 0; x < this.hotelList.list.length; x += 1) {
        if (this.hotelList.list[x].rooms && Array.isArray(this.hotelList.list[x].rooms) && this.hotelList.list[x].rooms.length > 0 &&
          this.hotelList.list[x].imageUrls.length > 0
        ) {
          arr.push(this.hotelList.list[x])
        }
      }
      return arr
    },
    markers () {
      const arr = []
      for (let x = 0; x < this.mapList.length; x += 1) {
        const obj = {
          position: {
            lat: this.mapList[x].latitude,
            lng: this.mapList[x].longitude
          },
          key: this.mapList[x].hotelId,
          active: false
        }
        if (x === this.selectedIndex) {
          obj.active = true
        }
        arr.push(obj)
      }
      return arr
    }
  },
  methods: {
    getListFromMap (location) {
      const obj = {
        'place.latitude': location.lat,
        'place.longitude': location.lng,
        checkin: this.inputData.checkin,
        checkout: this.inputData.checkout,
        numberOfAdults: this.inputData.adults,
        numberOfRooms: this.inputData.room,
        numberOfChildren: this.inputData.children.length,
        agesOfChildren: this.inputData.children.join(','),
        distanceKm: 1
      }
      if (this.mid) {
        obj.midToken = this.mid
      }
      this.isLoading = true
      Api.hotelList(obj).then((resp) => {
        this.isLoading = false
        if (resp.data) {
          const respList = resp.data.searchedCommonHotels
          const list = []
          for (let x = 0; x < this.mapList.length; x += 1) {
            list.push(this.mapList[x].hotelId)
          }
          for (let x = 0; x < respList.length; x += 1) {
            if (list.indexOf(respList[x].hotelId) < 0) {
              if (respList[x].rooms.length > 1) {
                respList[x].rooms.sort((a, b) => {
                  return a.totalPrice - b.totalPrice
                })
                this.mapList.push(respList[x])
              }
            }
          }
        }
      })
    },
    submit (hotelInfo, index) {
      window.EventBus.$emit('change-select-num-from-map', index)
      this.$emit('submit', hotelInfo)
    },
    getIconUrl (flag) {
      if (flag) {
        return require('../../assets/marker_bubble.svg')
      }
      return require('../../assets/marker_bubble_gray.svg')
    },
    clickMarker (index) {
      for (let x = 0; x < this.markers.length; x += 1) {
        Vue.set(this.markers[x], 'active', false)
      }
      Vue.set(this.markers[index], 'active', true)
      Vue.set(this.center, 'lat', Number(this.markers[index].position.lat))
      Vue.set(this.center, 'lng', Number(this.markers[index].position.lng))
      this.selectedIndex = index
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
    },
    move (e) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.researchShow = false
      this.popClose()
      this.timeout = setTimeout(() => {
        this.lastCenter = {
          lat: e.lat(),
          lng: e.lng()
        }
        this.researchShow = true
      }, 300)
    },
    popClose () {
      this.selectedIndex = -1
      for (let x = 0; x < this.markers.length; x += 1) {
        Vue.set(this.markers[x], 'active', false)
      }
    },
    research () {
      this.getListFromMap(this.lastCenter)
    }
  },
  mounted () {
    if (this.mapList.length === 0) {
      for (let x = 0; x < this.exceptSoldOutList.length; x += 1) {
        this.mapList.push(this.exceptSoldOutList[x])
      }
    }
    if (this.selectNumFromMap >= 0) {
      console.log(this.selectNumFromMap)
      // Vue.set(this.markers[this.selectNumFromMap], 'active', true)
      Vue.set(this.center, 'lat', Number(this.markers[this.selectNumFromMap].position.lat))
      Vue.set(this.center, 'lng', Number(this.markers[this.selectNumFromMap].position.lng))
    }
  }
}
</script>

<style scoped>
  .mapWrapper{
    width: 100%;
    height: 100%;
  }
  .selectedHotelInfo{
    height: 110px;
    position: absolute;
    right: 20px;
    bottom: -110px;
    left: 20px;
    background-color: #FFF;
    z-index: 1;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    margin-top: 130px;
    transition: .3s ease;
    opacity: 0;
    cursor: pointer;
  }
  .selectedHotelInfo.show{
    bottom: 20px;
    opacity: 1;
  }
  .selectedHotelInfo .img{
    width: 80px;
    height: 80px;
    border-radius: 100%;
    position: absolute;
    left: 15px;
    top: 15px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .selectedHotelInfo .hotelInfo{
    padding: 18px 20px 18px 115px;
  }
  .selectedHotelInfo .hotelInfo > div:first-of-type{
    font-size: 14px;
    font-weight: 500;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .selectedHotelInfo .hotelInfo > div:nth-of-type(2){
    height: 20px;
    line-height: 20px;
    margin-top: 2px;
  }
  .selectedHotelInfo .hotelInfo > div:nth-of-type(2) > span{
    float: left;
  }
  .starWrapper{
    margin-right: 4px;
    font-size: 12px;
  }
  .starWrapper:after{
    content: '|';
    color: rgba(0, 0, 0, .3);
    margin-left: 5px;
  }
  .star{
    margin-right: 3px;
    float: left;
    margin-top: 5px;
    width: 11px;
    height: 11px;
    background: url(../../assets/star.svg) no-repeat;
    background-size: cover;
  }
  .star:last-of-type{
    margin-right: 0;
  }
  .rating{
    font-size: 14px;
    font-weight: 500;
    color: #111;
  }
  .rating > span{
    font-size: 13px;
    font-weight: normal;
  }
  .review{
    font-size: 12px;
    color: #9b9b9b;
  }
  .selectedHotelInfo .hotelInfo > div:nth-of-type(3){
    letter-spacing: -0.3px;
    color: #b18e79;
    font-size: 14px;
    font-weight: 500;
    margin-top: 8px;
  }
  .selectedHotelInfo .hotelInfo > div:nth-of-type(3) > span.price{
    font-size: 18px;
  }
  .selectedHotelInfo button{
    background-image: url(../../assets/btn-closed.svg);
    width: 11px;
    height: 11px;
    border: 0;
    position: absolute;
    top: 16px;
    right: 16px;
  }
  button.research{
    width: 174px;
    height: 34px;
    border-radius: 25px;
    background-color: #1a1a1c;
    padding: 0;
    border: 0;
    position: absolute;
    z-index: 3;
    color: #FFF;
    font-size: 14px;
    margin-top: 12px;
    margin-left: -87px;
    left: 50%;
    opacity: 0;
    transition: .3s ease;
    pointer-events: none;
  }
  button.research.show{
    opacity: 0.85;
    pointer-events: all;
  }
</style>
<style>
  .my-custome-class-for-label{
    border: 1px solid red
  }
</style>
