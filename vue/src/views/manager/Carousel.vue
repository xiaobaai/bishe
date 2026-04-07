<template>
  <div class="manager-page-container">
    <div class="search-card card">
      <div class="search-item">
        <el-input v-model="data.goodsName" placeholder="请输入商品名称查询" :prefix-icon="Search" clearable @clear="load" />
      </div>
      <div class="search-actions">
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-card card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd" icon="Plus">新增轮播图</el-button>
      </div>
      
      <el-table :data="data.tableData" stripe style="width: 100%">
        <el-table-column prop="goodsName" label="关联商品" min-width="200" show-overflow-tooltip />
        <el-table-column prop="img" label="轮播图片" width="200">
          <template #default="scope">
            <el-image 
              v-if="scope.row.img" 
              :src="resolveFileUrl(scope.row.img)" 
              :preview-src-list="[resolveFileUrl(scope.row.img)]" 
              preview-teleported 
              class="carousel-preview-img" 
            />
          </template>
        </el-table-column>
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

    <el-dialog :title="data.form.id ? '编辑轮播图' : '新增轮播图'" width="500px" v-model="data.formVisible" destroy-on-close>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="80px" class="dialog-form">
        <el-form-item label="关联商品" prop="goodsId">
          <el-select style="width: 100%" v-model="data.form.goodsId" placeholder="请选择要展示的商品">
            <el-option v-for="item in data.goodsList" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="轮播图片" prop="img">
          <el-upload
            class="carousel-uploader"
            :action="baseUrl + '/files/upload'"
            :on-success="handleFileUpload"
            :show-file-list="false"
          >
            <img v-if="data.form.img" :src="resolveFileUrl(data.form.img)" class="carousel-img" />
            <div v-else class="uploader-placeholder">
              <el-icon class="uploader-icon"><Plus /></el-icon>
              <span>建议尺寸: 1200x400</span>
            </div>
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
import request, { resolveFileUrl } from "@/utils/request";
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
  goodsList: [],
  goodsName: null,
  rules: {
    goodsId: [{ required: true, message: '请选择商品', trigger: 'change' }],
    img: [{ required: true, message: '请上传图片', trigger: 'blur' }]
  }
})
const baseUrl = import.meta.env.VITE_BASE_URL
const handleFileUpload = (res) => {
  data.form.img = res.data
}

request.get('/goods/selectAll').then(res => {
  data.goodsList = res.data
})

const load = () => {
  request.get('/carousel/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      goodsName: data.goodsName
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
  })
}
load()

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
      const apiCall = data.form.id ? request.put('/carousel/update', data.form) : request.post('/carousel/add', data.form)
      apiCall.then(res => {
        if (res.code === '200') {
          ElMessage.success('操作成功')
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
  ElMessageBox.confirm('确认删除该轮播图吗？', '提示', { type: 'warning' }).then(() => {
    request.delete('/carousel/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('删除成功')
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {})
}

const reset = () => {
  data.goodsName = null
  load()
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

.carousel-preview-img {
  width: 120px;
  height: 60px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  object-fit: cover;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-form {
  padding: 10px 20px 0 0;
}

.carousel-uploader {
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.carousel-uploader:hover {
  border-color: var(--primary-color);
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.uploader-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #8c939d;
  font-size: 12px;
}

.uploader-icon {
  font-size: 24px;
  margin-bottom: 8px;
}
</style>
