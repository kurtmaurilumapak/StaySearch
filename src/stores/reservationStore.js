import { defineStore } from 'pinia'
import { supabase, formActionDefault } from '@/lib/supabaseClient'

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    id: '',
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

    async fetchReservationData() {
      const session = await this.fetchSession()
      if (session?.user) {
        this.id = session.user.id || ''
      }

      const { data: reservationData, error: reservationError } = await supabase
        .from('reservations_view')
        .select('*')
        .eq('owner_id', this.id)



      if (reservationError) throw reservationError

      this.reservations = reservationData
    }
  }
})
