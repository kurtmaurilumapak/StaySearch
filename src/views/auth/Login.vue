<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import AlertNotification from '@/components/common/AlertNotification.vue'

const router = useRouter()
const authStore = useAuthStore()

const visible = ref(false)

const onLogin = async () => {
  authStore.formAction.formErrorMessage = ''
  authStore.formAction.formSuccessMessage = ''

  const { data, error } = await authStore.signIn()
  window.location.reload();
  if (!error) {
    const role = data.user.user_metadata.role

    if (role === 'student') {
      await router.push('/student/page')
    } else if (role === 'owner') {
      await router.push('/owner/dashboard')
    }
    authStore.resetForm();
  } else {
    authStore.formAction.formErrorMessage = error.message
  }
  authStore.formAction.formProcess = false
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
                <h1 class="mb-1" style="font-size: 26px;">
                  Welcome to StaySearch!
                </h1>
                <p class="text-h2 float">👋🏻</p>
              </div>

              <p class="mb-0 text-white cursor-default">
                Please sign-in to your account and start searching.
              </p>
            </v-card-text>
            <v-form
              ref="form"
              style="background-color: white; margin-left: 5%; margin-right: 5%; padding-bottom: 5%; border-radius: 20px"
              @submit.prevent="onLogin"
            >
              <v-row no-gutters>
                <v-col cols="12" class="px-10 mt-4">
                  <AlertNotification
                    :form-success-message="authStore.formAction.formSuccessMessage"
                    :form-error-message="authStore.formAction.formErrorMessage"
                  >
                  </AlertNotification>
                </v-col>

                <!-- Email -->
                <v-col cols="12" class="pt-5">
                  <v-text-field
                    class="px-10"
                    color="green-darken-1"
                    v-model="authStore.formData.email"
                    label="Email"
                    placeholder="johndoe@email.com"
                    variant="outlined"
                  />
                </v-col>
                <!-- password -->
                <v-col cols="12" class="text-center">
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
                  />
                </v-col>
                <v-col cols="12" class="text-center pt-5">
                  <v-btn
                    :loading="authStore.formAction.formProcess"
                    color="green-darken-1"
                    width="50%"
                    type="button"
                    @click="onLogin"
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
                  <v-btn
                    class="text-none font-weight-bold px-7"
                    @click="authStore.signInWithGoogle"
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