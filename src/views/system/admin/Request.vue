<script setup>
import AdminNavbar from '@/components/common/AdminNavbar.vue'
import Applayout from '@/components/layout/AppLayout.vue'
import { useAdminStore } from '@/stores/adminStore';
import { onMounted } from 'vue';

const adminStore = useAdminStore();


onMounted(() => {
  adminStore.fetchBoardData();
});

const handleApprove = async (boardinghouseID) => {
  await adminStore.approveCard(boardinghouseID)
};

const handleReject = async (boardinghouseID) => {
  await adminStore.rejectCard(boardinghouseID);
}

</script>

<template>
  <Applayout>
    <template #content>
      <AdminNavbar />
      <v-row justify="space-around">
        <v-col cols="12" md="6" v-for="boardinghouse in adminStore.boardinghouse"  :key="boardinghouse.id">
          <v-card class="mx-auto align-start">
            <v-card-title>{{boardinghouse.name}}</v-card-title>
            <v-card-text>{{boardinghouse.address}}</v-card-text>
            <v-card-text>{{boardinghouse.price}}</v-card-text>
            <v-card-text>{{boardinghouse.decription}}</v-card-text>
            <v-card-actions justify="end">
              <v-btn color="green" text @click="handleApprove(boardinghouse.id)">Approve</v-btn>
              <v-btn color="red" text @click="handleReject(boardinghouse.id)">Reject</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>
