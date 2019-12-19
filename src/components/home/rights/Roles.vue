<template>
  <div>
    <!--面包屑-->
    <bread-navigation :leftNavPath="leftNavPath"/>

    <!--卡片-->
    <el-card>
      <!--添加角色按钮-->
      <el-row>
        <el-col :span="3">
          <el-button type="primary" @click="addRoles">添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色列表-->
      <el-table :data="rolesList" border stripe>

        <!--展开列-->
        <el-table-column type="expand" align="center">
          <template slot-scope="scope">
            <el-row v-for="(item1, index1) in scope.row.children"
                    :class="['tbbottom', index1 === 0 ? 'tbtop' : '','flexcenter']" :key="item1.id">
              <el-col :span="6">
                <!--第一级权限-->
                <el-tag closable @close="deleteRightById(scope.row, item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="18">
                <!--第二级权限-->
                <el-row v-for="(item2, index2) in item1.children" :class="[index2 === 0 ? '' : 'tbtop', 'flexcenter']"
                        :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteRightById(scope.row, item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!--第三级权限-->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                            @close="deleteRightById(scope.row, item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>

                </el-row>
              </el-col>
            </el-row>

          </template>
        </el-table-column>

        <el-table-column type="index" label="#"/>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>

      </el-table>

    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="isShowRightsDialog"
               width="50%" @close="setDialogClose">
      <!--树形控件-->
      <el-tree :data="rightList" :props="rightsProps" show-checkbox node-key="id" default-expand-all
      ></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isShowRightsDialog = false">取 消</el-button>
    <el-button type="primary" @click="isShowRightsDialog = false">确 定</el-button>
  </span>
    </el-dialog>


  </div>
</template>

<script>
  import BreadNavigation from "components/common/BreadNavigation";

  export default {
    name: "Roles",
    data() {
      return {
        leftNavPath: ['权限管理', '角色列表'],
        rolesList: [],
        isShowRightsDialog: false,
        rightList: [],
        //树形控件的属性绑定对象
        rightsProps: {
          //设置通过children属性展示子节点信息
          children: 'children',
          //通过label设置树形节点文本展示authName
          label: 'authName'
        },
        //默认选中的节点Id值数组
        defKeys: []
      }
    },
    created() {
      this.getRolesList()
    },
    components: {
      BreadNavigation

    },
    methods: {
      //初始化加载角色数据
      async getRolesList() {
        const {data: res} = await this.$http.get('roles');
        if (res.meta.status !== 200)
          return this.$message.error('角色列表加载失败')
        this.rolesList = res.data

      },
      //添加角色
      addRoles() {

      },
      //根据id删除角色权限
      deleteRightById(role, itemId) {

        this.$confirm('此操作将永久删除权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete(`roles/${role.id}/rights/${itemId}`).then(res => {
            if (res.data.meta.status !== 200)
              return this.$message.error('删除权限失败')

            //无需再重新加载所有权限
            //只需要对现有的角色权限进行更新即可   ？？？
            role.children = res.data.data
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        })

      },
      // 权限分配对话框
      async showRights(role) {
        const {data: res} = await this.$http.get('rights/tree')

        if (res.meta.status !== 200)
          return this.$message.error('权限列表加载失败')

        this.rightList = res.data
        console.log(this.rightList);

        this.getLeafKeys(role, this.defKeys)

        this.isShowRightsDialog = true
      },
      // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中
      getLeafKeys(node, arr) {
        // 如果当前 node 节点不包含 children 属性，则是三级节点
        if (!node.children) {
          return arr.push(node.id)
        }

        node.children.forEach(item => this.getLeafKeys(item, arr))
      },
      //监听分配权限对话框的关闭事件
      setDialogClose() {
        this.defKeys = []
      }

    }

  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 0 0 rgba(0, 0, 0, .5); /*除去卡片阴影*/
  }

  .el-tag {
    margin: 7px;
    text-align: center;
  }

  .tbtop {
    border-top: 1px solid #eee;
  }

  .tbbottom {
    border-bottom: 1px solid #eee;
  }

  .flexcenter {
    display: flex;
    align-items: center;
  }
</style>