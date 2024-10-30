<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

</script>

<template>
  <AppLayout>
    <template #content>
      <v-row
        style="height: 100vh;"
      >
        <v-col class="d-flex justify-center align-center">
          <img
            src="@/assets/unauthorized.png"
            alt="unauthorized"
            width="1000"
          >
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>
