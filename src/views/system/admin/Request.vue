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
      <v-row class="ma-2 ma-lg-10 w-lg-50">
        <v-col cols="12" v-for="boardinghouse in adminStore.boardinghouse"  :key="boardinghouse.id">
          <v-card class="d-flex align-start border border-b-lg">
            <v-card-text>
              <h2>{{boardinghouse.name}}</h2>
              <p class="text-disabled">{{boardinghouse.address}}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" @click="handleApprove(boardinghouse.id)">Approve</v-btn>
              <v-btn color="red" @click="handleReject(boardinghouse.id)">Reject</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </Applayout>
</template>
