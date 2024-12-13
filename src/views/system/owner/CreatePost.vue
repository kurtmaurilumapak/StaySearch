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
      <v-row style="height: calc(100vh + 11px); position: absolute; top: 0; left: 0; right: 0;" class="overflow-hidden">
        <!-- POSTING MENU -->
        <v-col cols="12" md="4" lg="3">
          <v-card style="height: 100vh; width: 100%; z-index: 1; border-radius: 0;">
            <v-card-title class="d-flex align-center py-3 bg-green">
              <v-btn
                icon="mdi-arrow-left"
                variant="text"
                @click="create.leaveCreatePage = true"
              ></v-btn>
                <v-spacer> </v-spacer>
                <span class="font-weight-bold pr-10">Create Post</span>
                <v-spacer> </v-spacer>
            </v-card-title>
            <v-dialog v-model="create.leaveCreatePage" max-width="600">
              <v-card>
                <v-card-title
                  class="d-flex align-center font-weight-bold"
                >
                  Leave page?
                  <v-spacer></v-spacer>
                  <v-btn
                    fab icon
                    @click="create.leaveCreatePage = false"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>Are you sure you want to leave? Your changes will be lost if you leave this page.
                </v-card-text>
                <v-card-actions>
                  <v-btn color="primary" class="font-weight-bold" @click="$router.push('/owner/posts')">Leave</v-btn>
                  <v-btn color="error" class="font-weight-bold" @click="create.leaveCreatePage = false">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-spacer></v-spacer>
            <v-card-text
              style="height: calc(100vh - 120px); overflow-y: auto; padding: 20px;"
            >
              <v-form ref="form">
                <v-row>
                  <v-col cols="12">
                    <v-btn
                      class="text-none"
                      color="green-darken-2"
                      @click="$refs.fileInput.$el.querySelector('input').click()"
                    >
                      <v-icon>mdi-upload</v-icon>
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
                    <span class="text-disabled pl-2">or drag and drop here</span>
                    <v-card
                      class="overflow-y-auto"
                      height="200"
                      width="auto"
                      :elevation="0"
                      style="border: green dashed 2px; border-radius: 10px"
                      color="grey-lighten-3"
                      @dragover.prevent
                      @drop.prevent="handleDrop"
                    >
                      <v-card-text class="d-flex ga-2">
                        <v-row>
                          <v-col cols="4" class="d-flex justify-center align-center" v-for="(file, index) in create.images" :key="index">
                            <v-img
                              :src="file.url"
                              max-width="100"
                              max-height="100"
                            >
                              <v-icon
                                style="position: absolute; top: 0; right: 0; background-color: red; color: white"
                                @click.stop="clearimg(index); $refs.fileInput.$el.querySelector('input').value = ''"
                              >mdi-close
                              </v-icon>
                            </v-img>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12">
                    <v-btn
                      color="green-darken-1"
                      variant="outlined"
                      @click="openModal"
                      block
                    >
                      pin location
                    </v-btn>
                    <v-dialog v-model="dialog">
                    <v-card>
  <div style="height: 500px; width: 100%; position: relative;">
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
    
 
    <div style="position: absolute; bottom: 10px; left: 10px; z-index: 1000;">
      <v-btn @click="finalizeMarker" class="text-none mx-2 my-2" color="green-darken-2">
        Finalize Marker
      </v-btn>
      <v-btn @click="cancelMarker" class="text-none mx-2 my-2" color="red">
        Clear Marker
      </v-btn>
    </div>
  </div>
</v-card>

                  </v-dialog>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="create.name"
                      color="green-darken-1"
                      label="House Name"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="create.address"
                      color="green-darken-1"
                      label="Address"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="create.price"
                      color="green-darken-1"
                      variant="outlined"
                      label="Price"
                      prepend-inner-icon="mdi-currency-php"
                      @input="create.price = formatPrice($event.target.value)"
                      type="text"
                      maxlength="6"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="create.description"
                      color="green-darken-1"
                      label="Description"
                      variant="outlined"
                      auto-grow
                    ></v-textarea>
                  </v-col>
                  <v-col cols="6">
                    <v-select
                      v-model="create.type"
                      :items="['All Boys', 'All Girls', 'Mix']"
                      label="Boarding House Type"
                      color="green-darken-1"
                      variant="outlined"
                    />
                  </v-col>
                  <v-col cols="6">
                    <span>Inclusion:</span>
                    <v-checkbox
                      color="green-darken-1"
                      :value="'Free Wifi'"
                      v-model="create.inclusion"
                      label="Free WiFi"
                    ></v-checkbox>
                    <v-checkbox
                      color="green-darken-1"
                      :value="'Free Water'"
                      v-model="create.inclusion"
                      label="Free Water"
                    ></v-checkbox>
                    <v-checkbox
                      color="green-darken-1"
                      :value="'Free Electricity'"
                      v-model="create.inclusion"
                      label="Free Electricity"
                    ></v-checkbox>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions class="justify-end px-10" style="position: sticky; bottom: 0;">
              <v-btn
                class="text-none"
                :loading="postStore.formAction.formProcess"
                type="submit"
                :disabled="!isFormValid"
                style="background-color: green; color: white; font-weight: bold"
                @click="submitPost"
                block
              >
                Create Listing
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- PREVIEW -->
        <v-col cols="12" md="8" lg="9" class="d-flex justify-center align-center">
          <v-container
            max-width="700"
            class="border"
            style="border-radius: 10px"
          >

            <span class="font-weight-bold pl-3">Preview</span>
            <v-card
              class="my-2 mx-2"
              style="border-radius: 10px;"
              :elevation="5"
            >
              <v-card-text style="overflow-y: auto; max-height: 81.5vh;">
                <v-row>
                  <v-col cols="12" class="text-center">
                    <h1>{{ create.name || 'House Name' }}</h1>
                  </v-col>
                  <v-col cols="12">
                    <div v-if="create.images.length" class="d-flex flex-wrap mt-4">
                      <v-row>
                        <v-col cols="8">
                          <v-img
                            style="border-radius: 20px; cursor: pointer;"
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
                                style="border-radius: 20px; cursor: pointer;"
                                :src="create.images[1]?.url"
                                aspect-ratio="1"
                                cover
                              >
                              </v-img>
                            </v-col>
                            <v-col cols="12">
                              <v-img
                                style="border-radius: 20px; cursor: pointer;"
                                :src="create.images[2]?.url"
                                aspect-ratio="1"
                                cover
                              >
                                <div v-if="create.images.length > 3" class="overlay">
                                  <span style="font-size: clamp(5px, 3vw, 25px)">{{ create.images.length - 3 }}+ more</span>
                                </div>
                              </v-img>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </div>
                    <div v-else class="d-flex flex-wrap mt-4 text-center">
                      <v-img
                        class="d-flex justify-center align-center"
                        src=""
                        alt="No Image"
                        max-height="500"
                        height="500"
                        width="400"
                        style="border-radius: 10px; background-color: grey"
                        contain
                      >
                        <div class="d-flex flex-column justify-center align-center">
                          <h2>No images uploaded yet</h2>
                          <p>Please upload an image to preview</p>
                        </div>
                      </v-img>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div v-if=" create.type || create.inclusion">
                      <v-chip
                        size="small"
                        color="pink"
                        class="mr-1"
                      >
                        <v-icon icon="mdi-label" start></v-icon>
                        Tags:
                      </v-chip>
                      <v-chip
                        color="green-darken-2"
                        class="ma-1"
                      >
                        {{ create.type }}
                      </v-chip>
                      <v-chip
                        size="small"
                        v-for="(inclusion, index) in create.inclusion"
                        :key="index"
                        color="green-darken-2"
                        class="ma-1"
                      >
                        {{ inclusion }}
                      </v-chip>
                    </div>
                    <div v-else>
                      <v-chip
                        size="small"
                        color="pink"
                        label
                      >
                        <v-icon icon="mdi-label" start></v-icon>
                        Tags:
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <div class="d-flex flex-wrap mt-4 text-center" style="height: 300px; width: 100%; border-radius: 10px;">
                      <l-map
                      :use-global-leaflet="false"
                        ref="map"
                        zoom="15"
                        :center="[create.latitude, create.longitude]"
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
                  <v-col cols="12" class="d-block">
                    <div class="d-flex justify-space-between">
                      <h2 class="text-subtitle-1"><v-icon>mdi-map-marker</v-icon>{{ create.address || 'Address' }}</h2>
                    </div>
                    <br>
                    <h2 class="text-h6"><v-icon color="green" class="mr-5">mdi-tag</v-icon>{{ create.price || 'Price' }}/month</h2>
                  </v-col>
                  <v-col cols="12">
                    <h2 class="text-h6">{{ create.description || 'Details' }}</h2>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-container>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style>
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 1.5rem;
  height: 100%;
  width: 100%;
  position: absolute;
}
</style>
