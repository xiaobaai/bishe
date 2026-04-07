<template>
  <div class="manager-layout">
    <!-- Header -->
    <div class="manager-header">
      <div class="header-left">
        <img src="@/assets/imgs/logo.png" alt="" class="logo">
        <span class="title">社区二手交易管理后台</span>
      </div>
      
      <div class="header-right">
        <el-tooltip content="返回前台" placement="bottom">
          <div class="action-item" @click="router.push('/front/home')">
            <el-icon><Monitor /></el-icon>
          </div>
        </el-tooltip>
        
        <el-dropdown trigger="click">
          <div class="user-profile">
            <img class="avatar" :src="resolveFileUrl(data.user.avatar) || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="">
            <span class="username">{{ data.user.name || '管理员' }}</span>
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/manager/person')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="router.push('/manager/password')">修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="logout" style="color: #f56c6c">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <div class="manager-body">
      <!-- Sidebar -->
      <div class="manager-sidebar">
        <el-menu
            router
            class="side-menu"
            :default-active="router.currentRoute.value.path"
            :default-openeds="['biz', 'user']"
        >
          <el-menu-item index="/manager/home">
            <el-icon><House /></el-icon>
            <span>系统首页</span>
          </el-menu-item>
          
          <el-menu-item index="/manager/dataManager">
            <el-icon><PieChart /></el-icon>
            <span>数据分析</span>
          </el-menu-item>
          
          <el-sub-menu index="biz">
            <template #title>
              <el-icon><Files /></el-icon>
              <span>业务管理</span>
            </template>
            <el-menu-item index="/manager/orders">
              <el-icon><Document /></el-icon>
              <span>订单管理</span>
            </el-menu-item>
            <el-menu-item index="/manager/category">
              <el-icon><CollectionTag /></el-icon>
              <span>商品分类</span>
            </el-menu-item>
            <el-menu-item index="/manager/goods">
              <el-icon><ShoppingBag /></el-icon>
              <span>商品管理</span>
            </el-menu-item>
            <el-menu-item index="/manager/carousel">
              <el-icon><Picture /></el-icon>
              <span>轮播图管理</span>
            </el-menu-item>
            <el-menu-item index="/manager/comment">
              <el-icon><ChatLineRound /></el-icon>
              <span>评价管理</span>
            </el-menu-item>
            <el-menu-item index="/manager/collect">
              <el-icon><Star /></el-icon>
              <span>收藏记录</span>
            </el-menu-item>
            <el-menu-item index="/manager/recharge">
              <el-icon><Wallet /></el-icon>
              <span>充值记录</span>
            </el-menu-item>
          </el-sub-menu>
          
          <el-sub-menu index="user">
            <template #title>
              <el-icon><User /></el-icon>
              <span>用户权限</span>
            </template>
            <el-menu-item index="/manager/user">
              <el-icon><UserFilled /></el-icon>
              <span>普通用户</span>
            </el-menu-item>
            <el-menu-item index="/manager/admin">
              <el-icon><Avatar /></el-icon>
              <span>系统管理员</span>
            </el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      
      <!-- Content Area -->
      <div class="manager-content">
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/manager/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="router.currentRoute.value.meta.name">{{ router.currentRoute.value.meta.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="content-view">
          <router-view @updateUser="updateUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import router from "@/router";
import { ElMessage } from "element-plus";
import { resolveFileUrl } from "@/utils/request";
import { 
  House, PieChart, Files, Document, CollectionTag, 
  ShoppingBag, Picture, ChatLineRound, Star, Wallet, 
  User, UserFilled, Avatar, Monitor, ArrowDown 
} from '@element-plus/icons-vue'

const data = reactive({
  user: JSON.parse(localStorage.getItem('system-user') || '{}')
})

if (!data.user?.id) {
  ElMessage.error('请登录！')
  router.push('/login')
}

const updateUser = () => {
  data.user = JSON.parse(localStorage.getItem('system-user') || '{}')
}

const logout = () => {
  localStorage.removeItem('system-user')
  router.push('/login')
  ElMessage.success('退出成功')
}
</script>

<style scoped>
.manager-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-light);
}

.manager-header {
  height: 64px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 32px;
  height: 32px;
}

.title {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
  letter-spacing: 0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-item {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-sub);
  transition: all 0.3s;
}

.action-item:hover {
  background-color: #f0f2f5;
  color: var(--primary-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 20px;
  transition: all 0.3s;
  border: 1px solid transparent;
}

.user-profile:hover {
  background-color: #fff;
  border-color: var(--border-color);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border-color);
}

.username {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
}

.manager-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.manager-sidebar {
  width: 240px;
  background-color: #fff;
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.side-menu {
  border-right: none !important;
  padding: 12px;
}

:deep(.el-menu-item), :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  border-radius: 8px;
  margin-bottom: 4px;
  color: var(--text-sub) !important;
}

:deep(.el-menu-item:hover), :deep(.el-sub-menu__title:hover) {
  background-color: var(--primary-light) !important;
  color: var(--primary-color) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--primary-color) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.3);
}

.manager-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breadcrumb-container {
  padding: 0 4px;
}

.content-view {
  flex: 1;
}
</style>
