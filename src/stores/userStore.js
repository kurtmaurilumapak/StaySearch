import { defineStore } from 'pinia'
import { supabase, formActionDefault } from '@/lib/supabaseClient'

const userDataDefault = {
  id: '',
  theme: 'light',
  firstname: '',
  lastname: '',
  email: '',
  role: '',
  picture: '',
};

export const useUserStore = defineStore('userData', {
  state: () => ({
    userData: { ...userDataDefault },
    formAction: { ...formActionDefault }
  }),
  actions: {
    async fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        this.userData.id = session.user.id || ''
        this.userData.firstname = session.user.user_metadata.firstname || ''
        this.userData.lastname = session.user.user_metadata.lastname || ''
        this.userData.name = session.user.user_metadata.name || ''
        this.userData.email = session.user.email || ''
        this.userData.role = session.user.user_metadata.role || ''
        this.userData.theme = session.user.user_metadata.theme || 'light'
        this.userData.picture = session.user.user_metadata.picture || '/csu.png'
      }
    },

    async updateTheme(newTheme) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: { theme: newTheme },
        })
        if (error) {
          console.error('Error updating theme:', error)
        } else {
          this.userData.theme = newTheme
        }
      } catch (error) {
        console.error('Error updating user:', error)
      }
    },

    async updateUser() {
      const userId = this.userData.id;
      if (!userId) {
        console.error('No user is currently authenticated.')
        return false
      }

      try {
        const { error } = await supabase.auth.updateUser({
          email: this.userData.email,
          data: {
            firstname: this.userData.firstname,
            lastname:  this.userData.lastname,
            picture: this.userData.picture,
          },
        })

        if (error) {
          console.error('Error updating data:', error)
          return false
        }
        else {
          console.log('User data updated successfully')
          await this.fetchUserData();
          return true
        }

      } catch (error) {
        console.error('Error during user update:', error)
        return false
      }
    },

    async updatePassword(newPassword) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        })

        if (error) {
          console.error('Error updating password:', error)
          return false
        }

        console.log('Password updated successfully')
        return true
      } catch (error) {
        console.error('Error during password update:', error)
        return false
      }
    },
    async resetPassword() {
      this.formAction.formProcess = true
      this.formAction.formErrorMessage = ''
      this.formAction.formSuccessMessage = ''

      if (!this.userData.email) {
        this.formAction.formErrorMessage = 'Email is required'
        this.formAction.formProcess = false
        return
      }

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(this.userData.email)
        if (error) {
          this.formAction.formErrorMessage = `Error: ${error.message}`
        } else {
          this.formAction.formSuccessMessage = 'Password reset email has been sent. Please check your inbox.'
          this.email = '' // Clear the email input field
        }
      } catch (err) {
        this.formAction.formErrorMessage = `Error: ${err.message}`
      }

      this.formAction.formProcess = false
    },

    async uploadProfilePicture(file) {
      if (!file) {
        console.error('No file provided.');
        return null;
      }

      try {
        const userId = this.userData.id;
        if (!userId) {
          console.error('No user is authenticated.');
          return null;
        }
     
        const timestamp = Date.now();
        const uniqueFileName = `profile_${userId}_${timestamp}_${file.name}`;

        
        const { data: uploadData , error: uploadError } = await supabase.storage
          .from('user_images') 
          .upload(`user_profiles/${userId}/${uniqueFileName}`, file ,{
            cacheControl: '3600',
            upsert: false,
          });

          if (uploadError) {
            console.error('Image Upload Error:', uploadError.message);
            throw uploadError
          }

          const { data: publicUrl, error: publicUrlError } = supabase.storage
          .from('user_images') // Replace with your bucket name
          .getPublicUrl(uploadData.path);
        
        if (publicUrlError) {
          console.error('Failed to retrieve public URL:', publicUrlError.message);
          return null;
        }
        
        if (!publicUrl) {
          console.error('Public URL data is null.');
          return null;
        }
        
        
        this.userData.picture = publicUrl.publicUrl;
        const updateSuccess = await this.updateUser();


    if (!updateSuccess) {
      console.error('Failed to update user profile picture.');
      return null;
    }

    console.log('Profile picture updated successfully.');
        return publicUrl;
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        return null;
      }
    },
    async updatePicture(newPictureUrl) {
      try {
        const { error } = await supabase.auth.updateUser({
          data: { picture: newPictureUrl },
        });

        if (error) {
          console.error('Error updating user picture:', error.message);
          return false;
        }

        console.log('Profile picture updated successfully in metadata.');
        this.userData.picture = newPictureUrl; // Update store state
        return true;
      } catch (error) {
        console.error('Error during picture update:', error.message);
        return false;
      }
    },

  },
})