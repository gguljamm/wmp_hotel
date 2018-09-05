<template>
  <div>
    <div class="filterWrapper scrollable" ref="filterWrapper">
      <div>
        <div class="sortWrapper">
          <div class="title" @click="sortOpen = !sortOpen">
            정렬순서
            <div class="clampIcon" v-bind:class="sortOpen ? 'selected' : ''"></div>
            <div class="selectedSortName">{{ selectedSortName }}</div>
          </div>
          <div v-if="sortOpen" class="sortList"
               v-for="x in sortList"
               :key="x.key"
               :class="sort === x.key ? 'selected' : ''"
               @click="sort = x.key"
          >{{ x.name }}</div>
        </div>
      </div>
      <div>
        <div class="title">숙소타입</div>
        <div class="content type">
          <button :class="type.length === 0 ? 'selected' : ''" @click="type = []">전체</button>
          <button
            v-for="x in typeList"
            :key="x"
            :class="type.indexOf(x) >= 0 ? 'selected' : ''"
            @click="clickType(x)"
          >{{ x }}</button>
        </div>
      </div>
      <div>
        <div class="title">호텔성급</div>
        <div class="content star">
          <div>
            <span v-if="star.length === 0">전체</span>
            <span v-for="x in 5" :key="x" v-if="star.indexOf(x) >= 0">{{ x }}성급</span>
          </div>
          <div>
            <div v-for="x in 5" :key="x">
              <button
                :class="star.indexOf(x) >= 0 ? 'selected' : ''"
                @click="clickStar(x)"
              >{{ x }}성급</button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="title">총 숙박요금</div>
        <div class="content">
          <vue-slider @callback="priceSliderChange" ref="slider1" v-bind="priceSlider" v-model="priceSlider.value"></vue-slider>
          <div class="priceSection">
            <div>{{ format.numberFormat(price.min) }}원</div>
            <div>{{ price.max === 2000000 ? '제한없음' : `${format.numberFormat(price.max)}원` }}</div>
          </div>
        </div>
      </div>
      <div class="addition" ref="filterAddition">
        <div class="title" @click="toggleAddition">편의시설<div class="clampIcon" v-bind:class="additionOpen ? 'selected' : ''"></div></div>
        <div class="additionOpen" :style="{height: additionOpen ? `${additionList.length * 68 + 88}px` : 0}">
          <div class="content">
            <div
              v-for="x in additionList"
              :key="x"
              :class="addition.indexOf(x) >= 0 ? 'selected' : ''"
              @click="clickAddition(x)"
            >{{ x }}</div>
          </div>
          <div class="additionButton">
            <button @click="additionAll">모두 선택</button>
            <button @click="addition = []">모두 해제</button>
          </div>
        </div>
      </div>
      <div class="listCondition">
        <div class="title">검색 정렬방식</div>
        <div class="content">
          <div :class="list === 'list' ? 'selected' : ''" @click="list = 'list'">
            <div>목록보기</div>
            <div></div>
          </div>
          <div :class="list === 'card' ? 'selected' : ''" @click="list = 'card'">
            <div>모아보기</div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="calBottom">
      <div><button @click="reset">초기화</button></div>
      <div><button @click="submit">필터적용</button></div>
    </div>
  </div>
</template>

<script>
import vueSlider from 'vue-slider-component'
import Format from '../../util/format'
export default {
  components: {
    vueSlider
  },
  name: 'HotelFilter',
  props: ['filterInfo', 'sortCondition', 'listingCondition'],
  data () {
    console.log(this.listingCondition)
    const star = []
    const type = []
    const addition = []
    for (let x = 0; x < this.filterInfo.stars.length; x += 1) {
      star.push(this.filterInfo.stars[x])
    }
    for (let x = 0; x < this.filterInfo.categories.length; x += 1) {
      type.push(this.filterInfo.categories[x])
    }
    for (let x = 0; x < this.filterInfo.amenity.length; x += 1) {
      addition.push(this.filterInfo.amenity[x])
    }
    return {
      format: Format,
      star,
      type,
      addition,
      price: {
        min: this.filterInfo.minPrice || 0,
        max: this.filterInfo.maxPrice || 2000000
      },
      typeList: [
        '호텔', '리조트', '펜션', '모텔', '게스트하우스', '레지던스', '카라반'
      ],
      additionList: [
        '와이파이', '조식', '수영장', '레스토랑', '세탁', '비즈니스 센터', '공항셔틀', '스파', '수하물 보관소', '피트니스 센터', '24시 프론트', '주차'
      ],
      priceSlider: {
        value: [
          this.filterInfo.minPrice || 0,
          this.filterInfo.maxPrice || 2000000
        ],
        width: '100%',
        height: 4,
        dotSize: 34,
        interval: 1000,
        min: 0,
        max: 2000000,
        disabled: false,
        show: false,
        tooltip: 'none',
        bgStyle: {
          backgroundColor: '#b9b0ae'
        },
        processStyle: {
          backgroundImage: 'linear-gradient(to right, #e2c7b7, #a98169)',
          height: '4px'
        },
        sliderStyle: {
          boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.09)',
          border: 'solid 1px #b18e79'
        }
      },
      additionOpen: false,
      sort: this.sortCondition,
      sortList: [
        { key: 'BEST', 'name': '인기순' },
        { key: 'RATING', 'name': '평점' },
        { key: 'PRICE_DESC', 'name': '높은가격순 (평균가 기준)' },
        { key: 'PRICE_ASC', 'name': '낮은가격순 (평균가 기준)' },
        { key: 'STAR_DESC', 'name': '성급 높은순' },
        { key: 'STAR_ASC', 'name': '성급 낮은순' }
      ],
      sortOpen: false,
      list: this.listingCondition
    }
  },
  computed: {
    selectedSortName () {
      for (let x = 0; x < this.sortList.length; x += 1) {
        if (this.sortList[x].key === this.sort) {
          return this.sortList[x].name.split(' (')[0]
        }
      }
    }
  },
  methods: {
    priceSliderChange (val) {
      this.price.min = val[0]
      this.price.max = val[1]
    },
    clickType (type) {
      if (this.type.indexOf(type) >= 0) {
        this.type.splice(this.type.indexOf(type), 1)
      } else {
        this.type.push(type)
      }
    },
    clickStar (star) {
      if (this.star.indexOf(star) >= 0) {
        this.star.splice(this.star.indexOf(star), 1)
      } else {
        this.star.push(star)
      }
    },
    clickAddition (addition) {
      if (this.addition.indexOf(addition) >= 0) {
        this.addition.splice(this.addition.indexOf(addition), 1)
      } else {
        this.addition.push(addition)
      }
    },
    toggleAddition () {
      console.log(this.$refs.filterAddition.offsetTop)
      this.additionOpen = !this.additionOpen
      if (this.additionOpen) {
        this.$nextTick(() => {
          this.$refs.filterWrapper.scrollTo(0, this.$refs.filterAddition.offsetTop)
        })
      }
    },
    additionAll () {
      this.addition = []
      for (let x = 0; x < this.additionList.length; x += 1) {
        this.addition.push(this.additionList[x])
      }
    },
    submit () {
      this.$emit('research-with-filter', {
        categories: this.type,
        stars: this.star,
        amenity: this.addition,
        maxPrice: this.price.max,
        minPrice: this.price.min
      }, this.sort, this.list)
    },
    reset () {
      this.sort = 'BEST'
      this.star = []
      this.type = []
      this.addition = []
      this.price.min = 0
      this.price.max = 2000000
      this.priceSlider.value = [0, 2000000]
    }
  },
  mounted () {
    setTimeout(() => {
      this.priceSlider.show = true
    }, 160)
  }
}
</script>

<style scoped>
  .filterWrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    bottom: 74px;
  }
  .filterWrapper > div{
    padding: 40px 20px 50px;
    border-bottom: 1px solid #ddd;
  }
  .filterWrapper > div:first-of-type{
    padding: 0;
  }
  .filterWrapper > div:nth-of-type(2){
    padding-bottom: 42px;
  }
  .filterWrapper > div:nth-of-type(5){
    padding: 0;
  }
  .filterWrapper div .title{
    font-size: 16px;
    color: #111;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .filterWrapper > div:nth-of-type(3) .title {
    margin-bottom: 5px;
  }
  .filterWrapper div.sortWrapper .title{
    height: 64px;
    margin: 0;
    padding: 0 20px;
    line-height: 64px;
  }
  .filterWrapper > div .content.type{
    font-size: 0;
  }
  .filterWrapper > div .content.type > button{
    display: inline-block;
    margin-right: 8px;
    height: 36px;
    border-radius: 18px;
    border: solid 1px #bbbbbb;
    padding: 0 24px;
    background-color: #FFF;
    margin-bottom: 8px;
    font-size: 14px;
    color: #000;
    transition: background-color .3s ease;
  }
  .filterWrapper > div .content button.selected,
  .filterWrapper > div .content.star > div > div > button.selected{
    background-color: #b18e79;
    color: #FFF;
    border-color: #b18e79;
  }
  .filterWrapper > div .content.star > div:first-of-type{
    font-size: 14px;
    border: 0;
    background: transparent;
    font-weight: 300;
    height: 17px;
  }
  .filterWrapper > div .content.star > div:first-of-type > span:after{
    content: ', ';
  }
  .filterWrapper > div .content.star > div:first-of-type > span:last-of-type:after{
    content: '';
  }
  .filterWrapper > div .content.star > div:last-of-type{
    font-size: 0;
    margin-top: 16px;
    margin-right: -8px;
  }
  .filterWrapper > div .content.star > div > div{
    display: inline-block;
    width: 20%;
    padding-right: 8px;
  }
  .filterWrapper > div .content.star > div > div > button{
    width: 100%;
    height: 36px;
    border-radius: 18px;
    border: 1px solid #bbb;
    padding: 0;
    background-color: #FFF;
    margin-bottom: 8px;
    font-size: 14px;
    color: #000;
    transition: background-color .3s ease;
  }
  .priceSection{
    margin-top: 16px;
    height: 22px;
    line-height: 22px;
    font-size: 16px;
    color: #000;
  }
  .priceSection > div:first-of-type{
    float: left;
  }
  .priceSection > div:last-of-type{
    float: right;
  }
  .filterWrapper div.addition .title{
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    margin-bottom: 0;
    position: relative;
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
  .clampIcon.selected{
    transform: rotate(180deg);
  }
  .additionOpen{
    height: 0;
    overflow: hidden;
  }
  .filterWrapper div.addition .content > div{
    height: 68px;
    width: 100%;
    background-color: #f5f4f0;
    padding-left: 20px;
    line-height: 68px;
    transition: background-color .3s ease;
    position: relative;
  }
  .filterWrapper div.addition .content > div:after{
    content: '';
    width: 22px;
    height: 22px;
    border: solid 1px #bbbbbb;
    border-radius: 100%;
    position: absolute;
    right: 20px;
    top: 23px;
    box-sizing: border-box;
    transition: .3s ease;
  }
  .filterWrapper div.addition .content > div.selected{
    background-color: #e2e0db;
  }
  .filterWrapper div.addition .content > div.selected:after{
    background-image: url(../../assets/selected.svg);
    background-repeat: no-repeat;
    background-size: cover;
    border: 0;
  }
  .additionButton{
    font-size: 0;
    text-align: center;
    padding: 24px 0;
  }
  .additionButton > button{
    font-size: 14px;
    height: 40px;
    border-radius: 22px;
    padding: 0 40px;
  }
  .additionButton > button:first-of-type{
    background-color: #b18e79;
    color: #FFF;
    line-height: 40px;
    margin-right: 18px;
  }
  .additionButton > button:last-of-type{
    border: solid 1px #bbbbbb;
    line-height: 38px;
    color: #999999;
  }
  .calBottom{
    width: 100%;
    left: 0;
    font-size: 0;
    bottom: 0;
    height: 74px;
    position: absolute;
    padding: 9px 10px 10px;
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
  .sortList{
    height: 68px;
    width: 100%;
    background-color: #f5f4f0;
    padding-left: 20px;
    line-height: 67px;
    transition: background-color .3s ease;
    position: relative;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
  }
  .sortList:after{
    content: '';
    width: 22px;
    height: 22px;
    border: solid 1px #bbbbbb;
    border-radius: 100%;
    position: absolute;
    right: 20px;
    top: 23px;
    box-sizing: border-box;
    transition: .3s ease;
  }
  .sortList.selected{
    background-color: #e2e0db;
  }
  .sortList.selected:after{
    background-image: url(../../assets/select.svg);
    background-repeat: no-repeat;
    background-size: cover;
    border: 0;
  }
  .selectedSortName{
    margin-right: 8px;
    height: 36px;
    line-height: 36px;
    border-radius: 18px;
    padding: 0 24px;
    margin-bottom: 8px;
    font-size: 14px;
    background-color: #b18e79;
    color: #FFF;
    position: absolute;
    font-weight: normal;
    right: 49px;
    top: 13px;
  }
  .filterWrapper > div.listCondition{
    border-bottom: 0;
  }
  .listCondition .content{
    overflow: auto;
  }
  .listCondition .content > div{
    float: left;
    width: 50%;
    padding-left: 30px;
    cursor: pointer;
    position: relative;
  }
  .listCondition .content > div:before{
    content: '';
    box-sizing: border-box;
    border: 1px solid #bbb;
    width: 22px;
    height: 22px;
    top: 0;
    left: 0;
    position: absolute;
    border-radius: 100%;
  }
  .listCondition .content > div.selected:before{
    background-image: url(../../assets/select.svg);
    background-size: cover;
    border: 0;
  }
  .listCondition .content > div > div:first-of-type{
    font-size: 14px;
    margin-bottom: 17px;
    position: relative;
    padding-left: 26px;
    line-height: 22px;
  }
  .listCondition .content > div > div:first-of-type:before{
    content: '';
    background-image: url(../../assets/list-black.svg);
    background-size: cover;
    width: 13px;
    height: 12px;
    position: absolute;
    left: 7px;
    top: 5px;
  }
  .listCondition .content > div:first-of-type > div:last-of-type{
    width: 85px;
    height: 128px;
    background-image: url(../../assets/list-box.png);
    background-size: cover;
  }
  .listCondition .content > div:last-of-type > div:last-of-type{
    width: 85px;
    height: 128px;
    background-image: url(../../assets/card-box.png);
    background-size: cover;
  }
</style>
<style>
  .filterWrapper .vue-slider-dot:after{
    content: '';
    width: 4px;
    height: 4px;
    border-radius: 2px;
    background-color: #b18e79;
    display: block;
    margin-top: 14px;
    margin-left: 14px;
  }
</style>
