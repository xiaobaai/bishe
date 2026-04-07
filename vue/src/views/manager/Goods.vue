<template>
  <div class="manager-page-container">
    <div class="search-card card">
      <div class="search-item-group">
        <el-input v-model="data.name" placeholder="请输入商品名称查询" :prefix-icon="Search" clearable @clear="load" />
        <el-select v-model="data.categoryId" placeholder="请选择商品分类" clearable @change="load">
          <el-option v-for="item in data.categoryList" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </div>
      <div class="search-actions">
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-card card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd" icon="Plus">发布商品</el-button>
      </div>
      
      <el-table :data="data.tableData" stripe style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="img" label="图片" width="100">
          <template #default="scope">
            <el-image 
              v-if="scope.row.img" 
              :src="resolveFileUrl(scope.row.img)" 
              :preview-src-list="[resolveFileUrl(scope.row.img)]" 
              preview-teleported 
              class="table-img"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格" width="100">
          <template #default="scope">
            <span class="price-text">￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="store" label="库存" width="80" align="center" />
        <el-table-column prop="categoryName" label="分类" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === '上架' ? 'success' : 'info'">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="推荐" width="80" align="center">
          <template #default="scope">
            <el-switch
                @change="updateRecommend(scope.row)"
                v-model="scope.row.recommendActive"
                inline-prompt
                active-text="是"
                inactive-text="否"
            />
          </template>
        </el-table-column>
        <el-table-column prop="saleCount" label="销量" width="80" align="center" />
        <el-table-column prop="time" label="发布时间" width="160" />
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

    <el-dialog :title="data.form.id ? '编辑商品' : '发布商品'" width="800px" v-model="data.formVisible" destroy-on-close>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="80px" class="dialog-form">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="name" label="商品名称">
              <el-input v-model="data.form.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="categoryId" label="所属分类">
              <el-select v-model="data.form.categoryId" style="width: 100%">
                <el-option v-for="item in data.categoryList" :key="item.id" :value="item.id" :label="item.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item prop="price" label="商品价格">
              <el-input-number :min="0" v-model="data.form.price" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="store" label="库存数量">
              <el-input-number :min="0" v-model="data.form.store" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="status" label="上架状态">
              <el-radio-group v-model="data.form.status">
                <el-radio label="上架">上架</el-radio>
                <el-radio label="下架">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="img" label="商品图片">
          <el-upload
            class="goods-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleImgSuccess"
          >
            <img v-if="data.form.img" :src="resolveFileUrl(data.form.img)" class="goods-img" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>

        <el-form-item prop="description" label="简短描述">
          <el-input type="textarea" :rows="2" v-model="data.form.description" placeholder="请输入简介" />
        </el-form-item>

        <el-form-item prop="content" label="详情描述">
          <div class="editor-container">
            <Toolbar :editor="editorRef" :mode="mode" class="editor-toolbar" />
            <Editor
              v-model="data.form.content"
              :mode="mode"
              :defaultConfig="editorConfig"
              @onCreated="handleCreated"
              class="editor-content"
            />
          </div>
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
import { reactive, ref, onBeforeUnmount, shallowRef } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search, Plus } from "@element-plus/icons-vue";
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const uploadUrl = import.meta.env.VITE_BASE_URL + '/files/upload'
const formRef = ref()
const data = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  formVisible: false,
  form: {},
  tableData: [],
  categoryList: [],
  name: null,
  categoryId: null,
  rules: {
    name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
    img: [{ required: true, message: '请上传图片', trigger: 'blur' }],
    price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
    description: [{ required: true, message: '请输入简介', trigger: 'blur' }],
    content: [{ required: true, message: '请输入详情', trigger: 'blur' }],
    store: [{ required: true, message: '请输入库存', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }]
  }
})

const baseUrl = import.meta.env.VITE_BASE_URL
const editorRef = shallowRef()
const mode = 'default'
const editorConfig = { MENU_CONF: {} }
editorConfig.MENU_CONF['uploadImage'] = {
  server: baseUrl + '/files/wang/upload',
  fieldName: 'file'
}

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor
}

const handleImgSuccess = (res) => {
  data.form.img = res.data
}

request.get('/category/selectAll').then(res => {
  data.categoryList = res.data
})

const load = () => {
  request.get('/goods/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name,
      categoryId: data.categoryId
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.tableData.forEach(v => {
      v.recommendActive = v.recommend === '是'
    })
    data.total = res.data?.total || 0
  })
}
load()

const reset = () => {
  data.name = null
  data.categoryId = null
  load()
}

const handleAdd = () => {
  data.form = { status: '上架', price: 0, recommend: '否', store: 1 }
  data.formVisible = true
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

const save = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const apiCall = data.form.id ? request.put('/goods/update', data.form) : request.post('/goods/add', data.form)
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

const updateRecommend = (row) => {
  const postData = JSON.parse(JSON.stringify(row))
  postData.recommend = row.recommendActive ? '是' : '否'
  request.put('/goods/update', postData).then(res => {
    if (res.code === '200') {
      ElMessage.success('更新推荐状态成功')
      load()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该商品吗？', '提示', { type: 'warning' }).then(() => {
    request.delete('/goods/delete/' + id).then(res => {
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

.search-item-group {
  display: flex;
  gap: 12px;
}

.search-item-group .el-input {
  width: 240px;
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

.table-img {
  width: 60px;
  height: 60px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
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
  padding: 10px 10px 0 0;
}

.goods-uploader {
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.3s;
}

.goods-uploader:hover {
  border-color: var(--primary-color);
}

.goods-img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.editor-container {
  border: 1px solid var(--border-color);
  border-radius: 4px;
  width: 100%;
}

.editor-toolbar {
  border-bottom: 1px solid var(--border-color);
}

.editor-content {
  height: 400px;
  overflow-y: hidden;
}
</style>
