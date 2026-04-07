<template>
  <div class="manager-page-container">
    <div class="search-card card">
      <div class="search-item-group">
        <el-input v-model="data.userName" placeholder="请输入用户名称查询" :prefix-icon="Search" clearable @clear="load" />
        <el-date-picker 
          v-model="data.time" 
          type="date" 
          placeholder="请选择日期查询" 
          format="YYYY-MM-DD" 
          value-format="YYYY-MM-DD" 
          clearable 
          @change="load" 
        />
      </div>
      <div class="search-actions">
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-card card">
      <el-table :data="data.tableData" stripe style="width: 100%">
        <el-table-column prop="money" label="充值金额" width="150">
          <template #default="scope">
            <span class="price-text">+ ￥{{ scope.row.money }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="充值用户" min-width="150" />
        <el-table-column prop="type" label="支付方式" width="150">
          <template #default="scope">
            <el-tag :type="scope.row.type === '微信' ? 'success' : 'primary'">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="充值时间" width="200" />
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
import request from "@/utils/request";
import { reactive } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const data = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  tableData: [],
  userName: null,
  time: null,
})

const load = () => {
  request.get('/recharge/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      userName: data.userName,
      time: data.time
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
  })
}
load()

const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该充值记录吗？此操作不可恢复', '提示', { type: 'warning' }).then(() => {
    request.delete('/recharge/delete/' + id).then(res => {
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
  data.userName = null
  data.time = null
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

.price-text {
  color: var(--danger-color);
  font-weight: 700;
  font-size: 16px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
