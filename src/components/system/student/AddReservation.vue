<script setup>
import { ref, watch } from 'vue'
import { format } from 'date-fns'
import { usePostStore } from '@/stores/postStore.js'


const postStore = usePostStore();


const props = defineProps({
  isOpen: Boolean,
  boardingHouseId: Number,
})

const emit = defineEmits(['update:isOpen'])

const addReservation = ref(props.isOpen);

watch(() => props.isOpen, (newVal) => {
  addReservation.value = newVal
})

const reservationDate = ref(null)

const isFormValid = ref(false)
watch(reservationDate, (newVal) => {
  isFormValid.value = newVal !== null
})

const closeDialog = () => {
  emit('update:isOpen', false)
}

const submitReservation = async () => {
  const formattedDate = format(reservationDate.value, 'yyyy-MM-dd')
  console.log('Reservation submitted', formattedDate)
  try {
    await postStore.addReservation(props.boardingHouseId, formattedDate)
    window.location.reload();
    closeDialog();
  }catch (error) {
    console.error("Failed to add reservation:", error);
  }
}

</script>


<template>
  <v-dialog v-model="addReservation" max-width="500" persistent>
    <v-card>
      <v-card-title class="d-flex align-center">
        <h3>Add Reservation</h3>
        <v-spacer></v-spacer>
        <v-btn icon variant="text" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="reservationForm" v-model="isFormValid">
          <v-date-picker
            v-model="reservationDate"
            width="400"
          >

          </v-date-picker>


          <v-btn
            :disabled="!isFormValid"
            color="green"
            @click="submitReservation"
          >
            Submit Reservation
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


