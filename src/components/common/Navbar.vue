<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dashboardIcon from '@/assets/navbar/dashboard.png';
import postsIcon from '@/assets/navbar/post.png';
import reservationsIcon from '@/assets/navbar/reservation.png';
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/userStore.js'

const router = useRouter()
const route = useRoute()
const theme = useTheme()
const useAuth = useAuthStore()
const userStore = useUserStore()

const nav = ref({
  navItems: [
    { 
      title: 'Dashboard', 
      path: '/owner/dashboard', 
      icon: dashboardIcon,
      mdiIcon: 'mdi-view-dashboard',
      description: 'Overview & Analytics'
    },
    { 
      title: 'Posts', 
      path: '/owner/posts', 
      icon: postsIcon,
      mdiIcon: 'mdi-post-outline',
      description: 'Manage Listings'
    },
    { 
      title: 'Reservations', 
      path: '/owner/reservations', 
      icon: reservationsIcon,
      mdiIcon: 'mdi-calendar-check',
      description: 'Booking Management'
    },
  ],
  profile: {
    menu: false
  }
})

const isActive = (path) => {
  return route.path === path
}

const logout = async () => {
  await useAuth.signOut()
  window.location.reload();
  theme.global.name.value = 'light'
  await router.push('/login')
}

onMounted(async () => {
  await userStore.fetchUserData()
})

const currentTime = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
})
</script>

<template>
  <v-navigation-drawer 
    permanent
    class="modern-sidebar"
    :width="280"
  >
    <!-- Brand Header -->
    <div class="sidebar-header">
      <div class="brand-section">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="Logo" class="brand-logo" />
        </div>
        <div class="brand-info">
          <h3 class="brand-title">StaySearch</h3>
          <p class="brand-subtitle">Owner Portal</p>
        </div>
      </div>
    </div>

    <!-- Profile Section -->
    <div class="profile-section">
      <v-menu
        v-model="nav.profile.menu"
        location="bottom"
        transition="slide-y-transition"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ props }">
          <div class="profile-card" v-bind="props">
            <v-avatar
              size="48"
              class="profile-avatar"
            >
              <v-img
                alt="Profile"
                :src="userStore.userData.picture || '/csu.png'"
              ></v-img>
              <div class="avatar-status"></div>
            </v-avatar>
            <div class="profile-info">
              <p class="profile-name">{{ userStore.userData.name }}</p>
              <p class="profile-role">Property Owner</p>
            </div>
            <v-icon class="profile-chevron" size="20">mdi-chevron-down</v-icon>
          </div>
        </template>

        <v-card class="profile-menu" elevation="8" rounded="xl">
          <v-card-text class="pa-4">
            <!-- Profile Header in Menu -->
            <div class="menu-profile-header">
              <v-avatar size="64" class="mb-3">
                <v-img
                  alt="Profile"
                  :src="userStore.userData.picture || '/csu.png'"
                ></v-img>
              </v-avatar>
              <h3 class="menu-profile-name">{{ userStore.userData.name }}</h3>
              <p class="menu-profile-email">{{ userStore.userData.email }}</p>
              <v-chip 
                size="small" 
                color="green" 
                variant="flat"
                class="mt-2"
              >
                <v-icon start size="16">mdi-key</v-icon>
                Owner Access
              </v-chip>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Greeting -->
            <div class="menu-greeting">
              <v-icon color="orange" size="20">mdi-white-balance-sunny</v-icon>
              <span>{{ currentTime }}, {{ userStore.userData.name?.split(' ')[0] }}!</span>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Menu Actions -->
            <div class="menu-actions">
              <v-btn
                variant="text"
                prepend-icon="mdi-account-cog"
                class="menu-action-btn"
                block
                rounded="lg"
                @click="$router.push('/settings')"
              >
                Account Settings
              </v-btn>
              <v-btn
                variant="text"
                prepend-icon="mdi-help-circle"
                class="menu-action-btn"
                block
                rounded="lg"
              >
                Help & Support
              </v-btn>
            </div>

            <v-divider class="my-4"></v-divider>

            <!-- Logout Button -->
            <v-btn
              color="red"
              variant="flat"
              prepend-icon="mdi-logout"
              block
              rounded="lg"
              class="logout-btn"
              @click="logout"
            >
              Sign Out
            </v-btn>
          </v-card-text>
        </v-card>
      </v-menu>
    </div>

    <v-divider class="sidebar-divider"></v-divider>

    <!-- Navigation Items -->
    <div class="nav-section">
      <p class="nav-label">MAIN MENU</p>
      <div class="nav-items">
        <RouterLink
          v-for="(item, index) in nav.navItems"
          :key="index"
          :to="item.path"
          class="nav-item"
          :class="{ 'nav-item-active': isActive(item.path) }"
        >
          <div class="nav-item-content">
            <div class="nav-icon-wrapper">
              <img :src="item.icon" alt="icon" class="nav-custom-icon" />
            </div>
            <div class="nav-text">
              <span class="nav-title">{{ item.title }}</span>
              <span class="nav-description">{{ item.description }}</span>
            </div>
          </div>
          <div class="nav-item-indicator"></div>
        </RouterLink>
      </div>
    </div>

    <!-- Bottom Section -->
    <template v-slot:append>
      <div class="sidebar-footer">
        <!-- Version Info -->
        <div class="version-info">
          <p class="version-text">Version 2.1.0</p>
          <p class="copyright-text">© 2025 StaySearch</p>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
/* Modern Sidebar */
.modern-sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f8faf9 100%) !important;
  border-right: 1px solid rgba(0, 0, 0, 0.08) !important;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.04) !important;
}

/* Brand Header */
.sidebar-header {
  padding: 24px 20px;
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  position: relative;
  overflow: hidden;
}

.sidebar-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.logo-container {
  background: white;
  padding: 10px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.brand-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.brand-info {
  flex: 1;
}

.brand-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 2px 0 0 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Profile Section */
.profile-section {
  padding: 16px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 14px;
  background: white;
  border: 2px solid #e8f5e9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.profile-card:hover {
  background: #f1f8f4;
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}

.profile-avatar {
  position: relative;
  border: 2px solid #4caf50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.2);
}

.avatar-status {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1b5e20;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-role {
  font-size: 0.75rem;
  color: #66bb6a;
  margin: 2px 0 0 0;
  font-weight: 600;
}

.profile-chevron {
  color: #9e9e9e;
  transition: transform 0.3s ease;
}

.profile-card:hover .profile-chevron {
  transform: translateY(2px);
  color: #4caf50;
}

/* Profile Menu */
.profile-menu {
  min-width: 320px;
  margin-top: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.menu-profile-header {
  text-align: center;
}

.menu-profile-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #212121;
  margin: 0;
}

.menu-profile-email {
  font-size: 0.85rem;
  color: #757575;
  margin: 4px 0 0 0;
}

.menu-greeting {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff8e1;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #f57c00;
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-action-btn {
  justify-content: flex-start;
  text-transform: none;
  font-weight: 600;
  color: #616161;
}

.menu-action-btn:hover {
  background: #f5f5f5;
  color: #2e7d32;
}

.logout-btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Sidebar Divider */
.sidebar-divider {
  margin: 0 16px;
  opacity: 0.5;
}

/* Navigation Section */
.nav-section {
  padding: 20px 16px;
  flex: 1;
  overflow-y: auto;
}

.nav-section::-webkit-scrollbar {
  width: 4px;
}

.nav-section::-webkit-scrollbar-thumb {
  background: #c8e6c9;
  border-radius: 4px;
}

.nav-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #9e9e9e;
  margin: 0 0 12px 12px;
  letter-spacing: 1.2px;
  text-transform: uppercase;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-item {
  position: relative;
  display: block;
  text-decoration: none;
  padding: 14px 16px;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #4caf50;
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.nav-item:hover {
  background: #f1f8f4;
  transform: translateX(4px);
}

.nav-item:hover::before {
  transform: scaleY(1);
}

.nav-item-active {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
}

.nav-item-active::before {
  transform: scaleY(1);
}

.nav-item-active .nav-icon-wrapper {
  background: #4caf50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.nav-item-active .nav-title {
  color: #1b5e20;
  font-weight: 700;
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.nav-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f5f5f5;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.nav-item:hover .nav-icon-wrapper {
  background: #4caf50;
  transform: scale(1.1);
}

.nav-custom-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(95%) contrast(90%);
  transition: filter 0.3s ease;
}

.nav-item:hover .nav-custom-icon,
.nav-item-active .nav-custom-icon {
  filter: brightness(0) saturate(100%) invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
}

.nav-text {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.nav-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #424242;
  transition: color 0.3s ease;
}

.nav-description {
  font-size: 0.7rem;
  color: #9e9e9e;
  margin-top: 2px;
}

.nav-item-indicator {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4caf50;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item-active .nav-item-indicator {
  opacity: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 16px;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

.version-info {
  text-align: center;
}

.version-text {
  font-size: 0.7rem;
  color: #9e9e9e;
  margin: 0;
  font-weight: 600;
}

.copyright-text {
  font-size: 0.65rem;
  color: #bdbdbd;
  margin: 4px 0 0 0;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-item {
  animation: slideIn 0.4s ease forwards;
}

.nav-item:nth-child(1) { animation-delay: 0.1s; }
.nav-item:nth-child(2) { animation-delay: 0.2s; }
.nav-item:nth-child(3) { animation-delay: 0.3s; }

/* Responsive */
@media (max-width: 960px) {
  .modern-sidebar {
    width: 260px !important;
  }
  
  .nav-description {
    display: none;
  }
}
</style>