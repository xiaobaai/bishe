<template>
  <div class="front-layout">
    <!-- Header -->
    <div class="front-header">
      <div class="header-container">
        <div class="header-left">
          <div class="brand" @click="router.push('/front/home')">
            <img src="@/assets/imgs/logo.png" alt="" class="brand-logo">
            <div class="brand-title">社区二手交易</div>
          </div>
        </div>

        <div class="header-center">
          <el-menu 
            class="front-menu" 
            router 
            :default-active="router.currentRoute.value.path" 
            mode="horizontal"
            :ellipsis="false"
          >
            <el-menu-item index="/front/home">首页</el-menu-item>
            <el-menu-item index="/front/goods">精选商品</el-menu-item>
            <el-menu-item index="/front/cart">
              <el-badge :value="data.cartCount" :hidden="!data.cartCount" class="menu-badge">
                购物车
              </el-badge>
            </el-menu-item>
            <el-menu-item index="/front/userOrders">我的订单</el-menu-item>
          </el-menu>
        </div>

        <div class="header-right">
          <div class="search-box" v-if="router.currentRoute.value.path !== '/front/goods'">
            <el-input 
              @keyup.enter="search" 
              prefix-icon="Search" 
              class="header-search" 
              v-model="data.goodsName" 
              placeholder="搜索商品..."
              clearable
            />
          </div>
          
          <div class="user-action">
            <el-dropdown trigger="click">
              <div class="user-trigger">
                <el-avatar :size="36" :src="resolveFileUrl(data.user.avatar)">
                  <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                </el-avatar>
                <span class="user-name">{{ data.user.name || '用户' }}</span>
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                  <div class="user-dropdown-header">
                    <div class="header-name">{{ data.user.name }}</div>
                    <div class="header-account">余额：￥{{ data.user.account || '0.00' }}</div>
                  </div>
                  <el-dropdown-item divided @click="router.push('/front/userOrders')" icon="Document">我的订单</el-dropdown-item>
                  <el-dropdown-item @click="router.push('/front/userRecharge')" icon="Wallet">余额充值</el-dropdown-item>
                  <el-dropdown-item @click="router.push('/front/userCollect')" icon="Star">我的收藏</el-dropdown-item>
                  <el-dropdown-item @click="router.push('/front/userComment')" icon="ChatLineRound">评价管理</el-dropdown-item>
                  <el-dropdown-item divided @click="router.push('/front/person')" icon="User">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="router.push('/front/password')" icon="Lock">修改密码</el-dropdown-item>
                  <el-dropdown-item divided @click="logout" icon="SwitchButton" style="color: #f56c6c">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="front-main">
      <router-view @updateUser="updateUser" />
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import router from "@/router";
import { ElMessage } from "element-plus";
import Footer from "@/components/Footer.vue";
import { resolveFileUrl } from "@/utils/request";
import request from "@/utils/request";
import { ArrowDown, Search, Wallet, Star, ChatLineRound, User, Lock, SwitchButton, Document } from '@element-plus/icons-vue'

const data = reactive({
  user: JSON.parse(localStorage.getItem('system-user') || '{}'),
  goodsName: null,
  cartCount: 0
})

const search = () => {
  if (data.goodsName) {
    router.push('/front/goods?name=' + data.goodsName)
    data.goodsName = null
  }
}

const loadCartCount = () => {
  if (data.user?.id) {
    request.get('/cart/selectAll', { params: { userId: data.user.id } }).then(res => {
      data.cartCount = res.data?.length || 0
    })
  }
}

if (!data.user?.id) {
  ElMessage.error('请登录！')
  router.push('/login')
}

const logout = () => {
  localStorage.removeItem('system-user')
  router.push('/login')
  ElMessage.success('退出成功')
}

const updateUser = () => {
  data.user = JSON.parse(localStorage.getItem('system-user') || '{}')
  loadCartCount()
}

onMounted(() => {
  loadCartCount()
})
</script>

<style scoped>
.front-layout {
  min-height: 100vh;
  background-color: var(--bg-light);
  display: flex;
  flex-direction: column;
}

.front-header {
  height: 64px;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
}

.header-container {
  width: 1200px;
  max-width: 95%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.brand-logo {
  width: 32px;
  height: 32px;
}

.brand-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
  letter-spacing: 0.5px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
  min-width: 450px;
}

.front-menu {
  border-bottom: none !important;
  height: 64px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.front-menu :deep(.el-menu-item) {
  height: 64px;
  line-height: 64px;
  font-size: 15px;
  font-weight: 500;
  padding: 0 24px;
}

.front-menu :deep(.el-menu-item.is-active) {
  color: var(--primary-color) !important;
  border-bottom-width: 3px !important;
}

.menu-badge :deep(.el-badge__content) {
  top: 15px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-search {
  width: 220px;
}

.header-search :deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: #f1f3f6;
  box-shadow: none !important;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.header-search :deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  border-color: var(--primary-color);
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 24px;
  transition: all 0.3s;
}

.user-trigger:hover {
  background-color: #f5f7fa;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
}

.user-dropdown {
  width: 200px;
  padding: 8px 0;
}

.user-dropdown-header {
  padding: 12px 16px;
  background-color: #f8fafc;
  margin-bottom: 8px;
}

.header-name {
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.header-account {
  font-size: 12px;
  color: var(--danger-color);
  font-weight: 600;
}

.front-main {
  flex: 1;
  padding: 24px 0;
}
</style>
