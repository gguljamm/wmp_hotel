<template>

    <div class="test-1" style="margin-top:-20px;">
    </div>

</template>

<script>
export default {
  /* eslint-disable */
  created() {
    var pData = {
      namespace: '__wshopping_injection_footer',
      injectionParentSelector: '.test-1', // 삽입 시킬 부모의 셀렉터(아이디, 클래스, 태그), 프로퍼티가 없다면 body 태그의 마지막 자식으로 삽입
      // 옵션 값
      options: {
        /**
         * #### 옵션 ####
         *
         * @ autoAttach
         *  - 스크립트 실행과 동시에 제공되는 html 을 바로 삽입시킬지에 대한 flag 입니다.
         *  - true(기본값) : footer 관련 js, css가 로딩이 완료되면 바로 삽입시킵니다.
         *  - false : 바로 삽입시키지 않습니다.
         *
         * @ beforeClickLink(<Object> pCallbackObject, <String> pLink)
         *  - 링크 클릭 전 실행될 콜백 메소드 입니다.
         *  - pCancelObject
         *    --> 메뉴 클릭으로 링크이동 취소 여부를 결정하는 Object 입니다.
         *    true : 취소, false: 취소 안함(기본값)
         *  - pLink
         *    --> 이동할 링크 정보
         *
         * @ attachBefore(<Object> pCallbackObject)
         *  - 삽입 전 실행될 콜백 메소드 입니다.
         *  - pCancelObject
         *    --> 삽입 취소 여부를 결정하는 Object 입니다.
         *    true : 취소, false: 취소 안함(기본값)
         * @ attachAfter()
         *  - 삽입 완료 후 실행 콜백
         *
         * @ detachBefore(<Object> pCallbackObject)
         *  - 제거 전 실행될 콜백 메소드 입니다.
         *  - pCancelObject
         *    --> 제거 취소 여부를 결정하는 Object 입니다.
         *    true : 취소, false: 취소 안함(기본값)
         * @ detachAfter()
         *  - 제거 완료 후 실행 콜백
         *
         **/
        autoAttach: true,
        beforeClickLink: function(pCancelObject, pLink){
          // pCancelObject.isCancel = false;
          // console.log(pCancelObject, pLink);
        },
        attachBefore: function(pCancelObject){
          // pCancelObject.isCancel = false;
          // console.log('attachBefore');
        },
        attachAfter: function() {
          // console.log('attachAfter');
        },
        detachBefore: function(pCancelObject){
          // pCancelObject.isCancel = false;
          // console.log('detachBefore');
        },
        detachAfter: function() {
          // console.log('detachAfter');
        }
      }
    }
    var lScriptId = '__ws_injection_footer_script';
    if (document.getElementById(lScriptId)) {
      return false;
    }
    var lScriptUri = 'https://m.wonder-shopping.com/injection_footer/injection_footer.js'; // script uri
    pData.namespace = pData.namespace || '__wshopping_injection_footer'
    window[pData.namespace] = window[pData.namespace] || {};
    var lNameSpace = window[pData.namespace];
    var $script = document.createElement('script');
    var $firstScript = document.getElementsByTagName('script')[0];
    $script.async = 1;
    $script.src = lScriptUri;
    $script.setAttribute('id', lScriptId);
    $script.setAttribute('data-name-space', pData.namespace);
    if (pData.injectionParentSelector) {
      $script.setAttribute('data-injection-parent-selector', pData.injectionParentSelector);
    }
    $firstScript.parentNode.insertBefore($script, $firstScript);
    lNameSpace.__options = {};
    if (pData.options) {
      for(var key in pData.options) {
        lNameSpace.__options[key] = pData.options[key];
      }
    }
  },
  destroyed () {
    const arrStyle = document.querySelectorAll('style,[rel="stylesheet"],[type="text/css"]')
    var lScriptId = '__ws_injection_footer_script';
    document.getElementById('__ws_injection_footer_wrapper') ? document.getElementById('__ws_injection_footer_wrapper').remove() : ''
    if (document.getElementById(lScriptId)) {
      document.getElementById(lScriptId).remove()
      for (var x = arrStyle.length - 1; x >= 0; x -= 1) {
        if (arrStyle[x].href === 'https://m.wonder-shopping.com/injection_footer/injection_footer.css') {
          console.log('remove')
          arrStyle[x].remove()
          break;
        }
      }
    }
  }
}

</script>

<style>
  #__ws_injection_footer_wrapper ul{
    width: 100%;
  }
</style>
