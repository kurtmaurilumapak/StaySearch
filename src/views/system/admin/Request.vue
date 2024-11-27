<script setup>
import AdminNavbar from '@/components/common/AdminNavbar.vue'
import Applayout from '@/components/layout/AppLayout.vue'
import { useAdminStore } from '@/stores/adminStore';
import { onMounted } from 'vue';

const adminStore = useAdminStore();


onMounted(() => {
  adminStore.fetchCards();
});

const handleApprove = async (cardID) => {
  await adminStore.approveCard(cardID)
};

const handleReject = async (cardID) => {
  await adminStore.rejectCard(cardID);
}

</script>

<template>
  <Applayout>
    <template #content>
      <AdminNavbar />
      <v-row justify="space-around">
        <v-col cols="12" md="6" v-for="card in adminStore.cards":key="card.id">
          <v-card class="mx-auto align-start">
            <v-card-title>{{card.name}}</v-card-title>
            <v-card-text>{{card.address}}</v-card-text>
            <v-card-text>{{card.price}}</v-card-text>
            <v-card-text>{{card.decription}}</v-card-text>
            <v-card-actions justify="end">
              <v-btn color="green" text @click="handleApprove">Approve</v-btn>
              <v-btn color="red" text @click="handleReject">Reject</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>
