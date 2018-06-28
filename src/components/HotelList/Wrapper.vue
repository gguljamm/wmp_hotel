<template>
  <div>
    <h1>호텔리스트</h1>
    <div class="inputContainer">
      <h2>검색 조건</h2>
      <div>도시: {{ inputData.destination }}</div>
      <div>체크인: {{ inputData.checkin }}</div>
      <div>체크아웃: {{ inputData.checkout }}</div>
      <div>성인: {{ inputData.adults }}</div>
      <div>아동: {{ getChildrenNumber }}</div>
      <div>승객: {{ inputData.room }}</div>
    </div>
    <h1>검색결과</h1>
    <ul>
      <li
        v-for="x in 5"
        v-bind:key="x"
        @click="submit(x)"
      >호텔 {{ x }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hotelListWrapper',
  data () {
    const inputData = this.$route.params
    return {
      inputData
    }
  },
  computed: {
    getChildrenNumber () {
      return this.inputData.children === 'null' ? 0 : this.inputData.children.split('&').length
    }
  },
  methods: {
    submit (key) {
      this.$router.push(`/detail/${key}`)
    }
  }
}
</script>

<style scoped>
  .inputContainer{
    border: 1px solid #ff493d;
    padding: 20px;
  }
  .inputContainer > div{
    margin-bottom: 8px;
  }
  ul li{
    margin-bottom: 8px;
  }
</style>
