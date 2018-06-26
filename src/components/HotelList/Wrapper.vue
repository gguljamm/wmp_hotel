<template>
  <div>
    <div>{{ inputData.destination }}</div>
    <div>{{ inputData.checkin }}</div>
    <div>{{ inputData.checkout }}</div>
    <div>{{ inputData.adults }}</div>
    <div>{{ inputData.children }}</div>
    <div>{{ inputData.room }}</div>
  </div>
</template>

<script>
export default {
  name: 'wrapper',
  data () {
    const inputData = this.$route.params
    return {
      inputData
    }
  }
}
</script>

<style scoped>

</style>
