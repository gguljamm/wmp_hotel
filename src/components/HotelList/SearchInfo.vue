<template>
  <div class="searchInfo">
    <div @click="$emit('toggle-search-info')">
      <div>{{ destinationName || cloneInputData.destination.label }}</div>
      <div>
        <span>{{ format.dateFormat(cloneInputData.checkin) }}</span>({{ format.getDayOfWeek(cloneInputData.checkin) }})
        <span> - </span>
        <span>{{ format.dateFormat(cloneInputData.checkout) }}</span>({{ format.getDayOfWeek(cloneInputData.checkout) }})
        <span> / {{ format.getBetweenDay(cloneInputData.checkin, cloneInputData.checkout) }}박</span>
        <span>{{ getTotalPassenger }}</span>
      </div>
      <button></button>
      <button :class="listingCondition === 'list' ? 'card' : 'list'" @click.stop="$emit('change-list-condition')">
        {{ listingCondition === 'list' ? '모아보기' : '목록보기' }}
      </button>
    </div>
  </div>
</template>

<script>
import Format from '../../util/format'
export default {
  props: ['inputData', 'destinationName', 'listingCondition'],
  data () {
    return {
      format: Format,
      cloneInputData: Object.assign({}, this.inputData)
    }
  },
  computed: {
    getChildrenNumber () {
      return this.cloneInputData.children.length
    },
    getTotalPassenger () {
      return parseInt(this.cloneInputData.adults) + this.getChildrenNumber
    }
  }
}
</script>

<style scoped>
  .searchInfo{
    color: #FFF;
    background-color: #8F9D9D;
    width: 100%;
    z-index: 5;
    height: 70px;
    left: 0;
    top: 48px;
    position: fixed;
    transition: transform .3s ease;
  }
  .topOut .searchInfo{
    transform: translateY(-48px);
  }
  .searchInfo > div:first-of-type{
    background-color: #b18e79;
    height: 70px;
    text-align: left;
    width: 100%;
  }
  .searchInfo > div button:first-of-type{
    border-radius: 37px;
    padding: 0;
    height: 51px;
    width: 51px;
    border: 0;
    position: absolute;
    top: 9px;
    right: 88px;
    background: url(../../assets/search-51.svg) no-repeat;
  }
  .searchInfo > div button:nth-of-type(2){
    position: absolute;
    right: 0;
    top: 0;
    height: 70px;
    width: 70px;
    background-color: #ac8873;
    background-size: 20px;
    background-position: center 20px;
    background-repeat: no-repeat;
    letter-spacing: -0.5px;
    color: #d4b9a9;
    line-height: 104px;
    font-size: 12px;
    overflow: hidden;
  }
  .searchInfo > div button:nth-of-type(2).list{
    background-image: url(../../assets/list.svg);
  }
  .searchInfo > div button:nth-of-type(2).card{
    background-image: url(../../assets/card.svg);
  }
  .searchInfo > div > div:first-of-type{
    line-height: 19px;
    height: 19px;
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    top: 17px;
    left: 20px;
    right: 140px;
    position: absolute;
  }
  .searchInfo > div > div:last-of-type{
    line-height: 1.21;
    font-size: 14px;
    top: 40px;
    left: 20px;
    position: absolute;
  }
  .searchInfo > div > div:last-of-type > span:last-of-type:before{
    content: '';
    background-image: url(../../assets/person.svg);
    background-repeat: no-repeat;
    width: 10px;
    height: 12px;
    display: inline-block;
    margin-right: 2px;
  }
</style>
