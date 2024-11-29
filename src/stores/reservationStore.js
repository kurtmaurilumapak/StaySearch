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

    async fetchOwnerReservationData() {
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
    },
    async fetchStudentReservationData() {
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
  }
})
