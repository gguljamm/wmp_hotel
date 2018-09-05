<template>
  <div id="wrapper">
    <div class="header">
      <h1 class="title">안타깝네요!</h1>
      <a href="/?cmd=close" class="btn-close" id="uid_close_btn">
        닫기
      </a>
    </div>
    <div class="container">
      <div class="content">
        <strong>안타깝네요!</strong>
        <p class="message">
          해당 브라우저/폰의 버전이 낮아 서비스를 이용할 수 없습니다.<br>
          PC환경을 준비하고 있으며,<br>그 전까지는 왼도우PC의 특정 브라우저(IE, Safari)에서는<br>사용이 불가능 합니다.<br>
          원더호텔을 이용해 주셔서 감사합니다.
        </p>
        <p class="device" id="uid_device"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted () {
    document.addEventListener('DOMContentLoaded', () => {
      // debugger
      console.log('DOMContentLoaded :', navigator.userAgent)
    })
    window.addEventListener('load', () => {
      // debugger
      // console.log('load :', navigator.userAgent);
      const lUA = navigator.userAgent
      document.querySelector('#uid_device').innerHTML = lUA
      if (lUA.indexOf('wmpapps') > -1) {
        document.querySelector('#uid_close_btn').style.display = 'block'
      }
    })
  }
}
</script>

<style scoped>
  a {
    color:#000;
    cursor:pointer;
    text-decoration:none;
    -webkit-user-select:none;
  }
  .header {
    min-height:57px;
    transition:all 0.3s ease;
    z-index:1000;
    position:fixed;
    top:0;
    left: 0;
    width:100%;
    background:#1a1a1c;
  }
  .header .title {
    color:#fff;
    font-weight:500;
    font-size:20px;
    line-height:57px;
    text-align:center;
    margin: 0;
  }

  .header .btn-close {
    position:absolute;
    display:none;
    right:0;
    top:0;
    color:#fff;
    width:57px;
    height:57px;
    font-size:16px;
    line-height:57px;
    text-align:center;
    padding:0;
    border:0;
    background:none;
  }
  .container {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    color: #535353;
    text-align: center;
    display:table;
  }
  .container .content {
    display:table-cell;
    vertical-align:middle;
  }
  .container strong {
    display:block;
    padding:83px 0 0;
    font-size:17px;
    color:#000;
    font-weight:500;
    background: url('../../assets/ico_not_support_device.png') no-repeat 50% 0;
    background-size:128px auto;
  }
  .container .message {
    margin: 13px 0 0;
    color: #a3a3a3;
    font-size: 14px;
  }
  .container .message:first-child {
    margin-top:0;
  }
  .container .device {
    margin:7px 10px 0;
    font-size:11px;
    line-height:14px;
    text-align:center;
    color:#a3a3a3;
  }
</style>
