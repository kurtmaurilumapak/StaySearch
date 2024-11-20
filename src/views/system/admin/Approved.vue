<script setup>
import AdminNavbar from '@/components/common/AdminNavbar.vue'
import Applayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <Applayout>
    <template #content>
      <AdminNavbar />
      <v-row dense>
        <v-col col="12" md="6">
          <v-card>
            <v-card-title> Boarding House Name </v-card-title>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>