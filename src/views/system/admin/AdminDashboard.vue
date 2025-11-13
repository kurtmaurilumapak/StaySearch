<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { useUserStore } from '@/stores/userStore'
import { format } from 'date-fns'
import AdminNavbar from '@/components/common/AdminNavbar.vue'

const userStore = useUserStore()
const adminStore = useAdminStore()
const drawer = ref(true)

const currentPage = ref(1)
const itemsPerPage = 5

onMounted(() => {
  adminStore.fetchRecentPosts().then(() => {
    console.log(adminStore.boardinghouse);
  });
  adminStore.fetchPostLogs().then(() => {
    console.log(adminStore.postLogs);
  });
  userStore.fetchUserData()
});

const paginatedPostLogs = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return adminStore.postLogs.slice(startIndex, startIndex + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(adminStore.postLogs.length / itemsPerPage))

// Statistics calculations
const statistics = computed(() => {
  const logs = adminStore.postLogs
  const posts = adminStore.boardinghouse
  
  return {
    totalPosts: posts.length,
    totalActivities: logs.length,
    insertActions: logs.filter(log => log.action === 'INSERT').length,
    updateActions: logs.filter(log => log.action === 'UPDATE').length,
    deleteActions: logs.filter(log => log.action === 'DELETE').length,
  }
})

// Activity chart data
const activityChartData = computed(() => {
  const logs = adminStore.postLogs
  const last7Days = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = format(date, 'MMM dd')
    
    const dayLogs = logs.filter(log => {
      const logDate = new Date(log.updated_at)
      return format(logDate, 'MMM dd') === dateStr
    })
    
    last7Days.push({
      date: dateStr,
      count: dayLogs.length,
      inserts: dayLogs.filter(l => l.action === 'INSERT').length,
      updates: dayLogs.filter(l => l.action === 'UPDATE').length,
    })
  }
  
  return last7Days
})

// Action distribution for pie chart
const actionDistribution = computed(() => {
  const stats = statistics.value
  return [
    { label: 'INSERT', value: stats.insertActions, color: '#4caf50' },
    { label: 'UPDATE', value: stats.updateActions, color: '#ff9800' },
    { label: 'DELETE', value: stats.deleteActions, color: '#f44336' },
  ]
})

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Get max value for chart scaling
const maxActivityValue = computed(() => {
  return Math.max(...activityChartData.value.map(d => d.count), 1)
})
</script>

<template>
  <AppLayout>
    <template #content>
      <AdminNavbar v-model="drawer" />
      <v-row class="ma-0">
        <v-col cols="12" class="d-flex justify-center align-center pa-0">
          <v-card class="admin-container" :elevation="0">
            <!-- Modern Header -->
            <v-card-title class="admin-header">
              <v-row class="align-center">
                <v-col cols="6" class="d-flex justify-start align-center px-sm-16">
                  <RouterLink
                    style="text-decoration: none; color: inherit;"
                    to="/"
                    class="brand-link"
                  >
                    <div class="logo-wrapper">
                      <img
                        src="@/assets/logo.png"
                        alt="Logo"
                        width="35"
                        height="35"
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

            <!-- Content -->
            <v-card-text class="admin-content">
              <v-container fluid class="px-sm-15">
                <!-- Welcome Section -->
                <v-row class="welcome-section mb-8">
                  <v-col cols="12">
                    <div class="welcome-card">
                      <div class="welcome-content">
                        <h1 class="welcome-title">Admin Dashboard</h1>
                        <p class="welcome-subtitle">
                          Monitor and manage platform activities
                        </p>
                      </div>
                      <div class="welcome-decoration">
                        <div class="decoration-circle circle-1"></div>
                        <div class="decoration-circle circle-2"></div>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Statistics Cards -->
                <v-row class="mb-8">
                  <v-col cols="12" sm="6" md="3">
                    <div class="stat-card stat-card-primary">
                      <div class="stat-icon-wrapper">
                        <v-icon size="40" color="white">mdi-home-city</v-icon>
                      </div>
                      <div class="stat-content">
                        <p class="stat-label">Total Posts</p>
                        <h2 class="stat-value">{{ statistics.totalPosts }}</h2>
                      </div>
                      <div class="stat-trend">
                        <v-icon size="20" color="success">mdi-trending-up</v-icon>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <div class="stat-card stat-card-success">
                      <div class="stat-icon-wrapper">
                        <v-icon size="40" color="white">mdi-plus-circle</v-icon>
                      </div>
                      <div class="stat-content">
                        <p class="stat-label">New Inserts</p>
                        <h2 class="stat-value">{{ statistics.insertActions }}</h2>
                      </div>
                      <div class="stat-trend">
                        <v-icon size="20" color="success">mdi-trending-up</v-icon>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <div class="stat-card stat-card-warning">
                      <div class="stat-icon-wrapper">
                        <v-icon size="40" color="white">mdi-pencil</v-icon>
                      </div>
                      <div class="stat-content">
                        <p class="stat-label">Updates</p>
                        <h2 class="stat-value">{{ statistics.updateActions }}</h2>
                      </div>
                      <div class="stat-trend">
                        <v-icon size="20" color="warning">mdi-trending-neutral</v-icon>
                      </div>
                    </div>
                  </v-col>

                  <v-col cols="12" sm="6" md="3">
                    <div class="stat-card stat-card-info">
                      <div class="stat-icon-wrapper">
                        <v-icon size="40" color="white">mdi-chart-line</v-icon>
                      </div>
                      <div class="stat-content">
                        <p class="stat-label">Total Activities</p>
                        <h2 class="stat-value">{{ statistics.totalActivities }}</h2>
                      </div>
                      <div class="stat-trend">
                        <v-icon size="20" color="info">mdi-information</v-icon>
                      </div>
                    </div>
                  </v-col>
                </v-row>

                <!-- Charts Section -->
                <v-row class="mb-8">
                  <!-- Activity Trend Chart -->
                  <v-col cols="12" lg="8">
                    <v-card class="data-card" elevation="0" rounded="xl">
                      <v-card-title class="data-card-header pa-6">
                        <div class="d-flex align-center justify-space-between w-100">
                          <div class="d-flex align-center">
                            <div class="section-icon-wrapper mr-3">
                              <v-icon color="blue-darken-2">mdi-chart-areaspline</v-icon>
                            </div>
                            <h2 class="section-title">Activity Trend (Last 7 Days)</h2>
                          </div>
                        </div>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="pa-6">
                        <div class="chart-container">
                          <div class="bar-chart">
                            <div 
                              v-for="(day, index) in activityChartData" 
                              :key="index"
                              class="bar-group"
                            >
                              <div class="bar-wrapper">
                                <div class="bar-tooltip">
                                  <div class="tooltip-content">
                                    <p class="tooltip-title">{{ day.date }}</p>
                                    <p class="tooltip-item">
                                      <span class="tooltip-dot" style="background: #2196f3;"></span>
                                      Total: {{ day.count }}
                                    </p>
                                    <p class="tooltip-item">
                                      <span class="tooltip-dot" style="background: #4caf50;"></span>
                                      Inserts: {{ day.inserts }}
                                    </p>
                                    <p class="tooltip-item">
                                      <span class="tooltip-dot" style="background: #ff9800;"></span>
                                      Updates: {{ day.updates }}
                                    </p>
                                  </div>
                                </div>
                                <div 
                                  class="bar"
                                  :style="{ 
                                    height: `${(day.count / maxActivityValue) * 200}px`,
                                    animationDelay: `${index * 0.1}s`
                                  }"
                                >
                                  <span class="bar-value">{{ day.count }}</span>
                                </div>
                              </div>
                              <span class="bar-label">{{ day.date }}</span>
                            </div>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <!-- Action Distribution -->
                  <v-col cols="12" lg="4">
                    <v-card class="data-card" elevation="0" rounded="xl">
                      <v-card-title class="data-card-header pa-6">
                        <div class="d-flex align-center">
                          <div class="section-icon-wrapper mr-3">
                            <v-icon color="purple-darken-2">mdi-chart-donut</v-icon>
                          </div>
                          <h2 class="section-title">Action Distribution</h2>
                        </div>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="pa-6">
                        <div class="donut-chart">
                          <svg viewBox="0 0 200 200" class="donut-svg">
                            <circle cx="100" cy="100" r="80" fill="none" stroke="#f5f5f5" stroke-width="40"/>
                            <circle 
                              v-for="(action, index) in actionDistribution" 
                              :key="index"
                              cx="100" 
                              cy="100" 
                              r="80" 
                              fill="none" 
                              :stroke="action.color"
                              stroke-width="40"
                              :stroke-dasharray="`${(action.value / statistics.totalActivities) * 502.65} 502.65`"
                              :stroke-dashoffset="502.65 - actionDistribution.slice(0, index).reduce((sum, a) => sum + (a.value / statistics.totalActivities) * 502.65, 0)"
                              class="donut-segment"
                              :style="{ animationDelay: `${index * 0.2}s` }"
                            />
                            <text x="100" y="95" text-anchor="middle" class="donut-total-label">Total</text>
                            <text x="100" y="115" text-anchor="middle" class="donut-total-value">{{ statistics.totalActivities }}</text>
                          </svg>
                        </div>
                        <div class="chart-legend mt-6">
                          <div 
                            v-for="(action, index) in actionDistribution" 
                            :key="index"
                            class="legend-item"
                          >
                            <span class="legend-color" :style="{ background: action.color }"></span>
                            <span class="legend-label">{{ action.label }}</span>
                            <span class="legend-value">{{ action.value }}</span>
                          </div>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Quick Actions -->
                <v-row class="mb-8">
                  <v-col cols="12" md="6">
                    <v-card 
                      class="action-card pending-card" 
                      elevation="0" 
                      rounded="xl"
                      @click="$router.push('/admin/request')"
                    >
                      <v-card-text class="pa-6">
                        <div class="action-content">
                          <div class="action-icon-wrapper pending-icon">
                            <v-icon size="40" color="white">mdi-clock-outline</v-icon>
                          </div>
                          <div class="action-info">
                            <h3 class="action-title">Pending Posts</h3>
                            <p class="action-subtitle">Review awaiting approval</p>
                          </div>
                          <v-icon class="action-arrow" size="32">mdi-chevron-right</v-icon>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-card 
                      class="action-card approved-card" 
                      elevation="0" 
                      rounded="xl"
                      @click="$router.push('/admin/approved')"
                    >
                      <v-card-text class="pa-6">
                        <div class="action-content">
                          <div class="action-icon-wrapper approved-icon">
                            <v-icon size="40" color="white">mdi-check-circle</v-icon>
                          </div>
                          <div class="action-info">
                            <h3 class="action-title">Approved Posts</h3>
                            <p class="action-subtitle">View active listings</p>
                          </div>
                          <v-icon class="action-arrow" size="32">mdi-chevron-right</v-icon>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Recent Posts Section -->
                <v-row class="mb-8">
                  <v-col cols="12">
                    <v-card class="data-card" elevation="0" rounded="xl">
                      <v-card-title class="data-card-header pa-6">
                        <div class="d-flex align-center">
                          <div class="section-icon-wrapper mr-3">
                            <v-icon color="green-darken-2">mdi-home-city</v-icon>
                          </div>
                          <h2 class="section-title">Recent Created Posts</h2>
                        </div>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="pa-0">
                        <div class="table-container">
                          <v-table class="modern-table">
                            <thead>
                              <tr>
                                <th class="table-header">Boarding House Name</th>
                                <th class="table-header">Owner</th>
                                <th class="table-header">Posted At</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr 
                                v-for="boardinghouse in adminStore.boardinghouse" 
                                :key="boardinghouse.id"
                                class="table-row"
                              >
                                <td class="table-cell">
                                  <div class="cell-content">
                                    <v-icon size="20" color="green-darken-2" class="mr-2">mdi-home</v-icon>
                                    <span class="font-weight-medium">{{ boardinghouse.name }}</span>
                                  </div>
                                </td>
                                <td class="table-cell">
                                  <div class="cell-content">
                                    <v-icon size="20" color="blue-darken-2" class="mr-2">mdi-account</v-icon>
                                    {{ boardinghouse.owner_name }}
                                  </div>
                                </td>
                                <td class="table-cell">
                                  <v-chip size="small" color="grey-lighten-3" variant="flat">
                                    {{ format(new Date(boardinghouse.created_at), 'MMM dd, yyyy hh:mm a') }}
                                  </v-chip>
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Activity Logs Section -->
                <v-row>
                  <v-col cols="12">
                    <v-card class="data-card" elevation="0" rounded="xl">
                      <v-card-title class="data-card-header pa-6">
                        <div class="d-flex align-center">
                          <div class="section-icon-wrapper mr-3">
                            <v-icon color="orange-darken-2">mdi-history</v-icon>
                          </div>
                          <h2 class="section-title">Activity Logs</h2>
                        </div>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text class="pa-0">
                        <div class="table-container">
                          <v-table class="modern-table">
                            <thead>
                              <tr>
                                <th class="table-header">Table Name</th>
                                <th class="table-header">Action</th>
                                <th class="table-header">Updated At</th>
                                <th class="table-header">Username</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr 
                                v-for="log in paginatedPostLogs" 
                                :key="log.id"
                                class="table-row"
                              >
                                <td class="table-cell">
                                  <v-chip size="small" color="blue-lighten-5" text-color="blue-darken-3" variant="flat">
                                    {{ log.table_name }}
                                  </v-chip>
                                </td>
                                <td class="table-cell">
                                  <v-chip 
                                    size="small" 
                                    :color="log.action === 'INSERT' ? 'green-lighten-5' : log.action === 'UPDATE' ? 'orange-lighten-5' : 'red-lighten-5'"
                                    :text-color="log.action === 'INSERT' ? 'green-darken-3' : log.action === 'UPDATE' ? 'orange-darken-3' : 'red-darken-3'"
                                    variant="flat"
                                  >
                                    {{ log.action }}
                                  </v-chip>
                                </td>
                                <td class="table-cell">
                                  <v-chip size="small" color="grey-lighten-3" variant="flat">
                                    {{ format(new Date(log.updated_at), 'MMM dd, yyyy hh:mm a') }}
                                  </v-chip>
                                </td>
                                <td class="table-cell">
                                  <div class="cell-content">
                                    <v-icon size="20" color="purple-darken-2" class="mr-2">mdi-account-circle</v-icon>
                                    {{ log.username }}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                        </div>

                        <!-- Modern Pagination -->
                        <div class="pagination-wrapper pa-6">
                          <div class="pagination-controls">
                            <v-btn
                              variant="tonal"
                              color="green-darken-2"
                              rounded="lg"
                              :disabled="currentPage === 1"
                              @click="previousPage"
                              prepend-icon="mdi-chevron-left"
                            >
                              Previous
                            </v-btn>
                            <div class="page-info">
                              <span class="page-text">Page {{ currentPage }} of {{ totalPages }}</span>
                            </div>
                            <v-btn
                              variant="tonal"
                              color="green-darken-2"
                              rounded="lg"
                              :disabled="currentPage === totalPages"
                              @click="nextPage"
                              append-icon="mdi-chevron-right"
                            >
                              Next
                            </v-btn>
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
/* Container */
.admin-container {
  border-radius: 0;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
}

.admin-container::-webkit-scrollbar {
  width: 8px;
}

.admin-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.admin-container::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 4px;
}

/* Header */
.admin-header {
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
  font-size: 1.4rem;
  font-weight: 700;
  color: #1b5e20;
  letter-spacing: -0.5px;
}

.menu-toggle {
  color: #2e7d32;
}

/* Content */
.admin-content {
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
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 50%, #42a5f5 100%);
  padding: 48px 40px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(21, 101, 192, 0.3);
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
  bottom: -50px;
  right: 20%;
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

/* Statistics Cards */
.stat-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease;
  border: 2px solid transparent;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-color-1), var(--card-color-2));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.stat-card:hover::before {
  transform: scaleX(1);
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.stat-card-primary {
  --card-color-1: #2196f3;
  --card-color-2: #42a5f5;
}

.stat-card-success {
  --card-color-1: #4caf50;
  --card-color-2: #66bb6a;
}

.stat-card-warning {
  --card-color-1: #ff9800;
  --card-color-2: #ffa726;
}

.stat-card-info {
  --card-color-1: #9c27b0;
  --card-color-2: #ba68c8;
}

.stat-icon-wrapper {
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--card-color-1), var(--card-color-2));
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.stat-card:hover .stat-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #757575;
  margin: 0 0 4px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #212121;
  margin: 0;
  line-height: 1;
}

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Charts */
.chart-container {
  padding: 20px 0;
  min-height: 280px;
}

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  gap: 12px;
  padding: 0 10px;
}

.bar-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 80px;
}

.bar-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 220px;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, #2196f3 0%, #1976d2 100%);
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: barGrow 0.8s ease forwards;
  transform-origin: bottom;
  box-shadow: 0 -4px 12px rgba(33, 150, 243, 0.3);
}

@keyframes barGrow {
  from {
    transform: scaleY(0);
    opacity: 0;
  }
  to {
    transform: scaleY(1);
    opacity: 1;
  }
}

.bar:hover {
  background: linear-gradient(180deg, #42a5f5 0%, #2196f3 100%);
  box-shadow: 0 -6px 20px rgba(33, 150, 243, 0.5);
  transform: scaleY(1.05);
}

.bar-value {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: #1976d2;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.bar:hover .bar-value {
  opacity: 1;
}

.bar-label {
  font-size: 0.75rem;
  color: #616161;
  font-weight: 600;
  text-align: center;
}

.bar-tooltip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 10;
}

.bar-wrapper:hover .bar-tooltip {
  opacity: 1;
}

.tooltip-content {
  background: rgba(33, 33, 33, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  min-width: 160px;
}

.tooltip-title {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  margin: 0 0 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 6px;
}

.tooltip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  margin: 4px 0;
}

.tooltip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

/* Donut Chart */
.donut-chart {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.donut-svg {
  width: 100%;
  max-width: 250px;
  height: auto;
  transform: rotate(-90deg);
}

.donut-segment {
  transition: all 0.3s ease;
  animation: donutGrow 1s ease forwards;
}

@keyframes donutGrow {
  from {
    stroke-dasharray: 0 502.65;
  }
}

.donut-segment:hover {
  stroke-width: 45;
  filter: brightness(1.1);
}

.donut-total-label {
  font-size: 14px;
  fill: #757575;
  font-weight: 500;
  transform: rotate(90deg);
  transform-origin: center;
}

.donut-total-value {
  font-size: 28px;
  fill: #212121;
  font-weight: 800;
  transform: rotate(90deg);
  transform-origin: center;
}

/* Chart Legend */
.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: #f5f5f5;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.legend-item:hover {
  background: #e8f5e9;
  transform: translateX(4px);
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  font-weight: 600;
  color: #424242;
  font-size: 0.9rem;
}

.legend-value {
  font-weight: 700;
  color: #212121;
  font-size: 1rem;
  background: white;
  padding: 4px 12px;
  border-radius: 6px;
}

/* Action Cards */
.action-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease;
}

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

.action-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
}

.pending-card:hover {
  border-color: #ff9800;
}

.approved-card:hover {
  border-color: #4caf50;
}

.action-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-icon-wrapper {
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.pending-icon {
  background: linear-gradient(135deg, #ff9800 0%, #ffa726 100%);
}

.approved-icon {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
}

.action-card:hover .action-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.action-info {
  flex: 1;
}

.action-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1b5e20;
  margin-bottom: 4px;
}

.action-subtitle {
  font-size: 0.9rem;
  color: #616161;
  margin: 0;
}

.action-arrow {
  color: #9e9e9e;
  transition: transform 0.3s ease;
}

.action-card:hover .action-arrow {
  transform: translateX(8px);
  color: #4caf50;
}

/* Data Cards */
.data-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.data-card-header {
  background: linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.section-icon-wrapper {
  background: white;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1b5e20;
  margin: 0;
}

/* Modern Table */
.table-container {
  overflow-x: auto;
}

.modern-table {
  background: transparent;
}

.table-header {
  background: #f5f5f5;
  font-weight: 700;
  font-size: 0.95rem;
  color: #1b5e20;
  text-align: center;
  padding: 16px;
  border-bottom: 2px solid #e0e0e0;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: #f1f8f4;
}

.table-cell {
  text-align: center;
  padding: 16px;
  color: #424242;
  font-size: 0.95rem;
}

.cell-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Pagination */
.pagination-wrapper {
  background: #fafafa;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.pagination-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.page-info {
  background: white;
  padding: 12px 24px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.page-text {
  font-weight: 600;
  color: #1b5e20;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 1280px) {
  .bar-chart {
    gap: 8px;
  }
  
  .bar-group {
    max-width: 60px;
  }
}

@media (max-width: 960px) {
  .welcome-card {
    padding: 32px 24px;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-value {
    font-size: 1.75rem;
  }

  .action-title {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 12px;
  }

  .pagination-controls .v-btn {
    width: 100%;
  }
  
  .bar-chart {
    gap: 6px;
    padding: 0 5px;
  }
}

@media (max-width: 600px) {
  .admin-content {
    padding: 20px 8px;
  }

  .welcome-card {
    padding: 24px 20px;
  }

  .stat-card {
    padding: 16px;
    gap: 12px;
  }

  .stat-icon-wrapper {
    padding: 12px;
  }

  .stat-icon-wrapper .v-icon {
    font-size: 32px !important;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .action-content {
    gap: 12px;
  }

  .action-arrow {
    display: none;
  }

  .table-header,
  .table-cell {
    font-size: 0.85rem;
    padding: 12px 8px;
  }
  
  .bar-chart {
    gap: 4px;
    padding: 0;
  }
  
  .bar-group {
    max-width: 40px;
  }
  
  .bar-label {
    font-size: 0.65rem;
  }
  
  .chart-container {
    min-height: 240px;
  }
  
  .bar-chart {
    height: 200px;
  }
  
  .bar-wrapper {
    height: 180px;
  }
}
</style>