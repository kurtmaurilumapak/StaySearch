<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

import { ref } from 'vue'

const form = ref({
  username: '',
  email: '',
  password: '',
  privacyPolicies: false,
})
const isPasswordVisible = ref(false)
</script>


<template>
  <AppLayout>
    <template #content>
      <v-card
        style="border-radius: 20px;"
        :elevation="12"
        max-width="448"
      >
        <v-card-item class="justify-center py-10">
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
          <h2 class="mb-1">
            Welcome to StaySearch! 👋🏻
          </h2>
          <p class="mb-0 text-disabled">
            Please sign-in to your account and start searching.
          </p>
        </v-card-text>
        <v-form @submit.prevent="() => {}">
          <v-row no-gutters>
            <v-col cols="12">
              <v-select
                class="px-10"
                color="green-darken-1"
                clearable
                label="User Type"
                :items="['Student', 'House Owner']"
                variant="outlined"
              ></v-select>
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
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
              />
            </v-col>
            <v-col cols="12" class="text-center pt-5">
              <v-btn
                color="green-darken-1"
                width="50%"
                type="submit"
                to="/"
              >
                Login
              </v-btn>
            </v-col>

            <!-- login instead -->
            <v-col
              cols="12"
              class="text-center text-base pt-10"
            >
              <span class="text-disabled">New on our platform?</span>
              <RouterLink
                style="text-decoration: none;color: green;"
                class="ms-2"
                to="signup"
              >Create an account
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
                <v-btn fab icon @click="signupWithGoogle">
                  <v-icon
                    color="red-darken-1"
                    size="x-large"
                  >
                    mdi-google
                  </v-icon>
                </v-btn>
                <v-btn fab icon @click="signupWithFacebook">
                  <v-icon
                    color="blue-darken-1"
                    size="x-large"
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
    </template>
  </AppLayout>
</template>




