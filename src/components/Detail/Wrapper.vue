<template>
  <div>
    <h1>디테일</h1>
    <div>
      호텔 {{ $route.params.key }}의 디테일
    </div>
    <button @click="book()">결제하기</button>
  </div>
</template>

<script>
export default {
  name: 'DetailWrapper',
  methods: {
    book () {
      this.$router.push('/book')
    }
  }
}
</script>

<style scoped>

</style>
