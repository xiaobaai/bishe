import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/login' },
    {
      path: '/manager',
      component: () => import('@/views/Manager.vue'),
      redirect: '/manager/home',
      children: [
        { path: 'home', component: () => import('@/views/manager/Home.vue'), meta: { name: '系统首页' }},
        { path: 'admin', component: () => import('@/views/manager/Admin.vue'), meta: { name: '系统管理员' }},
        { path: 'user', component: () => import('@/views/manager/User.vue'), meta: { name: '普通用户' }},
        { path: 'person', component: () => import('@/views/manager/Person.vue'), meta: { name: '个人中心' }},
        { path: 'password', component: () => import('@/views/manager/Password.vue'), meta: { name: '修改密码' }},
        { path: 'category', component: () => import('@/views/manager/Category.vue'), meta: { name: '商品分类' }},
        { path: 'goods', component: () => import('@/views/manager/Goods.vue'), meta: { name: '商品管理' }},
        { path: 'carousel', component: () => import('@/views/manager/Carousel.vue'), meta: { name: '轮播图管理' }},
        { path: 'collect', component: () => import('@/views/manager/Collect.vue'), meta: { name: '收藏记录' }},
        { path: 'recharge', component: () => import('@/views/manager/Recharge.vue'), meta: { name: '充值记录' }},
        { path: 'orders', component: () => import('@/views/manager/Orders.vue'), meta: { name: '订单管理' }},
        { path: 'comment', component: () => import('@/views/manager/Comment.vue'), meta: { name: '评价管理' }},
        { path: 'dataManager', component: () => import('@/views/manager/DataManager.vue'), meta: { name: '数据分析' }},
      ]
    },
    {
      path: '/front',
      component: () => import('@/views/Front.vue'),
      redirect: '/front/home',
      children: [
        { path: 'home', component: () => import('@/views/front/Home.vue')},
        { path: 'person', component: () => import('@/views/front/Person.vue')},
        { path: 'password', component: () => import('@/views/front/Password.vue')},
        { path: 'goods', component: () => import('@/views/front/Goods.vue')},
        { path: 'goodsDetail', component: () => import('@/views/front/GoodsDetail.vue')},
        { path: 'userCollect', component: () => import('@/views/front/UserCollect.vue')},
        { path: 'userRecharge', component: () => import('@/views/front/UserRecharge.vue')},
        { path: 'cart', component: () => import('@/views/front/Cart.vue')},
        { path: 'userOrders', component: () => import('@/views/front/UserOrders.vue')},
        { path: 'userComment', component: () => import('@/views/front/UserComment.vue')},
      ]
    },
    { path: '/login', component: () => import('@/views/Login.vue') },
    { path: '/register', component: () => import('@/views/Register.vue') }
  ]
})

router.beforeEach(() => {
  window.scroll({ top: 0, behavior: "smooth" })
})

export default router
