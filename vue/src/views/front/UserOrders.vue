<template>
  <div class="front-container">
    <div class="card order-list-card">
      <div class="list-header">
        <h2 class="list-title">我的订单</h2>
        <div class="search-box">
          <el-input 
            v-model="data.orderNo" 
            placeholder="订单编号" 
            clearable 
            @clear="load"
            class="search-input"
          />
          <el-input 
            v-model="data.goodsName" 
            placeholder="商品名称" 
            clearable 
            @clear="load"
            class="search-input"
          />
          <el-button type="primary" @click="load" icon="Search">搜索</el-button>
        </div>
      </div>

      <el-table :data="data.tableData" stripe class="order-table" default-expand-all>
        <el-table-column type="expand">
          <template #default="props">
            <div class="order-details">
              <el-table :data="props.row.orderDetailList" border size="small">
                <el-table-column label="商品" width="80">
                  <template #default="scope">
                    <el-image :src="resolveFileUrl(scope.row.goodsImg)" class="detail-goods-img" :preview-src-list="[resolveFileUrl(scope.row.goodsImg)]" preview-teleported />
                  </template>
                </el-table-column>
                <el-table-column label="商品名称" prop="goodsName" show-overflow-tooltip />
                <el-table-column label="单价" prop="goodsPrice" width="100">
                  <template #default="scope">￥{{ scope.row.goodsPrice }}</template>
                </el-table-column>
                <el-table-column label="数量" prop="num" width="80" align="center">
                  <template #default="scope">x{{ scope.row.num }}</template>
                </el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template #default="scope">
                    <el-button 
                      v-if="props.row.status === '已完成'" 
                      type="primary" 
                      link 
                      @click="handleAddComment(scope.row)"
                    >
                      评价
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column prop="orderNo" label="订单编号" width="200">
          <template #default="scope">
            <span class="order-no">{{ scope.row.orderNo }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total" label="订单总额" width="120">
          <template #default="scope">
            <span class="price-text">￥{{ scope.row.total }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="deliverType" label="配送方式" width="100" />
        <el-table-column prop="time" label="下单时间" width="160" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <div class="order-actions">
              <el-button 
                v-if="scope.row.status === '待接单'" 
                type="danger" 
                link 
                @click="cancel(scope.row)"
              >
                取消订单
              </el-button>
              <el-button 
                v-if="scope.row.status === '已出货' || scope.row.status === '已配送'" 
                type="primary" 
                @click="done(scope.row)"
                size="small"
              >
                确认收货
              </el-button>
              <el-button 
                v-if="scope.row.status === '已完成' || scope.row.status === '已取消'" 
                type="info" 
                link 
                @click="handleDelete(scope.row.id)"
              >
                删除记录
              </el-button>
            </div>
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

    <!-- 评价弹窗 -->
    <el-dialog title="发表评价" width="400px" v-model="data.formVisible" destroy-on-close>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="70px" label-position="top">
        <el-form-item label="满意度评分" prop="score">
          <el-rate v-model="data.form.score" show-score allow-half />
        </el-form-item>
        <el-form-item label="评价内容" prop="content">
          <el-input 
            v-model="data.form.content" 
            type="textarea" 
            :rows="4" 
            placeholder="说说您的使用体验吧，您的评价对其他用户很有帮助~" 
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取消</el-button>
          <el-button type="primary" @click="save">提交评价</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import request, { resolveFileUrl } from "@/utils/request";
import { reactive, ref } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { Search } from '@element-plus/icons-vue'

const formRef = ref()
const data = reactive({
  user: JSON.parse(localStorage.getItem('system-user') || '{}'),
  pageNum: 1,
  pageSize: 5,
  total: 0,
  formVisible: false,
  form: {},
  tableData: [],
  orderNo: null,
  goodsName: null,
  rules: {
    score: [{ required: true, message: '请给出评分', trigger: 'change' }],
    content: [{ required: true, message: '请输入评价内容', trigger: 'blur' }]
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
      goodsName: data.goodsName,
      userId: data.user.id
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data?.total || 0
  })
}
load()

const cancel = (row) => {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', { type: 'warning' }).then(() => {
    const postData = JSON.parse(JSON.stringify(row))
    postData.status = '已取消'
    updateOrder(postData)
  }).catch(() => {})
}

const done = (row) => {
  ElMessageBox.confirm('确认已收到商品并完成交易吗？', '提示', { type: 'success' }).then(() => {
    const postData = JSON.parse(JSON.stringify(row))
    postData.status = '已完成'
    updateOrder(postData)
  }).catch(() => {})
}

const updateOrder = (orderData) => {
  request.put('/orders/update', orderData).then(res => {
    if (res.code === '200') {
      load()
      ElMessage.success('操作成功')
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleAddComment = (row) => {
  request.get('/comment/selectAll', {
    params: { orderId: row.orderId, goodsId: row.goodsId }
  }).then(res => {
    data.form = res.data?.length > 0 ? res.data[0] : { orderId: row.orderId, goodsId: row.goodsId, userId: data.user.id, score: 5 }
    data.formVisible = true
  })
}

const save = () => {
  formRef.value.validate(valid => {
    if (valid) {
      const apiCall = data.form.id ? request.put('/comment/update', data.form) : request.post('/comment/add', data.form)
      apiCall.then(res => {
        if (res.code === '200') {
          ElMessage.success('评价成功')
          data.formVisible = false
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该订单记录吗？此操作不可恢复', '提示', { type: 'warning' }).then(() => {
    request.delete('/orders/delete/' + id).then(res => {
      if (res.code === '200') {
        load()
        ElMessage.success('删除成功')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {})
}
</script>

<style scoped>
.order-list-card {
  padding: 32px;
  min-height: 600px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.search-box {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 180px;
}

.order-no {
  font-family: monospace;
  font-weight: 600;
  color: var(--text-main);
}

.price-text {
  color: var(--danger-color);
  font-weight: 700;
}

.order-details {
  padding: 16px 48px;
  background-color: #f8fafc;
}

.detail-goods-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.pagination-container {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}
</style>
