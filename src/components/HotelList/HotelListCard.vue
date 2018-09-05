<template>
  <div class="hotelList"
    ref="hotelList"
    @touchstart="presentTouchStart"
    @touchend="presentTouchEnd"
    @touchmove="presentTouchMove"
  >
    <div class="drop-shadow-down" :class="parseInt(hotelIndex) === 0 ? '' : 'show'"></div>
    <div v-if="exceptSoldOutList.length > 0 && listHeight > 0">
      <div v-if="!loadingHotelList" class="pageSelectorButton">검색 결과 {{ computedNum }}</div>
      <div class="pageLoading" v-else></div>
      <div class="hotelListCont before"
        v-if="hotelIndex > 0"
        :style="getContStyle('before')"
        ref="before"
      >
        <hotel-list-card-item
          :key="hotelIndex - 1"
          :index="hotelIndex - 1"
          :hotelInfo="sortedList[hotelIndex - 1]"
          :inputData="inputData"
          :computedWishList="computedWishList"
        ></hotel-list-card-item>
      </div>
      <div class="hotelListCont present"
        :style="getContStyle('present')"
        ref="present"
      >
        <hotel-list-card-item
          :key="hotelIndex"
          :index="hotelIndex"
          :hotelInfo="sortedList[hotelIndex]"
          :inputData="inputData"
          :listHeight="listHeight"
          :scrollTop="scrollTop"
          :isPresent="true"
          :mid="mid"
          :isFromApp="isFromApp"
          :computedWishList="computedWishList"
          @set-client-height="setClientHeight"
          @open-pop="openPop"
          @submit="submit"
        ></hotel-list-card-item>
      </div>
      <div class="hotelListCont after"
        v-if="hotelIndex < exceptSoldOutList.length - 1"
        :style="getContStyle('after')"
        ref="after"
      >
        <hotel-list-card-item
          :key="hotelIndex + 1"
          :index="hotelIndex + 1"
          :hotelInfo="sortedList[hotelIndex + 1]"
          :inputData="inputData"
          :computedWishList="computedWishList"
        ></hotel-list-card-item>
      </div>
    </div>
    <div v-else-if="loadingHotelList">
      <hotel-loading></hotel-loading>
    </div>
    <div class="listNoti" v-else>검색한 도시/날짜에<br>머물 수 있는 호텔이 없습니다.</div>
    <div class="drop-shadow-up" :class="parseInt(hotelIndex) === exceptSoldOutList.length - 1 ? '' : 'show'"></div>
  </div>
</template>

<script>
import HotelListCardItem from './HotelListCardItem'
import HotelLoading from './HotelLoading'
import Format from '../../util/format'

export default {
  props: ['exceptSoldOutList', 'sortedList', 'hotelIndex', 'inputData', 'loadingHotelList', 'popping', 'totalCount', 'mid', 'isFromApp', 'computedWishList'],
  components: {
    HotelListCardItem,
    HotelLoading
  },
  data () {
    return {
      format: Format,
      isPossibleTop: true,
      isPossibleBottom: true,
      lastTouchOffsetY: 0,
      clientHeight: 0,
      scrollTop: 0,
      scrollTopStatic: 0,
      startOffsetY: 0,
      moveOffsetY: 0,
      listHeight: 0,
      scrollGap: 50, // 페이징 스크롤 민감도 (px단위)
      duringScroll: false
    }
  },
  computed: {
    computedNum () {
      if (this.totalCount >= 100) {
        return `${this.totalCount}개`
      } else {
        return `100개 미만`
      }
    }
  },
  methods: {
    presentTouchStart (event) {
      if (this.duringScroll || (!this.isPossibleTop && !this.isPossibleBottom)) {
        return
      }
      this.startOffsetY = event.changedTouches[0].pageY
    },
    presentTouchMove (event) {
      const offsetY = event.changedTouches[0].pageY
      this.lastTouchOffsetY = offsetY
      if (this.duringScroll) {
        return
      }
      if ((!this.isPossibleBottom && this.startOffsetY > offsetY) ||
        (!this.isPossibleTop && this.startOffsetY < offsetY)) {
        event.preventDefault()
        let positionY = this.scrollTopStatic + this.startOffsetY - offsetY
        if (positionY < 0) {
          positionY = 0
        } else if (positionY > this.clientHeight - this.listHeight) {
          positionY = this.clientHeight - this.listHeight
        }
        this.scrollTop = positionY
        if (this.scrollTop <= 0) {
          this.isPossibleTop = true
          this.isPossibleBottom = false
          this.startOffsetY = this.lastTouchOffsetY
        } else if (this.scrollTop + this.listHeight < this.clientHeight) {
          this.isPossibleTop = false
          this.isPossibleBottom = false
        } else {
          this.isPossibleBottom = true
          this.isPossibleTop = false
          this.startOffsetY = this.lastTouchOffsetY
        }
      } else {
        event.preventDefault()
        this.moveOffsetY = offsetY
        this.scrollTopStatic = this.scrollTop
      }
    },
    presentTouchEnd (event) {
      this.scrollTopStatic = this.scrollTop
      if (this.moveOffsetY === 0 || this.duringScroll) {
        return
      }
      if (!this.isPossibleTop && !this.isPossibleBottom) {
        return
      }
      const gap = this.startOffsetY - this.moveOffsetY
      if (gap > this.scrollGap && this.hotelIndex < this.exceptSoldOutList.length - 1) {
        event.preventDefault()
        this.duringScroll = true
        this.scrollDown(this.$refs.after, 0, 200)
      } else if (gap < -this.scrollGap && this.hotelIndex > 0) {
        event.preventDefault()
        this.duringScroll = true
        this.scrollUp(this.$refs.present, this.listHeight, 200)
      } else {
        this.startOffsetY = 0
        this.moveOffsetY = 0
      }
    },
    getContStyle (index) {
      const styleObj = {}
      const gap = this.startOffsetY - this.moveOffsetY
      if (index === 'before') {
        if (this.hotelIndex === 0 || this.moveOffsetY === 0) {
          styleObj['opacity'] = 0
        } else if (this.startOffsetY < this.moveOffsetY) {
          const gapPercent = gap * -1 / this.listHeight
          styleObj['opacity'] = gapPercent
          const gapPercentBig = (gapPercent / 5) + 0.8
          styleObj['transform'] = `scale3d(${gapPercentBig},${gapPercentBig},${gapPercentBig})`
        } else {
          styleObj['opacity'] = 0
        }
      } else if (index === 'present') {
        if (this.moveOffsetY === 0) {
          styleObj['opacity'] = 1
        } else if (this.hotelIndex !== this.exceptSoldOutList.length - 1 && this.startOffsetY > this.moveOffsetY) {
          const gapPercent = 1 - (gap / this.listHeight)
          styleObj['opacity'] = gapPercent
          const gapPercentBig = (gapPercent / 5) + 0.8
          styleObj['transform'] = `scale3d(${gapPercentBig},${gapPercentBig},${gapPercentBig})`
        } else if (this.hotelIndex !== 0 && this.startOffsetY < this.moveOffsetY) {
          styleObj['margin-top'] = `${(gap * -1)}px`
        } else {
          styleObj['opacity'] = 1
        }
      } else if (index === 'after') {
        if (this.moveOffsetY === 0) {
          styleObj['margin-top'] = `${this.listHeight}px`
        } else if (this.startOffsetY > this.moveOffsetY) {
          styleObj['margin-top'] = `${this.listHeight - gap}px`
        } else {
          styleObj['margin-top'] = `${this.listHeight}px`
        }
      }
      return styleObj
    },
    scrollDown (element, to, duration) {
      const start = parseInt(element.style.marginTop)
      const change = to - start
      const increment = 20
      let currentTime = 0
      const precentElement = this.$refs.present
      const animateScroll = () => {
        currentTime += increment
        var val = this.easeInOutQuad(currentTime, start, change, duration)
        element.style.marginTop = `${val}px`
        precentElement.style.opacity = val / this.listHeight
        const perBig = ((val / this.listHeight) * 0.2) + 0.8
        precentElement.style.transform = `scale3d(${perBig},${perBig},${perBig})`
        if (currentTime < duration) {
          setTimeout(animateScroll, increment)
        } else {
          this.startOffsetY = 0
          this.moveOffsetY = 0
          this.$emit('hotel-index-change', 1)
          this.duringScroll = false
          this.$nextTick(() => {
            if (this.hotelIndex === this.sortedList.length - 1) {
              this.$emit('get-hotel-list')
            }
          })
        }
      }
      animateScroll()
    },
    scrollUp (element, to, duration) {
      const start = parseInt(element.style.marginTop)
      const change = to - start
      const increment = 20
      let currentTime = 0
      const precentElement = this.$refs.before
      const animateScroll = () => {
        currentTime += increment
        var val = this.easeInOutQuad(currentTime, start, change, duration)
        element.style.marginTop = `${val}px`
        precentElement.style.opacity = val / this.listHeight
        const perBig = ((val / this.listHeight) * 0.1) + 0.9
        precentElement.style.transform = `scale3d(${perBig},${perBig},${perBig})`
        if (currentTime < duration) {
          setTimeout(animateScroll, increment)
        } else {
          this.startOffsetY = 0
          this.moveOffsetY = 0
          this.$emit('hotel-index-change', -1)
          this.duringScroll = false
        }
      }
      animateScroll()
    },
    easeInOutQuad (t, b, c, d) {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    },
    findListHeight () {
      if (this.$refs.hotelList && this.$refs.hotelList.clientHeight > 0) {
        this.listHeight = this.$refs.hotelList.clientHeight
      } else {
        setTimeout(this.findListHeight, 100)
      }
    },
    setClientHeight (value) {
      this.scrollTop = 0
      this.scrollTopStatic = 0
      this.clientHeight = value
      this.isPossibleTop = true
      if (this.clientHeight > this.listHeight) {
        this.isPossibleBottom = false
      } else {
        this.isPossibleBottom = true
      }
    },
    openPop (value) {
      this.$emit('open-pop', value)
    },
    submit (value) {
      this.$emit('submit', value)
    }
  },
  mounted () {
    if (this.$refs.hotelList && this.$refs.hotelList.clientHeight > 0) {
      this.listHeight = this.$refs.hotelList.clientHeight
    } else {
      setTimeout(this.findListHeight, 100)
    }
    window.addEventListener('resize', this.findListHeight)
    window.scrollTo(0, 0)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.findListHeight)
  }
}
</script>

<style scoped>
  .hotelList{
    position: fixed;
    bottom: 48px;
    left: 0;
    top: 118px;
    right: 0;
    overflow: hidden;
    user-select: none;
    background-color: #5c6e7c;
  }
  .hotelListCont{
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #b18e79;
    height: 100%;
  }
  .listNoti{
    font-size: 16px; padding: 50px; text-align: center; color: #FFF;
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
  .pageLoading{
    position: fixed;
    z-index: 4;
    left: 20px;
    top: 143px;
    padding: 0 4px;
    height: 22px;
    width: 60px;
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
  @keyframes spinner {
    to {transform: rotate(360deg);}
  }
  .pageLoading:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 2px;
    width: 16px;
    height: 16px;
    margin-left: -8px;
    border-radius: 50%;
    border: 1px solid #ccc;
    border-top-color: #8F9D9D;
    animation: spinner .6s linear infinite;
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
    bottom: 0;
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
    top: 70px;
  }
  .drop-shadow-down.show{
    opacity: .25;
  }
</style>
