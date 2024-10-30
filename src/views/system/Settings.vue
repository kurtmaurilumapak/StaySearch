<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'vue-router'

const router = useRouter()

const userDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
}
const userData = ref({ ...userDataDefault })

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    userData.value.firstname = session.user.user_metadata.firstname || 'No firstname available'
    userData.value.lastname = session.user.user_metadata.lastname || 'No lastname available'
    userData.value.email = session.user.email || 'No email available'
  }
})

const userPage = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  const userRole = session?.user?.user_metadata?.role;

  if (userRole === 'student') {
    await router.push('/student/page')
  } else if (userRole === 'owner') {
    await router.push('/owner/dashboard')
  } else {

    console.error("No user found");
  }
}

const tab = ref('profile')

</script>


<template>
  <AppLayout>
    <template #content>
      <v-card
        style="height: 100vh; border-radius: 0px"
      >
        <v-toolbar color="white" >
          <div
            style="text-decoration: none;color: inherit;"
            class="d-flex align-center ga-1 my-5 ml-5 cursor-pointer"
            @click="userPage"
          >
            <img
              src="../../assets/logo.png"
              alt="Logo"
              width="30"
              height="30"
            />
            <h2 class="font-weight-bold">
              StaySearch
            </h2>
          </div>
        </v-toolbar>

        <v-divider></v-divider>

        <div class="d-flex flex-row">
          <v-tabs
            v-model="tab"
            color="green-darken-3"
            direction="vertical"

          >
            <v-tab class="d-flex py-7 text-overline" prepend-icon="mdi-account-circle" text="Your Account" value="profile"></v-tab>
            <v-tab class="d-flex py-7 text-overline" prepend-icon="mdi-lock" text="Login & Security" value="security"></v-tab>
            <v-tab class="d-flex py-7 text-overline" prepend-icon="mdi-theme-light-dark" text="Theme" value="theme"></v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="profile">
              <v-card flat width="45vw">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" >
                      <h2>Your Account</h2>
                    </v-col>
                    <v-col cols="12">
                      <h3>Name</h3>
                      <div class="d-flex justify-space-between align-center my-5">
                        <span>{{ userData.firstname }} {{ userData.lastname }}</span>
                        <v-btn class="text-none font-weight-bold px-8">
                          Edit
                        </v-btn>
                      </div>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col cols="12">
                      <h3>Email address</h3>
                      <div class="d-flex justify-space-between align-center my-5">
                        <span>{{ userData.email }}</span>
                        <v-btn class="text-none font-weight-bold px-8">
                          Edit
                        </v-btn>
                      </div>
                    </v-col>
                    <v-divider></v-divider>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>

            <v-tabs-window-item value="security">
              <v-card flat width="45vw">
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <h2>Login & Security</h2>
                      <br>
                      <h3>Login</h3>
                    </v-col>
                    <v-col cols="12" class="d-flex border rounded-lg py-8 px-5 ga-5">
                      <v-row>
                        <v-col cols="2" class="d-flex justify-center">
                          <v-icon class="border rounded-lg py-10 px-10" size="xxx-large">
                            mdi-lock
                          </v-icon>
                        </v-col>
                        <v-col>
                          <h3>Password</h3>
                          <div class="d-flex justify-space-between align-center my-5">
                            <p>To add a password to your account for the first time, you will need to use the password reset button so we can verify your identity.</p>
                          </div>
                        </v-col>
                        <v-col cols="2" class="d-flex flex-column">
                          <v-btn class="text-none font-weight-bold">
                            Change
                          </v-btn>
                          <br>
                          <v-btn class="text-none font-weight-bold">
                            Reset
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12">
                      <br>
                      <h3>Security</h3>
                    </v-col>
                    <v-col cols="12" class="d-flex border rounded-lg py-8 px-5">
                      <v-row>
                        <v-col cols="2" class="d-flex justify-center">
                          <v-icon class="border rounded-lg py-10 px-10" size="xxx-large">
                            mdi-security
                          </v-icon>
                        </v-col>
                        <v-col>
                          <h3>Sign out from all devices</h3>
                          <div class="mt-5">
                            <p>Logged in on a shared device but forgot to sign out? End all sessions by signing out from all devices.</p>
                            <v-btn class="mt-10 text-none font-weight-bold px-8">
                              Sign out from all device
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" class="d-flex border rounded-lg py-8 px-5 mt-5">
                      <v-row>
                        <v-col cols="2" class="d-flex justify-center">
                          <v-icon class="border rounded-lg py-10 px-10" size="xxx-large">
                            mdi-delete
                          </v-icon>
                        </v-col>
                        <v-col>
                          <h3>Delete your account</h3>
                          <div class="mt-5">
                            <p>By deleting your account, you’ll no longer be able to access any of your designs or log in to StaySearch. Your StaySearch account was created at time month day, year.</p>
                            <v-btn class="mt-10 text-none font-weight-bold px-8">
                              Delete account
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>

            <v-tabs-window-item value="theme">
              <v-card flat>
                <v-card-text>

                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-card>
    </template>
  </AppLayout>
</template>



