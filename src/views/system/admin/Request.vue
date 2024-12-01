<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/adminStore'

const adminStore = useAdminStore()
const drawer = ref(true)
const postDialog = ref({
  isOpen: false,
  boardingHouse: null,
})

const totalBoardinghouses = computed(() => adminStore.boardinghouse.length)

onMounted(() => {
  adminStore.fetchBoardData()
})

const handleApprove = async (boardinghouseID) => {
  await adminStore.approveCard(boardinghouseID)
}

const handleReject = async (boardinghouseID) => {
  await adminStore.rejectCard(boardinghouseID)
}

const openPostDialog = (boardinghouse) => {
  postDialog.value.boardingHouse = boardinghouse
  postDialog.value.isOpen = true
}

</script>

<template>
  <AppLayout>
    <template #content>
      <v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-card :elevation="7" style="border-radius: 0; height: 100vh; width: 100%; overflow-y: auto;">
            <v-card-title class="py-0">
              <v-row>
                <v-col cols="6" class="d-flex justify-start align-center px-sm-16">
                  <RouterLink
                    style="text-decoration: none; color: inherit;"
                    to="/"
                    class="d-inline-flex align-center justify-center ga-1 my-5"
                  >
                    <img src="@/assets/logo.png" alt="Logo" width="30" height="30" />
                    <h3 class="font-weight-bold">StaySearch</h3>
                  </RouterLink>
                </v-col>
                
              </v-row>
            </v-card-title>

            <v-divider class="d-block d-lg-none"></v-divider>

            <!-- CONTENTS -->
            <v-card-text>
              <v-row class="px-sm-15">
                <v-btn
                    fab icon
                    @click="$router.push('/admin/dashboard')"
                  >
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                <v-col cols="12">
                  <h1>Pending Posts: {{ totalBoardinghouses }}</h1>
                </v-col>
                <v-col cols="12" v-for="boardinghouse in adminStore.boardinghouse" :key="boardinghouse.id">
                  <v-card class="d-flex align-start border border-b-lg">
                    <v-card-text>
                      <h2>{{ boardinghouse.name }}</h2>
                      <p class="text-subtitle-1">{{ boardinghouse.address }}</p>
                      <p class="text-body-2">posted by: <strong>{{ boardinghouse.owner_name }}</strong></p>
                    </v-card-text>
                    <v-card-text>
                      <v-btn size="large" class="my-2 rounded-lg font-weight-bold bg-green text-body-2" @click="openPostDialog(boardinghouse)">
                        View Details
                      </v-btn>
                    </v-card-text>
                    <v-card-actions class="my-5">
                      <v-btn color="green" class="border" @click="handleApprove(boardinghouse.id)">Approve</v-btn>
                      <v-btn color="red" class="border" @click="handleReject(boardinghouse.id)">Reject</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Post Dialog -->
      <v-dialog v-model="postDialog.isOpen" max-width="700">
        <v-card style="overflow: hidden; border-radius: 20px">
          <v-card-title class="d-flex align-center justify-center font-weight-bold">
            <v-spacer class="px-4"></v-spacer>
            <h4>Boarding House Details</h4>
            <v-spacer></v-spacer>
            <v-btn class="ma-2" icon="mdi-close" variant="text" @click="postDialog.isOpen = false"></v-btn>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-center">
                <h2>{{ postDialog.boardingHouse?.name }}</h2>
              </v-col>
              <v-col cols="12">
                <p class="text-subtitle-1">{{ postDialog.boardingHouse?.address }}</p>
                <p class="text-body-2">posted by: <strong>{{ postDialog.boardingHouse?.owner_name }}</strong></p>
                <!-- Add more details here as needed -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </AppLayout>
</template>
