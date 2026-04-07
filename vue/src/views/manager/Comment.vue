<template>
  <div class="manager-page-container">
    <div class="search-card card">
      <div class="search-item-group">
        <el-input v-model="data.goodsName" placeholder="请输入商品名称查询" :prefix-icon="Search" clearable @clear="load" />
        <el-input v-model="data.content" placeholder="请输入评价内容查询" :prefix-icon="Search" clearable @clear="load" />
      </div>
      <div class="search-actions">
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-card card">
      <el-table :data="data.tableData" stripe style="width: 100%">
        <el-table-column prop="goodsImg" label="商品图片" width="100">
          <template #default="scope">
            <el-image 
              class="table-img" 
              :src="resolveFileUrl(scope.row.goodsImg)" 
              :preview-src-list="[resolveFileUrl(scope.row.goodsImg)]" 
              preview-teleported 
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="orderNo" label="订单编号" min-width="150">
          <template #default="scope">
            <span class="order-no">{{ scope.row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="score" label="评分" width="180">
          <template #default="scope">
            <el-rate disabled allow-half show-score v-model="scope.row.score" score-template="{value} 分" />
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容" min-width="200" show-overflow-tooltip />
        <el-table-column prop="userName" label="评价人" width="120" />
        <el-table-column prop="time" label="时间" width="160" />
        <el-table-column label="操作" width="100" fixed="right" align="center">
          <template #default="scope">
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
  </div>
</template>

<script setup>
import request, { resolveFileUrl } from "@/utils/request";
import { reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const data = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  tableData: [],
  content: null,
  goodsName: null
})

const load = () => {
  request.get('/comment/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      content: data.content,
      goodsName: data.goodsName,
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
  })
}
load()

const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该评价吗？此操作不可恢复', '提示', { type: 'warning' }).then(() => {
    request.delete('/comment/delete/' + id).then(res => {
      if (res.code === '200') {
        load()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {})
}

const reset = () => {
  data.content = null
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

.table-img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  display: block;
}

.order-no {
  font-family: monospace;
  color: var(--text-sub);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
