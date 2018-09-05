<template>
  <div class="cwCalendar">
    <div id="cwd_select">
      <div
        :class="deptFlag?'selected':''"
        @click="deptFlag=true"
      >
        <div>{{ getDayWeek(deptDate) }}</div>
        <div class="roboto">{{ format.dateYearFormat(deptDate) }}</div>
      </div>
      <div
        :class="!deptFlag?'selected':''"
        @click="deptFlag=false"
      >
        <div>{{ retnDate ? getDayWeek(retnDate) : '&nbsp;' }}</div>
        <div v-if="retnDate" class="roboto">{{ format.dateYearFormat(retnDate) }}</div>
        <div v-else>체크아웃</div>
      </div>
    </div>
    <div id="cwcalendar_container">
      <div id="cwday_bar">
        <div class="cwday_bar_block" v-for="day in week" :key="day">{{ day }}</div>
      </div>
      <div id="cwcalendar_view" ref="calScrollArea">
        <div v-for="list in calInfo" :key="list.month">
          <div class="cwmonth_block" :class="list.month">{{ `${list.month.substr(0,4)}.${list.month.substr(4,6)}` }}</div>
          <div class="cwmonth_week"
            v-for="(week, index) in list.week"
            :key="`${list.month}_${index}`"
          >
            <a href="javascript:"
              v-for="(day, index) in week"
              :class="chkDate(`${list.month}${format.zeros(day)}`, day)"
              :key="`${list.month}${index}`"
              @click="clickDate(`${list.month}${format.zeros(day)}`)"
            ><div>{{ day === 0 ? '&nbsp;' : day }}</div><div></div></a>
          </div>
        </div>
      </div>
    </div>
    <div class="calBottom">
      <div><button @click="today()" :class="isToday ? 'checked' : ''"><div></div>당일예약</button></div>
      <div><button @click="changeDate()">날짜 선택완료</button></div>
    </div>
  </div>
</template>

<script>
import Format from '../../util/format'
export default {
  name: 'Calendar',
  props: ['dept', 'retn', 'isDept', 'todayString'],
  data () {
    return {
      format: Format,
      calInfo: [],
      week: ['일', '월', '화', '수', '목', '금', '토'],
      month: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
      deptDate: this.dept,
      retnDate: this.retn,
      deptFlag: this.isDept,
      todayStr: parseInt(this.todayString.replace(/-/gi, ''), 10),
      holiday: ['20180924', '20180925', '20180926',
        '20190204', '20190205', '20190206', '20190912', '20190913', '20190914',
        '20200124', '20200125', '20200415', '20200430', '20200930', '20201001', '20201002',
        '20210211', '20210212', '20210213', '20210519', '20210920', '20210921', '20210922',
        '20220131', '20220201', '20220202', '20220122', '20220909', '20220910',
        '20230121', '20230123', '20230527', '20230928', '20230929', '20230930',
        '20240209', '20240210', '20240410', '20240515', '20240916', '20240917', '20240918',
        '20250128', '20250129', '20250130', '20251006', '20251007'
      ],
      generalHoliday: ['0101', '0301', '0505', '0606', '0815', '1003', '1009', '1225']
    }
  },
  mounted () {
    const today = new Date()
    today.setDate(1)
    for (let x = 1; x <= 12; x += 1) {
      const thisToday = new Date(this.todayString)
      thisToday.setDate(1)
      thisToday.setMonth(today.getMonth() + x)
      thisToday.setDate(0)
      const key = `${thisToday.getFullYear()}${this.format.zeros(thisToday.getMonth() + 1)}`
      const lastDay = thisToday.getDate()
      const lastDay2 = thisToday.getDay()
      thisToday.setDate(1)
      const firstDay = thisToday.getDay()
      const arrDate = []
      for (let y = 0; y < firstDay; y += 1) {
        arrDate.push(0)
      }
      for (let y = 1; y <= lastDay; y += 1) {
        arrDate.push(y)
      }
      for (let y = lastDay2; y < 6; y += 1) {
        arrDate.push(0)
      }
      const arrWeek = []
      let k = 0
      for (let y = 0; y < arrDate.length; y += 1) {
        if (!Array.isArray(arrWeek[k])) {
          arrWeek[k] = []
        }
        arrWeek[k].push(arrDate[y])
        if (arrWeek[k].length >= 7) {
          k += 1
        }
      }
      this.calInfo.push({ month: key, week: arrWeek })
      setTimeout(() => {
        if (this.deptDate) {
          const tag = this.deptDate.replace(/-/g, '').substr(0, 6)
          const offsetTop = window.document.getElementsByClassName(tag)[0].offsetTop
          this.scrollTo(window.document.getElementById('cwcalendar_view'), offsetTop, 150)
        }
      }, 160)
    }
  },
  computed: {
    isToday () {
      const tomorrow = new Date(this.todayString)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return this.deptDate === this.todayString && this.retnDate === this.format.getToday(tomorrow)
    }
  },
  methods: {
    today () {
      let tomorrow = new Date(this.todayString)
      tomorrow.setDate(tomorrow.getDate() + 1)
      this.deptDate = this.todayString
      this.retnDate = this.format.getToday(tomorrow)
      this.deptFlag = true
    },
    changeDate () {
      if (!this.deptDate) {
        window.EventBus.$emit('popAlert', 'alert', '체크인 날짜를 입력해주세요.')
      } else if (!this.retnDate) {
        window.EventBus.$emit('popAlert', 'alert', '체크아웃 날짜를 입력해주세요.')
      } else {
        this.$emit('change-date', this.deptDate, this.retnDate)
      }
    },
    clickDate (date) {
      const strDate = `${date.substr(0, 4)}-${date.substr(4, 2)}-${date.substr(6, 2)}`
      if (parseInt(date) < this.todayStr) {
        return
      }
      if (this.deptFlag) {
        this.deptDate = strDate
        this.retnDate = ''
        this.deptFlag = false
      } else {
        if (parseInt(date) < parseInt(this.deptDate.replace(/-/g, ''), 10)) {
          this.deptDate = strDate
        } else if (parseInt(date) !== parseInt(this.deptDate.replace(/-/g, ''), 10)) {
          this.retnDate = strDate
          this.deptFlag = true
        }
      }
    },
    getDayWeek (date) {
      const newDate = new Date(date)
      return `${this.week[newDate.getDay()]}요일`
    },
    chkDate (date, day) {
      const arr = []
      const numDept = this.deptDate.replace(/-/g, '')
      const numRetn = this.retnDate.replace(/-/g, '')
      if (day === 0) {
        arr.push('disabled')
      } else if (parseInt(date, 10) < this.todayStr) {
        arr.push('cwdate_block')
        arr.push('disabled')
      } else {
        arr.push('cwdate_block')
        if (numDept &&
        date === numDept) {
          arr.push('start')
        } else if (numRetn &&
        date === numRetn) {
          arr.push('end')
        } else if (numDept &&
          numRetn &&
        parseInt(numDept, 10) < parseInt(date, 10) &&
        parseInt(numRetn, 10) > parseInt(date, 10)) {
          arr.push('range')
        }
      }
      if (this.generalHoliday.indexOf(date.substr(4, 8)) >= 0 || this.holiday.indexOf(date) >= 0) {
        arr.push('holiday')
      }
      if (date === this.todayStr.toString()) {
        arr.push('today')
      }
      return arr
    },
    scrollTo (element, to, duration) {
      const start = element.scrollTop
      const change = to - start
      const increment = 20
      let currentTime = 0

      const animateScroll = () => {
        currentTime += increment
        var val = this.easeInOutQuad(currentTime, start, change, duration)
        element.scrollTop = val
        if (currentTime < duration) {
          setTimeout(animateScroll, increment)
        }
      }
      animateScroll()
    },
    easeInOutQuad (t, b, c, d) {
      t /= d / 2
      if (t < 1) return c / 2 * t * t + b
      t--
      return -c / 2 * (t * (t - 2) - 1) + b
    }
  }
}
</script>

<style scoped>
  .cwCalendar *{
    user-select: none;
  }
  #cwd_select{
    height: 74px;
    background-color: #b18e79;
  }
  #cwd_select > div{
    float: left;
    width: 50%;
    height: 74px;
    text-align: center;
    cursor: pointer;
  }
  #cwd_select > div.selected{
    /* box-shadow: 0 0 0 1px inset #262626; */
  }
  #cwd_select > div > div{
    color: #FFF;
  }
  #cwd_select > div > div:first-child{
    opacity: .7;
    font-size: 12px;
    margin-top: 16px;
    line-height: 15px;
  }
  #cwd_select > div > div:last-of-type {
    font-size: 24px;
    line-height: 24px;
  }
  #cwday_bar{
    display: flex;
    padding: 0 8px;
    border-bottom: 1px solid #ddd;
    width: 100%;
    box-shadow: 0 0 1px 0 rgba(0,0,0,.15);
  }
  .cwday_bar_block{
    -webkit-box-flex: 1 0 44px;
    -webkit-flex: 1 0 44px;
    flex: 1 0 44px;
    height: 44px;
    width: 44px;
    margin: 2px 0;
    position: relative;
    max-width: inherit;
    text-align: center;
    line-height: 44px;
    font-size: 12px;
    font-weight: 500;
  }
  .cwday_bar_block:first-child{
    color: #FF382D;
  }
  .cwday_bar_block:last-of-type{
    color: #0090FF;
  }
  #cwcalendar_view{
    position: absolute;
    top: 123px;
    bottom: 74px;
    left: 0;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }
  #cwcalendar_view > div{
    margin-bottom: 8px;
  }
  .cwmonth_block{
    color: #111111;
    font-size: 20px;
    font-weight: 500;
    line-height: 40px;
    text-align: center;
    padding: 16px 0 4px;
  }
  .cwmonth_week{
    display: flex;
    padding: 0 8px;
  }
  .cwmonth_week > a{
    -webkit-box-flex: 1 0 44px;
    -webkit-flex: 1 0 44px;
    flex: 1 0 44px;
    height: 44px;
    width: 44px;
    margin: 4px 0;
    position: relative;
    cursor: pointer;
    max-width: inherit;
    text-align: center;
    line-height: 44px;
    font-size: 16px;
    font-weight: 500;
    transition: .5s ease;
    color: #333;
    text-decoration: none;
  }
  .cwmonth_week > a > div{
    transition: background-color .5s ease;
  }
  .cwmonth_week > a.disabled{
    cursor: default;
    opacity: .5;
  }
  .cwmonth_week > a.cwdate_block{

  }
  .cwmonth_week > a.cwdate_block:first-of-type{
    border-top-left-radius: 22px;
    border-bottom-left-radius: 22px;
  }
  .cwmonth_week > a:first-child > div{
    color: #FF382D;
  }
  .cwmonth_week > a.cwdate_block:last-of-type{
    border-top-right-radius: 22px;
    border-bottom-right-radius: 22px;
  }
  .cwmonth_week > a:last-of-type > div{
    color: #0090FF;
  }
  .cwmonth_week > a.holiday > div{
    color: #FF382D;
  }
  .cwmonth_week > a.today > div:first-of-type{
    color: #FFF;
    position: relative;
    z-index: 2;
  }
  .cwmonth_week > a.today > div:last-of-type:after{
    width: 44px;
    height: 44px;
    background-color: #1A1A1C;
    border-radius: 22px;
    content: '';
    line-height: 44px;
    position: absolute;
    left: 0;
    top: 0;
    margin-left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
  .cwmonth_week > a.start, .cwmonth_week > a.end{
    background-color: #e1bda7;
  }
  .cwmonth_week > a.start:before{
    position: absolute;
    content: '';
    background-color: #FFF;
    left: 0;
    top: 0;
    height: 100%;
    width: 50%;
    z-index: 0;
  }
  .cwmonth_week > a:last-of-type.start:after{
    position: absolute;
    content: '';
    background-color: #FFF;
    right: 0;
    top: 0;
    height: 100%;
    width: 50%;
    z-index: 0;
  }
  .cwmonth_week > a.end:after{
    position: absolute;
    content: '';
    background-color: #FFF;
    right: 0;
    top: 0;
    height: 100%;
    width: 50%;
    z-index: 0;
  }
  .cwmonth_week > a.start > div:last-of-type:after, .cwmonth_week > a.end > div:last-of-type:after{
    width: 44px;
    height: 44px;
    background-color: #b18e79;
    border-radius: 22px;
    content: '';
    line-height: 44px;
    position: absolute;
    left: 0;
    top: 0;
    margin-left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }
  .cwmonth_week > a.range{
    background-color: #e1bda7;
  }
  .cwmonth_week > a.range > div:first-child, .cwmonth_week > a.start > div:first-child, .cwmonth_week > a.end > div:first-child{
    color: #FFF;
    position: relative;
    z-index: 2;
  }
  .calBottom{
    width: 100%;
    left: 0;
    bottom: 0;
    height: 74px;
    position: absolute;
    padding: 9px 10px 10px;
    border-top: 1px solid #dddddd;
    font-size: 0;
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
    padding-left: 10px;
    width: 60%;
  }
  .calBottom > div > button{
    width: 100%;
    height: 100%;
  }
  .calBottom > div:first-child button{
    background-color: #ffffff;
    border: solid 1px #dddddd;
    font-size: 15px;
    padding: 17px 0;
    line-height: 18px;
    color: #999;
  }
  .calBottom > div:first-child button > div{
    width: 18px;
    height: 18px;
    border: solid 1px #bbbbbb;
    border-radius: 100%;
    left: 24px;
    position: relative;
    margin-right: 0;
    float: left;
  }
  .calBottom > div:first-child button.checked > div{
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
</style>
