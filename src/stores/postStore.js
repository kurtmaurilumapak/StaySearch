// stores/usePostStore.js
import { defineStore } from 'pinia'
import { supabase, formActionDefault } from '@/lib/supabaseClient'



export const usePostStore = defineStore('post', {
  state: () => ({
    id: '',
    name: '',
    posts: [],
    reservations:[],
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
        .eq('tag_name', selectedTypes)


      if (typeError) {
        throw typeError
      }

      const { data: inclusionIds, error: inclusionError } = await supabase
        .from('tags')
        .select('id')
        .in('tag_name', selectedInclusions)

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
          .insert([{ ...reviewData, boarding_house_id: boardingHouseId, user_id: this.id, reviewer_name: this.name }])
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
          .select('*, boarding_house_images(image_url), boarding_house_tags(tag_id, tags(tag_name)), reviews(created_at, comment, rating, reviewer_name)')
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
        .from('posts_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (postError) {
        throw postError
      }

      this.posts = posts
    },
    async updatePost(postId, updatedData, newImages = []) {
      try {
        // Update the post data in the database
        const { data, error } = await supabase
          .from('boarding_houses')
          .update(updatedData)
          .eq('id', postId)
          .select()
          .single();
    
        if (error) {
          throw new Error("Failed to update post: " + error.message);
        }
    
        // If new images are provided, handle their upload
        const imageUrls = [];
        for (let i = 0; i < newImages.length; i++) {
          const { file } = newImages[i];
          const uniqueFileName = `updated_image${i + 1}_${file.name}`;
    
          // Upload image
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('user_images')
            .upload(`owners/${this.id}/${postId}/${uniqueFileName}`, file);
    
          if (uploadError) {
            console.error('Image Upload Error:', uploadError.message);
            throw uploadError;
          }
    
          // Retrieve public URL
          const { data: publicUrlData, error: urlError } = supabase.storage
            .from('user_images')
            .getPublicUrl(uploadData.path);
    
          if (urlError || !publicUrlData?.publicUrl) {
            console.error('Error getting public URL:', urlError?.message || 'No public URL found');
          } else {
            imageUrls.push(publicUrlData.publicUrl);
          }
        }
    
        // Insert new image URLs into the database
        if (imageUrls.length > 0) {
          const postImages = imageUrls.map((image_url) => ({
            boarding_house_id: postId,
            image_url,
          }));
    
          const { error: imagesError } = await supabase
            .from('boarding_house_images')
            .insert(postImages);
    
          if (imagesError) {
            console.error('Error adding new images:', imagesError.message);
            throw imagesError;
          }
        }
    
        // Update the local state to reflect changes
        const postIndex = this.posts.findIndex(post => post.id === postId);
        if (postIndex !== -1) {
          this.posts[postIndex] = {
            ...this.posts[postIndex],
            ...updatedData,
          };
        }
    
        return data;
      } catch (err) {
        console.error("Update Post Error:", err);
        throw err;
      }
    },
    
    async removeImageFromPost(postID, imageUrl) {
      try {
        // Remove from database
        const { data: imageToDelete, error } = await supabase
          .from("boarding_house_images")
          .delete()
          .eq("boarding_house_id", postID)
          .eq("image_url", imageUrl);

        if (error) {
          console.error("Error removing image from DB:", error.message);
          throw error;
        }

        console.log("Image removed successfully:", imageToDelete);
      } catch (error) {
        console.error("Error in removeImageFromPost:", error.message);
        throw error;
      }
    },
    async updateTagsForPost(postId, selectedTypes, selectedInclusions) {
      try {
        // First, remove existing tags
        const { error: removeError } = await supabase
          .from('boarding_house_tags')
          .delete()
          .eq('boarding_house_id', postId)

        if (removeError) {
          throw removeError
        }

        // Insert new tags (types and inclusions)
        const boardingHouseTags = []
        const { data: typeIds, error: typeError } = await supabase
          .from('tags')
          .select('id')
          .eq('tag_name', selectedTypes)

        if (typeError) {
          throw typeError
        }

        const { data: inclusionIds, error: inclusionError } = await supabase
          .from('tags')
          .select('id')
          .in('tag_name', selectedInclusions)

        if (inclusionError) {
          throw inclusionError
        }

        if (typeIds) {
          typeIds.forEach(tag => {
            boardingHouseTags.push({
              boarding_house_id: postId,
              tag_id: tag.id,
            })
          })
        }

        if (inclusionIds) {
          inclusionIds.forEach(tag => {
            boardingHouseTags.push({
              boarding_house_id: postId,
              tag_id: tag.id,
            })
          })
        }

        // Insert new tags into boarding_house_tags
        const { error: tagsError } = await supabase
          .from('boarding_house_tags')
          .insert(boardingHouseTags)

        if (tagsError) {
          throw tagsError
        }

        return true
      } catch (error) {
        console.error("Error updating tags:", error)
        throw error
      }
    },
    async deletePost(postID) {
      const { error } = await supabase.from('boarding_houses').delete().eq('id', postID)

      if (error) throw error
    },
    async addReservation(postID, reservationData) {
      const session = await this.fetchSession()
      if (session?.user) {
        this.id = session.user.id || ''
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert([{ checkin_date: reservationData, boarding_house_id: postID, user_id: this.id }])


      if (error) throw error
      return data
    },
    async showReservations() {
      const session = await this.fetchSession()
      if (session?.user) {
        this.id = session.user.id || ''

        const { data: reservationData, error: reservationError } = await supabase
          .from('reservations')
          .select('checkin_date, boarding_houses(name, address)')
          .eq('user_id', this.id)


        if (reservationError) throw reservationError

        this.reservations = reservationData
        console.log(reservationData)
      }else {
        throw new Error('User  not authenticated')
      }
    }

  }
})