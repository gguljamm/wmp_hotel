<template>
  <div>
    <Header></Header>
    <div class="errorMessage">
      페이지가 존재하지 않습니다.
    </div>
    <Navigator></Navigator>
  </div>
</template>

<script>
import Api from '../../api/api'
import Header from './Header'
import Navigator from './Navigator'
export default {
  components: {
    Header,
    Navigator
  },
  mounted () {
    // Api.getUserInfo(obj).then((resp) => {
    //   window.parent.bpVue.$children[0].$children[0]._data.mid = resp.data.mid
    //   Api.airRsvChk(resp.data.mid).then((resp) => {
    //     window.parent.bpVue.$children[0].$children[0]._data.isAirRsv = resp.data.rsvFlag
    //   }).catch(() => {
    //     console.log('항공예약 유무 체크 api 실패')
    //   })
    // }).catch(() => {
    //   console.log('getUserInfo api 실패')
    // })
  },
  created () {
    if (window.location.search.indexOf('is_login=true') >= 0) {
      window.location = Api.isLoginCheck()
      return
    } else if (window.location.search.indexOf('is_login=false') >= 0) {
      if (window.parent.location.hash.indexOf('access_token') >= 0) {
        window.location = Api.isLoginCheck()
      }
      return
    }
    const arrPath = window.location.hash.replace('#', '').split('&')
    const obj = {}
    for (let x = 0; x < arrPath.length; x += 1) {
      obj[arrPath[x].split('=')[0]] = arrPath[x].split('=')[1]
    }
    window.parent.bpVue.$children[0].$children[0]._data.mid = obj.access_token
    setTimeout(() => {
      location.href = Api.isLoginCheck()
    }, obj.expires_in * 1000)
  }
}
</script>

<style scoped>
  .errorMessage{
    padding: 128px 0;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }
</style>
