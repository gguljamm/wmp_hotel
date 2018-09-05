<template>
  <swiper
    :options="swiperOption"
    :ref="'swiper'"
    @slideChange="changeImageIndex"
  >
    <swiper-slide
      v-for="(x, index) in images"
      :key="index"
    >
      <div class="swiperImage swiper-lazy" v-bind:data-background="x"
        :style="{height: `${windowInnerWidth * 0.6}px`}"
      ></div>
      <div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
    </swiper-slide>
  </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
export default {
  components: {
    swiper,
    swiperSlide
  },
  props: ['imageIndex', 'images'],
  data () {
    return {
      swiperOption: {
        spaceBetween: 0,
        lazy: true
      },
      windowInnerWidth: window.innerWidth > 700 ? 700 : window.innerWidth
    }
  },
  methods: {
    changeImageIndex () {
      setTimeout(() => {
        this.$emit('image-index-change', this.imageIndex, this.$refs.swiper.swiper.activeIndex)
      }, 300)
    }
  }
}
</script>

<style scoped>
  .swiperImage{
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    background-color: #333;
  }
  .swiper-lazy-preloader{
    width: 30px;
    height: 30px;
    margin-left: -15px;
    margin-top: -15px;
  }
</style>
