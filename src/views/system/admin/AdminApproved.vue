<script setup>
import Applayout from '@/components/layout/AppLayout.vue'
import { useAdminStore } from '@/stores/adminStore';
import { ref,computed, onMounted } from 'vue';
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"
import { formatDistanceToNow } from 'date-fns'
import AdminNavbar from '@/components/common/AdminNavbar.vue'

const adminStore = useAdminStore();
const totalBoardinghouses = computed(() => adminStore.boardinghouse.length);

const drawer = ref(true)

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
</script>

<template>
  <Applayout>
    <template #content>
      <AdminNavbar v-model="drawer" />
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
                  <h1>Approved Posts: {{ totalBoardinghouses }}</h1>
                </v-col>
                <v-col cols="12" v-for="boardinghouse in adminStore.boardinghouse" :key="boardinghouse.id">
                  <v-card class="d-flex align-start border border-b-lg">
                    <v-card-text>
                      <h2 class="text-h5 font-weight-bold">{{ boardinghouse.name }}</h2>
                      <p class="text-h6">{{ boardinghouse.address }}</p>
                      <p class="text-subtitle-1">Posted by: {{ boardinghouse.owner_name }}</p>
                    </v-card-text>
                    <v-card-actions class="my-2 py-5">
                      <v-btn size="large" class="my-2 py-2 rounded-lg font-weight-bold bg-green text-body-2" @click="openDialog(boardinghouse)">
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
      <v-dialog
        v-model="postDialog.PostContent"
        max-width="700"
       >
        <v-card style="overflow: hidden; border-radius: 20px">
          <div class="overflow-y-auto">
            <v-card-title class="d-flex align-center justify-center font-weight-bold"
            >
              <v-spacer class="px-4"></v-spacer>
              <h4>{{ postDialog.owner_name}}'s Post</h4>
              <v-spacer></v-spacer>
              <v-btn
                class="ma-2"
                icon="mdi-close"
                variant="text"
                @click="postDialog.PostContent=false"
              ></v-btn>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="overflow-x-hidden">
              <v-row>
                <v-col cols="12" class="text-center">
                  <h2>{{ postDialog.name }}</h2>
                </v-col>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="8">
                      <v-img
                        style="border-radius: 20px; cursor: pointer;"
                        :src="postDialog.images[0]"
                        @click="openCarousel(0)"
                        aspect-ratio="1"
                        cover
                      >
                      </v-img>
                    </v-col>
                    <v-col cols="4">
                      <v-row>
                        <v-col cols="12">
                          <v-img
                            style="border-radius: 20px; cursor: pointer;"
                            :src="postDialog.images[1]"
                            @click="openCarousel(1)"
                            aspect-ratio="1"
                            cover
                          >
                          </v-img>
                        </v-col>
                        <v-col cols="12">
                          <v-img
                            style="border-radius: 20px; cursor: pointer;"
                            :src="postDialog.images[2]"
                            @click="openCarousel(2)"
                            aspect-ratio="1"
                            cover
                          >
                            <div v-if="extraImagesCount > 0" class="overlay">
                              <span style="font-size: clamp(5px, 3vw, 25px)">{{ extraImagesCount }}+ more</span>
                            </div>
                          </v-img>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12">
                  <div v-if="postDialog.tags.length > 0">
                    <div class="d-flex flex-wrap">
                      <v-chip
                        size="small"
                        v-for="(tag, index) in postDialog.tags"
                        :key="index"
                        color="green-darken-2"
                        class="ma-1"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div class="d-flex flex-wrap mt-4 text-center" style="height: 300px; width: 100%; border-radius: 10px;">
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
                </v-col>
                <v-col cols="12" class="d-block">
                  <div class="d-flex justify-space-between">
                    <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>{{ postDialog.address }}</h2>

                  </div>
                  <br>
                  <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>₱{{ postDialog.price }}.00/month</h2>
                </v-col>
                <v-col cols="12">
                  <h2 class="text-h6">{{ postDialog.description }}</h2>
                </v-col>
                <v-divider class="mb-2"></v-divider>
                <v-col cols="12">

                  <div class="d-flex align-center px-5">
                    <h3 class="pr-5">REVIEWS ({{ postDialog.reviews.length }})</h3>
                    <v-spacer></v-spacer>
                    <h3>{{ averageRating.toFixed(1) }}</h3>
                    <v-rating
                      :size="21"
                      :model-value="averageRating.toFixed(1)"
                      color="yellow-darken-3"
                      half-increments
                      readonly
                    ></v-rating>
                  </div>
                  <div
                    class="d-flex flex-column text-start py-5 px-5"
                  >
                    <v-card
                      v-for="(review, index) in postDialog.reviews"
                      :key="index"
                      class="mb-3 border border-b-lg"
                      style="border-radius: 15px"
                    >
                      <v-card-text>
                        <div class="d-flex">
                          <v-avatar
                            image="https://cdn.vuetifyjs.com/images/john.jpg"
                            size="40"
                          >
                          </v-avatar>
                          <h3 class="font-weight-bold pl-4">{{ review.reviewer_name }}</h3>
                          <v-spacer></v-spacer>
                          <p class="text-caption">{{ review.timeAgo }}</p>
                        </div>
                        <v-divider class="mt-3"></v-divider>
                        <div class="d-flex flex-column">
                          <v-rating
                            size="small"
                            :model-value="review.rating"
                            color="yellow-darken-3"
                            half-increments
                            readonly
                          ></v-rating>
                          <div class="mx-3">
                            <span style="font-size: 14px">{{ review.comment }}</span>
                          </div>

                        </div>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
        </v-card>
      </v-dialog>
    </template>
  </Applayout>
</template>