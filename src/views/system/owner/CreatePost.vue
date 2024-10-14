<script setup>
import { ref } from 'vue'

const create = ref({
  images: [],
  price: '',
  name: '',
  detail: '',
  type: '',
  utilities: {
    electricity: '',
    water: '',
    wifi: ''
  },
  leaveCreatePage: false
})

const currentIndex = ref(0)

const handleFiles = (event) => {
  const selectedFiles = event.target.files
  Array.from(selectedFiles).forEach((file) => {
    create.value.images.push({ file, url: URL.createObjectURL(file) })
  })
}
const handleDrop = (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  Array.from(files).forEach((file) => {
    create.value.images.push({ file, url: URL.createObjectURL(file) });
  });
}
const clearimg = (index) => {
  create.value.images.splice(index, 1)
}


</script>


<template>
    <v-row style="height: 100vh; overflow: hidden">
      <!-- POSTING MENU -->
      <v-col cols="12" md="3">
        <v-card style="height: 100vh;"
        >
          <v-card-title class="d-flex align-center border py-3">
            <v-btn
              fab icon
              @click="create.leaveCreatePage = true"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <div class="d-flex justify-center" style="flex-grow: 1">
              <span class="font-weight-bold">Create Post</span>
            </div>
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
              <v-card-text>Are you sure you want to leave? Your changes will be lost if you leave this page.</v-card-text>
              <v-card-actions>
                <v-btn color="primary" class="font-weight-bold" @click="$router.push('/owner/post')">Leave</v-btn>
                <v-btn color="error" class="font-weight-bold" @click="create.leaveCreatePage = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <v-card-text
            style="height: calc(100vh - 120px); overflow-y: auto; padding: 20px;"
          >
            <v-row>
              <v-col cols="12">
                <v-btn
                  color="green-darken-2"
                  @click="$refs.fileInput.$el.querySelector('input').click()"
                >
                  Add photos
                </v-btn>
                <v-file-input
                  ref="fileInput"
                  v-model="create.file"
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
                  max-width="400"
                  elevation="0"
                  style="border: black dashed 2px; border-radius: 10px"
                  color="grey-lighten-3"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <v-card-text class="d-flex ga-2">
                    <v-row>
                      <v-col cols="3" v-for="(file, index) in create.images" :key="index">
                        <v-img
                          :src="file.url"
                          max-width="100"
                          max-height="100"
                        >
                          <v-icon
                            style="position: absolute; top: 0; right: 0"
                            color="black"
                            @click.stop="clearimg(index); $refs.fileInput.$el.querySelector('input').value = ''"
                          >mdi-close</v-icon>
                        </v-img>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
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
                  v-model="create.price"
                  variant="outlined"
                  label="Price"
                  prepend-icon="mdi-currency-php"
                  v-mask="'#,###'"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="create.detail"
                  color="green-darken-1"
                  label="Description"
                  variant="outlined"
                  auto-grow
                ></v-textarea>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="create.type"
                  label="Select"
                  :items="['All Boys', 'All Girls', 'Mix']"
                  clearable
                ></v-select>
              </v-col>
              <v-col cols="6">
                <h2>Inclusion</h2>
                <v-checkbox v-model="create.utilities.electricity" label="Electricity" value="Electricity"></v-checkbox>
                <v-checkbox v-model="create.utilities.water" label="Water" value="Water"></v-checkbox>
                <v-checkbox v-model="create.utilities.wifi" label="Wifi" value="Wifi"></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end" style="position: sticky; bottom: 0; background-color: white;">
            <v-btn
              type="submit"
              style="background-color: green; color: white; font-weight: bold"
              block
            >
              Post
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- PREVIEW -->
      <v-col cols="12" md="9" class="d-flex justify-center align-center">
        <v-container max-width="900" class="border" style="border-radius: 10px">
          <span class="font-weight-bold">Preview</span>
          <v-card>
            <v-card-text class="border" style="border-radius: 10px">
              <v-row>
                <v-col>
                  <div v-if="create.images.length" class="d-flex flex-wrap mt-4">
                    <v-carousel
                      v-model="currentIndex"
                    >
                      <div
                        v-if="create.images.length"
                        :style="{ backgroundImage: `url(${create.images[currentIndex].url})`, filter: 'blur(13px)' }"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; z-index: -1"
                      ></div>
                      <v-carousel-item
                        v-for="(image, index) in create.images"
                        :key="index"
                        :src="image.url"
                        alt="Uploaded Image"
                        contain
                        height="100%"
                        width="100%"
                      >
                      </v-carousel-item>
                    </v-carousel>
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
                <v-col>
                  <v-row>
                    <v-col cols="12" class="mt-4">
                      <h1>{{ create.name || 'House Name' }}</h1>
                      <h2><v-icon v-if="create.price" left style="font-size: 20px;">mdi-currency-php</v-icon>{{ create.price || 'Price' }}</h2>
                    </v-col>
                    <v-col cols="12">
                      <h2>{{ create.detail || 'Details' }}</h2>
                    </v-col>
                    <v-col cols="12">
                      <h2>House Type: {{create.type}}</h2>
                    </v-col>
                    <v-col cols="12">
                      <h2>Inclusion: </h2>
                      <h2><v-icon v-if="create.utilities.electricity" left style="font-size: 20px;">mdi-check</v-icon>{{create.utilities.electricity || ''}}</h2>
                      <h2><v-icon v-if="create.utilities.water" left style="font-size: 20px;">mdi-check</v-icon>{{create.utilities.water || ''}}</h2>
                      <h2><v-icon v-if="create.utilities.wifi" left style="font-size: 20px;">mdi-check</v-icon>{{create.utilities.wifi || ''}}</h2>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
</template>


