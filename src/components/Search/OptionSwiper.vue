<template>
  <div class="swiperSpace">
    <swiper
      :options="swiperOption"
      @slideChange="changeAge"
      ref="swiper"
    >
      <swiper-slide v-for="age in 18" :key="age">{{ age - 1 }}세</swiper-slide>
    </swiper>
    <div class="backRoundCircle"></div>
  </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
  components: {
    swiper,
    swiperSlide
  },
  props: ['index', 'value'],
  data () {
    return {
      swiperOption: {
        slidesPerView: 7,
        spaceBetween: 0,
        centeredSlides: true
      }
    }
  },
  methods: {
    changeAge () {
      setTimeout(() => {
        this.$emit('change-age', this.index, this.$refs.swiper.swiper.activeIndex)
      }, 100)
    }
  },
  mounted () {
    this.$refs.swiper.swiper.slideTo(this.value, 0)
  }
}
</script>

<style scoped>
  .swiperSpace{
    width: 100%;
    text-align: center;
    position: relative;
    height: 100px;
    line-height: 100px;
    background-color: #f5f4f0;
  }
  .swiper-slide{
    font-size: 14px;
    position: relative;
    z-index: 2;
  }
  .swiper-slide.swiper-slide-active{
    color: #FFF;
  }
</style>
<style>
  .optionWrapper .swiper-container .swiper-notification{
    z-index: 0;
    opacity: 1;
    width: 58px;
    height: 58px;
    background-color: #BF9176;
    left: 50%;
    top: 50%;
    border-radius: 100%;
    margin-left: -29px;
    margin-top: -29px;
  }
</style>
