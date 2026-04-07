<template>
  <div class="front-container">
    <!-- 商品基本信息卡片 -->
    <div class="card product-main-card">
      <div class="product-visual">
        <el-image :src="data.goods.img" class="detail-main-img" :preview-src-list="[data.goods.img]" preview-teleported />
      </div>
      
      <div class="product-essential">
        <div class="product-header">
          <h1 class="product-title">
            <el-tag v-if="data.goods.recommend === '是'" type="danger" effect="dark" class="recommend-tag">推荐</el-tag>
            {{ data.goods.name }}
          </h1>
          <div class="collect-action">
            <div class="action-item" @click="addCollect" v-if="!data.userCollect?.id">
              <el-icon size="20"><Star /></el-icon>
              <span>收藏</span>
            </div>
            <div class="action-item collected" @click="removeCollect" v-if="data.userCollect?.id">
              <el-icon size="20"><StarFilled /></el-icon>
              <span>已收藏</span>
            </div>
          </div>
        </div>

        <div class="product-price-row">
          <div class="price-box">
            <span class="currency">￥</span>
            <span class="price">{{ data.goods.price }}</span>
          </div>
          <div class="product-stats">
            <span class="stat-item">累计销量 <b>{{ data.goods.saleCount }}</b></span>
            <span class="divider"></span>
            <span class="stat-item">库存 <b>{{ data.goods.store }}</b></span>
          </div>
        </div>

        <div class="product-desc-box">
          <div class="desc-label">商品简介</div>
          <p class="desc-content">{{ data.goods.description }}</p>
        </div>

        <div class="product-buy-zone">
          <div class="buy-item">
            <span class="label">数量</span>
            <el-input-number v-model="data.num" :min="1" :max="data.goods.store" controls-position="right" />
          </div>
          <div class="buy-actions">
            <el-button class="cart-btn" @click="addCart" plain icon="ShoppingCart">加入购物车</el-button>
            <el-button class="buy-btn" type="danger" @click="handleAddOrder" icon="Wallet">立即购买</el-button>
          </div>
        </div>
        
        <div class="trust-badge">
          <el-icon><CircleCheckFilled /></el-icon>
          <span>平台先行赔付 · 社区实名认证 · 担保交易</span>
        </div>
      </div>
    </div>

    <!-- 详情与评价标签页 -->
    <div class="card product-tabs-card">
      <el-tabs v-model="data.current" class="custom-tabs">
        <el-tab-pane label="商品详情" name="商品详情">
          <div class="detail-content" v-html="data.goods.content"></div>
        </el-tab-pane>
        <el-tab-pane label="用户评价" name="商品评价">
          <div class="comment-section">
            <div v-if="data.commentList.length === 0" class="empty-comment">
              <el-empty description="暂无评价" :image-size="100" />
            </div>
            <div v-else class="comment-list">
              <div v-for="item in data.commentList" :key="item.id" class="comment-item">
                <el-avatar :size="48" :src="item.userAvatar" />
                <div class="comment-body">
                  <div class="comment-header">
                    <span class="user-name">{{ item.userName }}</span>
                    <span class="comment-time">{{ item.time }}</span>
                  </div>
                  <el-rate v-model="item.score" disabled show-score score-template="{value} 分" />
                  <p class="comment-text">{{ item.content }}</p>
                </div>
              </div>
              <div class="pagination-wrapper">
                <el-pagination 
                  @current-change="loadComment" 
                  background 
                  layout="total, prev, pager, next" 
                  v-model:page-size="data.pageSize" 
                  v-model:current-page="data.pageNum" 
                  :total="data.total"
                />
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 下单弹窗 -->
    <el-dialog title="确认订单" width="450px" v-model="data.formVisible" destroy-on-close class="order-dialog">
      <div class="order-summary">
        <div class="summary-item">
          <span>商品金额</span>
          <span class="amount">￥{{ (data.goods.price * data.num).toFixed(2) }}</span>
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
import { reactive, ref } from "vue";
import router from "@/router";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { Star, StarFilled, CircleCheckFilled, ShoppingCart, Wallet } from '@element-plus/icons-vue'

const formRef = ref()
const data = reactive({
  user: JSON.parse(localStorage.getItem('system-user') || '{}'),
  id: router.currentRoute.value.query.id,
  goods: {},
  num: 1,
  current: '商品详情',
  commentList: [],
  pageNum: 1,
  pageSize: 5,
  total: 0,
  userCollect: {},
  form: {
    deliverType: '自提'
  },
  formVisible: false,
  rules: {
    deliverType: [{ required: true, message: '请选择配送类型', trigger: 'change' }],
    address: [{ required: true, message: '请输入详细收货信息', trigger: 'blur' }]
  }
})

const loadComment = () => {
  request.get('/comment/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      goodsId: data.id
    }
  }).then(res => {
    data.commentList = res.data?.list || []
    data.total = res.data?.total || 0
  })
}
loadComment()

const handleAddOrder = () => {
  data.form = { deliverType: '自提' }
  data.formVisible = true
}

const addOrder = () => {
  formRef.value.validate(valid => {
    if (valid) {
      data.form.userId = data.user.id
      data.form.cartList = [ {goodsId: data.id, num: data.num } ]
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

const addCart = () => {
  request.post('/cart/add', { goodsId: data.id, num: data.num, userId: data.user.id }).then(res => {
    if (res.code === '200') {
      ElMessage.success('已加入购物车')
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const loadCollect = () => {
  request.get('/collect/selectAll', {
    params: { goodsId: data.id, userId: data.user.id }
  }).then(res => {
    data.userCollect = res.data?.length > 0 ? res.data[0] : {}
  })
}
loadCollect()

const removeCollect = () => {
  request.delete('/collect/delete/' + data.userCollect.id).then(res => {
    if (res.code === '200') {
      ElMessage.success('已取消收藏')
      loadCollect()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const addCollect = () => {
  request.post('/collect/add', { goodsId: data.id, userId: data.user.id }).then(res => {
    if (res.code === '200') {
      ElMessage.success('收藏成功')
      loadCollect()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const load = () => {
  request.get('/goods/selectById/' + data.id).then(res => {
    data.goods = res.data || {}
  })
}
load()
</script>

<style scoped>
.product-main-card {
  display: flex;
  gap: 40px;
  padding: 40px;
  margin-bottom: 24px;
}

.product-visual {
  width: 400px;
  flex-shrink: 0;
}

.detail-main-img {
  width: 400px;
  height: 400px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid var(--border-color);
}

.product-essential {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.product-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--text-main);
  line-height: 1.4;
  flex: 1;
}

.recommend-tag {
  vertical-align: middle;
  margin-top: -4px;
}

.collect-action {
  margin-left: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  color: var(--text-sub);
  transition: all 0.3s;
}

.action-item:hover {
  color: var(--primary-color);
}

.action-item.collected {
  color: #f59e0b;
}

.product-price-row {
  background-color: #f8fafc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.price-box {
  color: var(--danger-color);
  margin-bottom: 8px;
}

.currency {
  font-size: 18px;
  font-weight: 600;
}

.price {
  font-size: 32px;
  font-weight: 700;
}

.product-stats {
  font-size: 13px;
  color: var(--text-sub);
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-stats b {
  color: var(--text-main);
}

.divider {
  width: 1px;
  height: 12px;
  background-color: var(--border-color);
}

.product-desc-box {
  margin-bottom: 24px;
}

.desc-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-main);
}

.desc-content {
  color: var(--text-sub);
  line-height: 1.6;
  margin: 0;
}

.product-buy-zone {
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px dashed var(--border-color);
}

.buy-item {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.buy-item .label {
  font-weight: 600;
  color: var(--text-main);
}

.buy-actions {
  display: flex;
  gap: 12px;
}

.cart-btn, .buy-btn {
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  font-weight: 600;
}

.cart-btn {
  border-color: var(--danger-color);
  color: var(--danger-color);
}

.cart-btn:hover {
  background-color: #fff1f2;
}

.trust-badge {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #10b981;
}

.product-tabs-card {
  padding: 0 20px 20px;
}

.custom-tabs :deep(.el-tabs__item) {
  height: 60px;
  font-size: 16px;
  font-weight: 600;
}

.detail-content {
  padding: 20px;
  line-height: 1.8;
}

.detail-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.user-name {
  font-weight: 600;
  color: var(--text-main);
}

.comment-time {
  font-size: 13px;
  color: var(--text-sub);
}

.comment-text {
  margin: 12px 0 0;
  color: var(--text-main);
  line-height: 1.6;
}

.pagination-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
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
