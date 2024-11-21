<script setup>
import { ref, watch } from "vue";
import { usePostStore } from "@/stores/postStore";

const props = defineProps({
  post: Object,
  isOpen: Boolean,
})

const emit = defineEmits(["close", "updated"]);

const postStore = usePostStore();
const confirmDeleteImage = ref(false);
const selectedImageIndex = ref(null);
const selectedImageUrl = ref(null);
const localIsOpen = ref(props.isOpen);

const updatePostData = ref({
  id: null,
  name: "",
  address: "",
  price: "",
  description: "",
  images: [],
})

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
      updatePostData.value = {
        id: newPost.id,
        name: newPost.name,
        address: newPost.address,
        price: newPost.price,
        description: newPost.description,
        images: newPost.boarding_house_images.map((image) => image.image_url),
      };
    }
  },
  { immediate: true }
)

const closeDialog = () => {
  emit("close");
};

const confirmImageRemoval = (index, imageUrl) => {
  selectedImageIndex.value = index;
  selectedImageUrl.value = imageUrl;
  confirmDeleteImage.value = true;
}

const removeImage = async () => {
  try {
    confirmDeleteImage.value = false;

    // Remove from Supabase
    await postStore.removeImageFromPost(updatePostData.value.id, selectedImageUrl.value);

    // Remove locally
    updatePostData.value.images.splice(selectedImageIndex.value, 1);
    selectedImageIndex.value = null;
    selectedImageUrl.value = null;
  } catch (error) {
    console.error("Failed to remove image:", error);
  }
}

const saveChanges = async () => {
  try {
    await postStore.updatePost(updatePostData.value.id, {
      name: updatePostData.value.name,
      address: updatePostData.value.address,
      price: updatePostData.value.price,
      description: updatePostData.value.description,
    });

    emit("updated", updatePostData.value); // Notify parent about the update
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
          <v-text-field
            v-model="updatePostData.name"
            label="Name"
          ></v-text-field>
          <v-text-field
            v-model="updatePostData.address"
            label="Address"
          ></v-text-field>
          <v-text-field
            v-model="updatePostData.price"
            label="Price"
            type="number"
          ></v-text-field>
          <v-textarea
            v-model="updatePostData.description"
            label="Description"
          ></v-textarea>
          <div>
            <h4>Images</h4>
            <v-row>
              <v-col
                v-for="(image, index) in updatePostData.images"
                :key="index"
                cols="4"
                class="position-relative"
              >
                <v-img :src="image" aspect-ratio="1" class="mb-2"></v-img>
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
          </div>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveChanges">Save</v-btn>
        <v-btn text @click="closeDialog">Cancel</v-btn>
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