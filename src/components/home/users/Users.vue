<template>
  <div>
    <!--左侧菜单-->
    <bread-navigation :leftNavPath="breadPath"/>

    <el-card>

      <el-row :gutter="20">
        <!--搜索框-->
        <el-col :span="8">
          <el-input placeholder="请输入内容" size="medium"
                    v-model="queryInfo.query" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList"/>
          </el-input>
        </el-col>
        <!--按钮-->
        <el-col :span="4">
          <el-button type="primary" size="medium" @click="queryUser">添加用户</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table :data="userList" border stripe>

        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <!--作用域插槽-->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!--编辑-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserBtn(scope.row.id)"/>
            <!--删除-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delUserBtn(scope.row.id)"/>
            <!--分配角色-->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <page-bar :pageTotal="pageTotal" :pageNum="queryInfo.pagenum" :pageSize="queryInfo.pagesize"
                @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"/>

    </el-card>

    <!--添加用户的对话框-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="closeAddUserForm()">
      <span>
        <!--表单-->
        <el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUser.password"></el-input>
          </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
        </el-form>
      </span>

      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUserBtn">确 定</el-button>
        <el-button @click="addDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!--修改用户的对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="closeEditUserForm">
      <span>
        <!--表单-->
        <el-form :model="editUser" :rules="addUserRules" ref="editUserRef" label-width="80px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUser.username" disabled></el-input>
          </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
        </el-form>
      </span>

      <!--底部区域-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editUserBtn2">确 定</el-button>
        <el-button @click="editDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import BreadNavigation from "components/common/BreadNavigation";
  // import Card from "components/common/Card";
  import PageBar from "components/common/PageBar";
  // import Dialog from "../../common/Dialog";

  export default {
    name: "Users",
    data() {

      // 验证邮箱的规则
      let checkEmail = (rule, value, cb) => {
        // 验证邮箱的正则表达式
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          // 合法的邮箱
          return cb()
        }

        cb(new Error('请输入合法的邮箱'))
      };

      // 验证手机号的规则
      let checkMobile = (rule, value, cb) => {
        // 验证手机号的正则表达式
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的手机号'))
      };

      return {
        breadPath: ['用户管理', '用户列表'],
        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          pagenum: 1, // 当前的页数
          pagesize: 2    // 当前每页显示多少条数据
        },
        userList: [],
        pageTotal: 0,    //总条数
        addDialogVisible: false,
        //添加用户
        addUser: {
          username: '',
          password: '',
          email: '',
          mobile: '',
        },
        //添加用户表单验证
        addUserRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '用户名的长度在6~15个字符之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}
          ]
        },
        //修改用户
        editDialogVisible: false,
        editUser: {}
      }
    },
    components: {
      BreadNavigation,
      PageBar,

    },
    created() {
      this.getUsersList();

    },
    methods: {
      //初始化
      getUsersList() {
        this.$http.get('users', {
          params: this.queryInfo
        }).then(res => {
          const data = res.data.data;
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg);
          this.userList = data.users;
          this.pageTotal = data.total

        })
      },
      //分页
      handleSizeChange(pagesize) {
        this.queryInfo.pagesize = pagesize;
        this.getUsersList();
      },
      handleCurrentChange(pagenum) {
        this.queryInfo.pagenum = pagenum;
        this.getUsersList();
      },
      //更新用户状态
      userStateChanged(userInfo) {
        this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`).then(res => {
              if (res.data.meta.status !== 200) {
                userInfo.mg_state = !userInfo.mg_state;
                this.$message.error('更新用户失败')
              }
              this.$message.success('更新用户成功')
            }
        )
      },
      //添加用户
      queryUser() {
        // console.log(this.$refs.dialog.getDialogVisible());
        this.addDialogVisible = true
      },
      //重置添加用户表单
      closeAddUserForm() {
        this.$refs.addUserRef.resetFields()
      },
      addUserBtn() {
        this.$refs.addUserRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.post('users', this.addUser)
          if (res.meta.status !== 201)
            return this.$message.error('添加用户失败')
          this.$message.success('添加用户成功')

          this.addDialogVisible = false
          this.getUsersList()
        })
      },
      //修改用户信息
      editUserBtn(id) {
        this.editDialogVisible = true;
        this.$http.get(`users/+${id}`).then(res => {
          if (res.data.meta.status !== 200)
            return this.$message.error('获取用户失败')
          this.editUser = res.data.data
        })

      },
      editUserBtn2() {
        this.$refs.editUserRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put('users/' + this.editUser.id, {
                email: this.editUser.email,
                mobile: this.editUser.mobile
              }
          )
          if (res.meta.status !== 200)
            return this.$message.error('修改用户失败')
          this.$message.success('修改用户成功')

          this.editDialogVisible = false
          this.getUsersList()
        })
      },
      closeEditUserForm() {
        this.$refs.editUserRef.resetFields()
      },
      delUserBtn(id) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.delete('users/' + id).then(res => {
            if (res.data.meta.status !== 200)
              return this.$message.error('删除用户失败')
            this.$message.success('删除用户成功')
            this.getUsersList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      }


    }
  }
</script>

<style scoped>
  .el-card {
    box-shadow: 0 0 0 rgba(0, 0, 0, .5); /*除去卡片阴影*/
  }
</style>