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
      <div class="login-container">
        <!-- Left Side - Visual Section -->
        <div class="left-section">
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
            <RouterLink
              style="text-decoration: none; color: inherit;"
              to="/"
              class="logo-section"
            >
              <div class="logo-wrapper">
                <img
                  src="@/assets/logo.png"
                  alt="Logo"
                  width="60"
                  height="60"
                />
              </div>
              <h1 class="brand-title">
                Stay<span class="highlight">Search</span>
              </h1>
            </RouterLink>

            <div class="welcome-content">
              <h2 class="welcome-title">
                Welcome Back! 👋
              </h2>
              <p class="welcome-text">
                Sign in to continue your journey in finding the perfect campus home.
              </p>
              
              <div class="feature-list">
                <div class="feature-item">
                  <div class="feature-icon">
                    <v-icon color="white" size="24">mdi-home-search</v-icon>
                  </div>
                  <div class="feature-text">
                    <h4>Browse Properties</h4>
                    <p>Explore hundreds of verified listings</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <v-icon color="white" size="24">mdi-map-marker</v-icon>
                  </div>
                  <div class="feature-text">
                    <h4>Prime Locations</h4>
                    <p>Find homes near your campus</p>
                  </div>
                </div>
                <div class="feature-item">
                  <div class="feature-icon">
                    <v-icon color="white" size="24">mdi-shield-check</v-icon>
                  </div>
                  <div class="feature-text">
                    <h4>Secure & Trusted</h4>
                    <p>Safe and verified accommodations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side - Form Section -->
        <div class="right-section">
          <div class="form-wrapper">
            <div class="form-header">
              <h2 class="form-title">Sign In</h2>
              <p class="form-subtitle">Enter your credentials to access your account</p>
            </div>

            <v-form
              ref="form"
              class="login-form"
              @submit.prevent="onLogin"
            >
              <AlertNotification
                :form-success-message="authStore.formAction.formSuccessMessage"
                :form-error-message="authStore.formAction.formErrorMessage"
                class="mb-4"
              />

              <div class="form-group">
                <label class="form-label">Email Address</label>
                <v-text-field
                  v-model="authStore.formData.email"
                  placeholder="johndoe@email.com"
                  variant="outlined"
                  color="green-darken-1"
                  density="comfortable"
                  prepend-inner-icon="mdi-email-outline"
                  class="modern-input"
                  hide-details="auto"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Password</label>
                <v-text-field
                  v-model="authStore.formData.password"
                  placeholder="Enter your password"
                  variant="outlined"
                  color="green-darken-1"
                  density="comfortable"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="visible ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="visible ? 'text' : 'password'"
                  @click:append-inner="visible = !visible"
                  class="modern-input"
                  hide-details="auto"
                />
              </div>

              <v-btn
                :loading="authStore.formAction.formProcess"
                type="button"
                @click="onLogin"
                class="login-btn"
                size="large"
                block
                rounded="lg"
              >
                <v-icon class="mr-2">mdi-login</v-icon>
                Sign In
              </v-btn>

              <div class="divider-section">
                <v-divider />
                <span class="divider-text">OR CONTINUE WITH</span>
                <v-divider />
              </div>

              <v-btn
                @click="authStore.signInWithGoogle"
                class="google-btn"
                size="large"
                block
                rounded="lg"
                variant="outlined"
              >
                <img
                  src="../../assets/auth/google.png"
                  alt="Google"
                  width="24"
                  height="24"
                  class="google-icon"
                />
                Continue with Google
              </v-btn>

              <div class="signup-section">
                <span class="signup-text">Don't have an account?</span>
                <RouterLink
                  to="signup"
                  class="signup-link"
                >
                  Create one now
                </RouterLink>
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Left Section - Visual */
.left-section {
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
  left: 5%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 60%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 70%;
  left: 10%;
  animation-delay: 4s;
}

.shape-4 {
  width: 180px;
  height: 180px;
  top: 30%;
  left: 70%;
  animation-delay: 1s;
}

.shape-5 {
  width: 120px;
  height: 120px;
  bottom: 10%;
  right: 20%;
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

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  transition: transform 0.3s ease;
}

.logo-section:hover {
  transform: translateX(5px);
}

.logo-wrapper {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.brand-title {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin: 0;
}

.highlight {
  color: #FFD54F;
}

.welcome-content {
  margin-bottom: 3rem;
}

.welcome-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.welcome-text {
  font-size: 1.25rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(10px);
}

.feature-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-text h4 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  font-size: 1.1rem;
}

.feature-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

/* Right Section - Form */
.right-section {
  flex: 0 0 550px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
}

/* Decorative Elements */
.right-section::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(129, 199, 132, 0.05));
  border-radius: 50%;
  z-index: 1;
  animation: pulse 8s ease-in-out infinite;
}

.right-section::after {
  content: '';
  position: absolute;
  bottom: -150px;
  left: -150px;
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, rgba(102, 187, 106, 0.08), rgba(76, 175, 80, 0.03));
  border-radius: 50%;
  z-index: 1;
  animation: pulse 10s ease-in-out infinite reverse;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.form-wrapper {
  width: 100%;
  max-width: 450px;
  position: relative;
  z-index: 2;
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(76, 175, 80, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.form-wrapper:hover {
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(76, 175, 80, 0.2);
  transform: translateY(-5px);
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
  position: relative;
}

.form-header::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  border-radius: 2px;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.form-subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 0.95rem;
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

.login-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A) !important;
  color: white;
  font-weight: 600;
  text-transform: none;
  margin-top: 0.5rem;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(76, 175, 80, 0.4);
}

.divider-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
}

.divider-text {
  color: #999;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.google-btn {
  border: 2px solid #e2e8f0;
  color: #1a1a1a;
  font-weight: 600;
  text-transform: none;
  background: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.google-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.05), transparent);
  transition: left 0.5s ease;
}

.google-btn:hover::before {
  left: 100%;
}

.google-btn:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.02);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.google-icon {
  margin-right: 0.75rem;
}

.signup-section {
  text-align: center;
  margin-top: 1rem;
}

.signup-text {
  color: #666;
  font-size: 0.95rem;
}

.signup-link {
  color: #4CAF50;
  font-weight: 600;
  text-decoration: none;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: #388E3C;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }

  .left-section {
    flex: 0 0 auto;
    min-height: 300px;
    padding: 2rem;
  }

  .right-section {
    flex: 1;
    box-shadow: none;
  }

  .welcome-title {
    font-size: 2rem;
  }

  .feature-list {
    display: none;
  }

  .visual-content {
    text-align: center;
  }

  .logo-section {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .left-section,
  .right-section {
    padding: 1.5rem;
  }

  .form-wrapper {
    max-width: 100%;
  }

  .welcome-title {
    font-size: 1.75rem;
  }

  .brand-title {
    font-size: 1.5rem;
  }
}

/* Smooth transitions */
* {
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>