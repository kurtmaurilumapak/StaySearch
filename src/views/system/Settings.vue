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
  editedName: '',
  editedEmail: '',
  nameSnackbar: false,
  emailSnackbar: false,
  editingPassword: false,
  newPassword: '',
  confirmPassword: '',
  passwordSnackbar: false,
  newPasswordVisible: false,
  confirmPasswordVisible: false,
  picture: null,
});

const selectedFile = ref(null)

const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file; // Store the selected file for later use
  }
};

const handleUpdateProfilePicture = async () => {
  if (!selectedFile.value) {
    console.error("No file selected.");
    return;
  }

  userStore.formAction.formProcess = true;
  const pictureUrl = await userStore.uploadProfilePicture(selectedFile.value);
  userStore.formAction.formProcess = false;

  if (pictureUrl) {
    console.log("Profile picture updated successfully.");
    // Optionally update the local userStore's picture data here if needed
    userStore.userData.picture = pictureUrl;
    window.location.reload()
  } else {
    console.error("Failed to upload profile picture");
  }
};

onMounted(async () => {
  await userStore.fetchUserData()
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

const openEditDialog = (field) => {
  if (field === 'name') {
    userUpdate.value.editedName = userStore.userData.name
    userUpdate.value.editingName = true
  } else if (field === 'email') {
    userUpdate.value.editedEmail = userStore.userData.email
    userUpdate.value.editingEmail = true
  }
}

const handleUpdateUser = async () => {
  userStore.userData.name = userUpdate.value.editedName || userStore.userData.name
  userStore.userData.email = userUpdate.value.editedEmail
  if (userUpdate.value.picture) {
    userStore.userData.picture = userUpdate.value.picture
  }
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

const handleChangePassword = async () => {
  if (userUpdate.value.newPassword !== userUpdate.value.confirmPassword) {
    return; // Just in case the validation failed
  }

  userStore.formAction.formProcess = true;
  const passwordUpdated = await userStore.updatePassword(userUpdate.value.newPassword);
  userStore.formAction.formProcess = false;

  if (passwordUpdated) {
    userUpdate.value.passwordSnackbar = true;
    userUpdate.value.editingPassword = false;
  } else {
    console.error('Password update failed');
  }
};

const tab = ref('profile')

const validationRules = {
  nameRules: [v => !!v || 'New name is required'],
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

const isNameValid = computed(() => {
  return validationRules.nameRules.every(rule => rule(userUpdate.value.editedName) === true)
});

const isEmailValid = computed(() => {
  return validationRules.emailRules.every(rule => rule(userUpdate.value.editedEmail) === true);
});

const isPasswordValid = computed(() => {
  return userUpdate.value.newPassword &&
    userUpdate.value.confirmPassword &&
    userUpdate.value.newPassword === userUpdate.value.confirmPassword &&
    validationRules.passwordRules.every(rule => rule(userUpdate.value.newPassword) === true);
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
                      <h3>Profile Picture</h3>
                      <div class="d-flex justify-space-between align-center my-5">
                        <v-col cols="12" sm="6" md="5">
                          <v-avatar
                            size="350"
                          >
                            <v-img
                              width="55%"
                              class="mx-auto"
                              :src="imagePreview || userStore.userData.picture"
                              alt="Profile Picture Preview"
                              cover
                            ></v-img>
                          </v-avatar>
                        </v-col>

                        <v-col cols="12" sm="6" md="7">
                          <v-file-input
                            class="mt-5"
                            accept="image/png, image/jpeg, image/bmp"
                            label="Browse Profile Picture"
                            placeholder="Browse Profile Picture"
                            prepend-icon="mdi-camera"
                            show-size
                            chips
                            @change="onFileChange"
                          ></v-file-input>
                          <v-btn class="mt-2" color="red-darken-4" prepend-icon="mdi-image-edit" @click="handleUpdateProfilePicture" :disabled="!selectedFile">
                            Update Picture
                          </v-btn>
                        </v-col>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <h3>Name</h3>
                      <div class="d-flex justify-space-between align-center my-5">
                        <span>{{ userStore.userData.name }}</span>
                        <v-btn variant="outlined" class="text-none font-weight-bold px-8" @click="openEditDialog('name')">
                          Edit
                        </v-btn>
                      </div>
                    </v-col>
                    <v-divider></v-divider>
                    <v-col cols="12">
                      <h3>Email address</h3>
                      <div class="d-flex justify-space-between align-center my-5">
                        <span>{{ userStore.userData.email }}</span>
                        <v-btn variant="outlined" class="text-none font-weight-bold px-8" @click="openEditDialog('email')">
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
                          <v-btn
                            color="green"
                            variant="outlined"
                            class="text-none font-weight-bold"
                            @click="userUpdate.editingPassword = true"
                          >
                            Change
                          </v-btn>
                          <br>
                          <v-btn
                            color="red"
                            variant="outlined"
                            class="text-none font-weight-bold"
                            @click="userStore.resetPassword"
                          >
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
          <v-card-title><span class="headline">Edit User Information</span></v-card-title>
          <v-card-text>
            <v-text-field v-model="userUpdate.editedName" :rules="validationRules.name" label="First Name" variant="outlined"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="userStore.formAction.formProcess || !isNameValid" @click="handleUpdateUser">Save</v-btn>
            <v-btn @click="userUpdate.editingName = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="userUpdate.editingEmail" max-width="500px">
        <v-card>
          <v-card-title><span class="headline">Edit User Information</span></v-card-title>
          <v-card-text>
            <v-text-field v-model="userUpdate.editedEmail" :rules="validationRules.email" label="Email" variant="outlined"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" :disabled="userStore.formAction.formProcess || !isEmailValid" @click="handleUpdateUser">Save</v-btn>
            <v-btn @click="userUpdate.editingEmail = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="userUpdate.nameSnackbar" :timeout="3000" color="green-darken-4" elevation="24">
        <strong>Name updated successfully!</strong>
      </v-snackbar>
      <v-snackbar v-model="userUpdate.emailSnackbar" :timeout="3000" color="green-darken-4" elevation="24">
        <strong>Email confirmation has been sent!</strong>
      </v-snackbar>

      <v-dialog v-model="userUpdate.editingPassword" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Change Password</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              color="green"
              v-model="userUpdate.newPassword"
              label="New Password"
              :rules="validationRules.passwordRules"
              variant="outlined"
              :append-inner-icon="userUpdate.newPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="userUpdate.newPasswordVisible ? 'text' : 'password'"
              @click:append-inner="userUpdate.newPasswordVisible = !userUpdate.newPasswordVisible"
            ></v-text-field>

            <v-text-field
              color="green"
              v-model="userUpdate.confirmPassword"
              label="Confirm Password"
              :rules="[v => v === userUpdate.newPassword || 'Passwords must match']"
              variant="outlined"
              :append-inner-icon="userUpdate.confirmPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="userUpdate.confirmPasswordVisible ? 'text' : 'password'"
              @click:append-inner="userUpdate.confirmPasswordVisible = !userUpdate.confirmPasswordVisible"
            ></v-text-field>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="green"
              :disabled="userStore.formAction.formProcess || !isPasswordValid"
              @click="handleChangePassword"
            >
              Save
            </v-btn>
            <v-btn  color="red" @click="userUpdate.editingPassword = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="userUpdate.passwordSnackbar" :timeout="3000" color="green-darken-4" elevation="24">
        <strong>Password updated successfully!</strong>
      </v-snackbar>

      <v-snackbar v-if="userStore.formAction.formErrorMessage" :timeout="3000" color="red" elevation="24">
        <strong>Reset password failed.</strong>
      </v-snackbar>
      <v-snackbar v-if="userStore.formAction.formSuccessMessage" :timeout="3000" color="green-darken-4" elevation="24">
        <strong>Reset password link sent!</strong>
      </v-snackbar>

    </template>
  </AppLayout>
</template>



