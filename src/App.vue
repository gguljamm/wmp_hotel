<template>
  <div id="app">
    <div class="page">
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto+Slab');
  body{
    margin: 0;
  }
  .roboto{
    font-family: 'Roboto Slab', serif !important;
  }
  * {
    box-sizing: border-box;
  }
</style>
