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

const search = ref ({
  loaded: false,
  loading: false,
})

const showMore = ref(false)
const rating = ref(0)
const comment = ref('')
const sheet = ref(false)
const banner = ref(false)
const showBanner = () =>{
  banner.value = !banner.value
}

const sorts = [
  'Newest',
  'Price',
  'Proximity to Campus',
  'Ratings',
]

const onClick = () => {
  search.value.loading = true
  setTimeout(() => {
    search.value.loading = false
    search.value.loaded = true
  }, 2000)
}

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
  if (!search.value.loading) {
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
  <AppLayout>
    <template #content>
      <v-app-bar
        :elevation="2"
        density="comfortable"
      >
        <v-row class="d-flex align-center">
          <v-col cols="4" sm="3" lg="4">
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

          <v-col cols="6" sm="6" lg="4" class="d-none d-sm-flex justify-center align-center">
            <div
              class="d-inline-flex align-center justify-center border rounded-lg px-3 ga-4"
              style="width: 70%;"
            >
              <v-text-field
                class="mb-2"
                :loading="search.loading"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="Search"
                variant="plain"
                hide-details
                single-line
                @click:append-inner="onClick"
                max-width="350"
              ></v-text-field>
              <v-btn
                style="background-color: forestgreen; color: white"
                class="text-none"
                size="small"
              >
                Filter
              </v-btn>
            </div>
          </v-col>

          <v-col cols="8" sm="3" lg="4" class="d-flex align-center justify-end pr-10">
            <v-btn
              class="d-flex d-sm-none mr-5"
              icon="mdi-magnify"
              variant="text"
              @click="showBanner"
            ></v-btn>

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

      <v-app-bar
        :elevation="3"
        v-if="banner"
        class="d-block d-sm-none px-5"
      >
        <v-banner>
          <div class="d-inline-flex align-center justify-center border rounded-lg w-100 px-3 ga-4">
            <v-text-field
              class="mb-2"
              :loading="search.loading"
              append-inner-icon="mdi-magnify"
              density="compact"
              label="Search"
              variant="plain"
              hide-details
              single-line
              @click:append-inner="onClick"
              max-width="350"
            ></v-text-field>
            <v-btn
              style="background-color: forestgreen; color: white"
              class="text-none"
              size="small"
            >
              Filter
            </v-btn>
          </div>
        </v-banner>
      </v-app-bar>

      <v-row class="mt-4 mx-0 mx-md-5 pb-5">
        <v-col cols="12">
          <h1 class="text-h4 pb-5">Boarding Houses in -your search-</h1>
          <span class="text-disabled">Sort by:</span>
          <v-chip-group
            selected-class="text-success"
            multiple
          >
            <v-chip
              v-for="tag in sorts"
              :key="tag"
              :text="tag"
            ></v-chip>
          </v-chip-group>
        </v-col>

        <v-col
          v-for="post in postStore.posts"
          :key="post.id"
          cols="12" sm="6" md="4" lg="3"
          class="d-flex justify-center align-center">
          <v-card
            :elevation="7"
            class="rounded-xl"
            @click="openDialog(post)"
            width="100%"
            color="grey-lighten-3"
          >
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="8">
                      <v-img
                        class="bg-white card-image"
                        :src="post.boarding_house_images?.[0]?.image_url"
                        cover
                      ></v-img>
                    </v-col>
                    <v-col cols="4">
                      <v-img
                        class="bg-white card-image"
                        :src="post.boarding_house_images?.[1]?.image_url"
                        cover
                      ></v-img>
                    </v-col>
                  </v-row>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" class="d-inline-flex justify-space-between">
                        <h1 class="text-h6 truncate">{{ post.name }}</h1>
                        <h2 class="text-subtitle-1 truncate"><v-icon>mdi-map-marker</v-icon>{{ post.address }}</h2>
                      </v-col>
                      <v-col cols="12" class="d-inline-flex justify-space-between">
                        <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>₱{{ post.price }}.00/month</h2>
                        <div class="d-flex flex-wrap">
                          <v-chip
                            v-if="post.boarding_house_tags.length > 0"
                            class="mr-1 mb-1"
                            color="green-darken-2"
                            text-color="white"
                          >
                            {{ post.boarding_house_tags[0].tags.name }} ...
                          </v-chip>
                        </div>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-col>
              </v-row>
            </v-card-text>
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
                            v-bind="props"
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

.card-image {
  border-radius: 16px;
  height: 160px;
}

@media (max-width: 400px) {
  .card-image {
    height: 140px;
  }
}
</style>

