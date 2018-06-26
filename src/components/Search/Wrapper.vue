<template>
  <div>
    서치페이지
    <router-link
      :to="{
        name: 'hotelList',
        params: {
          destination: '런던',
          checkin: '2018-09-09',
          checkout: '2018-09-12',
          adults: '1',
          children: '0',
          room: '1',
        }
      }"
    >결과로 가기</router-link>
  </div>
</template>

<script>
export default {
  name: 'wrapper'
}
</script>

<style scoped>

</style>
