<script setup>
import { ref, watch, onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservationStore.js'

const reservationStore = useReservationStore();

const props = defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['update:isOpen'])

const myReservations = ref(props.isOpen)

watch(() => props.isOpen, (newVal) => {
  myReservations.value = newVal
})

const closeDialog = () => {
  emit('update:isOpen', false)
}

onMounted(async () => {
  try {
    await reservationStore.fetchStudentReservationData()
  } catch (error) {
    console.error('Error fetching posts:', error)
  }
})

const handleCancelReservation = async (reservationID) => {
  try {
    await reservationStore.deleteReservation(reservationID)
    await reservationStore.fetchStudentReservationData()
    console.log('Reservation successfully deleted.')
  } catch (error) {
    console.error('Error deleting reservation:', error)
  }
}


</script>


<template>
  <v-dialog v-model="myReservations" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <h3>My Reservations</h3>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-row no-gutters>

          <template v-if="reservationStore.reservations.length === 0">
            <v-col cols="12" class="d-flex justify-center">
              <p class="text-center text-disabled">No Reservations</p>
            </v-col>
          </template>

          <v-col
            v-for="reservation in reservationStore.reservations"
            :key="reservation.id"
            cols="12"
            class="d-flex justify-space-between border pa-3 mb-2 rounded-lg border-b-lg"
          >
            <div>
              <h4>{{ reservation.checkin_date }}</h4>
              <h3>{{ reservation.boarding_houses?.name }}</h3>
              <p class="text-disabled" style="font-size: 14px">{{ reservation.boarding_houses?.address }}</p>
            </div>
            <div class="text-center">
              <v-btn
                class="text-none"
                size="small"
                rounded
                color="red"
                @click="handleCancelReservation(reservation.id)"
              >
                Cancel
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>