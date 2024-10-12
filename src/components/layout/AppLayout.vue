<script setup>
import { ref } from 'vue'
const theme = ref(localStorage.getItem('theme') ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}


</script>


<template>
  <v-responsive class="d-flex justify-center">
    <v-app :theme="theme">
      <v-switch
        class="d-flex justify-end mr-10"
        :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        inset
        @change="onClick"
      ></v-switch>

      <v-main>
        <v-container class="d-flex justify-center">
          <slot name="content"></slot>
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>