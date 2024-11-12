<script setup>
import AdminNavbar from '@/components/common/AdminNavbar.vue'
import Applayout from '@/components/layout/AppLayout.vue'
</script>

<template>
  <Applayout>
    <template #content>
      <AdminNavbar />
      <v-row justify="space-around">
        <v-col cols="12" md="6">
          <v-card class="mx-auto align-start">
            <v-card-title>Boarding House Name</v-card-title>
            <v-card-actions justify="end">
              <v-btn color="green" text="Approve"></v-btn>
              <v-btn color="red" text="Reject"></v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>
