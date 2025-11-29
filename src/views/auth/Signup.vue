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
  const { data, error } = await authStore.signUp();
  
  if (!error && data) {
    // Successful signup
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
      <div class="signup-container">
        <!-- Left Side - Form Section -->
        <div class="left-section">
          <div class="form-background">
            <div class="bg-circle bg-circle-1"></div>
            <div class="bg-circle bg-circle-2"></div>
          </div>

          <div class="form-wrapper">
            <div class="form-header">
              <RouterLink
                style="text-decoration: none; color: inherit;"
                to="/"
                class="logo-section"
              >
                <div class="logo-wrapper">
                  <img
                    src="@/assets/logo.png"
                    alt="Logo"
                    width="50"
                    height="50"
                  />
                </div>
                <h2 class="brand-title">
                  Stay<span class="highlight">Search</span>
                </h2>
              </RouterLink>

              <div class="header-content">
                <h1 class="form-title">Adventure starts here 🚀</h1>
                <p class="form-subtitle">Make your search for boarding houses easy and fast!</p>
              </div>
            </div>

            <v-form
              ref="form"
              class="signup-form"
              @submit.prevent="onFormSubmit"
            >
              <AlertNotification
                :form-success-message="authStore.formAction.formSuccessMessage"
                :form-error-message="authStore.formAction.formErrorMessage"
                class="mb-4"
              />

              <!-- Role Selection -->
              <div class="form-group role-selection">
                <label class="form-label">I am a</label>
                <v-btn-toggle
                  v-model="authStore.formData.role"
                  class="role-toggle"
                  color="green-darken-1"
                  mandatory
                  rounded="lg"
                  density="comfortable"
                >
                  <v-btn value="student" class="role-btn">
                    <v-icon class="mr-2">mdi-school</v-icon>
                    Student
                  </v-btn>
                  <v-btn value="owner" class="role-btn">
                    <v-icon class="mr-2">mdi-home-account</v-icon>
                    House Owner
                  </v-btn>
                </v-btn-toggle>
              </div>

              <!-- Name Fields -->
              <div class="name-group">
                <div class="form-group half-width">
                  <label class="form-label">First Name</label>
                  <v-text-field
                    v-model="authStore.formData.firstname"
                    placeholder="John"
                    variant="outlined"
                    color="green-darken-1"
                    density="comfortable"
                    prepend-inner-icon="mdi-account-outline"
                    class="modern-input"
                    :rules="validationRules.firstnameRules"
                    @input="capitalizeFirstLetter('firstname')"
                    hide-details="auto"
                  />
                </div>

                <div class="form-group half-width">
                  <label class="form-label">Last Name</label>
                  <v-text-field
                    v-model="authStore.formData.lastname"
                    placeholder="Doe"
                    variant="outlined"
                    color="green-darken-1"
                    density="comfortable"
                    prepend-inner-icon="mdi-account-outline"
                    class="modern-input"
                    :rules="validationRules.lastnameRules"
                    @input="capitalizeFirstLetter('lastname')"
                    hide-details="auto"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <v-text-field
                  v-model="authStore.formData.email"
                  placeholder="johndoe@email.com"
                  variant="outlined"
                  color="green-darken-1"
                  density="comfortable"
                  prepend-inner-icon="mdi-email-outline"
                  type="email"
                  class="modern-input"
                  :rules="validationRules.emailRules"
                  hide-details="auto"
                />
              </div>

              <!-- Password -->
              <div class="form-group">
                <label class="form-label">Password</label>
                <v-text-field
                  v-model="authStore.formData.password"
                  placeholder="Create a strong password"
                  variant="outlined"
                  color="green-darken-1"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="visible ? 'text' : 'password'"
                  @click:append-inner="visible = !visible"
                  class="modern-input"
                  :rules="validationRules.passwordRules"
                  hide-details="auto"
                />
              </div>

              <!-- Password Requirements -->
              <div class="password-hints">
                <p class="hint-title">Password must contain:</p>
                <div class="hints-grid">
                  <span :class="['hint', authStore.formData.password?.length >= 8 ? 'valid' : '']">
                    <v-icon size="16">{{ authStore.formData.password?.length >= 8 ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                    8+ characters
                  </span>
                  <span :class="['hint', /[A-Z]/.test(authStore.formData.password) ? 'valid' : '']">
                    <v-icon size="16">{{ /[A-Z]/.test(authStore.formData.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                    Uppercase
                  </span>
                  <span :class="['hint', /[a-z]/.test(authStore.formData.password) ? 'valid' : '']">
                    <v-icon size="16">{{ /[a-z]/.test(authStore.formData.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                    Lowercase
                  </span>
                  <span :class="['hint', /[0-9]/.test(authStore.formData.password) ? 'valid' : '']">
                    <v-icon size="16">{{ /[0-9]/.test(authStore.formData.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                    Number
                  </span>
                  <span :class="['hint', /[^\w\s]/.test(authStore.formData.password) ? 'valid' : '']">
                    <v-icon size="16">{{ /[^\w\s]/.test(authStore.formData.password) ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                    Special char
                  </span>
                </div>
              </div>

              <!-- Submit Button -->
              <v-btn
                :loading="authStore.formAction.formProcess"
                :disabled="authStore.formAction.formProcess || !isFormValid"
                type="submit"
                class="signup-btn"
                size="large"
                block
                rounded="lg"
              >
                <v-icon class="mr-2">mdi-rocket-launch</v-icon>
                Create Account
              </v-btn>

              <!-- Login Link -->
              <div class="login-section">
                <span class="login-text">Already have an account?</span>
                <RouterLink
                  to="login"
                  class="login-link"
                >
                  Sign in instead
                </RouterLink>
              </div>
            </v-form>
          </div>
        </div>

        <!-- Right Side - Visual Section -->
        <div class="right-section">
          <div class="visual-background">
            <div class="gradient-overlay"></div>
            <div class="floating-shapes">
              <div class="shape shape-1"></div>
              <div class="shape shape-2"></div>
              <div class="shape shape-3"></div>
              <div class="shape shape-4"></div>
              <div class="shape shape-5"></div>
            </div>
          </div>
          
          <div class="visual-content">
            <div class="illustration-wrapper">
              <div class="stats-card card-1">
                <div class="stat-icon">
                  <v-icon color="white" size="32">mdi-home-city</v-icon>
                </div>
                <div class="stat-info">
                  <h3>500+</h3>
                  <p>Properties Listed</p>
                </div>
              </div>

              <div class="stats-card card-2">
                <div class="stat-icon">
                  <v-icon color="white" size="32">mdi-account-group</v-icon>
                </div>
                <div class="stat-info">
                  <h3>1000+</h3>
                  <p>Happy Students</p>
                </div>
              </div>

              <div class="stats-card card-3">
                <div class="stat-icon">
                  <v-icon color="white" size="32">mdi-star</v-icon>
                </div>
                <div class="stat-info">
                  <h3>4.8/5</h3>
                  <p>Average Rating</p>
                </div>
              </div>
            </div>

            <div class="welcome-message">
              <h2 class="visual-title">Join Our Community</h2>
              <p class="visual-text">
                Thousands of students have already found their perfect home through StaySearch. 
                Start your journey today and discover quality accommodations near your campus.
              </p>
              
              <div class="benefits-list">
                <div class="benefit-item">
                  <v-icon color="white">mdi-check-circle</v-icon>
                  <span>Verified listings only</span>
                </div>
                <div class="benefit-item">
                  <v-icon color="white">mdi-check-circle</v-icon>
                  <span>Safe and secure platform</span>
                </div>
                <div class="benefit-item">
                  <v-icon color="white">mdi-check-circle</v-icon>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.signup-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left Section - Form */
.left-section {
  flex: 0 0 600px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
}

.form-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.08), rgba(129, 199, 132, 0.04));
  animation: pulse 8s ease-in-out infinite;
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
  animation-delay: 2s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.form-wrapper {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 2;
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(76, 175, 80, 0.1);
}

.form-header {
  margin-bottom: 2rem;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  transition: transform 0.3s ease;
}

.logo-section:hover {
  transform: translateX(5px);
}

.logo-wrapper {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  padding: 0.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
}

.highlight {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-content {
  text-align: center;
}

.form-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.form-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.9rem;
}

.role-selection {
  text-align: center;
}

.role-toggle {
  width: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.role-btn {
  flex: 1;
  text-transform: none;
  font-weight: 600;
}

.name-group {
  display: flex;
  gap: 1rem;
}

.half-width {
  flex: 1;
}

.modern-input {
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.modern-input :deep(.v-field) {
  border-radius: 12px;
  background: #f8fafc;
  transition: all 0.3s ease;
}

.modern-input :deep(.v-field--focused) {
  background: white;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.modern-input :deep(.v-field:hover) {
  background: white;
}

.password-hints {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 12px;
  margin-top: -0.5rem;
}

.hint-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.hints-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #999;
  transition: all 0.3s ease;
}

.hint.valid {
  color: #4CAF50;
}

.hint .v-icon {
  transition: all 0.3s ease;
}

.signup-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A) !important;
  color: white;
  font-weight: 600;
  text-transform: none;
  margin-top: 0.5rem;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.signup-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(76, 175, 80, 0.4);
}

.signup-btn:disabled {
  opacity: 0.6;
}

.login-section {
  text-align: center;
  margin-top: 0.5rem;
}

.login-text {
  color: #666;
  font-size: 0.95rem;
}

.login-link {
  color: #4CAF50;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.login-link:hover {
  color: #388E3C;
  text-decoration: underline;
}

/* Right Section - Visual */
.right-section {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow: hidden;
}

.visual-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(76, 175, 80, 0.95) 0%, 
    rgba(129, 199, 132, 0.85) 50%, 
    rgba(102, 187, 106, 0.95) 100%
  );
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  animation: float 8s ease-in-out infinite;
}

.shape-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  right: 30%;
  animation-delay: 4s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}

.shape-5 {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 50%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(5deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(-5deg);
  }
}

.visual-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  color: white;
}

.illustration-wrapper {
  position: relative;
  margin-bottom: 3rem;
  height: 300px;
}

.stats-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: float-card 6s ease-in-out infinite;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card-1 {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.card-2 {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation-delay: 2s;
}

.card-3 {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 4s;
}

@keyframes float-card {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-info h3 {
  font-size: 1.75rem;
  font-weight: 800;
  margin: 0 0 0.25rem 0;
}

.stat-info p {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.welcome-message {
  text-align: center;
}

.visual-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.visual-text {
  font-size: 1.1rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.benefit-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(-10px);
}

.benefit-item span {
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .signup-container {
    flex-direction: column;
  }

  .left-section {
    flex: 1;
    order: 2;
  }

  .right-section {
    flex: 0 0 400px;
    order: 1;
  }

  .illustration-wrapper {
    display: none;
  }
}

@media (max-width: 600px) {
  .left-section,
  .right-section {
    padding: 1.5rem;
  }

  .form-wrapper {
    padding: 2rem;
  }

  .name-group {
    flex-direction: column;
  }

  .visual-title {
    font-size: 2rem;
  }

  .right-section {
    flex: 0 0 300px;
  }

  .benefits-list {
    display: none;
  }
}
</style>