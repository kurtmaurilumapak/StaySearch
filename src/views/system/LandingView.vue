
<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar app dark class="navbar"
      color="rgba(0, 0, 0)"
      density="comfortable"
      elevation="10"
      flat
      floating
    >
      <v-toolbar-title>
        <h3>StaySearch</h3>
      </v-toolbar-title>

      <v-spacer></v-spacer>


      <v-btn text class="d-none d-md-flex" @click="scrollToSection('home')">Home</v-btn>
      <v-btn text class="d-none d-md-flex" @click="scrollToSection('gallery')">Accommodations</v-btn>
      <v-btn text class="d-none d-md-flex" @click="scrollToSection('about')">About us</v-btn>
      <v-btn text class="d-none d-md-flex" @click="$router.push({ name: 'login' })" style="background-color: green;">Sign in</v-btn>

      <v-app-bar-nav-icon class="d-flex d-md-none" @click="drawer = !drawer"></v-app-bar-nav-icon>

    </v-app-bar>


    <v-navigation-drawer v-model="drawer" app temporary class="drawer" color="black">
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
  <h1 class="display-2 font-weight-bold mb-3 text-center text-h3" color="black">
    Search for a Boarding House near Caraga State University
  </h1>
  <v-btn color="green-darken-1" class="mt-5" large @click="$router.push({ name: 'signup' })">Find</v-btn>
</v-col>
</v-row>
</v-container>

    <!-- Services Section -->
    <v-container fluid class="pa-4 text-center" id="gallery">
  <v-row
    align="center"
    class="fill-height"
    justify="center"
  >
    <template v-for="(item, i) in items" :key="i">
      <v-col
        cols="12"
        md="4"
      >
      <v-hover v-slot="{ isHovering, props }">
          <v-card :class="{ 'on-hover': isHovering }"
            :elevation="isHovering ? 20 : 2"
          
            v-bind="props"
            @click="openModal(item.img)"
            
          >
          
            <v-img
            
              :src="item.img"
              height="255px"
              cover       
            >
              <v-card-title class="text-h6 text-white d-flex flex-column">
                <p class="mt-21">
                  {{ item.title }}
                </p>
              </v-card-title>
            </v-img>
            
          </v-card>
      </v-hover>
      </v-col>
    </template>
  </v-row>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card style="opacity: 1;">
      <v-img :src="selectedImage" aspect-ratio="16/9" class="clear-modal-image"></v-img>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text style="background-color: #388E3C;" @click="checklogin">View Details</v-btn>

        <v-btn color="primary" @click="dialog = false" style="border: 1px solid;">Close</v-btn>
      </v-card-actions>
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
            <v-btn :href="'https://' + developer.text" target="_blank">
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

<script>
export default {
  data: () => ({
    dialog: false, // Controls the dialog visibility
    selectedImage: null, // Stores the selected image for the moda
    drawer: false,
    items: [
      {
        title: 'Sample Title',
        img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvYuZYTDHcMw28NyHdJNRXJb_dvdhYfGZK-w&s',
      },
      {
        title: 'Sample Title',
        text: 'Greatest Rock Hits',
        subtext: 'Lose yourself in rock tunes.',
        img: 'https://www.kayak.com.ph/rimg/himg/45/bc/5f/expediav2-287511-eddf8e-547412.jpg?width=1366&height=768&crop=true',
      },
      {
        title: 'Sample Title',
        text: 'Ambient Bass',
        subtext: 'Chill beats to mellow you out.',
        img: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-6/442476318_25673811025568212_4360100489536965015_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEhXW6Gypnr25K1NPwDBQLue7zkL0HBtuJ7vOQvQcG24sAgCcKWudthCpAT5uRqY2C6dgg_YoRDxBaMBYvOAVdg&_nc_ohc=WsO07hF50HMQ7kNvgHpzbSh&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=Apj5QGRvfZ2UWr9f7IH-u5N&oh=00_AYDMTdCa0mMejXiEpjOFloXnehqsKuCW6uC8uVgepdJLGQ&oe=670EEF19',
      },
      {
        title: 'Sample Title',
        text: `It's New Release Friday`,
        subtext: 'Newly released songs.',
        img: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-6/461580645_1583550945930650_8879036349087468545_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE1MTohjBWhV-36amGzM9ES2kctPi7pvPLaRy0-Lum88szPQqkeUqIT1O8RFc5em118PGe6LiKLrvjp4tFV7I4t&_nc_ohc=r5TanUTfBtwQ7kNvgFUAFiN&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=AOadye1hFXfD8EWYtGZDTc4&oh=00_AYC45iz_EWJMXcpgZedIpUqvr1haP3rFLQBYoX3DKf2gQQ&oe=670EE92B',
      },
      {
        title: 'Sample Title',
        text: `It's New Release Friday`,
        subtext: 'Newly released songs.',
        img: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-6/452448566_3323335551304371_7093104599910730166_n.jpg?stp=cp6_dst-jpg&_nc_cat=109&ccb=1-7&_nc_sid=aa7b47&_nc_eui2=AeH2EkRPGaHZiJXeNRsXase5TBo7Bt6TjZVMGjsG3pONlYCS98c7gQr7EN5YmUbw2wz7iKIFUdt6tmrNik1BFUh0&_nc_ohc=z8w6-reK6kAQ7kNvgHl4o2g&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=AGUHDlYqvuFCpAwfLrDZiVU&oh=00_AYDIRZ_7ZjR11cdjiZOgxImX98RklUXKhqUbGX51nNwE1A&oe=670F06DA',
      },
      {
        title: 'Sample Title',
        text: `It's New Release Friday`,
        subtext: 'Newly released songs.',
        img: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-6/353025557_995324961906375_3462028656337839776_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE3nBSlXbh5mRGM_UDcFoLbhJQVu7zJQeSElBW7vMlB5DHIAzoRxeWjzjrWGV3jKaFqDrXf6RQprjzhkrl3Z1sQ&_nc_ohc=TU60Xz3SjLcQ7kNvgGH_QTg&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=AtWSdulap-j3sWHxsscosJj&oh=00_AYD6OM63-wxWzJnB6ZuebHgKnYZLO_SfqIAezuf4GTOzNQ&oe=670F10C2',
      },
      {
        title: 'Sample Title',
        text: `It's New Release Friday`,
        subtext: 'Newly released songs.',
        img: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-6/451420833_1617888938782482_2155335286028533962_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFeLfEnXu8wPudJxWHPHjG-YRSpwmuvgy9hFKnCa6-DLwtXCUEa7ofy3U9EDQLpvSisDf7qgvVqp7HU-6-_r051&_nc_ohc=1T6xX4exa6MQ7kNvgFZ4PGk&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=AcVYrdxnWekAL_sCd6_ixz6&oh=00_AYCr3FBAvBUj713TlUN33tu3Fsyr2YE8DUcSFLaonS4rOw&oe=670EF35A',
      },
      
    ],
    developers: [
      {
        avatar: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s200x200&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_eui2=AeHJVnJ4u6QE_dM-TsXgfPAoWt9TLzuBU1Ba31MvO4FTUAdwZh5ICdR8uLsn7jJLylhCHbRWn1alp9fwITHM-zq0&_nc_ohc=dmcmeAdPEz4Q7kNvgHCkDfv&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=AZ8MNjum2RFA_IKRAzdm0ia&oh=00_AYAGR0f142ly1oJyrvSvvK6KuaRwrc2F3dt9100FJQtKGQ&oe=67334FFA',
        name: 'Ainor Jamal',
        text: 'facebook.com/ainor.jamal.9'
      },
      {
        avatar: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-6/278384899_1621300201553680_3154144050592710379_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHsBnhZi4UpGCrhq0qd-lwfv5Dt5lRqKfS_kO3mVGop9DTxJ245b2ubBmWxO4K_HLXTc7a4YFEVtq5DcDc6Lb5c&_nc_ohc=xfX8FgVR47oQ7kNvgHy58zC&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=A1aG7GYvqR0C54fFMBbZ5cA&oh=00_AYBw9KV3AVAbtqQO-a0gQmlrE7ka-3_0EstU0jW6PQyqJA&oe=6711A121',
        name: 'Kurt Lumapak',
        text: 'facebook.com/kurtniezas01'
      },
      {
        avatar: 'https://scontent.fcgy3-1.fna.fbcdn.net/v/t39.30808-1/414713350_1645837936165455_7931494424647193135_n.jpg?stp=dst-jpg_s200x200&_nc_cat=110&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeEl3wjtqx1mASZbbPom193vV2fpz0Tp331XZ-nPROnffdDt3iJ611emik_tOX2RN9jaVYVguJHMa4FVhcPSf4Sa&_nc_ohc=EWQMoAQT-48Q7kNvgHQbn9I&_nc_ht=scontent.fcgy3-1.fna&_nc_gid=A0PwDMkACWw0xqLPJUcOr_B&oh=00_AYDpYWxne7w_cv2ZXbr93q0Qnqg1Bq3a3uk9bX4LBZUggg&oe=6711B1BA',
        name: 'Harold Florendo',
        text: 'facebook.com/harold.florendo.777'
      },
    ],
    transparent: 'rgba(255, 255, 255, 0)',
  }),
  methods: {
    scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        this.drawer = false;
      }
    },
  openModal(image) {
  this.selectedImage = image; // Set the clicked image
  this.dialog = true; // Open the dialog
},
  checklogin() {
    alert("You must sign in first before viewing details");
  }
}
}
</script>
<style scoped>
.hero {
  background-image: url('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDF1YjNzZjFsemVubDV3OW15aWRjOHdvN21zZ2dxaTQzZGFhdjNuaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/82jROlcRerLJeBni9u/giphy.gif');
height: 100vh;
background-size: cover;
background-position: center;

}

/* Keyframes for sliding backgrounds */

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
