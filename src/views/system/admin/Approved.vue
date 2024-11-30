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
      <v-row class="px-sm-15">
        <v-btn
                    fab icon
                    @click="$router.push('/admin/dashboard')"
                  >
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
        <v-col cols="12" v-for="boardinghouse in adminStore.boardinghouse" :key="boardinghouse.id">
                  <v-card class="d-flex align-start border border-b-lg">
                    <v-card-text>
                      <h2>{{ boardinghouse.name }}</h2>
                      <p class="text-subtitle-1">{{ boardinghouse.address }}</p>
                      <p class="text-body-2">posted by: <strong>{{ boardinghouse.owner_name }}</strong></p>
                    </v-card-text>
                    <v-card-text>
                      <h2>{{ boardinghouse.decription }}</h2>
                    </v-card-text>
                    <v-card-text>
                      <h2>{{ boardinghouse.status }}</h2>
                    </v-card-text>
                    
                  </v-card>
                </v-col>
      </v-row>
    </template>
  </Applayout>
</template>