<template>
  <div>
    <div>
      <span>객실 수</span>
      <button @click="roomNumChange(false)">-</button>
      <span>{{ inputData.room }}</span>
      <button @click="roomNumChange(true)">+</button>
    </div>
    <div>
      <span>성인</span>
      <button @click="adultNumChange(false)">-</button>
      <span>{{ inputData.adults }}</span>
      <button @click="adultNumChange(true)">+</button>
    </div>
    <div>
      <span>어린이</span>
      <button @click="childrenNumChange(false)">-</button>
      <span>{{ inputData.children.length }}</span>
      <button @click="childrenNumChange(true)">+</button>
    </div>
    <div v-for="(num, index) in inputData.children" v-bind:key="index">
      <span>어린이 {{ index + 1 }} 나이</span>
      <select v-model="inputData.children[index]">
        <option v-for="age in 18" v-bind:key="age" v-bind:value="age - 1">{{ age - 1 }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Option',
  props: ['inputData'],
  methods: {
    roomNumChange (flag) {
      if (flag) {
        this.inputData.room += 1
      } else {
        this.inputData.room -= 1
      }
    },
    adultNumChange (flag) {
      if (flag) {
        this.inputData.adults += 1
      } else {
        this.inputData.adults -= 1
      }
    },
    childrenNumChange (flag) {
      if (flag) {
        this.inputData.children.push(0)
      } else {
        this.inputData.children.pop(0)
      }
    }
  }
}
</script>

<style scoped>

</style>
