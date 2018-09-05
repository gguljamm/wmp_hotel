<template>
  <div class="wrapperCircle">
    <div class="circle">
      <div v-if="percent > 50" class="halfLeft" :style="{transform: 'rotate(-' + getPercent + 'deg)'}"><div></div></div>
      <div v-if="percent < 50" class="halfLeftBlank" :style="{transform: 'rotate(-' + getPercent + 'deg)'}"><div></div></div>
      <div class="halftop"></div>
      <div class="halfbottom"></div>
      <div class="circleCenter roboto">{{ percent / 10 }}</div>
    </div>
    <div class="text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: ['percent', 'text'],
  computed: {
    getPercent () {
      if (this.percent > 50) {
        return (100 - this.percent) * 36 / 10
      } else if (this.percent < 50) {
        return (100 - this.percent) * 36 / 10 - 180
      }
    }
  }
}
</script>

<style scoped>
  .wrapperCircle{
    display: inline-block;
    width: 70px;
    height: 106px;
  }
  .circle{
    background-color: #f4f4f4;
    width: 70px;
    height: 70px;
    border-radius: 100%;
    position: relative;
  }
  .circle .circleCenter{
    position: absolute;
    top: 4px;
    left: 4px;
    width: 62px;
    height: 62px;
    background-color: #FFF;
    border-radius: 100%;
    line-height: 62px;
    text-align: center;
    z-index: 2;
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
  .circle .halftop{
    position: absolute;
    right: 0;
    top: 0;
    width: 35px;
    height: 35px;
    background-color: #b18e79;
    border-top-right-radius: 100%;
  }
  .circle .halftop:before{
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #b18e79;
    left: -2px;
  }
  .circle .halfbottom{
    position: absolute;
    right: 0;
    top: 35px;
    width: 35px;
    height: 35px;
    background-color: #b18e79;
    border-bottom-right-radius: 100%;
  }
  .circle .halfLeft, .circle .halfLeftBlank{
    width: 70px;
    height: 70px;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 100%;
    z-index: 1;
  }
  .circle .halfLeft > div{
    position: absolute;
    left: 0;
    top: 0;
    width: 35px;
    height: 35px;
    background-color: #b18e79;
    border-top-left-radius: 100%;
  }
  .circle .halfLeft > div:before{
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #b18e79;
    top: 0;
    right: -2px;
  }
  .circle .halfLeft:after{
    position: absolute;
    left: 0;
    top: 35px;
    width: 35px;
    height: 35px;
    background-color: #b18e79;
    border-bottom-left-radius: 100%;
    content: '';
  }
  .circle .halfLeftBlank:before{
    position: absolute;
    left: 0;
    top: 0;
    width: 35px;
    height: 35px;
    background-color: #f4f4f4;
    border-top-left-radius: 100%;
    content: '';
  }
  .circle .halfLeftBlank > div{
    position: absolute;
    left: 0;
    top: 35px;
    width: 35px;
    height: 35px;
    background-color: #f4f4f4;
    border-bottom-left-radius: 100%;
  }
  .circle .halfLeftBlank > div:before{
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #b18e79;
    bottom: 0;
    right: -2px;
  }
  .text{
    font-size: 14px;
    text-align: center;
    line-height: 24px;
    margin-top: 12px;
  }
</style>
