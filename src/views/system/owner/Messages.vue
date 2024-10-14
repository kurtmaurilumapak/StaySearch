<script setup>
//import { ref } from 'vue'
import Navbar from '@/components/common/Navbar.vue'
import AppLayout from '@/components/layout/AppLayout.vue'

</script>


<template>
  <AppLayout>
    <template #content>
      <Navbar />
      <v-row justify="space-around">
        <v-col cols="12" md="6">
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>



