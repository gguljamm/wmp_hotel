<template>
  <div class="loginWrapper">
    <div><button @click="historyBack"></button>원더호텔</div>
    <iframe id="hms-login" v-if="mypageUrl" :src="mypageUrl" class="iframe" :style="{height: `${clientHeight}px`}"></iframe>
  </div>
</template>

<script>
import Api from '../../api/api'
export default {
  data () {
    // let url = decodeURIComponent(this.$route.params.redirect)
    // url = url.replace('://', '%3A%2F%2F')
    // url = url.replace('')
    // console.log(url)
    return {
      mypageUrl: Api.isLoginCheck(encodeURIComponent(this.$route.params.redirect) || ''),
      isLogin: false
    }
  },
  computed: {
    clientHeight () {
      return window.innerHeight - 48
    }
  },
  methods: {
    historyBack () {
      window.history.back()
    }
  },
  created () {
    document.getElementById('beforeLoading').style.display = 'none'
    document.getElementById('beforeLoading2').style.display = 'none'
  }
}
</script>

<style scoped>
  .loginWrapper > div{
    height: 48px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    text-align: center;
    background-color: #1a1a1c;
    color: #FFF;
    line-height: 48px;
  }
  .iframe{
    position: absolute;
    left: 0;
    top: 48px;
    border: 0;
    padding: 0;
    margin: 0;
    height: 0;
    width: 100%;
  }
  .loginWrapper > div > button{
    background-color: transparent;
    border: 0;
    padding: 0;
    background-repeat: no-repeat;
    background-position: center center;
    position: absolute;
    top: 0;
    width: 48px;
    height: 48px;
    cursor: pointer;
    left: 8px;
    background-image: url(../../assets/clamp_white.svg);
  }
</style>
