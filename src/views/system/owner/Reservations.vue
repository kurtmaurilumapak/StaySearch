<script setup>
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabaseClient.js'
import { useTheme } from 'vuetify'


const drawer = ref(true);
const theme = useTheme()



onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {

    // Fetch user's theme preference
    theme.global.name.value = session.user.user_metadata.theme || 'light';
  }
})
</script>

<template>
  <AppLayout>
    <template #content>
      <Navbar v-model="drawer" />
      <v-row>
        <!-- Sidebar Navigation -->
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
        <!-- Main Content Area -->
        <v-col cols="12" md="10" class="d-flex justify-center align-center">
          <v-card :elevation="7"  style="border-radius: 0; height: 100vh; width: 100%;">
            <!-- Header with Notification & Menu -->
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

            <!-- Boarding House Posts -->
            <v-row class="pa-6" style="overflow-y: auto; max-height: 100vh">
              <v-col cols="12" md="6" lg="4">
                <v-card class="mb-5" elevation="12" style="border-radius: 12px; overflow: hidden;">
                  <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="200px"></v-img>
                  <v-card-title class="text-h5" style="background-color: #375a8b; color: white;">Boarding House</v-card-title>
                  <v-card-text style="padding: 20px;">
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="dark" block>View Details</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <v-card class="mb-5" elevation="12" style="border-radius: 12px; overflow: hidden;">
                  <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="200px"></v-img>
                  <v-card-title class="text-h5" style="background-color: #375a8b; color: white;">Boarding House</v-card-title>
                  <v-card-text style="padding: 20px;">
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="dark" block>View Details</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12" md="6" lg="4">
                <v-card class="mb-5" elevation="12" style="border-radius: 12px; overflow: hidden;">
                  <v-img src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="200px"></v-img>
                  <v-card-title class="text-h5" style="background-color: #375a8b; color: white;">Boarding House</v-card-title>
                  <v-card-text style="padding: 20px;">
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                      <v-col cols="6"><h3>Name:</h3></v-col>
                      <v-col cols="6"><h3>Date:</h3></v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="dark" block>View Details</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
