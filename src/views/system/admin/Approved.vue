<script setup>
import AdminNavbar from '@/components/common/AdminNavbar.vue'
import Applayout from '@/components/layout/AppLayout.vue'
import { useAdminStore } from '@/stores/adminStore';
import { onMounted } from 'vue';

const adminStore = useAdminStore();
onMounted(() =>{
  adminStore.fetchBoardData2();
})

</script>

<template>
  <Applayout>
    <template #content>
      <AdminNavbar />
      <v-row dense>
        <v-col col="12" md="6">
          <v-card v-for="boardinghouse in adminStore.boardinghouse"  :key="boardinghouse.id">
            <v-card-title>{{boardinghouse.name}}</v-card-title>
            <v-card-text>{{boardinghouse.address}}</v-card-text>
            <v-card-text>{{boardinghouse.price}}</v-card-text>
            <v-card-text>{{boardinghouse.decription}}</v-card-text>
            <v-card-text>{{boardinghouse.status}}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>