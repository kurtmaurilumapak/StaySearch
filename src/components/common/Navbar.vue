<script setup>
import { ref, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import dashboardIcon from '@/assets/navbar/dashboard.png';
import postsIcon from '@/assets/navbar/post.png';
import reservationsIcon from '@/assets/navbar/reservation.png';
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/userStore.js'

const router = useRouter()
const theme = useTheme()
const useAuth = useAuthStore()
const userStore = useUserStore()

const nav = ref({
  navItems: [
    { title: 'DASHBOARD', path: '/owner/dashboard', icon: dashboardIcon },
    { title: 'POSTS', path: '/owner/posts', icon: postsIcon },
    { title: 'RESERVATIONS', path: '/owner/reservations', icon: reservationsIcon },
  ],
})

const logout = async () => {
  await useAuth.signOut()
  window.location.reload();
  theme.global.name.value = 'light'
  await router.push('/login')
}

onMounted(async () => {
  await userStore.fetchUserData()
})

</script>

<template>
  <v-navigation-drawer
    color="green"
  >
    <v-list

    >
      <v-list-item class="d-flex justify-center align-center pa-2">
        <v-menu
          location="right"
          transition="slide-x-transition"
        >
          <template v-slot:activator="{ props }">
            <v-card
              class="py-2"
              variant="text"
              v-bind="props"
            >
              <div class="d-flex align-center ga-3 px-5">
                <v-avatar
                  size="50"
                >
                  <v-img
                    alt="Profile"
                    :src="userStore.userData.picture ||  '/csu.png'"
                  ></v-img>
                </v-avatar>
                <div class="d-flex flex-column align-start">
                  <p style="font-size: 17px; font-weight: bold;">{{ userStore.userData.name }}</p>
                  <p style="font-size: 15px; font-weight: bold;">Owner</p>
                </div>
                <v-icon>mdi-chevron-right</v-icon>
              </div>
            </v-card>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <div class="d-flex align-center ga-3">
                  <v-avatar
                    size="50"
                  >
                    <v-img
                      alt="Profile"
                      :src="userStore.userData.picture ||  '/csu.png'"
                    ></v-img>
                  </v-avatar>
                  <div class="d-flex flex-column align-start">
                    <p style="font-size: 15px">{{ userStore.userData.name }}</p>
                    <p style="font-size: 13px">{{ userStore.userData.email }}</p>
                  </div>
                </div>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  class="text-none font-weight-bold"
                  variant="text"
                  rounded
                  block
                  @click="$router.push('/settings')"
                >
                  Edit Account
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  class="text-none font-weight-bold"
                  variant="text"
                  color="red"
                  rounded
                  block
                  @click="logout"
                >
                  Logout
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <v-list-item
        class="pa-5"
        v-for="(item, index) in nav.navItems"
        :key="index"
        :to="item.path"
      >

        <v-list-item-title
          class="d-flex align-center ga-5"
          style="font-size: 15px;
          font-weight: bold"
        >
          <img
            :src="item.icon"
            alt="icon"
            width="30"
          />
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

