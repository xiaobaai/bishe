<template>
  <div class="goods-page">
    <div class="goods-container">
      <!-- Filter Bar -->
      <div class="filter-card card">
        <div class="filter-row">
          <span class="filter-label">分类：</span>
          <div class="filter-options">
            <span 
              :class="['filter-item', !data.categoryId ? 'active' : '']" 
              @click="selectCategory(null)"
            >全部</span>
            <span 
              v-for="item in data.categoryList" 
              :key="item.id" 
              :class="['filter-item', data.categoryId == item.id ? 'active' : '']"
              @click="selectCategory(item.id)"
            >{{ item.name }}</span>
          </div>
        </div>
        
        <div class="filter-row search-row">
          <span class="filter-label">搜索：</span>
          <el-input 
            v-model="data.name" 
            placeholder="在分类中搜索商品..." 
            class="search-input"
            clearable
            @clear="load"
            @keyup.enter="load"
          >
            <template #append>
              <el-button icon="Search" @click="load" />
            </template>
          </el-input>
        </div>
      </div>

      <!-- Goods Listing -->
      <div class="goods-section">
        <div v-if="data.tableData.length === 0" class="empty-state">
          <el-empty description="没有找到相关商品" />
        </div>
        
        <div class="goods-grid" v-else>
          <div 
            class="goods-card" 
            v-for="item in data.tableData" 
            :key="item.id"
            @click="router.push('/front/goodsDetail?id=' + item.id)"
          >
            <div class="goods-img-wrapper">
              <img :src="resolveFileUrl(item.img)" class="goods-img">
              <div class="goods-tag" v-if="item.recommend === '是'">推荐</div>
            </div>
            <div class="goods-info">
              <div class="goods-name">{{ item.name }}</div>
              <div class="goods-desc">{{ item.description }}</div>
              <div class="goods-bottom">
                <div class="goods-price-box">
                  <span class="currency">￥</span>
                  <span class="price">{{ item.price }}</span>
                </div>
                <div class="goods-stats">
                  <span>{{ item.saleCount }}人付款</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination-container" v-if="data.total > 0">
          <el-pagination 
            background 
            layout="total, prev, pager, next" 
            v-model:current-page="data.pageNum" 
            v-model:page-size="data.pageSize" 
            :total="data.total" 
            @current-change="load"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from "vue";
import request, { resolveFileUrl } from "@/utils/request";
import router from "@/router";
import { useRoute } from 'vue-router';

const route = useRoute();
const data = reactive({
  name: route.query.name || null,
  categoryId: route.query.categoryId || null,
  categoryList: [],
  tableData: [],
  pageNum: 1,
  pageSize: 12,
  total: 0
})

const selectCategory = (id) => {
  data.categoryId = id;
  data.pageNum = 1;
  load();
}

const load = () => {
  request.get('/goods/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name,
      categoryId: data.categoryId,
      status: '上架'
    }
  }).then(res => {
    data.tableData = res.data?.list || [];
    data.total = res.data?.total || 0;
  })
}

// Watch for route changes to update filters
watch(() => route.query, (newQuery) => {
  data.name = newQuery.name || null;
  data.categoryId = newQuery.categoryId || null;
  load();
}, { deep: true });

onMounted(() => {
  request.get('/category/selectAll').then(res => {
    data.categoryList = res.data || [];
  })
  load();
})
</script>

<style scoped>
.goods-page {
  display: flex;
  justify-content: center;
}

.goods-container {
  width: 1200px;
  max-width: 95%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.filter-card {
  padding: 24px;
}

.filter-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-weight: 700;
  color: var(--text-main);
  width: 60px;
  padding-top: 4px;
}

.filter-options {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-item {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-sub);
}

.filter-item:hover {
  color: var(--primary-color);
}

.filter-item.active {
  background-color: var(--primary-color);
  color: #fff;
}

.search-row {
  align-items: center;
}

.search-input {
  max-width: 400px;
}

.search-input :deep(.el-input-group__append) {
  background-color: var(--primary-color);
  color: #fff;
  border-color: var(--primary-color);
}

.goods-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.goods-card {
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-color);
}

.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
  border-color: var(--primary-light);
}

.goods-img-wrapper {
  aspect-ratio: 1;
  position: relative;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.goods-card:hover .goods-img {
  transform: scale(1.05);
}

.goods-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #f56c6c;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.goods-info {
  padding: 16px;
}

.goods-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.goods-desc {
  font-size: 13px;
  color: var(--text-sub);
  margin-bottom: 16px;
  height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
}

.goods-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.goods-price-box {
  color: var(--danger-color);
}

.goods-price-box .currency {
  font-size: 14px;
  font-weight: 600;
}

.goods-price-box .price {
  font-size: 22px;
  font-weight: 700;
}

.goods-stats {
  font-size: 12px;
  color: var(--text-sub);
}

.pagination-container {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.empty-state {
  padding: 100px 0;
}
</style>
