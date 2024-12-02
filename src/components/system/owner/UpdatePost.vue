<script setup>
import { ref, watch, computed } from "vue";
import { usePostStore } from "@/stores/postStore";

const props = defineProps({
  post: Object,
  isOpen: Boolean,
});

const emit = defineEmits(["close", "updated"]);

const postStore = usePostStore();
const confirmDeleteImage = ref(false);
const selectedImageIndex = ref(null);
const selectedImageUrl = ref(null);
const localIsOpen = ref(props.isOpen);
const newImages = ref([]); // New images to be added
const selectedTypes = ref([]); // Selected types
const selectedInclusions = ref([]); // Selected inclusions

const updatePostData = ref({
  id: null,
  name: "",
  address: "",
  price: "",
  description: "",
  images: [],
});

watch(
  () => props.isOpen,
  (newVal) => {
    localIsOpen.value = newVal;
  }
);

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      console.log('Received images:', newPost.images); // Debug log
      console.log('Received post data:', newPost);
      updatePostData.value = {
        id: newPost.id,
        name: newPost.name,
        address: newPost.address,
        price: newPost.price,
        description: newPost.description,
        images: newPost.boarding_house_images.map(img => img.image_url),
      };
      console.log('Images:', updatePostData.value.images);
      // Safely handle tags
      selectedTypes.value = (newPost.tags || [])
        .filter((tag) => tag.tag_name === "type")
        .map((tag) => tag.tag_name);
      selectedInclusions.value = (newPost.tags || [])
        .filter((tag) => tag.tag_name === "inclusion")
        .map((tag) => tag.tag_name);
    }
  },
  { immediate: true }
);

const closeDialog = () => {
  emit("close");
};

const confirmImageRemoval = (index, imageUrl) => {
  selectedImageIndex.value = index;
  selectedImageUrl.value = imageUrl;
  confirmDeleteImage.value = true;
};

const removeImage = async () => {
  try {
    confirmDeleteImage.value = false;

    // Remove from Supabase
    await postStore.removeImageFromPost(
      updatePostData.value.id,
      selectedImageUrl.value
    );

    // Remove locally
    updatePostData.value.images.splice(selectedImageIndex.value, 1);
    selectedImageIndex.value = null;
    selectedImageUrl.value = null;
  } catch (error) {
    console.error("Failed to remove image:", error);
  }
};

const handleFileChange = (event) => {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    newImages.value.push({
      file: files[i],
      preview: URL.createObjectURL(files[i]),
    });
  }
};

const isFormFilled = computed(() => {
  return (
    updatePostData.value.name.trim() &&
    updatePostData.value.address.trim() &&
    updatePostData.value.price &&
    updatePostData.value.description.trim() &&
    selectedTypes.value.length !== 0
  );
});

const saveChanges = async () => {
  try {
    // Save changes to post
    await postStore.updatePost(
      updatePostData.value.id,
      {
        name: updatePostData.value.name,
        address: updatePostData.value.address,
        price: updatePostData.value.price,
        description: updatePostData.value.description,
      },
      newImages.value // Pass new images to the store
    );

    // Update tags for the post
    await postStore.updateTagsForPost(
      updatePostData.value.id,
      selectedTypes.value, // Selected types
      selectedInclusions.value // Selected inclusions
    );

    emit("updated", updatePostData.value); // Notify parent about the update
    window.location.reload();
    closeDialog();
  } catch (error) {
    console.error("Failed to save changes:", error);
  }
};
</script>

<template>
  <v-dialog v-model="localIsOpen" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        Edit Post
        <v-spacer />
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="updatePostData.name" label="Name"></v-text-field>
          <v-text-field v-model="updatePostData.address" label="Address"></v-text-field>
          <v-text-field
            v-model="updatePostData.price"
            label="Price"
            type="number"
          ></v-text-field>
          <v-textarea v-model="updatePostData.description" label="Description"></v-textarea>
          <v-col cols="6">
            <v-select
              v-model="selectedTypes"
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
              v-model="selectedInclusions"
              label="Free WiFi"
            ></v-checkbox>
            <v-checkbox
              color="green-darken-1"
              :value="'Free Water'"
              v-model="selectedInclusions"
              label="Free Water"
            ></v-checkbox>
            <v-checkbox
              color="green-darken-1"
              :value="'Free Electricity'"
              v-model="selectedInclusions"
              label="Free Electricity"
            ></v-checkbox>
          </v-col>

          <div>
            <h4>Images</h4>
            <v-row>
  <v-col
    v-for="(image, index) in updatePostData.images || []"
    :key="index"
    cols="4"
    class="position-relative"
  >
    <v-img
      v-if="image"
      :src="image"
      aspect-ratio="1"
      class="mb-2"
    />
    <v-btn
      small
      icon
      color="red"
      class="position-absolute top-0 right-0"
      @click="confirmImageRemoval(index, image)"
    >
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-col>
</v-row>


            <!-- Display new image previews -->
            <h5>New Images</h5>
            <v-row>
              <v-col
                v-for="(image, index) in newImages"
                :key="'new-' + index"
                cols="4"
                class="position-relative"
              >
                <v-img :src="image.preview" aspect-ratio="1" class="mb-2"></v-img>
              </v-col>
            </v-row>

            <!-- File input for adding new images -->
        
            <v-btn
                      class="text-none"
                      color="green-darken-2"
                      @click="$refs.fileInput.$el.querySelector('input').click()"
                    >
                      <v-icon>mdi-upload</v-icon>
                      Add more images
                    </v-btn>
                    <v-file-input
                      ref="fileInput"
                      accept=".jpg, .jpeg, .png"
                      prepend-icon=false
                      multiple
                      hide-input
                      @change="handleFileChange"
                    >
                    </v-file-input>
            
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          :disabled="!isFormFilled"
          @click="saveChanges"
          style="background-color: green; color: white; font-weight: bold"
        >
          Save Changes
        </v-btn>
        <v-btn @click="closeDialog">Cancel</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="confirmDeleteImage" max-width="500px">
      <v-card>
        <v-card-title>Remove Image</v-card-title>
        <v-card-text>Are you sure you want to remove this image?</v-card-text>
        <v-card-actions>
          <v-btn color="red" @click="removeImage">Yes</v-btn>
          <v-btn @click="confirmDeleteImage = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>
