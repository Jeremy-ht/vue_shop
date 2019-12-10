<template>
  <div class="login_container">
    <div class="login_box">
      <!--图标-->
      <div class="img_box">
        <img src="../../assets/logo.png" alt="">
      </div>
      <!--表单-->
      <el-form ref="loginFormRef" label-width="0" class="login_form" :model="loginForm" :rules="loginFormRules">
        <!--用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>

        <!--密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password"
                    v-model="loginForm.password"></el-input>
        </el-form-item>

        <!--按钮-->
        <el-form-item class="form_btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>


      </el-form>


    </div>
  </div>
</template>

<script>
  export default {
    name: "Login",
    data() {
      return {
        //表单数据绑定
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        //表单验证
        loginFormRules: {
          username:
              [
                {required: true, message: '请输入用户名', trigger: 'blur'},
                {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
              ],
          password:
              [
                {required: true, message: '请输入密码', trigger: 'blur'},
                {min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur'}
              ]
        }
      }
    },
    methods: {
      //重置
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields()
      },
      //登录预验证
      login() {
        this.$refs.loginFormRef.validate(async vail => {
          if (!vail) return;

          const {data: res} = await this.$http.post('login', this.loginForm);
          if (res.meta.status !== 200)
            return this.$message.error('登录失败');
          this.$message.success('登录成功')

          // .then(
          // res => {
          //   this.$message.success('登录成功')
          // }, err => {
          //   this.$message.error('登录失败')
          // })

          window.sessionStorage.setItem("token",res.data.token);
          this.$router.push('/home')

        })
      }

    }
  }
</script>

<style scoped>
  @import "../../assets/fonts/iconfont.css";

  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px; /* 圆角 */
    position: absolute; /*绝对定位*/
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); /*  */

  }

  .img_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 8px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

  }

  .img_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }

  .form_btn {
    display: flex;
    justify-content: flex-end;
  }

</style>