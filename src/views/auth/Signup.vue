<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

import { ref, computed } from 'vue'

const form = ref({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  loading: false,
})

function load () {
  form.value.loading = true
  setTimeout(() => (form.value.loading = false), 3000)
}

const visible = ref(false)
const user = ref('student')


const capitalizeFirstLetter = (field) => {
  form.value[field] = form.value[field].charAt(0).toUpperCase() + form.value[field].slice(1);
}

const firstnameRules =[
  v => !!v || 'First name is required',
]
const lastnameRules =[
  v => !!v || 'Last name is required',
]
const emailRules = [
  v => !!v || 'Email is required',
  v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Invalid email format',
]
const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 8 || 'Password must be at least 8 characters long',
  v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
  v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
  v => /[0-9]/.test(v) || 'Password must contain at least one number',
  v => /[^\w\s]/.test(v) || 'Password must contain at least one special character',
]

const isFormValid = computed(() => {
  return (
    firstnameRules.every(rule => rule(form.value.firstname) === true) &&
    lastnameRules.every(rule => rule(form.value.lastname) === true) &&
    emailRules.every(rule => rule(form.value.email) === true) &&
    passwordRules.every(rule => rule(form.value.password) === true)
  );
});
</script>


<template>
  <AppLayout>
    <template #content>
      <img
        style="position: absolute; height: 100%; width: 100%; pointer-events: none;"
        src="@/assets/background.png"
        alt="background"
      >
      <div class="overlay"></div>

      <v-row
        style="height: calc(100vh + 12px); overflow-y: auto;"
        class="mx-0"
      >
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-card
            style="border-radius: 20px;"
            :elevation="12"
            max-width="475"
          >
            <img
              style="position: absolute; z-index: -1"
              src="@/assets/authbg.png"
              alt="cardbg"
              height="100%"
              width="100%"
            >
            <v-card-item class="justify-center py-5">
              <RouterLink
                style="text-decoration: none;color: white;"
                to="/"
                class="d-flex align-center gap-3"
              >
                <img
                  src="@/assets/logo.png"
                  alt="Logo"
                  width="50"
                  height="50"
                />
                <h1
                  class="font-weight-bold"
                >
                  StaySearch
                </h1>
              </RouterLink>
            </v-card-item>
            <v-card-text class="pt-2 px-10">
              <div class="d-flex align-end text-white">
                <h1 class="mb-1">
                  Adventure starts here
                </h1>
                <h1 class="text-h2 float">🚀</h1>
              </div>
              <p class="mb-0 text-white">
                Make your search for boarding houses easy and fast!
              </p>
            </v-card-text>
            <v-form
              class="pb-8"
              style="background-color: white; margin-left: 5%; margin-right: 5%; margin-bottom: 5%; border-radius: 20px"
            >
              <v-row no-gutters>
                <!-- User Type -->
                <v-col
                  cols="12"
                  class="d-flex justify-center py-5"
                >
                  <v-btn-toggle
                    v-model="user"
                    class="my-auto border"
                    color="green-darken-1"
                    mandatory
                    tile
                  >
                    <v-btn value="student" style="flex: 1;">Student</v-btn>
                    <v-btn value="house_owner" style="flex: 1;">House Owner</v-btn>
                  </v-btn-toggle>
                </v-col>
                <!-- Name -->
                <v-col cols="6">
                  <v-text-field
                    class="pl-10 pr-1"
                    color="green-darken-1"
                    v-model="form.firstname"
                    label="First Name"
                    placeholder="John"
                    variant="outlined"
                    :rules="firstnameRules"
                    @input="capitalizeFirstLetter('firstname')"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    class="pr-10 pl-1"
                    color="green-darken-1"
                    v-model="form.lastname"
                    label="Last Name"
                    placeholder="Doe"
                    variant="outlined"
                    :rules="lastnameRules"
                    @input="capitalizeFirstLetter('lastname')"
                  />
                </v-col>

                <!-- email -->
                <v-col cols="12">
                  <v-text-field
                    class="px-10"
                    color="green-darken-1"
                    v-model="form.email"
                    label="Email"
                    placeholder="johndoe@email.com"
                    type="email"
                    variant="outlined"
                    :rules="emailRules"
                  />
                </v-col>

                <!-- password -->
                <v-col cols="12">
                  <v-text-field
                    class="px-10"
                    color="green-darken-1"
                    v-model="form.password"
                    label="Password"
                    placeholder="············"
                    variant="outlined"
                    :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="visible ? 'text' : 'password'"
                    @click:append-inner="visible = !visible"
                    :rules="passwordRules"
                  />
                </v-col>
                <v-col cols="12" class="text-center pt-5">
                  <v-btn
                    :loading="form.loading"
                    color="green-darken-1"
                    width="50%"
                    type="submit"
                    :disabled="!isFormValid"
                    @click="load"
                  >
                    Sign up
                  </v-btn>
                </v-col>

                <!-- login instead -->
                <v-col
                  cols="12"
                  class="text-center text-base pt-10"
                >
                  <span>Already have an account?</span>
                  <RouterLink
                    style="text-decoration: none;color: mediumseagreen;"
                    class="ms-2 font-weight-bold"
                    to="login"
                  >Sign in instead
                  </RouterLink>
                </v-col>

                <v-col
                  cols="12"
                  class="d-flex align-center pt-5"
                >
                  <v-divider />
                  <span class="mx-4">or</span>
                  <v-divider />
                </v-col>

                <!-- auth providers -->
                <v-col
                  cols="12"
                  class="text-center pt-5"
                >
                  <div style="display: flex; gap: 8px; justify-content: center;">
                    <v-btn
                      @click="signupWithGoogle"
                      color= "white"
                      size="x-large"
                    >
                      <img
                        style="pointer-events: none"
                        src="@/assets/google.png"
                        alt="Google Icon"
                        height="32"
                        width="32"
                      />
                    </v-btn>
                    <v-btn
                      @click="signupWithFacebook"
                      color="blue-accent-3"
                      size="x-large"
                    >
                      <v-icon
                        color="white"
                        size="xx-large"
                      >
                        mdi-facebook
                      </v-icon>
                    </v-btn>
                  </div>

                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style>
.overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 128, 0, 0.4) 0%, rgba(0, 128, 0, 0.1) 50%, rgba(0, 128, 0, 0.4) 100%);
  pointer-events: none;
}


.float {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* Move up */
  }
  100% {
    transform: translateY(0); /* Move back down */
  }
}
</style>