<template>
  <el-menu background-color="#2b2b2b" text-color="#fff" active-text-color="#0078d7"
           :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true"
           :default-active="activePath">
    <!--一级菜单-->
    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
      <template slot="title">
        <i :class="iconsObj[item.id]"/>
        <span>{{item.authName}}</span>
      </template>

      <!--二级菜单-->
      <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
                    @click="getActivePath('/'+subItem.path)">
        <template slot="title">
          <i class="el-icon-menu"/>
          <span>{{subItem.authName}}</span>
        </template>
      </el-menu-item>

    </el-submenu>

  </el-menu>
</template>

<script>
  export default {
    name: "LeftAside",
    data() {
      return {
        menuList: [],
        iconsObj: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-tijikongjian',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        isCollapse: false,   //是否折叠侧边栏
        activePath: ''
      }
    },
    created() {
      this.getMenuList();
      window.sessionStorage.getItem('activePath')
    },
    methods: {
      //获取左侧菜单数据
      getMenuList() {
        this.$http.get('menus').then(res => {
          if (res.data.meta.status != 200) return this.$message.error(res.data.meta.msg)
          this.menuList = res.data.data
          // console.log(res.data.data)

        })
      },
      //折叠菜单宽度
      getWidthSize() {
        return this.isCollapse ? '64px' : '200px'
      },
      //获取激活菜单路径，进行高亮显示
      getActivePath(activepath) {
        window.sessionStorage.setItem('activePath', activepath)
        this.activePath = activepath
      },


    }
  }
</script>

<style scoped>
  .iconfont {
    margin-right: 10px;
  }

  .el-menu {
    border-right: none;
  }
</style>