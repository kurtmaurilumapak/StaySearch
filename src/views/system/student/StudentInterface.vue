<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePostStore } from '@/stores/postStore'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'

const router = useRouter()
const theme = useTheme()
const useAuth = useAuthStore()
const postStore = usePostStore()

const showMore = ref(false)
const rating = ref(0)
const comment = ref('')
const sheet = ref(false)
const filterValue = ['All Boys', 'All Girls', 'Mix', 'Free Electricity', 'Free Water', 'Free Wifi']
const filter = ref(null)
const priceRange = ref(null)
const showResult = ref(false)
const searchQuery = ref('')

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
  postDialog.value.tags = post.boarding_house_tags?.map(tag => tag.tags.name)
  postDialog.value.images = post.boarding_house_images.map(image => image.image_url)
  postDialog.value.address = post.address
  postDialog.value.price = post.price
  postDialog.value.name = post.name
  postDialog.value.description = post.description
  postDialog.value.reviews = post.reviews || []

  postDialog.value.boardingHouseId = post.id
};

const loadMorePosts = async () => {
  if (!postStore.formAction.formProcess) {
    await postStore.fetchMorePosts();
  }
};

onMounted(async () => {
  try {
    await postStore.allPost();
    showMore.value = true
  } catch (error) {
    console.error('Error fetching all posts:', error);
  }

});

const filteredPosts = computed(() => {
  if (showResult.value) {
    return postStore.posts.filter(post => {
    const matchesSearchQuery = !searchQuery.value || post.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesPriceRange = !priceRange.value || (
      (priceRange.value === '₱0 - ₱500' && post.price >= 0 && post.price <= 500) ||
      (priceRange.value === '₱501 - ₱1000' && post.price > 500 && post.price <= 1000) ||
      (priceRange.value === '₱1001 - ₱1500' && post.price > 1000 && post.price <= 1500) ||
      (priceRange.value === '₱1501+' && post.price > 1500)
    );
    
    const matchesFilters = filter.value.length === 0 || filter.value.every(f => post.boarding_house_tags.some(tag => tag.tags.name === f));

    return matchesSearchQuery && matchesPriceRange && matchesFilters;
  });
  }
  else if(!showResult.value || !searchQuery.value) {
    if(!searchQuery.value){
      showResult.value = false
    }
    return postStore.posts
  }
  
})

const performSearch = () => {
  showResult.value = true
}
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
      name: newReview.name, // Assuming name is returned from the addReview function
    });

    sheet.value = false
    rating.value = 0
    comment.value = ''
  } catch (error) {
    console.error('Error adding review:', error)
  }
}

const averageRating = computed(() => {
  if (postDialog.value.reviews && postDialog.value.reviews.length > 0) {
    const totalRating = postDialog.value.reviews.reduce((acc, review) => acc + review.rating, 0)
    return totalRating / postDialog.value.reviews.length
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
  <AppLayout
    class="bg-green-lighten-5"
  >
    <template #content>
      <v-app-bar
        color="green"
        :elevation="2"
      >
        <v-row class="d-flex align-center">
          <v-col cols="6">
            <RouterLink
              style="text-decoration: none;color: inherit;"
              to="/"
              class="d-inline-flex align-center ga-1 my-5 ml-5"
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
                <v-avatar
                  image="https://cdn.vuetifyjs.com/images/john.jpg"
                  size="40"
                  v-bind="props"
                >
                </v-avatar>
              </template>
              <v-list
                style="margin-left: 35px; width: 200px"
              >
                <v-list-item
                  class="text-center"
                  @click="$router.push('/settings')"
                >
                  SETTINGS
                </v-list-item>
                <v-list-item
                  class="text-center"
                  style="color: red;"
                  @click="logout"
                >
                  LOGOUT
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-app-bar>

      <v-row class="mt-4 mx-0 mx-md-16 pb-5 pt-10">
        <v-col cols="12">
          <v-row>
            <v-col cols="12" class="px-6">
              <h1 class="text-h4 text-green-darken-4 font-weight-bold">Find Your Perfect Boarding House</h1>
            </v-col>
            <v-col cols="12" md="8" class="px-6 px-md-8 d-flex justify-center align-center ga-2">
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
                  v-model="searchQuery"
                ></v-text-field>
              
                
                <v-icon
                  class="d-flex d-sm-none"
                  color="green"
                  size="x-large"
                >
                  mdi-magnify
                </v-icon>
                
              </div>
              <div class="d-none d-sm-flex ">
                <v-btn
                  prepend-icon="mdi-magnify"
                  class="text-none bg-green py-5 d-flex align-center rounded-lg"
                  @click="performSearch"
                >
                  Search
                </v-btn>
              </div>
            </v-col>
            
            <v-col cols="2" class="px-7 d-none d-lg-flex justify-center align-center">
            </v-col>
            <v-col cols="2" class="px-7 d-none d-md-flex justify-center align-center">
              <v-select
                clearable
                placeholder="Price range"
                style="border: green solid 2px;border-radius: 8px ;background-color: white; height: 75%; padding-left: 10px"
                density="compact"
                v-model="priceRange"
                :items="['₱0 - ₱500', '₱501 - ₱1000', '₱1001 - ₱1500', '₱1501+']"
                variant="plain"
              ></v-select>
            </v-col>
            <v-col cols="2" class="px-7 d-none d-md-flex justify-center align-center">
              <v-select
                v-model="filter"
                style="border: green solid 2px; border-radius: 8px; background-color: white; height: 75%; padding-left: 10px"
                clearable
                placeholder="Filter by"
                multiple
                density="compact"
                :items="filterValue"
                variant="plain"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index < 1">
                    <span>{{ item.title }}</span>
                  </v-chip>
                  <span
                    v-if="index === 1"
                    class="text-grey text-caption align-self-center"
                  >
                    (+{{ filter.length - 1 }} others)
                  </span>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-col>


        <v-col
          
          v-for="post in filteredPosts"
          :key="post.id"
          cols="12" sm="6" lg="4"
          class="d-flex justify-center align-center">
          <v-card
            :elevation="7"
            style="border-radius: 17px"
            width="95%"
          >
            <v-card-title
              class="py-6"
            >
              <p class="px-4 text-h5 font-weight-bold text-green-darken-3">{{ post.name }}</p>
              <p class="px-4 text-subtitle-2 text-disabled truncate">{{ post.address }}</p>

            </v-card-title>
            <v-card-text class="d-flex flex-column px-7">
              <v-row>
                <v-col cols="12" md="8">
                  <v-img
                    class="bg-grey rounded-lg mb-5"
                    :src="post.boarding_house_images?.[0]?.image_url"
                    width="100%"
                    height="200"
                    cover
                  ></v-img>
                </v-col>
                <v-col cols="4" class="d-none d-md-block">
                  <v-img
                    class="bg-grey rounded-lg mb-5"
                    :src="post.boarding_house_images?.[1]?.image_url"
                    width="100%"
                    height="200"
                    cover
                  ></v-img>
                </v-col>
              </v-row>
              <p class="text-h5 font-weight-bold text-green mb-2 px-1">₱{{ post.price }}.00/month</p>
              <div class="d-flex flex-wrap">
                <v-chip
                  v-if="post.boarding_house_tags.length > 0"
                  class="mr-1 mb-1 px-3"
                  color="green"
                >
                  {{ post.boarding_house_tags[0].tags.name }}
                </v-chip>

                <v-chip
                  v-if="post.boarding_house_tags.length > 1"
                  class="mr-1 mb-1 px-3"
                  color="green"
                >
                  +{{ post.boarding_house_tags.length - 1 }} more
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
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-btn
            v-if="showMore"
            :loading="postStore.formAction.formProcess"
            @click="loadMorePosts"
            color="green-darken-2"
            class="mt-4"
          >
            Load More
          </v-btn>
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
              <h4>Your Post</h4>
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
                    <div
                      v-for="(review, index) in postDialog.reviews"
                      :key="index"
                      class="mb-3 py-5"
                      style="background-color: ghostwhite; border-radius: 15px"
                    >
                      <v-row>
                        <v-col cols="12" class="d-flex align-center ga-5 ml-5">
                          <v-avatar
                            image="https://cdn.vuetifyjs.com/images/john.jpg"
                            size="50"
                          >
                          </v-avatar>
                          <h3 class="font-weight-bold">{{ review.name }}</h3>
                        </v-col>
                        <v-col cols="12" class="ml-5">
                          <v-rating
                            size="small"
                            :model-value="review.rating"
                            color="yellow-darken-3"
                            half-increments
                          ></v-rating>
                        </v-col>
                        <v-col cols="12" class="px-10">
                          <span style="font-size: 17px">{{ review.comment }}</span>
                        </v-col>
                      </v-row>
                    </div>
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

