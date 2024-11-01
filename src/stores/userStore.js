import { defineStore } from 'pinia';
import { supabase, formActionDefault } from '@/lib/supabaseClient';

const userDataDefault = {
  id: '',
  theme: 'light',
  firstname: '',
  lastname: '',
  email: '',
  role: '',
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
        this.userData.email = session.user.email || ''
        this.userData.role = session.user.user_metadata.role || ''
        this.userData.theme = session.user.user_metadata.theme || 'light'
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

  },
})