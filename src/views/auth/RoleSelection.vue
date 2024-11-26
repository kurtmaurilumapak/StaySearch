<script setup>
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()

const selectRole = async (role) => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    console.error('Error fetching session:', sessionError.message);
    return;
  }
  const user = session?.user;

  if (user) {
    // Update user metadata with the selected role
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role },
    })
    window.location.reload();
    if (updateError) {
      console.error('Error updating role:', updateError.message)
    } else {
      // Redirect user based on the role
      if (role === 'student') {
        await router.push('/student/page')
      } else if (role === 'owner') {
        await router.push('/owner/dashboard')
      }
    }
  } else {
    console.error('User not found')
  }
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="d-flex justify-center" style="height: 100vh;">
        <v-col cols="12" class="d-flex flex-column justify-center align-center text-center">
          <h1>Are you a student or a boarding house owner?</h1>
          <div class="d-flex ga-5 mt-15">
            <v-btn
              size="large"
              color="green-darken-1"
              @click="selectRole('student')"
            >
              Student
            </v-btn>
            <v-btn
              size="large"
              color="green-darken-1"
              @click="selectRole('owner')"
            >
              Owner
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>


