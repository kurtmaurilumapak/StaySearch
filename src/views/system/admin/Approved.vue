<script setup>
import AdminNavbar from '@/components/common/AdminNavbar.vue'
import Applayout from '@/components/layout/AppLayout.vue'
import { useAdminStore } from '@/stores/adminStore';
import { onMounted } from 'vue';

const adminStore = useAdminStore();
onMounted(() =>{
  adminStore.fetchCards();
})

</script>

<template>
  <Applayout>
    <template #content>
      <AdminNavbar />
      <v-row dense>
        <v-col col="12" md="6">
          <v-card v-for="card in adminStore.cards":key="boardinghouse.id">
            <v-card-title>{{card.name}}</v-card-title>
            <v-card-text>{{card.address}}</v-card-text>
            <v-card-text>{{card.price}}</v-card-text>
            <v-card-text>{{card.decription}}</v-card-text>
            <v-card-text>{{card.status}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>