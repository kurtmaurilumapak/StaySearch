import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/system/LandingView.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('@/views/auth/Signup.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/Login.vue'),
    },
    {
      path: '/owner/post',
      name: 'post',
      component: () => import('@/views/system/owner/Post.vue'),
    },
    {
      path: '/owner/create',
      name: 'create',
      component: () => import('@/views/system/owner/CreatePost.vue'),
    }
  ]
})

export default router
