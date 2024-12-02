<script setup>
import { ref , onMounted} from 'vue'
import hero from '@/assets/landing/hero.png'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"
import { useMapStore } from '@/stores/mapStore'

const drawer = ref(false)
const mapStore = useMapStore()

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
    drawer.value = false
  }
}
const fetchCoordinates = async () => {
  try {
    await mapStore.fetchUserBoardingHouseData();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

onMounted(() => {
  AOS.init({
    duration: 600, // Adjust as needed
    once: false, 
    mirror: true,   // Whether animation should happen only once
  });
  fetchCoordinates()
});


</script>

<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar
      app dark class="navbar"
      density="comfortable"
      :elevation="2"
      flat
      floating
    >
      <v-row>
        <v-col cols="6">
          <RouterLink
            style="text-decoration: none;color: inherit;"
            to="/"
            class="d-inline-flex align-center ga-1 my-5 ml-5"
          >
            <img
              class="cursor-pointer"
              src="@/assets/logo.png"
              alt="Logo"
              width="30"
              height="30"
              @click="scrollToSection('home')"
            />
            <h2
              class="font-weight-bold"
              @click="scrollToSection('home')">
              StaySearch
            </h2>
          </RouterLink>
        </v-col>
        <v-col cols="6" class="d-flex justify-end align-center">
          <v-btn class="d-none d-md-flex" @click="scrollToSection('home')">Home</v-btn>
          <v-btn class="d-none d-md-flex" @click="scrollToSection('locations')">Locations</v-btn>
          <v-btn class="d-none d-md-flex" @click="scrollToSection('about')">About us</v-btn>
          <v-btn class="d-none d-md-flex ml-5 mr-5" @click="$router.push({ name: 'login' })" style="background-color: green; color: white;">Sign in</v-btn>
        </v-col>
      </v-row>






      <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>

    </v-app-bar>


    <v-navigation-drawer v-model="drawer" app temporary class="drawer">
      <v-list>
        <v-list-item @click="scrollToSection('home')">
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scrollToSection('locations')">
          <v-list-item-title>Locations</v-list-item-title>
        </v-list-item>
        <v-list-item @click="scrollToSection('about')">
          <v-list-item-title>About us</v-list-item-title>
        </v-list-item>
        <v-list-item @click="$router.push({ name: 'login' })" style="background-color: green;">
          <v-list-item-title>Sign in</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Hero Section -->
    <!-- Hero Section -->
<v-container fluid class="bg-green d-flex justify-center align-center overflow-x-hidden" style="min-height: 100vh;" id="home">
  <v-row class="d-flex justify-center align-center">
    <!-- Text Column -->
    <v-col cols="12" md="6" class="text-center text-md-right d-flex flex-column justify-center px-4">
      <h1 class="display-2 font-weight-bold mb-3 text-h3 text-md-h2 py-10">
        Find Your Perfect Campus Home
      </h1>
      <p class="text-white text-h5">
        Connecting students with the best boarding houses near campus. <br />
        Owners, list your properties and reach thousands of students!
      </p>
    </v-col>
    <!-- Image Column -->
    <v-col cols="12" md="6" class="d-flex justify-center align-center">
      <v-img
        :src="hero"
        alt="hero"
        class="float py-10"
        max-width="100%"
        height="400"
        
      />
    </v-col>
  </v-row>
</v-container>

    <v-container fluid class="d-flex flex-column py-15 text-center bg-green-lighten-5">
      <h1 class="text-green-darken-4 text-h3 font-weight-bold" data-aos="fade-right">How StaySearch Works</h1>
      <v-row class="mx-10 mt-15">
        <v-col cols="12" md="4" class="mx-auto " data-aos="fade-up">
          <v-icon size="xxx-large" color="green" class="bg-green-lighten-4 rounded-circle pa-13 mb-7">
            mdi-plus-circle-outline
          </v-icon>
          <h1 class="text-green-darken-4 mb-3">1. List Your Property</h1>
          <p>Owners create detailed listings with photos, amenities, and pricing.</p>
        </v-col>
        <v-col cols="12" md="4" class="mx-auto " data-aos="fade-up">
          <v-icon size="xxx-large" color="green" class="bg-green-lighten-4 rounded-circle pa-13 mb-7">
            mdi-magnify
          </v-icon>
          <h1 class="text-green-darken-4 mb-3">2. Students Browse</h1>
          <p>Students search, filter, and compare available housing options.</p>
        </v-col>
        <v-col cols="12" md="4" class="mx-auto " data-aos="fade-up">
          <v-icon size="xxx-large" color="green" class="bg-green-lighten-4 rounded-circle pa-13 mb-7">
            mdi-star-outline
          </v-icon>
          <h1 class="text-green-darken-4 mb-3">3. Perfect Match</h1>
          <p>Students find their ideal housing, and owners get reliable tenants.</p>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="pa-4 text-center d-flex flex-column justify-center align-center" id="locations">
      <h1 class="text-green-darken-4 text-h3 font-weight-bold">Explore Boarding Locations</h1>
      <div
  class="d-flex flex-wrap mx-10 pa-10 text-center"
  style="height: 500px; width: 100%; border-radius: 10px;"
>
  <l-map
    :use-global-leaflet="false"
    ref="map"
    zoom=15
    :center="[8.9559,125.59715]"
    minZoom=12
  >
    <l-tile-layer
      url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=sQh8Ib7Qh6Fp1elfR6K8"
      layer-type="base"
      name="OpenStreetMap"
    ></l-tile-layer>
    <l-marker
      v-for="coordinates in mapStore.boardingHouseCoordinates"
      :key="coordinates.id"
      :lat-lng="[coordinates.latitude, coordinates.longitude]"
    >
    <l-tooltip>{{ coordinates.name }}</l-tooltip>
  </l-marker>
  </l-map>
</div>

      
    </v-container>
    

    <!-- About Section -->
    <v-container fluid id="about" class="py-16 d-flex justify-center text-center bg-green">
     <div style="max-width: 50%">
       <h1 class="text-h3 font-weight-bold" data-aos="fade-right">Join Our StaySearch Community Today</h1>
       <br>
       <h2 data-aos="fade-left">Whether you're a property owner looking to list your boarding house or a student searching for the perfect campus home, StaySearch has you covered.</h2>
       <v-btn
         class="text-none font-weight-bold rounded-lg mt-10" data-aos="fade-up-right"
         append-icon="mdi-chevron-right"
         color="green-darken-4"
         size="x-large"
         @click="$router.push({ name: 'signup' })"
       >
         Get Started
       </v-btn>
     </div>
    </v-container>
    <v-container fluid id="aboutus" class="py-16 text-center bg-green-lighten-5" data-aos="fade-right">
      <h1 class="text-green-darken-4 text-h3 font-weight-bold mb-10">About Us</h1>
      <v-row class="mx-lg-16">
        <v-col cols="12" md="8">
          <v-card class="pa-5 text-left" height="100%">
            <v-card-title>
              <h2 class="text-green-darken-4">Our Mission</h2>
            </v-card-title>
            <v-card-text>
              <p class="text-h6">
                StaySearch is a web platform designed to help students and residents find affordable and accessible boarding houses near Caraga State University (CSU). We strive to simplify the process of finding the perfect place to stay by offering a comprehensive list of available options. Our goal is to connect boarders with safe, convenient, and budget-friendly accommodations, ensuring they have a comfortable living experience while studying at CSU.
              </p>
              <p class="text-h6">
                Whether you’re a new student or a returning one, StaySearch makes it easy for you to find a home away from home. Our platform provides detailed information on boarding houses, including location, amenities, and pricing, to help you make an informed decision. StaySearch is more than just a listing site — it's your go-to guide for student housing around CSU.
              </p>
            </v-card-text>

          </v-card>
        </v-col>
        <v-col cols="12" md="4">

          <v-card class="pa-5 text-left" height="100%" data-aos="fade-left">
            <v-card-title>
              <h2 class="text-green-darken-4 font-weight-bold">Meet Our Team</h2>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" class="d-inline-flex align-center justify-start ga-3">
                  <v-avatar size="100px">
                    <img
                      class="h-100"
                      src="@/assets/kurt.png"
                      alt="avatar"
                    >
                  </v-avatar>
                  <div>
                    <h2 class="mt-3 text-green-darken-4">Kurt Mauri Lumapak</h2>
                    <p >System Analyst</p>
                    <v-btn
                      href="https://www.facebook.com/kurtniezas01"
                      color="green-darken-4"
                      icon="mdi-facebook"
                      variant="text"
                      target="_blank"
                    ></v-btn>
                  </div>
                </v-col>
                <v-col cols="12" class="d-inline-flex align-center justify-start ga-3">
                  <v-avatar size="100px">
                    <img
                      class="h-100"
                      src="@/assets/ainor.png"
                      alt="avatar"
                    >
                  </v-avatar>
                  <div>
                    <h2 class="mt-3 text-green-darken-4">Ainor Jamal</h2>
                    <p >Web Developer</p>
                    <v-btn
                      href="https://www.facebook.com/ainor.jamal/9"
                      color="green-darken-4"
                      icon="mdi-facebook"
                      variant="text"
                      target="_blank"
                    ></v-btn>
                  </div>
                </v-col>
                <v-col cols="12" class="d-inline-flex align-center justify-start ga-3">
                  <v-avatar size="100px">
                    <img
                      class="h-100"
                      src="@/assets/harold.png"
                      alt="avatar"
                    >
                  </v-avatar>
                  <div>
                    <h2 class="mt-3 text-green-darken-4">Harold Florendo</h2>
                    <p>Web Developer</p>
                    <v-btn
                      href="https://www.facebook.com/harold.florendo.777"
                      color="green-darken-4"
                      icon="mdi-facebook"
                      variant="text"
                      target="_blank"
                    ></v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-divider></v-divider>
    <!-- Footer -->
    <v-footer class="bg-green-lighten-5">
      <div class="text-center w-100">
        <p>© 2024 StaySearch. All rights reserved.</p>
      </div>
    </v-footer>
  </v-app>
</template>

<style scoped>
.locations h2 {
  color: rgba(0, 0, 0, 0.5);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
.hero h1 {
  color: #81C784;
  text-shadow: 2px 2px black;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.navbar h3{
  color: #B9F6CA;
}
.navbar .v-btn:hover{
  background-color: #B9F6CA;
  color: black;
}
.drawer .v-list-item {
  background-color: #B9F6CA;
  color: black;
}
.clear-modal-image {
opacity: 1 !important; /* Ensure full opacity */
}
.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* Move up */
  }
  100% {
    transform: translateY(0); /* Move back down */
  }
}

</style>
