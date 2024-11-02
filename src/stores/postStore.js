// stores/usePostStore.js
import { defineStore } from 'pinia'
import { supabase, formActionDefault } from '@/lib/supabaseClient'



export const usePostStore = defineStore('post', {
  state: () => ({
    id: '',
    posts: [],
    formAction: {...formActionDefault},
  }),
  actions: {
    async createPost(postData, images, selectedTypes, selectedInclusions) {
      this.formAction.formProcess = true;

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        this.id = session.user.id || ''
      }

      const { data: createdPost, error: postError } = await supabase
        .from('boarding_houses')
        .insert([{ ...postData, status: 'pending', user_id: this.id }])
        .select()
        .single()

      if (postError) {
        console.error('Post Insertion Error:', postError.message);
        throw new Error("Post insertion failed: " + postError.message);
      }

      const imageUrls = []
      for (let i = 0; i < images.length; i++) {
        const { file } = images[i]

        const uniqueFileName = `image${i + 1}_${file.name}`;

        const { data, error } = await supabase.storage
          .from('user_images')
          .upload(`owners/${ this.id }/${ createdPost.id }/${uniqueFileName}`, file)

        if (error) {
          throw error
        }

        const { publicURL } = supabase.storage
          .from('user_images')
          .getPublicUrl(data.path)

        if (!publicURL) {
          console.error('Public URL generation failed:', data.path);
          throw new Error("Failed to get public URL for image: " + data.path);
        }
        imageUrls.push(publicURL);
      }

      const postImages = imageUrls.map(image_url => ({
        boarding_house_id: createdPost.id,
        image_url,
      }))

      const { error: imagesError } = await supabase
        .from('boarding_house_images')
        .insert(postImages)

      if (imagesError) {
        throw imagesError
      }


      // INSERT TAGS TO THE POST
      const boardingHouseTags = []

      const { data: typeIds, error: typeError } = await supabase
        .from('tags')
        .select('id')
        .in('name', selectedTypes)


      if (typeError) {
        throw typeError
      }

      const { data: inclusionIds, error: inclusionError } = await supabase
        .from('tags')
        .select('id')
        .in('name', selectedInclusions)

      if (inclusionError) {
        throw inclusionError
      }

      if (typeIds) {
        typeIds.forEach(tag => {
          boardingHouseTags.push({
            boarding_house_id: createdPost.id,
            tag_id: tag.id,
          })
        })
      }


      if (inclusionIds) {
        inclusionIds.forEach(tag => {
          boardingHouseTags.push({
            boarding_house_id: createdPost.id,
            tag_id: tag.id,
          })
        })
      }

      const { error: tagsError } = await supabase
        .from('boarding_house_tags')
        .insert(boardingHouseTags)

      if (tagsError) {
        throw tagsError
      }

      this.formAction.formProcess = false
      return createdPost
    }
  }
})