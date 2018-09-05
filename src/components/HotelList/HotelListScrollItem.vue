<template>
  <li @click="submit(item)">
    <button class="wishBtn"
      @click.stop="computedWishList.indexOf(item.hotelId) >= 0 ? delWish(item.hotelId) : addWish(item)"
      :class="computedWishList.indexOf(item.hotelId) >= 0 ? 'selected' : ''"></button>
    <div class="imageBack"
      :style="{height: `${windowInnerWidth * 0.6}px`}"
    >
      <swiper-image
        :imageIndex="index"
        :images="item.imageUrls"
        @image-index-change="imageIndexChange"
      ></swiper-image>
      <div class="hotelDesc">
        <div>{{ item.name }}</div>
        <div>{{ item.address }}</div>
        <div>
          <span class="starWrapper" v-if="item.star"><span class="star" v-for="y in parseInt(item.star, 10)" :key="y"></span></span>
          <span v-if="item.rating"><span v-if="!item.numberOfReviews || !item.star">평점: </span>{{ item.rating * 2 }}</span>
          <span v-if="item.numberOfReviews" class="thin"> ({{ format.numberFormat(item.numberOfReviews) }}개 리뷰)</span>
        </div>
      </div>
    </div>
    <button class="imgMore"
      v-if="Array.isArray(item.imageUrls) && item.imageUrls.length > 1"
      @click.stop="openImagePop(index)"
      :style="{top: `${windowInnerWidth * 0.6}px`}"
    >{{ setImageUrl[index] ? setImageUrl[index] + 1 : arrImageIndex[index] + 1 }}/{{ item.imageUrls.length }}</button>
    <div class="btnBack">
      <button class="submit" v-if="item.rooms && item.rooms.length > 0" :class="promotion ? '' : 'noPromotion'">
        <div>{{ promotion }}</div>
        <div><span class="signal">₩</span><span class="roboto">{{ format.numberFormat(parseInt(item.rooms[0].totalPrice, 10)) }}</span></div>
        <div>1박평균 <span class="signal">₩</span><span class="roboto">{{ format.numberFormat(parseInt(item.rooms[0].pricePerNight, 10)) }}</span></div>
        <div>가격비교</div>
      </button>
    </div>
  </li>
</template>

<script>
import Format from '../../util/format'
import SwiperImage from './SwiperImage'

export default {
  components: {
    SwiperImage
  },
  props: {
    inputData: {
      required: true
    },
    item: {
      required: true
    },
    index: {
      required: true
    },
    sortedList: {
      required: true
    },
    mid: {
      required: true
    },
    computedWishList: {
      required: true
    }
  },
  data () {
    return {
      format: Format,
      promotion: '', // 프로모션 텍스트 입력하면 UI적용됩니다.
      setImageUrl: {},
      windowInnerWidth: window.innerWidth > 700 ? 700 : window.innerWidth
    }
  },
  methods: {
    imageIndexChange (imageIndex, index) {
      this.$set(this.setImageUrl, imageIndex, index)
    },
    openImagePop (index) {
      this.$emit('change-scroll-pop-image-index', index)
      this.$emit('open-pop', 'image')
    },
    submit (value) {
      this.$emit('submit', value)
    },
    addWish (item) {
      window.EventBus.$emit('addWishHotel', item, this.inputData)
    },
    delWish (hotelId) {
      window.EventBus.$emit('delWishHotel', hotelId)
    }
  },
  computed: {
    arrImageIndex () {
      const arr = []
      for (let x = 0; x < this.sortedList.length; x += 1) {
        arr.push(0)
      }
      return arr
    }
  }
}
</script>

<style scoped>
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
  .imageBack > div:first-of-type:after{
    content: '';
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 140px;
    left: 0;
    z-index: 1;
    background-image: linear-gradient(to bottom, rgba(92, 110, 124, 0), #b18e79);
    pointer-events: none;
  }
  .imageBack{
    position: relative;
  }
  .hotelDesc{
    padding: 180px 20px 0;
    position: relative;
  }
  .hotelDesc{
    padding: 0 20px;
    color: #FFF;
    position: absolute;
    bottom: 0;
    width: 100%;
    left: 0;
    z-index: 3;
    pointer-events: none;
  }
  .hotelDesc > *{
    color: #FFF;
  }
  .hotelDesc > div:first-of-type {
    font-size: 20px;
    font-weight: 500;
  }
  .hotelDesc > div:nth-of-type(2){
    font-size: 12px;
    letter-spacing: -.3px;
    margin-top: 4px;
    line-height: 17px;
    font-weight: 400;
  }
  .hotelDesc > div:nth-of-type(3){
    margin-top: 7px;
    font-size: 12px;
    letter-spacing: -.3px;
  }
  .hotelDesc > div:nth-of-type(2):before{
    width: 13px;
    height: 15px;
    float: left;
    content: '';
    margin-right: 5px;
    background: url(../../assets/location.svg) no-repeat;
  }
  button.imgMore{
    position: absolute;
    right: 20px;
    margin-top: -17px;
    line-height: 22px;
    height: 22px;
    padding: 0;
    z-index: 3;
    color: #FFF;
    border: 0;
    background-color: transparent;
    font-size: 12px;
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
  .starWrapper{
    margin-right: 5px;
  }
  .starWrapper:after{
    content: '|';
    color: rgba(255, 255, 255, .3);
    margin-left: 5px;
  }
  .hotelDesc .star{
    margin-top: 4px;
    margin-right: 6px;
    float: left;
    width: 13px;
    height: 13px;
    background: url(../../assets/star.svg) no-repeat;
  }
  .hotelDesc .star:last-of-type{
    margin-right: 0;
  }
  .hotelDesc .thin{
    font-weight: 400;
  }
  .btnBack{
    margin-top: 20px;
    padding: 0 20px;
    min-height: 40px;
  }
  .btnBack button.submit{
    width: 100%;
    height: 90px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 0;
    margin-bottom: 20px;
    padding: 0;
    position: relative;
  }
  button.submit > div{
    position: absolute;
  }
  button.submit > div:first-of-type{
    padding: 0 4px;
    height: 20px;
    opacity: 0.8;
    background-color: #1a1a1c;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: -0.5px;
    color: #ffffff;
    line-height: 20px;
    left: 20px;
    top: 10px;
  }
  button.submit.noPromotion > div:first-of-type{
    opacity: 0;
  }
  button.submit > div:nth-of-type(2){
    color: #000;
    font-size: 24px;
    top: 32px;
    left: 20px;
  }
  button.submit.noPromotion > div:nth-of-type(2){
    top: 16px;
  }
  button.submit > div:nth-of-type(3){
    bottom: 12px;
    left: 20px;
    color: #999;
    font-size: 12px;
  }
  button.submit.noPromotion > div:nth-of-type(3){
    bottom: 24px;
  }
  button.submit > div:nth-of-type(4){
    width: 80px;
    height: 30px;
    border-radius: 15px;
    color: #ffffff;
    font-size: 14px;
    line-height: 30px;
    background-color: #ff7e55;
    top: 30px;
    right: 20px;
  }
</style>
