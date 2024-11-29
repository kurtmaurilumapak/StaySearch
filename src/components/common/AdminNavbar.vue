<script setup>
import { ref } from 'vue'

const nav = ref({
  navItems: [
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

</script>

<template>
  <v-navigation-drawer>
    <v-toolbar-title>
      <img
                      src="@/assets/logo.png"
                      alt="Logo"
                      width="30"
                      height="20"
                    />
      <h2 class="font-weight-bold">StaySearch</h2>
    </v-toolbar-title>

    <v-list-item
      class="py-5"
      color="green"
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