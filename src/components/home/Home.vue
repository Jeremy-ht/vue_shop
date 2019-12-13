<template>
  <el-container class="home-container">
    <!--头部-->
    <el-header>
      <div class="home-header">
        <img src="~assets/heima.png" alt="" class="img-heima">
        <span>电商管理系统后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!--左侧菜单栏-->
      <el-aside :width="widthSize">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <left-aside ref="leftMenu"/>
      </el-aside>

      <!--主体-->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
  import LeftAside from "./childerComponents/LeftAside";

  export default {
    name: "Home",
    data() {
      return {
        widthSize: '200px'
      }
    },
    components: {
      LeftAside
    },
    methods: {
      //退出
      logout() {
        //清除session
        window.sessionStorage.clear();
        //跳转到登录页
        this.$router.replace('/login');
      },
      //切换菜单隐藏
      toggleCollapse() {
        this.$refs.leftMenu.isCollapse = !this.$refs.leftMenu.isCollapse;

        this.widthSize = this.$refs.leftMenu.isCollapse ? '64px' : '200px'
        console.log(this.$refs.leftMenu);
      }

    }
  }
</script>

<style scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #0ea6d8;
    display: flex;
    justify-content: space-between;
    padding-left: 3px;
    color: #fff;
    align-items: center;
    font-size: 23px;

  }

  .home-header {
    display: flex;
    align-items: center;
  }

  .el-header span {
    margin-left: 10px;
  }

  .img-heima {
    width: 50px;
    height: 50px;
  }

  .el-aside {
    background-color: #2b2b2b;
  }

  .el-main {
    background-color: #eee;
  }

  .toggle-button {
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em; /*字体间距*/
    cursor: pointer; /* 移动到上面变成小手*/
  }
</style>