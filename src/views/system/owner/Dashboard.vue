<script setup>
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted, computed} from 'vue'
import { useUserStore } from '@/stores/userStore.js'
import { usePostStore } from '@/stores/postStore'
import { useReservationStore } from '@/stores/reservationStore.js'

const userStore = useUserStore()
const postStore = usePostStore()
const reservationStore = useReservationStore()
const drawer = ref(true);

const totalProperties = computed(() => postStore.posts.length);
const totalReservations = computed(() => reservationStore.countMetaObjects());


onMounted(async () => {
  await userStore.fetchUserData()
  await postStore.ownerPost();
  await reservationStore.fetchOwnerReservationData();
})
const averageRating = computed(() => {
  if (postStore.posts.length > 0) {
    
    const totalRating = postStore.posts.reduce((acc, post) => {
      if (post.reviews && post.reviews.length > 0) {
        const postTotalRating = post.reviews.reduce((sum, review) => sum + review.rating, 0)
        return acc + (postTotalRating / post.reviews.length)
      }
      return acc
    }, 0)

    return totalRating / postStore.posts.length
  }
  return 0
})
</script>

<template>
  <AppLayout>
    <template #content>
      <Navbar v-model="drawer" />
      <v-row>
        <v-col
          cols="12"
          class="d-flex justify-center align-center"
        >
          <v-card
            :elevation="0"
            class="dashboard-container"
          >
            <!-- Modern Header -->
            <v-card-title class="dashboard-header">
              <v-row class="align-center">
                <v-col cols="6" class="d-flex justify-start align-center px-sm-16">
                  <RouterLink
                    style="text-decoration: none;color: inherit;"
                    to="/"
                    class="brand-link"
                  >
                    <div class="logo-wrapper">
                      <img
                        src="@/assets/logo.png"
                        alt="Logo"
                        width="36"
                        height="36"
                      />
                    </div>
                    <h3 class="brand-text">
                      StaySearch
                    </h3>
                  </RouterLink>
                </v-col>
                <v-col cols="6" class="d-flex align-center justify-end px-sm-16">
                  <v-btn
                    class="ma-2 d-flex d-lg-none menu-toggle"
                    icon="mdi-menu"
                    variant="text"
                    size="large"
                    @click="drawer = !drawer"
                  ></v-btn>
                </v-col>
              </v-row>
            </v-card-title>

            <v-divider class="d-block d-lg-none"></v-divider>

            <!-- Dashboard Content -->
            <v-card-text class="dashboard-content">
              <v-container fluid class="px-sm-15">
                <!-- Welcome Section -->
                <v-row class="welcome-section mb-8">
                  <v-col cols="12">
                    <div class="welcome-card">
                      <div class="welcome-content">
                        <h1 class="welcome-title">
                          Welcome back, {{ userStore.userData.firstname || userStore.userData.name }}! 👋
                        </h1>
                        <p class="welcome-subtitle">
                          Here's what's happening with your properties today
                        </p>
                      </div>
                      <div class="welcome-decoration">
                        <div class="decoration-circle circle-1"></div>
                        <div class="decoration-circle circle-2"></div>
                        <div class="decoration-circle circle-3"></div>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Stats Cards -->
                <v-row class="stats-row">
                  <!-- Total Properties Card -->
                  <v-col cols="12" md="4" class="stat-col">
                    <v-card class="stat-card properties-card" elevation="0">
                      <div class="stat-background">
                        <div class="stat-pattern"></div>
                      </div>
                      <v-card-text class="stat-content">
                        <div class="stat-header">
                          <div class="stat-info">
                            <p class="stat-label">Total Properties</p>
                            <h2 class="stat-value">{{ totalProperties }}</h2>
                          </div>
                          <div class="stat-icon-wrapper properties-icon">
                            <v-icon size="36" color="white">mdi-home-variant</v-icon>
                          </div>
                        </div>
                        <div class="stat-footer">
                          <div class="stat-indicator positive">
                            <v-icon size="16">mdi-trending-up</v-icon>
                            <span>Active listings</span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Total Reservations Card -->
                  <v-col cols="12" md="4" class="stat-col">
                    <v-card class="stat-card reservations-card" elevation="0">
                      <div class="stat-background">
                        <div class="stat-pattern"></div>
                      </div>
                      <v-card-text class="stat-content">
                        <div class="stat-header">
                          <div class="stat-info">
                            <p class="stat-label">Total Reservations</p>
                            <h2 class="stat-value">{{ totalReservations }}</h2>
                          </div>
                          <div class="stat-icon-wrapper reservations-icon">
                            <v-icon size="36" color="white">mdi-calendar-check</v-icon>
                          </div>
                        </div>
                        <div class="stat-footer">
                          <div class="stat-indicator positive">
                            <v-icon size="16">mdi-clock-outline</v-icon>
                            <span>Bookings received</span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Average Rating Card -->
                  <v-col cols="12" md="4" class="stat-col">
                    <v-card class="stat-card rating-card" elevation="0">
                      <div class="stat-background">
                        <div class="stat-pattern"></div>
                      </div>
                      <v-card-text class="stat-content">
                        <div class="stat-header">
                          <div class="stat-info">
                            <p class="stat-label">Average Rating</p>
                            <h2 class="stat-value">{{ averageRating.toFixed(1) }}</h2>
                          </div>
                          <div class="stat-icon-wrapper rating-icon">
                            <v-icon size="36" color="white">mdi-star</v-icon>
                          </div>
                        </div>
                        <div class="stat-footer">
                          <div class="stat-rating-stars">
                            <v-rating
                              :model-value="averageRating"
                              color="yellow-darken-2"
                              half-increments
                              readonly
                              density="compact"
                              size="small"
                            ></v-rating>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>


              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Dashboard Container */
.dashboard-container {
  border-radius: 0;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
}

/* Modern Header */
.dashboard-header {
  background: white;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.brand-link:hover {
  transform: translateY(-2px);
}

.logo-wrapper {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
  padding: 10px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.3);
  transition: all 0.3s ease;
}

.brand-link:hover .logo-wrapper {
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
  transform: scale(1.05);
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b5e20;
  letter-spacing: -0.5px;
}

.menu-toggle {
  color: #2e7d32;
}

/* Dashboard Content */
.dashboard-content {
  padding: 32px 16px;
}

/* Welcome Section */
.welcome-section {
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card {
  position: relative;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%);
  padding: 48px 40px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(27, 94, 32, 0.3);
}

.welcome-content {
  position: relative;
  z-index: 2;
}

.welcome-title {
  color: white;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}

.welcome-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: clamp(1rem, 2vw, 1.15rem);
  font-weight: 400;
  margin: 0;
}

.welcome-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -50px;
  animation: float 8s ease-in-out infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  top: 50%;
  right: 10%;
  animation: float 6s ease-in-out infinite 1s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  bottom: -50px;
  right: 30%;
  animation: float 7s ease-in-out infinite 0.5s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

/* Stats Cards */
.stats-row {
  margin-top: 0;
}

.stat-col {
  animation: fadeInUp 0.6s ease;
}

.stat-col:nth-child(1) { animation-delay: 0.1s; }
.stat-col:nth-child(2) { animation-delay: 0.2s; }
.stat-col:nth-child(3) { animation-delay: 0.3s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.stat-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.properties-card .stat-background {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
}

.reservations-card .stat-background {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
}

.rating-card .stat-background {
  background: linear-gradient(135deg, #f57c00 0%, #ff9800 100%);
}

.stat-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: patternMove 10s ease-in-out infinite;
}

@keyframes patternMove {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, 10px); }
}

.stat-content {
  position: relative;
  z-index: 1;
  padding: 32px 28px !important;
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 12px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.stat-value {
  color: white;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.stat-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.properties-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.reservations-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.rating-icon {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.stat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.stat-rating-stars {
  background: rgba(255, 255, 255, 0.15);
  padding: 8px 16px;
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

/* Responsive Design */
@media (max-width: 960px) {
  .welcome-card {
    padding: 32px 24px;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .stat-content {
    padding: 24px 20px !important;
  }

  .stat-value {
    font-size: 2.5rem;
  }

  .stat-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .stat-icon-wrapper v-icon {
    font-size: 28px !important;
  }
}

@media (max-width: 600px) {
  .dashboard-content {
    padding: 20px 8px;
  }

  .welcome-card {
    padding: 24px 20px;
  }

  .stat-content {
    padding: 20px 16px !important;
  }
}

/* Smooth Scrollbar */
.dashboard-container::-webkit-scrollbar {
  width: 8px;
}

.dashboard-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dashboard-container::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 4px;
}

.dashboard-container::-webkit-scrollbar-thumb:hover {
  background: #2e7d32;
}
</style>