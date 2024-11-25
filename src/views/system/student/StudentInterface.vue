<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePostStore } from '@/stores/postStore'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/userStore'
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

const filteredPosts = computed(() => {
  return postStore.posts.map(post => {
    const postTime = new Date(post.created_at);
    const timeAgo = formatDistanceToNow(postTime, { addSuffix: true });

    return {
      ...post,
      timeAgo,
    };
  }).filter(post => {
    const priceRange = priceRanges[priceRangeIndex.value].range;
    const postPrice = post.price;

    if (filter.value.length === 0 && selectedType.value === '' && priceRangeIndex.value === 0 && !searchQuery.value) {
      return true;
    }

    // Filter by price range
    if (priceRange && priceRangeIndex.value !== 0 && (postPrice < priceRange[0] || postPrice > priceRange[1])) {
      return false;
    }

    // Filter by boarding house type
    if (selectedType.value && !post.tag_name?.includes(selectedType.value)) {
      return false;
    }

    // Filter by amenities (checkboxes)
    if (filter.value.length > 0 && !filter.value.every(amenity => post.tag_name?.includes(amenity))) {
      return false;
    }

    if (searchQuery.value) {
      const lowerCaseQuery = searchQuery.value.toLowerCase();
      return [post.name, post.description, post.address].some(field =>
        field?.toLowerCase().includes(lowerCaseQuery)
      );
    }

    return true;
  });
});

const handleBrandClick = () => {
  window.location.reload();
};

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
  postDialog.value.latitude = post.latitude
  postDialog.value.longitude = post.longitude
  postDialog.value.price = post.price
  postDialog.value.name = post.name
  postDialog.value.description = post.description
  postDialog.value.reviews = post.reviews || []
  postDialog.value.owner_name = post.owner_name

  postDialog.value.boardingHouseId = post.id
};

onMounted(async () => {
  try {
    await postStore.allPost()
    await userStore.fetchUserData()
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
})


const addReview = async () => {
  try {
    const newReview = await postStore.addReview(
   {
    rating: rating.value,
    comment: comment.value,
    },

    postDialog.value.boardingHouseId
    )
    postDialog.value.reviews.push({
      rating: newReview.rating,
      comment: newReview.comment,
      reviewer_name: newReview.name,
    });

    sheet.value = false
    rating.value = 1
    comment.value = ''
  } catch (error) {
    console.error('Error adding review:', error)
  }
}

const averageRating = computed(() => {
  const reviews = postDialog.value.reviews || []

  if (reviews.length > 0) {
    const validRatings = reviews
      .filter(review => review && review.rating != null)
      .map(review => review.rating)

    if (validRatings.length > 0) {
      const totalRating = validRatings.reduce((acc, rating) => acc + rating, 0)
      return totalRating / validRatings.length
    }
  }

  return 0
})


const logout = async () => {
  await useAuth.signOut()
  theme.global.name.value = 'light'
  await router.push('/login')
}
</script>


<template>
  <AppLayout>
    <template #content>
      <v-app-bar
        color="green"
        :elevation="2"
      >
        <v-row class="d-flex align-center">
          <v-col cols="6">
            <RouterLink
              style="text-decoration: none;color: inherit;"
              to="/student/page"
              class="d-inline-flex align-center ga-1 my-5 ml-5"
              @click="handleBrandClick"
            >
              <img
                src="@/assets/logo.png"
                alt="Logo"
                width="30"
                height="30"
              />
              <h2 class="font-weight-bold">
                StaySearch
              </h2>
            </RouterLink>
          </v-col>

          <v-col cols="6" class="d-flex align-center justify-end pr-10">
            <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                >
                  <v-avatar
                    color="brown"
                    size="large"
                  >
                  </v-avatar>
                </v-btn>
              </template>
              <v-card>
                <v-card-text>
                  <div class="mx-auto text-center">
                    <v-avatar
                      color="brown"
                    >
                    </v-avatar>
                    <h3>{{ userStore.userData.firstname }}</h3>
                    <p class="text-caption mt-1">
                      {{ userStore.userData.email }}
                    </p>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                      class="text-none font-weight-bold"
                      variant="text"
                      rounded
                      block
                      @click="openReservationsDialog"
                    >
                      My Reservations
                    </v-btn>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                      class="text-none font-weight-bold"
                      variant="text"
                      rounded
                      block
                      @click="$router.push('/settings')"
                    >
                      Edit Account
                    </v-btn>
                    <v-divider class="my-3"></v-divider>
                    <v-btn
                      class="text-none font-weight-bold"
                      variant="text"
                      color="red"
                      rounded
                      block
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

      <v-row class="mt-4 mx-0 mx-lg-16 pb-5 pt-10">
        <v-col cols="12">
          <v-row>
            <v-col cols="12" class="px-6">
              <h1 class="text-h4 text-green-darken-4 font-weight-bold">Find Your Perfect Boarding House</h1>
            </v-col>
            <v-col cols="12" class="d-flex justify-center align-center ga-2">
              <div
                class="d-inline-flex align-center justify-start rounded-lg px-3 ga-4 bg-white"
                style="width: 100%; border: green solid 2px; "
              >
                <v-text-field
                  class="mb-2 w-100"
                  density="compact"
                  label="Search"
                  variant="plain"
                  hide-details
                  single-line
                  clearable
                  v-model="searchQuery"
                ></v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12" md="3" lg="2">
          <v-expansion-panels class="mb-6 border">
            <v-expansion-panel>
              <v-expansion-panel-title
                expand-icon="mdi-menu-down"
                class="px-5 py-5 font-weight-bold"
              >
                Filters
              </v-expansion-panel-title>
              <v-expansion-panel-text
                class="font-weight-bold"
              >
                <div>
                  <p>Price Range</p>
                  <p>{{ priceRanges[priceRangeIndex].label }}</p>
                </div>
                <v-slider
                  v-model="priceRangeIndex"
                  :max="priceRanges.length - 1"
                  show-ticks="always"
                  step="1"
                  tick-size="4"
                  color="green"
                ></v-slider>

                <p>Boarding House Type</p>
                <v-select
                  v-model="selectedType"
                  color="green"
                  density="compact"
                  variant="outlined"
                  :items="type"
                  clearable
                >
                </v-select>

                <p>Amenities</p>
                <v-checkbox
                  v-model="filter"
                  :label="label"
                  :value="label"
                  v-for="(label, index) in filterValue"
                  :key="index"
                  color="success"
                  hide-details
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>

        <v-col cols="12" md="9" lg="10">
          <v-row>
            <v-col
              v-for="post in filteredPosts"
              :key="post.id"
              cols="12" sm="6" lg="4"
              class="d-flex justify-center align-center">
              <v-card
                class="rounded-lg border"
                :elevation="7"
                width="100%"
              >
                <v-card-text class="d-flex flex-column">
                  <v-row>
                    <v-col cols="12" md="8">
                      <v-img
                        class="bg-grey rounded-lg mb-5"
                        :src="post.images[0]"
                        width="100%"
                        height="200"
                        cover
                      ></v-img>
                    </v-col>
                    <v-col cols="4" class="d-none d-md-block">
                      <v-img
                        class="bg-grey rounded-lg mb-5"
                        :src="post.images[1]"
                        width="100%"
                        height="200"
                        cover
                      ></v-img>
                    </v-col>
                  </v-row>
                  <p class="text-h7 font-weight-light text-disabled">{{ post.timeAgo }}</p>
                  <p class="text-h5 font-weight-bold text-green-darken-3">{{ post.name }}</p>
                  <p class="text-subtitle-2 text-disabled truncate">{{ post.address }}</p>
                  <p class="text-h5 font-weight-bold text-green mb-2 px-1">₱{{ post.price }}.00/month</p>
                  <div class="d-flex flex-wrap">
                    <v-chip
                      size="small"
                      v-if="post.tags.length > 0"
                      class="mr-1 mb-1 px-3"
                      color="green"
                    >
                      {{ post.tags[0] || 'No tags' }}
                    </v-chip>

                    <v-chip
                      size="small"
                      v-if="post.tags.length > 1"
                      class="mr-1 mb-1 px-3"
                      color="green"
                    >
                      +{{ post.tags.length - 1 }} more
                    </v-chip>
                  </div>
                </v-card-text>
                <v-card-actions class="px-7 pb-7">
                  <v-btn
                    size="large"
                    class="rounded-lg font-weight-bold bg-green text-body-2"
                    block
                    @click="openDialog(post)"
                  >
                    View Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
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
              <h4>{{ postDialog.owner_name }}'s Post</h4>
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
                <v-col cols="12" class="d-flex justify-space-between">
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
                  <v-btn
                    class="text-none"
                    color="green"
                    @click="openAddReservationDialog"
                  >
                    Reservation
                  </v-btn>
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
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                <v-col cols="12" class="d-flex justify-center">
                  <v-btn
                    color="green-darken-2"
                    variant="outlined"
                    block
                    @click="sheet = !sheet"
                  >
                    add review
                  </v-btn>
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
                    ></v-rating>
                  </div>
                  <div
                    class="d-flex flex-column text-start py-5 px-5"
                  >
                    <v-card
                      v-for="(review, index) in postDialog.reviews"
                      :key="index"
                      class="mb-3 py-5"
                      style="background-color: ghostwhite; border-radius: 15px"
                    >
                      <v-card-text>
                        <div class="d-flex">
                          <v-avatar
                            image="https://cdn.vuetifyjs.com/images/john.jpg"
                            size="40"
                          >
                          </v-avatar>
                          <h3 class="font-weight-bold pl-4">{{ review.reviewer_name }}</h3>
                        </div>
                        <v-divider class="mt-3"></v-divider>
                        <div class="d-flex flex-column">
                          <v-rating
                            size="small"
                            :model-value="review.rating"
                            color="yellow-darken-3"
                            half-increments
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
          <v-bottom-sheet
            v-model="sheet"
            inset
          >
            <v-card
              class="text-center"
              height="500"
            >
              <v-card-text class="d-flex flex-column">
                <v-rating
                  size="x-large"
                  v-model="rating"
                  color="yellow-darken-3"
                  half-increments
                ></v-rating>
                <br>
                <v-textarea
                  v-model="comment"
                  variant="outlined"
                  label="Comment"
                  auto-grow
                >
                </v-textarea>
                <div>
                  <v-btn
                    :loading="postStore.formAction.formProcess"
                    block
                    @click="addReview"
                  >
                    submit
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-bottom-sheet>
        </v-card>
      </v-dialog>

      <v-dialog v-model="postDialog.carouselOpen" max-width="600">
        <v-carousel v-if="postDialog.carouselOpen" hide-delimiters v-model="postDialog.carouselIndex">
          <v-carousel-item
            v-for="(img, index) in postDialog.images"
            :key="index"
            :src="img"
            aspect-ratio="1"
            cover
          >
          </v-carousel-item>
        </v-carousel>
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
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 1.5rem;
  height: 100%;
  width: 100%;
  position: absolute;
}
.truncate {
  display: block;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

