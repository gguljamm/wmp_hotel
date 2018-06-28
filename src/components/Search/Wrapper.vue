<template>
  <div>
    <div class="inputContainer">
      <button class="destination" @click="$router.push('/destination')">
        <div>목적지</div>
        <div>{{ inputData.destination }}</div>
      </button>
      <button class="date" @click="$router.push('/date')">
        <div>
          <div>체크인 | {{ getDayOfWeek(inputData.checkin) }}</div>
          <div class="roboto">{{ dateFormat(inputData.checkin) }}</div>
        </div>
        <div>
          <div>체크아웃 | {{ getDayOfWeek(inputData.checkout) }}</div>
          <div class="roboto">{{ dateFormat(inputData.checkout) }}</div>
        </div>
      </button>
      <button class="option" @click="$router.push('/option')">
        <div>
          <div>객실 수</div>
          <div class="roboto">{{ inputData.room }}</div>
        </div>
        <div>
          <div>투숙객 정보</div>
          <div>성인 <span class="roboto">{{ inputData.adults }}</span> 어린이 <span class="roboto">{{ inputData.children.length }}</span></div>
        </div>
      </button>
      <button class="submit"
        @click="submit()"
      ><div><div>서치</div></div></button>
    </div>
    <div class="hotelPop" v-show="$route.params.popFlag">
      <div v-bind:class="$route.params.popFlag ? 'open' : 'close'">
        <div class="popHeader">
          <span>{{ popTitle($route.params.popFlag) }}</span>
          <button @click="closePop">닫기</button>
        </div>
        <div class="popContent">
          <city-search
            v-if="$route.params.popFlag === 'destination'"
            :inputData="inputData"
            @close-pop="closePop"
          ></city-search>
          <Option
            v-if="$route.params.popFlag === 'option'"
            :inputData="inputData"
            @close-pop="closePop"
          ></Option>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CitySearch from '@/components/Search/CitySearch'
import Option from '@/components/Search/Option'

export default {
  components: {
    CitySearch,
    Option
  },
  name: 'searchWrapper',
  data () {
    return {
      dayOfWeek: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
      inputData: {
        destination: '런던, 영국',
        checkin: '2018-09-09',
        checkout: '2018-09-12',
        adults: 1,
        children: [],
        room: 1
      }
    }
  },
  methods: {
    popTitle (flag) {
      let title
      if (flag === 'destination') {
        title = '목적지 입력'
      } else if (flag === 'date') {
        title = '날짜선택'
      } else if (flag === 'option') {
        title = '검색 조건'
      }
      return title
    },
    closePop () {
      window.history.back()
    },
    dateFormat (date) {
      const arrDate = date.split('-')
      return `${arrDate[0].substr(2, 2)}.${arrDate[1]}.${arrDate[2]}`
    },
    getDayOfWeek (date) {
      return this.dayOfWeek[(new Date(date)).getDay()]
    },
    submit () {
      const children = this.inputData.children.length > 0 ? this.inputData.children.join('&') : 'null'
      this.$router.push(
        `/hotelList/${this.inputData.destination}/${this.inputData.checkin}/${this.inputData.checkout}/${this.inputData.adults}/${children}/${this.inputData.room}`
      )
    }
  }
}
</script>

<style scoped>
  .inputContainer{
    background: #33c6c6;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #33c6c6);
    padding: 200px 20px 40px;
  }
  .inputContainer > button:not(.submit){
    border-radius: 4px;
    height: 60px;
    width: 100%;
    background-color: #FFF;
    text-align: left;
    margin-bottom: 8px;
    border: 0;
    padding: 0 20px;
    font-size: 14px;
  }
  .inputContainer > .date > div{
    float: left;
    width: 50%;
  }
  .inputContainer > .date > div:last-of-type{
    text-align: right;
    border-left: 1px solid #ccc;
  }
  .inputContainer > .date > div > div:last-of-type{
    font-size: 20px;
  }
  .inputContainer > .option > div{
    float: left;
  }
  .inputContainer > .option > div:first-child {
    width: 30%;
  }
  .inputContainer > .option > div:last-of-type{
    width: 70%;
    text-align: right;
  }
  .inputContainer > .option input{
    width: 50px;
  }
  .inputContainer .submit{
    border-radius: 30px;
    padding: 0;
    background-color: #35CDCD;
    height: 60px;
    width: 60px;
    margin: 20px auto 0;
    display: block;
    border: 0;
    position: relative;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
  }
  .inputContainer .submit > div{
    width: 50px;
    height: 50px;
    float: left;
    margin-left: 5px;
    border-radius: 28px;
    background-color: #51D4D4;
    box-shadow: 0 0 4px 0 rgba(0,0,0,.1);
  }
  .inputContainer .submit > div > div{
    float: left;
    margin-left: 5px;
    margin-top: 5px;
    width: 40px;
    height: 40px;
    border-radius: 24px;
    background-color: #FFF;
    box-shadow: 0 0 4px 0 rgba(0,0,0,.1);
    line-height: 40px;
  }
  .hotelPop{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,.3);
  }
  .hotelPop > div{
    width: 100%;
    height: 100%;
    background-color: #FFF;
    position: absolute;
  }
  .hotelPop > div.open{
    margin-top: 0;
    animation: openBpPop linear .15s;
  }
  .hotelPop > div .popHeader{
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #FFF;
    line-height: 50px;
    padding-left: 20px;
  }
  .hotelPop > div .popHeader > button{
    position: absolute;
    background: transparent;
    right: 0;
    top: 0;
    height: 50px;
    width: 50px;
    border: 0;
  }
  .hotelPop > div .popContent {
    position: absolute;
    top: 50px;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @keyframes openBpPop {
    from {
      margin-top: 100vh;
    }
    to {
      margin-top: 0;
    }
  }
</style>
