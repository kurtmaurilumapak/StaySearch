<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const search = ref ({
  loaded: false,
  loading: false,
})
const sorts = [
  'Newest',
  'Price',
  'Proximity to Campus',
  'Ratings',
]
const rating = ref(4.5)

const onClick = () => {
  search.value.loading = true
  setTimeout(() => {
    search.value.loading = false
    search.value.loaded = true
  }, 2000)
}

</script>


<template>
  <AppLayout>
    <template #content>
      <v-app-bar
        :elevation="2"
      >
        <v-row class="d-flex align-center">
          <v-col cols="4">
            <RouterLink
              style="text-decoration: none;color: inherit;"
              to="/"
              class="d-flex align-center ga-1 my-5 ml-5"
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

          <v-col cols="5" md="6" class="d-none d-sm-block pr-10">
            <v-text-field
              :loading="search.loading"
              append-inner-icon="mdi-magnify"
              density="comfortable"
              label="Search"
              variant="solo-filled"
              hide-details
              single-line
              @click:append-inner="onClick"
              max-width="350"
            ></v-text-field>
          </v-col>

          <v-col cols="8" sm="2" class="d-flex align-center justify-end pr-10">
            <v-btn
              class="d-flex d-sm-none"
              color="black"
              icon="mdi-magnify"
              variant="text"
            ></v-btn>
            <v-btn
              class="ma-2"
              color="black"
              icon="mdi-bell"
              variant="text"
            ></v-btn>

            <v-menu location="bottom">
              <template v-slot:activator="{ props }">
                <v-avatar
                  image="https://cdn.vuetifyjs.com/images/john.jpg"
                  size="50"
                  v-bind="props"
                >
                </v-avatar>
              </template>
              <v-list
                style="margin-left: 35px; width: 200px"
              >
                <v-list-item
                  class="text-center"
                >
                  SETTINGS
                </v-list-item>
                <v-list-item
                  class="text-center"
                  style="color: red;"
                >
                  LOGOUT
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-app-bar>


      <v-row class="mt-4 mx-0 mx-md-5">
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
    </template>
  </AppLayout>
</template>



