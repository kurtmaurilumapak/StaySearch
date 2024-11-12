<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import dashboardIcon from '@/assets/navbar/dashboard.png';
import postsIcon from '@/assets/navbar/post.png';
import reservationsIcon from '@/assets/navbar/reservation.png';
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'

const router = useRouter()
const theme = useTheme()
const useAuth = useAuthStore()

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
  >
    <v-list

    >
      <v-list-item class="d-flex justify-center">
        <v-menu location="left">
          <template v-slot:activator="{ props }">
            <v-avatar
              image="https://cdn.vuetifyjs.com/images/john.jpg"
              size="40"
              v-bind="props"
            >
            </v-avatar>
          </template>

          <v-list
            style="margin-left: 35px; width: 200px"
          >
            <v-list-item
              class="text-center"
              @click="$router.push('/settings')"
            >
              SETTINGS
            </v-list-item>
            <v-list-item
              class="text-center"
              style="color: red;"
              @click="logout"
            >
              LOGOUT
            </v-list-item>
          </v-list>

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

