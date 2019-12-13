<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="item in leftNavPath">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    name: "BreadNavigation",
    props: {
      leftNavPath:{
        type: Array,
        default(){
          return []
        }
      }
    }
  }
</script>

<style scoped>
  .el-breadcrumb{
    font-size: 14px;
    margin-bottom: 20px;
  }

</style>