<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const visible = ref(false)
const router = useRouter()


const validationRules = {
  firstnameRules: [v => !!v || 'First name is required'],
  lastnameRules: [v => !!v || 'Last name is required'],
  emailRules: [
    v => !!v || 'Email is required',
    v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Invalid email format',
  ],
  passwordRules: [
    v => !!v || 'Password is required',
    v => v.length >= 8 || 'Password must be at least 8 characters long',
    v => /[a-z]/.test(v) || 'Password must contain at least one lowercase letter',
    v => /[A-Z]/.test(v) || 'Password must contain at least one uppercase letter',
    v => /[0-9]/.test(v) || 'Password must contain at least one number',
    v => /[^\w\s]/.test(v) || 'Password must contain at least one special character',
  ]
}

const isFormValid = computed(() => {
  return (
    validationRules.firstnameRules.every(rule => rule(authStore.formData.firstname) === true) &&
    validationRules.lastnameRules.every(rule => rule(authStore.formData.lastname) === true) &&
    validationRules.emailRules.every(rule => rule(authStore.formData.email) === true) &&
    validationRules.passwordRules.every(rule => rule(authStore.formData.password) === true)
  )
})

const capitalizeFirstLetter = (field) => {
  if (authStore.formData[field]) {
    authStore.formData[field] = authStore.formData[field].charAt(0).toUpperCase() + authStore.formData[field].slice(1).toLowerCase()
  }
}

const onFormSubmit = async () => {
  authStore.formAction.formErrorMessage = '';
  authStore.formAction.formSuccessMessage = '';

  await authStore.signUp();
  if (!authStore.formAction.formErrorMessage) {
    if (authStore.formData.role === 'student') {
      await router.push('/student/page')
    }
    else if (authStore.formData.role === 'owner') {
      await router.push('/owner/dashboard')
    }
    authStore.resetForm();
  }
}
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
              src="@/assets/auth/signup.png"
              alt="background"
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
              <div class="d-flex align-end text-white cursor-default">
                <h1 class="mb-1">
                  Adventure starts here
                </h1>
                <h1 class="text-h2 float">🚀</h1>
              </div>
              <p class="mb-0 text-white cursor-default">
                Make your search for boarding houses easy and fast!
              </p>
            </v-card-text>
            <v-form
              ref="form"
              class="pb-8"
              style="background-color: white; margin-left: 5%; margin-right: 5%; margin-bottom: 5%; border-radius: 20px"
            >
              <v-row no-gutters>
                <v-col cols="12" class="px-10 mt-4">
                  <AlertNotification
                    :form-success-message="authStore.formAction.formSuccessMessage"
                    :form-error-message="authStore.formAction.formErrorMessage"
                  >
                  </AlertNotification>
                </v-col>
                <!-- User Type -->
                <v-col
                  cols="12"
                  class="d-flex justify-center py-5"
                >
                  <v-btn-toggle
                    v-model="authStore.formData.role"
                    class="my-auto border"
                    color="green-darken-1"
                    mandatory
                    density="comfortable"
                  >
                    <v-btn value="student" style="flex: 1;">Student</v-btn>
                    <v-btn value="owner" style="flex: 1;">House Owner</v-btn>
                  </v-btn-toggle>
                </v-col>
                <!-- Name -->
                <v-col cols="6">
                  <v-text-field
                    class="pl-10 pr-1"
                    color="green-darken-1"
                    v-model="authStore.formData.firstname"
                    label="First Name"
                    placeholder="John"
                    variant="outlined"
                    :rules="validationRules.firstnameRules"
                    @input="capitalizeFirstLetter('firstname')"
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    class="pr-10 pl-1"
                    color="green-darken-1"
                    v-model="authStore.formData.lastname"
                    label="Last Name"
                    placeholder="Doe"
                    variant="outlined"
                    :rules="validationRules.lastnameRules"
                    @input="capitalizeFirstLetter('lastname')"
                  />
                </v-col>

                <!-- email -->
                <v-col cols="12">
                  <v-text-field
                    class="px-10"
                    color="green-darken-1"
                    v-model="authStore.formData.email"
                    label="Email"
                    placeholder="johndoe@email.com"
                    type="email"
                    variant="outlined"
                    :rules="validationRules.emailRules"
                  />
                </v-col>

                <!-- password -->
                <v-col cols="12">
                  <v-text-field
                    class="px-10"
                    color="green-darken-1"
                    v-model="authStore.formData.password"
                    label="Password"
                    placeholder="············"
                    variant="outlined"
                    :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="visible ? 'text' : 'password'"
                    @click:append-inner="visible = !visible"
                    :rules="validationRules.passwordRules"
                  />
                </v-col>
                <v-col cols="12" class="text-center pt-5">
                  <v-btn
                    :loading="authStore.formAction.formProcess"
                    color="green-darken-1"
                    width="50%"
                    type="submit"
                    :disabled="authStore.formAction.formProcess || !isFormValid"
                    @click="onFormSubmit"
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
                  <span class="mx-4 text-overline">or</span>
                  <v-divider />
                </v-col>

                <!-- auth providers -->
                <v-col
                  cols="12"
                  class="text-center pt-5"
                >
                  <v-btn
                    class="text-none font-weight-bold px-7"
                    @click="signupWithGoogle"
                    size="large"
                    rounded="lg"

                  >
                    <img
                      style="pointer-events: none; margin-right: 10px"
                      src="../../assets/auth/google.png"
                      alt="Google Icon"
                      height="28"
                      width="28"
                    />
                    Continue with Google
                  </v-btn>
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