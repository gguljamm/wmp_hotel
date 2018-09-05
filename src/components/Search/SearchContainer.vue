<template>
  <div class="inputContainer"
    :class="setClass"
    @click.stop
  >
    <button class="inputBtn destination"
      @click="$emit('open-pop', 'destination')"
      :class="!inputData.destination.label ? 'empty' : ''"
    >
      {{ inputData.destination.label ? inputData.destination.label : '지역명, 명소명 또는 호텔명 검색' }}
    </button>
    <div class="date">
      <button class="inputBtn" @click="$emit('open-pop', 'date')">
        <div>체크인<span></span>{{ getDayOfWeek(inputData.checkin) }}</div>
        <div class="roboto">{{ format.dateYearFormat(inputData.checkin) }}</div>
      </button>
      <button class="inputBtn" @click="$emit('open-pop', 'date')">
        <div>체크아웃<span></span>{{ getDayOfWeek(inputData.checkout) }}</div>
        <div class="roboto">{{ format.dateYearFormat(inputData.checkout) }}</div>
      </button>
    </div>
    <button class="inputBtn option" @click="$emit('open-pop', 'option')">
      <div>
        <div>숙박인원</div>
        <div>
          <span><span>성인</span> <span>{{ inputData.adults }}</span><span>명,</span>
          <span>어린이</span> <span v-if="inputData.children.length > 0">{{ inputData.children.length }}명</span><span v-else>없음</span></span>
        </div>
      </div>
      <div>
        <div>객실 수</div>
        <div>{{ inputData.room }}개</div>
      </div>
    </button>
    <button class="submit"
      @click="submit()"
    ></button>
    <button v-if="subClass === 'sub'" class="close" @click="$emit('close-pop')"></button>
  </div>
</template>

<script>
import Format from '../../util/format'
export default {
  name: 'SearchContainer',
  props: ['inputData', 'subClass', 'filterInfo', 'iosPopFlag'],
  data () {
    return {
      format: Format,
      dayOfWeek: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
    }
  },
  computed: {
    setClass () {
      return this.subClass
    }
  },
  methods: {
    getDayOfWeek (date) {
      return this.dayOfWeek[(new Date(date)).getDay()]
    },
    submit () {
      const children = this.inputData.children.length > 0 ? this.inputData.children.join('&') : 'null'
      if (!this.inputData.destination.placeId) {
        window.EventBus.$emit('popAlert', 'alert', '머무를 곳을 입력해주세요.')
      } else if (!this.inputData.checkin) {
        window.EventBus.$emit('popAlert', 'alert', '체크인 날짜를 입력해주세요.')
      } else if (!this.inputData.checkout) {
        window.EventBus.$emit('popAlert', 'alert', '체크아웃 날짜를 입력해주세요.')
      } else if (parseInt(this.inputData.checkin.replace(/-/gi, '')) < parseInt(this.format.getToday().replace(/-/gi, ''))) {
        window.EventBus.$emit('popAlert', 'alert', '오늘 이후의 날짜를 선택해주세요.')
      } else {
        const arrSearchList = this.$cookies.get('bphotels') ? JSON.parse(this.$cookies.get('bphotels')) : []
        for (let x = 0; x < arrSearchList.length; x += 1) {
          if (JSON.stringify(arrSearchList[x]) === JSON.stringify(this.inputData)) {
            arrSearchList.splice(x, 1)
            break
          }
        }
        arrSearchList.push(this.inputData)
        if (arrSearchList.length > 3) {
          arrSearchList.splice(0, 1)
        }
        this.$cookies.set('bphotels', JSON.stringify(arrSearchList), '30d', '/')
        const destination = [
          this.inputData.destination.label,
          this.inputData.destination.lat,
          this.inputData.destination.lng,
          this.inputData.destination.type,
          this.inputData.destination.country,
          this.inputData.destination.countryName,
          this.inputData.destination.cityName,
          this.inputData.destination.cityId,
          this.inputData.destination.placeId
        ].join('|')
        const param = [
          destination,
          this.inputData.checkin,
          this.inputData.checkout,
          this.inputData.adults,
          children,
          this.inputData.room
        ]
        if (this.subClass === 'sub') {
          const path = `/hotelList/${param.join('/')}`
          if (path === decodeURIComponent(this.$route.path).replace('/search', '')) {
            this.$emit('close-pop')
          } else {
            this.$emit('reset-filter-info')
            this.$nextTick(() => {
              this.$emit('clear-waterfall-state')
              this.$router.replace(
                `${path}${window.location.search}${window.location.hash}`
              )
            })
            if (this.iosPopFlag) {
              this.$emit('close-pop')
            }
          }
        } else {
          this.$emit('reset-filter-info')
          this.$emit('clear-waterfall-state')
          this.$router.push(
            `/hotelList/${param.join('/')}${window.location.search}${window.location.hash}`
          )
        }
      }
    },
    widgetInit () { // 위젯 검색
      let query = this.$route.query
      if (query.type !== undefined) {
        this.$router.push(
          `/${window.location.search}${window.location.hash}`
        )
        let popup = query.popup

        if (query.label) { // 조회된 도시가 있을때만
          this.inputData.destination = {
            label: query.label,
            lat: query.latitude,
            lng: query.longitude,
            type: query.type,
            country: query.country,
            countryName: query.countryName,
            cityName: query.cityName,
            cityId: query.cityId,
            placeId: query.placeId
          }
        }

        this.$emit('open-pop', popup)
      }
    }
  },
  created () {
    this.widgetInit() // 위젯 검색(문제 발생시 주석 처리 해주세요)
  }
}
</script>

<style scoped>
  .inputContainer.main{
    padding: 38px 20px 40px;
    font-size: 0;
  }
  .inputContainer.sub{
    background: #b18e79;
    padding: 20px 20px 24px;
    position: absolute;
    width: 100%;
    font-size: 0;
  }
  .inputContainer .inputBtn{
    border-radius: 4px;
    height: 80px;
    width: 100%;
    background-color: #FFF;
    text-align: left;
    margin-bottom: 8px;
    border: 0;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
  }
  .inputContainer .inputBtn.option{
    margin-bottom: 0;
  }
  .inputContainer .inputBtn.destination{
    font-size: 26px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .inputContainer .inputBtn.destination.empty{
    color: #bbb;
    font-size: 20px;
  }
  .inputContainer .date .inputBtn{
    float: left;
    width: 49%;
  }
  .inputContainer .date .inputBtn:first-child{
    margin-right: 2%;
  }
  .inputContainer .date .inputBtn > div:first-child{
    font-size: 12px;
    font-weight: normal;
  }
  .inputContainer .date .inputBtn > div:last-of-type{
    font-size: 22px;
    font-weight: normal;
  }
  .inputContainer .date .inputBtn > div > span{
    border-left: 1px solid #ddd;
    margin-left: 4px;
    margin-right: 4px;
    height: 12px;
    display: inline-block;
    top: 2px;
    position: relative;
  }
  .inputContainer .inputBtn.option > div{
    float: left;
  }
  .inputContainer .inputBtn.option > div:first-child {
    width: 70%;
    text-align: left;
  }
  .inputContainer .inputBtn.option > div:last-of-type{
    width: 30%;
    text-align: right;
  }
  .inputContainer .inputBtn.option > div > div:first-child{
    font-size: 12px;
    font-weight: normal;
  }
  .inputContainer .inputBtn.option > div > div:last-of-type{
    letter-spacing: -0.4px;
    font-size: 20px;
    font-weight: normal;
  }
  .inputContainer .submit{
    border-radius: 37px;
    height: 74px;
    margin: 18px auto 0;
    display: block;
    width: 174px;
    background: url(../../assets/search-warm.svg) no-repeat;
    background-size: cover;
    padding: 6px 0;
  }
  .inputContainer.sub .submit{
    margin: 0 auto;
    margin-top: 11px;
  }
  .inputContainer .close{
    width: 40px;
    height: 40px;
    border: solid 1px #ffffff;
    background-image: url(../../assets/close_white.svg);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 20px;
    border-radius: 100%;
    position: absolute;
    right: 20px;
    bottom: 40px;
  }
</style>
