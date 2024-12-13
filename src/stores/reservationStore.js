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
    countMetaObjects() {
      return this.reservations.reduce((total, record) => {
        if (record.reservations && Array.isArray(record.reservations)) {
          return total + record.reservations.length;
        }
        return total;
      }, 0);
    },
    async fetchStudentReservationData() {
      const session = await this.fetchSession()
      if (session?.user) {
        this.id = session.user.id || ''

        const { data: reservationData, error: reservationError } = await supabase
          .rpc('get_reservations_data', { user_id_input: this.id })

        if (reservationError) throw reservationError

        this.reservations = reservationData
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
    async deleteReservation(reservationID) {
      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', reservationID)

      if (error) throw error
    },
  }
})
