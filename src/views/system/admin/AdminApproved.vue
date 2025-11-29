<script setup>
import Applayout from '@/components/layout/AppLayout.vue'
import { useAdminStore } from '@/stores/adminStore';
import { ref, computed, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"
import { formatDistanceToNow } from 'date-fns'
import AdminNavbar from '@/components/common/AdminNavbar.vue'

const adminStore = useAdminStore();
const totalBoardinghouses = computed(() => adminStore.boardinghouse.length);

const drawer = ref(true)
const deleteDialog = ref(false)
const postToDelete = ref(null)
const isDeleting = ref(false)

onMounted(() => {
  adminStore.fetchBoardData2(); 
});

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

const averageRating = computed(() => {
  if (postDialog.value.reviews && postDialog.value.reviews.length > 0) {
    const totalRating = postDialog.value.reviews.reduce((acc, review) => acc + review.rating, 0)
    return totalRating / postDialog.value.reviews.length
  }
  return 0
})

const confirmDelete = (boardinghouse) => {
  postToDelete.value = boardinghouse
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!postToDelete.value) return
  
  isDeleting.value = true
  try {
    const result = await adminStore.deletePost(postToDelete.value.id)
    
    if (result.success) {
      // Close dialogs
      deleteDialog.value = false
      postDialog.value.PostContent = false
      postToDelete.value = null
    } else {
      console.error('Delete failed:', result.error)
      alert('Failed to delete post. Please try again.')
    }
  } catch (error) {
    console.error('Error deleting post:', error)
    alert('An error occurred while deleting the post.')
  } finally {
    isDeleting.value = false
  }
}

const cancelDelete = () => {
  deleteDialog.value = false
  postToDelete.value = null
}
</script>

<template>
  <Applayout>
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
                    style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none;"
                  >
                    <v-card-text class="py-8 px-6">
                      <div class="d-flex align-center">
                        <div class="flex-grow-1">
                          <p class="text-overline text-white mb-1" style="opacity: 0.9; letter-spacing: 1px;">Total Approved Posts</p>
                          <h1 class="text-h2 font-weight-bold text-white mb-0">{{ totalBoardinghouses }}</h1>
                          <p class="text-body-2 text-white mt-2" style="opacity: 0.8;">Active boarding houses in the system</p>
                        </div>
                        <div class="d-none d-sm-flex">
                          <v-icon size="80" color="white" style="opacity: 0.3;">mdi-home-city</v-icon>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Boarding Houses Grid -->
                <v-col 
                  cols="12" 
                  sm="6" 
                  lg="4"
                  v-for="boardinghouse in adminStore.boardinghouse" 
                  :key="boardinghouse.id"
                >
                  <v-card 
                    class="rounded-xl hover-card" 
                    elevation="0"
                    style="border: 1px solid rgba(0,0,0,0.08); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); height: 100%;"
                  >
                    <v-card-text class="pa-5">
                      <div class="d-flex align-start mb-3">
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-2">
                            <v-icon color="green-darken-1" size="small" class="mr-2">mdi-check-circle</v-icon>
                            <span class="text-caption text-green-darken-1 font-weight-bold">APPROVED</span>
                          </div>
                          <h3 class="text-h6 font-weight-bold mb-2" style="line-height: 1.3;">{{ boardinghouse.name }}</h3>
                        </div>
                      </div>
                      
                      <div class="mb-4">
                        <div class="d-flex align-start mb-2">
                          <v-icon size="small" color="grey-darken-1" class="mr-2 mt-1">mdi-map-marker</v-icon>
                          <p class="text-body-2 text-grey-darken-2 mb-0" style="line-height: 1.5;">{{ boardinghouse.address }}</p>
                        </div>
                        <div class="d-flex align-center">
                          <v-icon size="small" color="grey-darken-1" class="mr-2">mdi-account</v-icon>
                          <p class="text-body-2 text-grey-darken-2 mb-0">{{ boardinghouse.owner_name }}</p>
                        </div>
                      </div>

                      <v-divider class="mb-4"></v-divider>

                      <div class="d-flex ga-2">
                        <v-btn 
                          size="large" 
                          class="rounded-lg font-weight-bold text-none flex-grow-1" 
                          color="green-darken-1"
                          elevation="0"
                          @click="openDialog(boardinghouse)"
                        >
                          <v-icon start>mdi-eye</v-icon>
                          View
                        </v-btn>
                        <v-btn 
                          size="large" 
                          class="rounded-lg" 
                          color="red-darken-1"
                          elevation="0"
                          icon
                          @click="confirmDelete(boardinghouse)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Empty State -->
                <v-col cols="12" v-if="adminStore.boardinghouse.length === 0">
                  <v-card class="rounded-xl text-center py-16" elevation="0" style="border: 2px dashed rgba(0,0,0,0.12);">
                    <v-icon size="80" color="grey-lighten-1">mdi-home-search</v-icon>
                    <h3 class="text-h5 mt-4 mb-2 text-grey-darken-1">No Approved Posts</h3>
                    <p class="text-body-1 text-grey">There are no approved boarding houses at the moment.</p>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Delete Confirmation Dialog -->
      <v-dialog
        v-model="deleteDialog"
        max-width="500"
      >
        <v-card class="rounded-xl">
          <v-card-title class="d-flex align-center py-4 px-6 bg-red-lighten-5">
            <v-icon color="red-darken-1" size="large" class="mr-3">mdi-alert-circle</v-icon>
            <span class="text-h6 font-weight-bold">Confirm Delete</span>
          </v-card-title>
          
          <v-card-text class="pa-6">
            <p class="text-body-1 mb-4">Are you sure you want to delete this boarding house post?</p>
            <v-card class="rounded-lg pa-4" elevation="0" color="grey-lighten-4" v-if="postToDelete">
              <h4 class="text-subtitle-1 font-weight-bold mb-2">{{ postToDelete.name }}</h4>
              <p class="text-body-2 text-grey-darken-1 mb-1">Owner: {{ postToDelete.owner_name }}</p>
              <p class="text-body-2 text-grey-darken-1 mb-0">Location: {{ postToDelete.address }}</p>
            </v-card>
            <v-alert type="warning" variant="tonal" class="mt-4">
              This action cannot be undone. The post will be permanently removed from the system.
            </v-alert>
          </v-card-text>

          <v-card-actions class="px-6 pb-4">
            <v-spacer></v-spacer>
            <v-btn
              variant="text"
              @click="cancelDelete"
              :disabled="isDeleting"
              class="text-none"
            >
              Cancel
            </v-btn>
            <v-btn
              color="red-darken-1"
              variant="flat"
              @click="handleDelete"
              :loading="isDeleting"
              class="text-none px-6"
            >
              <v-icon start>mdi-delete</v-icon>
              Delete Post
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Enhanced Details Dialog -->
      <v-dialog
        v-model="postDialog.PostContent"
        max-width="800"
        scrollable
      >
        <v-card style="border-radius: 24px; overflow: hidden;">
          <!-- Dialog Header -->
          <v-card-title class="d-flex align-center py-4 px-6 bg-white" style="position: sticky; top: 0; z-index: 10; border-bottom: 1px solid rgba(0,0,0,0.08);">
            <div class="d-flex align-center flex-grow-1">
              <v-avatar color="green-lighten-4" size="40" class="mr-3">
                <v-icon color="green-darken-2">mdi-account</v-icon>
              </v-avatar>
              <div>
                <h4 class="text-h6 font-weight-bold mb-0">{{ postDialog.owner_name }}'s Post</h4>
                <p class="text-caption text-grey-darken-1 mb-0">Property Details</p>
              </div>
            </div>
            <v-btn
              icon="mdi-delete"
              variant="text"
              color="red-darken-1"
              size="small"
              class="mr-2"
              @click="confirmDelete({ id: postDialog.boardingHouseId, name: postDialog.name, owner_name: postDialog.owner_name, address: postDialog.address })"
            >
            </v-btn>
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
                  <v-chip size="small" color="green-darken-1" class="mr-2">
                    <v-icon start size="small">mdi-check-decagram</v-icon>
                    Verified
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
                <v-card class="rounded-xl" elevation="0" style="background: linear-gradient(135deg, #f6f9fc 0%, #edf2f7 100%); border: 1px solid rgba(0,0,0,0.06);">
                  <v-card-text class="pa-4">
                    <v-row>
                      <v-col cols="12" sm="6">
                        <div class="d-flex align-center">
                          <v-icon color="green-darken-2" size="large" class="mr-3">mdi-cash</v-icon>
                          <div>
                            <p class="text-caption text-grey-darken-1 mb-0">Monthly Rate</p>
                            <h3 class="text-h5 font-weight-bold text-green-darken-2">₱{{ postDialog.price }}.00</h3>
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
                <h3 class="text-h6 font-weight-bold mb-3">About this property</h3>
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

              <!-- Reviews Section -->
              <v-col cols="12">
                <v-divider class="my-4"></v-divider>
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <h3 class="text-h5 font-weight-bold">Reviews</h3>
                    <p class="text-body-2 text-grey-darken-1">{{ postDialog.reviews.length }} {{ postDialog.reviews.length === 1 ? 'review' : 'reviews' }}</p>
                  </div>
                  <v-card class="rounded-lg pa-3" elevation="0" color="yellow-lighten-4">
                    <div class="d-flex align-center">
                      <v-icon color="yellow-darken-3" size="large" class="mr-2">mdi-star</v-icon>
                      <div>
                        <h3 class="text-h5 font-weight-bold mb-0">{{ averageRating.toFixed(1) }}</h3>
                        <v-rating
                          :size="16"
                          :model-value="averageRating"
                          color="yellow-darken-3"
                          half-increments
                          readonly
                          density="compact"
                        ></v-rating>
                      </div>
                    </div>
                  </v-card>
                </div>

                <!-- Reviews List -->
                <div class="d-flex flex-column ga-3">
                  <v-card
                    v-for="(review, index) in postDialog.reviews"
                    :key="index"
                    class="rounded-xl"
                    elevation="0"
                    style="border: 1px solid rgba(0,0,0,0.08);"
                  >
                    <v-card-text class="pa-4">
                      <div class="d-flex align-center mb-3">
                        <v-avatar
                          image="https://cdn.vuetifyjs.com/images/john.jpg"
                          size="48"
                        >
                        </v-avatar>
                        <div class="ml-3 flex-grow-1">
                          <h4 class="text-subtitle-1 font-weight-bold mb-0">{{ review.reviewer_name }}</h4>
                          <p class="text-caption text-grey-darken-1 mb-0">{{ review.timeAgo }}</p>
                        </div>
                        <v-rating
                          :size="20"
                          :model-value="review.rating"
                          color="yellow-darken-3"
                          half-increments
                          readonly
                          density="compact"
                        ></v-rating>
                      </div>
                      <p class="text-body-2 text-grey-darken-2 mb-0" style="line-height: 1.6;">{{ review.comment }}</p>
                    </v-card-text>
                  </v-card>

                  <!-- No Reviews State -->
                  <v-card 
                    v-if="postDialog.reviews.length === 0"
                    class="rounded-xl text-center pa-8"
                    elevation="0"
                    style="border: 2px dashed rgba(0,0,0,0.12);"
                  >
                    <v-icon size="60" color="grey-lighten-1">mdi-comment-text-outline</v-icon>
                    <p class="text-body-1 text-grey-darken-1 mt-3 mb-0">No reviews yet</p>
                  </v-card>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </template>
  </Applayout>
</template>

<style scoped>
.hover-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
  border-color: rgba(102, 126, 234, 0.3) !important;
}
</style>