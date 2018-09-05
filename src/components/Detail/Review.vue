<template>
  <div>
    <div class="totalReview" v-if="hotelInfo.rating">
      <div><span class="roboto">{{ hotelInfo.rating * 2 }}</span><span></span><span>{{ textByWeight(hotelInfo.rating * 2) }}</span><span v-if="hotelInfo.numberOfReviews">실제 이용 후기 {{ format.numberFormat(hotelInfo.numberOfReviews) }}개 기준</span></div>
      <div class="circleWrapper">
        <percent-circle
          :percent="61"
          :text="'청결도'"
        ></percent-circle>
        <percent-circle
          :percent="48"
          :text="'위치'"
        ></percent-circle>
        <percent-circle
          :percent="91"
          :text="'만족도'"
        ></percent-circle>
        <percent-circle
          :percent="23"
          :text="'부대시설'"
        ></percent-circle>
        <percent-circle
          :percent="63"
          :text="'서비스'"
        ></percent-circle>
      </div>
    </div>
    <div class="reviewList">
      <div>실제 이용 후기</div>
      <ul>
        <li v-for="(x, index) in review" :key="index">
          <div><span>{{ x.rate }}</span><span>|</span><span>{{ textByWeight(x.rate) }}</span><span>{{ x.date }}</span></div>
          <div>{{ x.title }}</div>
          <div>{{ x.content }}</div>
          <div>작성자 : {{ x.writer }}</div>
          <div>여행일 : {{ x.tripDate }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import PercentCircle from './PercentCircle'
import Format from '../../util/format'
export default {
  components: {
    PercentCircle
  },
  props: ['hotelInfo'],
  methods: {
    textByWeight (rate) {
      let text = ''
      if (rate > 9) {
        text = '최고'
      } else if (rate > 8) {
        text = '매우 좋음'
      } else if (rate > 7) {
        text = '좋음'
      } else if (rate > 6) {
        text = '만족'
      }
      return text
    }
  },
  data () {
    const review = [
      {
        title: '가족여행으로 좋습니다 (dummy)',
        content: '유아동반의 경우에는 가족여행으로 위치나 주변 시설이 좋습니다. 그리고 스카이트리를 야경으로 볼 수 있어서 전망도 괜찮습니다. 여름에 야외 수영장을 이용하면 더욱 좋을 것 같습니다. (dummy)',
        date: '2018.08.09 월요일',
        rate: 9.5,
        writer: 'yeeehj@bringprice.com',
        tripDate: '2018.06 (4박)'
      }
    ]
    return {
      format: Format,
      review
    }
  }
}
</script>

<style scoped>
  .totalReview{
    padding: 32px 0 0;
  }
  .totalReview > div:first-of-type{
    height: 26px;
    padding: 0 20px;
  }
  .totalReview > div:first-of-type > span{
    float: left;
  }
  .totalReview > div:first-of-type > span:first-of-type{
    font-size: 20px;
    font-weight: bold;
    color: #000;
    line-height: 26px;
  }
  .totalReview > div:first-of-type > span:nth-of-type(2){
    border-right: 1px solid #ddd;
    height: 15px;
    margin: 7px 7px 0 7px;
  }
  .totalReview > div:first-of-type > span:nth-of-type(3){
    font-size: 16px;
    font-weight: bold;
    color: #000;
    line-height: 20px;
    margin-top: 5px;
  }
  .totalReview > div:first-of-type > span:nth-of-type(4){
    font-size: 12px;
    color: #999;
    line-height: 16px;
    margin-top: 7px;
    margin-left: 9px;
  }
  .circleWrapper{
    font-size: 0;
    padding: 20px;
    white-space: nowrap;
    overflow-x: auto;
  }
  .circleWrapper > div{
    margin-right: 33px;
  }
  .reviewList{
    padding: 40px 20px;
    background-color: #f3f2ee;
  }
  .reviewList > div{
    color: #111;
    font-size: 16px;
    font-weight: 600;
  }
  .reviewList > ul{
    margin-top: 28px;
  }
  .reviewList > ul li{
    margin-bottom: 24px;
    background-color: #FFF;
    padding: 20px;
  }
  .reviewList > ul li:last-of-type{
    margin-bottom: 0;
  }
  .reviewList > ul li > div:first-of-type{
    height: 24px;
    line-height: 24px;
  }
  .reviewList > ul li > div:first-of-type > span{
    float: left;
    font-size: 16px;
    font-weight: bold;
    color: #000;
  }
  .reviewList > ul li > div:first-of-type > span:nth-of-type(2) {
    margin: 0 7px;
    color: #ddd;
  }
  .reviewList > ul li > div:first-of-type > span:nth-of-type(3){
    color: #8f9d9d;
  }
  .reviewList > ul li > div:first-of-type > span:last-of-type{
    float: right;
    font-size: 12px;
    color: #999;
    font-weight: normal;
  }
  .reviewList > ul li > div:nth-of-type(2){
    margin-top: 24px;
    font-size: 14px;
    font-weight: bold;
  }
  .reviewList > ul li > div:nth-of-type(3){
    font-size: 14px;
    line-height: 20px;
    margin-top: 4px;
  }
  .reviewList > ul li > div:nth-of-type(4){
    margin-top: 8px;
    font-size: 12px;
    color: #999;
  }
  .reviewList > ul li > div:nth-of-type(5){
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
</style>
