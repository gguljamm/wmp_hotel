<template>
  <div class="hotelPop">
    <div :class="popping ? popping : ''">
      <div class="popHeader">
        <span>{{ popTitle(iosPopFlag || $route.params.popFlag) }}</span>
        <button class="close" @click="$emit('close-pop')"></button>
      </div>
      <div class="popContent">
        <autocomplete
          v-if="iosPopFlag === 'destination' || $route.params.popFlag === 'destination'"
          :inputData="inputData"
          @change-destination="changeDestination"
        ></autocomplete>
        <Option
          v-if="iosPopFlag === 'option' || $route.params.popFlag === 'option'"
          :inputData="inputData"
          @change-option="changeOption"
        ></Option>
        <Calendar
          v-if="iosPopFlag === 'date' || $route.params.popFlag === 'date'"
          :dept="inputData.checkin"
          :retn="inputData.checkout"
          :isDept="true"
          :todayString="todayString"
          @change-date="changeDate"
        ></Calendar>
      </div>
    </div>
  </div>
</template>

<script>
import Autocomplete from './Autocomplete'
import Option from './Option'
import Calendar from './Calendar'

export default {
  components: {
    Autocomplete,
    Option,
    Calendar
  },
  name: 'SearchPopup',
  props: ['inputData', 'popping', 'todayString', 'iosPopFlag'],
  methods: {
    changeDestination (destination) {
      this.inputData.destination = {
        label: destination.name,
        lat: destination.latitude,
        lng: destination.longitude,
        type: destination.type,
        country: destination.country,
        cityName: destination.city_name,
        cityId: destination.city_ufi || destination.id,
        placeId: destination.id,
        countryName: destination.country_name
      }
      this.$emit('close-pop')
    },
    changeDate (deptDate, retnDate) {
      this.inputData.checkin = deptDate
      this.inputData.checkout = retnDate
      this.$emit('close-pop')
    },
    changeOption (adults, children, room) {
      this.inputData.adults = adults
      this.inputData.children = children
      this.inputData.room = room
      this.$emit('close-pop')
    },
    popTitle (flag) {
      let title
      if (flag === 'destination') {
        title = ''
      } else if (flag === 'date') {
        title = '날짜선택'
      } else if (flag === 'option') {
        title = '숙박인원'
      }
      return title
    },
    openPop (flag) {
      this.$emit('open-pop', flag)
    },
    closePop () {
      this.$emit('close-pop')
    }
  },
  mounted () {
    window.document.body.style.overflowY = 'hidden'
  },
  destroyed () {
    window.document.body.style.overflowY = 'auto'
  }
}
</script>
<style scoped>
  .hotelPop{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(38, 38, 40, .7);
    z-index: 20;
  }
  .hotelPop > div{
    top: 48px;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #FFF;
    position: absolute;
  }
  .hotelPop > div.open{
    animation: openPopTop ease .15s;
  }
  .hotelPop > div.close{
    animation: closePopTop ease .15s;
  }
  .hotelPop > div .popHeader{
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #FFF;
    line-height: 60px;
    padding-left: 20px;
    border-bottom: 1px solid #ddd;
    color: #111;
    font-size: 16px;
  }
  .hotelPop > div .popHeader > button.close{
    position: absolute;
    background: transparent;
    right: 0;
    top: 0;
    height: 60px;
    width: 60px;
    border: 0;
    padding: 0;
    font-size: 32px;
    background-image: url(../../assets/close.svg);
    background-repeat: no-repeat;
    background-position: center center;
  }
  .hotelPop > div .popContent {
    position: absolute;
    top: 60px;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @keyframes openPopTop {
    from {
      transform: translateY(100vh);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes closePopTop {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100vh);
    }
  }
</style>
