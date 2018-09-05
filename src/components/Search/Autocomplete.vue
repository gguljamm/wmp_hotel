<template>
  <div class="autoCompleteContainer">
    <div class="autoCompleteBox">
      <div class="searchIcon"></div>
      <input ref="cityInput" placeholder="머무를 장소를 입력해주세요." @keyup="keyup()">
      <button :class="timesActive ? 'active' : ''" @click="clearInput"></button>
    </div>
    <div class="scrollable">
      <div class="autoList">
        <div class="noti" v-if="isLoading"><div class="spinner"></div></div>
        <div class="noti" v-else-if="suggestion.length === 0 && !isFirst">no results</div>
        <ul v-else v-show="suggestion.length > 0">
          <li
            v-for="x in suggestion"
            :key="x.id"
            @click="submitCity(x)"
          >
            <div class="roboto">{{ x.type.substr(0, 1).toUpperCase() }}</div>
            <div v-html="highlighting(getCityView(x))"></div>
            <div v-html="highlighting(x.name)"></div>
          </li>
        </ul>
      </div>
      <div class="recommendSearch" v-if="suggestion.length === 0 && !isLoading">
        <div v-show="recentCities.length > 0">최근 확인한 여행지</div>
        <ul v-show="recentCities.length > 0">
          <li v-for="(x, index) in recentCities.slice().reverse()" :key="x.id" @click="submitCity(x)">
            <div class="roboto">{{ x.type.substr(0, 1).toUpperCase() }}</div>
            <div>{{ getCityView(x) }}</div>
            <div>{{ x.name }}</div>
            <button @click.stop="delCity(index)"></button>
          </li>
        </ul>
        <div
          @click="recommendDomesticCitiesOpen = !recommendDomesticCitiesOpen"
          :class="recommendDomesticCitiesOpen ? 'open' : ''"
        >국내 인기 여행지</div>
        <ul v-show="recommendDomesticCitiesOpen">
          <li v-for="x in recommendDomesticCities" :key="x.id" @click="submitCity(x)">
            <div class="roboto">{{ x.type.substr(0, 1).toUpperCase() }}</div>
            <div>{{ getCityView(x) }}</div>
            <div>{{ x.name }}</div>
          </li>
        </ul>
        <div
          @click="recommendOverseasCitiesOpen = !recommendOverseasCitiesOpen"
          :class="recommendOverseasCitiesOpen ? 'open' : ''"
        >해외 인기 여행지</div>
        <ul v-show="recommendOverseasCitiesOpen">
          <li v-for="x in recommendOverseasCities" :key="x.id" @click="submitCity(x)">
            <div class="roboto">{{ x.type.substr(0, 1).toUpperCase() }}</div>
            <div>{{ getCityView(x) }}</div>
            <div>{{ x.name }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Api from '../../api/api'

export default {
  name: 'CitySearch',
  props: ['inputData'],
  data () {
    /* eslint-disable */
    return {
      destination: this.inputData.destination,
      delay: 500,
      timeout: '',
      isLoading: false,
      suggestion: [],
      isFirst: true,
      timesActive: false,
      recommendDomesticCitiesOpen: false,
      recommendDomesticCities: [
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-716583&dest_type=city&aid=1414756","label":"서울, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"","language":"ko","name":"서울","type":"city","latitude":"37.5618924566236","id":"-716583","country":"kr","longitude":"126.981161006443","city_ufi":null,"country_name":"대한민국","city_name":"서울","nr_dest":0,"top_destinations":null,"nr_hotels":1995,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-713900&dest_type=city&aid=1414756","label":"부산, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"","language":"ko","name":"부산","type":"city","latitude":"35.1614218444137","id":"-713900","country":"kr","longitude":"129.06236208295","city_ufi":null,"country_name":"대한민국","city_name":"부산","nr_dest":0,"top_destinations":null,"nr_hotels":789,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=4170&dest_type=region&aid=1414756","label":"제주도, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"제주도","language":"ko","name":"제주도","type":"region","latitude":"33.382064","id":"4170","country":"kr","longitude":"126.545979","city_ufi":null,"country_name":"대한민국","city_name":"","nr_dest":0,"top_destinations":null,"nr_hotels":1289,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-708814&dest_type=city&aid=1414756","label":"인천, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"","language":"ko","name":"인천","type":"city","latitude":"37.4536018371582","id":"-708814","country":"kr","longitude":"126.732002258301","city_ufi":null,"country_name":"대한민국","city_name":"인천","nr_dest":0,"top_destinations":null,"nr_hotels":233,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-715875&dest_type=city&aid=1414756","label":"속초, 강원도, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"강원도","language":"ko","name":"속초","type":"city","latitude":"38.2083015441895","id":"-715875","country":"kr","longitude":"128.591003417969","city_ufi":null,"country_name":"대한민국","city_name":"속초","nr_dest":0,"top_destinations":null,"nr_hotels":95,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-710797&dest_type=city&aid=1414756","label":"경주, 경상북도, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"경상북도","language":"ko","name":"경주","type":"city","latitude":"35.8428001403809","id":"-710797","country":"kr","longitude":"129.212005615234","city_ufi":null,"country_name":"대한민국","city_name":"경주","nr_dest":0,"top_destinations":null,"nr_hotels":154,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-717199&dest_type=city&aid=1414756","label":"대전, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"","language":"ko","name":"대전","type":"city","latitude":"36.33263","id":"-717199","country":"kr","longitude":"127.38458","city_ufi":null,"country_name":"대한민국","city_name":"대전","nr_dest":0,"top_destinations":null,"nr_hotels":86,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-717105&dest_type=city&aid=1414756","label":"대구, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"","language":"ko","name":"대구","type":"city","latitude":"35.84041","id":"-717105","country":"kr","longitude":"128.55866","city_ufi":null,"country_name":"대한민국","city_name":"대구","nr_dest":0,"top_destinations":null,"nr_hotels":126,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-718693&dest_type=city&aid=1414756","label":"울산, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"","language":"ko","name":"울산","type":"city","latitude":"35.5372009277344","id":"-718693","country":"kr","longitude":"129.317001342773","city_ufi":null,"country_name":"대한민국","city_name":"울산","nr_dest":0,"top_destinations":null,"nr_hotels":73,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-709250&dest_type=city&aid=1414756","label":"강릉, 강원도, 대한민국","endorsements":null,"timezone":null,"forecast":null,"region":"강원도","language":"ko","name":"강릉","type":"city","latitude":"37.7555999755859","id":"-709250","country":"kr","longitude":"128.89599609375","city_ufi":null,"country_name":"대한민국","city_name":"강릉","nr_dest":0,"top_destinations":null,"nr_hotels":254,"right-to-left":"0"}
      ],
      recommendOverseasCitiesOpen: false,
      recommendOverseasCities: [
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-240905&dest_type=city&aid=1414756","label":"오사카, 오사카후, 일본","endorsements":null,"timezone":null,"forecast":null,"region":"오사카후","language":"ko","name":"오사카","type":"city","latitude":"34.703966222463","id":"-240905","country":"jp","longitude":"135.492927108135","city_ufi":null,"country_name":"일본","city_name":"오사카","nr_dest":0,"top_destinations":null,"nr_hotels":4516,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=900047908&dest_type=city&aid=1414756","label":"후쿠오카, 후쿠오카 현, 일본","endorsements":null,"timezone":null,"forecast":null,"region":"후쿠오카 현","language":"ko","name":"후쿠오카","type":"city","latitude":"33.5990126605724","id":"900047908","country":"jp","longitude":"130.408037439629","city_ufi":null,"country_name":"일본","city_name":"후쿠오카","nr_dest":0,"top_destinations":null,"nr_hotels":516,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-3712125&dest_type=city&aid=1414756","label":"다낭, 다낭, 베트남","endorsements":null,"timezone":null,"forecast":null,"region":"다낭","language":"ko","name":"다낭","type":"city","latitude":"16.0683664014158","id":"-3712125","country":"vn","longitude":"108.219195144338","city_ufi":null,"country_name":"베트남","city_name":"다낭","nr_dest":0,"top_destinations":null,"nr_hotels":1379,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-246227&dest_type=city&aid=1414756","label":"도쿄, 도쿄 도, 일본","endorsements":null,"timezone":null,"forecast":null,"region":"도쿄 도","language":"ko","name":"도쿄","type":"city","latitude":"35.6859600461771","id":"-246227","country":"jp","longitude":"139.729518064178","city_ufi":null,"country_name":"일본","city_name":"도쿄","nr_dest":0,"top_destinations":null,"nr_hotels":4380,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-3414440&dest_type=city&aid=1414756","label":"방콕, 방콕 지방, 태국","endorsements":null,"timezone":null,"forecast":null,"region":"방콕 지방","language":"ko","name":"방콕","type":"city","latitude":"13.7558002471924","id":"-3414440","country":"th","longitude":"100.505996704102","city_ufi":null,"country_name":"태국","city_name":"방콕","nr_dest":0,"top_destinations":null,"nr_hotels":3078,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-2637882&dest_type=city&aid=1414756","label":"타이베이, 타이베이 시, 대만","endorsements":null,"timezone":null,"forecast":null,"region":"타이베이 시","language":"ko","name":"타이베이","type":"city","latitude":"25.046236038208","id":"-2637882","country":"tw","longitude":"121.517631530762","city_ufi":null,"country_name":"대만","city_name":"타이베이","nr_dest":0,"top_destinations":null,"nr_hotels":771,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-1353149&dest_type=city&aid=1414756","label":"홍콩, 홍콩","endorsements":null,"timezone":null,"forecast":null,"region":"","language":"ko","name":"홍콩","type":"city","latitude":"22.2826974594311","id":"-1353149","country":"hk","longitude":"114.158271089836","city_ufi":null,"country_name":"홍콩","city_name":"홍콩","nr_dest":0,"top_destinations":null,"nr_hotels":795,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-242395&dest_type=city&aid=1414756","label":"삿포로, 홋카이도, 일본","endorsements":null,"timezone":null,"forecast":null,"region":"홋카이도","language":"ko","name":"삿포로","type":"city","latitude":"43.0546989440918","id":"-242395","country":"jp","longitude":"141.35400390625","city_ufi":null,"country_name":"일본","city_name":"삿포로","nr_dest":0,"top_destinations":null,"nr_hotels":289,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=-235402&dest_type=city&aid=1414756","label":"교토, 교토후, 일본","endorsements":null,"timezone":null,"forecast":null,"region":"교토후","language":"ko","name":"교토","type":"city","latitude":"35","id":"-235402","country":"jp","longitude":"135.75","city_ufi":null,"country_name":"일본","city_name":"교토","nr_dest":0,"top_destinations":null,"nr_hotels":2385,"right-to-left":"0"},
        {"url":"https://www.booking.com/searchresults.ko.html?dest_id=2351&dest_type=region&aid=1414756","label":"오키나와 현, 일본","endorsements":null,"timezone":null,"forecast":null,"region":"오키나와 현","language":"ko","name":"오키나와 현","type":"region","latitude":"26.054487","id":"2351","country":"jp","longitude":"127.193687","city_ufi":null,"country_name":"일본","city_name":"","nr_dest":0,"top_destinations":null,"nr_hotels":1526,"right-to-left":"0"}
      ],
      recentCities: this.$cookies.get('recentCities') ? JSON.parse(this.$cookies.get('recentCities')) : []
    }
    /* eslint-enable */
  },
  methods: {
    clearInput () {
      this.timesActive = false
      this.$refs.cityInput.value = ''
      this.suggestion = []
      this.isFirst = true
    },
    keyup () {
      if (this.timeout) {
        window.clearTimeout(this.timeout)
      }
      const value = this.$refs.cityInput.value.replace(/&/gi, '')
      if (value.length > 0) {
        this.timesActive = true
      } else {
        this.timesActive = false
      }
      this.timeout = window.setTimeout(() => {
        this.suggestion = []
        if (!value || value.length === 0) {
          this.isFirst = true
          return
        }
        this.isFirst = false
        this.isLoading = true
        Api.autocomplete(value).then((resp) => {
          this.isLoading = false
          this.suggestion = resp.data.result
        }).catch((e) => {
          this.isLoading = false
          this.suggestion = []
        })
      }, this.delay)
    },
    highlighting (text) {
      const reg = new RegExp(this.$refs.cityInput.value, 'gi')
      return text.replace(reg, `<span>${this.$refs.cityInput.value}</span>`)
    },
    getCityView (x) {
      const arrText = []
      if (x.city_name) {
        arrText.push(x.city_name)
      }
      if (x.region) {
        arrText.push(x.region)
      }
      if (x.country_name) {
        arrText.push(x.country_name)
      }
      return arrText.join(', ')
    },
    submitCity (city) {
      let flag = false
      for (let x = 0; x < this.recentCities.length; x += 1) {
        if (this.recentCities[x].id === city.id) {
          flag = true
          break
        }
      }
      if (!flag) {
        this.recentCities.push(city)
        if (this.recentCities.length > 3) {
          this.recentCities.splice(0, 1)
        }
      }
      this.$cookies.set('recentCities', JSON.stringify(this.recentCities), '30d', '/')
      this.$emit('change-destination', city)
    },
    delCity (index) {
      console.log(index)
      const newIndex = (this.recentCities.length - 1) - index
      this.recentCities.splice(newIndex, 1)
      this.$cookies.set('recentCities', JSON.stringify(this.recentCities), '30d', '/')
    }
  },
  mounted () {
    setTimeout(() => {
      this.$refs.cityInput.value = this.destination ? this.destination.label : ''
      this.$refs.cityInput.focus()
      if (this.destination && this.destination.label.length > 0) {
        this.$refs.cityInput.select()
        this.isLoading = true
      }
      this.keyup()
    }, 160)
  }
}
</script>

<style scoped>
  .autoCompleteBox{
    position: absolute;
    left: 16px;
    right: 60px;
    top: -60px;
    height: 60px;
  }
  .autoCompleteBox input{
    height: 40px;
    margin-top: 10px;
    background-color: #ffffff;
    border: solid 1px #d4d4d4;
    width: 100%;
    padding: 0;
    padding-left: 12px;
    font-size: 14px;
  }
  .autoCompleteBox > button{
    position: absolute;
    right: 52px;
    top: 24px;
    width: 14px;
    height: 14px;
    border: 0;
    font-size: 10px;
    line-height: 18px;
    border-radius: 100%;
    opacity: 0;
    transition: opacity .3s ease;
    background-image: url(../../assets/fill_del_gray.svg);
    background-size: cover;
    background-repeat: no-repeat;
  }
  .autoCompleteBox > button.active{
    opacity: 1;
  }
  .searchIcon{
    width: 24px;
    height: 24px;
    position: absolute;
    pointer-events: none;
    background-image: url(../../assets/search.svg);
    background-repeat: no-repeat;
    background-size: contain;
    top: 20px;
    filter: grayscale(.3);
    right: 12px;
  }
  ul {
    padding: 8px 0;
    background-color: #fff;
  }
  ul > li{
    padding: 12px 20px;
    cursor: pointer;
    letter-spacing: -0.4px;
    font-size: 14px;
    position: relative;
    padding-left: 65px;
  }
  ul > li > div:nth-of-type(1){
    position: absolute;
    width: 32px;
    height: 32px;
    background-color: #676767;
    left: 20px;
    top: 16px;
    border-radius: 100%;
    text-align: center;
    color: #FFF;
    line-height: 32px;
    font-size: 12px;
  }
  ul > li > div:nth-of-type(2){
    font-weight: 500;
    color: #040404;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }
  ul > li > div:nth-of-type(3){
    font-weight: normal;
    color: #666666;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
  }
  .noti{
    font-size: 16px; padding: 50px; text-align: center;
  }
  @keyframes spinner {
    to {transform: rotate(360deg);}
  }
  .spinner:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 80px;
    left: 50%;
    width: 30px;
    height: 30px;
    margin-top: -15px;
    margin-left: -15px;
    border-radius: 50%;
    border: 1px solid #ccc;
    border-top-color: #b18e79;
    animation: spinner .6s linear infinite;
  }
  .recommendSearch{
    border-top: 1px solid #e7e7e7;
  }
  .recommendSearch > div{
    font-size: 16px;
    font-weight: 500;
    padding-left: 20px;
    height: 50px;
    line-height: 50px;
    position: relative;
    border-bottom: 1px solid #e7e7e7;
  }
  .recommendSearch > div:nth-of-type(2):after,
  .recommendSearch > div:nth-of-type(3):after{
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    right: 12px;
    top: 13px;
    background-image: url('../../assets/chevron-top.svg');
    background-repeat: no-repeat;
    background-size: 14px;
    background-position: center center;
    transform: rotate(360deg);
    transition: .5s ease;
  }
  .recommendSearch > div.open:after{
    transform: rotate(180deg);
  }
  .recommendSearch > div:first-of-type{
    color: #b18e79;
  }
  .recommendSearch > ul{
    border-bottom: 1px solid #e7e7e7;
    background-color: #fbfbfb;
  }
  .autoCompleteContainer .scrollable{
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }
  .recommendSearch > ul:first-of-type > li > div:nth-of-type(1){
    background-color: #c09174;
  }
  .recommendSearch > ul:first-of-type > li > button{
    background-image: url(../../assets/btn-closed.svg);
    width: 16px;
    height: 16px;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center center;
    position: absolute;
    right: 20px;
    top: 24px;
  }
</style>
<style>
  #wmpHotel .autoList ul > li > div > span{
    color: #c09174;
  }
</style>
