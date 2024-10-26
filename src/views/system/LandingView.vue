<script setup>
import { ref } from 'vue'


const dialog = ref(false) 
const selectedImage = ref(null) 
const drawer = ref(false)

const developers = [
  {
    avatar: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeHJVnJ4u6QE_dM-TsXgfPAoWt9TLzuBU1Ba31MvO4FTUAdwZh5ICdR8uLsn7jJLylhCHbRWn1alp9fwITHM-zq0&_nc_ohc=dmcmeAdPEz4Q7kNvgHCkDfv&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=AZ8MNjum2RFA_IKRAzdm0ia&oh=00_AYAGR0f142ly1oJyrvSvvK6KuaRwrc2F3dt9100FJQtKGQ&oe=67334FFA',
    name: 'Ainor Jamal',
    text: 'facebook.com/ainor.jamal.9'
  },
  {
    avatar: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-6/278384899_1621300201553680_3154144050592710379_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHsBnhZi4UpGCrhq0qd-lwfv5Dt5lRqKfS_kO3mVGop9DTxJ245b2ubBmWxO4K_HLXTc7a4YFEVtq5DcDc6Lb5c&_nc_ohc=xfX8FgVR47oQ7kNvgHy58zC&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=A1aG7GYvqR0C54fFMBbZ5cA&oh=00_AYBw9KV3AVAbtqQO-a0gQmlrE7ka-3_0EstU0jW6PQyqJA&oe=6711A121',
    name: 'Kurt Mauri Lumapak',
    text: 'facebook.com/kurtniezas01'
  },
  {
    avatar: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-1/414713350_1645837936165455_7931494424647193135_n.jpg?stp=dst-jpg_s200x200&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEl3wjtqx1mASZbbPom193vV2fpz0Tp331XZ-nPROnffdDt3iJ611emik_tOX2RN9jaVYVguJHMa4FVhcPSf4Sa&_nc_ohc=EWQMoAQT-48Q7kNvgHQbn9I&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=A0PwDMkACWw0xqLPJUcOr_B&oh=00_AYDpYWxne7w_cv2ZXbr93q0Qnqg1Bq3a3uk9bX4LBZUggg&oe=6711B1BA',
    name: 'Harold Florendo',
    text: 'facebook.com/harold.florendo.777'
  }, 
]


const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
    drawer.value = false
  }
}

const openModal = (image) => {
  selectedImage.value = image 
  dialog.value = true 
}

</script>

<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar app dark class="navbar"
               density="comfortable"
               elevation="10"
               flat
               floating
    >
      <v-row>
        <v-col cols="6">
          <RouterLink
            style="text-decoration: none;color: inherit;"
            to="/"
            class="d-flex align-center justify-start ga-1 mx-5"
          >
            <img
              src="@/assets/logo.png"
              alt="Logo"
              width="40"
              height="40"
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
          <v-btn class="d-none d-md-flex" @click="scrollToSection('gallery')">Accommodations</v-btn>
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
        <v-list-item @click="scrollToSection('gallery')">
          <v-list-item-title>Accommodations</v-list-item-title>
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
    <v-container fluid class="hero" id="home">
      <v-row class="fill-height align-center justify-center text-center">
        <v-col>
          <h1 class="display-2 font-weight-bold mb-3 text-center text-h3">
            Search for a Boarding House near Caraga State University
          </h1>
          <v-btn size="x-large" color="green-darken-1" class="mt-5 px-10" large @click="$router.push({ name: 'login' })">Find</v-btn>
        </v-col>
      </v-row>
    </v-container>

    <v-container fluid class="pa-4 text-center d-flex flex-column align-center justify-center" id="gallery">
      <v-row class="w-lg-75 d-flex justify-center">
        <v-col cols="12">
          <v-row>
            <!-- Image 1 -->
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 20 : 2"
                  width="100%"
                  v-bind="props"
                  @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
                >
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    max-width="100%"
                    height="500"
                    cover
                  >
                    <v-card-title class="text-h6 text-white d-flex flex-column">
                      <p class="mt-21">Sample Title 1</p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>

            <!-- Image 2 -->
            <v-col cols="12" md="8">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 20 : 2"
                  width="100%"
                  v-bind="props"
                  @click="openModal('https://www.kayak.com.ph/rimg/himg/45/bc/5f/expediav2-287511-eddf8e-547412.jpg?width=1366&height=768&crop=true')"
                >
                  <v-img
                    src="https://www.kayak.com.ph/rimg/himg/45/bc/5f/expediav2-287511-eddf8e-547412.jpg?width=1366&height=768&crop=true"
                    height="500"
                    cover
                  >
                    <v-card-title class="text-h6 text-white d-flex flex-column">
                      <p class="mt-21">Sample Title 2</p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row>
            <!-- Image 3 -->
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card

                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 20 : 2"
                  v-bind="props"
                  @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
                >
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    height="500"
                    cover
                  >
                    <v-card-title class="text-h6 text-white d-flex flex-column">
                      <p class="mt-21">Sample Title 3</p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>

            <!-- Image 4 -->
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 20 : 2"
                  v-bind="props"
                  @click="openModal('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvYuZYTDHcMw28NyHdJNRXJb_dvdhYfGZK-w&s')"
                >
                  <v-img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvYuZYTDHcMw28NyHdJNRXJb_dvdhYfGZK-w&s"
                    height="500"
                    cover
                  >
                    <v-card-title class="text-h6 text-white d-flex flex-column">
                      <p class="mt-21">Sample Title 4</p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>

            <!-- Image 5 -->
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 20 : 2"
                  v-bind="props"
                  @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
                >
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    height="500"
                    cover
                  >
                    <v-card-title class="text-h6 text-white d-flex flex-column">
                      <p class="mt-21">Sample Title 5</p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>

        <!-- Image 6 -->
        <v-col cols="12">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              :class="{ 'on-hover': isHovering }"
              :elevation="isHovering ? 20 : 2"
              v-bind="props"
              @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                height=500
                cover
              >
                <v-card-title class="text-h6 text-white d-flex flex-column">
                  <p class="mt-21">Sample Title 6</p>
                </v-card-title>
              </v-img>
            </v-card>
          </v-hover>
        </v-col>

        <!-- Image 7 -->
        <v-col cols="12" md="6">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              :class="{ 'on-hover': isHovering }"
              :elevation="isHovering ? 20 : 2"
              v-bind="props"
              @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                height="500"
                cover
              >
                <v-card-title class="text-h6 text-white d-flex flex-column">
                  <p class="mt-21">Sample Title 7</p>
                </v-card-title>
              </v-img>
            </v-card>
          </v-hover>
        </v-col>

        <!-- Image 8 -->
        <v-col cols="12" md="6">
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              :class="{ 'on-hover': isHovering }"
              :elevation="isHovering ? 20 : 2"
              v-bind="props"
              @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
            >
              <v-img
                src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                height="500"
                cover
              >
                <v-card-title class="text-h6 text-white d-flex flex-column">
                  <p class="mt-21">Sample Title 8</p>
                </v-card-title>
              </v-img>
            </v-card>
          </v-hover>
        </v-col>

        <v-col cols="12">
          <v-row>
            <!-- Image 9 -->
            <v-col cols="12" md="8">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 20 : 2"
                  width="100%"
                  v-bind="props"
                  @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
                >
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    max-width="100%"
                    height="500"
                    cover
                  >
                    <v-card-title class="text-h6 text-white d-flex flex-column">
                      <p class="mt-21">Sample Title 9</p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>

            <!-- Image 10 -->
            <v-col cols="12" md="4">
              <v-hover v-slot="{ isHovering, props }">
                <v-card
                  :class="{ 'on-hover': isHovering }"
                  :elevation="isHovering ? 20 : 2"
                  v-bind="props"
                  @click="openModal('https://cdn.vuetifyjs.com/images/parallax/material.jpg')"
                >
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                    height="500"
                    cover
                  >
                    <v-card-title class="text-h6 text-white d-flex flex-column">
                      <p class="mt-21">Sample Title 10</p>
                    </v-card-title>
                  </v-img>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- Dialog Modal for Image Viewing -->
      <v-dialog v-model="dialog" max-width="600px">
        <v-card style="opacity: 1;">
          <v-img :src="selectedImage" aspect-ratio="16/9" class="clear-modal-image"></v-img>
        </v-card>
      </v-dialog>
    </v-container>
    

    <!-- About Section -->
    <v-container id="about" class="py-16 text-center">
      <h2>About StaySearch</h2>
      <v-row>
        <v-col cols="12" md="8" class="mx-auto">
          <p class="text-h6">
            StaySearch is a web platform designed to help students and residents find affordable and accessible boarding houses near Caraga State University (CSU). We strive to simplify the process of finding the perfect place to stay by offering a comprehensive list of available options. Our goal is to connect boarders with safe, convenient, and budget-friendly accommodations, ensuring they have a comfortable living experience while studying at CSU.
          </p>
          <p class="text-h6">
            Whether you’re a new student or a returning one, StaySearch makes it easy for you to find a home away from home. Our platform provides detailed information on boarding houses, including location, amenities, and pricing, to help you make an informed decision. StaySearch is more than just a listing site — it's your go-to guide for student housing around CSU.
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-container id="aboutus" class="py-16 text-center">
      <h2>Developers</h2>
      <v-row>
        <v-col cols="12" md="4" v-for="developer in developers" :key="developer.id">
          <v-card class="pa-5">
            <v-avatar size="80px" class="mx-auto">
              <v-img :src="developer.avatar"></v-img>
            </v-avatar>
            <h4 class="mt-3">{{ developer.name }}</h4>
            <v-btn fab icon :href="'https://' + developer.text" target="_blank">
              <v-icon >
                mdi-facebook </v-icon>
            </v-btn>

          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Footer -->
    <v-footer dark>
      <v-container class="text-center">
        <p class="mb-0"></p>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style scoped>
.hero {
  background-image: url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDF1YjNzZjFsemVubDV3OW15aWRjOHdvN21zZ2dxaTQzZGFhdjNuaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/82jROlcRerLJeBni9u/giphy.gif');
height: 100vh;
background-size: cover;
background-position: center;

}


#gallery {
  background-color: #388e3c;
}
.gallery h2 {
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
.v-card {
  transition: opacity .3s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.7;
}
.clear-modal-image {
opacity: 1 !important; /* Ensure full opacity */
}

.v-dialog__content {
background-color: rgba(255, 255, 255, 1); /* Ensure modal background is solid */
}

.show-btns {
  color: rgba(255, 255, 255, 1) !important;
}
#aboutus .v-btn {
  border-radius: 50%;
}
</style>
