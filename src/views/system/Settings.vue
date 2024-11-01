<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useTheme } from 'vuetify'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore';

const router = useRouter()
const theme = useTheme()
const userStore = useUserStore()

const userUpdate = ref({
  editingName: false,
  editingEmail: false,
  editedFirstname: '',
  editedLastname: '',
  editedEmail: '',
  nameSnackbar: false,
  emailSnackbar: false,
})


onMounted(async () => {
  await userStore.fetchUserData()
  console.log(userStore.userData)
  theme.global.name.value = userStore.userData.theme
})

watch(() => userStore.userData.theme, async (newTheme) => {
  theme.global.name.value = newTheme;
  await userStore.updateTheme(newTheme)
});

const userPage = async () => {
  await userStore.fetchUserData()
  const userRole = userStore.userData.role
  if (userRole === 'student') {
    await router.push('/student/page')
  } else if (userRole === 'owner') {
    await router.push('/owner/dashboard')
  } else {
    console.error("No user found")
  }
}

const openNameEditDialog = () => {
  userUpdate.value.editedFirstname = userStore.userData.firstname
  userUpdate.value.editedLastname = userStore.userData.lastname
  userUpdate.value.editingName = true
};

const openEmailEditDialog = () => {
  userUpdate.value.editedEmail = userStore.userData.email
  userUpdate.value.editingEmail = true
};

const handleUpdateUser = async () => {
  userStore.userData.firstname = userUpdate.value.editedFirstname || userStore.userData.firstname
  userStore.userData.lastname = userUpdate.value.editedLastname || userStore.userData.lastname
  userStore.userData.email = userUpdate.value.editedEmail

  userStore.formAction.formProcess = true
  const updateSuccessful = await userStore.updateUser();
  userStore.formAction.formProcess = false

  if (updateSuccessful) {
    if (userUpdate.value.editingName) {
      userUpdate.value.nameSnackbar = true;
    }
    if (userUpdate.value.editingEmail) {
      userUpdate.value.emailSnackbar = true;
    }
  }
  userUpdate.value.editingName = false
  userUpdate.value.editingEmail = false
}

const tab = ref('profile')

const firstnameRules = [
  v => !!v || 'First name is required',
]
const lastnameRules = [
  v => !!v || 'Last name is required',
]
const emailRules = [
  v => !!v || 'Email is required',
  v => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v) || 'Invalid email format',
]

const isNameValid = computed(() => {
  return firstnameRules.every(rule => rule(userUpdate.value.editedFirstname) === true) && lastnameRules.every(rule => rule(userUpdate.value.editedLastname) === true)

});

const isEmailValid = computed(() => {
  return emailRules.every(rule => rule(userUpdate.value.editedEmail) === true);
});
</script>


<template>
  <AppLayout>
    <template #content>
      <v-app-bar
        density="comfortable"
      >
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
      </v-app-bar>
      <v-card
        :elevation="0"
        style="border-radius: 0"
      >
        <div class="d-flex flex-row">
          <v-tabs
            class="d-none d-sm-flex"
            v-model="tab"
            color="green-darken-3"
            direction="vertical"

          >
            <v-tab class="d-flex py-7 text-overline" prepend-icon="mdi-account-circle" text="Your Account" value="profile"></v-tab>
            <v-tab class="d-flex py-7 text-overline" prepend-icon="mdi-lock" text="Login & Security" value="security"></v-tab>
            <v-tab class="d-flex py-7 text-overline" prepend-icon="mdi-theme-light-dark" text="Theme" value="theme"></v-tab>
          </v-tabs>

          <v-tabs-window v-model="tab" style="width: 100%">
            <v-tabs-window-item value="profile">
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" >
                      <h2>Your Account</h2>
                    </v-col>
                    <v-col cols="12">
                      <h3>Name</h3>
                      <div class="d-flex justify-space-between align-center my-5">
                        <span>{{ userStore.userData.firstname }} {{ userStore.userData.lastname }}</span>
                        <v-btn variant="outlined" class="text-none font-weight-bold px-8" @click="openNameEditDialog">
                          Edit
                        </v-btn>
                      </div>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col cols="12">
                      <h3>Email address</h3>
                      <div class="d-flex justify-space-between align-center my-5">
                        <span>{{ userStore.userData.email }}</span>
                        <v-btn variant="outlined" class="text-none font-weight-bold px-8" @click="openEmailEditDialog">
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
              <v-card flat>
                <v-card-text>
                  <v-row>
                    <v-col cols="12">
                      <h2>Login & Security</h2>
                      <br>
                    </v-col>
                    <v-col cols="12" >
                      <v-row class="d-flex border rounded-lg py-8 px-5 ga-5">
                        <v-col cols="2" class="d-flex justify-center">
                          <v-icon class="border rounded-lg py-8 px-8" size="xx-large">
                            mdi-lock
                          </v-icon>
                        </v-col>
                        <v-col>
                          <h3>Password</h3>
                          <div class="d-flex justify-space-between align-center my-5">
                            <p>To add a password to your account for the first time, you will need to use the password reset button so we can verify your identity.</p>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="2" class="d-flex flex-sm-column ga-2">
                          <v-btn variant="outlined" class="text-none font-weight-bold">
                            Change
                          </v-btn>
                          <br>
                          <v-btn variant="outlined" class="text-none font-weight-bold">
                            Reset
                          </v-btn>
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
                  <v-row>
                    <v-col cols="12">
                      <h2>Theme</h2>
                      <br>
                      <h3>Choose how you’d like StaySearch to appear. Select a theme.</h3>
                    </v-col>
                    <v-col cols="12" class="d-flex border rounded-lg py-8 px-5 ga-5">
                      <v-radio-group v-model="userStore.userData.theme">
                        <v-radio label="Light" value="light"></v-radio>
                        <v-radio label="Dark" value="dark"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-card>

      <v-dialog v-model="userUpdate.editingName" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">Edit User Information</span>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="userUpdate.editedFirstname"
                :rules="firstnameRules"
                label="First Name"
                variant="outlined"
              ></v-text-field>
              <v-text-field
                v-model="userUpdate.editedLastname"
                :rules="lastnameRules"
                label="Last Name"
                variant="outlined"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                :disabled="userStore.formAction.formProcess || !isNameValid"
                @click="handleUpdateUser"
              >
                Save
              </v-btn>
              <v-btn @click="userUpdate.editingName = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
      </v-dialog>

      <v-dialog v-model="userUpdate.editingEmail" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit User Information</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="userUpdate.editedEmail"
              :rules="emailRules"
              label="Email"
              variant="outlined"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="handleUpdateUser"
              :disabled="userStore.formAction.formProcess || !isEmailValid"
            >
              Save
            </v-btn>
            <v-btn @click="userUpdate.editingEmail = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="userUpdate.editingEmail" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Edit User Information</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="userUpdate.editedEmail"
              :rules="emailRules"
              label="Email"
              variant="outlined"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="primary"
              @click="handleUpdateUser"
              :disabled="userStore.formAction.formProcess || !isEmailValid"
            >
              Save
            </v-btn>
            <v-btn @click="userUpdate.editingEmail = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar
        v-model="userUpdate.nameSnackbar"
        :timeout="3000"
        color="green-darken-4"
        elevation="24"
      >
        <strong>Name updated successfully!</strong>.
      </v-snackbar>
      <v-snackbar
        v-model="userUpdate.emailSnackbar"
        :timeout="3000"
        color="green-darken-4"
        elevation="24"
      >
        <strong>Email confirmation has been sent!</strong>.
      </v-snackbar>

    </template>
  </AppLayout>
</template>



