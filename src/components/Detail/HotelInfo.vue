<template>
  <div>
    <div class="description">
      <div class="title">호텔소개</div>
      <div
        :class="descriptionMore === 'open' ? 'open' : ''"
      ><div ref="description">{{ hotelInfo.teaser || hotelInfo.name }}</div></div>
      <div v-if="descriptionMore">
        <button
          @click="isDescriptionMoreActive = !isDescriptionMoreActive"
          :class="descriptionMore === 'open' ? 'open' : ''"
        ></button>
      </div>
    </div>
    <div class="time">
      <div>
        <span v-if="hotelInfo.checkin">체크인 <span>{{ hotelInfo.checkin }} ~</span></span>
        <span v-else>&nbsp;</span>
      </div>
      <div>
        <span v-if="hotelInfo.checkout">체크아웃 <span>~ {{ hotelInfo.checkout }}</span></span>
        <span v-else>&nbsp;</span>
      </div>
    </div>
    <div class="facility">
      <div
        v-for="x in facilityList"
        :key="x"
        :class="facility.indexOf(x) >= 0 ? 'active' : ''"
      ><div></div>{{ x }}</div>
    </div>
    <div class="addition">
      <div class="title">부대시설</div>
      <ul>
        <li
          v-for="(x, index) in additionList"
          :key="index"
        >
          <div>{{ x[0] }}</div>
          <div>{{ x[1] }}</div>
        </li>
      </ul>
      <div class="moreContainer" v-if="false"><button></button></div>
    </div>
    <div class="roomType" v-if="roomType.length > 0">
      <div class="title">객실타입정보</div>
      <ul>
        <li v-for="(x, index) in roomType" :key="index">
          <div class="thumbnail" :style="{
            'background-image': 'url('+x.imageUrl+')'
          }"></div>
          <div>{{ x.name }}</div>
          <div>
            <span>{{ x.info }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ['hotelInfo', 'isTabActive'],
  data () {
    const additionList = []
    const facility = this.hotelInfo.facilities || []
    const facilityList = [
      '와이파이', '조식', '수영장', '레스토랑', '세탁', '비즈니스 센터', '공항셔틀', '스파', '수화물 보관소', '피트니스 센터', '24시 프론트', '주차'
    ]
    let y = 0
    let arr = []
    for (let x = 0; x < facility.length; x += 1) {
      if (facilityList.indexOf(facility[x]) < 0) {
        y += 1
        arr.push(facility[x])
        if (y % 2 === 0 || x === facility.length - 1) {
          additionList.push(arr)
          y = 0
          arr = []
        }
      }
    }
    return {
      facility,
      facilityList,
      additionList,
      isDescriptionMoreActive: false
    }
  },
  computed: {
    descriptionMore () {
      if (!this.isTabActive) {
        return false
      }
      if (this.isDescriptionMoreActive) {
        return 'open'
      }
      if (this.$refs.description && this.$refs.description.clientHeight > 100) {
        return 'hide'
      }
      return false
    },
    roomType () {
      const rankOTA = ['EXPEDIA', 'BOOKING_DOT_COM', 'AGODA']
      const arr = []
      for (let x = 0; x < rankOTA.length; x += 1) {
        for (let y = 0; y < this.hotelInfo.rooms.length; y += 1) {
          if (this.hotelInfo.rooms[y].hotelVendorKind === rankOTA[x] && this.hotelInfo.rooms[y].roomImageUrl) {
            arr.push({
              name: this.hotelInfo.rooms[y].name,
              info: this.hotelInfo.rooms[y].information,
              imageUrl: this.hotelInfo.rooms[y].roomImageUrl
            })
          }
        }
        if (arr.length > 0) {
          break
        }
      }
      return arr
    }
  }
}
</script>

<style scoped>
  .title{
    font-size: 16px;
    font-weight: 600;
  }
  .description, .addition{
    padding: 40px 20px 28px;
  }
  .description > div:last-of-type, .addition > .moreContainer{
    text-align: center;
  }
  .description > div button, .addition > div button{
    font-size: 14px;
    background-color: transparent;
    border: 0;
    position: relative;
    padding-right: 16px;
    height: 20px;
  }
  .description > div button:before, .addition > div button:before{
    content: '더 보기';
  }
  .description > div button.open:before, .addition > div button.open:before{
    content: '접기';
  }
  .description > div button:after, .addition > div button:after{
    content: '';
    background-image: url(../../assets/chevron-top.svg);
    width: 16px;
    height: 16px;
    position: absolute;
    top: 2px;
    right: 0;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    transform: rotate(180deg)
  }
  .description > div button.open:after, .addition > div button.open:after{
    transform: rotate(0deg)
  }
  .description .title, .addtion .title{
    color: #111;
  }
  .description > div:nth-of-type(2){
    font-size: 14px;
    line-height: 20px;
    margin-top: 12px;
    height: 100px;
    overflow: hidden;
    text-align: left;
    margin-bottom: 20px;
  }
  .description > div:nth-of-type(2).open{
    height: auto;
  }
  .time{
    height: 50px;
    background-color: #b18e79;
    color: #FFF;
  }
  .time > div{
    float: left;
    width: 50%;
    position: relative;
    text-align: center;
    line-height: 50px;
    font-size: 12px;
    font-weight: 500;
  }
  .time > div:first-of-type:after{
    border-right: solid 1px rgba(255, 255, 255, .3);
    position: absolute;
    right: 0;
    top: 18px;
    height: 12px;
    content: '';
  }
  .time > div > span > span{
    font-size: 16px;
    font-weight: 600;
    margin-left: 12px;
  }
  .facility{
    font-size: 0;
  }
  .facility > div{
    display: inline-block;
    width: 25%;
    border-right: 1px solid rgba(143, 157, 157, 0.3);
    border-bottom: 1px solid rgba(143, 157, 157, 0.3);
    height: 100px;
    color: #bbbbbb;
    font-size: 12px;
    text-align: center;
    font-weight: 500;
  }
  .facility > div.active{
    color: #1a1a1c;
    font-weight: bold;
  }
  .facility > div > div{
    width: 40px;
    height: 40px;
    border-radius: 100%;
    background-color: rgba(143, 157, 157, 0.32);
    margin: 20px auto 5px;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .facility > div:nth-of-type(1) > div{
    background-image: url(../../assets/filter0.svg);
  }
  .facility > div:nth-of-type(2) > div{
    background-image: url(../../assets/filter1.png);
    background-size: 16px;
  }
  .facility > div:nth-of-type(3) > div{
    background-image: url(../../assets/filter2.svg);
  }
  .facility > div:nth-of-type(4) > div{
    background-image: url(../../assets/filter3.svg);
  }
  .facility > div:nth-of-type(5) > div{
    background-image: url(../../assets/filter4.svg);
  }
  .facility > div:nth-of-type(6) > div{
    background-image: url(../../assets/filter5.svg);
  }
  .facility > div:nth-of-type(7) > div{
    background-image: url(../../assets/filter6.svg);
  }
  .facility > div:nth-of-type(8) > div{
    background-image: url(../../assets/filter7.svg);
  }
  .facility > div:nth-of-type(9) > div{
    background-image: url(../../assets/filter5.svg);
  }
  .facility > div:nth-of-type(10) > div{
    background-image: url(../../assets/filter9.svg);
  }
  .facility > div:nth-of-type(11) > div{
    background-image: url(../../assets/filter10.svg);
  }
  .facility > div:nth-of-type(12) > div{
    background-image: url(../../assets/filter11.svg);
  }
  .facility > div.active > div{
    background-color: #b18e79;
  }
  .facility > div:nth-of-type(4), .facility > div:nth-of-type(8), .facility > div:nth-of-type(12){
    border-right: 0;
  }
  .addition > ul{
    padding: 22px 10px 25px;
    font-size: 0;
    position: relative;
  }
  .addition > ul > li{
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    line-height: 18px;
  }
  .addition > ul > li > div{
    width: 50%;
    flex: 1;
    padding-bottom: 8px;
  }
  .addition > ul > li > div:nth-of-type(1){
    padding-right: 28px;
  }
  .addition > ul > li > div:nth-of-type(2){
    border-left: 1px solid #ddd;
    padding-left: 28px;
  }
  .roomType{
    padding: 38px 20px 65px;
    background-color: #b18e79;
  }
  .roomType .title{
    color: #FFF;
  }
  .roomType ul{
    overflow: hidden;
    border-radius: 4px;
    margin-top: 16px;
  }
  .roomType li{
    height: 72px;
    width: 100%;
    background-color: #FFF;
    border-bottom: 1px solid #ddd;
    padding: 16px;
    position: relative;
    padding-left: 70px;
  }
  .roomType li:last-of-type{
    border-bottom: 0;
  }
  .roomType li > div.thumbnail{
    width: 40px;
    height: 40px;
    background-color: #d5d5d5;
    border-radius: 100%;
    position: absolute;
    top: 16px;
    left: 16px;
    background-position: center center;
    background-size: cover;
  }
  .roomType li > div:nth-of-type(2){
    margin-top: 1px;
    font-size: 14px;
    font-weight: 600;
    line-height: 17px;
    padding-right: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .roomType li > div:nth-of-type(3){
    font-size: 12px;
    font-weight: 500;
    color: #666;
    letter-spacing: -0.4px;
    margin-top: 4px;
    line-height: 15px;
  }
  .roomType li > div:nth-of-type(3) > span:last-of-type{
    color: #999;
  }
</style>
