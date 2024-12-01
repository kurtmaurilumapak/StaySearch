<script setup>
import Applayout from '@/components/layout/AppLayout.vue'
import { useAdminStore } from '@/stores/adminStore';
import { computed, onMounted } from 'vue';

const adminStore = useAdminStore();
const totalBoardinghouses = computed(() => adminStore.boardinghouse.length);

onMounted(() => {
  adminStore.fetchBoardData2(); 
});
</script>

<template>
  <Applayout>
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
                  <h1>Approved Posts: {{ totalBoardinghouses }}</h1>
                </v-col>
                <v-col cols="12" v-for="boardinghouse in adminStore.boardinghouse" :key="boardinghouse.id">
                  <v-card class="d-flex align-start border border-b-lg">
                    <v-card-text>
                      <h2 class="text-h5 font-weight-bold">{{ boardinghouse.name }}</h2>
                      <p class="text-h6">{{ boardinghouse.address }}</p>
                      <p class="text-subtitle-1">{{ boardinghouse.description }}</p>
                    </v-card-text>
                    <v-card-actions class="my-2 py-5">
                      <v-btn size="large" class="my-2 py-2 rounded-lg font-weight-bold bg-green text-body-2" @click="openPostDialog(boardinghouse)">
                        View Details
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>