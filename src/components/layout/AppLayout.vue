<script setup>
import { useTheme } from 'vuetify'
import { onMounted } from 'vue'
import { supabase } from '@/lib/supabaseClient.js'

const theme = useTheme()

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {

    // Fetch user's theme preference
    theme.global.name.value = session.user.user_metadata.theme || 'light';
  }
})
</script>

<template>
  <v-app
    class="d-flex justify-center align-center overflow-y-hidden overflow-x-hidden"
    style="height: auto; width: auto;"
  >
    <v-main class="poppins-font">
      <slot name="content"></slot>
    </v-main>
  </v-app>
</template>


<style>
.poppins-font {
  font-family: 'Poppins', sans-serif;
}
</style>