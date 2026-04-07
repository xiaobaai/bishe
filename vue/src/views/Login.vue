<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-title">社区二手交易平台</div>
      <div class="login-subtitle">让每一件闲置都找到新主人</div>
      <el-form :model="data.form" ref="formRef" :rules="data.rules">
        <el-form-item prop="username">
          <el-input class="login-input" :prefix-icon="User" size="large" v-model="data.form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="login-input" :prefix-icon="Lock" size="large" v-model="data.form.password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item prop="role">
          <el-select class="login-input" size="large" style="width: 100%" v-model="data.form.role">
            <el-option value="普通用户" label="普通用户"></el-option>
            <el-option value="管理员" label="管理员"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" size="large" type="primary" style="width: 100%" @click="login">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="register-link-wrap">
        还没有账号？请 <a href="/register">注册</a>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import router from "@/router";

const data = reactive({
  form: { role: '管理员' },
  rules: {
    username: [
      { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
    ],
  }
})

const formRef = ref()

const login = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      request.post('/login', data.form)
          .then(res => {
            if (res.code === '200') {
              ElMessage.success("登录成功")
              localStorage.setItem('system-user', JSON.stringify(res.data))
              if (res.data.role === '管理员') {
                router.push('/manager/home')
              } else {
                router.push('/front/home')
              }
            } else {
              ElMessage.error(res.msg)
            }
          })
          .catch(error => {
            ElMessage.error('无法连接到后台服务：http://localhost:9090（请先启动 springboot 并确保数据库可用）')
            console.error(error)
          })
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background:
      radial-gradient(circle at 20% 15%, rgba(91, 157, 255, 0.35), transparent 38%),
      radial-gradient(circle at 80% 85%, rgba(65, 215, 188, 0.3), transparent 42%),
      linear-gradient(135deg, #151a2e 0%, #232c4d 55%, #22345f 100%);
}
.login-box {
  width: 390px;
  padding: 44px 34px 30px;
  border-radius: 18px;
  box-shadow: 0 24px 60px rgba(10, 18, 38, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(8px);
}
.login-title {
  font-weight: 700;
  font-size: 26px;
  text-align: center;
  color: #1a2544;
  letter-spacing: 1px;
}
.login-subtitle {
  text-align: center;
  font-size: 14px;
  color: #6a7492;
  margin: 6px 0 32px;
}
.login-input .el-input__wrapper {
  background: #f4f7ff;
  border-radius: 10px;
  box-shadow: none;
  border: 1px solid #e1e8f9;
}
.login-btn {
  border-radius: 10px;
  background: linear-gradient(120deg, #2d8cf0 0%, #5b9dff 100%);
  border: none;
  font-weight: 600;
  box-shadow: 0 8px 16px rgba(64, 142, 255, 0.3);
  margin-top: 10px;
}
.register-link-wrap {
  text-align: center;
  margin-top: 24px;
  color: #7a84a1;
  font-size: 14px;
}
.register-link-wrap a {
  color: #2d8cf0;
  font-weight: 600;
}
</style>
