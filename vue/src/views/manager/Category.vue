<template>
  <div class="manager-page-container">
    <div class="search-card card">
      <div class="search-item">
        <el-input v-model="data.name" placeholder="请输入分类名称查询" :prefix-icon="Search" clearable @clear="load" />
      </div>
      <div class="search-actions">
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-card card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd" icon="Plus">新增分类</el-button>
      </div>
      
      <el-table :data="data.tableData" stripe style="width: 100%">
        <el-table-column label="分类名称" prop="name" min-width="200" />
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination 
          @current-change="load" 
          background 
          layout="total, prev, pager, next" 
          v-model:page-size="data.pageSize" 
          v-model:current-page="data.pageNum" 
          :total="data.total"
        />
      </div>
    </div>

    <el-dialog :title="data.form.id ? '编辑分类' : '新增分类'" width="400px" v-model="data.formVisible" destroy-on-close>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="80px" class="dialog-form">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="data.form.name" placeholder="请输入分类名称" />
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
import request from "@/utils/request";
import { reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";

const formRef = ref()
const data = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  formVisible: false,
  form: {},
  tableData: [],
  name: null,
  rules: {
    name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
  }
})

const load = () => {
  request.get('/category/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
  })
}
load()

const reset = () => {
  data.name = null
  load()
}

const handleAdd = () => {
  data.form = {}
  data.formVisible = true
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

const save = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const apiCall = data.form.id ? request.put('/category/update', data.form) : request.post('/category/add', data.form)
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

const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该分类吗？', '提示', { type: 'warning' }).then(() => {
    request.delete('/category/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('删除成功')
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {})
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-form {
  padding: 10px 20px 0 0;
}
</style>
