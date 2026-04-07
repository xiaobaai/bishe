<template>
  <div class="front-container profile-page">
    <div class="card profile-card">
      <div class="profile-header">
        <h2 class="profile-title">个人信息</h2>
        <p class="profile-subtitle">管理您的个人资料和账户设置</p>
      </div>

      <el-form 
        ref="formRef" 
        :model="data.user" 
        :rules="data.rules" 
        label-width="100px" 
        label-position="top"
        class="profile-form"
      >
        <div class="avatar-section">
          <el-form-item prop="avatar" label="用户头像">
            <el-upload
              class="avatar-uploader"
              :action="baseUrl + '/files/upload'"
              :show-file-list="false"
              :on-success="handleFileUpload"
            >
              <img v-if="data.user.avatar" :src="resolveFileUrl(data.user.avatar)" class="avatar" />
              <div v-else class="avatar-placeholder">
                <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                <span>点击上传</span>
              </div>
            </el-upload>
          </el-form-item>
        </div>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="username" label="登录账号">
              <el-input :disabled="true" v-model="data.user.username" placeholder="请输入账号" prefix-icon="User" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="name" label="真实姓名">
              <el-input v-model="data.user.name" placeholder="请输入姓名" prefix-icon="Edit" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="账户余额">
          <div class="balance-box">
            <span class="balance-label">当前余额：</span>
            <span class="balance-amount">￥{{ data.user.account || '0.00' }}</span>
            <el-button type="primary" link @click="router.push('/front/userRecharge')" style="margin-left: 12px">去充值</el-button>
          </div>
        </el-form-item>

        <div class="form-actions">
          <el-button type="primary" size="large" @click="update" class="save-btn">保存修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import request, { resolveFileUrl } from "@/utils/request";
import { ElMessage } from "element-plus";
import { Plus, User, Edit } from "@element-plus/icons-vue";
import router from "@/router";

const emit = defineEmits(['updateUser'])

const baseUrl = import.meta.env.VITE_BASE_URL
const formRef = ref()
const data = reactive({
  user: JSON.parse(localStorage.getItem('system-user') || '{}'),
  rules: {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
  }
})

const loadUser = () => {
  request.get('/user/selectById/' + data.user.id).then(res => {
    data.user = res.data
    localStorage.setItem('system-user', JSON.stringify(res.data))
    emit('updateUser')
  })
}
loadUser()

const handleFileUpload = (res) => {
  data.user.avatar = res.data
}

const update = () => {
  formRef.value.validate(valid => {
    if (valid) {
      request.put('/user/update', data.user).then(res => {
        if (res.code === '200') {
          ElMessage.success('更新成功')
          loadUser()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}
</script>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
}

.profile-card {
  width: 600px;
  padding: 40px;
}

.profile-header {
  text-align: center;
  margin-bottom: 40px;
}

.profile-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
}

.profile-subtitle {
  color: var(--text-sub);
  font-size: 14px;
}

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.avatar-uploader {
  border: 1px dashed var(--border-color);
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  transition: all 0.3s;
}

.avatar-uploader:hover {
  border-color: var(--primary-color);
}

.avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
  display: block;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #8c939d;
  background-color: #f8fafc;
}

.avatar-uploader-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.balance-box {
  background-color: #f8fafc;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
}

.balance-label {
  color: var(--text-sub);
}

.balance-amount {
  color: var(--danger-color);
  font-size: 18px;
  font-weight: 700;
}

.form-actions {
  margin-top: 40px;
  text-align: center;
}

.save-btn {
  width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}
</style>
