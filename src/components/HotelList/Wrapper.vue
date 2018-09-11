<template>
  <div class="listWrapper">
    <search-info
      :inputData="inputData"
      :destinationName="destinationName"
      :listingCondition="listingCondition"
      @toggle-search-info="openPop('search')"
      @change-list-condition="$emit('change-list-condition')"
    ></search-info>
    <div class="colorLoader" v-if="loadingHotelList"></div>
    <hotel-list-card
      v-if="listingCondition === 'card'"
      :exceptSoldOutList="exceptSoldOutList"
      :sortedList="sortedList"
      :hotelIndex="hotelIndex"
      :inputData="inputData"
      :loadingHotelList="loadingHotelList"
      :totalCount="this.hotelList.totalCount"
      :mid="mid"
      :isFromApp="isFromApp"
      :computedWishList="computedWishList"
      @hotel-index-change="hotelIndexChange"
      @hotel-index-reset="hotelIndexReset"
      @open-pop="openPop"
      @submit="submit"
      @get-hotel-list="getHotelList"
    ></hotel-list-card>
    <hotel-list-scroll
      v-else-if="listingCondition === 'list'"
      :exceptSoldOutList="exceptSoldOutList"
      :sortedList="sortedList"
      :hotelIndex="hotelIndex"
      :inputData="inputData"
      :loadingHotelList="loadingHotelList"
      :totalCount="this.hotelList.totalCount"
      :mid="mid"
      :lastScrollTop="lastScrollTop"
      :waterfallState="waterfallState"
      :computedWishList="computedWishList"
      @open-pop="openPop"
      @submit="submit"
      @get-hotel-list="getHotelList"
      @last-scroll-top-change="lastScrollTopChange"
      @change-scroll-pop-image-index="changeScrollPopImageIndex"
      @set-waterfall-state="setWaterfallState"
    ></hotel-list-scroll>
    <div class="btnContainer" :class="filterNumber > 0 ? 'wide' : ''">
      <div>
        <button @click="openPop('filter')">
          상세조건
          <div v-if="filterNumber > 0">{{ filterNumber }}</div>
        </button>
        <button @click="openPop('map')">지도보기</button>
      </div>
    </div>
    <search-popup
      v-if="['destination', 'date', 'option'].indexOf(iosPopFlag) >= 0 ||
        ['destination', 'date', 'option'].indexOf($route.params.popFlag) >= 0"
      :inputData="inputData"
      :popping="popping"
      :todayString="todayString"
      :iosPopFlag="iosPopFlag"
      @open-pop="openPop"
      @close-pop="closePop"
    ></search-popup>
    <hotel-list-popup
      v-if="['filter', 'search', 'sort', 'map'].indexOf(iosPopFlag) >= 0 ||
        ['filter', 'search', 'sort', 'map'].indexOf($route.params.popFlag) >= 0"
      :inputData="inputData"
      :popping="popping"
      :filterInfo="filterInfo"
      :sortCondition="sortCondition"
      :hotelList="hotelList"
      :mid="mid"
      :mapList="mapList"
      :listingCondition="listingCondition"
      :iosPopFlag="iosPopFlag"
      :selectNumFromMap="selectNumFromMap"
      @open-pop="openPop"
      @close-pop="closePop"
      @submit="submit"
      @research-with-filter="researchWithFilter"
      @reset-filter-info="resetFilterInfo"
      @clear-waterfall-state="clearWaterfallState"
    ></hotel-list-popup>
    <image-list-popup
      v-if="iosPopFlag === 'image' || $route.params.popFlag === 'image'"
      :popping="popping"
      :hotelInfo="exceptSoldOutList[listingCondition === 'card' ? hotelIndex : scrollPopImageIndex] || {}"
      :inputData="inputData"
      :iosPopFlag="iosPopFlag"
      @close-pop="closePop"
    ></image-list-popup>
  </div>
</template>

<script>
import SearchPopup from '../Search/SearchPopup'
import HotelListPopup from './HotelListPopup'
import SearchInfo from './SearchInfo'
import HotelListCard from './HotelListCard'
import HotelListScroll from './HotelListScroll'
import ImageListPopup from './ImageListPopup'
import Api from '../../api/apiTest'
import Format from '../../util/format'

export default {
  components: {
    SearchPopup,
    SearchInfo,
    HotelListPopup,
    HotelListCard,
    ImageListPopup,
    HotelListScroll
  },
  props: ['hotelList', 'hotelIndex', 'filterInfo', 'sortCondition', 'mid', 'mapList', 'selectedHotel', 'listingCondition', 'popping', 'lastScrollTop', 'isFromApp', 'waterfallState', 'iosPopFlag', 'wishList', 'selectNumFromMap'],
  data () {
    const inputData = {
      checkin: this.$route.params.checkin,
      checkout: this.$route.params.checkout,
      adults: parseInt(this.$route.params.adults, 10),
      room: parseInt(this.$route.params.room, 10)
    }
    const destination = decodeURIComponent(this.$route.params.destination)
    if (destination.indexOf('|') >= 0) {
      inputData.destination = {
        label: destination.split('|')[0],
        lat: destination.split('|')[1],
        lng: destination.split('|')[2],
        type: destination.split('|')[3],
        country: destination.split('|')[4],
        countryName: destination.split('|')[5],
        cityName: destination.split('|')[6],
        cityId: destination.split('|')[7],
        placeId: destination.split('|')[8]
      }
    } else {
      const re = new RegExp('[A-Z]{3}')
      if (re.exec(destination).length > 0 && destination.length === 3) {
        inputData.destination = destination
      } else {
        inputData.destination = ''
      }
    }
    const param = JSON.stringify(inputData)
    inputData.children = []
    if (this.$route.params.children !== 'null') {
      const arrChildren = this.$route.params.children.split('&')
      for (let x = 0; x < arrChildren.length; x += 1) {
        inputData.children.push(parseInt(arrChildren[x], 10))
      }
    }
    return {
      format: Format,
      inputData,
      param,
      todayString: Format.getToday(),
      reSearchMinute: 10, // 호텔 검색 리스트 유지 시간 (분단위)
      loadingHotelList: true,
      destinationName: '',
      scrollTop: 0,
      scrollPopImageIndex: 0,
      isFinishLoading: false,
      levenshtein: require('js-levenshtein'),
      cityCode: ''
    }
  },
  watch: {
    mid () {
      this.getHotelList(true, true)
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
    sortedList () {
      let list = this.exceptSoldOutList
      // if (this.sortCondition === 'PRICE_DESC') {
      //   list = list.sort((a, b) => {
      //     return (b.rooms[0].totalPrice - a.rooms[0].totalPrice)
      //   })
      // } else if (this.sortCondition === 'PRICE_ASC') {
      //   list = list.sort((a, b) => {
      //     return (a.rooms[0].totalPrice - b.rooms[0].totalPrice)
      //   })
      // }
      if (this.inputData.destination.type === 'hotel') {
        let findHotelId = false
        let rankHotelName = 3
        let rankHotelIndex = -1
        const searchHotelName = this.inputData.destination.label.replace(/ /gi, '')
        searchHotelName.replace('호텔', '')
        for (let x = 0; x < this.hotelList.list.length; x += 1) {
          if (this.inputData.destination.label.split(', ')[0].replace(/ /gi, '') === this.hotelList.list[x].name.split(', ')[0].replace(/ /gi, '')) {
            findHotelId = this.hotelList.list[x].hotelId
            list.unshift(this.hotelList.list[x])
            break
          }
          const hotelName = this.hotelList.list[x].name.replace(/ /gi, '')
          hotelName.replace('호텔', '')
          const rank = this.levenshtein(searchHotelName, hotelName)
          if (rank < rankHotelName) {
            rankHotelName = rank
            rankHotelIndex = x
          }
        }
        if (findHotelId) {
          for (let x = 1; x < list.length; x += 1) {
            if (list[x].hotelId === findHotelId) {
              list.splice(x, 1)
            }
          }
        } else if (rankHotelIndex >= 0) {
          list.unshift(this.hotelList.list[rankHotelIndex])
          for (let x = 1; x < list.length; x += 1) {
            if (list[x].hotelId === this.hotelList.list[rankHotelIndex].hotelId) {
              list.splice(x, 1)
            }
          }
        }
      }
      return list
    },
    filterNumber () {
      let num = 0
      if (this.filterInfo) {
        if (this.filterInfo.minPrice && this.filterInfo.minPrice > 0) {
          num += 1
        }
        if (this.filterInfo.maxPrice && this.filterInfo.maxPrice > 0 && this.filterInfo.maxPrice !== 2000000) {
          num += 1
        }
        num += this.filterInfo.amenity ? this.filterInfo.amenity.length : 0
        num += this.filterInfo.categories ? this.filterInfo.categories.length : 0
        num += this.filterInfo.stars ? this.filterInfo.stars.length : 0
      }
      return num
    },
    computedWishList () {
      const arr = []
      for (let x = 0; x < this.wishList.length; x += 1) {
        if (this.wishList[x].checkin === this.inputData.checkin &&
          this.wishList[x].checkout === this.inputData.checkout
        ) {
          arr.push(this.wishList[x].wonderHotelInfoId)
        }
      }
      return arr
    }
  },
  methods: {
    hotelIndexChange (value) {
      this.$emit('hotel-index-change', value)
    },
    hotelIndexReset (value) {
      this.$emit('hotel-index-reset', value)
    },
    submit (hotelInfo) {
      const children = this.inputData.children.length > 0 ? this.inputData.children.join('&') : 'null'
      const destination = [
        this.inputData.destination.label,
        this.inputData.destination.lat,
        this.inputData.destination.lng,
        this.inputData.destination.type,
        this.inputData.destination.country,
        this.inputData.destination.countryName,
        this.inputData.destination.cityName,
        this.inputData.destination.cityId,
        this.inputData.destination.placeId
      ]
      const param = [
        destination.join('|'),
        this.inputData.checkin,
        this.inputData.checkout,
        this.inputData.adults,
        children,
        this.inputData.room,
        hotelInfo.hotelId
      ]
      this.$emit('change-selected-hotel', hotelInfo)
      this.$router.push(
        `/detail/${param.join('/')}${window.location.search}${window.location.hash}`
      )
    },
    getHotelList (isFirst, isWatch) {
      if (parseInt(this.inputData.checkin.replace(/-/gi, '')) < parseInt(this.format.getToday().replace(/-/gi, ''))) {
        window.EventBus.$emit('popAlert', 'alert', '오늘 이전의 검색입니다.', 'main')
        this.loadingHotelList = false
        this.isFinishLoading = true
        return
      }
      if (isFirst) {
        this.isFinishLoading = false
      }
      if (this.isFinishLoading) {
        return
      }
      const obj = {
        'place.placeName': this.inputData.destination.label,
        'place.placeType': this.inputData.destination.type,
        'place.placeId': this.inputData.destination.placeId,
        'place.latitude': this.inputData.destination.lat,
        'place.longitude': this.inputData.destination.lng,
        'place.countryName': this.inputData.destination.countryName,
        'place.countryCode': this.inputData.destination.country,
        'place.cityName': this.inputData.destination.cityName,
        'place.cityId': this.inputData.destination.cityId,
        checkin: this.inputData.checkin,
        checkout: this.inputData.checkout,
        numberOfAdults: this.inputData.adults,
        numberOfRooms: this.inputData.room,
        numberOfChildren: this.inputData.children.length,
        agesOfChildren: this.inputData.children.join(','),
        hotelSortTypeKind: this.sortCondition || 'BEST',
        row: this.hotelList.list.length
      }
      if (isFirst && isWatch) {
        obj.row = 0
      }
      if (this.mid) {
        obj.midToken = this.mid
      }
      if (this.cityCode) {
        obj.myPageDestinationCode = this.cityCode
      }
      const filterInfo = this.filterInfo
      if (filterInfo) {
        Object.keys(filterInfo).forEach((x) => {
          if ((filterInfo[x] && !Array.isArray(filterInfo[x])) ||
          (filterInfo[x] && Array.isArray(filterInfo[x]) && filterInfo[x].length > 0)) {
            if (x !== 'maxPrice' || filterInfo[x] !== 2000000) {
              obj[`hotelSearchFilter.${x}`] = Array.isArray(filterInfo[x]) ? filterInfo[x].join(',') : filterInfo[x]
            }
          }
        })
      }
      if ((this.hotelList.param === JSON.stringify(obj) &&
        (new Date().getTime() - this.hotelList.searchTime) / 1000 / 60 < this.reSearchMinute) ||
        (this.hotelList.list.length !== 0 && this.hotelList.list.length >= this.hotelList.totalCount)
      ) {
        this.loadingHotelList = false
        console.log('재검색안함')
        return
      }
      let isSameParams = true
      if (this.hotelList.param) {
        const prevParams = JSON.parse(this.hotelList.param)
        const arr = Object.keys(obj)
        for (let x = 0; x < arr.length; x += 1) {
          if (arr[x] !== 'row' && prevParams[arr[x]] !== obj[arr[x]]) {
            isSameParams = false
            break
          }
        }
      }
      if (isFirst && this.hotelList.list.length > 0 && (new Date().getTime() - this.hotelList.searchTime) / 1000 / 60 < this.reSearchMinute &&
        isSameParams
      ) {
        this.loadingHotelList = false
        console.log('추가검색안함')
        return
      }
      if (!isSameParams) {
        this.resetFilterInfo()
      }
      setTimeout(() => {
        this.loadingHotelList = true
      }, 10)
      Api.hotelList(obj).then((resp) => {
        this.loadingHotelList = false
        if (!resp.data || resp.data.searchedCommonHotels.length === 0) {
          this.isFinishLoading = true
        }
        const list = resp.data.searchedCommonHotels
        this.hotelList.totalCount = resp.data.totalCount
        const arrHotelKey = []
        for (let x = 0; x < this.hotelList.list.length; x += 1) {
          arrHotelKey.push(this.hotelList.list[x].hotelId)
        }
        let addedList = 0
        for (let x = 0; x < list.length; x += 1) {
          if (list[x].rooms.length > 1) {
            const room = []
            for (let y = 0; y < list[x].rooms.length; y += 1) {
              if (list[x].rooms[y].totalPrice) {
                room.push(list[x].rooms[y])
              }
            }
            room.sort((a, b) => {
              return a.totalPrice - b.totalPrice
            })
            list[x].rooms = room
          }
          if (arrHotelKey.indexOf(list[x].hotelId) < 0) {
            this.hotelList.list.push(list[x])
            addedList += 1
          }
        }
        if (addedList === 0) {
          this.isFinishLoading = true
        }
        this.hotelList.param = JSON.stringify(obj)
        if (isFirst) {
          this.hotelList.searchTime = new Date().getTime()
          if (this.inputData.destination.type === 'hotel') {
            let findHotelId = false
            const arrRank = []
            const searchHotelName = this.inputData.destination.label.replace(/ /gi, '')
            searchHotelName.replace('호텔', '')
            for (let x = 0; x < this.hotelList.list.length; x += 1) {
              const hotelName = this.hotelList.list[x].name.replace(/ /gi, '')
              hotelName.replace('호텔', '')
              if (this.levenshtein(searchHotelName, hotelName) <= 2) {
                console.log(this.levenshtein(searchHotelName, hotelName), hotelName)
                arrRank.push(x)
              }
              if (this.inputData.destination.label.split(', ')[0].replace(/ /gi, '') === this.hotelList.list[x].name.split(', ')[0].replace(/ /gi, '')) {
                findHotelId = this.hotelList.list[x].hotelId
                list.unshift(this.hotelList.list[x])
                break
              }
            }
            if (!findHotelId && arrRank.length === 0) {
              window.EventBus.$emit('popAlert', 'alert', '검색한 이름과 일치하는 호텔을 찾지 못했습니다.')
            }
          }
        }
      }).catch((e) => {
        console.log(e)
        this.loadingHotelList = false
        this.isFinishLoading = true
      })
    },
    openPop (flag) {
      if (flag === 'map') {
        alert('맵막아놓음')
        return
      }
      this.$emit('open-pop', flag)
    },
    closePop () {
      this.$emit('close-pop')
    },
    changeScrollPopImageIndex (index) {
      this.scrollPopImageIndex = index
    },
    researchWithFilter (filter, sort, list) {
      this.isFinishLoading = false
      this.$emit('reset-filter-info', filter, sort, list)
      this.closePop()
      this.$emit('clear-waterfall-state')
      this.$nextTick(() => {
        this.getHotelList()
      })
    },
    resetFilterInfo () {
      this.$emit('reset-filter-info')
    },
    lastScrollTopChange (resp) {
      this.$emit('last-scroll-top-change', resp)
    },
    setWaterfallState (state) {
      this.$emit('set-waterfall-state', state)
    },
    clearWaterfallState () {
      this.$emit('clear-waterfall-state')
    }
  },
  mounted () {
    const induce = this.$cookies.get('induceLogin') || false
    if (induce !== 'true') {
      setTimeout(() => {
        if (!this.mid) {
          this.$emit('pop-alert', 'login', '항공 예약 고객은 로그인 하시면 Special 특가를 확인하실 수 있습니다.')
          this.$cookies.set('induceLogin', 'true', '1d', '/')
        }
      }, 1000)
    }
    if (typeof this.inputData.destination === 'object') {
      this.cityCode = ''
      this.getHotelList(true)
    } else if (this.inputData.destination) {
      const cityCode = this.inputData.destination
      Api.autocomplete(this.inputData.destination).then((resp) => {
        const result = resp.data.result[0]
        if (!result || (result.type !== 'airport' && result.type !== 'city' && result.type !== 'region')) {
          window.EventBus.$emit('popAlert', 'alert', '파라미터 오류입니다. 다시 검색해주세요.', 'main')
        } else {
          this.inputData.destination = {
            label: result.label,
            lat: result.latitude,
            lng: result.longitude,
            type: result.type,
            country: result.country,
            countryName: result.country_name,
            cityName: result.city_name,
            cityId: result.city_ufi || result.id,
            placeId: result.id
          }
          this.destinationName = result.label
          this.cityCode = cityCode
          this.getHotelList(true)
        }
      })
    } else {
      window.EventBus.$emit('popAlert', 'alert', '파라미터 오류입니다. 다시 검색해주세요.', 'main')
    }
  },
  created () {
    const objParam = this.$route.params
    if (objParam.popFlag && objParam.popFlag !== 'map') {
      const path = this.$route.path
      const arrPath = path.split('/')
      arrPath.pop()
      this.$router.replace(`${arrPath.join('/')}${window.location.search}${window.location.hash}`)
    }
    if (this.iosPopFlag && (this.iosPopFlag !== 'map' && this.selectNumFromMap < 0)) {
      this.$emit('close-pop')
    }
  }
}
</script>

<style scoped>
  .listWrapper{
    background-color: #333;
    height: 100%;
    max-width: 700px;
    margin: 0 auto;
  }
  .btnContainer{
    position: fixed;
    bottom: 60px;
    width: 174px;
    height: 46px;
    left: 50%;
    margin-left: -86px;
    font-size: 0;
    z-index: 5;
    transition: .3s ease;
  }
  .btnContainer.wide{
    width: 194px;
    margin-left: -97px;
  }
  .btnContainer > div{
    width: 100%;
    height: 100%;
    position: relative;
    transition: .3s ease;
    background-color: #1A1A1C;
    border-radius: 23px;
  }
  .scrollDown .btnContainer{
    transform: translateY(48px);
  }
  .btnContainer > div > button {
    color: #FFF;
    height: 46px;
    padding: 0;
    font-size: 12px;
    padding-left: 12px;
    position: relative;
    width: 87px;
  }
  .btnContainer.wide > div > button:first-of-type{
    width: 107px;
    padding-right: 20px;
  }
  .btnContainer > div > button > div{
    width: 20px;
    height: 20px;
    background-color: #8f9d9d;
    position: absolute;
    right: 10px;
    top: 13px;
    line-height: 20px;
    border-radius: 100%;
  }
  .btnContainer > div > button:nth-child(1):after{
    border-left: 1px solid #4d4d4d;
    content: '';
    position: absolute;
    right: 0;
    height: 16px;
    top: 15px;
  }
  .btnContainer > div > button:before{
    width: 12px;
    height: 12px;
    background-size: cover;
    position: absolute;
    left: 12px;
    top: 17px;
    content: '';
  }
  .btnContainer > div > button:first-of-type:before{
    background-image: url(../../assets/filter.svg);
  }
  .btnContainer > div > button:last-of-type:before{
    background-image: url(../../assets/map.svg);
  }
  .colorLoader{
    width: 100%;
    height: 4px;
    content: '';
    display: block;
    background-color: #fce38a;
    z-index: 11;
    position: fixed;
    overflow: hidden;
    top: 118px;
    left: 0;
    transition: .3s ease
  }
  .topOut .colorLoader{
    transform: translateY(-48px);
  }
  .colorLoader:before{
    content: '';
    position: absolute;
    box-shadow: 0 0 100px 100px #f38181;
    animation: moveleft 1s infinite linear;
    height: 4px;
    width: 4px;
    background-color: #f38181;
  }
  @keyframes moveleft {
    from {
      margin-left: -100px;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    to {
      margin-left: 100%;
      opacity: 0;
    }
  }
</style>
