<script setup>

</script>

<template>
  <v-app
    class="d-flex justify-center align-center overflow-y-hidden overflow-x-hidden"
    style="height: auto; width: auto;"
  >
    <v-main>
      <slot name="content"></slot>
    </v-main>
  </v-app>
</template>