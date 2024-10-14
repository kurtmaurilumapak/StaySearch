<script setup>
import { ref } from 'vue'
const theme = ref(localStorage.getItem('theme') ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <v-app :theme="theme">
    <div class="text-end mt-3" style="z-index: 1">
      <v-btn fab icon
             style="border: green solid 2px"
             class="mr-11"
             @click="onClick"
      >
        <v-icon>
          {{ theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>
    </div>
    <v-main>
      <div class="d-flex justify-center">
        <slot name="content"></slot>
      </div>
    </v-main>
  </v-app>
</template>