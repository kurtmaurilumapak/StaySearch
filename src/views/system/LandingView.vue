<script setup>
import { ref } from 'vue'


const dialog = ref(false) 
const selectedImage = ref(null) 
const drawer = ref(false)


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
          <v-btn class="d-none d-md-flex" @click="scrollToSection('gallery')">Boardings</v-btn>
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
          <v-list-item-title>Boardings</v-list-item-title>
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

    <v-container fluid class="pa-4 text-center d-flex flex-column justify-center align-center" id="gallery">
      <v-row class="w-100 d-flex justify-center">
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
                  @click="openModal('https://www.taskspace.co.uk/wp-content/uploads/2020/09/Hero-Boarding.jpg')"
                >
                  <v-img
                    src="https://www.taskspace.co.uk/wp-content/uploads/2020/09/Hero-Boarding.jpg"
                    max-width="100%"
                    height="500"
                    cover
                  >
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
                  @click="openModal('https://cf.bstatic.com/xdata/images/hotel/max1024x768/426392656.jpg?k=e7d5e7ff512747a6b77bc4718ac513d99f4aa3a225ed53a8b542ea4b324ed8b1&o=&hp=1')"
                >
                  <v-img
                    src="https://cf.bstatic.com/xdata/images/hotel/max1024x768/426392656.jpg?k=e7d5e7ff512747a6b77bc4718ac513d99f4aa3a225ed53a8b542ea4b324ed8b1&o=&hp=1"
                    height="500"
                    cover
                  >
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
                  @click="openModal('https://i0.wp.com/josoromabuilders.wordpress.com/wp-content/uploads/2019/04/pers-01.jpg?ssl=1')"
                >
                  <v-img
                    src="https://i0.wp.com/josoromabuilders.wordpress.com/wp-content/uploads/2019/04/pers-01.jpg?ssl=1"
                    height="500"
                    cover
                  >
                  
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
                  @click="openModal('https://media.istockphoto.com/id/1216332347/photo/corner-of-a-white-building-against-a-background-of-trees-and-overcast-sky.jpg?s=612x612&w=0&k=20&c=Liox3B2cAlLRkfGo7YzKY1qlrxALXrrqpafSwixGuHY=')"
                >
                  <v-img
                    src="https://media.istockphoto.com/id/1216332347/photo/corner-of-a-white-building-against-a-background-of-trees-and-overcast-sky.jpg?s=612x612&w=0&k=20&c=Liox3B2cAlLRkfGo7YzKY1qlrxALXrrqpafSwixGuHY="
                    height="500"
                    cover
                  >
                      
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
              @click="openModal('https://htrealty.ph/wp-content/uploads/2022/08/received_385083866879715-816x785.jpeg')"
            >
              <v-img
                src="https://htrealty.ph/wp-content/uploads/2022/08/received_385083866879715-816x785.jpeg"
                height=500
                cover
              >
                
              </v-img>
            </v-card>
          </v-hover>
        </v-col>

        <!-- Image 7 -->
       
        <!-- Image 8 -->
       
        
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
        <v-col cols="12" md="4">
          <v-card class="pa-5">
            <v-avatar size="80px" class="mx-auto">
              <img
                src="@/assets/ainor.png"
                alt="avatar"
                max-width="100%"
                height="100%"
              >
            </v-avatar>
            <h4 class="mt-3">Ainor Jamal</h4>
            <v-btn fab icon href="facebook.com/ainor.jamal/9" target="_blank">
              <v-icon >
                mdi-facebook </v-icon>
            </v-btn>

          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-5">
            <v-avatar size="80px" class="mx-auto">
              <img
                src="@/assets/kurt.png"
                alt="avatar"
                max-width="100%"
                height="100%"
                    
              >
            </v-avatar>
            <h4 class="mt-3">Kurt Mauri Lumapak</h4>
            <v-btn fab icon href="facebook.com/kurtniezas01" target="_blank">
              <v-icon >
                mdi-facebook </v-icon>
            </v-btn>

          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card class="pa-5">
            <v-avatar size="80px" class="mx-auto">
              <img
                src="@/assets/harold.png"
                alt="avatar"
                cover
                max-width="100%"
                height="100%"
              >
            </v-avatar>
            <h4 class="mt-3">Harold Florendo</h4>
            <v-btn fab icon href="facebook.com/harold.florendo.777" target="_blank">
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
