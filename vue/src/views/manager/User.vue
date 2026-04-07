<template>
  <div class="manager-page-container">
    <div class="search-card card">
      <div class="search-item">
        <el-input v-model="data.name" placeholder="请输入名称查询" :prefix-icon="Search" clearable @clear="load" />
      </div>
      <div class="search-actions">
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-card card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd" icon="Plus">新增用户</el-button>
      </div>
      
      <el-table :data="data.tableData" stripe style="width: 100%">
        <el-table-column prop="username" label="账号" min-width="120" />
        <el-table-column prop="name" label="姓名" min-width="120" />
        <el-table-column prop="avatar" label="头像" width="100">
          <template #default="scope">
            <el-avatar :size="40" :src="resolveFileUrl(scope.row.avatar)" @click="handlePreview(scope.row.avatar)">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="角色">
          <template #default="scope">
            <el-tag :type="scope.row.role === 'ADMIN' ? 'danger' : 'success'">{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账户余额">
          <template #default="scope">
            <span class="price-text">￥{{ scope.row.account || '0.00' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination 
          v-model:current-page="data.pageNum" 
          v-model:page-size="data.pageSize"
          @current-change="load" 
          background 
          layout="total, prev, pager, next" 
          :total="data.total" 
        />
      </div>
    </div>

    <el-dialog :title="data.form.id ? '编辑用户' : '新增用户'" v-model="data.formVisible" width="400px" destroy-on-close>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="70px" class="dialog-form">
        <el-form-item prop="username" label="账号">
          <el-input :disabled="data.form.id !== undefined" v-model="data.form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="data.form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item prop="avatar" label="头像">
          <el-upload
            class="avatar-uploader"
            :action="baseUrl + '/files/upload'"
            :show-file-list="false"
            :on-success="handleFileUpload"
          >
            <img v-if="data.form.avatar" :src="resolveFileUrl(data.form.avatar)" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { Search, Plus } from "@element-plus/icons-vue";
import request, { resolveFileUrl } from "@/utils/request";
import { ElMessage, ElMessageBox } from "element-plus";

const baseUrl = import.meta.env.VITE_BASE_URL
const formRef = ref()
const data = reactive({
  name: null,
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  formVisible: false,
  form: {},
  rules: {
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
  }
})

const load = () => {
  request.get('/user/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name
    }
  }).then(res => {
    if (res.code === '200') {
      data.tableData = res.data?.list
      data.total = res.data?.total
    } else {
      ElMessage.error(res.msg)
    }
  })
}
load()

const reset = () => {
  data.name = null
  load()
}

const del = (id) => {
  ElMessageBox.confirm('确认删除该用户吗？此操作不可恢复', '删除确认', { 
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    request.delete('/user/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('删除成功')
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {})
}

const handleAdd = () => {
  data.form = {}
  data.formVisible = true
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

const handleFileUpload = (res) => {
  data.form.avatar = res.data
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiCall = data.form.id ? request.put('/user/update', data.form) : request.post('/user/add', data.form)
      apiCall.then(res => {
        if (res.code === '200') {
          ElMessage.success('保存成功')
          data.formVisible = false
          load()
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}
</script>

<style scoped>
.manager-page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.search-item {
  width: 280px;
}

.search-actions {
  display: flex;
  gap: 10px;
}

.table-card {
  padding: 20px;
}

.table-header {
  margin-bottom: 20px;
}

.price-text {
  color: var(--danger-color);
  font-weight: 600;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-form {
  padding: 10px 20px 0 0;
}

.avatar-uploader {
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: var(--primary-color);
}

.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}
</style>
