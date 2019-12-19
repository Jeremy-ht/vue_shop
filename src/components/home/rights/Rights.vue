<template>
  <div>
    <bread-navigation :leftNavPath="leftNavPath"></bread-navigation>

    <el-card>
      <el-table :data="rightsList" border stripe >
        <el-table-column type="index" label="#" align="center"/>
        <el-table-column label="权限名称" prop="authName" align="center"/>
        <el-table-column label="路径" prop="path" align="center"/>
        <el-table-column label="权限等级" prop="level" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level==='1'">二级</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level==='2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  import BreadNavigation from "components/common/BreadNavigation";

  export default {
    name: "Rights",
    data() {
      return {
        leftNavPath: ['权限管理', '权限列表'],
        rightsList: []
      }
    },
    created() {
      this.getRightsList()
    },
    components: {
      BreadNavigation
    },
    methods: {
      getRightsList() {
        this.$http.get('rights/list').then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('权限列表获取失败')

          this.rightsList = res.data.data
          // console.log(res.data.data);
        })

      },


    }
  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 0 0 rgba(0, 0, 0, .5); /*除去卡片阴影*/
  }
</style>