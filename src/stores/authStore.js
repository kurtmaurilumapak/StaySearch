
import { defineStore } from 'pinia'
import { supabase, formActionDefault } from '@/lib/supabaseClient'

const formDataDefault = {
  role: 'student',
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    formData: { ...formDataDefault },
    formAction: { ...formActionDefault }
  }),
  actions: {
    // SIGNUP
    async signUp() {
      this.formAction.formProcess = true;
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const { data, error } = await supabase.auth.signUp({
        email: this.formData.email,
        password: this.formData.password,
        options: {
          data: {
            role: this.formData.role,
            firstname: this.formData.firstname,
            lastname: this.formData.lastname,
          },
        },
      });

      if (error) {
        this.formAction.formErrorMessage = error.message;
      } else if (data){
        console.log('Successfully created an account.')
        this.formAction.formSuccessMessage = 'Successfully created an account.'
        this.formAction.formProcess = false
      }

    },

    // LOGIN
    async signIn() {
      this.formAction.formProcess = true

      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.formData.email,
        password: this.formData.password,
      })

      if (error) {
        this.formAction.formErrorMessage = 'Wrong email or password.'

      } else {
        console.log('successfully logged in.')
        this.formAction.formProcess = false
      }
      return { data, error }
    },

    async signInWithGoogle() {
      const { user, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })

      if (error) {
        console.error('Error signing in with Google:', error.message)
        this.formAction.formErrorMessage = error.message
        return
      }

      console.log('Successfully signed in with Google:', user)

      this.formAction.formSuccessMessage = 'Successfully logged in with Google.'
    },



    // SIGN OUT
    async signOut() {
      this.formAction.formProcess = true
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.log(error)

      } else {
        console.log('Successfully logged out.')
        this.formAction.formProcess = false
      }
    },

    // FORM RESET
    resetForm() {
      this.formData = {...formDataDefault}
      this.formAction.formErrorMessage = ''
      this.formAction.formSuccessMessage = ''
    },
  },
})
