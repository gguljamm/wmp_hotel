<template>
  <div class="bpWrapper">
    <div class="mainBack" :class="`bg${bgRandomNumber}`"><div></div></div>
    <search-container
      :inputData="inputData"
      :subClass="'main'"
      :filterInfo="filterInfo"
      :iosPopFlag="iosPopFlag"
      @open-pop="openPop"
      @close-pop="closePop"
      @reset-filter-info="resetSearchInfo"
      @clear-waterfall-state="clearWaterfallState"
    ></search-container>
    <div class="recentSearch" v-if="recentList.length > 0">
      <div>최근 검색한 여행</div>
      <transition-group name="fade" mode="out-in" tag="ul">
        <li v-for="(x, index) in recentList" :key="index" @click="recentSubmit(index)">
          <div class="thumbnail" :class="x.destination.type"></div>
          <div>{{ x.destination.label }}</div>
          <div>
            <span>{{ format.dateFormat(x.checkin) }}({{ format.getDayOfWeek(x.checkin) }}) - {{ format.dateFormat(x.checkout) }}({{ format.getDayOfWeek(x.checkout) }})</span>
            <span>성인 {{ x.adults }}명,<span v-if="x.children.length > 0"> 어린 {{ x.children.length }}명</span> 객실 {{ x.room }}개</span></div>
          <div @click.stop @click="recentDel(index)" class="close"></div>
        </li>
      </transition-group>
    </div>
    <div class="popularWrapper">
      <img :src="require('../../assets/wicon-money.svg')">
      <div>
        <div>국내 인기 여행지</div>
        <div>주머니가 가벼울땐 국내여행</div>
        <swiper
          class="domesticSwiper"
          :options="swiperOption"
        >
          <swiper-slide v-for="x in popularDomestic" :key="x.key">
            <img class="domesticImg" :src="require(`../../assets/city/${x.key}.png`)">
            <div class="swiperDescription" @click="popularClick(x.url)">
              <div class="roboto">{{ x.enName }}</div>
              <div></div>
              <div>{{ x.koName }}</div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div>
        <div>해외 인기 여행지</div>
        <div>주머니가 빵빵할땐 역시 해외여행</div>
        <swiper
          class="overseasSwiper"
          :options="swiperOption"
        >
          <swiper-slide v-for="x in popularOverseas" :key="x.key">
            <img class="overseasImg" :src="require(`../../assets/city/${x.key}.png`)">
            <div class="swiperDescription" @click="popularClick(x.url)">
              <div class="roboto">{{ x.enName }}</div>
              <div></div>
              <div class="sandol">{{ x.koName }}</div>
              <div class="sandol">{{ x.koName2 }}</div>
            </div>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
    </div>
    <static-footer></static-footer>
    <search-popup
      v-if="['destination', 'date', 'option'].indexOf(iosPopFlag) >= 0 || ['destination', 'date', 'option'].indexOf($route.params.popFlag) >= 0"
      :inputData="inputData"
      :popping="popping"
      :todayString="todayString"
      :isLogin="!!mid"
      :iosPopFlag="iosPopFlag"
      @close-pop="closePop"
    ></search-popup>
  </div>
</template>

<script>
import SearchContainer from './SearchContainer'
import SearchPopup from './SearchPopup'
import Format from '../../util/format'
import StaticFooter from '../Common/Footer'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

export default {
  components: {
    SearchContainer,
    SearchPopup,
    StaticFooter,
    swiper,
    swiperSlide
  },
  props: ['filterInfo', 'mid', 'popping', 'isFromApp', 'iosPopFlag', 'recentList'],
  name: 'searchWrapper',
  data () {
    const today = new Date()
    const todayString = `${today.getFullYear()}-${Format.zeros(today.getMonth() + 1)}-${Format.zeros(today.getDate())}`
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)
    const tomorrowString = `${tomorrow.getFullYear()}-${Format.zeros(tomorrow.getMonth() + 1)}-${Format.zeros(tomorrow.getDate())}`
    let inputData = {}
    if (this.$cookies.get('bphotels')) {
      try {
        const inputDataList = JSON.parse(this.$cookies.get('bphotels'))
        if (Array.isArray(inputDataList) && inputDataList.length > 0) {
          inputData = inputDataList[inputDataList.length - 1]
        }
        if (parseInt(inputData.checkin.replace(/-/g, '')) < parseInt(Format.getToday().replace(/-/g, ''))) {
          inputData.checkin = `${today.getFullYear()}-${Format.zeros(today.getMonth() + 1)}-${Format.zeros(today.getDate())}`
          inputData.checkout = `${tomorrow.getFullYear()}-${Format.zeros(tomorrow.getMonth() + 1)}-${Format.zeros(tomorrow.getDate())}`
        }
      } catch (e) {
        inputData = {
          destination: {
            label: '',
            lat: '',
            lng: '',
            type: '',
            country: '',
            cityName: '',
            cityId: '',
            placeId: '',
            countryName: ''
          },
          checkin: `${today.getFullYear()}-${Format.zeros(today.getMonth() + 1)}-${Format.zeros(today.getDate())}`,
          checkout: `${tomorrow.getFullYear()}-${Format.zeros(tomorrow.getMonth() + 1)}-${Format.zeros(tomorrow.getDate())}`,
          adults: 1,
          children: [],
          room: 1
        }
      }
    } else {
      inputData = {
        destination: {
          label: '',
          lat: '',
          lng: '',
          type: '',
          country: '',
          cityName: '',
          cityId: '',
          placeId: '',
          countryName: ''
        },
        checkin: `${today.getFullYear()}-${Format.zeros(today.getMonth() + 1)}-${Format.zeros(today.getDate())}`,
        checkout: `${tomorrow.getFullYear()}-${Format.zeros(tomorrow.getMonth() + 1)}-${Format.zeros(tomorrow.getDate())}`,
        adults: 1,
        children: [],
        room: 1
      }
    }
    return {
      inputData,
      todayString,
      tomorrowString,
      format: Format,
      popularDomestic: [
        {
          key: 'SEL',
          enName: 'Seoul',
          koName: '서울',
          url: '서울%7C37.5618924566236%7C126.981161006443%7Ccity%7Ckr%7C대한민국%7C서울%7C-716583%7C-716583'
        },
        {
          key: 'PUS',
          enName: 'Busan',
          koName: '부산',
          url: '부산%7C35.1614218444137%7C129.06236208295%7Ccity%7Ckr%7C대한민국%7C부산%7C-713900%7C-713900'
        },
        {
          key: 'CJU',
          enName: 'Jeju',
          koName: '제주',
          url: '제주도%7C33.382064%7C126.545979%7Cregion%7Ckr%7C대한민국%7C%7C4170%7C4170'
        },
        {
          key: 'ICN',
          enName: 'Incheon',
          koName: '인천',
          url: '인천%7C37.4536018371582%7C126.732002258301%7Ccity%7Ckr%7C대한민국%7C인천%7C-708814%7C-708814'
        },
        {
          key: 'SOKCHO',
          enName: 'Sokcho',
          koName: '속초',
          url: '속초%7C38.2083015441895%7C128.591003417969%7Ccity%7Ckr%7C대한민국%7C속초%7C-715875%7C-715875'
        },
        {
          key: 'GYEONGJU',
          enName: 'Gyeongju',
          koName: '경주',
          url: '경주%7C35.8428001403809%7C129.212005615234%7Ccity%7Ckr%7C대한민국%7C경주%7C-710797%7C-710797'
        },
        {
          key: 'DAEJEON',
          enName: 'Daejeon',
          koName: '대전',
          url: '대전%7C36.33263%7C127.38458%7Ccity%7Ckr%7C대한민국%7C대전%7C-717199%7C-717199'
        },
        {
          key: 'TAE',
          enName: 'Daegu',
          koName: '대구',
          url: '대구%7C35.84041%7C128.55866%7Ccity%7Ckr%7C대한민국%7C대구%7C-717105%7C-717105'
        },
        {
          key: 'USN',
          enName: 'Ulsan',
          koName: '울산',
          url: '울산%7C35.5372009277344%7C129.317001342773%7Ccity%7Ckr%7C대한민국%7C울산%7C-718693%7C-718693'
        },
        {
          key: 'GANGNEUNG',
          enName: 'Gangneung',
          koName: '강릉',
          url: '강릉%7C37.7555999755859%7C128.89599609375%7Ccity%7Ckr%7C대한민국%7C강릉%7C-709250%7C-709250'
        }
      ],
      popularOverseas: [
        {
          key: 'KIX',
          enName: 'Japan',
          koName: '일본,',
          koName2: '오사카',
          url: '오사카%7C34.703966222463%7C135.492927108135%7Ccity%7Cjp%7C일본%7C오사카%7C-240905%7C-240905'
        },
        {
          key: 'FUK',
          enName: 'Japan',
          koName: '일본,',
          koName2: '후쿠오카',
          url: '후쿠오카%7C33.5990126605724%7C130.408037439629%7Ccity%7Cjp%7C일본%7C후쿠오카%7C900047908%7C900047908'
        },
        {
          key: 'DAD',
          enName: 'Vietnam',
          koName: '베트남,',
          koName2: '다낭',
          url: '다낭%7C16.0683664014158%7C108.219195144338%7Ccity%7Cvn%7C베트남%7C다낭%7C-3712125%7C-3712125'
        },
        {
          key: 'TYO',
          enName: 'Japan',
          koName: '일본,',
          koName2: '도쿄',
          url: '도쿄%7C35.6859600461771%7C139.729518064178%7Ccity%7Cjp%7C일본%7C도쿄%7C-246227%7C-246227'
        },
        {
          key: 'BKK',
          enName: 'Thailand',
          koName: '태국,',
          koName2: '방콕',
          url: '방콕%7C13.7558002471924%7C100.505996704102%7Ccity%7Cth%7C태국%7C방콕%7C-3414440%7C-3414440'
        },
        {
          key: 'TPE',
          enName: 'Taiwan',
          koName: '대만,',
          koName2: '타이페이',
          url: '타이베이%7C25.046236038208%7C121.517631530762%7Ccity%7Ctw%7C대만%7C타이베이%7C-2637882%7C-2637882'
        },
        {
          key: 'HKG',
          enName: 'Hongkong',
          koName: '홍콩,',
          koName2: '홍콩',
          url: '홍콩%7C22.2826974594311%7C114.158271089836%7Ccity%7Chk%7C홍콩%7C홍콩%7C-1353149%7C-1353149'
        },
        {
          key: 'SPK',
          enName: 'Japan',
          koName: '일본,',
          koName2: '삿포로',
          url: '삿포로%7C43.0546989440918%7C141.35400390625%7Ccity%7Cjp%7C일본%7C삿포로%7C-242395%7C-242395'
        },
        {
          key: 'KYOTO',
          enName: 'Japan',
          koName: '일본,',
          koName2: '교토',
          url: '교토%7C35%7C135.75%7Ccity%7Cjp%7C일본%7C교토%7C-235402%7C-235402'
        },
        {
          key: 'OKA',
          enName: 'Japan',
          koName: '일본,',
          koName2: '오키나와',
          url: '오키나와%20현%7C26.054487%7C127.193687%7Cregion%7Cjp%7C일본%7C%7C2351%7C2351'
        }
      ],
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        slidesPerView: 'auto'
      },
      bgRandomNumber: parseInt(((Math.random() * 8) + 1), 10)
    }
  },
  methods: {
    popularClick (url) {
      const param = [
        url,
        this.todayString,
        this.tomorrowString,
        1,
        'null',
        1
      ]
      this.$emit('reset-filter-info')
      this.$router.push(
        `/hotelList/${param.join('/')}${window.location.search}${window.location.hash}`
      )
    },
    openPop (flag) {
      this.$emit('open-pop', flag)
    },
    closePop () {
      this.$emit('close-pop')
    },
    recentDel (index) {
      this.$emit('recent-del', index)
    },
    recentSubmit (index) {
      console.log(this.recentList[index])
      if (parseInt(this.recentList[index].checkin.replace(/-/g, '')) < parseInt(this.todayString.replace(/-/g, ''))) {
        window.EventBus.$emit('popAlert', 'alert', '오늘 이전의 검색기록입니다.')
        return
      }
      const children = this.recentList[index].children.length === 0 ? 'null' : this.recentList[index].children.join('&')
      const destination = [
        this.recentList[index].destination.label,
        this.recentList[index].destination.lat,
        this.recentList[index].destination.lng,
        this.recentList[index].destination.type,
        this.recentList[index].destination.country,
        this.recentList[index].destination.countryName,
        this.recentList[index].destination.cityName,
        this.recentList[index].destination.cityId,
        this.recentList[index].destination.placeId
      ].join('|')
      const param = [
        destination,
        this.recentList[index].checkin,
        this.recentList[index].checkout,
        this.recentList[index].adults,
        children,
        this.recentList[index].room
      ]
      this.$emit('reset-filter-info')
      this.$router.push(
        `/hotelList/${param.join('/')}${window.location.search}${window.location.hash}`
      )
    },
    resetSearchInfo () {
      this.$emit('reset-filter-info')
    },
    clearWaterfallState () {
      this.$emit('clear-waterfall-state')
    }
  },
  mounted () {
    window.scrollTo(0, 0)
    this.$emit('reset-recent-search')
  }
}
</script>

<style scoped>
  .mainBack{
    position: fixed;
    z-index: -1;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
  }
  .mainBack > div{
    background-size: cover;
    background-position: 0 0;
    background-repeat: no-repeat;
    max-width: 700px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }
  .mainBack.bg1 > div{
    background-image: url('../../assets/backBg/01@2x.jpg');
  }
  .mainBack.bg2 > div{
    background-image: url('../../assets/backBg/02@2x.jpg');
  }
  .mainBack.bg3 > div{
    background-image: url('../../assets/backBg/03@2x.jpg');
  }
  .mainBack.bg4 > div{
    background-image: url('../../assets/backBg/04@2x.jpg');
  }
  .mainBack.bg5 > div{
    background-image: url('../../assets/backBg/05@2x.jpg');
  }
  .mainBack.bg6 > div{
    background-image: url('../../assets/backBg/06@2x.jpg');
  }
  .mainBack.bg7 > div{
    background-image: url('../../assets/backBg/07@2x.jpg');
  }
  .mainBack.bg8 > div{
    background-image: url('../../assets/backBg/08@2x.jpg');
  }
  .bpWrapper{
    max-width: 700px;
    margin: 0 auto;
    height: 100%;
  }
  .recentSearch{
    padding: 0 20px 40px;
  }
  .recentSearch > div{
    font-size: 20px;
    text-align: center;
    color: #FFF;
    letter-spacing: -.6px;
    margin-bottom: 24px;
  }
  .recentSearch ul{
    overflow: hidden;
    border-radius: 4px;
  }
  .recentSearch li{
    height: 72px;
    width: 100%;
    background-color: #FFF;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    padding: 16px 16px 16px 70px;
    position: relative;
  }
  .recentSearch li:last-of-type{
    border-bottom: 0;
  }
  .recentSearch li > div.thumbnail{
    width: 40px;
    height: 40px;
    background-color: #FFF;
    border: 1px solid #ddd;
    border-radius: 100%;
    position: absolute;
    top: 16px;
    left: 16px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    background-image: url(../../assets/recent_location.svg);
    background-position: center center;
    background-repeat: no-repeat;
  }
  .recentSearch li > div.thumbnail.hotel{
    background-image: url(../../assets/recent_hotel.svg);
  }
  .recentSearch li > div:nth-of-type(2){
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    padding-right: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .recentSearch li > div:nth-of-type(3){
    font-size: 0;
    color: #666;
    letter-spacing: -0.4px;
    margin-top: 4px;
    line-height: 15px;
    height: 15px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .recentSearch li > div:nth-of-type(3) > span{
    font-size: 12px;
  }
  .recentSearch li > div:nth-of-type(3) > span:last-of-type{
    color: #999;
  }
  .recentSearch li > div:nth-of-type(3) > span:last-of-type:before{
    content: '';
    height: 12px;
    width: 1px;
    border-left: 1px solid #ddd;
    margin-top: 2px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .recentSearch li .close{
    background-image: url(../../assets/btn-closed.svg);
    background-repeat: no-repeat;
    position: absolute;
    cursor: pointer;
    padding: 16px;
    background-size: 11px;
    background-position: center;
    height: 43px;
    width: 43px;
    right: 0;
    top: 0;
  }
  .popularWrapper{
    background-color: #f7f3f0;
    padding-top: 51px;
    position: relative;
    text-align: center;
    padding-bottom: 40px;
  }
  .popularWrapper > img{
    position: absolute;
    width: 23px;
    height: 29px;
    left: 50%;
    margin-left: -11px;
    top: 55px;
  }
  .popularWrapper > div > div:first-of-type{
    font-family: SDIyagi-aLt, 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif !important;
    font-size: 24px;
    color: #111;
    margin-top: 55px;
  }
  .popularWrapper > div > div:nth-of-type(2){
    font-size: 14px;
    color: #999;
    margin-top: 8px;
  }
  .domesticSwiper {
    height: 273px;
    overflow-y: hidden;
  }
  .domesticImg{
    width: 174px;
    height: 215px;
  }
  .overseasSwiper {
    height: 331px;
    overflow-y: hidden;
  }
  .overseasImg{
    width: 174px;
    height: 273px;
  }
  .swiperDescription{
    position: absolute;
    top: 0;
    left: 9px;
    right: 9px;
    bottom: 0;
    background-color: rgba(0,0,0,.2);
    color: #FFF;
    text-align: left;
    padding-top: 28px;
    padding-left: 15px;
    cursor: pointer;
  }
  .swiperDescription:before{
    content: '';
    border-top: 3px solid transparent;
    border-left: 3px solid #f7f3f0;
    border-bottom: 0 solid transparent;
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .swiperDescription:after{
    content: '';
    border-top: 3px solid transparent;
    border-right: 3px solid #f7f3f0;
    border-bottom: 0 solid transparent;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .swiperDescription > div:first-of-type{
    font-size: 12px;
    opacity: .7;
  }
  .swiperDescription > div:nth-of-type(2){
    border-bottom: 2px solid #FFF;
    width: 14px;
    margin-top: 14px;
    margin-bottom: 14px;
  }
  .swiperDescription > div:nth-of-type(3), .swiperDescription > div:nth-of-type(4){
    font-size: 24px;
    font-weight: 500;
  }
  .sandol{
    font-family: SDIyagi-aLt, 'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif !important;
    font-weight: normal !important;
  }
</style>

<style>
  .popularWrapper .swiper-container{
    padding-top: 58px;
  }
  .popularWrapper .swiper-wrapper .swiper-slide{
    text-align: center;
  }
  .popularWrapper .swiper-wrapper .swiper-slide{
    width: 192px;
  }
  .popularWrapper .swiper-wrapper .swiper-slide:first-of-type{
    width: 203px;
    padding-left: 11px;
  }
  .popularWrapper .swiper-wrapper .swiper-slide:first-of-type .swiperDescription{
    left: 20px;
  }
  .popularWrapper .swiper-wrapper .swiper-slide:last-of-type{
    width: 203px;
    padding-right: 11px;
  }
  .popularWrapper .swiper-wrapper .swiper-slide:last-of-type .swiperDescription{
    right: 20px;
  }
  .popularWrapper .swiper-pagination-bullet{
    width: 5px;
    height: 5px;
    opacity: 0.6;
    background-color: #bbbbbb;
    transition: .3s ease;
  }
  .popularWrapper .swiper-pagination-bullet-active{
    width: 16px;
    border-radius: 2.5px;
    background-color: #b18e79;
    opacity: 1;
  }
  .popularWrapper .swiper-pagination-bullets{
    bottom: unset !important;
    top: 16px !important;
    z-index: 10 !important;
  }
</style>
