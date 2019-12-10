<template>
  <div class="home">
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
  export default {
    name: "Home",
    methods: {
      //退出
      logout() {
        //清除session
        window.sessionStorage.clear();
        //跳转到登录页
        this.$router.replace('/login');
      }
    }
  }
</script>

<style scoped>

</style>