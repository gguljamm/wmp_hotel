import axios from 'axios'

require('es6-promise').polyfill()

const isDev = location.host !== 'mhotel.wonders.app'
const apiServerProtocol = 'https://'
const apiServerHost = isDev ? 'api-hotel.dev.wonders.app/v1' : 'frontapi-hotel.wonders.app/v1'

const CancelToken = axios.CancelToken
let cancel // hotelList 중복검색 취소처리
let aCancel // autocomplete 중복검색 취소처리
let dCancel // hotelDetail 중복검색 취소처리

function autocomplete (value) {
  const path = '/autocomplete'
  if (aCancel) {
    aCancel()
  }
  return axios.get(
    `${apiServerProtocol}${apiServerHost}${path}`, {
      params: {
        text: value
      },
      cancelToken: new CancelToken(function executor (c) {
        aCancel = c
      })
    }
  )
}

function hotelList (obj) {
  let path = '/hotels'
  if (cancel) {
    cancel()
  }
  return axios.get(
    `${apiServerProtocol}${apiServerHost}${path}`, {
      params: obj,
      cancelToken: new CancelToken(function executor (c) {
        cancel = c
      })
    }
  )
}

function hotelDetail (key, obj) {
  let path = `/hotels/${key}`
  if (dCancel) {
    dCancel()
  }
  return axios.get(
    `${apiServerProtocol}${apiServerHost}${path}`, {
      params: obj,
      cancelToken: new CancelToken(function executor (c) {
        dCancel = c
      })
    })
}

function nearPlace (obj) {
  const path = '/nearby_tourist_attraction'
  return axios.get(
    `${apiServerProtocol}${apiServerHost}${path}`, {
      params: obj
    }
  )
}

function sendLog (mid, obj) {
  const uri = `${apiServerProtocol}${apiServerHost}/users/${mid}/hotels`
  return axios.post(
    uri, obj
  )
}

function getWishHotel (mid) {
  const path = `/wish-hotels/${mid}`
  return axios.get(`${apiServerProtocol}${apiServerHost}${path}`)
}

function addWishHotel (mid, hotelInfo) {
  const path = `/wish-hotels/${mid}`
  return axios.post(
    `${apiServerProtocol}${apiServerHost}${path}`, hotelInfo
  )
}

function delWishHotel (mid, id) {
  const path = `/wish-hotels/${mid}/${id}`
  return axios.delete(`${apiServerProtocol}${apiServerHost}${path}`)
}

const loginServerHost = isDev ? 'login.pre.wonders.app' : 'login.wonders.app'
const defaultRedirectUri = isDev ? `${window.location.origin}/auth` : `https://${window.location.host}/auth`
const clientId = isDev ? 'wonderhotel_gdfrF_vVTh' : 'wonderhotel_zSgWkCg_Zu'
const state = 'wmphotel'
const wmpLoginUri = isDev ? 'https://login.pre.wid.wemakeprice.com' : 'https://login.wid.wemakeprice.com'

function wmpLoginUrl () {
  const uri = `${wmpLoginUri}/loginCheck?redirect_uri=${defaultRedirectUri}`
  return uri
}

function refreshToken (obj) {
  return axios.post(
    `${apiServerProtocol}${loginServerHost}/wauth/token`, {
      params: obj
    }
  )
}

function isLoginCheckServer (resp) {
  const redirectUri = resp || defaultRedirectUri
  return `${apiServerProtocol}${loginServerHost}/wauth/authorize?response_type=code&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}`
}

function isLoginCheck (resp) {
  const redirectUri = resp || defaultRedirectUri
  return `${apiServerProtocol}${loginServerHost}/wauth/authorize?response_type=token&client_id=${clientId}&state=${state}&redirect_uri=${redirectUri}`
}

function mypageUrl () {
  const mypage = isDev ? 'http://www-stg.wonder-shopping.com/mypage/reservation/' : 'https://www.wonder-shopping.com/mypage/reservation/'
  return `${mypage}?svc=hotel`
}

function getUserInfo (obj) {
  const domain = `${apiServerProtocol}${loginServerHost}`
  return axios.get(
    `${domain}/wauth/me`, {
      headers: {
        Authorization: `Bearer ${obj.access_token}`
      }
    }
  )
}

function airRsvChk (mid) {
  const domain = isDev ? 'https://frontapi-air.dev.wonders.app/air/AirMyRsvChk' : 'https://frontapi-air.wonders.app/air/AirMyRsvChk'
  return axios.get(domain, {
    params: {
      mid: mid,
      gbn: '',
      startDate: '',
      endDate: '',
      rsvStatus: ''
    }
  })
}

/* eslint-disable */
function kakaoShare (obj) {
  if (!Kakao.Link) {
    Kakao.init('d17e8661e7a6e15033c1d2a896a924fb');
  }
  Kakao.Link.sendDefault({
    objectType: 'feed',
    content: {
      title: obj.title,
      description: obj.description,
      imageUrl: obj.imageUrl,
      link: {
        mobileWebUrl: obj.url
      },
    },
    success: function(messageObj) {
      console.log(messageObj);
    },
  });
}
/* eslint-enable */

export default {
  autocomplete,
  hotelList,
  hotelDetail,
  nearPlace,
  isLoginCheck,
  isLoginCheckServer,
  getUserInfo,
  sendLog,
  kakaoShare,
  airRsvChk,
  wmpLoginUrl,
  mypageUrl,
  refreshToken,
  getWishHotel,
  addWishHotel,
  delWishHotel
}
