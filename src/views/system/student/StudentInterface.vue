<script setup>
import { computed, ref, onMounted  } from 'vue'
import { useRouter } from 'vue-router';
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePostStore } from '@/stores/postStore'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'

const router = useRouter()
const theme = useTheme()
const useAuth = useAuthStore()
const usePost = usePostStore()

onMounted(() => {
  usePost.fetchPosts();
  console.log(usePost.postsData.boardingHouses);
});

const search = ref ({
  loaded: false,
  loading: false,
})


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
  tags: [
    'All Boys',
    'Free Electricity',
    'Free Water',
    'Free Wifi',
  ],
  PostContent: false,
  images: [
    'https://images.pexels.com/photos/28665515/pexels-photo-28665515/free-photo-of-hamburg-urban-train-station-architectural-view.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    'https://images.pexels.com/photos/7994278/pexels-photo-7994278.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    'https://images.pexels.com/photos/2940506/pexels-photo-2940506.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    'https://images.pexels.com/photos/28959278/pexels-photo-28959278/free-photo-of-a-flock-of-seagulls-soaring-in-clear-blue-sky.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
    'https://images.pexels.com/photos/10414211/pexels-photo-10414211.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load',
  ],
  carouselOpen: false,
  carouselIndex: 0,

})
const extraImagesCount = computed(() => postDialog.value.images.length - 3)
const openCarousel = (index) => {
  postDialog.value.carouselIndex = index
  postDialog.value.carouselOpen = true
}
const openDialog = () => {
  postDialog.value.PostContent = true;
}


const logout = async () => {
  await useAuth.signOut()
  theme.global.name.value = 'light'
  await router.push('/login')
}

</script>


<template>
  <v-btn @click="logout"> logout</v-btn>
  <AppLayout>
    <template #content>
      <v-app-bar
        :elevation="2"
        density="comfortable"
      >
        <v-row class="d-flex align-center">
          <v-col cols="4">
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

          <v-col cols="5" sm="5" md="4" lg="3" class="d-none d-sm-flex pr-10">
            <div
              class="d-inline-flex align-center justify-center border rounded-lg px-3 ga-4"
              style="width: 100%;"
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

          <v-col cols="8" sm="3" md="4" lg="5" class="d-flex align-center justify-end pr-10">
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

      <v-banner
        v-if="banner"
        class="d-block d-sm-none"
      >
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
          cols="12" sm="6" md="4" lg="3"
          class="d-flex justify-center align-center"
          v-if="usePost.formAction.formProcess"
        >
          <v-card
            class="border rounded-xl py-5"
            width="100%"
          >
            <v-card-text>
              <v-row no-gutters>
                <v-col cols="5">
                  <v-skeleton-loader
                    class="border"
                    type="image"
                    max-width="95%"
                  ></v-skeleton-loader>
                </v-col>
                <v-col cols="7">
                  <v-skeleton-loader
                    type="article"
                    max-width="100%"
                  ></v-skeleton-loader>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col
          v-for="house in usePost.postsData.boardingHouses"
          :key="house.id"
          cols="12" sm="6" md="4" lg="3"
          class="d-flex justify-center align-center">
          <v-card
            :elevation="7"
            class="rounded-xl"
            @click="openDialog"
            width="100%"
          >
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-row>
                    <v-col cols="8">
                      <v-img
                        class="bg-white rounded-xl"
                        :src="house.boarding_house_images[0]?.image_url"
                        max-width="100%"
                        height="170"
                        cover
                      ></v-img>
                    </v-col>
                    <v-col cols="4">
                      <v-img
                        class="bg-white rounded-xl"
                        :src="house.boarding_house_images[1]?.image_url"
                        max-width="100%"
                        height="170"
                        cover
                      ></v-img>
                    </v-col>
                  </v-row>
                  <v-col cols="12">
                    <v-row>
                      <v-col cols="12" class="d-inline-flex justify-space-between">
                        <h1 class="text-h6">{{ house.name }}</h1>
                        <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>{{ house.address }}</h2>
                      </v-col>
                      <v-col cols="12" class="d-inline-flex justify-space-between">
                        <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>{{ house.price }}/month</h2>
                        <span class="text-body-2">Tags</span>
                      </v-col>
                    </v-row>
                  </v-col>
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
            <v-card-text>
              <v-row>
                <v-col cols="12" class="text-center">
                  <h2>Boarding House Name</h2>
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
                              <span>{{ extraImagesCount }}+ more</span>
                            </div>
                          </v-img>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="d-block">
                  <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                  <br>
                  <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
                </v-col>
                <v-col cols="12">
                  <h2 class="text-h6">Details</h2>
                </v-col>
                <v-col cols="12">
                  <div v-if="postDialog.tags.length > 0">
                    <v-chip color="pink" class="mr-1" label>
                      <v-icon icon="mdi-label" start></v-icon>
                      Tags:
                    </v-chip>
                    <v-chip
                      label
                      v-for="tag in postDialog.tags"
                      :key="tag"
                      color="green-darken-2"
                      class="ma-1"
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                </v-col>
                <v-divider class="mb-2"></v-divider>
                <v-col cols="12" class="text-center">
                  <span>REVIEWS</span>
                </v-col>
              </v-row>
            </v-card-text>
          </div>
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

<style>
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
</style>

