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
    console.log(adminStore.postLogs); // Log the fetched post logs
  });
  userStore.fetchUserData()
});

const paginatedPostLogs = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage
  return adminStore.postLogs.slice(startIndex, startIndex + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(adminStore.postLogs.length / itemsPerPage))

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
</script>


<template>
    <AppLayout>
      <template #content>
        <AdminNavbar v-model="drawer" />
        <v-row>
          <v-col
            cols="12"
            class="d-flex justify-center align-center"
          >
            <v-card
              :elevation="7"
              style="border-radius: 0; height: 100vh; width: 100%; overflow-y: auto;"
            >
              <v-card-title class="py-0">
                <v-row>
                  <v-col cols="12" class="d-flex justify-start align-center px-sm-16">
                    <RouterLink
                      style="text-decoration: none; color: inherit;"
                      to="/"
                      class="d-inline-flex align-center justify-center ga-1 my-5"
                    >
                      <img
                        src="@/assets/logo.png"
                        alt="Logo"
                        width="30"
                        height="30"
                      />
                      <h3 class="font-weight-bold">
                        StaySearch
                      </h3>
                    </RouterLink>
                  </v-col>
                </v-row>
              </v-card-title>
  
              <v-divider class="d-block d-lg-none"></v-divider>
  
              <!-- CONTENTS -->
              <v-card-text>
                <v-row class="px-sm-15">
                  <v-col cols="12" md="6" class="py-7">
                    <v-card @click="$router.push('/admin/request')">
                      <div class="border pa-10 rounded-lg">
                    <div class="d-flex align-center px-7">
                      <h3 class="text-h5 font-weight-bold">Pendings</h3>
                      <v-spacer></v-spacer>
                      <v-icon class="text-h2" color="green" >mdi-arrow-right</v-icon>
                    </div>
                  </div>
                    </v-card>
                 
                </v-col>
                <v-col cols="12" md="6" class="py-7">
                  <v-card @click="$router.push('/admin/approved')">
                    <div class="border pa-10 rounded-lg">
                    <div class="d-flex align-center px-7">
                      <h3 class="text-h5 font-weight-bold">Approved Posts</h3>
                      <v-spacer></v-spacer>
                      <v-icon class="text-h2" color="green">mdi-arrow-right</v-icon>
                    </div>
                    
                  </div>
                  </v-card>
                  
                </v-col>
                  <v-col cols="12">
                    <h1>Recent Created Posts:</h1>
                  </v-col>
                  <v-col cols="12">
                    <v-table class="border">
                      <thead>
                        <tr>
                          <th class="text-center text-subtitle-1 font-weight-bold">Boarding House Name</th>
                          <th class="text-center text-subtitle-1 font-weight-bold">Owner</th>
                          <th class="text-center text-subtitle-1 font-weight-bold">Posted at</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="boardinghouse in adminStore.boardinghouse" :key="boardinghouse.id">
                          <td class="text-center">{{ boardinghouse.name }}</td>
                          <td class="text-center">{{ boardinghouse.owner_name }}</td>
                          <td class="text-center">{{ format(new Date(boardinghouse.created_at), 'MMM dd, yyyy hh:mm:ss a') }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </v-col>
                  <v-col cols="12">
                    <h1>Activity Logs:</h1>
                  </v-col>
                  <v-col cols="12">
                    <v-table class="border">
                      <thead>
                        <tr>
                          <th class="text-center text-subtitle-1 font-weight-bold">Table Name</th>
                          <th class="text-center text-subtitle-1 font-weight-bold">Action</th>
                          <th class="text-center text-subtitle-1 font-weight-bold">Updated At</th>
                          <th class="text-center text-subtitle-1 font-weight-bold">Username</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="log in paginatedPostLogs" :key="log.id">
                          <td class="text-center">{{ log.table_name }}</td>
                          <td class="text-center">{{ log.action }}</td>
                          <td class="text-center">{{ format(new Date(log.updated_at), 'MMM dd, yyyy hh:mm:ss a') }}</td>
                          <td class="text-center">{{ log.username }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                    <!-- Pagination Controls -->
                    <v-row class="mt-4">
                      <v-col cols="12" class="d-flex justify-center">
                        <v-btn
                          :disabled="currentPage === 1"
                          @click="previousPage"
                        >
                          Previous
                        </v-btn>
                        <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
                        <v-btn
                          :disabled="currentPage === totalPages"
                          @click="nextPage"
                        >
                          Next
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </AppLayout>
  </template>
  