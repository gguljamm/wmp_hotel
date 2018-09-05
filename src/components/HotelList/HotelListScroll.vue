<template>
  <div class="hotelList">
    <div class="drop-shadow-down" :class="toppest ? '' : 'show'"></div>
    <div v-if="!loadingHotelList" class="pageSelectorButton">검색 결과 {{ computedNum }}</div>
    <div>
      <hotel-loading v-if="isNeedScroll"></hotel-loading>
    </div>
    <ul v-if="exceptSoldOutList.length > 0" ref="hotelList" :class="isNeedScroll ? 'hide' : ''">
      <waterfall
        v-if="isShowWaterfall"
        :scrollTop="scrollTop"
        :containerHeight="containerHeight"
        :containerWidth="containerWidth"
        :waterfallState="waterfallState"
        :itemPadding="padding"
        :startGrid="grid"
        :list="exceptSoldOutList"
        ref="waterfall"
      >
        <component
          slot="cell"
          slot-scope="props"
          :is="'item'"
          :inputData="inputData"
          :item="props.item"
          :index="props.index"
          :itemWidth="props.itemWidth"
          :itemSpaceBottom="1"
          :sortedList="sortedList"
          :mid="mid"
          :computedWishList="computedWishList"
          @change-scroll-pop-image-index="changeScrollPopImageIndex"
          @open-pop="openPop"
          @submit="submit"
        ></component>
      </waterfall>
      <div class="pageLoading" v-if="loadingHotelList"></div>
    </ul>
    <div v-else-if="loadingHotelList">
      <hotel-loading></hotel-loading>
    </div>
    <div class="listNoti" v-else>검색한 도시/날짜에<br>머물 수 있는 호텔이 없습니다.</div>
    <div class="drop-shadow-up" :class="endBottom ? '' : 'show'"></div>
    <button @click="goTop" :class="toppest ? '' : 'show'" class="topButton"></button>
  </div>
</template>

<script>
import HotelLoading from './HotelLoading'
import Format from '../../util/format'
import Item from './HotelListScrollItem'

export default {
  components: {
    HotelLoading,
    Item
  },
  props: ['exceptSoldOutList', 'sortedList', 'hotelIndex', 'inputData', 'loadingHotelList', 'popping', 'totalCount', 'mid', 'lastScrollTop', 'waterfallState', 'computedWishList'],
  data () {
    return {
      format: Format,
      endBottom: false,
      toppest: true,
      promotion: '',
      isShowWaterfall: false,
      scrollTop: 0,
      containerWidth: 0,
      containerHeight: 0,
      padding: 0,
      grid: 1,
      range: 10,
      isNeedScroll: true
    }
  },
  computed: {
    arrImageIndex () {
      const arr = []
      for (let x = 0; x < this.sortedList.length; x += 1) {
        arr.push(0)
      }
      return arr
    },
    computedNum () {
      if (this.totalCount >= 100) {
        return `${this.totalCount}개`
      } else {
        return `100개 미만`
      }
    }
  },
  methods: {
    openPop (value) {
      this.$emit('open-pop', value)
    },
    submit (value) {
      this.$emit('submit', value)
    },
    changeScrollTop () {
      if (!this.loadingHotelList) {
        this.$emit('last-scroll-top-change', window.pageYOffset)
        this.scrollTop = window.pageYOffset
        if (window.pageYOffset >= this.$refs.hotelList.clientHeight - window.innerHeight + 118) {
          if (this.loadingHotelList) {
            return
          }
          this.$emit('get-hotel-list')
          this.endBottom = true
        } else {
          this.endBottom = false
        }
        if (window.pageYOffset === 0) {
          this.toppest = true
        } else {
          this.toppest = false
        }
      }
    },
    goTop () {
      window.scrollTo(0, 0)
    },
    addWish () {
      alert('준비중입니다')
    },
    openImagePop (index) {
      this.$emit('change-scroll-pop-image-index', index)
      this.$emit('open-pop', 'image')
    },
    changeScrollPopImageIndex (index) {
      this.$emit('change-scroll-pop-image-index', index)
    }
  },
  mounted () {
    // const last = parseInt(this.lastScrollTop, 10)
    // const vThis = this
    // function scrolling () {
    //   if (window.pageYOffset < last) {
    //     setTimeout(() => {
    //       window.scrollTo(0, parseInt(last, 10))
    //       scrolling()
    //     }, 10)
    //   } else {
    //     vThis.isNeedScroll = false
    //   }
    // }
    // const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    // if (this.lastScrollTop > 0 && !iOS) {
    //   scrolling()
    // } else {
    //   this.isNeedScroll = false
    // }
    this.isNeedScroll = false
    window.addEventListener('scroll', this.changeScrollTop)
    this.containerHeight = window.innerHeight
    this.containerWidth = window.innerWidth > 700 ? 700 : window.innerWidth
    this.isShowWaterfall = true
  },
  beforeDestroy () {
    this.$emit('set-waterfall-state', this.$refs.waterfall && this.$refs.waterfall.state ? this.$refs.waterfall.state : null)
  },
  destroyed () {
    window.removeEventListener('scroll', this.changeScrollTop)
  }
}
</script>

<style scoped>
  .hotelList{
    position: relative;
    user-select: none;
    padding-top: 70px;
  }
  .listNoti{
    font-size: 16px; padding: 50px; text-align: center; color: #FFF;
    position: fixed;
    top: 118px;
    bottom: 48px;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #5C6E7C;
  }
  .hotelList > ul{
    background-color: #b18e79;
    opacity: 1;
    transition: opacity .3s ease;
  }
  .hotelList > ul.hide{
    opacity: 0;
  }
  .hotelList > ul > li{
    position: relative;
  }
  .pageLoading{
    position: relative;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    background-color: #333;
    color: #FFF;
    font-size: 12px;
  }
  @keyframes spinner {
    to {transform: rotate(360deg);}
  }
  .pageLoading:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 7px;
    width: 16px;
    height: 16px;
    margin-left: -8px;
    border-radius: 50%;
    border: 1px solid #ccc;
    border-top-color: #8F9D9D;
    animation: spinner .6s linear infinite;
  }
  .pageSelectorButton{
    position: fixed;
    z-index: 4;
    left: 20px;
    top: 143px;
    padding: 0 4px;
    height: 22px;
    line-height: 20px;
    text-align: center;
    color: #FFF;
    font-size: 10px;
    transition: .3s ease;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.1);
    border: solid 1px rgba(0, 0, 0, 0.08);
    pointer-events: none;
  }
  .topOut .pageSelectorButton{
    transform: translateY(-48px);
  }
  .drop-shadow-up {
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 48px;
    height: 10px;
    opacity: 0;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0,0,0,.6));
    z-index: 5;
    transition: .3s ease;
    pointer-events: none;
  }
  .scrollDown .drop-shadow-up{
    transform: translateY(48px);
  }
  .drop-shadow-up.show{
    opacity: .3;
  }
  .drop-shadow-down {
    width: 100%;
    position: fixed;
    left: 0;
    top: 118px;
    height: 10px;
    opacity: 0;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0,0,0,.6));
    z-index: 5;
    transition: .3s ease;
    pointer-events: none;
  }
  .topOut .drop-shadow-down{
    transform: translateY(-48px);
  }
  .drop-shadow-down.show{
    opacity: .25;
  }
  .topButton{
    width: 45px;
    height: 45px;
    background-color: #1a1a1c;
    border-radius: 100%;
    position: fixed;
    bottom: 60px;
    right: 15px;
    z-index: 5;
    transition: .3s ease;
    background-image: url(../../assets/top.svg);
    background-size: 12px;
    background-repeat: no-repeat;
    background-position: center center;
    opacity: 0;
    pointer-events: none;
  }
  .topButton.show{
    opacity: 1;
    pointer-events: all;
  }
  .scrollDown .topButton{
    transform: translateY(48px);
  }
</style>
