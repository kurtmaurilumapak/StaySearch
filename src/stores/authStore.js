
import { defineStore } from 'pinia';
import { supabase, formActionDefault } from '@/lib/supabaseClient';

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
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
        console.log(data)
        this.formAction.formSuccessMessage = 'Successfully created an account.'
      }
      this.formAction.formProcess = false;
    },

    // LOGIN
    async signIn() {
      this.formAction.formProcess = true;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: this.formData.email,
        password: this.formData.password,
      });

      if (error) {
        this.formAction.formErrorMessage = 'Wrong email or password.';

      } else {
        console.log('successfully logged in.');
      }
      this.formAction.formProcess = false;
      return { data, error };
    },

    // FORM RESET
    resetForm() {
      this.formData = {...formDataDefault};
      this.formAction.formErrorMessage = '';
      this.formAction.formSuccessMessage = '';
    },
  },
});
