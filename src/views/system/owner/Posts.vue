<script setup>
//import { ref } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'

const rating = ref(4.5)
const drawer = ref(true);
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
            <v-col cols="12">
              <RouterLink
                style="text-decoration: none;color: inherit;"
                to="/"
                class="d-flex align-center justify-center ga-1 my-5"
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
            style="border-radius: 0; height: 100vh"

          >

            <v-card-title
              class="py-5"
              style="background-color: darkseagreen;"
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
                    class="ma-2"
                    color="black"
                    icon="mdi-bell"
                    variant="text"
                  ></v-btn>
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
            <v-card-text
              style="overflow-y: auto; max-height: 100vh;"
            >
              <v-row
              >

                <!-- CARD POSTS -->
                <v-col cols="12" md="6" lg="4" class="d-flex justify-center align-center">
                  <v-card
                    class="border rounded-lg"
                    @click="$router.push('/owner/create')"
                    width="100%"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="5">
                          <v-img
                            class="bg-white rounded-lg"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                            max-width="100%"
                            height="180"
                            cover
                          ></v-img>
                        </v-col>
                        <v-col cols="7">
                          <v-row>
                            <v-col cols="12">
                              <div class="d-flex align-center">
                                <span>{{ rating }}</span>
                                <v-rating
                                  v-model="rating"
                                  half-increments
                                  readonly
                                  :length="5"
                                  :size="26"
                                  color="green-accent-4"
                                />
                              </div>
                              <h1 class="text-h6">House Name</h1>
                              <h2 class="text-subtitle-1">Address</h2>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-body-2">Tags</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <h2 class="text-h6">Price/month</h2>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" lg="4" class="d-flex justify-center align-center">
                  <v-card
                    class="border rounded-lg"
                    @click="$router.push('/owner/create')"
                    width="100%"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="5">
                          <v-img
                            class="bg-white rounded-lg"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                            max-width="100%"
                            height="180"
                            cover
                          ></v-img>
                        </v-col>
                        <v-col cols="7">
                          <v-row>
                            <v-col cols="12">
                              <div class="d-flex align-center">
                                <span>{{ rating }}</span>
                                <v-rating
                                  v-model="rating"
                                  half-increments
                                  readonly
                                  :length="5"
                                  :size="26"
                                  color="green-accent-4"
                                />
                              </div>
                              <h1 class="text-h6">House Name</h1>
                              <h2 class="text-subtitle-1">Address</h2>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-body-2">Tags</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <h2 class="text-h6">Price/month</h2>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" lg="4" class="d-flex justify-center align-center">
                  <v-card
                    class="border rounded-lg"
                    @click="$router.push('/owner/create')"
                    width="100%"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="5">
                          <v-img
                            class="bg-white rounded-lg"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                            max-width="100%"
                            height="180"
                            cover
                          ></v-img>
                        </v-col>
                        <v-col cols="7">
                          <v-row>
                            <v-col cols="12">
                              <div class="d-flex align-center">
                                <span>{{ rating }}</span>
                                <v-rating
                                  v-model="rating"
                                  half-increments
                                  readonly
                                  :length="5"
                                  :size="26"
                                  color="green-accent-4"
                                />
                              </div>
                              <h1 class="text-h6">House Name</h1>
                              <h2 class="text-subtitle-1">Address</h2>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-body-2">Tags</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <h2 class="text-h6">Price/month</h2>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" lg="4" class="d-flex justify-center align-center">
                  <v-card
                    class="border rounded-lg"
                    @click="$router.push('/owner/create')"
                    width="100%"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="5">
                          <v-img
                            class="bg-white rounded-lg"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                            max-width="100%"
                            height="180"
                            cover
                          ></v-img>
                        </v-col>
                        <v-col cols="7">
                          <v-row>
                            <v-col cols="12">
                              <div class="d-flex align-center">
                                <span>{{ rating }}</span>
                                <v-rating
                                  v-model="rating"
                                  half-increments
                                  readonly
                                  :length="5"
                                  :size="26"
                                  color="green-accent-4"
                                />
                              </div>
                              <h1 class="text-h6">House Name</h1>
                              <h2 class="text-subtitle-1">Address</h2>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-body-2">Tags</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <h2 class="text-h6">Price/month</h2>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" lg="4" class="d-flex justify-center align-center">
                  <v-card
                    class="border rounded-lg"
                    @click="$router.push('/owner/create')"
                    width="100%"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="5">
                          <v-img
                            class="bg-white rounded-lg"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                            max-width="100%"
                            height="180"
                            cover
                          ></v-img>
                        </v-col>
                        <v-col cols="7">
                          <v-row>
                            <v-col cols="12">
                              <div class="d-flex align-center">
                                <span>{{ rating }}</span>
                                <v-rating
                                  v-model="rating"
                                  half-increments
                                  readonly
                                  :length="5"
                                  :size="26"
                                  color="green-accent-4"
                                />
                              </div>
                              <h1 class="text-h6">House Name</h1>
                              <h2 class="text-subtitle-1">Address</h2>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-body-2">Tags</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <h2 class="text-h6">Price/month</h2>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" lg="4" class="d-flex justify-center align-center">
                  <v-card
                    class="border rounded-lg"
                    @click="$router.push('/owner/create')"
                    width="100%"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="5">
                          <v-img
                            class="bg-white rounded-lg"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                            max-width="100%"
                            height="180"
                            cover
                          ></v-img>
                        </v-col>
                        <v-col cols="7">
                          <v-row>
                            <v-col cols="12">
                              <div class="d-flex align-center">
                                <span>{{ rating }}</span>
                                <v-rating
                                  v-model="rating"
                                  half-increments
                                  readonly
                                  :length="5"
                                  :size="26"
                                  color="green-accent-4"
                                />
                              </div>
                              <h1 class="text-h6">House Name</h1>
                              <h2 class="text-subtitle-1">Address</h2>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-body-2">Tags</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <h2 class="text-h6">Price/month</h2>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="6" lg="4" class="d-flex justify-center align-center">
                  <v-card
                    class="border rounded-lg"
                    @click="$router.push('/owner/create')"
                    width="100%"
                  >
                    <v-card-text>
                      <v-row>
                        <v-col cols="5">
                          <v-img
                            class="bg-white rounded-lg"
                            src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                            max-width="100%"
                            height="180"
                            cover
                          ></v-img>
                        </v-col>
                        <v-col cols="7">
                          <v-row>
                            <v-col cols="12">
                              <div class="d-flex align-center">
                                <span>{{ rating }}</span>
                                <v-rating
                                  v-model="rating"
                                  half-increments
                                  readonly
                                  :length="5"
                                  :size="26"
                                  color="green-accent-4"
                                />
                              </div>
                              <h1 class="text-h6">House Name</h1>
                              <h2 class="text-subtitle-1">Address</h2>
                            </v-col>
                            <v-col cols="12">
                              <span class="text-body-2">Tags</span>
                            </v-col>
                            <v-col cols="12" class="d-flex justify-end">
                              <h2 class="text-h6">Price/month</h2>
                            </v-col>
                          </v-row>
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
    </template>
  </AppLayout>
</template>



