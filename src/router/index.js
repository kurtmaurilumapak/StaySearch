import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/system/LandingView.vue')
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: () => import('@/views/system/AccessDenied.vue'),
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
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/owner/posts',
      name: 'posts',
      component: () => import('@/views/system/owner/Posts.vue'),
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/owner/create',
      name: 'create',
      component: () => import('@/views/system/owner/CreatePost.vue'),
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/owner/reservations',
      name: 'reservations',
      component: () => import('@/views/system/owner/Reservations.vue'),
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/owner/map',
      name: 'map',
      component: () => import('@/views/system/owner/map.vue'),
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/system/Settings.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/student/page',
      name: 'student',
      component: () => import('@/views/system/student/StudentInterface.vue'),
      meta: { requiresAuth: true, role: 'student' },
    },
  ]
})


router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  const userRole = session?.user?.user_metadata?.role;

  const isAuthenticated = !!session;

  if (isAuthenticated && (to.name === 'login' || to.name === 'signup' || to.name === 'landing')) {
    if (userRole === 'owner') {
      return next({ name: 'dashboard' });
    } else if (userRole === 'student') {
      return next({ name: 'student' });
    } else {
      return next({ name: 'landing' });
    }
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated ) {
      return next({ name: 'login' });
    }

    if (to.meta.role && userRole !== to.meta.role) {
      console.log('Access denied: user role does not match');
      return next({ name: 'unauthorized' });
    }
  }

  next();
});

export default router
