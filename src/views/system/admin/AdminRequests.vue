<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '@/stores/adminStore'
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"
import { formatDistanceToNow } from 'date-fns'
import AdminNavbar from '@/components/common/AdminNavbar.vue'

const drawer = ref(true)
const adminStore = useAdminStore()
const postDialog = ref({
  tags: [],
  PostContent: false,
  images: [],
  carouselOpen: false,
  carouselIndex: 0,
})

const extraImagesCount = computed(() => postDialog.value.images.length - 3)

const openCarousel = (index) => {
  postDialog.value.carouselIndex = index
  postDialog.value.carouselOpen = true
}

const openDialog = (post) => {
  postDialog.value.PostContent = true
  postDialog.value.tags = post.tags || []
  postDialog.value.images = post.images || []
  postDialog.value.address = post.address
  postDialog.value.owner_name = post.owner_name
  postDialog.value.latitude = post.latitude
  postDialog.value.longitude = post.longitude
  postDialog.value.price = post.price
  postDialog.value.name = post.name
  postDialog.value.description = post.description
  postDialog.value.boardingHouseId = post.id

  postDialog.value.reviews = (post.reviews || []).map(review => {
    const reviewTime = new Date(review.created_at)
    const timeAgo = formatDistanceToNow(reviewTime, { addSuffix: true })
    return {
      ...review,
      timeAgo,
    }
  })
}

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
</script>

<template>
  <AppLayout>
    <template #content>
      <AdminNavbar v-model="drawer" />
      <v-row>
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-card :elevation="0" style="border-radius: 0; height: 100vh; width: 100%; overflow-y: auto; background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);">
            
            <!-- Header -->
            <v-card-title class="py-0 bg-white" style="position: sticky; top: 0; z-index: 10; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              <v-row>
                <v-col cols="6" class="d-flex justify-start align-center px-sm-16">
                  <RouterLink
                    style="text-decoration: none; color: inherit;"
                    to="/"
                    class="d-inline-flex align-center justify-center ga-2 my-5"
                  >
                    <img src="@/assets/logo.png" alt="Logo" width="32" height="32" />
                    <h3 class="font-weight-bold text-h5">StaySearch</h3>
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
            <v-card-text class="px-4 px-sm-8 py-8">
              <v-row class="px-sm-8">
                <!-- Stats Card -->
                <v-col cols="12" class="mb-4">
                  <v-card 
                    class="rounded-xl" 
                    elevation="0"
                    style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border: none;"
                  >
                    <v-card-text class="py-8 px-6">
                      <div class="d-flex align-center">
                        <div class="flex-grow-1">
                          <p class="text-overline text-white mb-1" style="opacity: 0.9; letter-spacing: 1px;">Pending Approval</p>
                          <h1 class="text-h2 font-weight-bold text-white mb-0">{{ totalBoardinghouses }}</h1>
                          <p class="text-body-2 text-white mt-2" style="opacity: 0.8;">Posts awaiting your review</p>
                        </div>
                        <div class="d-none d-sm-flex">
                          <v-icon size="80" color="white" style="opacity: 0.3;">mdi-clock-alert-outline</v-icon>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Pending Posts List -->
                <v-col 
                  cols="12"
                  v-for="boardinghouse in adminStore.boardinghouse" 
                  :key="boardinghouse.id"
                >
                  <v-card 
                    class="rounded-xl hover-card" 
                    elevation="0"
                    style="border: 1px solid rgba(0,0,0,0.08); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
                  >
                    <v-card-text class="pa-5">
                      <v-row>
                        <!-- Content Section -->
                        <v-col cols="12" md="8">
                          <div class="d-flex align-start mb-3">
                            <v-avatar color="orange-lighten-4" size="48" class="mr-3">
                              <v-icon color="orange-darken-2">mdi-home-alert</v-icon>
                            </v-avatar>
                            <div class="flex-grow-1">
                              <div class="d-flex align-center mb-2">
                                <v-chip size="small" color="orange-darken-1" class="mr-2">
                                  <v-icon start size="x-small">mdi-clock-outline</v-icon>
                                  PENDING
                                </v-chip>
                              </div>
                              <h3 class="text-h5 font-weight-bold mb-2" style="line-height: 1.3;">{{ boardinghouse.name }}</h3>
                            </div>
                          </div>
                          
                          <div class="ml-0 ml-md-15">
                            <div class="d-flex align-start mb-2">
                              <v-icon size="small" color="grey-darken-1" class="mr-2 mt-1">mdi-map-marker</v-icon>
                              <p class="text-body-1 text-grey-darken-2 mb-0" style="line-height: 1.5;">{{ boardinghouse.address }}</p>
                            </div>
                            <div class="d-flex align-center mb-3">
                              <v-icon size="small" color="grey-darken-1" class="mr-2">mdi-account-circle</v-icon>
                              <p class="text-body-1 mb-0">
                                <span class="text-grey-darken-1">Posted by:</span> 
                                <strong class="text-grey-darken-3">{{ boardinghouse.owner_name }}</strong>
                              </p>
                            </div>

                            <v-btn 
                              class="rounded-lg font-weight-bold text-none" 
                              color="blue-darken-1"
                              variant="outlined"
                              size="default"
                              @click="openDialog(boardinghouse)"
                            >
                              <v-icon start>mdi-eye</v-icon>
                              View Full Details
                            </v-btn>
                          </div>
                        </v-col>

                        <!-- Action Section -->
                        <v-col cols="12" md="4" class="d-flex align-center">
                          <v-divider vertical class="d-none d-md-block mr-4"></v-divider>
                          <v-divider class="d-block d-md-none my-3"></v-divider>
                          <div class="flex-grow-1">
                            <p class="text-overline text-grey-darken-1 mb-3">Actions Required</p>
                            <div class="d-flex flex-column ga-2">
                              <v-btn
                                color="green-darken-1"
                                size="large"
                                class="rounded-lg font-weight-bold text-none"
                                elevation="0"
                                @click="handleApprove(boardinghouse.id)"
                              >
                                <v-icon start>mdi-check-circle</v-icon>
                                Approve Post
                              </v-btn>
                              <v-btn
                                color="red-darken-1"
                                size="large"
                                variant="outlined"
                                class="rounded-lg font-weight-bold text-none"
                                @click="handleReject(boardinghouse.id)"
                              >
                                <v-icon start>mdi-close-circle</v-icon>
                                Reject Post
                              </v-btn>
                            </div>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Empty State -->
                <v-col cols="12" v-if="adminStore.boardinghouse.length === 0">
                  <v-card class="rounded-xl text-center py-16" elevation="0" style="border: 2px dashed rgba(0,0,0,0.12);">
                    <v-icon size="100" color="grey-lighten-1">mdi-checkbox-marked-circle-outline</v-icon>
                    <h3 class="text-h4 mt-6 mb-2 text-grey-darken-1">All Caught Up!</h3>
                    <p class="text-h6 text-grey">There are no pending posts to review at the moment.</p>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Enhanced Dialog -->
      <v-dialog
        v-model="postDialog.PostContent"
        max-width="800"
        scrollable
      >
        <v-card style="border-radius: 24px; overflow: hidden;">
          <!-- Dialog Header -->
          <v-card-title class="d-flex align-center py-4 px-6 bg-white" style="position: sticky; top: 0; z-index: 10; border-bottom: 1px solid rgba(0,0,0,0.08);">
            <div class="d-flex align-center flex-grow-1">
              <v-avatar color="orange-lighten-4" size="40" class="mr-3">
                <v-icon color="orange-darken-2">mdi-account</v-icon>
              </v-avatar>
              <div>
                <h4 class="text-h6 font-weight-bold mb-0">{{ postDialog.owner_name }}'s Post</h4>
                <p class="text-caption text-grey-darken-1 mb-0">Pending Review</p>
              </div>
            </div>
            <v-btn
              icon
              variant="text"
              @click="postDialog.PostContent=false"
              size="small"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-6">
            <v-row>
              <!-- Property Name -->
              <v-col cols="12">
                <h2 class="text-h4 font-weight-bold mb-2">{{ postDialog.name }}</h2>
                <div class="d-flex align-center">
                  <v-chip size="small" color="orange-darken-1" class="mr-2">
                    <v-icon start size="small">mdi-clock-outline</v-icon>
                    Pending Approval
                  </v-chip>
                  <v-chip size="small" variant="outlined">
                    <v-icon start size="small">mdi-home</v-icon>
                    Boarding House
                  </v-chip>
                </div>
              </v-col>

              <!-- Image Gallery -->
              <v-col cols="12" class="mt-4">
                <v-row>
                  <v-col cols="12" md="8">
                    <v-card class="rounded-xl overflow-hidden" elevation="0">
                      <v-img
                        style="cursor: pointer;"
                        :src="postDialog.images[0]"
                        @click="openCarousel(0)"
                        aspect-ratio="1.5"
                        cover
                      >
                      </v-img>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-row>
                      <v-col cols="6" md="12">
                        <v-card class="rounded-xl overflow-hidden" elevation="0">
                          <v-img
                            style="cursor: pointer;"
                            :src="postDialog.images[1]"
                            @click="openCarousel(1)"
                            aspect-ratio="1"
                            cover
                          >
                          </v-img>
                        </v-card>
                      </v-col>
                      <v-col cols="6" md="12">
                        <v-card class="rounded-xl overflow-hidden position-relative" elevation="0">
                          <v-img
                            style="cursor: pointer;"
                            :src="postDialog.images[2]"
                            @click="openCarousel(2)"
                            aspect-ratio="1"
                            cover
                          >
                            <div v-if="extraImagesCount > 0" 
                              style="position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; cursor: pointer;"
                            >
                              <span class="text-white text-h6 font-weight-bold">+{{ extraImagesCount }} more</span>
                            </div>
                          </v-img>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-col>

              <!-- Tags -->
              <v-col cols="12" v-if="postDialog.tags.length > 0">
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="(tag, index) in postDialog.tags"
                    :key="index"
                    color="green-lighten-4"
                    text-color="green-darken-3"
                    size="small"
                  >
                    <v-icon start size="small">mdi-tag</v-icon>
                    {{ tag }}
                  </v-chip>
                </div>
              </v-col>

              <!-- Price & Location Card -->
              <v-col cols="12">
                <v-card class="rounded-xl" elevation="0" style="background: linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%); border: 1px solid rgba(245, 87, 108, 0.2);">
                  <v-card-text class="pa-4">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="d-flex align-center">
                          <v-icon color="orange-darken-2" size="large" class="mr-3">mdi-cash</v-icon>
                          <div>
                            <p class="text-caption text-grey-darken-1 mb-0">Monthly Rate</p>
                            <h3 class="text-h5 font-weight-bold text-orange-darken-2">₱{{ postDialog.price }}.00</h3>
                          </div>
                        </div>
                      </v-col>
                      <v-col cols="12" sm="6">
                        <div class="d-flex align-start">
                          <v-icon color="grey-darken-2" class="mr-3 mt-1">mdi-map-marker</v-icon>
                          <div>
                            <p class="text-caption text-grey-darken-1 mb-0">Location</p>
                            <p class="text-body-2 font-weight-medium mb-0">{{ postDialog.address }}</p>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-3">Property Description</h3>
                <p class="text-body-1 text-grey-darken-2" style="line-height: 1.8;">{{ postDialog.description }}</p>
              </v-col>

              <!-- Map -->
              <v-col cols="12">
                <h3 class="text-h6 font-weight-bold mb-3">Location Map</h3>
                <v-card class="rounded-xl overflow-hidden" elevation="0">
                  <div style="height: 350px; width: 100%;">
                    <l-map
                      :use-global-leaflet="false"
                      ref="map"
                      zoom="15"
                      :center="[postDialog.latitude, postDialog.longitude]"
                      minZoom="15"
                    >
                      <l-tile-layer
                        url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=sQh8Ib7Qh6Fp1elfR6K8"
                        layer-type="base"
                        name="OpenStreetMap"
                      ></l-tile-layer>
                      <l-marker :lat-lng="[postDialog.latitude, postDialog.longitude]"></l-marker>
                    </l-map>
                  </div>
                </v-card>
              </v-col>

              <!-- Review Notice -->
              <v-col cols="12">
                <v-divider class="my-2"></v-divider>
                <v-alert
                  type="info"
                  variant="tonal"
                  class="rounded-lg"
                  border="start"
                  border-color="blue-darken-2"
                >
                  <template v-slot:title>
                    <span class="text-body-1 font-weight-bold">Review Required</span>
                  </template>
                  Please carefully review all property details, images, and location information before making a decision. Ensure the listing meets all platform guidelines and standards.
                </v-alert>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </AppLayout>
</template>

<style scoped>
.hover-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
  border-color: rgba(245, 87, 108, 0.3) !important;
}
</style>