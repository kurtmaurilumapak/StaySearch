<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePostStore } from '@/stores/postStore'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/userStore'
import { useMessageStore } from '@/stores/messageStore'
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"
import { formatDistanceToNow } from 'date-fns'
import ReservationsPage from '@/components/system/student/ReservationsPage.vue'
import AddReservation from '@/components/system/student/AddReservation.vue'

const router = useRouter()
const theme = useTheme()
const useAuth = useAuthStore()
const postStore = usePostStore()
const userStore = useUserStore()
const messageStore = useMessageStore()

const reservationsDialogOpen = ref(false)
const openReservationsDialog = () => {
  reservationsDialogOpen.value = true;
}
const addReservationDialogOpen = ref(false)
const boardingHouseId = ref(null)
const openAddReservationDialog = () => {
  boardingHouseId.value = postDialog.value.boardingHouseId
  addReservationDialogOpen.value = true;
};

const rating = ref(1)
const comment = ref('')
const sheet = ref(false)
const filterValue = ['Free Electricity', 'Free Water', 'Free Wifi']
const type = ['All Boys', 'All Girls', 'Mix']
const filter = ref([])
const priceRanges = [
  { label: ''},
  { label: '₱0-500', range: [0, 500] },
  { label: '₱501-1000', range: [501, 1000] },
  { label: '₱1001-1500', range: [1001, 1500] },
  { label: '₱1501-2000', range: [1501, 2000] },
  { label: '₱2001-2500+', range: [2001, 99999] }
];
const priceRangeIndex = ref(0);
const searchQuery = ref('')
const selectedType = ref('')

const handleBrandClick = () => {
  window.location.reload()
};

const postDialog = ref({
  tags: [],
  PostContent: false,
  images: [],
  carouselOpen: false,
  carouselIndex: 0,
  address: '',
  latitude: 0,
  longitude: 0,
  price: 0,
  name: '',
  description: '',
  owner_name: '',
  owner_id: null,
  reviews: [],
  avgRating: 0,
  boardingHouseId: null
})
const extraImagesCount = computed(() => postDialog.value.images.length - 3)
const openCarousel = (index) => {
  postDialog.value.carouselIndex = index
  postDialog.value.carouselOpen = true
}

const openDialog = (post) => {
  try {
    console.log('Opening dialog for post:', post)
    
    if (!post) {
      console.error('Post is undefined')
      return
    }
    
    postDialog.value.tags = post.tags || []
    postDialog.value.images = post.images || []
    postDialog.value.address = post.address || ''
    postDialog.value.latitude = post.latitude || 0
    postDialog.value.longitude = post.longitude || 0
    postDialog.value.price = post.price || 0
    postDialog.value.name = post.name || ''
    postDialog.value.description = post.description || ''
    postDialog.value.owner_name = post.owner_name || 'Unknown'
    postDialog.value.owner_id = post.owner_id || post.user_id || null
    postDialog.value.reviews = post.reviews || []
    postDialog.value.avgRating = post.average_rating || 0
    postDialog.value.boardingHouseId = post.id || null

    console.log('Dialog data set:', {
      name: postDialog.value.name,
      owner_id: postDialog.value.owner_id,
      boardingHouseId: postDialog.value.boardingHouseId
    })

    if (postDialog.value.reviews && Array.isArray(postDialog.value.reviews)) {
      postDialog.value.reviews.forEach(review => {
        if (review.created_at) {
          review.timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });
        }
      });
    }
    
    // Open dialog last to ensure all data is set
    postDialog.value.PostContent = true
    
  } catch (error) {
    console.error('Error opening dialog:', error)
  }
};

const fetchPosts = async () => {
  try {
    await postStore.allPost({
      priceRange: priceRanges[priceRangeIndex.value]?.range,
      selectedType: selectedType.value,
      filter: filter.value,
      searchQuery: searchQuery.value,

    });

    postStore.posts.forEach(post => {
      if (post.created_at) {
        post.timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
      }

    });
    await userStore.fetchUserData()
    
    // Fetch unread count after userData is loaded
    if (userStore.userData?.id) {
      await messageStore.fetchUnreadCount(userStore.userData.id)
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
}
onMounted(fetchPosts);
watch([priceRangeIndex, selectedType, filter, searchQuery], fetchPosts);



const addReview = async () => {
  try {
    await userStore.fetchUserData();
    const currentUser = userStore.userData;

    const newReview = await postStore.addReview(
   {
    rating: rating.value,
    comment: comment.value,
    },

    postDialog.value.boardingHouseId
    )
    postDialog.value.reviews.push({
      reviewer_name: currentUser.name,
      reviewer_picture: currentUser.picture,
      reviewer_rating: newReview.rating,
      reviewer_comment: newReview.comment,
    });

    sheet.value = false
    rating.value = 1
    comment.value = ''
  } catch (error) {
    console.error('Error adding review:', error)
  }
}

const logout = async () => {
  await useAuth.signOut()
  window.location.reload()
  theme.global.name.value = 'light'
  await router.push('/login')
}

const contactOwner = async (boardingHouseId, ownerId) => {
  try {
    console.log('Contact owner clicked:', { 
      boardingHouseId, 
      ownerId, 
      userId: userStore.userData?.id,
      ownerName: postDialog.value.owner_name,
      propertyName: postDialog.value.name
    })
    
    if (!userStore.userData?.id) {
      console.error('User data not loaded yet')
      await userStore.fetchUserData()
    }
    
    if (!ownerId) {
      console.error('Owner ID is missing')
      alert('Unable to contact owner. Owner information is missing.')
      return
    }
    
    // Close the property dialog
    postDialog.value.PostContent = false
    
    // Create or get conversation
    const conversation = await messageStore.createConversation(
      userStore.userData.id, // student_id
      ownerId, // owner_id (from post.owner_id)
      boardingHouseId
    )

    console.log('Conversation created/retrieved:', conversation)

    if (conversation) {
      // Navigate to messages page with conversation details
      await router.push({
        path: '/messages',
        query: { 
          conversationId: conversation.id,
          ownerId: ownerId,
          ownerName: postDialog.value.owner_name,
          propertyName: postDialog.value.name
        }
      })
    } else {
      console.error('Failed to create conversation')
      alert('Unable to start conversation. Please check your database connection.')
    }
  } catch (error) {
    console.error('Error starting conversation:', error)
    alert('An error occurred: ' + error.message)
  }
}
</script>


<template>
  <AppLayout>
    <template #content>
      <!-- Modern Glassmorphic App Bar -->
      <v-app-bar
        class="modern-appbar"
        :elevation="0"
        flat
      >
        <div class="appbar-background"></div>
        <v-row class="d-flex align-center position-relative">
          <v-col cols="6">
            <RouterLink
              style="text-decoration: none;color: white;"
              to="/student/page"
              class="d-inline-flex align-center ga-2 my-5 ml-5 logo-link"
              @click="handleBrandClick"
            >
              <div class="logo-container">
                <img
                  src="@/assets/logo.png"
                  alt="Logo"
                  width="35"
                  height="35"
                />
              </div>
              <h2 class="font-weight-bold brand-text">
                StaySearch
              </h2>
            </RouterLink>
          </v-col>

          <v-col cols="6" class="d-flex align-center justify-end pr-10">
            <!-- Messages Button -->
            <v-btn
              icon
              class="mr-3"
              size="large"
              @click="$router.push('/messages')"
            >
              <v-badge
                v-if="messageStore.unreadCount > 0"
                :content="messageStore.unreadCount"
                color="red"
                overlap
              >
                <v-icon>mdi-message-text</v-icon>
              </v-badge>
              <v-icon v-else>mdi-message-text-outline</v-icon>
            </v-btn>

            <v-menu location="bottom" offset="10">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  class="profile-btn"
                  size="large"
                >
                <v-avatar size="42" class="profile-avatar">
                  <v-img
                    alt="Profile"
                    :src="userStore.userData.picture ||  '/csu.png'"
                  ></v-img>
                </v-avatar>
                </v-btn>
              </template>
              <v-card class="profile-menu" elevation="12" rounded="xl">
                <v-card-text class="pa-6">
                  <div class="mx-auto text-center">
                    <div class="d-flex align-center ga-3 mb-4">
                      <v-avatar
                        size="55"
                        class="profile-avatar-large"
                      >
                        <v-img
                          alt="Profile"
                          :src="userStore.userData.picture ||  '/csu.png'"
                        ></v-img>
                      </v-avatar>
                      <div class="d-flex flex-column align-start">
                        <p class="font-weight-bold text-body-1 mb-1">{{ userStore.userData.name }}</p>
                        <p class="text-caption text-medium-emphasis">{{ userStore.userData.email }}</p>
                      </div>
                    </div>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                      class="text-none font-weight-bold menu-btn"
                      variant="tonal"
                      color="green"
                      rounded="lg"
                      block
                      prepend-icon="mdi-calendar-check"
                      @click="openReservationsDialog"
                    >
                      My Reservations
                    </v-btn>
                    <v-btn
                      class="text-none font-weight-bold menu-btn mt-2"
                      variant="tonal"
                      color="blue"
                      rounded="lg"
                      block
                      prepend-icon="mdi-account-edit"
                      @click="$router.push('/settings')"
                    >
                      Edit Account
                    </v-btn>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                      class="text-none font-weight-bold menu-btn"
                      variant="tonal"
                      color="red"
                      rounded="lg"
                      block
                      prepend-icon="mdi-logout"
                      @click="logout"
                    >
                      Logout
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>
        </v-row>
      </v-app-bar>

      <!-- Hero Section with Search -->
      <div class="hero-section">
        <div class="hero-overlay"></div>
        <v-container class="hero-content">
          <v-row class="justify-center">
            <v-col cols="12" md="10" lg="8">
              <h1 class="hero-title text-center mb-4">
                Find Your Perfect Boarding House
              </h1>
              <p class="hero-subtitle text-center mb-8">
                Discover comfortable and affordable student housing near you
              </p>
              <div class="modern-search-bar">
                <v-icon class="search-icon" color="green-darken-2">mdi-magnify</v-icon>
                <v-text-field
                  class="search-input"
                  density="comfortable"
                  placeholder="Search by name, location, or amenities..."
                  variant="plain"
                  hide-details
                  single-line
                  clearable
                  v-model="searchQuery"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container class="content-container py-12">
        <v-row>
          <!-- Modern Filter Sidebar -->
          <v-col cols="12" md="3" lg="3">
            <v-card class="filter-card sticky-filters" elevation="2" rounded="xl">
              <v-card-text class="pa-6">
                <div class="d-flex align-center mb-6">
                  <v-icon size="28" color="green-darken-2" class="mr-3">mdi-tune-variant</v-icon>
                  <h3 class="text-h6 font-weight-bold">Filters</h3>
                </div>
                
                <div class="filter-section mb-6">
                  <h4 class="filter-label mb-3">Price Range</h4>
                  <div class="price-display mb-4">
                    <v-chip color="green" variant="flat" size="small">
                      {{ priceRanges[priceRangeIndex].label || 'Any Price' }}
                    </v-chip>
                  </div>
                  <v-slider
                    v-model="priceRangeIndex"
                    :max="priceRanges.length - 1"
                    show-ticks="always"
                    step="1"
                    tick-size="4"
                    color="green-darken-2"
                    track-color="green-lighten-4"
                    thumb-label
                  ></v-slider>
                </div>

                <div class="filter-section mb-6">
                  <h4 class="filter-label mb-3">Housing Type</h4>
                  <v-select
                    v-model="selectedType"
                    color="green-darken-2"
                    density="comfortable"
                    variant="outlined"
                    :items="type"
                    clearable
                    rounded="lg"
                    placeholder="Select type"
                  >
                  </v-select>
                </div>

                <div class="filter-section">
                  <h4 class="filter-label mb-3">Amenities</h4>
                  <v-checkbox
                    v-model="filter"
                    :label="label"
                    :value="label"
                    v-for="(label, index) in filterValue"
                    :key="index"
                    color="green-darken-2"
                    hide-details
                    class="amenity-checkbox"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Modern Property Cards -->
          <v-col cols="12" md="9" lg="9">
            <div class="results-header mb-6">
              <h3 class="text-h5 font-weight-bold">
                {{ postStore.posts.length }} Properties Available
              </h3>
            </div>
            <v-row>
              <v-col
                v-for="post in postStore.posts"
                :key="post.id"
                cols="12" sm="6" lg="4"
                class="property-card-col">
                <v-card
                  class="property-card"
                  elevation="0"
                  rounded="xl"
                  hover
                >
                  <div class="property-images">
                    <v-img
                      class="main-image"
                      :src="post.images[0]"
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
                    <div class="secondary-images">
                      <v-img
                        v-if="post.images[1]"
                        class="small-image"
                        :src="post.images[1]"
                        height="60"
                        cover
                      ></v-img>
                    </div>
                  </div>
                  
                  <v-card-text class="pa-5">
                    <h3 class="property-name mb-2">{{ post.name }}</h3>
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
                    
                    <div class="tags-section mb-4">
                      <v-chip
                        size="small"
                        v-if="post.tags.length > 0"
                        class="tag-chip"
                        color="green-lighten-5"
                        text-color="green-darken-3"
                      >
                        {{ post.tags[0] }}
                      </v-chip>
                      <v-chip
                        size="small"
                        v-if="post.tags.length > 1"
                        class="tag-chip"
                        color="green-lighten-5"
                        text-color="green-darken-3"
                      >
                        +{{ post.tags.length - 1 }}
                      </v-chip>
                    </div>
                  </v-card-text>
                  
                  <v-card-actions class="px-5 pb-5">
                    <v-btn
                      size="large"
                      class="view-details-btn"
                      color="green-darken-2"
                      rounded="lg"
                      block
                      elevation="0"
                      @click="openDialog(post)"
                    >
                      <span class="font-weight-bold">View Details</span>
                      <v-icon class="ml-2" size="18">mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>

      <!-- Modern Property Details Dialog -->
      <v-dialog
        v-model="postDialog.PostContent"
        max-width="900"
        scrollable
      >
        <v-card class="detail-dialog" rounded="xl">
          <v-card-title class="dialog-header pa-6">
            <div class="d-flex align-center w-100">
              <div>
                <h2 class="text-h5 font-weight-bold mb-1">{{ postDialog.name }}</h2>
                <p class="text-caption text-medium-emphasis">Posted by {{ postDialog.owner_name }}</p>
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
                <div class="d-flex justify-space-between align-center mb-6 flex-wrap ga-3">
                  <div class="price-section-large">
                    <span class="price-amount-large">₱{{ postDialog.price }}</span>
                    <span class="price-period-large">/month</span>
                  </div>
                  <div class="d-flex ga-2 flex-wrap">
                    <v-btn
                      size="large"
                      color="blue-darken-2"
                      rounded="lg"
                      elevation="0"
                      variant="outlined"
                      prepend-icon="mdi-message-text"
                      @click="contactOwner(postDialog.boardingHouseId, postDialog.owner_id)"
                    >
                      <span class="font-weight-bold">Contact Owner</span>
                    </v-btn>
                    <v-btn
                      size="large"
                      color="green-darken-2"
                      rounded="lg"
                      elevation="0"
                      prepend-icon="mdi-calendar-check"
                      @click="openAddReservationDialog"
                    >
                      <span class="font-weight-bold">Make Reservation</span>
                    </v-btn>
                  </div>
                </div>
              </v-col>

              <!-- Tags -->
              <v-col cols="12" v-if="postDialog.tags.length > 0">
                <div class="tags-container mb-6">
                  <v-chip
                    v-for="(tag, index) in postDialog.tags"
                    :key="index"
                    color="green-lighten-5"
                    text-color="green-darken-3"
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
                        <span class="rating-number">{{ postDialog.avgRating.toFixed(1) }}</span>
                        <v-rating
                          :size="20"
                          :model-value="postDialog.avgRating"
                          color="yellow-darken-3"
                          half-increments
                          readonly
                          density="compact"
                        ></v-rating>
                      </div>
                    </div>
                  </div>

                  <v-btn
                    color="green-darken-2"
                    variant="outlined"
                    rounded="lg"
                    block
                    class="mb-6"
                    prepend-icon="mdi-plus"
                    @click="sheet = !sheet"
                  >
                    <span class="font-weight-bold">Write a Review</span>
                  </v-btn>

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
                            <v-img :src="review.reviewer_picture"></v-img>
                          </v-avatar>
                          <div class="ml-4 flex-grow-1">
                            <h4 class="font-weight-bold mb-1">{{ review.reviewer_name }}</h4>
                            <p class="text-caption text-medium-emphasis">{{ review.timeAgo }}</p>
                          </div>
                        </div>
                        <v-rating
                          :size="18"
                          :model-value="review.reviewer_rating"
                          color="yellow-darken-3"
                          half-increments
                          readonly
                          density="compact"
                          class="mb-3"
                        ></v-rating>
                        <p class="review-text">{{ review.reviewer_comment }}</p>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Review Bottom Sheet -->
          <v-bottom-sheet v-model="sheet" inset>
            <v-card class="review-sheet" rounded="t-xl">
              <v-card-text class="pa-8">
                <h3 class="text-h6 font-weight-bold mb-6 text-center">Write Your Review</h3>
                <div class="text-center mb-6">
                  <v-rating
                    size="large"
                    v-model="rating"
                    color="yellow-darken-3"
                    half-increments
                  ></v-rating>
                </div>
                <v-textarea
                  v-model="comment"
                  variant="outlined"
                  label="Share your experience..."
                  auto-grow
                  rows="4"
                  rounded="lg"
                  class="mb-4"
                >
                </v-textarea>
                <v-btn
                  :loading="postStore.formAction.formProcess"
                  block
                  size="large"
                  color="green-darken-2"
                  rounded="lg"
                  elevation="0"
                  @click="addReview"
                >
                  <span class="font-weight-bold">Submit Review</span>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-bottom-sheet>
        </v-card>
      </v-dialog>

      <!-- Image Carousel Dialog -->
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

      <AddReservation
        :isOpen="addReservationDialogOpen"
        :boardingHouseId="boardingHouseId"
        @update:isOpen="addReservationDialogOpen = $event"
      />

      <ReservationsPage
        :isOpen="reservationsDialogOpen"
        @update:isOpen="reservationsDialogOpen = $event"
      />

    </template>
  </AppLayout>
</template>

<style scoped>
/* Modern App Bar */
.modern-appbar {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.appbar-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  opacity: 0.95;
}

.logo-container {
  background: white;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.logo-link:hover .logo-container {
  transform: scale(1.05);
}

.brand-text {
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.profile-btn {
  transition: transform 0.3s ease;
}

.profile-btn:hover {
  transform: scale(1.05);
}

.profile-avatar {
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.profile-avatar-large {
  border: 3px solid #4caf50;
}

.profile-menu {
  background: white;
  min-width: 300px;
}

.menu-btn {
  transition: all 0.3s ease;
}

.menu-btn:hover {
  transform: translateY(-2px);
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%);
  padding: 100px 0 80px;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
               radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
  animation: heroGlow 10s ease-in-out infinite;
}

@keyframes heroGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  color: white;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -1px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 0.8s ease;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
  animation: fadeInUp 0.8s ease 0.2s both;
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

.modern-search-bar {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50px;
  padding: 8px 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  animation: fadeInUp 0.8s ease 0.4s both;
}

.modern-search-bar:focus-within {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.search-icon {
  font-size: 28px;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  font-size: 1.1rem;
}

/* Content Container */
.content-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Filter Card */
.filter-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.sticky-filters {
  position: sticky;
  top: 100px;
}

.filter-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.filter-label {
  color: #2e7d32;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.price-display {
  display: flex;
  justify-content: center;
}

.amenity-checkbox {
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.amenity-checkbox:hover {
  transform: translateX(4px);
}

/* Results Header */
.results-header {
  animation: fadeInUp 0.6s ease;
}

/* Property Cards */
.property-card-col {
  animation: fadeInUp 0.6s ease;
}

.property-card {
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.property-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
  border-color: #4caf50;
}

.property-images {
  position: relative;
}

.main-image {
  border-radius: 0;
  transition: transform 0.4s ease;
}

.property-card:hover .main-image {
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

.secondary-images {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.small-image {
  width: 60px;
  border-radius: 8px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.property-name {
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

.view-details-btn {
  font-size: 1rem;
  transition: all 0.3s ease;
}

.view-details-btn:hover {
  transform: translateX(4px);
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

.review-sheet {
  background: white;
}

.carousel-card {
  overflow: hidden;
}

/* Responsive Design */
@media (max-width: 960px) {
  .sticky-filters {
    position: static;
  }
  
  .hero-section {
    padding: 60px 0 50px;
  }
  
  .modern-search-bar {
    padding: 6px 20px;
  }
}
</style>