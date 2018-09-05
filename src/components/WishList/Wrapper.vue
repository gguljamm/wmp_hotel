<template>
  <div class="wishListWrapper" :style="getMinHeight">
    <div v-if="wishLoading" class="hotelDetailLoading" :style="getMinHeight">
      <div class="box_inner">
        <p><img src="https://air.wonderscdn.app/images/common/loading_img.gif" alt=""></p>
        <p class="t_gr1"><span>당신의 원더랜드</span>를 찾는 중이에요</p>
        <p class="t_gr2">잠시만 기다려주세요</p>
      </div>
    </div>
    <div class="noResult" v-else-if="!wishLoading && wishList.length === 0" :style="getMinHeight">
      찜한 호텔이 없습니다.
    </div>
    <transition-group v-else tag="ul" name="fade">
      <li v-for="(x, index) in wishList" :key="x.id">
        <div></div>
        <div @click="submit(x)">
          <div>{{ x.city }}, {{ x.country }}</div>
          <div>
            <span>{{ format.dateFormat(x.checkin) }}({{ format.getDayOfWeek(x.checkin) }}) - {{ format.dateFormat(x.checkout) }}({{ format.getDayOfWeek(x.checkout) }}) / {{ format.getBetweenDay(x.checkin, x.checkout) }}박</span>
            <span>성인 {{ x.numAdult }}명, <span v-if="x.numChildren > 0">어린이 {{ x.numChildren }}명, </span>객실 {{ x.numRoom }}개</span></div>
          <div
            :style="{
              height: `${imageHeight - 30}px`
            }"
          >
            <swiper-image
              :imageIndex="index"
              :images="x.images"
              @image-index-change="imageIndexChange"
            ></swiper-image>
            <button class="shareDel"
              @click.stop="delWish(x.wonderHotelInfoId)"
            ></button>
            <button class="imgMore"
              v-if="Array.isArray(x.images) && x.images.length > 1"
              @click.stop="openPop(index)"
            >{{ setImageUrl[index] ? setImageUrl[index] + 1 : arrImageIndex[index] + 1 }}/{{ x.images.length }}</button>
          </div>
          <div class="star"><span v-for="y in x.star" :key="y"></span></div>
          <div>{{ x.hotelName }}</div>
          <div><span class="signal">₩</span><span class="roboto">{{ format.numberFormat(x.price) }}</span></div>
        </div>
      </li>
    </transition-group>
    <image-list-popup
      v-if="iosPopFlag === 'image' || $route.params.popFlag === 'image'"
      :hotelInfo="wishList[selectedIndex]"
      @close-pop="closePop"
    ></image-list-popup>
    <static-footer></static-footer>
  </div>
</template>

<script>
import StaticFooter from '../Common/Footer'
import Format from '../../util/format'
import SwiperImage from './SwiperImage'
import ImageListPopup from './ImageListPopup'

export default {
  props: ['mid', 'wishList', 'iosPopFlag', 'wishLoading'],
  components: {
    StaticFooter,
    SwiperImage,
    ImageListPopup
  },
  data () {
    const today = new Date()
    const todayString = `${today.getFullYear()}-${Format.zeros(today.getMonth() + 1)}-${Format.zeros(today.getDate())}`
    return {
      format: Format,
      setImageUrl: {},
      minHeight: window.innerHeight - 48 - 48,
      selectedIndex: 0,
      imageHeight: window.innerWidth > 700 ? 700 : window.innerWidth,
      todayString
    }
  },
  computed: {
    arrImageIndex () {
      const arr = []
      for (let x = 0; x < this.wishList.length; x += 1) {
        arr.push(0)
      }
      return arr
    },
    getMinHeight () {
      return {
        'min-height': `${this.minHeight}px`
      }
    }
  },
  methods: {
    imageIndexChange (imageIndex, index) {
      this.$set(this.setImageUrl, imageIndex, index)
    },
    openPop (index) {
      this.selectedIndex = index
      this.$emit('open-pop', 'image')
    },
    closePop () {
      this.$emit('close-pop')
    },
    submit (hotelInfo) {
      let checkin = hotelInfo.checkin
      let checkout = hotelInfo.checkout
      if (parseInt(checkin.replace(/-/g, '')) < parseInt(this.todayString.replace(/-/g, ''))) {
        const today = new Date()
        today.setDate(today.getDate() + this.format.getBetweenDay(checkin, checkout))
        checkin = this.todayString
        checkout = this.format.getToday(today)
        console.log(checkin, checkout)
      }
      const children = hotelInfo.numChildren > 0 ? hotelInfo.childrenAge.replace(/,/gi, '&') : 'null'
      const param = [
        hotelInfo.destination,
        checkin,
        checkout,
        hotelInfo.numAdult,
        children,
        hotelInfo.numRoom,
        hotelInfo.wonderHotelInfoId
      ]
      window.EventBus.$emit('reset-selected-hotel')
      this.$router.push(
        `/detail/${param.join('/')}${window.location.search}${window.location.hash}`
      )
    },
    getWishHotel () {
      window.EventBus.$emit('getWishHotel')
    },
    delWish (id) {
      window.EventBus.$emit('delWishHotel', id)
    }
  }
}
</script>

<style scoped>
  .wishListWrapper{
    background-color: #f5f4f0;
    max-width: 700px;
    margin: 0 auto;
  }
  .wishListWrapper ul{
    padding-top: 60px;
    padding-left: 30px;
  }
  .wishListWrapper ul li{
    padding-bottom: 47px;
    border-left: 1px solid #ddd;
    position: relative;
  }
  .wishListWrapper ul li > div:first-of-type{
    width: 20px;
    height: 20px;
    background-color: #dcbba0;
    border-radius: 100%;
    position: absolute;
    left: -10px;
    top: -10px;
  }
  .wishListWrapper ul li > div:first-of-type:before{
    content: '';
    width: 8px;
    height: 8px;
    background-color: #ffffff;
    border: solid 1px #9f744f;
    position: absolute;
    left: 6px;
    top: 6px;
    border-radius: 100%;
    box-sizing: border-box;
  }
  .wishListWrapper ul li > div:nth-of-type(2){
    transform: translateY(-20px);
    cursor: pointer;
  }
  .wishListWrapper ul li > div:nth-of-type(2) > div:first-of-type{
    font-weight: 500;
    padding-left: 20px;
  }
  .wishListWrapper ul li > div:nth-of-type(2) > div:nth-of-type(2){
    color: #999999;
    font-size: 12px;
    padding-left: 20px;
  }
  .wishListWrapper ul li > div:nth-of-type(2) > div:nth-of-type(2) > span:nth-of-type(2):before{
    display: inline-block;
    content: "";
    border-left: 1px solid #ccc;
    height: 10px;
    position: relative;
    top: 1px;
    padding-left: 4px;
    margin-left: 4px;
  }
  .wishListWrapper ul li > div:nth-of-type(2) > div:nth-of-type(3){
    width: 100%;
    background-color: #333;
    margin-top: 25px;
    position: relative;
  }
  .wishListWrapper ul li > div:nth-of-type(2) > div:nth-of-type(4){
    margin-top: 20px;
    margin-left: 20px;
  }
  .wishListWrapper .star{
    height: 15px;
    margin-bottom: 4px;
  }
  .wishListWrapper .star > span{
    margin-right: 5px;
    float: left;
    width: 12px;
    height: 12px;
    background: url(../../assets/star.svg) no-repeat;
    background-size: cover;
  }
  .wishListWrapper .star > span:last-of-type{
    margin-right: 0;
  }
  .wishListWrapper ul li > div:nth-of-type(2) > div:nth-of-type(5){
    color: #111;
    font-size: 24px;
    line-height: 28px;
    padding-left: 20px;
    padding-right: 20px;
    font-weight: 500;
  }
  .wishListWrapper ul li > div:nth-of-type(2) > div:nth-of-type(6){
    padding-left: 20px;
    color: #b18e79;
    font-size: 20px;
    margin-top: 8px;
  }
  .wishListWrapper button.imgMore{
    position: absolute;
    right: 10px;
    bottom: 10px;
    line-height: 22px;
    height: 22px;
    padding: 0;
    z-index: 3;
    color: #FFF;
    border: 0;
    background-color: transparent;
    font-size: 12px;
  }
  .wishListWrapper .shareDel{
    position: absolute;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    z-index: 6;
    opacity: 0.8;
    background-image: linear-gradient(315deg, #e26130, #efb07c);
    border-radius: 16px;
  }
  .wishListWrapper .shareDel:before{
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
  .wishListWrapper button.imgMore:after{
    content: '';
    display: block;
    width: 22px;
    height: 22px;
    float: right;
    background-image: url(../../assets/plus.svg);
    margin-left: 4px;
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
  .noResult{
    text-align: center;
    font-size: 20px;
    padding: 100px 0;
  }
</style>
