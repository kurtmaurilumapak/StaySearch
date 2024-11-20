<script setup>
import { ref, computed, onMounted  } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePostStore } from '@/stores/postStore.js'


const drawer = ref(true)
const deleteDialog = ref(false)
const deletePostId = ref(null)
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
  postDialog.value.tags = post.boarding_house_tags?.map(tag => tag.tags.name)
  postDialog.value.images = post.boarding_house_images.map(image => image.image_url)
  postDialog.value.address = post.address
  postDialog.value.price = post.price
  postDialog.value.name = post.name
  postDialog.value.description = post.description
};

const posts = ref([]);
onMounted(async () => {
  try {
    await postStore.ownerPost(); // Fetch posts of the logged-in user
    posts.value = postStore.posts; // Assign fetched posts to local variable

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
            class="bg-green-lighten-5"

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
                    class="rounded-lg"
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
                      <p class="text-h5 font-weight-bold text-green-darken-3">{{ post.name }}</p>
                      <p class="text-subtitle-2 text-disabled truncate">{{ post.address }}</p>
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
            <v-card-text>
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
