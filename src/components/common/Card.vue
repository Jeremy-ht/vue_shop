<template>
  <el-card class="box-card">
    <slot/>
  </el-card>
</template>

<script>
  export default {
    name: "Card"
  }
</script>

<style scoped>
  .box-card {
    box-shadow: 0 0 0 rgba(0, 0, 0, .5); /*除去卡片阴影*/

  }

</style>