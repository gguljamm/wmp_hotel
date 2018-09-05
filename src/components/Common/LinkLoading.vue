<template>
  <div>
    <div class="linkLoadingWrapper">
      <div class="logo" :class="params.agent"></div>
      <div class="loader">
        <div><div></div></div>
        <div :style="{backgroundImage: `url(${params.imageUrl})`}"></div>
      </div>
      <div>{{ params.hotelName }}</div>
      <div>{{ params.roomName }}</div>
      <div>{{ params.description }}</div>
      <div>
        <div>예약사이트 가격은 1박 기준으로 보여질 수 있습니다.</div>
        객실 및 가격 정보는 예약현황, 환율 등에 따라 실시간 변동되므로,<br>
        원더호텔 검색 결과와 예약사이트 내의 정보에 차이가 있을 수 있습니다.<br>
        원더투어는 통신판매의 당사자가 아니며 호텔 검색 결과, 구매 및 환불 등과 관련한 의무와 책임은 각 판매자에게 있습니다.<br>
        예약 전 예약 사이트의 규정 및 약관을 반드시 확인하시기 바랍니다.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      params: this.$route.params,
      timeout: null,
      loadingDelay: 2000
    }
  },
  created () {
    document.getElementById('beforeLoading').style.display = 'none'
    document.getElementById('beforeLoading2').style.display = 'none'
  },
  mounted () {
    // console.log(this.$route.params)
    // let url = this.$route.params.linkUrl
    // const pUserAgentString = navigator.userAgent
    // const lUaMatches = pUserAgentString.match(/(.*?)\/(.*?)\s\((.*?)\)(.*)/i)
    // if (lUaMatches) {
    //   const key = lUaMatches[4]
    //   if (key.match(/wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 위메프 앱
    //     const obj = {
    //       name: '원더호텔',
    //       value: this.$route.params.linkUrl,
    //       type: 22
    //     }
    //     url = `wemakeprice://doEvent?wemakeprice_json_action=${encodeURIComponent(JSON.stringify(obj))}`
    //   } else if (key.match(/wshop\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i)) { // 원더쇼핑 앱
    //     const obj = {
    //       image: '',
    //       message: '',
    //       title: '원더호텔',
    //       type: 'externallink',
    //       url: this.$route.params.linkUrl
    //     }
    //     url = `wshop://webview?cmd_id=1&json=${encodeURIComponent(JSON.stringify(obj))}`
    //   }
    // }
    this.timeout = setTimeout(() => {
      this.timeout = null
      window.location.replace(this.$route.params.linkUrl)
    }, this.loadingDelay)
  },
  destroyed () {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
}
</script>

<style>
  @import url(//fonts.googleapis.com/earlyaccess/notosanskr.css);
  .linkLoadingWrapper *{
    box-sizing: border-box;
    color: #333;
    font-family: 'Noto Sans KR', sans-serif;
  }
  .linkLoadingWrapper{
    position: absolute;
    bottom: 0;
    top: 0;
    left: 0;
    right: 0;
    background-color: #fbfbfb;
    text-align: center;
  }
  .linkLoadingWrapper .logo{
    margin: 56px auto 37px;
    height: 30px;
    background-size: contain;
    background-repeat: no-repeat;
    width: 90px;
    background-position: center center;
  }
  .linkLoadingWrapper .logo.agoda{
    background-image: url(../../assets/vendor_agoda.svg)
  }
  .linkLoadingWrapper .logo.booking{
    background-image: url(../../assets/vendor_booking.png)
  }
  .linkLoadingWrapper .logo.expedia{
    background-image: url(../../assets/vendor_expedia.svg)
  }
  .loader{
    position: relative;
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }
  .loader > div:first-of-type{
    width: 150px;
    height: 150px;
    border-radius: 100%;
    position: relative;
    background-image: linear-gradient(to bottom, rgba(177, 142, 121, 0), rgba(177, 142, 121, 1));
    animation: loader 1s infinite linear;
  }
  .loader > div:first-of-type:before{
    width: 75px;
    height: 150px;
    background-color: #fbfbfb;
    content: '';
    position: absolute;
    left: 0;
    top: 0;
  }
  .loader > div:first-of-type:after{
    width: 6px;
    height: 6px;
    background-color: rgb(177, 142, 121);
    position: absolute;
    content: '';
    left: 50%;
    margin-left: -3px;
    bottom: 0;
    border-radius: 100%;
  }
  .loader > div:nth-of-type(2) {
    width: 140px;
    height: 140px;
    border-radius: 100%;
    background-size: cover;
    background-position: center center;
    position: absolute;
    left: 50%;
    top: 5px;
    margin-left: -70px;
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .linkLoadingWrapper > div:nth-of-type(3){
    font-size: 22px;
    font-weight: 500;
    margin-top: 28px;
  }
  .linkLoadingWrapper > div:nth-of-type(4){
    font-size: 18px;
    margin-top: 4px;
  }
  .linkLoadingWrapper > div:nth-of-type(5){
    font-size: 12px;
    color: #666;
    margin-top: 12px;
  }
  .linkLoadingWrapper > div:nth-of-type(6){
    color: #999;
    font-size: 10px;
    margin-top: 36px;
    padding: 36px 40px 0;
    border-top: 1px solid #ebebeb;
  }
  .linkLoadingWrapper > div:nth-of-type(6) > div{
    font-size: 12px;
    color: #666;
    padding-bottom: 12px;
  }
  .hotelIframe{
    position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;
    background-color: #FFF;
    opacity: 0;
    pointer-events: none;
  }
  .hotelIframe.show{
    opacity: 1;
    pointer-events: all;
  }
</style>
