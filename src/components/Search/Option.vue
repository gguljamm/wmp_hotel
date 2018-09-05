<template>
  <div>
    <div class="optionWrapper scrollable" ref="optionWrapper">
      <div>
        <div>객실</div>
        <div class="operateSpace">
          <button @click="roomNumChange(false)">－</button>
          <span>{{ room }}개</span>
          <button @click="room < 9 ? roomNumChange(true) : ''">＋</button>
        </div>
      </div>
      <div>
        <div>성인</div>
        <div class="operateSpace">
          <button @click="adultNumChange(false)">－</button>
          <span>{{ adults }}명</span>
          <button @click="adults < 18 ? adultNumChange(true) : ''">＋</button>
        </div>
      </div>
      <div ref="childrenWrapper">
        <div>아동</div>
        <div class="operateSpace">
          <button @click="childrenNumChange(false)">－</button>
          <span>{{ children.length }}{{ children.length === 0 ? '' : '명' }}</span>
          <button @click="children.length < 9 ? childrenNumChange(true) : ''">＋</button>
        </div>
      </div>
      <div class="childrenAge"
        v-for="(num, index) in children"
        :key="index"
      >
        <div
          :class="childrenFlag[index] ? 'selected' : ''"
          @click="toggleChildrenAge(index)"
        >아동 {{ index + 1 }}<span>{{ children[index] }}세</span><div class="clampIcon"></div></div>
        <option-swiper
          v-if="childrenFlag[index]"
          :index="index"
          :value="num"
          @change-age="changeAge"
        ></option-swiper>
      </div>
    </div>
    <div class="calBottom">
      <div><button @click="reset">초기화</button></div>
      <div><button @click="$emit('change-option', adults, children, room)">선택완료</button></div>
    </div>
  </div>
</template>

<script>
import OptionSwiper from './OptionSwiper'

export default {
  components: {
    OptionSwiper
  },
  props: ['inputData'],
  data () {
    const arrChildren = []
    const arrChildrenFlag = []
    for (let x = 0; x < this.inputData.children.length; x += 1) {
      arrChildren.push(this.inputData.children[x])
      if (x === 0) {
        arrChildrenFlag.push(true)
      } else {
        arrChildrenFlag.push(false)
      }
    }
    return {
      adults: this.inputData.adults,
      children: arrChildren,
      childrenFlag: arrChildrenFlag,
      room: this.inputData.room
    }
  },
  methods: {
    reset () {
      this.adults = 1
      this.children = []
      this.childrenFlag = []
      this.room = 1
    },
    toggleChildrenAge (index) {
      this.childrenFlag.forEach((x, index) => {
        this.$set(this.childrenFlag, index, false)
      })
      this.$set(this.childrenFlag, index, true)
    },
    changeAge (index, value) {
      this.$set(this.children, index, value)
    },
    roomNumChange (flag) {
      if (flag) {
        this.room += 1
      } else if (this.room > 1) {
        this.room -= 1
      }
      if (this.room > this.adults) {
        this.adults = this.room
      }
    },
    adultNumChange (flag) {
      if (flag) {
        this.adults += 1
      } else if (this.adults > 1) {
        this.adults -= 1
      }
      if (this.adults < this.room) {
        this.room = this.adults
      }
    },
    childrenNumChange (flag) {
      if (flag) {
        this.children.push(0)
        this.childrenFlag.push(false)
        this.scrollTo(this.$refs.optionWrapper, 200, 200)
      } else {
        this.children.pop()
        this.childrenFlag.pop()
      }
      if (this.childrenFlag.length > 0 && !this.childrenFlag.some((x) => {
        return x === true
      })) {
        this.$set(this.childrenFlag, 0, true)
      }
    },
    scrollTo (element, to, duration) {
      const start = element.scrollTop
      const change = to - start
      const increment = 20
      let currentTime = 0

      const animateScroll = () => {
        currentTime += increment
        var val = this.easeInOutQuad(currentTime, start, change, duration)
        element.scrollTop = val
        if (currentTime < duration) {
          setTimeout(animateScroll, increment)
        }
      }
      animateScroll()
    },
    easeInOutQuad (t, b, c, d) {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    }
  }
}
</script>

<style scoped>
  button.reset{
    position: absolute;
    background: transparent;
    padding: 0 13px;
    height: 26px;
    border: 1px solid #bbb;
    border-radius: 13px;
    font-size: 14px;
    color: #999;
    right: 60px;
    top: -43px;
  }
  .optionWrapper{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 74px;
  }
  .optionWrapper > div:not(.childrenAge){
    padding: 30px 20px 29px;
    border-bottom: 1px solid #ddd;
    height: 100px;
    line-height: 40px;
  }
  .optionWrapper > div:not(.childrenAge) > div:first-child{
    font-weight: 500;
    font-size: 16px;
    color: #111;
    float: left;
  }
  .optionWrapper button{
    font-size: 16px;
    color: #1A1A1C;
    font-weight: bold;
  }
  .operateSpace{
    width: 160px;
    text-align: center;
    position: relative;
    height: 40px;
    line-height: 40px;
    box-shadow: 0 0 0 1px #ddd inset;
    float: right;
    background-color: #f5f4f0;
    border-radius: 2px;
  }
  .operateSpace > button{
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 0;
  }
  .operateSpace > button:first-child{
    left: 0;
    border-right: 1px solid #ddd;
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
  }
  .operateSpace > button:last-of-type{
    right: 0;
    border-left: 1px solid #ddd;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  .operateSpace > button:focus{
    border-radius: 2px;
    color: #b18e79;
    border-color: #b18e79;
  }
  .optionWrapper > div.childrenAge{
    padding: 0;
    border: 0;
  }
  .optionWrapper > div.childrenAge > div:first-child{
    padding: 0 20px;
    box-shadow: inset 0 -1px 0 0 #ebebeb;
    margin: 0;
    height: 60px;
    line-height: 60px;
    position: relative;
    cursor: pointer;
    font-size: 14px;
    color: #111111;
  }
  .optionWrapper > div.childrenAge > div:first-child > span{
    float: right;
    margin-right: 28px;
    color: #b18e79;
    font-weight: 500;
    font-size: 16px;
  }
  .clampIcon{
    width: 24px;
    height: 24px;
    position: absolute;
    right: 12px;
    top: 18px;
    background-image: url('../../assets/chevron-top.svg');
    background-repeat: no-repeat;
    background-size: 14px;
    background-position: center center;
    transform: rotate(360deg);
    transition: .5s ease;
  }
  .selected .clampIcon{
    transform: rotate(180deg);
  }
  .calBottom{
    width: 100%;
    left: 0;
    bottom: 0;
    height: 74px;
    position: absolute;
    padding: 9px 10px 10px;
    font-size: 0;
    border-top: 1px solid #dddddd;
  }
  .calBottom > div{
    height: 54px;
    line-height: 54px;
    border: 0;
    float: left;
  }
  .calBottom > div:first-of-type{
    width: 40%;
  }
  .calBottom > div:last-of-type{
    width: 60%;
  }
  .calBottom > div > button{
    width: 100%;
    height: 100%;
  }
  .calBottom > div:first-child button{
    background-color: #bbbbbb;
    font-size: 16px;
    padding: 18px 0;
    line-height: 18px;
    color: #FFF;
  }
  .calBottom > div:first-child button > div{
    width: 18px;
    height: 18px;
    border: solid 1px #bbbbbb;
    border-radius: 100%;
    left: 10px;
    position: relative;
    margin-right: 0;
    float: left;
  }
  .calBottom > div:first-child button > div{
    background: url(../../assets/selected.svg) no-repeat;
    border: 0;
    background-size: cover;
  }
  .calBottom > div:last-of-type button{
    background-color: #1A1A1C;
    color: #FFF;
    font-size: 16px;
    font-weight: 500;
  }
</style>
