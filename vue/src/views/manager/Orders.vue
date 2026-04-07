<template>
  <div class="manager-page-container">
    <div class="search-card card">
      <div class="search-item-group">
        <el-input v-model="data.orderNo" placeholder="请输入订单编号查询" :prefix-icon="Search" clearable @clear="load" />
        <el-input v-model="data.goodsName" placeholder="请输入商品名称查询" :prefix-icon="Search" clearable @clear="load" />
      </div>
      <div class="search-actions">
        <el-button type="primary" @click="load">查询</el-button>
        <el-button type="info" plain @click="reset">重置</el-button>
      </div>
    </div>

    <div class="table-card card">
      <el-table :data="data.tableData" stripe style="width: 100%">
        <el-table-column type="expand">
          <template #default="props">
            <div class="order-detail-wrapper">
              <el-table :data="props.row.orderDetailList" border size="small">
                <el-table-column label="商品" width="80">
                  <template #default="scope">
                    <el-image :src="resolveFileUrl(scope.row.goodsImg)" class="detail-img" :preview-src-list="[resolveFileUrl(scope.row.goodsImg)]" preview-teleported />
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsName" show-overflow-tooltip />
                <el-table-column label="单价" prop="goodsPrice" width="100">
                  <template #default="scope">￥{{ scope.row.goodsPrice }}</template>
                </el-table-column>
                <el-table-column label="数量" prop="num" width="80" align="center">
                  <template #default="scope">x{{ scope.row.num }}</template>
                </el-table-column>
                <el-table-column label="小计" width="120">
                  <template #default="scope">
                    <span class="price-text">￥{{ (scope.row.goodsPrice * scope.row.num).toFixed(2) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" min-width="180">
          <template #default="scope">
            <span class="order-no">{{ scope.row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="总金额" width="120">
          <template #default="scope">
            <span class="price-text">￥{{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="下单人" width="120" />
        <el-table-column prop="deliverType" label="配送方式" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.deliverType === '自提' ? 'info' : 'warning'" effect="plain">{{ scope.row.deliverType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="下单时间" width="160" />
        <el-table-column prop="address" label="收货地址" show-overflow-tooltip min-width="200" />
        <el-table-column prop="deliver" label="配送信息" show-overflow-tooltip min-width="150" />
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.deliverType === '自提' && scope.row.status === '待接单'" type="primary" link @click="out(scope.row)">确认出货</el-button>
            <el-button v-if="scope.row.deliverType === '外送' && scope.row.status === '待接单'" type="primary" link @click="handleDeliver(scope.row)">安排配送</el-button>
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

    <el-dialog title="安排配送" width="400px" v-model="data.formVisible" destroy-on-close>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="80px" class="dialog-form">
        <el-form-item label="配送信息" prop="deliver">
          <el-input 
            placeholder="请输入配送员姓名及联系方式" 
            type="textarea" 
            :rows="3" 
            v-model="data.form.deliver" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取 消</el-button>
          <el-button type="primary" @click="save">确 认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import request, { resolveFileUrl } from "@/utils/request";
import { reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search } from "@element-plus/icons-vue";

const formRef = ref()
const data = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0,
  formVisible: false,
  form: {},
  tableData: [],
  orderNo: null,
  goodsName: null,
  rules: {
    deliver: [{ required: true, message: '请输入配送信息', trigger: 'blur' }]
  }
})

const getStatusType = (status) => {
  const map = {
    '待接单': 'warning',
    '已出货': 'primary',
    '已配送': 'primary',
    '已完成': 'success',
    '已取消': 'info'
  }
  return map[status] || 'info'
}

const load = () => {
  request.get('/orders/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      orderNo: data.orderNo,
      goodsName: data.goodsName
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
  })
}
load()

const reset = () => {
  data.orderNo = null
  data.goodsName = null
  load()
}

const handleDeliver = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

const out = (row) => {
  ElMessageBox.confirm('确认订单已准备好出货吗？', '提示', { type: 'warning' }).then(() => {
    const postData = JSON.parse(JSON.stringify(row))
    postData.status = '已出货'
    request.put('/orders/update', postData).then(res => {
      if (res.code === '200') {
        ElMessage.success('操作成功')
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {})
}

const save = () => {
  formRef.value.validate(valid => {
    if (valid) {
      data.form.status = '已配送'
      request.put('/orders/update', data.form).then(res => {
        if (res.code === '200') {
          ElMessage.success('已安排配送')
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
  ElMessageBox.confirm('确认删除该订单吗？此操作不可恢复', '提示', { type: 'warning' }).then(() => {
    request.delete('/orders/delete/' + id).then(res => {
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

.order-detail-wrapper {
  padding: 12px 48px;
  background-color: #fcfdfe;
}

.detail-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}

.order-no {
  font-family: monospace;
  font-weight: 600;
  color: var(--text-main);
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
</style>