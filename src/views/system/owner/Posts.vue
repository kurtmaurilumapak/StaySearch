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
const selectedPost = ref(null);
const isUpdateDialogOpen = ref(false);

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

  postDialog.value.reviews = (post.reviews || []).map(review => {
    const reviewTime = new Date(review.created_at);
    const timeAgo = formatDistanceToNow(reviewTime, { addSuffix: true });

    return {
      ...review,
      timeAgo,
    };
  });
};

const onUpdate = (post) => {
  selectedPost.value = post;
  isUpdateDialogOpen.value = true;
};

const averageRating = computed(() => {
  if (postDialog.value.reviews && postDialog.value.reviews.length > 0) {
    const totalRating = postDialog.value.reviews.reduce((acc, review) => acc + review.rating, 0)
    return totalRating / postDialog.value.reviews.length
  }
  return 0
})

const posts = ref([]);
onMounted(async () => {
  try {
    await postStore.ownerPost()
    posts.value = postStore.posts.map(post => {
      const postTime = new Date(post.created_at)
      const timeAgo = formatDistanceToNow(postTime, { addSuffix: true })

      return {
        ...post,
        timeAgo,
      }
    })

  } catch (error) {
    console.error('Error fetching posts:', error);
  }
})

const deletePost = async () => {
  try {
    await postStore.deletePost(deletePostId.value)
    posts.value = posts.value.filter(post => post.id !== deletePostId.value)
  } catch (error) {
    console.error('Error deleting post:', error)
  }
  deleteDialog.value = false;
};

const onDelete = (post) => {
  deletePostId.value = post.id;
  deleteDialog.value = true;
}

</script>


<template>
  <AppLayout>
    <template #content>
      <Navbar
        v-model="drawer"
      />
      <v-row
        style="height: calc(100vh + 12px);"
      >
        <!-- CREATE POST -->
        <v-col
          cols="12"
          class="d-flex justify-center align-center"
        >

          <v-card
            :elevation="7"
            style="border-radius: 0; height: 100vh; width: 100%; overflow-y: auto"
          >

            <v-card-title
              class="py-0"
            >
              <v-row>
                <v-col cols="6" class="d-flex justify-start align-center px-sm-10">
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
                <v-col cols="6" class="d-flex align-center justify-end px-sm-10">
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
              <v-row>
                <v-col cols="12" class="d-flex justify-sm-space-between justify-end px-7 px-sm-10">
                  <h1 class="d-none d-sm-block text-h4 text-green-darken-4 font-weight-bold">Your Posts</h1>
                  <v-btn
                    prepend-icon="mdi-plus"
                    class="text-none"
                    color="green"
                    @click="$router.push('/owner/create')"
                  >
                    Create Listing
                  </v-btn>
                </v-col>
                <!-- CARD POSTS -->
                <v-col  v-for="post in posts" :key="post.id" cols="12" sm="6" md="4" lg="3" class="d-flex justify-center align-center">
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
                      <p class="text-h7 font-weight-light text-disabled">{{ post.timeAgo }}</p>
                      <p class="text-h5 font-weight-bold text-green-darken-3">{{ post.name }}</p>
                      <p class="text-subtitle-2 text-disabled truncate">{{ post.address }}</p>
                      <p class="text-h5 font-weight-bold text-green mb-2 px-1">₱{{ post.price }}.00/month</p>
                      <div class="d-flex flex-wrap">
                        <v-chip
                          size="small"
                          v-if="post.boarding_house_tags.length > 0"
                          class="mr-1 mb-1 px-3"
                          color="green"
                        >
                          {{ post.boarding_house_tags[0].tags.tag_name }}
                        </v-chip>

                        <v-chip
                          size="small"
                          v-if="post.boarding_house_tags.length > 1"
                          class="mr-1 mb-1 px-3"
                          color="green"
                        >
                          +{{ post.boarding_house_tags.length - 1 }} more
                        </v-chip>
                      </div>
                    </v-card-text>
                    <v-card-actions class="pl-3 pr-13 pb-7">
                      <v-btn
                        size="large"
                        class="rounded-lg font-weight-bold bg-green text-body-2"
                        block
                        @click="openDialog(post)"
                      >
                        View Details
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-menu location="start" width="175">
                        <template v-slot:activator="{ props }">
                          <v-icon
                            v-bind="props"
                          >
                            mdi-dots-vertical
                          </v-icon>
                        </template>

                        <v-list>
                          <v-list-item>
                            <v-list-item-title class="font-weight-bold">Actions</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            density="compact"
                            @click="onUpdate(post)"
                          >
                            <v-icon class="mr-5">mdi-pencil</v-icon>
                            Edit
                          </v-list-item>
                          <v-divider class="mt-5"></v-divider>
                          <v-list-item
                            density="compact"
                            @click="onDelete(post)"
                          >
                            <p class="text-red"><v-icon class="mr-5">mdi-delete-variant</v-icon>Delete</p>

                          </v-list-item>
                        </v-list>
                      </v-menu>
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
                          <v-spacer></v-spacer>
                          <p class="text-caption text-muted">{{ review.timeAgo }}</p>
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
        </v-card>
      </v-dialog>

      <UpdatePost
        :post="selectedPost"
        :isOpen="isUpdateDialogOpen"
        @close="isUpdateDialogOpen = false"
        @updated="handlePostUpdate"
      />

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

      <v-dialog v-model="deleteDialog" max-width="500px" persistent>
        <v-card>
          <v-card-title class="text-h5">Confirm Deletion</v-card-title>
          <v-card-text>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="deleteDialog = false">Cancel</v-btn>
            <v-btn @click="deletePost" color="red">Delete</v-btn>
          </v-card-actions>
        </v-card>
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
  max-width: 180px; /* Adjust this width as needed */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
