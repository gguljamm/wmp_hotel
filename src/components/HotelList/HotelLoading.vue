<template>
  <div class="skeleton">
    <div>
      <div class="colorLoader"></div>
      <div></div>
      <div></div>
      <div>
        <div class="hotelInfo">
          <div>
            <div>...</div>
            <div>...</div>
            <div>
              <span class="star" v-for="x in 5" :key="x"></span>
              <span>...</span>
              <span class="thin"> (...개 리뷰)</span>
            </div>
          </div>
        </div>
        <div class="agentList">
          <ul>
            <li
              v-for="(x, index) in 2"
              :key="index"
            ><button>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </button></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>
  .skeleton{
    background-size: cover;
    position: fixed;
    top: 118px;
    left: 0;
    right: 0;
    bottom: 48px;
    z-index: 10;
    transition: .3s ease;
  }
  .topOut .skeleton{
    top: 70px;
  }
  .scrollDown .skeleton{
    bottom: 0;
  }
  .skeleton > div{
    width: 100%;
    height: 100%;
    max-width: 700px;
    margin: 0 auto;
    position: relative;
    background-color: #9c7d6b;
  }
  .skeleton > div > div:nth-of-type(2){
    padding-bottom: 100%;
    width: 100%;
    position: relative;
  }
  .skeleton > div > div:nth-of-type(2):before{
    content: '';
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    height: 10px;
    opacity: .25;
    background-image: linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0,0,0,.6));
    z-index: 5;
    transition: .3s ease;
    pointer-events: none;
  }
  .skeleton > div > div:nth-of-type(2):after{
    content: '';
    height: 250px;
    background-image: linear-gradient(to bottom, rgba(132, 107, 85, 0), #9c7d6b 99%);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    display: none;
  }
  .skeleton > div > div:nth-of-type(3) {
    width: 172px;
    height: 375px;
    background-image: linear-gradient(to left, transparent, #e3e3e3 48%, transparent);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    display: none;
  }
  .skeleton > div > div:nth-of-type(4) {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
  }
  .hotelInfo{
    height: 60%;
    position: relative;
  }
  .hotelInfo > div{
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
  }
  .hotelInfo > *{
    color: #FFF;
  }
  .hotelInfo button.openDetail{
    width: 63px;
    height: 25px;
    background-color: rgba(216, 216, 216, 0.3);
    border: solid 1px rgba(255, 255, 255, 0.5);
    font-size: 12px;
    padding: 0;
  }
  .hotelInfo > div > div:first-of-type {
    font-size: 20px;
    font-weight: 600;
  }
  .hotelInfo > div > div:nth-of-type(2){
    font-size: 12px;
    letter-spacing: -.3px;
    margin-top: 4px;
    line-height: 17px;
    font-weight: 400;
  }
  .hotelInfo > div > div:nth-of-type(3){
    margin-top: 7px;
    font-size: 12px;
    letter-spacing: -.3px;
  }
  .hotelInfo > div > div:nth-of-type(2):before{
    width: 13px;
    height: 15px;
    float: left;
    content: '';
    margin-right: 5px;
    background: url(../../assets/location.svg) no-repeat;
  }
  .hotelInfo .star{
    margin-top: 2px;
    margin-right: 6px;
    float: left;
    width: 11px;
    height: 11px;
    background: url(../../assets/star.svg) no-repeat;
    background-size: cover;
  }
  .hotelInfo .star:last-of-type{
    margin-right: 0;
  }
  .hotelInfo .thin{
    font-weight: 400;
  }
  .agentList{
    padding: 16px 20px 82px;
  }
  .agentList > ul > li > button{
    background-color: #fff;
    width: 100%;
    height: 74px;
    border-radius: 3px;
    margin-bottom: 4px;
    border: 0;
    position: relative;
    text-align: left;
    padding: 12px 20px;
    font-weight: normal;
  }
  .agentList > ul > li:last-of-type > button{
    margin-bottom: 0;
  }
  .agentList > ul > li > button > div{
    overflow: hidden;
  }
  .agentList > ul > li > button > div:first-of-type{
    width: 160px;
    height: 12px;
    background-color: #f1f1f1;
  }
  .agentList > ul > li > button > div:nth-of-type(2), .agentList > ul > li > button > div:nth-of-type(3){
    width: 100px;
    height: 12px;
    background-color: #f1f1f1;
    margin-top: 8px;
  }
  .agentList > ul > li > button > div:nth-of-type(4){
    width: 87px;
    height: 56px;
    float: right;
    position: absolute;
    right: 20px;
    top: 12px;
    background-color: #f1f1f1;
  }
  .agentList > ul > li > button > div:before{
    width: 40px;
    height: 100%;
    background-image: linear-gradient(to left, #f1f1f1, #e3e3e3 48%, #f1f1f1);
    content: '';
    display: block;
    animation: moveleft 1s infinite linear;
  }
  @keyframes moveleft {
    from {
      margin-left: -12px;
    }
    to {
      margin-left: 100%;
    }
  }
</style>
