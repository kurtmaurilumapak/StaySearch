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
      path: '/owner/dashboard',
      name: 'dashboard',
      component: () => import('@/views/system/owner/Dashboard.vue'),
    },
    {
      path: '/owner/posts',
      name: 'posts',
      component: () => import('@/views/system/owner/Posts.vue'),
    },
    {
      path: '/owner/create',
      name: 'create',
      component: () => import('@/views/system/owner/CreatePost.vue'),
    },
    {
      path: '/owner/reservations',
      name: 'reservatios',
      component: () => import('@/views/system/owner/Reservations.vue'),
    },
    {
      path: '/owner/settings',
      name: 'owner settings',
      component: () => import('@/views/system/owner/OwnerSettings.vue'),
    },
    {
      path: '/student/page',
      name: 'student',
      component: () => import('@/views/system/student/StudentInterface.vue'),
    },
  ]
})

export default router
