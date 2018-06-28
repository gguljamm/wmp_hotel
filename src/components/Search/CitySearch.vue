<template>
  <div>
    <input ref="cityInput" v-model="inputData.destination" placeholder="머무를 장소를 입력해주세요.">
  </div>
</template>

<script>
export default {
  name: 'CitySearch',
  props: ['inputData'],
  mounted () {
    setTimeout(() => {
      this.$refs.cityInput.focus()
    }, 150)
  }
}
</script>

<style scoped>

</style>
