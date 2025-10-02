<script setup>
import { ref, computed, onMounted  } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePostStore } from '@/stores/postStore.js'
import UpdatePost from "@/components/system/owner/UpdatePost.vue";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"
import { formatDistanceToNow } from 'date-fns'


const drawer = ref(true)
const deleteDialog = ref(false)
const deletePostId = ref(null)
const selectedPost = ref(null)
const isUpdateDialogOpen = ref(false)

const postStore = usePostStore()

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
  postDialog.value.tags = post.boarding_house_tags?.map(tag => tag.tags.tag_name)
  postDialog.value.images = post.boarding_house_images.map(image => image.image_url)
  postDialog.value.address = post.address
  postDialog.value.latitude = post.latitude
  postDialog.value.longitude = post.longitude
  postDialog.value.price = post.price
  postDialog.value.name = post.name
  postDialog.value.description = post.description
  postDialog.value.reviews = post.reviews || []

  postDialog.value.boardingHouseId = post.id

  postDialog.value.reviews?.forEach(review => {
    if (review.created_at) {
      review.timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });
    }
  });

}

const onUpdate = (post) => {
  selectedPost.value = post
  isUpdateDialogOpen.value = true
}

const averageRating = computed(() => {
  if (postDialog.value.reviews && postDialog.value.reviews.length > 0) {
    const totalRating = postDialog.value.reviews.reduce((acc, review) => acc + review.rating, 0)
    return totalRating / postDialog.value.reviews.length
  }
  return 0
})

onMounted(async () => {
  try {
    await postStore.ownerPost()

    postStore.posts.forEach(post => {
      if (post.created_at) {
        post.timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
})

const deletePost = async () => {
  try {
    await postStore.deletePost(deletePostId.value)
    postStore.posts = postStore.posts.filter(post => post.id !== deletePostId.value)
  } catch (error) {
    console.error('Error deleting post:', error)
  }
  deleteDialog.value = false
}

const onDelete = (post) => {
  deletePostId.value = post.id
  deleteDialog.value = true
}
</script>


<template>
  <AppLayout>
    <template #content>
      <Navbar v-model="drawer" />
      <v-row style="height: calc(100vh + 12px);" class="ma-0">
        <v-col cols="12" class="d-flex justify-center align-center pa-0">
          <v-card class="posts-container" :elevation="0">
            <!-- Modern Header -->
            <v-card-title class="posts-header">
              <v-row class="align-center">
                <v-col cols="6" class="d-flex justify-start align-center px-sm-10">
                  <RouterLink
                    style="text-decoration: none;color: inherit;"
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
                <v-col cols="6" class="d-flex align-center justify-end px-sm-10">
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

            <!-- Content Section -->
            <v-card-text class="posts-content">
              <v-container fluid class="px-sm-10">
                <!-- Page Header -->
                <v-row class="page-header mb-8">
                  <v-col cols="12" md="6" class="d-flex align-center">
                    <div>
                      <h1 class="page-title">Your Listings</h1>
                      <p class="page-subtitle">Manage and track your property listings</p>
                    </div>
                  </v-col>
                  <v-col cols="12" md="6" class="d-flex align-center justify-md-end">
                    <v-btn
                      prepend-icon="mdi-plus-circle"
                      class="create-btn"
                      color="green-darken-2"
                      size="large"
                      rounded="lg"
                      elevation="0"
                      @click="$router.push('/owner/create')"
                    >
                      <span class="font-weight-bold">Create Listing</span>
                    </v-btn>
                  </v-col>
                </v-row>

                <!-- Posts Grid -->
                <v-row>
                  <v-col 
                    v-for="post in postStore.posts" 
                    :key="post.id" 
                    cols="12" sm="6" lg="4" 
                    class="post-col"
                  >
                    <v-card class="post-card" elevation="0" rounded="xl">
                      <!-- Image Section -->
                      <div class="post-images">
                        <v-img
                          class="main-post-image"
                          :src="post.boarding_house_images?.[0]?.image_url"
                          height="220"
                          cover
                          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.3)"
                        >
                          <div class="image-overlay">
                            <v-chip
                              size="small"
                              class="time-chip"
                              color="white"
                              variant="flat"
                            >
                              <v-icon size="14" class="mr-1">mdi-clock-outline</v-icon>
                              {{ post.timeAgo }}
                            </v-chip>
                          </div>
                        </v-img>
                        <div class="secondary-post-image" v-if="post.boarding_house_images?.[1]">
                          <v-img
                            class="small-post-image"
                            :src="post.boarding_house_images?.[1]?.image_url"
                            height="60"
                            cover
                          ></v-img>
                        </div>
                      </div>

                      <!-- Content Section -->
                      <v-card-text class="pa-5">
                        <h3 class="post-name mb-2">{{ post.name }}</h3>
                        <div class="d-flex align-center mb-3">
                          <v-icon size="16" color="grey-darken-1" class="mr-1">mdi-map-marker</v-icon>
                          <p class="text-caption text-medium-emphasis location-text">
                            {{ post.address }}
                          </p>
                        </div>
                        
                        <div class="price-section mb-4">
                          <span class="price-amount">₱{{ post.price }}</span>
                          <span class="price-period">/month</span>
                        </div>
                        
                        <div class="tags-section mb-4" v-if="post.boarding_house_tags.length > 0">
                          <v-chip
                            size="small"
                            class="tag-chip"
                            color="green-darken-2"
                            variant="flat"
                          >
                            {{ post.boarding_house_tags[0].tags.tag_name }}
                          </v-chip>
                          <v-chip
                            size="small"
                            v-if="post.boarding_house_tags.length > 1"
                            class="tag-chip"
                            color="green-darken-2"
                            variant="flat"
                          >
                            +{{ post.boarding_house_tags.length - 1 }}
                          </v-chip>
                        </div>
                      </v-card-text>

                      <!-- Actions -->
                      <v-card-actions class="px-5 pb-5">
                        <v-btn
                          size="large"
                          class="view-btn"
                          color="green-darken-2"
                          rounded="lg"
                          variant="tonal"
                          block
                          @click="openDialog(post)"
                        >
                          <span class="font-weight-bold">View Details</span>
                        </v-btn>
                        <v-menu location="start" rounded="lg">
                          <template v-slot:activator="{ props }">
                            <v-btn
                              icon
                              variant="text"
                              v-bind="props"
                              class="action-menu-btn"
                            >
                              <v-icon>mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>

                          <v-list class="action-menu" rounded="lg">
                            <v-list-item class="menu-header">
                              <v-list-item-title class="font-weight-bold text-caption">
                                Actions
                              </v-list-item-title>
                            </v-list-item>
                            <v-divider></v-divider>
                            <v-list-item
                              density="comfortable"
                              @click="onUpdate(post)"
                              class="menu-item"
                            >
                              <template v-slot:prepend>
                                <v-icon color="blue-darken-2">mdi-pencil</v-icon>
                              </template>
                              <v-list-item-title class="font-weight-medium">Edit</v-list-item-title>
                            </v-list-item>
                            <v-list-item
                              density="comfortable"
                              @click="onDelete(post)"
                              class="menu-item"
                            >
                              <template v-slot:prepend>
                                <v-icon color="red">mdi-delete</v-icon>
                              </template>
                              <v-list-item-title class="font-weight-medium text-red">
                                Delete
                              </v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Post Detail Dialog -->
      <v-dialog v-model="postDialog.PostContent" max-width="900" scrollable>
        <v-card class="detail-dialog" rounded="xl">
          <v-card-title class="dialog-header pa-6">
            <div class="d-flex align-center w-100">
              <div>
                <h2 class="text-h5 font-weight-bold mb-1">{{ postDialog.name }}</h2>
                <p class="text-caption text-medium-emphasis">Your Property Listing</p>
              </div>
              <v-spacer></v-spacer>
              <v-btn
                icon="mdi-close"
                variant="text"
                size="large"
                @click="postDialog.PostContent=false"
              ></v-btn>
            </div>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-card-text class="pa-6">
            <v-row>
              <!-- Image Gallery -->
              <v-col cols="12">
                <div class="detail-gallery mb-6">
                  <v-img
                    class="main-detail-image"
                    :src="postDialog.images[0]"
                    @click="openCarousel(0)"
                    aspect-ratio="16/9"
                    cover
                    rounded="lg"
                  >
                  </v-img>
                  <div class="detail-thumbnails mt-3">
                    <v-img
                      v-for="(img, idx) in postDialog.images.slice(1, 4)"
                      :key="idx"
                      class="thumbnail-image"
                      :src="img"
                      @click="openCarousel(idx + 1)"
                      aspect-ratio="1"
                      cover
                      rounded="lg"
                    >
                      <div v-if="idx === 2 && extraImagesCount > 0" class="thumbnail-overlay">
                        <span class="overlay-text">+{{ extraImagesCount }}</span>
                      </div>
                    </v-img>
                  </div>
                </div>
              </v-col>

              <!-- Property Info -->
              <v-col cols="12">
                <div class="price-section-large mb-6">
                  <span class="price-amount-large">₱{{ postDialog.price }}</span>
                  <span class="price-period-large">/month</span>
                </div>
              </v-col>

              <!-- Tags -->
              <v-col cols="12" v-if="postDialog.tags.length > 0">
                <div class="tags-container mb-6">
                  <v-chip
                    v-for="(tag, index) in postDialog.tags"
                    :key="index"
                    color="green-darken-2"
                    variant="flat"
                    class="mr-2 mb-2"
                    size="small"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </v-col>

              <!-- Description -->
              <v-col cols="12">
                <div class="info-section mb-6">
                  <h3 class="section-title mb-3">
                    <v-icon color="green-darken-2" class="mr-2">mdi-information</v-icon>
                    Description
                  </h3>
                  <p class="description-text">{{ postDialog.description }}</p>
                </div>
              </v-col>

              <!-- Location -->
              <v-col cols="12">
                <div class="info-section mb-6">
                  <h3 class="section-title mb-4">
                    <v-icon color="green-darken-2" class="mr-2">mdi-map-marker</v-icon>
                    Location
                  </h3>
                  <p class="text-body-2 mb-4 text-medium-emphasis">{{ postDialog.address }}</p>
                  <div class="map-container">
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
                </div>
              </v-col>

              <!-- Reviews Section -->
              <v-col cols="12">
                <div class="reviews-section">
                  <div class="reviews-header mb-6">
                    <div class="d-flex justify-space-between align-center">
                      <h3 class="section-title">
                        <v-icon color="green-darken-2" class="mr-2">mdi-star</v-icon>
                        Reviews ({{ postDialog.reviews.length }})
                      </h3>
                      <div class="rating-summary">
                        <span class="rating-number">{{ averageRating.toFixed(1) }}</span>
                        <v-rating
                          :size="20"
                          :model-value="averageRating"
                          color="yellow-darken-3"
                          half-increments
                          readonly
                          density="compact"
                        ></v-rating>
                      </div>
                    </div>
                  </div>

                  <div class="reviews-list">
                    <v-card
                      v-for="(review, index) in postDialog.reviews"
                      :key="index"
                      class="review-card mb-4"
                      elevation="0"
                      rounded="xl"
                      variant="outlined"
                    >
                      <v-card-text class="pa-5">
                        <div class="d-flex mb-4">
                          <v-avatar size="48" class="review-avatar">
                            <v-img :src="review.users?.picture"></v-img>
                          </v-avatar>
                          <div class="ml-4 flex-grow-1">
                            <h4 class="font-weight-bold mb-1">{{ review.users?.name }}</h4>
                            <p class="text-caption text-medium-emphasis">{{ review.timeAgo }}</p>
                          </div>
                        </div>
                        <v-rating
                          :size="18"
                          :model-value="review.rating"
                          color="yellow-darken-3"
                          half-increments
                          readonly
                          density="compact"
                          class="mb-3"
                        ></v-rating>
                        <p class="review-text">{{ review.comment }}</p>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Update Post Dialog -->
      <UpdatePost
        :post="selectedPost"
        :isOpen="isUpdateDialogOpen"
        @close="isUpdateDialogOpen = false"
        @updated="handlePostUpdate"
      />

      <!-- Image Carousel -->
      <v-dialog v-model="postDialog.carouselOpen" max-width="800">
        <v-card rounded="xl" class="carousel-card">
          <v-carousel 
            v-if="postDialog.carouselOpen" 
            hide-delimiters 
            v-model="postDialog.carouselIndex"
            height="600"
            show-arrows="hover"
          >
            <v-carousel-item
              v-for="(img, index) in postDialog.images"
              :key="index"
              :src="img"
              cover
            >
            </v-carousel-item>
          </v-carousel>
        </v-card>
      </v-dialog>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="500">
        <v-card rounded="xl" class="delete-dialog">
          <v-card-text class="pa-8">
            <div class="text-center mb-6">
              <div class="delete-icon-wrapper mb-4">
                <v-icon size="64" color="red">mdi-delete-alert</v-icon>
              </div>
              <h2 class="text-h5 font-weight-bold mb-3">Delete Listing?</h2>
              <p class="text-body-1 text-medium-emphasis">
                This action cannot be undone. The listing will be permanently removed.
              </p>
            </div>
            <v-row>
              <v-col cols="6">
                <v-btn
                  color="grey-darken-1"
                  variant="tonal"
                  rounded="lg"
                  block
                  size="large"
                  @click="deleteDialog = false"
                >
                  Cancel
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  color="red"
                  rounded="lg"
                  block
                  size="large"
                  @click="deletePost"
                >
                  Delete
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>

    </template>
  </AppLayout>
</template>

<style scoped>
/* Container */
.posts-container {
  border-radius: 0;
  height: 100vh;
  width: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
}

.posts-container::-webkit-scrollbar {
  width: 8px;
}

.posts-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.posts-container::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 4px;
}

/* Header */
.posts-header {
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
.posts-content {
  padding: 32px 16px;
}

/* Page Header */
.page-header {
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

.page-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #1b5e20;
  margin-bottom: 8px;
}

.page-subtitle {
  color: #424242;
  font-size: 1rem;
  font-weight: 500;
}

.create-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
}

/* Post Cards */
.post-col {
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

.post-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  border-color: #4caf50;
}

/* Post Images */
.post-images {
  position: relative;
}

.main-post-image {
  border-radius: 0;
  transition: transform 0.4s ease;
}

.post-card:hover .main-post-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
}

.time-chip {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
  font-weight: 600;
  font-size: 0.75rem;
}

.secondary-post-image {
  position: absolute;
  bottom: 12px;
  left: 12px;
}

.small-post-image {
  width: 60px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* Post Content */
.post-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1b5e20;
  line-height: 1.3;
}

.location-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  color: #616161;
}

.price-section {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 12px 16px;
  border-radius: 12px;
  display: inline-block;
}

.price-amount {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1b5e20;
}

.price-period {
  font-size: 0.95rem;
  color: #2e7d32;
  font-weight: 600;
}

.tags-section {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-chip {
  font-weight: 600;
  font-size: 0.75rem;
}

/* Actions */
.view-btn {
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s ease;
}

.view-btn:hover {
  transform: translateX(4px);
}

.action-menu-btn {
  transition: transform 0.3s ease;
}

.action-menu-btn:hover {
  transform: scale(1.1);
}

.action-menu {
  min-width: 180px;
}

.menu-header {
  background: #f5f5f5;
}

.menu-item {
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f5f5f5;
}

/* Detail Dialog */
.detail-dialog {
  background: white;
}

.dialog-header {
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.detail-gallery {
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.main-detail-image {
  cursor: pointer;
  transition: transform 0.3s ease;
  border: 2px solid rgba(0, 0, 0, 0.08);
}

.main-detail-image:hover {
  transform: scale(1.02);
}

.detail-thumbnails {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.thumbnail-image {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid rgba(0, 0, 0, 0.08);
  position: relative;
}

.thumbnail-image:hover {
  transform: scale(1.05);
  border-color: #4caf50;
}

.thumbnail-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.overlay-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.price-section-large {
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  padding: 16px 24px;
  border-radius: 16px;
  display: inline-block;
}

.price-amount-large {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1b5e20;
}

.price-period-large {
  font-size: 1.1rem;
  color: #2e7d32;
  font-weight: 600;
}

.tags-container {
  animation: fadeIn 0.6s ease;
}

.info-section {
  animation: fadeIn 0.6s ease;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1b5e20;
  display: flex;
  align-items: center;
}

.description-text {
  font-size: 1rem;
  line-height: 1.7;
  color: #424242;
}

.map-container {
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Reviews Section */
.reviews-section {
  animation: fadeIn 0.6s ease;
}

.reviews-header {
  padding: 20px;
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border-radius: 16px;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-number {
  font-size: 2rem;
  font-weight: 800;
  color: #f57f17;
}

.review-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.review-card:hover {
  transform: translateX(4px);
  border-color: #4caf50;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.review-avatar {
  border: 2px solid #4caf50;
}

.review-text {
  color: #424242;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Delete Dialog */
.delete-dialog {
  overflow: hidden;
}

.delete-icon-wrapper {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

/* Carousel */
.carousel-card {
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 960px) {
  .page-title {
    font-size: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }

  .posts-content {
    padding: 20px 12px;
  }

  .price-amount-large {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .page-header {
    margin-bottom: 24px !important;
  }

  .brand-text {
    font-size: 1.2rem;
  }

  .create-btn {
    font-size: 0.875rem;
  }
}
</style>