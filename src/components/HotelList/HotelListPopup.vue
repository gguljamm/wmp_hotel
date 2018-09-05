<template>
  <div class="hotelPop" :class="iosPopFlag === 'search' || $route.params.popFlag === 'search' ? 'search' : ''" @click="closePop">
    <div :class="popping ? popping : ''" @click.stop>
      <div class="popHeader">
        <span>{{ popTitle(iosPopFlag || $route.params.popFlag) }}</span>
        <button class="close" @click="$emit('close-pop')"></button>
      </div>
      <div class="popContent">
        <hotel-filter
          v-if="iosPopFlag === 'filter' || $route.params.popFlag === 'filter'"
          :filterInfo="filterInfo"
          :sortCondition="sortCondition"
          :listingCondition="listingCondition"
          @close-pop="closePop"
          @research-with-filter="researchWithFilter"
        ></hotel-filter>
        <hotel-map
          v-if="iosPopFlag === 'map' || $route.params.popFlag === 'map'"
          :inputData="inputData"
          :hotelList="hotelList"
          :mid="mid"
          :mapList="mapList"
          :selectNumFromMap="selectNumFromMap"
          @submit="submit"
        ></hotel-map>
        <search-container
          v-if="iosPopFlag === 'search' || $route.params.popFlag === 'search'"
          :inputData="inputData"
          :subClass="'sub'"
          :filterInfo="filterInfo"
          :iosPopFlag="iosPopFlag"
          @open-pop="openPop"
          @close-pop="closePop"
          @reset-filter-info="resetFilterInfo"
          @clear-waterfall-state="clearWaterfallState"
        ></search-container>
      </div>
    </div>
  </div>
</template>

<script>
import HotelFilter from './HotelFilter'
import HotelMap from './HotelMap'
import SearchContainer from '../Search/SearchContainer'

export default {
  components: {
    HotelFilter,
    HotelMap,
    SearchContainer
  },
  name: 'SearchPopup',
  props: ['inputData', 'popping', 'filterInfo', 'sortCondition', 'hotelList', 'mid', 'mapList', 'listingCondition', 'iosPopFlag', 'selectNumFromMap'],
  methods: {
    popTitle (flag) {
      let title
      if (flag === 'filter') {
        title = '상세조건'
      } else if (flag === 'sort') {
        title = '정렬'
      } else if (flag === 'map') {
        title = '지도보기'
      }
      return title
    },
    openPop (flag) {
      this.$emit('open-pop', flag)
    },
    closePop () {
      this.$emit('close-pop')
    },
    submit (hotelId) {
      this.$emit('submit', hotelId)
    },
    researchWithFilter (filterInfo, flag, list) {
      this.$emit('research-with-filter', filterInfo, flag, list)
    },
    resetFilterInfo () {
      this.$emit('reset-filter-info')
    },
    clearWaterfallState () {
      this.$emit('clear-waterfall-state')
    }
  },
  mounted () {
    window.document.body.style.overflowY = 'hidden'
  },
  destroyed () {
    window.document.body.style.overflowY = 'auto'
  }
}
</script>

<style scoped>
  .hotelPop{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(38, 38, 40, .7);
    z-index: 20;
  }
  .hotelPop.search{
    top: 48px;
  }
  .hotelPop > div{
    top: 48px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FFF;
    position: absolute;
  }
  .hotelPop.search > div{
    background-color: transparent;
    width: 100%;
    height: 402px;
    top: 0;
  }
  .hotelPop:not(.search) > div.open{
    animation: openPopTop ease .15s;
  }
  .hotelPop:not(.search) > div.close{
    animation: closePopTop ease .15s;
  }
  .hotelPop > div .popHeader{
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #FFF;
    line-height: 60px;
    padding-left: 20px;
    border-bottom: 1px solid #ddd;
    color: #111;
    font-size: 16px;
  }
  .hotelPop.search > div .popHeader{
    display: none;
  }
  .hotelPop > div .popHeader > button.close{
    position: absolute;
    background: transparent;
    right: 0;
    top: 0;
    height: 60px;
    width: 60px;
    border: 0;
    padding: 0;
    font-size: 32px;
    background-image: url(../../assets/close.svg);
    background-repeat: no-repeat;
    background-position: center center;
  }
  .hotelPop > div .popContent {
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 0;
    right: 0;
  }
  .hotelPop.search > div .popContent{
    top: 0;
  }
  @keyframes openPopTop {
    from {
      transform: translateY(100vh);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes closePopTop {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100vh);
    }
  }
</style>
