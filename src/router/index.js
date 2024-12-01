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
      path: '/admin/login',
      name: 'adminLogin',
      component: () => import('@/views/auth/AdminLogin.vue'),
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
    {
      path: '/admin/request',
      name: 'adminRequest',
      component: () => import('@/views/system/admin/Request.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/approved',
      name: 'adminApproved',
      component: () => import('@/views/system/admin/Approved.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/admin/dashboard',
      name: 'adminDashboard',
      component: () => import('@/views/system/admin/Dashboard.vue'),
      meta: { requiresAuth: true, role: 'admin' },
    },
    {
      path: '/user/select',
      name: 'select',
      component: () => import('@/views/auth/RoleSelection.vue'),
      meta: { requiresAuth: true},
    },
  ]
})


router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession();
  const userRole = session?.user?.user_metadata?.role;

  const isAuthenticated = !!session;
  if (isAuthenticated && to.name === 'select') {
    if (userRole === 'owner') {
      return next({ name: 'dashboard' });
    } else if (userRole === 'student') {
      return next({ name: 'student' });
    }
  }

  if (isAuthenticated && (to.name === 'login' || to.name === 'signup' || to.name === 'landing' || to.name === 'adminLogin')) {
    if (userRole === 'owner') {
      return next({ name: 'dashboard' });
    } else if (userRole === 'student') {
      return next({ name: 'student' });
    } else if (userRole === 'admin') {
      return next({ name: 'adminDashboard' });
    }
    else {
      return next({ name: 'select' });
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
