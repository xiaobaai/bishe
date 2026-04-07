<template>
  <div class="home-container">
    <div class="home-content">
      <!-- Left: Category and Carousel -->
      <div class="home-hero">
        <div class="category-sidebar card">
          <div class="category-header">商品分类</div>
          <div class="category-list">
            <div 
              class="category-item" 
              v-for="item in data.categoryList" 
              :key="item.id"
              @click="router.push('/front/goods?categoryId=' + item.id)"
            >
              <span class="category-name">{{ item.name }}</span>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <div class="carousel-box">
          <el-carousel height="400px" border-radius="12px">
            <el-carousel-item v-for="item in data.carouselList" :key="item.id">
              <img :src="resolveFileUrl(item.img)" class="carousel-img" @click="router.push('/front/goodsDetail?id=' + item.goodsId)">
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <!-- Main Sections -->
      <div class="sections-container">
        <!-- Hot/Latest Tabs -->
        <div class="main-section card">
          <el-tabs v-model="data.activeTab" class="section-tabs">
            <el-tab-pane label="最新发布" name="latest">
              <div class="goods-grid">
                <div 
                  class="goods-card" 
                  v-for="item in data.latestGoods" 
                  :key="item.id"
                  @click="router.push('/front/goodsDetail?id=' + item.id)"
                >
                  <div class="goods-img-wrapper">
                    <img :src="resolveFileUrl(item.img)" class="goods-img">
                  </div>
                  <div class="goods-info">
                    <div class="goods-name">{{ item.name }}</div>
                    <div class="goods-bottom">
                      <div class="goods-price">￥{{ item.price }}</div>
                      <div class="goods-stats">{{ item.saleCount }}人付款</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="热销排行" name="hot">
              <div class="goods-grid">
                <div 
                  class="goods-card" 
                  v-for="item in data.hotGoods" 
                  :key="item.id"
                  @click="router.push('/front/goodsDetail?id=' + item.id)"
                >
                  <div class="goods-img-wrapper">
                    <img :src="resolveFileUrl(item.img)" class="goods-img">
                  </div>
                  <div class="goods-info">
                    <div class="goods-name">{{ item.name }}</div>
                    <div class="goods-bottom">
                      <div class="goods-price">￥{{ item.price }}</div>
                      <div class="goods-stats">{{ item.saleCount }}人付款</div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div class="view-more">
            <el-button link @click="router.push('/front/goods')">查看全部商品 <el-icon><ArrowRight /></el-icon></el-button>
          </div>
        </div>

        <!-- Right: Recommendations -->
        <div class="recommend-section card">
          <div class="section-header">为您推荐</div>
          <div class="recommend-list">
            <div 
              class="recommend-item" 
              v-for="item in data.recommendGoods" 
              :key="item.id"
              @click="router.push('/front/goodsDetail?id=' + item.id)"
            >
              <img :src="resolveFileUrl(item.img)" class="recommend-img">
              <div class="recommend-info">
                <div class="recommend-name">{{ item.name }}</div>
                <div class="recommend-price">￥{{ item.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import request, { resolveFileUrl } from "@/utils/request";
import router from "@/router";
import { ArrowRight } from '@element-plus/icons-vue'

const data = reactive({
  carouselList: [],
  categoryList: [],
  recommendGoods: [],
  latestGoods: [],
  hotGoods: [],
  activeTab: 'latest'
})

onMounted(() => {
  request.get('/carousel/selectAll').then(res => {
    data.carouselList = res.data || []
  })
  request.get('/category/selectAll').then(res => {
    data.categoryList = res.data || []
  })
  request.get('/goods/selectAll', { params: { recommend: '是' } }).then(res => {
    data.recommendGoods = res.data?.slice(0, 6) || []
  })
  request.get('/goods/selectPage', { params: { pageNum: 1, pageSize: 8 } }).then(res => {
    data.latestGoods = res.data?.list || []
  })
  request.get('/goods/selectPage', { params: { pageNum: 1, pageSize: 8 } }).then(res => {
    // Assuming hot is same as latest for now, or you can add a sort param if backend supports it
    data.hotGoods = (res.data?.list || []).sort((a, b) => b.saleCount - a.saleCount)
  })
})
</script>

<style scoped>
.home-container {
  display: flex;
  justify-content: center;
}

.home-content {
  width: 1200px;
  max-width: 95%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-hero {
  display: flex;
  gap: 24px;
  height: 400px;
}

.category-sidebar {
  width: 240px;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
}

.category-header {
  padding: 0 20px 12px;
  font-weight: 700;
  font-size: 16px;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 8px;
}

.category-list {
  flex: 1;
  overflow-y: auto;
}

.category-item {
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-sub);
}

.category-item:hover {
  background-color: var(--primary-light);
  color: var(--primary-color);
}

.carousel-box {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--card-shadow);
}

.carousel-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
}

.sections-container {
  display: flex;
  gap: 24px;
}

.main-section {
  flex: 1;
  padding: 24px;
  position: relative;
}

.section-tabs :deep(.el-tabs__item) {
  font-size: 18px;
  font-weight: 700;
  height: 48px;
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 16px;
}

.goods-card {
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid transparent;
}

.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  border-color: var(--primary-light);
}

.goods-img-wrapper {
  aspect-ratio: 1;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.goods-info {
  padding: 12px;
}

.goods-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 40px;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price {
  color: var(--danger-color);
  font-size: 18px;
  font-weight: 700;
}

.goods-stats {
  font-size: 12px;
  color: var(--text-sub);
}

.view-more {
  margin-top: 24px;
  text-align: center;
}

.recommend-section {
  width: 280px;
  padding: 24px;
}

.section-header {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--text-main);
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recommend-item {
  display: flex;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.recommend-item:hover {
  opacity: 0.8;
}

.recommend-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
}

.recommend-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recommend-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-main);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommend-price {
  color: var(--danger-color);
  font-weight: 700;
}
</style>
