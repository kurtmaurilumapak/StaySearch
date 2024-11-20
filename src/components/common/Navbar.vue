<script setup>
import { ref } from 'vue'
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
  theme.global.name.value = 'light'
  await router.push('/login')
}

</script>

<template>
  <v-navigation-drawer
    :width="80"
    class="bg-green-lighten-5"
  >
    <v-list

    >
      <v-list-item class="d-flex justify-center">
        <v-menu location="bottom">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              v-bind="props"
            >
              <v-avatar
                color="brown"
                size="large"
              >
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <div class="mx-auto text-center">
                <v-avatar
                  color="brown"
                >
                </v-avatar>
                <h3>{{ userStore.userData.firstname }}</h3>
                <p class="text-caption mt-1">
                  {{ userStore.userData.email }}
                </p>
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
        class="d-flex flex-column text-center py-3"
        v-for="(item, index) in nav.navItems"
        :key="index"
        :to="item.path"
      >
        <img :src="item.icon" alt="icon" width="30" />
        <p class="text-center" style="font-size: 10px; font-weight: bold">{{ item.title }}</p>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

