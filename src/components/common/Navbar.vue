<script setup>
import { ref } from 'vue'


const nav = ref({
  navItems: [
    { title: 'DASHBOARD', path: '/owner/dashboard', icon: 'mdi-view-dashboard'},
    { title: 'POSTS', path: '/owner/post', icon: 'mdi-image-filter-center-focus-weak' },
    { title: 'MESSAGES', path: '/owner/messages', icon: 'mdi-message-processing'},
  ],
})

</script>

<template>
  <v-navigation-drawer
    :width="100"
  >
    <v-list
      nav
    >
      <v-list-item class="d-flex justify-center">
        <v-menu location="left">
          <template v-slot:activator="{ props }">
            <v-avatar
              image="https://cdn.vuetifyjs.com/images/john.jpg"
              size="50"
              v-bind="props"
            >
            </v-avatar>
          </template>

          <v-list
            style="margin-left: 35px; width: 200px"
          >
            <v-list-item
              class="text-center"
            >
              SETTINGS
            </v-list-item>
            <v-list-item
              class="text-center"
              style="color: red;"
            >
              LOGOUT
            </v-list-item>
          </v-list>

        </v-menu>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        class="d-flex flex-column text-center my-5"
        v-for="(item, index) in nav.navItems"
        color="green-darken-4"
        :key="index"
        :to="item.path"

      >
        <v-icon size="25">{{ item.icon }}</v-icon>
        <v-list-item-title class="text-center">{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

