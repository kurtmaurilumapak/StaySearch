<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount  } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { usePostStore } from '@/stores/postStore'
import { useRouter } from 'vue-router'
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css"

const dialog = ref(false)
const postStore = usePostStore()
const router = useRouter()  
const form = ref()


const create = ref({
  images: [],
  price: '',
  name: '',
  address: '',
  description: '',
  currentIndex: 0,
  leaveCreatePage: false,
  showMapDialog: false,
  active: 1,
  type: '',
  inclusion: [],
  latitude: '',
  longitude: '',
})
const marker = ref(null); // Single marker position
const finalizedPosition = ref(null); // Finalized marker position
const isFinalized = ref(false); // Flag to restrict further marker creation
const openModal = () => {
  dialog.value = true 
}

const addMarker = (event) => {
  if (!isFinalized.value) {
    const { lat, lng } = event.latlng;
    marker.value = [lat, lng];
    create.value.latitude = lat;
    create.value.longitude = lng;
  } else {
    alert("Marker has been finalized. You cannot add a new marker.");
  }
};
const finalizeMarker = () => {
  if (marker.value) {
    finalizedPosition.value = {
      lat: marker.value[0],
      lng: marker.value[1],
    };
    isFinalized.value = true;
    create.value.latitude = marker.value[0];
    create.value.longitude = marker.value[1];
    create.value.showMapDialog = false;
    dialog.value = false;
  } else {
    alert("Please place a marker first!");
  }
};
const cancelMarker = () => {
  marker.value = null; 
  finalizedPosition.value = null; 
  isFinalized.value = false; 
  create.value.latitude = ""; 
  create.value.longitude = ""; 
};
// FORMAT THE INPUTTED PRICE TO CURRENCY
const formatPrice = (value) => {
  if (!value) return '';
  const numberValue = Number(value.replace(/,/g, ''));
  return isNaN(numberValue) ? '' : numberValue.toLocaleString('en-US');
};

watch(() => create.value.price, (newValue) => {
  create.value.price = formatPrice(newValue);
});

// HANDLES THE IMAGE
const handleFiles = (event) => {
  const selectedFiles = event.target.files
  Array.from(selectedFiles).forEach((file) => {
    create.value.images.push({ file, url: URL.createObjectURL(file) })
  })
}
const handleDrop = (event) => {
  event.preventDefault()
  const files = event.dataTransfer.files
  Array.from(files).forEach((file) => {
    create.value.images.push({ file, url: URL.createObjectURL(file) })
  })
}
const clearimg = (index) => {
  create.value.images.splice(index, 1)
}

// FORM VALIDATION
const isFormValid = computed(() => {

  const cleanedPrice = String(create.value.price || '').replace(/,/g, '')
  const numericPrice = Number(cleanedPrice)

  return (
    !isNaN(numericPrice) &&
    cleanedPrice.trim() !== '' &&
    Number(cleanedPrice) > 0 &&
    create.value.name.trim() !== '' &&
    create.value.address.trim() !== '' &&
    create.value.description.trim() !== '' &&
    create.value.type.trim() !== '' &&
    create.value.inclusion.length > 0 &&
    create.value.latitude !== "" &&
    create.value.longitude !== ""
  );
});

// HANDLES THE PAGE REFRESH
const handleBeforeUnload = (event) => {
  if (create.value.name || create.value.address || create.value.price || create.value.description || create.value.images.length || create.value.type || create.value.inclusion.length) {
    const confirmationMessage = "You have unsaved changes. Are you sure you want to leave?";
    event.returnValue = confirmationMessage
    return confirmationMessage
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});


// HANDLES THE FORM SUBMIT
const submitPost = async () => {
  console.log('Submit Post called');
  const cleanedPrice = String(create.value.price || '').replace(/,/g, '');

  try {
    await postStore.createPost(

      {
        price: cleanedPrice,
        name: create.value.name,
        address: create.value.address,
        description: create.value.description,
        latitude: create.value.latitude,
        longitude: create.value.longitude,
      },
      create.value.images,
      create.value.type,
      create.value.inclusion
    )
    // Reset the form after submission
    form.value?.reset()

    await router.push('/owner/posts')
  } catch (error) {
    console.error(error)
  }
}

</script>


<template>
  <AppLayout>
    <template #content>
      <!-- CONTENT -->
      <v-row style="height: calc(100vh + 11px); position: absolute; top: 0; left: 0; right: 0;" class="overflow-hidden ma-0">
        <!-- POSTING MENU -->
        <v-col cols="12" md="4" lg="3" class="pa-0">
          <v-card class="form-sidebar">
            <!-- Modern Header -->
            <v-card-title class="form-header">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                color="white"
                size="large"
                class="back-btn"
                @click="create.leaveCreatePage = true"
              ></v-btn>
              <v-spacer></v-spacer>
              <span class="header-title">Create Listing</span>
              <v-spacer></v-spacer>
              <div style="width: 40px;"></div>
            </v-card-title>

            <!-- Leave Dialog -->
            <v-dialog v-model="create.leaveCreatePage" max-width="500">
              <v-card class="modern-dialog" rounded="xl">
                <v-card-text class="pa-8">
                  <div class="text-center mb-6">
                    <div class="warning-icon-wrapper mb-4">
                      <v-icon size="64" color="orange-darken-2">mdi-alert-circle</v-icon>
                    </div>
                    <h2 class="text-h5 font-weight-bold mb-3">Leave this page?</h2>
                    <p class="text-body-1 text-medium-emphasis">
                      Your changes will be lost if you leave without saving.
                    </p>
                  </div>
                  <v-row>
                    <v-col cols="6">
                      <v-btn
                        color="grey-darken-1"
                        variant="tonal"
                        rounded="lg"
                        block
                        size="large"
                        @click="create.leaveCreatePage = false"
                      >
                        Stay
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn
                        color="red"
                        rounded="lg"
                        block
                        size="large"
                        @click="$router.push('/owner/posts')"
                      >
                        Leave
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>

            <!-- Form Content -->
            <v-card-text class="form-content">
              <v-form ref="form">
                <v-row>
                  <!-- Image Upload Section -->
                  <v-col cols="12">
                    <div class="section-label mb-3">
                      <v-icon color="green-darken-2" class="mr-2">mdi-image-multiple</v-icon>
                      <span>Property Images</span>
                    </div>
                    
                    <v-btn
                      class="upload-btn mb-3"
                      color="green-darken-2"
                      variant="tonal"
                      rounded="lg"
                      block
                      prepend-icon="mdi-upload"
                      @click="$refs.fileInput.$el.querySelector('input').click()"
                    >
                      Upload Images
                    </v-btn>
                    
                    <v-file-input
                      ref="fileInput"
                      accept=".jpg, .jpeg, .png"
                      prepend-icon=false
                      multiple
                      hide-input
                      @change="handleFiles"
                    >
                    </v-file-input>
                    
                    <div 
                      class="dropzone"
                      @dragover.prevent
                      @drop.prevent="handleDrop"
                    >
                      <div v-if="create.images.length === 0" class="dropzone-empty">
                        <v-icon size="48" color="grey">mdi-cloud-upload</v-icon>
                        <p class="text-body-2 text-medium-emphasis mt-2">
                          Drag & drop images here
                        </p>
                      </div>
                      <v-row v-else class="image-grid">
                        <v-col 
                          cols="6" 
                          v-for="(file, index) in create.images" 
                          :key="index"
                          class="image-item"
                        >
                          <div class="image-wrapper">
                            <v-img
                              :src="file.url"
                              aspect-ratio="1"
                              cover
                              class="uploaded-image"
                            >
                            </v-img>
                            <v-btn
                              icon
                              size="small"
                              color="red"
                              class="remove-image-btn"
                              @click.stop="clearimg(index); $refs.fileInput.$el.querySelector('input').value = ''"
                            >
                              <v-icon size="18">mdi-close</v-icon>
                            </v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>

                  <!-- Location Section -->
                  <v-col cols="12">
                    <div class="section-label mb-3">
                      <v-icon color="green-darken-2" class="mr-2">mdi-map-marker</v-icon>
                      <span>Location</span>
                    </div>
                    <v-btn
                      color="green-darken-2"
                      variant="outlined"
                      rounded="lg"
                      block
                      prepend-icon="mdi-pin"
                      @click="openModal"
                    >
                      {{ marker ? 'Update Location' : 'Pin Location' }}
                    </v-btn>
                    
                    <!-- Map Dialog -->
                    <v-dialog v-model="dialog" max-width="800">
                      <v-card rounded="xl" class="map-dialog">
                        <v-card-title class="pa-6">
                          <h3 class="text-h6 font-weight-bold">Select Property Location</h3>
                          <v-spacer></v-spacer>
                          <v-btn
                            icon="mdi-close"
                            variant="text"
                            @click="dialog = false"
                          ></v-btn>
                        </v-card-title>
                        <div class="map-container">
                          <l-map
                            :use-global-leaflet="false"
                            ref="map"
                            zoom="15"
                            :center="[8.9559, 125.59715]"
                            @click="addMarker"
                            minZoom="15"
                          >
                            <l-tile-layer
                              url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=sQh8Ib7Qh6Fp1elfR6K8"
                              layer-type="base"
                              name="OpenStreetMap"
                            ></l-tile-layer>
                            <l-marker v-if="marker" :lat-lng="marker"></l-marker>
                          </l-map>
                          
                          <div class="map-controls">
                            <v-btn
                              @click="finalizeMarker"
                              color="green-darken-2"
                              rounded="lg"
                              size="large"
                              class="mr-2"
                              prepend-icon="mdi-check"
                            >
                              Confirm
                            </v-btn>
                            <v-btn
                              @click="cancelMarker"
                              color="red"
                              variant="tonal"
                              rounded="lg"
                              size="large"
                              prepend-icon="mdi-close"
                            >
                              Clear
                            </v-btn>
                          </div>
                        </div>
                      </v-card>
                    </v-dialog>
                  </v-col>

                  <!-- Property Details -->
                  <v-col cols="12">
                    <div class="section-label mb-3">
                      <v-icon color="green-darken-2" class="mr-2">mdi-information</v-icon>
                      <span>Property Details</span>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="create.name"
                      color="green-darken-2"
                      label="Property Name"
                      variant="outlined"
                      rounded="lg"
                      prepend-inner-icon="mdi-home"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="create.address"
                      color="green-darken-2"
                      label="Address"
                      variant="outlined"
                      rounded="lg"
                      prepend-inner-icon="mdi-map-marker-outline"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-text-field
                      v-model="create.price"
                      color="green-darken-2"
                      variant="outlined"
                      rounded="lg"
                      label="Monthly Rate"
                      prepend-inner-icon="mdi-currency-php"
                      @input="create.price = formatPrice($event.target.value)"
                      type="text"
                      maxlength="6"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="create.description"
                      color="green-darken-2"
                      label="Description"
                      variant="outlined"
                      rounded="lg"
                      auto-grow
                      rows="4"
                    ></v-textarea>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="create.type"
                      :items="['All Boys', 'All Girls', 'Mix']"
                      label="Housing Type"
                      color="green-darken-2"
                      variant="outlined"
                      rounded="lg"
                      prepend-inner-icon="mdi-account-group"
                    />
                  </v-col>

                  <v-col cols="12">
                    <div class="section-label mb-3">
                      <v-icon color="green-darken-2" class="mr-2">mdi-check-circle</v-icon>
                      <span>Amenities</span>
                    </div>
                    <div class="amenities-section">
                      <v-checkbox
                        color="green-darken-2"
                        :value="'Free Wifi'"
                        v-model="create.inclusion"
                        label="Free WiFi"
                        hide-details
                        class="amenity-checkbox"
                      ></v-checkbox>
                      <v-checkbox
                        color="green-darken-2"
                        :value="'Free Water'"
                        v-model="create.inclusion"
                        label="Free Water"
                        hide-details
                        class="amenity-checkbox"
                      ></v-checkbox>
                      <v-checkbox
                        color="green-darken-2"
                        :value="'Free Electricity'"
                        v-model="create.inclusion"
                        label="Free Electricity"
                        hide-details
                        class="amenity-checkbox"
                      ></v-checkbox>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <!-- Submit Button -->
            <v-card-actions class="form-actions">
              <v-btn
                :loading="postStore.formAction.formProcess"
                type="submit"
                :disabled="!isFormValid"
                color="green-darken-2"
                rounded="lg"
                size="x-large"
                block
                elevation="0"
                @click="submitPost"
              >
                <v-icon class="mr-2">mdi-check-circle</v-icon>
                <span class="font-weight-bold">Create Listing</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- PREVIEW -->
        <v-col cols="12" md="8" lg="9" class="preview-section pa-0">
          <div class="preview-container">
            <div class="preview-header">
              <v-icon color="green-darken-2" size="28" class="mr-3">mdi-eye</v-icon>
              <h2 class="text-h5 font-weight-bold">Live Preview</h2>
            </div>

            <v-card class="preview-card" elevation="8" rounded="xl">
              <v-card-text class="preview-content">
                <v-row>
                  <!-- Property Name -->
                  <v-col cols="12" class="text-center">
                    <h1 class="property-preview-title">
                      {{ create.name || 'Property Name' }}
                    </h1>
                  </v-col>

                  <!-- Images -->
                  <v-col cols="12">
                    <div v-if="create.images.length" class="preview-gallery">
                      <v-row>
                        <v-col cols="8">
                          <v-img
                            class="preview-main-image"
                            :src="create.images[0]?.url"
                            aspect-ratio="1"
                            cover
                          >
                          </v-img>
                        </v-col>
                        <v-col cols="4">
                          <v-row>
                            <v-col cols="12">
                              <v-img
                                class="preview-thumb-image"
                                :src="create.images[1]?.url"
                                aspect-ratio="1"
                                cover
                              >
                              </v-img>
                            </v-col>
                            <v-col cols="12">
                              <v-img
                                class="preview-thumb-image"
                                :src="create.images[2]?.url"
                                aspect-ratio="1"
                                cover
                              >
                                <div v-if="create.images.length > 3" class="preview-overlay">
                                  <span class="overlay-text">+{{ create.images.length - 3 }}</span>
                                </div>
                              </v-img>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else class="preview-empty">
                      <v-icon size="80" color="grey-lighten-1">mdi-image-off</v-icon>
                      <h3 class="mt-4 text-grey-darken-1">No images uploaded</h3>
                      <p class="text-body-2 text-grey">Upload images to see preview</p>
                    </div>
                  </v-col>

                  <!-- Tags -->
                  <v-col cols="12">
                    <div class="tags-preview">
                      <v-chip
                        v-if="create.type || create.inclusion.length"
                        color="pink-lighten-4"
                        text-color="pink-darken-3"
                        class="mr-2 mb-2"
                        size="small"
                      >
                        <v-icon icon="mdi-tag" start size="16"></v-icon>
                        Tags
                      </v-chip>
                      <v-chip
                        v-if="create.type"
                        color="green-lighten-5"
                        text-color="green-darken-3"
                        class="mr-2 mb-2"
                      >
                        {{ create.type }}
                      </v-chip>
                      <v-chip
                        v-for="(inclusion, index) in create.inclusion"
                        :key="index"
                        color="green-lighten-5"
                        text-color="green-darken-3"
                        class="mr-2 mb-2"
                      >
                        {{ inclusion }}
                      </v-chip>
                    </div>
                  </v-col>

                  <!-- Map -->
                  <v-col cols="12">
                    <div class="preview-map">
                      <l-map
                        :use-global-leaflet="false"
                        ref="map"
                        zoom="15"
                        :center="[create.latitude || 8.9559, create.longitude || 125.59715]"
                        minZoom="15"
                      >
                        <l-tile-layer
                          url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=sQh8Ib7Qh6Fp1elfR6K8"
                          layer-type="base"
                          name="OpenStreetMap"
                        ></l-tile-layer>
                        <l-marker v-if="create.latitude && create.longitude" :lat-lng="[create.latitude, create.longitude]"></l-marker>
                      </l-map>
                    </div>
                  </v-col>

                  <!-- Info -->
                  <v-col cols="12">
                    <div class="preview-info-card">
                      <div class="d-flex align-center mb-4">
                        <v-icon color="green-darken-2" class="mr-2">mdi-map-marker</v-icon>
                        <span class="text-h6">{{ create.address || 'Property Address' }}</span>
                      </div>
                      
                      <div class="price-preview mb-4">
                        <v-icon color="green-darken-2" size="32" class="mr-3">mdi-currency-php</v-icon>
                        <div>
                          <span class="price-amount">{{ create.price || '0' }}</span>
                          <span class="price-period">/month</span>
                        </div>
                      </div>

                      <v-divider class="my-4"></v-divider>

                      <div class="description-preview">
                        <h4 class="text-subtitle-1 font-weight-bold mb-2">Description</h4>
                        <p class="text-body-1">{{ create.description || 'Property description will appear here...' }}</p>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Form Sidebar */
.form-sidebar {
  height: 100vh;
  width: 100%;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  background: white;
}

.form-header {
  background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-btn {
  transition: transform 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-4px);
}

.header-title {
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.3px;
}

/* Form Content */
.form-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px !important;
}

.form-content::-webkit-scrollbar {
  width: 6px;
}

.form-content::-webkit-scrollbar-track {
  background: #f5f5f5;
}

.form-content::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 3px;
}

.section-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: #2e7d32;
}

/* Dropzone */
.dropzone {
  border: 2px dashed #4caf50;
  border-radius: 16px;
  background: #f1f8f4;
  min-height: 180px;
  padding: 16px;
  transition: all 0.3s ease;
}

.dropzone:hover {
  border-color: #2e7d32;
  background: #e8f5e9;
}

.dropzone-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 150px;
}

.image-grid {
  margin: 0;
}

.image-item {
  padding: 8px;
}

.image-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.image-wrapper:hover {
  transform: scale(1.05);
}

.uploaded-image {
  border-radius: 12px;
}

.remove-image-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: white !important;
}

/* Amenities */
.amenities-section {
  background: #f1f8f4;
  padding: 16px;
  border-radius: 12px;
}

.amenity-checkbox {
  margin-bottom: 8px;
}

/* Form Actions */
.form-actions {
  padding: 20px 24px !important;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  position: sticky;
  bottom: 0;
}

/* Map Dialog */
.map-dialog {
  overflow: hidden;
}

.map-container {
  height: 500px;
  width: 100%;
  position: relative;
}

.map-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 12px;
}

/* Modern Dialog */
.modern-dialog {
  overflow: hidden;
}

.warning-icon-wrapper {
  animation: pulse 2s ease-in-out infinite;
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

/* Preview Section */
.preview-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  height: 100vh;
  overflow-y: auto;
}

.preview-section::-webkit-scrollbar {
  width: 8px;
}

.preview-section::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.preview-section::-webkit-scrollbar-thumb {
  background: #4caf50;
  border-radius: 4px;
}

.preview-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
}

.preview-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  animation: fadeInDown 0.6s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-card {
  border: 2px solid rgba(46, 125, 50, 0.2);
  animation: fadeInUp 0.6s ease 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.preview-content {
  padding: 32px !important;
}

.property-preview-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #1b5e20;
  margin-bottom: 24px;
}

/* Preview Gallery */
.preview-gallery {
  margin-top: 16px;
}

.preview-main-image,
.preview-thumb-image {
  border-radius: 16px;
  border: 2px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-main-image:hover,
.preview-thumb-image:hover {
  transform: scale(1.02);
  border-color: #4caf50;
}

.preview-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  height: 100%;
  width: 100%;
  position: absolute;
  border-radius: 16px;
  backdrop-filter: blur(4px);
}

.overlay-text {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 700;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: #f5f5f5;
  border-radius: 16px;
  padding: 40px;
}

/* Tags Preview */
.tags-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

/* Map Preview */
.preview-map {
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 16px;
}

/* Info Card */
.preview-info-card {
  background: linear-gradient(135deg, #f1f8f4 0%, #e8f5e9 100%);
  padding: 24px;
  border-radius: 16px;
  margin-top: 16px;
}

.price-preview {
  display: flex;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.price-amount {
  font-size: 2rem;
  font-weight: 800;
  color: #1b5e20;
}

.price-period {
  font-size: 1rem;
  color: #2e7d32;
  font-weight: 600;
  margin-left: 4px;
}

.description-preview {
  color: #424242;
  line-height: 1.7;
}

/* Upload Button */
.upload-btn {
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .preview-container {
    padding: 16px;
  }

  .preview-content {
    padding: 20px !important;
  }

  .form-content {
    padding: 16px !important;
  }

  .property-preview-title {
    font-size: 1.75rem;
  }

  .price-amount {
    font-size: 1.5rem;
  }
}

@media (max-width: 600px) {
  .preview-header {
    margin-bottom: 16px;
  }

  .preview-info-card {
    padding: 16px;
  }

  .map-controls {
    flex-direction: column;
    width: calc(100% - 40px);
  }

  .map-controls .v-btn {
    width: 100%;
  }
}
</style>