<script setup>
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from 'vuetify'
import { useUserStore } from '@/stores/userStore.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const theme = useTheme()
const useAuth = useAuthStore()
const userStore = useUserStore()

const nav = ref({
  navItems: [
    { title: 'Dashboard', path: '/admin/dashboard', icon: 'mdi-view-dashboard' },
    { title: 'Request', path: '/admin/request', icon: 'mdi-view-dashboard' },
    { title: 'Approved', path: '/admin/approved', icon: 'mdi-checkbox-marked-circle-outline' }
  ],
  profile: {
    fav: true,
    menu: false,
    message: false,
    hints: true,
    dialog: false
  },
  drawer: false
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
  <v-navigation-drawer  color="green">
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
                <p style="font-size: 17px; font-weight: bold;">{{ userStore.userData.firstname }} {{ userStore.userData.lastname }}</p>
                <p style="font-size: 15px; font-weight: bold;">Admin</p>
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
                  <p style="font-size: 15px">{{ userStore.userData.firstname }} {{ userStore.userData.lastname }}</p>
                  <p style="font-size: 13px">{{ userStore.userData.email }}</p>
                </div>
              </div>
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

    <v-divider></v-divider>

    <v-list-item
      class="py-5"
      :prepend-icon="item.icon"
      v-for="(item, index) in nav.navItems"
      :key="index"
      :to="item.path"
    >
      <v-list-item-title>{{ item.title }}</v-list-item-title>
    </v-list-item>
    <v-spacer></v-spacer>
  </v-navigation-drawer>
</template>