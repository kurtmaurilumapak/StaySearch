<script setup>
import { ref, watch } from 'vue'

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
          <v-col cols="12" class="d-flex justify-space-between border pa-3 mb-2 rounded-lg border-b-lg">
            <div>
              <h4>yyyy/mm/dd</h4>
              <h3>Boarding House Name</h3>
              <p>address</p>
            </div>
            <div class="text-center">
              <p>status</p>
              <v-btn
                class="text-none"
                size="small"
                rounded
                color="red"
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