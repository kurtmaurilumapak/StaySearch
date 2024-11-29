<script setup>
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useReservationStore } from '@/stores/reservationStore.js'
import { ref, onMounted } from 'vue'


const reservationStore = useReservationStore()
const drawer = ref(true);

onMounted(async () => {
  await reservationStore.fetchOwnerReservationData();
});
</script>

<template>
  <AppLayout>
    <template #content>
      <Navbar v-model="drawer" />
      <v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-card :elevation="7"  style="border-radius: 0; height: 100vh; width: 100%;">
            <!-- Header with Notification & Menu -->
            <v-card-title
              class="py-0"
            >
              <v-row>
                <v-col cols="6" class="d-flex justify-start align-center px-md-16">
                  <RouterLink
                    style="text-decoration: none;color: inherit;"
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
                <v-col cols="6" class="d-flex align-center justify-end px-md-16">
                  <v-btn
                    class="ma-2 d-flex d-lg-none"
                    icon="mdi-menu"
                    variant="text"
                    @click="drawer = !drawer"
                  ></v-btn>
                </v-col>

              </v-row>
            </v-card-title>

            <v-divider class="d-block d-lg-none"></v-divider>

            <!-- Boarding House Posts -->
            <v-row class="pa-6 px-md-16" style="overflow-y: auto; max-height: 100vh">
              <v-col
                cols="12" md="6"
                v-for="reservation in reservationStore.reservations" :key="reservation.boarding_house_id"
              >
                <v-card class="mb-5" elevation="12" style="border-radius: 12px; overflow: hidden;">
                  <v-card-title
                    class="d-flex bg-green"
                  >
                    <v-row>
                      <v-col cols="6" class="d-flex align-center">
                        <v-icon>mdi-calendar-text</v-icon>
                        <p class="d-none d-sm-block">Reservations</p>
                      </v-col>
                      <v-col cols="6" class="d-flex flex-column align-end">
                       <div>
                         <p>{{ reservation.name }}</p>
                         <p>{{ reservation.address }}</p>
                       </div>
                      </v-col>
                    </v-row>
                  </v-card-title>
                  <v-card-text style="padding: 20px;">
                    <v-row>
                      <v-col cols="12">
                        <h2>All Reservations</h2>
                      </v-col>
                      <v-col cols="12" class="d-flex align-center border border-b-lg rounded-lg pa-5 mb-4" v-for="(reservationDetail, index) in reservation.reservations" :key="index">
                        <div>
                          <h2>{{ reservationDetail }}</h2>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="d-flex justify-center">
                    <v-pagination :length="4"></v-pagination>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
