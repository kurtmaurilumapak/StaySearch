<script setup>
import { ref, computed } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'


const drawer = ref(true);

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
        <v-col cols="12" md="2" class="d-none d-md-block">
          <v-row class="pl-5">
            <v-col cols="12" class="d-flex justify-center">
              <RouterLink
                style="text-decoration: none;color: inherit;"
                to="/"
                class="d-inline-flex align-center justify-center ga-1 my-5"
              >
                <img
                  src="@/assets/logo.png"
                  alt="Logo"
                  width="40"
                  height="40"
                />
                <h2 class="font-weight-bold">
                  StaySearch
                </h2>
              </RouterLink>
            </v-col>
            <v-col cols="12" class="d-flex justify-center">
              <v-btn
                width="90%"
                color="green-darken-2"
                @click="$router.push('/owner/create')"
              >
                create post
              </v-btn>
            </v-col>
          </v-row>
        </v-col>

        <!-- CREATED POSTS -->
        <v-col
          cols="12"
          md="10"
          class="d-flex justify-center align-center"
        >

          <v-card
            :elevation="7"
            style="border-radius: 0; height: 100vh; overflow-y: auto"

          >

            <v-card-title
              class="py-0"
            >
              <v-row>
                <v-col cols="6" sm="4" class="d-flex d-md-none align-center">
                  <v-btn
                    color="green-darken-2"
                    @click="$router.push('/owner/create')"
                    block
                  >
                    create post
                  </v-btn>
                </v-col>
                <v-col cols="6" sm="8" md="12" class="d-flex justify-end">
                  <v-btn
                    class="ma-2 d-flex d-lg-none"
                    color="black"
                    icon="mdi-menu"
                    variant="text"
                    @click="drawer = !drawer"
                  ></v-btn>
                </v-col>

              </v-row>
            </v-card-title>

            <v-divider></v-divider>
            <v-spacer></v-spacer>

            <!-- CONTENTS -->
            <v-card-text>
              <v-row>
                <!-- CARD POSTS -->
                <v-col cols="12" sm="6" lg="4" class="d-flex justify-center align-center">
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
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                            <v-col cols="4">
                              <v-img
                                class="bg-white rounded-xl"
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                          </v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h1 class="text-h6">House Name</h1>
                                <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                              </v-col>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
                                <span class="text-body-2">Tags</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" lg="4" class="d-flex justify-center align-center">
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
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                            <v-col cols="4">
                              <v-img
                                class="bg-white rounded-xl"
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                aspect-ratio="1"
                                height="170"
                                cover
                              ></v-img>
                            </v-col>
                          </v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h1 class="text-h6">House Name</h1>
                                <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                              </v-col>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
                                <span class="text-body-2">Tags</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" lg="4" class="d-flex justify-center align-center">
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
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                            <v-col cols="4">
                              <v-img
                                class="bg-white rounded-xl"
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                          </v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h1 class="text-h6">House Name</h1>
                                <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                              </v-col>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
                                <span class="text-body-2">Tags</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" lg="4" class="d-flex justify-center align-center">
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
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                            <v-col cols="4">
                              <v-img
                                class="bg-white rounded-xl"
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                          </v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h1 class="text-h6">House Name</h1>
                                <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                              </v-col>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
                                <span class="text-body-2">Tags</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" lg="4" class="d-flex justify-center align-center">
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
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                            <v-col cols="4">
                              <v-img
                                class="bg-white rounded-xl"
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                          </v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h1 class="text-h6">House Name</h1>
                                <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                              </v-col>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
                                <span class="text-body-2">Tags</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" lg="4" class="d-flex justify-center align-center">
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
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                            <v-col cols="4">
                              <v-img
                                class="bg-white rounded-xl"
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                          </v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h1 class="text-h6">House Name</h1>
                                <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                              </v-col>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
                                <span class="text-body-2">Tags</span>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" lg="4" class="d-flex justify-center align-center">
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
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                            <v-col cols="4">
                              <v-img
                                class="bg-white rounded-xl"
                                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                max-width="100%"
                                height="170"
                                aspect-ratio="1"
                                cover
                              ></v-img>
                            </v-col>
                          </v-row>
                          <v-col cols="12">
                            <v-row>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h1 class="text-h6">House Name</h1>
                                <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                              </v-col>
                              <v-col cols="12" class="d-inline-flex justify-space-between">
                                <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>Price/month</h2>
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
                color="black"
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
                              <span style="font-size: clamp(5px, 3vw, 25px)">{{ extraImagesCount }}+ more</span>
                            </div>
                          </v-img>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="12" class="d-block">
                  <div class="d-flex justify-space-between">
                    <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>Address</h2>
                    <v-btn
                      style="background-color: forestgreen; color: white;"
                      class="text-none"
                    >
                      Book now!
                    </v-btn>
                  </div>
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
