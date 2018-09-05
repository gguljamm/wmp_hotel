<template>
  <div class="recentSearchWrapper" @click="$emit('close-pop')">
    <div @click.stop>
      <div>최근검색<button @click="$emit('close-pop')"></button></div>
      <ul v-if="recentList.length > 0">
        <li v-for="(x, index) in recentList" :key="index" @click="recentSubmit(index)">
          <div class="thumbnail" :class="x.destination.type"></div>
          <div>{{ x.destination.label }}</div>
          <div>
            <span>{{ format.dateFormat(x.checkin) }}({{ format.getDayOfWeek(x.checkin) }}) - {{ format.dateFormat(x.checkout) }}({{ format.getDayOfWeek(x.checkout) }})</span>
            <span>성인 {{ x.adults }}명,<span v-if="x.children.length > 0"> 어린 {{ x.children.length }}명</span> 객실 {{ x.room }}개</span></div>
          <div @click.stop @click="$emit('recent-del', index)" class="close"></div>
        </li>
      </ul>
      <div v-else>
        최근 검색이 없습니다.
      </div>
    </div>
  </div>
</template>

<script>
import Format from '../../util/format'
export default {
  props: ['recentList'],
  data () {
    const today = new Date()
    const todayString = `${today.getFullYear()}-${Format.zeros(today.getMonth() + 1)}-${Format.zeros(today.getDate())}`
    return {
      format: Format,
      todayString
    }
  },
  methods: {
    recentSubmit (index) {
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
    }
  }
}
</script>

<style scoped>
  .recentSearchWrapper{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 48px;
    background-color: rgba(38, 38, 40, .7);
    z-index: 20;
  }
  .recentSearchWrapper > div{
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    background-color: #FFF;
    transition: .3s ease;
  }
  .scrollDown .recentSearchWrapper > div{
    transform: translateY(48px);
  }
  .recentSearchWrapper > div > div:first-of-type{
    height: 58px;
    font-size: 16px;
    color: #111;
    font-weight: 400;
    line-height: 56px;
    text-align: center;
    background-color: #fff;
    border-top: 1px solid #e7e7e7;
  }
  .recentSearchWrapper > div > div:first-of-type button{
    position: absolute;
    background: transparent;
    right: 0;
    top: 0;
    height: 58px;
    width: 58px;
    border: 0;
    padding: 0;
    font-size: 0;
  }
  .recentSearchWrapper > div > div:first-of-type button:before{
    content: '';
    width: 10px;
    height: 10px;
    border-top: 1px solid #979797;
    border-left: 1px solid #979797;
    transform: rotate(-135deg);
    display: inline-block;
  }
  .recentSearchWrapper > div > div:nth-of-type(2) {
    line-height: 100px;
    text-align: center;
    font-size: 16px;
    background-color: #fbfbfb;
    border-top: 1px solid #e7e7e7;
  }
  .recentSearchWrapper > div > ul{
    background-color: #fbfbfb;
  }
  .recentSearchWrapper > div > ul > li{
    padding: 20px 20px 20px 80px;
    border-top: 1px solid #e7e7e7;
    position: relative;
  }
  .recentSearchWrapper > div > ul li > div.thumbnail{
    width: 40px;
    height: 40px;
    background-color: #FFF;
    border: 1px solid #ddd;
    border-radius: 100%;
    position: absolute;
    top: 20px;
    left: 20px;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    background-image: url(../../assets/recent_location.svg);
    background-position: center center;
    background-repeat: no-repeat;
  }
  .recentSearchWrapper > div > ul li > div.thumbnail.hotel{
    background-image: url(../../assets/recent_hotel.svg);
  }
  .recentSearchWrapper > div > ul li > div:nth-of-type(2){
    font-size: 14px;
    font-weight: 500;
    line-height: 17px;
    padding-right: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .recentSearchWrapper > div > ul li > div:nth-of-type(3){
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
  .recentSearchWrapper > div > ul li > div:nth-of-type(3) > span{
    font-size: 12px;
  }
  .recentSearchWrapper > div > ul li > div:nth-of-type(3) > span:last-of-type{
    color: #999;
  }
  .recentSearchWrapper > div > ul li > div:nth-of-type(3) > span:last-of-type:before{
    content: '';
    height: 12px;
    width: 1px;
    border-left: 1px solid #ddd;
    margin-top: 2px;
    margin-left: 6px;
    margin-right: 4px;
  }
  .recentSearchWrapper > div > ul li .close{
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
</style>
