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
            
          </v-row>
        </v-col>

        <!-- CREATED POSTS -->
        

              <v-row>
                
                <v-col cols="4" md="12" class="d-flex justify-md-end justify-center">
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
            

            <v-divider></v-divider>
            <v-spacer></v-spacer>

            <!-- CONTENTS -->
         
      </v-row>
    </template>
  </AppLayout>
</template>



