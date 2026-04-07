<template>
  <div class="front-container">
    <div class="card cart-card">
      <div class="cart-header">
        <h2 class="cart-title">我的购物车</h2>
        <span class="cart-count" v-if="data.tableData.length">共 {{ data.tableData.length }} 件商品</span>
      </div>

      <el-table 
        :data="data.tableData" 
        stripe 
        @selection-change="handleSelectionChange"
        class="custom-table"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="商品信息" min-width="400">
          <template #default="scope">
            <div class="cart-goods-info">
              <el-image :src="resolveFileUrl(scope.row.goodsImg)" class="goods-img" :preview-src-list="[resolveFileUrl(scope.row.goodsImg)]" preview-teleported />
              <div class="goods-detail">
                <div class="goods-name">{{ scope.row.goodsName }}</div>
                <div class="goods-price">￥{{ scope.row.goodsPrice }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="200">
          <template #default="scope">
            <el-input-number 
              v-model="scope.row.num" 
              :min="1" 
              size="small"
              @change="changeNum(scope.row)" 
            />
          </template>
        </el-table-column>
        <el-table-column label="小计" width="150">
          <template #default="scope">
            <span class="subtotal">￥{{ (scope.row.goodsPrice * scope.row.num).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="danger" link @click="handleDelete(scope.row.id)" icon="Delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="data.tableData.length === 0" class="empty-cart">
        <el-empty description="购物车还是空的" :image-size="200">
          <el-button type="primary" @click="router.push('/front/home')">去逛逛</el-button>
        </el-empty>
      </div>

      <div class="cart-footer" v-if="data.tableData.length">
        <div class="footer-left">
          <el-button link @click="batchDelete" :disabled="!data.selectedRows.length">批量删除</el-button>
        </div>
        <div class="footer-right">
          <div class="total-info">
            <span class="label">已选 {{ data.selectedRows.length }} 件商品，合计：</span>
            <span class="total-price">￥{{ data.total }}</span>
          </div>
          <el-button 
            type="danger" 
            class="checkout-btn" 
            :disabled="data.selectedRows.length === 0" 
            @click="handleAddOrder"
          >
            立即结算
          </el-button>
        </div>
      </div>
    </div>

    <!-- 下单弹窗 -->
    <el-dialog title="确认订单" width="450px" v-model="data.formVisible" destroy-on-close class="order-dialog">
      <div class="order-summary">
        <div class="summary-item">
          <span>实付款</span>
          <span class="amount">￥{{ data.total }}</span>
        </div>
      </div>
      <el-form ref="formRef" :model="data.form" :rules="data.rules" label-width="80px" label-position="top">
        <el-form-item label="收货方式" prop="deliverType">
          <el-radio-group v-model="data.form.deliverType" class="deliver-radio">
            <el-radio label="自提" border>到店自提</el-radio>
            <el-radio label="外送" border>送货上门</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收货详细信息" prop="address" v-if="data.form.deliverType === '外送'">
          <el-input 
            v-model="data.form.address" 
            type="textarea" 
            :rows="3" 
            placeholder="请输入：联系人、联系电话、具体楼栋门牌号"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取消</el-button>
          <el-button type="danger" @click="addOrder">确认支付</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import request, { resolveFileUrl } from "@/utils/request";
import { reactive, ref } from "vue";
import router from "@/router";
import { ElMessageBox, ElMessage } from "element-plus";
import { Delete } from '@element-plus/icons-vue'

const formRef = ref()
const data = reactive({
  user: JSON.parse(localStorage.getItem('system-user') || '{}'),
  total: 0,
  formVisible: false,
  form: {
    deliverType: '自提'
  },
  tableData: [],
  selectedRows: [],
  rules: {
    deliverType: [{ required: true, message: '请选择配送方式', trigger: 'change' }],
    address: [{ required: true, message: '请输入详细收货信息', trigger: 'blur' }]
  }
})

const handleAddOrder = () => {
  data.form = { deliverType: '自提' }
  data.formVisible = true
}

const addOrder = () => {
  formRef.value.validate(valid => {
    if (valid) {
      data.form.userId = data.user.id
      data.form.cartList = data.selectedRows
      request.post('/orders/add', data.form).then(res => {
        if (res.code === '200') {
          ElMessage.success('下单成功')
          data.formVisible = false
          router.push('/front/userOrders')
        } else {
          ElMessage.error(res.msg)
        }
      })
    }
  })
}

const changeNum = (row) => {
  calTotal()
  request.put('/cart/update', row).then(res => {
    if (res.code !== '200') {
      ElMessage.error(res.msg)
    }
  })
}

const calTotal = () => {
  let total = 0
  data.selectedRows.forEach(item => {
    total += item.goodsPrice * item.num
  })
  data.total = total.toFixed(2)
}

const handleSelectionChange = (rows) => {
  data.selectedRows = rows
  calTotal()
}

const load = () => {
  request.get('/cart/selectAll', {
    params: { userId: data.user.id }
  }).then(res => {
    data.tableData = res.data || []
  })
}
load()

const handleDelete = (id) => {
  ElMessageBox.confirm('确认将该商品从购物车移除吗?', '提示', { type: 'warning' }).then(() => {
    request.delete('/cart/delete/' + id).then(res => {
      if (res.code === '200') {
        load()
        ElMessage.success('移除成功')
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(() => {})
}

const batchDelete = () => {
  ElMessageBox.confirm('确认移除选中的商品吗?', '提示', { type: 'warning' }).then(() => {
    const promises = data.selectedRows.map(row => request.delete('/cart/delete/' + row.id))
    Promise.all(promises).then(() => {
      load()
      ElMessage.success('批量移除成功')
    })
  }).catch(() => {})
}
</script>

<style scoped>
.cart-card {
  padding: 32px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
}

.cart-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.cart-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.cart-count {
  font-size: 14px;
  color: var(--text-sub);
}

.cart-goods-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.goods-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  flex-shrink: 0;
}

.goods-name {
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
  line-height: 1.4;
}

.goods-price {
  color: var(--text-sub);
  font-size: 14px;
}

.subtotal {
  color: var(--danger-color);
  font-weight: 700;
  font-size: 16px;
}

.empty-cart {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-footer {
  margin-top: 32px;
  padding: 24px;
  background-color: #f8fafc;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  display: inline-flex;
  align-items: baseline;
  margin-right: 24px;
}

.total-info .label {
  color: var(--text-sub);
  font-size: 14px;
}

.total-price {
  color: var(--danger-color);
  font-size: 28px;
  font-weight: 700;
}

.checkout-btn {
  height: 48px;
  padding: 0 40px;
  font-size: 16px;
  font-weight: 700;
}

.order-summary {
  background-color: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount {
  color: var(--danger-color);
  font-size: 20px;
  font-weight: 700;
}

.deliver-radio {
  display: flex;
  gap: 12px;
  width: 100%;
}

.deliver-radio :deep(.el-radio) {
  flex: 1;
  margin-right: 0;
  text-align: center;
}
</style>
