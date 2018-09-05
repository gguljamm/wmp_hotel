<template>
  <div class="detailWrapper">
    <div v-if="loading" class="hotelDetailLoading" :style="getMinHeight">
      <div class="box_inner">
        <p><img src="https://air.wonderscdn.app/images/common/loading_img.gif" alt=""></p>
        <p class="t_gr1"><span>당신의 원더랜드</span>를 찾는 중이에요</p>
        <p class="t_gr2">잠시만 기다려주세요</p>
      </div>
    </div>
    <div v-else-if="hotelInfo.hotelId">
      <div class="fixedHeader" :class="!infoFix && !tabFix ? 'hide' : ''">
        <div :class="infoFix ? 'fixed' : ''">
          <div class="star" v-if="hotelInfo.star"><span v-for="x in parseInt(hotelInfo.star, 10)" :key="x"></span></div>
          <div class="name">{{ hotelInfo.name }}</div>
          <div class="etc">
            <span>
              <span>{{ format.dateFormat(inputData.checkin) }}({{ format.getDayOfWeek(inputData.checkin) }})</span>
              <span> - </span>
              <span>{{ format.dateFormat(inputData.checkout) }}({{ format.getDayOfWeek(inputData.checkout) }})</span>
              <span>/ {{ format.getBetweenDay(inputData.checkin, inputData.checkout) }}박</span>
            </span>
            <span>성인 {{ inputData.adults }}명, </span>
            <span v-if="inputData.children.length > 0">어린이 {{inputData.children.length}}명, </span>
            <span>객실 {{ inputData.room }}개</span>
          </div>
        </div>
        <div class="header" :class="tabFix ? 'fixed' : ''">
          <button :class="tabNum === 0 ? 'selected' : ''" @click="changeTabNum(0)">가격비교</button>
          <button :class="tabNum === 1 ? 'selected' : ''" @click="changeTabNum(1)">정보</button>
          <button :class="tabNum === 2 ? 'selected' : ''" @click="changeTabNum(2)">후기</button>
          <button :class="tabNum === 3 ? 'selected' : ''" @click="changeTabNum(3)">위치</button>
        </div>
      </div>
      <button class="wishBtn"
        @click.stop="computedWishList.indexOf(hotelInfo.hotelId) >= 0 ? delWish(hotelInfo.hotelId) : addWish(hotelInfo)"
        :class="computedWishList.indexOf(hotelInfo.hotelId) >= 0 ? 'selected' : ''"></button>
      <div ref="scrollPart">
        <div class="bgImages">
          <swiper
            ref="detailSwiper"
            :options="swiperOption"
            @slideChange="changeImageIndex"
          >
            <swiper-slide
              v-for="(x, index) in hotelInfo.imageUrls"
              :key="index"
            >
              <div class="swiperImage swiper-lazy"
                v-bind:data-background="x"
                :style="{height: `${windowInnerWidth}px`}"
              ></div>
              <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
            </swiper-slide>
          </swiper>
        </div>
        <div class="bgDetail"
          :style="{height: `${windowInnerWidth}px`}"
        >
          <div>
            <div class="star" v-if="hotelInfo.star"><span v-for="x in parseInt(hotelInfo.star, 10)" :key="x"></span></div>
            <div class="name" id="selectedHotelName">{{ hotelInfo.name }}</div>
            <div class="etc">
              <span>
                <span>{{ format.dateFormat(inputData.checkin) }}({{ format.getDayOfWeek(inputData.checkin) }})</span>
                <span> - </span>
                <span>{{ format.dateFormat(inputData.checkout) }}({{ format.getDayOfWeek(inputData.checkout) }})</span>
                <span>/ {{ format.getBetweenDay(inputData.checkin, inputData.checkout) }}박</span>
              </span>
              <span>성인 {{ inputData.adults }}명, </span>
              <span v-if="inputData.children.length > 0">어린이 {{inputData.children.length}}명, </span>
              <span>객실 {{ inputData.room }}개</span>
            </div>
          </div>
          <button class="imgMore"
            v-if="Array.isArray(hotelInfo.imageUrls) && hotelInfo.imageUrls.length > 1"
            @click="openPop('image')"
          >{{ imgIndex + 1 }}/{{ hotelInfo.imageUrls.length }}</button>
        </div>
        <div class="contentDetail">
          <div class="header">
            <button :class="tabNum === 0 ? 'selected' : ''" @click="changeTabNum(0)">가격비교</button>
            <button :class="tabNum === 1 ? 'selected' : ''" @click="changeTabNum(1)">정보</button>
            <button :class="tabNum === 2 ? 'selected' : ''" @click="changeTabNum(2)">후기</button>
            <button :class="tabNum === 3 ? 'selected' : ''" @click="changeTabNum(3)">위치</button>
          </div>
          <div>
            <div v-show="tabNum === 0">
              <room-list
                :hotelInfo="hotelInfo"
                :roomInfo="hotelInfo.rooms"
                :period="format.getBetweenDay(inputData.checkin, inputData.checkout)"
                :mid="mid"
                :inputData="inputData"
                :isFromApp="isFromApp"
              ></room-list>
            </div>
            <div v-show="tabNum === 1">
              <hotel-info
                :hotelInfo="hotelInfo"
                :isTabActive="tabNum === 1"
              ></hotel-info>
            </div>
            <div v-show="tabNum === 2">
              <review
                :hotelInfo="hotelInfo"
              ></review>
            </div>
            <div v-show="tabNum === 3">
              <location
                v-if="tabNum === 3"
                :inputData="inputData"
                :hotelInfo="hotelInfo"
                :nearList="nearList"
                @pop-alert="popAlert"
              ></location>
            </div>
          </div>
        </div>
      </div>
    </div>
    <static-footer></static-footer>
    <image-list-popup
      v-if="iosPopFlag === 'image' || $route.params.popFlag === 'image'"
      :popping="popping"
      :hotelInfo="hotelInfo"
      :inputData="inputData"
      @close-pop="closePop"
    ></image-list-popup>
  </div>
</template>

<script>
import Format from '../../util/format'
import RoomList from './RoomList'
import Review from './Review'
import HotelInfo from './HotelInfo'
import Location from './Location'
import ImageListPopup from '../HotelList/ImageListPopup'
import Api from '../../api/api'
import StaticFooter from '../Common/Footer'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
  name: 'DetailWrapper',
  components: {
    RoomList,
    Review,
    HotelInfo,
    Location,
    ImageListPopup,
    StaticFooter,
    swiper,
    swiperSlide
  },
  props: ['mid', 'selectedHotel', 'isFromApp', 'iosPopFlag', 'wishList'],
  data () {
    let children = []
    if (this.$route.params.children !== 'null') {
      children = this.$route.params.children.split('&')
    }
    const destination = this.$route.params.destination.split('|')
    return {
      format: Format,
      hotelInfo: {},
      loading: true,
      inputData: {
        destination: {
          label: destination[0],
          lat: destination[1],
          lng: destination[2],
          type: destination[3],
          country: destination[4],
          countryName: destination[5],
          cityName: destination[6],
          cityId: destination[7],
          placeId: destination[8]
        },
        checkin: this.$route.params.checkin,
        checkout: this.$route.params.checkout,
        adults: this.$route.params.adults,
        children,
        room: this.$route.params.room
      },
      textOfMonth: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
      tabNum: 0,
      infoFix: false,
      tabFix: false,
      minHeight: window.innerHeight - 48 - 48,
      popping: false,
      nearList: [],
      swiperOption: {
        spaceBetween: 0,
        lazy: true
      },
      imgIndex: 0,
      windowInnerWidth: window.innerWidth > 700 ? 420 : window.innerWidth,
      param: ''
    }
  },
  computed: {
    getMinHeight () {
      return {
        'min-height': `${this.minHeight}px`
      }
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
  watch: {
    mid () {
      this.getHotelInfo()
    }
  },
  methods: {
    getHotelInfo () {
      // url 직접 접근이거나 해당 페이지에서 reload시 호텔로 재검색
      const obj = {
        checkin: this.inputData.checkin,
        checkout: this.inputData.checkout,
        numberOfAdults: this.inputData.adults,
        numberOfChildren: this.inputData.children.length,
        numberOfRooms: this.inputData.room,
        agesOfChildren: this.inputData.children.length > 0 ? this.inputData.children.join(',') : ''
      }
      if (this.mid) {
        obj.midToken = this.mid
      }
      if (this.param === JSON.stringify(obj)) {
        return
      }
      this.param = JSON.stringify(obj)
      this.loading = true
      Api.hotelDetail(this.$route.params.hotelKey, obj).then((resp) => {
        this.hotelInfo = resp.data
        this.loading = false
      }).catch((e) => {
        setTimeout(() => {
          if (!this.loading) {
            this.loading = false
          }
        }, 10)
        setTimeout(() => {
          if (!this.loading) {
            this.popAlert('해당 호텔의 정보가 없습니다.', 'main')
          }
        }, 20)
      })
    },
    scrollEvent () {
      if (window.pageYOffset > this.windowInnerWidth - 74) {
        this.infoFix = true
        if (window.pageYOffset > this.windowInnerWidth - 74 + 48) {
          this.tabFix = true
        } else {
          this.tabFix = false
        }
      } else {
        this.infoFix = false
        this.tabFix = false
      }
    },
    openPop (flag) {
      this.$emit('open-pop', flag)
    },
    closePop () {
      this.$emit('close-pop')
    },
    changeImageIndex () {
      setTimeout(() => {
        this.imgIndex = this.$refs.detailSwiper.swiper.activeIndex
      }, 300)
    },
    addWish (item) {
      window.EventBus.$emit('addWishHotel', item, this.inputData)
    },
    delWish (hotelId) {
      window.EventBus.$emit('delWishHotel', hotelId)
    },
    changeTabNum (num) {
      if (num === 2) {
        // 후기 일단 막아놈
        this.popAlert('준비중입니다.')
        return
      }
      this.tabNum = num
    },
    popAlert (message, event) {
      this.$emit('pop-alert', 'alert', message, event)
    }
  },
  mounted () {
    if (parseInt(this.selectedHotel.hotelId, 10) === parseInt(this.$route.params.hotelKey, 10)) {
      this.hotelInfo = this.selectedHotel
      this.loading = false
    } else {
      this.getHotelInfo()
    }
    window.addEventListener('scroll', this.scrollEvent)
    window.scrollTo(0, 0)
  }
}
</script>

<style scoped>
  .detailWrapper{
    max-width: 700px;
    margin: 0 auto;
  }
  .hotelDetailLoading{
    padding: 30px;
    text-align: center;
    position: relative;
  }
  .hotelDetailLoading .box_inner {position:absolute;top:50%;left:0;width:100%;margin-top:-58px;text-align:center;}
  .hotelDetailLoading .box_inner .t_gr1 {font-size:18px;line-height:21px;padding-top:20px;}
  .hotelDetailLoading .box_inner .t_gr1 span {color:#25B8CB;}
  .hotelDetailLoading .box_inner .t_gr2 {padding-top:7px;}
  .bgDetail{
    width: 100%;
    max-width: 700px;
    position: absolute;
    top: 48px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
    pointer-events: none;
  }
  .bgDetail:before{
    height: 130px;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, .6));
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 0;
  }
  .bgDetail > div{
    color: #FFF;
    z-index: 1;
    padding: 0 20px 14px;
    position: absolute;
    bottom: 0;
  }
  .bgDetail > div > .star{
    height: 11px;
    margin-bottom: 0;
  }
  .bgDetail > div > .star > span{
    margin-right: 6px;
    float: left;
    width: 11px;
    height: 11px;
    background: url(../../assets/star.svg) no-repeat;
    background-size: cover;
  }
  .bgDetail > div > .star > span:last-of-type{
    margin-right: 0;
  }
  .bgDetail > div > .name {
    font-size: 26px;
    font-weight: 500;
    line-height: 28px;
    padding: 8px 0;
  }
  .bgDetail > div > .etc {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: -0.3px;
  }
  .bgDetail > div > .etc > span:nth-of-type(2):before{
    display: inline-block;
    content: '';
    border-left: 1px solid #ccc;
    height: 10px;
    position: relative;
    top: 1px;
    padding-left: 4px;
    margin-left: 2px;
  }
  button.imgMore{
    position: absolute;
    right: 10px;
    bottom: 12px;
    line-height: 22px;
    height: 22px;
    padding: 0;
    border: 0;
    background-color: transparent;
    font-size: 12px;
    color: #FFF;
    z-index: 1;
    pointer-events: all;
  }
  button.imgMore:after{
    content: '';
    display: block;
    width: 22px;
    height: 22px;
    float: right;
    background-image: url(../../assets/plus.svg);
    margin-left: 4px;
  }
  .contentDetail{
    background-color: #FFF;
    position: relative;
  }
  .header{
    height: 48px;
  }
  .header > button{
    height: 48px;
    float: left;
    width: 25%;
    box-shadow: inset 0 -1px 0 0 #ebebeb;
    text-align: center;
    line-height: 48px;
    font-size: 16px;
    font-weight: 400;
    color: #767677;
    cursor: pointer;
  }
  .header > button.selected{
    color: #111;
    border-bottom: 2px solid #1a1a1c;
  }
  .fixedHeader{
    height: auto;
    position: fixed;
    top: 48px;
    left: 0;
    z-index: 5;
    width: 100%;
    transition: .3s ease;
  }
  .fixedHeader.hide{
    pointer-events: none;
  }
  .topOut .fixedHeader{
    transform: translateY(-48px);
  }
  .fixedHeader > div{
    opacity: 0;
    background-color: #FFF;
    position: relative;
    max-width: 700px;
    margin: 0 auto;
    pointer-events: none;
    z-index: 1;
    transition: .1s ease;
  }
  .fixedHeader > div:first-of-type{
    height: 74px;
    padding: 10px 20px;
    border-bottom: 1px solid #ebebeb;
  }
  .fixedHeader > div.fixed{
    opacity: 1;
    pointer-events: all;
    display: block !important;
  }
  .fixedHeader > div:first-of-type > .star{
    height: 15px;
    margin-bottom: 3px;
  }
  .fixedHeader > div:first-of-type > .star > span{
    margin-right: 5px;
    float: left;
    width: 11px;
    height: 11px;
    background: url(../../assets/star.svg) no-repeat;
    background-size: cover;
  }
  .fixedHeader > div:first-of-type > .star > span:last-of-type{
    margin-right: 0;
  }
  .fixedHeader > div:first-of-type > .name {
    font-size: 18px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 18px;
  }
  .fixedHeader > div:first-of-type > .etc {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: -0.3px;
    color: #999999;
    margin-top: 2px;
  }
  .fixedHeader > div:first-of-type > .etc > span:nth-of-type(2):before{
    display: inline-block;
    content: '';
    border-left: 1px solid #ccc;
    height: 10px;
    position: relative;
    top: 1px;
    padding-left: 4px;
    margin-left: 2px;
  }
  .fixedHeader > div:last-of-type{
    display: none;
  }
  .bgImages{
    height: 100%;
  }
  .swiperImage{
    width: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #333;
  }
  .swiper-lazy-preloader{
    width: 30px;
    height: 30px;
    margin-left: -15px;
    margin-top: -15px;
  }
  .wishBtn{
    position: fixed;
    top: 58px;
    right: 10px;
    width: 32px;
    height: 32px;
    z-index: 6;
    opacity: 0.9;
    background-color: rgba(26, 26, 28, 0.4);
    border: solid 1px rgba(26, 26, 28, 0.1);
    border-radius: 16px;
    transition: .3s ease;
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
  .topOut .wishBtn{
    transform: translateY(-40px);
  }
</style>
