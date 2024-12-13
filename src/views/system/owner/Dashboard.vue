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
            :elevation="7"
            style="border-radius: 0; height: 100vh; width: 100%; overflow-y: auto;"
          >
            <v-card-title
              class="py-0"
            >
              <v-row>
                <v-col cols="6" class="d-flex justify-start align-center px-sm-16">
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
                <v-col cols="6" class="d-flex align-center justify-end px-sm-16">
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

            <!-- CONTENTS -->
            <v-card-text>
              <v-row class="px-sm-15">
                <v-col cols="12">
                  <h1>Hi, {{ userStore.userData.firstname || userStore.userData.name }}</h1>
                </v-col>
                <v-col cols="12" md="4" class="py-7">
                  <div class="border pa-10 rounded-lg">
                    <div class="d-flex align-center px-7">
                      <h3>Total Properties</h3>
                      <v-spacer></v-spacer>
                      <v-icon color="green">mdi-home</v-icon>
                    </div>
                    <h1 class="px-7">{{ totalProperties}}</h1>
                   
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="py-7">
                  <div class="border pa-10 rounded-lg">
                    <div class="d-flex align-center px-7">
                      <h3>Total Reservations</h3>
                      <v-spacer></v-spacer>
                      <v-icon color="green">mdi-calendar-text</v-icon>
                    </div>
                    <h1 class="px-7">{{totalReservations}}</h1>
                    
                  </div>
                </v-col>
                <v-col cols="12" md="4" class="py-7">
                  <div class="border pa-10 rounded-lg">
                    <div class="d-flex align-center px-7">
                      <h3>Average Rating</h3>
                      <v-spacer></v-spacer>
                      <v-icon color="green">mdi-star-outline</v-icon>
                    </div>
                  <h1 class="px-7">{{ averageRating.toFixed(1) }}</h1>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
