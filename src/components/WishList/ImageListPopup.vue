<template>
  <div class="hotelPop" v-if="hotelInfo.images && Array.isArray(hotelInfo.images) && hotelInfo.images.length > 0">
    <div class="open">
      <button class="imgMore" @click="$emit('close-pop')"></button>
      <div class="topInfo">
        <div class="star" v-if="hotelInfo.star"><span v-for="x in parseInt(hotelInfo.star, 10)" :key="x"></span></div>
        <div>{{ hotelInfo.hotelName }}</div>
      </div>
      <ul class="scrollable">
        <li class="img"
          v-for="x in hotelInfo.images"
          :key="x"
          :style="{'background-image': `url(${x})`}"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script>
import format from '../../util/format'

export default {
  props: ['popping', 'hotelInfo'],
  data () {
    return {
      format
    }
  },
  methods: {
    closePop () {
      this.$emit('close-pop')
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
    top: 48px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(38, 38, 40, .7);
    z-index: 20;
  }
  .hotelPop > div{
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    max-width: 700px;
    height: 100%;
    background-color: #FFF;
    position: absolute;
  }
  .hotelPop > div.open{
    animation: openPopTop linear .15s;
  }
  .hotelPop > div.close{
    animation: closePopTop linear .15s;
  }
  @keyframes openPopTop {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes closePopTop {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  button.imgMore{
    width: 22px;
    height: 22px;
    font-size: 20px;
    float: right;
    position: absolute;
    z-index: 3;
    right: 10px;
    top: 72px;
    color: #FFF;
    content: '＋';
    display: block;
    background-image: url(../../assets/minus.svg);
    margin-left: 4px;
  }
  .scrollable{
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    padding-top: 62px;
  }
  .img{
    background-position: center center;
    background-size: cover;
    width: 100%;
    padding-bottom: 100%;
    margin-bottom: 1px;
  }
  .topInfo{
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    right: 0;
    height: 62px;
    background: rgba(255, 255, 255, .7);
    padding: 14px 20px 10px;
  }
  .topInfo > div:last-of-type{
    font-size: 18px;
    font-weight: 500;
    line-height: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
    color: #111;
  }
  .star{
    height: 15px;
    margin-bottom: 4px;
  }
  .star > span{
    margin-right: 5px;
    float: left;
    width: 12px;
    height: 12px;
    background: url(../../assets/star.svg) no-repeat;
    background-size: cover;
  }
  .star > span:last-of-type{
    margin-right: 0;
  }
</style>
