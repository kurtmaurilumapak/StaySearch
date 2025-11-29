<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import hero from '@/assets/landing/hero.png'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { LMap, LTileLayer, LMarker, LTooltip } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"
import { useMapStore } from '@/stores/mapStore'

const drawer = ref(false)
const mapStore = useMapStore()
const scrollY = ref(0)
const isScrolled = ref(false)

const scrollToSection = (sectionId) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
    drawer.value = false
  }
}

const fetchCoordinates = async () => {
  try {
    await mapStore.fetchUserBoardingHouseData();
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
};

const handleScroll = () => {
  scrollY.value = window.scrollY
  isScrolled.value = scrollY.value > 50
}

onMounted(() => {
  AOS.init({
    duration: 800,
    once: false, 
    mirror: true,
    offset: 120,
  });
  fetchCoordinates()
  window.addEventListener('scroll', handleScroll)
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <v-app class="modern-app">
    <!-- Modern Navigation Bar with Glassmorphism -->
    <v-app-bar
      app
      :class="['modern-navbar', { 'navbar-scrolled': isScrolled }]"
      density="comfortable"
      :elevation="0"
      flat
      fixed
    >
      <v-container class="d-flex align-center justify-space-between px-6">
        <RouterLink
          style="text-decoration: none; color: inherit;"
          to="/"
          class="d-flex align-center ga-3 logo-container"
        >
          <div class="logo-wrapper">
            <img
              class="cursor-pointer logo-img"
              src="@/assets/logo.png"
              alt="Logo"
              width="40"
              height="40"
              @click="scrollToSection('home')"
            />
          </div>
          <h2 class="brand-name" @click="scrollToSection('home')">
            Stay<span class="highlight">Search</span>
          </h2>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="d-none d-lg-flex align-center ga-8">
          <v-btn 
            variant="text" 
            class="nav-btn"
            @click="scrollToSection('home')"
            rounded="xl"
          >
            Home
          </v-btn>
          <v-btn 
            variant="text" 
            class="nav-btn"
            @click="scrollToSection('locations')"
            rounded="xl"
          >
            Locations
          </v-btn>
          <v-btn 
            variant="text" 
            class="nav-btn"
            @click="scrollToSection('about')"
            rounded="xl"
          >
            About
          </v-btn>
          <v-btn 
            class="cta-btn"
            @click="$router.push({ name: 'login' })"
            rounded="xl"
            size="large"
          >
            <v-icon class="mr-2">mdi-login</v-icon>
            Sign In
          </v-btn>
        </nav>

        <!-- Mobile Menu Button -->
        <v-app-bar-nav-icon 
          class="d-flex d-lg-none mobile-menu-btn" 
          @click="drawer = !drawer"
        />
      </v-container>
    </v-app-bar>

    <!-- Modern Mobile Drawer -->
    <v-navigation-drawer 
      v-model="drawer" 
      app 
      temporary 
      class="modern-drawer"
      width="300"
    >
      <div class="drawer-header">
        <h3 class="text-white">Menu</h3>
      </div>
      <v-list class="drawer-list">
        <v-list-item 
          v-for="item in [
            { title: 'Home', action: () => scrollToSection('home'), icon: 'mdi-home' },
            { title: 'Locations', action: () => scrollToSection('locations'), icon: 'mdi-map-marker' },
            { title: 'About', action: () => scrollToSection('about'), icon: 'mdi-information' },
            { title: 'Sign In', action: () => $router.push({ name: 'login' }), icon: 'mdi-login', special: true }
          ]"
          :key="item.title"
          @click="item.action"
          :class="['drawer-item', { 'drawer-item-special': item.special }]"
          rounded="xl"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Hero Section with Modern Design -->
    <section id="home" class="hero-section">
      <div class="hero-background">
        <div class="hero-gradient"></div>
        <div class="floating-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
        </div>
      </div>
      
      <v-container class="hero-container">
        <v-row class="align-center min-vh-100">
          <v-col cols="12" lg="6" class="hero-content">
            <div data-aos="fade-up" data-aos-delay="200">
              <h1 class="hero-title">
                Find Your Perfect
                <span class="title-highlight">Campus Home</span>
              </h1>
            </div>
            <div data-aos="fade-up" data-aos-delay="400">
              <p class="hero-subtitle">
                Connecting students with premium boarding houses near campus. 
                Owners can showcase properties to thousands of eager students!
              </p>
            </div>
            <div class="hero-actions" data-aos="fade-up" data-aos-delay="600">
              <v-btn 
                class="primary-cta"
                size="x-large"
                rounded="xl"
                @click="$router.push({ name: 'signup' })"
              >
                <v-icon class="mr-2">mdi-home-search</v-icon>
                Start Searching
              </v-btn>
              <v-btn 
                variant="outlined"
                class="secondary-cta"
                size="x-large"
                rounded="xl"
                @click="scrollToSection('about')"
              >
                <v-icon class="mr-2">mdi-play-circle</v-icon>
                Learn More
              </v-btn>
            </div>
            
            <!-- Stats Section -->
            <div class="stats-container" data-aos="fade-up" data-aos-delay="800">
              <div class="stat-item">
                <h3 class="stat-number">500+</h3>
                <p class="stat-label">Happy Students</p>
              </div>
              <div class="stat-item">
                <h3 class="stat-number">150+</h3>
                <p class="stat-label">Properties Listed</p>
              </div>
              <div class="stat-item">
                <h3 class="stat-number">50+</h3>
                <p class="stat-label">Partner Owners</p>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" lg="6" class="hero-image-col">
            <div class="hero-image-container" data-aos="fade-left" data-aos-delay="400">
              <div class="image-backdrop"></div>
              <v-img
                :src="hero"
                alt="Hero illustration"
                class="hero-image"
                max-width="100%"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <v-container>
        <div class="section-header" data-aos="fade-up">
          <h2 class="section-title">How StaySearch Works</h2>
          <p class="section-subtitle">Three simple steps to find your perfect home</p>
        </div>
        
        <v-row class="mt-16">
          <v-col 
            v-for="(step, index) in [
              {
                icon: 'mdi-plus-circle',
                title: 'List Your Property',
                description: 'Property owners create stunning listings with photos, detailed amenities, and competitive pricing.',
                color: 'primary'
              },
              {
                icon: 'mdi-magnify',
                title: 'Smart Search',
                description: 'Students use advanced filters to browse, compare, and discover their ideal housing options.',
                color: 'accent'
              },
              {
                icon: 'mdi-handshake',
                title: 'Perfect Match',
                description: 'Connect seamlessly - students find their dream home, owners get reliable, verified tenants.',
                color: 'success'
              }
            ]"
            :key="index"
            cols="12" 
            md="4"
            data-aos="fade-up"
            :data-aos-delay="index * 200"
          >
            <div class="step-card">
              <div class="step-number">{{ index + 1 }}</div>
              <div :class="['step-icon-wrapper', `step-${step.color}`]">
                <v-icon size="48" class="step-icon">{{ step.icon }}</v-icon>
              </div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Interactive Map Section -->
    <section id="locations" class="map-section">
      <v-container>
        <div class="section-header" data-aos="fade-up">
          <h2 class="section-title text-white">Explore Boarding Locations</h2>
          <p class="section-subtitle text-white opacity-90">Discover premium accommodations across the campus area</p>
        </div>
        
        <div class="map-container" data-aos="fade-up" data-aos-delay="200">
          <div class="map-wrapper">
            <l-map
              :use-global-leaflet="false"
              ref="map"
              zoom=15
              :center="[8.9559,125.59715]"
              minZoom=12
              class="interactive-map"
            >
              <l-tile-layer
                url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=sQh8Ib7Qh6Fp1elfR6K8"
                layer-type="base"
                name="OpenStreetMap"
              />
              <l-marker
                v-for="coordinates in mapStore.boardingHouseCoordinates"
                :key="coordinates.id"
                :lat-lng="[coordinates.latitude, coordinates.longitude]"
              >
                <l-tooltip>{{ coordinates.name }}</l-tooltip>
              </l-marker>
            </l-map>
          </div>
        </div>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section id="about" class="cta-section">
      <div class="cta-background">
        <div class="cta-gradient"></div>
      </div>
      <v-container>
        <div class="cta-content" data-aos="fade-up">
          <h2 class="cta-title">Ready to Find Your Perfect Home?</h2>
          <p class="cta-subtitle">
            Join thousands of students and property owners who trust StaySearch 
            for premium campus accommodation solutions.
          </p>
          <div class="cta-buttons">
            <v-btn 
              class="cta-primary"
              size="x-large"
              rounded="xl"
              @click="$router.push({ name: 'signup' })"
            >
              <v-icon class="mr-2">mdi-rocket-launch</v-icon>
              Get Started Now
            </v-btn>
          </div>
        </div>
      </v-container>
    </section>

    <!-- About Us Section -->
    <section id="aboutus" class="about-section">
      <v-container>
        <div class="section-header" data-aos="fade-up">
          <h2 class="section-title">Meet the Innovators</h2>
          <p class="section-subtitle">The passionate team behind StaySearch</p>
        </div>
        
        <v-row class="mt-16">
          <v-col cols="12" lg="8" data-aos="fade-right">
            <div class="mission-card">
              <h3 class="mission-title">Our Mission</h3>
              <div class="mission-content">
                <p>
                  StaySearch revolutionizes student housing by creating a seamless bridge between 
                  students seeking quality accommodation and property owners offering exceptional spaces 
                  near Caraga State University.
                </p>
                <p>
                  We leverage cutting-edge technology to provide detailed property insights, 
                  virtual tours, and transparent pricing—ensuring every student finds not just a place to stay, 
                  but a true home away from home that enhances their academic journey.
                </p>
              </div>
            </div>
          </v-col>
          
          <v-col cols="12" lg="4" data-aos="fade-left">
            <div class="team-card">
              <h3 class="team-title">Our Team</h3>
              <div class="team-members-list">
                <p class="team-member-name">Ainor Jamal</p>
                <p class="team-member-name">Reymart Eva</p>
                <p class="team-member-name">Kurt Lumapak</p>
                <p class="team-member-name">Brian Inguito</p>
                <p class="team-member-name">May Estroga</p>
                <p class="team-member-name">Jusalyn Gimao</p>
                <p class="team-member-name">Ushyne Esclamado</p>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Modern Footer -->
    <footer class="modern-footer">
      <v-container>
        <div class="footer-content">
          <div class="footer-brand">
            <h3>Stay<span class="highlight">Search</span></h3>
            <p>Connecting students with perfect campus homes</p>
          </div>
          <div class="footer-copyright">
            <p>&copy; 2024 StaySearch. Crafted with ❤️ for students</p>
          </div>
        </div>
      </v-container>
    </footer>
  </v-app>
</template>

<style scoped>
/* Base Modern Styles */
.modern-app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow-x: hidden;
}

/* Modern Navigation */
.modern-navbar {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar-scrolled {
  background: rgba(255, 255, 255, 0.98) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo-wrapper {
  position: relative;
  border-radius: 50%;
  background: linear-gradient(135deg, #4CAF50, #81C784);
  padding: 4px;
  transition: transform 0.3s ease;
}

.logo-wrapper:hover {
  transform: scale(1.1);
}

.logo-img {
  border-radius: 50%;
  transition: all 0.3s ease;
}

.brand-name {
  font-weight: 800;
  color: #1a1a1a;
  font-size: 1.5rem;
  transition: color 0.3s ease;
}

.highlight {
  background: linear-gradient(135deg, #4CAF50, #81C784);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-btn {
  font-weight: 600;
  color: #666;
  text-transform: none;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.cta-btn {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 20px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(76, 175, 80, 0.4);
}

/* Modern Drawer */
.modern-drawer {
  background: linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 100%);
}

.drawer-header {
  padding: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.drawer-list {
  padding: 1rem;
  background: transparent;
}

.drawer-item {
  margin: 0.5rem 0;
  color: #ffffff;
  transition: all 0.3s ease;
}

.drawer-item:hover {
  background: rgba(76, 175, 80, 0.2);
  transform: translateX(8px);
}

.drawer-item-special {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(76, 175, 80, 0.9) 0%, 
    rgba(129, 199, 132, 0.8) 50%, 
    rgba(102, 187, 106, 0.9) 100%
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
  animation: float 6s ease-in-out infinite;
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
  right: 10%;
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
  width: 80px;
  height: 80px;
  bottom: 20%;
  left: 20%;
  animation-delay: 1s;
}

.hero-container {
  position: relative;
  z-index: 2;
}

.hero-content {
  z-index: 3;
}

.hero-title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.title-highlight {
  display: block;
  background: linear-gradient(135deg, #FFD54F, #FFF176);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 600px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.primary-cta {
  background: linear-gradient(135deg, #FFD54F, #FFEB3B);
  color: #1a1a1a;
  font-weight: 700;
  text-transform: none;
  box-shadow: 0 8px 32px rgba(255, 213, 79, 0.4);
  transition: all 0.3s ease;
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 213, 79, 0.6);
}

/* About Section */
.about-section {
  padding: 8rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.mission-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.mission-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.mission-content p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #666;
  margin-bottom: 1.5rem;
}

.team-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.team-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 2rem;
  text-align: center;
}

.team-members-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.team-member-name {
  font-size: 1.05rem;
  font-weight: 500;
  color: #1a1a1a;
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(76, 175, 80, 0.05);
  border-radius: 10px;
  border-left: 3px solid #4CAF50;
  transition: all 0.3s ease;
}

.team-member-name:hover {
  background: rgba(76, 175, 80, 0.1);
  transform: translateX(5px);
  border-left-width: 4px;
}

/* Modern Footer */
.modern-footer {
  background: #1a1a1a;
  color: white;
  padding: 3rem 0 2rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.footer-brand h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.footer-copyright p {
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(2deg);
  }
  66% {
    transform: translateY(10px) rotate(-1deg);
  }
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .section-title {
    font-size: 2.5rem;
  }
  
  .cta-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .stats-container {
    justify-content: center;
  }
  
  .footer-content {
    text-align: center;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .primary-cta,
  .secondary-cta {
    width: 100%;
    max-width: 300px;
  }
  
  .mission-card,
  .team-card {
    padding: 2rem;
  }
}

/* Advanced Hover Effects */
.step-card:hover .step-icon-wrapper {
  transform: scale(1.1) rotateY(10deg);
}

.team-member:hover .member-avatar {
  transform: scale(1.05);
}

/* Loading Animation for Map */
.map-wrapper::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 3px solid rgba(76, 175, 80, 0.3);
  border-top: 3px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  z-index: 10;
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Smooth scrolling enhancement */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #388E3C, #4CAF50);
  transition: all 0.3s ease;
}

.primary-cta:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(255, 213, 79, 0.5);
}

.secondary-cta {
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 600;
  text-transform: none;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.secondary-cta:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.stats-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: left;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 900;
  color: #FFD54F;
  margin: 0;
}

.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin: 0;
}

.hero-image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-backdrop {
  position: absolute;
  width: 120%;
  height: 120%;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 30px;
  backdrop-filter: blur(20px);
  transform: rotate(-5deg);
}

.hero-image {
  position: relative;
  z-index: 2;
  border-radius: 20px;
  animation: float 6s ease-in-out infinite;
}

/* How It Works Section */
.how-it-works-section {
  padding: 8rem 0;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.25rem;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

.step-card {
  position: relative;
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
}

.step-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.step-number {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
}

.step-icon-wrapper {
  width: 100px;
  height: 100px;
  margin: 2rem auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.step-primary {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
}

.step-accent {
  background: linear-gradient(135deg, #FF7043, #FF8A65);
}

.step-success {
  background: linear-gradient(135deg, #42A5F5, #64B5F6);
}

.step-icon {
  color: white;
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 1rem;
}

.step-description {
  color: #666;
  line-height: 1.6;
}

/* Map Section */
.map-section {
  padding: 8rem 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.map-container {
  margin-top: 3rem;
}

.map-wrapper {
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.interactive-map {
  width: 100%;
  height: 100%;
}

/* CTA Section */
.cta-section {
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.cta-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, 
    rgba(76, 175, 80, 0.95) 0%, 
    rgba(102, 187, 106, 0.9) 100%
  );
}

.cta-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.cta-primary {
  background: linear-gradient(135deg, #FFD54F, #FFEB3B);
  color: #1a1a1a;
  font-weight: 700;
  text-transform: none;
  padding: 1rem 3rem;
    font-size: 1.1rem;
    box-shadow: 0 8px 32px rgba(255, 213, 79, 0.4);
    transition: all 0.3s ease;
  }
  </style>