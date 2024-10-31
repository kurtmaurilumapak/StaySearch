<script setup>
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref } from 'vue'


const drawer = ref(true);




</script>

<template>
  <AppLayout>
    <template #content>
      <Navbar v-model="drawer" />
      <v-row>
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
          </v-row>
        </v-col>

        <v-col
          cols="12"
          md="10"
          class="d-flex justify-center align-center"
        >
          <v-card
            :elevation="7"
            style="border-radius: 0; height: 100vh; width: 100%; overflow-y: auto;"
          >
            <v-card-title
              class="py-0"
            >
              <v-row>
                <v-col cols="6">
                  <RouterLink
                    style="text-decoration: none;color: inherit;"
                    to="/"
                    class="d-md-none d-inline-flex align-center justify-center ga-1 my-5"
                  >
                    <img
                      src="@/assets/logo.png"
                      alt="Logo"
                      width="40"
                      height="40"
                    />
                    <h2 style="font-size: clamp(20px, 6vw, 25px)">
                      StaySearch
                    </h2>
                  </RouterLink>
                </v-col>
                <v-col cols="6" class="d-flex align-center justify-end">
                  <v-btn
                    class="ma-2 d-flex d-lg-none"
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
                <v-col cols="12" md="4" lg="4" class="justify-center align-center">
                  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="344"
    color="green-lighten-4
"
  >
    <v-card-item>
      <v-card-title class="text-center">
        Number of Posts 
      </v-card-title>

     
    </v-card-item>

    <v-card-text class="text-h1 text-center">
      <v-icon>mdi-post</v-icon>
      10
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions  class="d-flex justify-center">
      <v-btn fab size="large" icons target="_blank" 
      @click="$router.push('/owner/posts')"> 
              <v-icon>
                mdi-arrow-right-circle </v-icon>
            </v-btn>
    </v-card-actions>
  </v-card>

                </v-col>
                <v-col cols="12" md="4" lg="4" class="justify-center align-center">
                  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="344"
    color="green-lighten-4
"
  >
    <v-card-item>
      <v-card-title class="text-center">
        Number of Tenants
      </v-card-title>

    
    </v-card-item>

    <v-card-text class="text-h1 text-center">
      <v-icon>mdi-account-group</v-icon>
      43
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions  class="d-flex justify-center">
      <v-btn fab size="large" icons target="_blank"> 
              <v-icon>
                mdi-arrow-right-circle </v-icon>
            </v-btn>
    </v-card-actions>
    
  </v-card>

                </v-col>
                <v-col cols="12" md="4" lg="4" class="justify-center align-center">
                  <v-card
    class="mx-auto my-8"
    elevation="16"
    max-width="344"
    color="green-lighten-4
"
  >
    <v-card-item>
      <v-card-title class="text-center">
        Reservations
      </v-card-title>

      
    </v-card-item>

    <v-card-text class="text-h1 text-center">
      <v-icon>mdi-calendar-multiselect</v-icon>
      5
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions  class="d-flex justify-center">
      <v-btn fab size="large" icons target="_blank"
      @click="$router.push('/owner/reservations')"> 
              <v-icon>
                mdi-arrow-right-circle </v-icon>
            </v-btn>  
    </v-card-actions>
  </v-card>
                  
                </v-col>
                <!-- CARD POSTS -->
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
