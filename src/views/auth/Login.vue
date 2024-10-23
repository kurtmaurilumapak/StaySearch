<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

import { ref } from 'vue'

const form = ref({
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
        class="d-flex justify-center align-start mx-0">
      >
        <v-col cols="12" class="d-flex justify-center align-center">
          <v-card
            style="border-radius: 20px;"
            :elevation="12"
            max-width="475"
          >
            <img
              style="position: absolute; z-index: -1"
              src="@/assets/auth/login.png"
              alt="cardbg"
              height="100%"
              width="100%"
            >

            <v-card-item class="justify-center py-5 text-white">
              <RouterLink
                style="text-decoration: none;color: inherit;"
                to="/"
                class="d-flex align-center gap-3"
              >
                <img
                  src="@/assets/logo.png"
                  alt="Logo"
                  width="50"
                  height="50"
                />
                <h1 class="font-weight-bold">
                  StaySearch
                </h1>
              </RouterLink>
            </v-card-item>
            <v-card-text class="pt-2 px-10">
              <div class="d-flex align-end text-white cursor-default">
                <h1 class="mb-1">
                  Welcome to StaySearch!
                </h1>
                <h1 class="text-h2 float">👋🏻</h1>
              </div>

              <p class="mb-0 text-white cursor-default">
                Please sign-in to your account and start searching.
              </p>
            </v-card-text>
            <v-form
              style="background-color: white; margin-left: 5%; margin-right: 5%; padding-bottom: 5%; border-radius: 20px"
              @submit.prevent="() => {}"
            >
              <v-row no-gutters>
                <!-- User Type -->
                <v-col
                  cols="12"
                  class="d-flex justify-center py-5"
                >
                  <v-btn-toggle
                    v-model="user"
                    class="my-auto border border-2"
                    color="green-darken-1"
                    mandatory
                    tile
                  >
                    <v-btn value="student" style="flex: 1;">Student</v-btn>
                    <v-btn value="house_owner" style="flex: 1;">House Owner</v-btn>
                  </v-btn-toggle>
                </v-col>
                <!-- Username -->
                <v-col cols="12" >
                  <v-text-field
                    class="px-10"
                    color="green-darken-1"
                    v-model="form.username"
                    label="Username or Email"
                    placeholder="johndoe or johndoe@email.com"
                    variant="outlined"
                  />
                </v-col>
                <!-- password -->
                <v-col cols="12" class="text-center">
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
                  />
                </v-col>
                <v-col cols="12" class="text-center pt-5">
                  <v-btn
                    :loading="form.loading"
                    color="green-darken-1"
                    width="50%"
                    type="submit"
                    @click="load"
                  >
                    Login
                  </v-btn>
                </v-col>

                <!-- login instead -->
                <v-col
                  cols="12"
                  class="text-center text-base pt-10"
                >
                  <span>New on our platform?</span>
                  <RouterLink
                    style="text-decoration: none;color: mediumseagreen;"
                    class="ms-2 font-weight-bold"
                    to="signup"
                  >Create an account
                  </RouterLink>
                </v-col>

                <v-col
                  cols="12"
                  class="d-flex align-center pt-5"
                >
                  <v-divider />
                  <span class="mx-4 text-overline">or</span>
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
            <v-card-text>
            </v-card-text>
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