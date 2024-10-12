<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'

import { ref } from 'vue'

const form = ref({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
})
const visible = ref(false)
const user = ref('student')

const handleSignup = () => {
  form.value.validate().then(valid => {
    if (!valid) return;
    //signup logic
    console.log('Signup successful!');
  })
}


const capitalizeFirstLetter = (field) => {
  form.value[field] = form.value[field].charAt(0).toUpperCase() + form.value[field].slice(1);
}

const firstnameRules =[
  v => !!v || 'First name is required',
]
const lastnameRules =[
  v => !!v || 'Last name is required',
]
const usernameRules = [
  v => !!v || 'Username is required',
  v => v.length >= 3 || 'Password must be at least 3 characters long',
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
</script>


<template>
  <AppLayout>
    <template #content>
      <v-card
        style="border-radius: 20px;"
        :elevation="12"
        max-width="448"
      >
        <v-card-item class="justify-center py-5">
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
            <h1
              class="font-weight-bold"
            >
              StaySearch
            </h1>
          </RouterLink>
        </v-card-item>
        <v-card-text class="pt-2 px-10">
          <h2 class="mb-1">
            Adventure starts here 🚀
          </h2>
          <p class="mb-0 text-disabled">
            Make your search for boarding houses easy and fast!
          </p>
        </v-card-text>
          <v-form
            v-model="isValid"
            @submit.prevent="handleSignup"
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
              >
                <v-btn value="student">Student</v-btn>
                <v-btn value="house_owner">House Owner</v-btn>
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
            <!-- Username -->
            <v-col cols="12">
              <v-text-field
                class="px-10"
                color="green-darken-1"
                v-model="form.username"
                label="Username"
                placeholder="Johndoe"
                variant="outlined"
                :rules="usernameRules"
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
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                @click:append-inner="visible = !visible"
                :rules="passwordRules"
              />
            </v-col>
            <v-col cols="12" class="text-center pt-5">
              <v-btn
                color="green-darken-1"
                width="50%"
                type="submit"
              >
                Sign up
              </v-btn>
            </v-col>

            <!-- login instead -->
            <v-col
              cols="12"
              class="text-center text-base pt-10"
            >
              <span class="text-disabled">Already have an account?</span>
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
                  <v-icon
                    class="font-weight-black"
                    color="red-darken-1"
                    size="x-large"
                  >
                    mdi-google
                  </v-icon>
                </v-btn>
                <v-btn
                  @click="signupWithFacebook"
                  color="blue-accent-3"
                  size="x-large"
                >
                  <v-icon
                    color="white"
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

