// stores/usePostStore.js
import { defineStore } from 'pinia'
import { supabase, formActionDefault } from '@/lib/supabaseClient'



export const usePostStore = defineStore('post', {
  state: () => ({
    id: '',
    name: '',
    posts: [],
    currentPage: 1,
    postsPerPage: 15,
    formAction: {...formActionDefault},
    session: null
  }),
  actions: {
    async fetchSession() {
      if (!this.session) {
        const { data: { session } } = await supabase.auth.getSession()
        this.session = session
      }
      return this.session
    },

    async createPost(postData, images, selectedTypes, selectedInclusions) {
      this.formAction.formProcess = true;

      const session = await this.fetchSession()
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
        const uniqueFileName = `image${i + 1}_${file.name}`

        // Upload image
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('user_images')
          .upload(`owners/${ this.id }/${ createdPost.id }/${uniqueFileName}`, file)

        if (uploadError) {
          console.error('Image Upload Error:', uploadError.message);
          throw uploadError
        }

        // Retrieve public URL
        const { data: publicUrlData, error: urlError } = supabase.storage
          .from('user_images')
          .getPublicUrl(uploadData.path)

        if (urlError || !publicUrlData?.publicUrl) {
          console.error('Error getting public URL:', urlError?.message || 'No public URL found');
        } else {
          imageUrls.push(publicUrlData.publicUrl)
        }
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
        .eq('name', selectedTypes)


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
    },

    async addReview (reviewData, boardingHouseId) {
      this.formAction.formProcess = true
      const session = await this.fetchSession()
      if (session?.user) {
        this.id = session.user.id || ''
        this.name = session.user.user_metadata.firstname + " " + session.user.user_metadata.lastname

        const { data: review, error: reviewError } = await supabase
          .from('reviews')
          .insert([{ ...reviewData, boarding_house_id: boardingHouseId, user_id: this.id, name: this.name }])
          .select()
          .single()

        if (reviewError) {
          console.error('Error adding review:', reviewError.message)
          throw new Error('Failed to add review')
        }

        this.formAction.formProcess = false
        return review
      }
    },

    async ownerPost() {
      const session = await this.fetchSession()
      if (session?.user) {
        this.id = session.user.id || ''

        const { data: posts, error: postError } = await supabase
          .from('boarding_houses')
          .select('*, boarding_house_images(image_url), boarding_house_tags(tag_id, tags(name))')
          .eq('user_id', this.id)


        if (postError) {
          throw postError
        }

        this.posts = posts
      } else {
        throw new Error('User  not authenticated')
      }
    },

    async allPost() {
      const { data: posts, error: postError } = await supabase
        .from('boarding_houses')
        .select('*, boarding_house_images(image_url), boarding_house_tags(tag_id, tags(name)), reviews(comment, rating, name)')
        .range((this.currentPage - 1) * this.postsPerPage, this.currentPage * this.postsPerPage - 1);


      if (postError) {
        throw postError
      }

      this.posts.push(...posts);
    },
    async fetchMorePosts() {
      this.formAction.formProcess = true
      this.currentPage += 1; // Increment the current page
      await this.allPost(); // Fetch the new posts
      this.formAction.formProcess = false
    },
  }
})