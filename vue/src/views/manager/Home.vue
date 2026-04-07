<template>
  <div class="home-container">
    <!-- Welcome Section -->
    <div class="card welcome-card">
      <div class="welcome-text">
        <h1>欢迎回来，{{ data.user.name }}！</h1>
        <p>今天是 {{ new Date().toLocaleDateString() }}，又是充满活力的一天. 以下是系统当前的运行概况。</p>
      </div>
      <img src="@/assets/imgs/logo.png" alt="" class="welcome-img">
    </div>

    <!-- Stats Section -->
    <div class="stats-grid">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="card stat-card">
            <div class="stat-icon orders"><el-icon><Document /></el-icon></div>
            <div class="stat-info">
              <div class="stat-label">今日订单</div>
              <div class="stat-value">{{ data.count.todayOrderCount || 0 }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="card stat-card">
            <div class="stat-icon revenue"><el-icon><Wallet /></el-icon></div>
            <div class="stat-info">
              <div class="stat-label">今日交易额</div>
              <div class="stat-value">￥{{ data.count.today || '0.00' }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20">
      <el-col :span="24">
        <div class="card quick-actions">
          <div class="section-title">快捷操作</div>
          <div class="action-grid">
            <div class="action-btn" @click="router.push('/manager/goods')">
              <div class="btn-icon goods"><el-icon><ShoppingBag /></el-icon></div>
              <span>商品审核</span>
            </div>
            <div class="action-btn" @click="router.push('/manager/orders')">
              <div class="btn-icon orders"><el-icon><Document /></el-icon></div>
              <span>订单处理</span>
            </div>
            <div class="action-btn" @click="router.push('/manager/comment')">
              <div class="btn-icon comment"><el-icon><ChatLineRound /></el-icon></div>
              <span>评价管理</span>
            </div>
            <div class="action-btn" @click="router.push('/manager/dataManager')">
              <div class="btn-icon data"><el-icon><PieChart /></el-icon></div>
              <span>查看报表</span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import router from "@/router";
import request from "@/utils/request";
import { 
  UserFilled, ShoppingBag, Document, Wallet, 
  CaretTop, CaretBottom, ChatLineRound, PieChart 
} from '@element-plus/icons-vue'

const data = reactive({
  user: JSON.parse(localStorage.getItem('system-user') || '{}'),
  count: {}
})

onMounted(() => {
  request.get('/count').then(res => {
    if (res.code === '200') {
      data.count = res.data
    }
  })
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 40px;
  background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%);
  position: relative;
  overflow: hidden;
}

.welcome-card::after {
  content: '';
  position: absolute;
  right: -20px;
  top: -20px;
  width: 150px;
  height: 150px;
  background: var(--primary-color);
  opacity: 0.05;
  border-radius: 50%;
}

.welcome-text h1 {
  font-size: 24px;
  margin: 0 0 12px 0;
  color: var(--primary-color);
}

.welcome-text p {
  color: var(--text-sub);
  margin: 0;
}

.welcome-img {
  width: 100px;
  height: 100px;
  z-index: 1;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-icon.users { background-color: #eef2ff; color: #4361ee; }
.stat-icon.goods { background-color: #ecfdf5; color: #10b981; }
.stat-icon.orders { background-color: #fff7ed; color: #f59e0b; }
.stat-icon.revenue { background-color: #fef2f2; color: #ef4444; }

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--text-sub);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.stat-trend {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.stat-trend.up { color: #10b981; }
.stat-trend.down { color: #ef4444; }

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
}

.activity-section {
  height: 100%;
}

.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  background-color: #f8fafc;
  transition: background 0.3s;
}

.announcement-item:hover {
  background-color: #f1f5f9;
}

.announcement-tag {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #e2e8f0;
  color: #64748b;
}

.announcement-tag.urgent {
  background-color: #fee2e2;
  color: #ef4444;
}

.announcement-content {
  flex: 1;
  font-size: 14px;
}

.announcement-time {
  font-size: 12px;
  color: var(--text-sub);
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #f8fafc;
}

.action-btn:hover {
  background-color: var(--primary-light);
  transform: scale(1.02);
}

.action-btn span {
  font-size: 14px;
  font-weight: 500;
}

.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.btn-icon.goods { background-color: #ecfdf5; color: #10b981; }
.btn-icon.orders { background-color: #fff7ed; color: #f59e0b; }
.btn-icon.comment { background-color: #e0f2fe; color: #0ea5e9; }
.btn-icon.data { background-color: #f5f3ff; color: #8b5cf6; }

.quick-actions {
  height: 100%;
}
</style>
