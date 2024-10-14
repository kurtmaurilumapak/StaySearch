<script setup>
import { ref } from 'vue'

</script>


<template>
  <v-container>
    <v-row justify="space-around">
      <v-col cols="12" md="6">
        <v-btn
          class="mt-10"
          @click="$router.push('/owner/create')"
        >create post</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>



