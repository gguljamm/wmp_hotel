/* eslint-disable */
const Cookie = require('cookie')

class DeviceInfo {
  constructor(expressReq) {
    this.expressReq = expressReq;
  }

  get osName() {
    return this.os ? this.os.name : null;
  }

  get osVersion() {
    return this.os ? this.os.version : null;
  }

  get windowType() {
    return this.window ? this.window.type : null;
  }

  get windowVersion() {
    return this.window ? this.window.version : 0;
  }

  get uuid() {
    if (this._uuid) return this._uuid;
    if(this.expressReq.header('endpoint')) { // 네이티브에서 전달한 고유한 device uuid가 있는 경우
      this._uuid = this.expressReq.header('endpoint');
    } else {
      if (this.cookies && this.cookies.deviceId) {
        this._uuid = this.cookies.deviceId;
      } else {
        this._uuid = require('uuid/v4')();
      }
    }
    return this._uuid
  }

  get pcstamp () {
    if (this._pcstamp) return this._pcstamp;
    if (this.cookies && this.cookies.pcstamp) {
      this._pcstamp = this.cookies.pcstamp;
    } else {
      this._pcstamp =  this.genPcstamp;
    }
    return this._pcstamp
  }

  get genPcstamp () {
    const ts = new Date().getTime();
    const chars = [];
    for(let i = 0; i <= 14; i++) chars.push(Math.random().toString(36).substr(-1));
    return `${(ts / 1000).toString()}.${chars.join('')}`;
  }

  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent
  get ua() {
    if(this._ua) return this._ua;

    const uaMatches = this.expressReq.header('user-agent').match(/(.*?)\/(.*?)\s\((.*?)\)(.*)/i);
    if(uaMatches) {
      this._ua = {
        systemInfo: uaMatches[3],
        extras: uaMatches[4]
      };
    } else {
      this._ua = {systemInfo: '', extras: ''};
    }

    return this._ua;
  }

  get _osPatterns() {
    return {
      IOS: [
        /iPhone\sOS\s([0-9]+)_([0-9]+)_?([0-9]+)?/i,
        /iPad;\sCPU\sOS\s([0-9]+)_([0-9]+)_?([0-9]+)?/i
      ],
      AOS: [
        /Android\s([0-9]+)\.([0-9]+)\.?([0-9]+)?/i
      ]
    };
  }

  get os() {
    if(this._os) return this._os;
    for(const name of Object.keys(this._osPatterns)) {
      for(const pattern of this._osPatterns[name]) {
        const matches = this.ua.systemInfo.match(pattern);
        if(matches) {
          return this._os = {name, version: matches.slice(1, 4).filter((v) => v).join('.')};
        }
      }
    }

    return this._os = null;
  }

  get _windowPatterns() {
    return {
      WMP: [
        /wmpapps\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i
      ],
      WSP: [
        /wshop\/([0-9]+)\.([0-9]+)\.?([0-9]+)?/i
      ]
    };
  }

  get window () {
    if(this._window) return this._window;

    for(const type of Object.keys(this._windowPatterns)) {
      for(const pattern of this._windowPatterns[type]) {
        const matches = this.ua.extras.match(pattern);
        if(matches) {
          return this._window = {type, version: matches.slice(1, 4).filter((v) => v).join('.')};
        }
      }
    }

    return this._window = null;
  }

  get cookies () { // cookie parser
    return Cookie.parse(this.expressReq.headers.cookie || '')
  }

  get headerXWDevice () {
    return `o=${this.osName};v=${this.osVersion};u=${this.uuid};wt=${this.windowType || 'ETC'}`
  }

  isAbleDevice () {
    if (this.osName === 'ANDROID') {
      if (this.osVersion && this.convertOsVersion(this.osVersion) < this.convertOsVersion('4.1')) {
        return false
      }
    } else if (this.osName === 'IOS'){
      if (this.osVersion && this.convertOsVersion(this.osVersion) < this.convertOsVersion('9.3.5')) {
        return false
      }
    }
    return true
  }

  convertOsVersion (osVersion) {
    if (!osVersion) {
      return osVersion
    }
    let inVersionArray = osVersion.split('.') || [osVersion]
    let inMajor = Number(inVersionArray[0])
    let inSub = []
    if(inVersionArray.length > 1){
      inSub = '0.' + (inVersionArray.splice(1, inVersionArray.length - 1)).join().replace(/,/gi,'')
    }
    // console.log(inVersionArray, inSub)
    return inMajor + (Number(inSub))
  }
}
/* eslint-enable */
export default{
  DeviceInfo
}
