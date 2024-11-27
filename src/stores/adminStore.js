import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabaseClient'; // Ensure this is correctly set up

export const useAdminStore = defineStore('adminStore', {
  state: () => ({
    cards: [], // List of cards to approve/reject
    session: null, // Store user session
  }),
  actions: {
    // Fetch cards from the Supabase database
    async fetchCards() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        this.session = session;

        if (session) {
          const { data, error } = await supabase
            .from('boarding_houses') // Replace with your table name
            .select('*')
            .eq('status', 'pending'); // Fetch only pending cards

          if (error) throw error;

          this.cards = data || [];
        } else {
          console.error('User session not found.');
        }
      } catch (error) {
        console.error('Failed to fetch cards:', error.message);
      }
    },

    // Approve a card and update its status in Supabase
    async approveCard(cardId) {
      try {
        const { error } = await supabase
          .from('boarding_houses') // Replace with your table name
          .update({ status: 'approved' }) // Update status to approved
          .eq('id', cardId); // Match the card by ID

        if (error) throw error;

        // Remove approved card from local state
        this.cards = this.cards.filter(card => card.id !== cardId);
      } catch (error) {
        console.error('Failed to approve card:', error.message);
      }
    },

    // Reject a card and update its status in Supabase
    async rejectCard(cardId) {
      try {
        const { error } = await supabase
          .from('boarding_houses') // Replace with your table name
          .update({ status: 'rejected' }) // Update status to rejected
          .eq('id', cardId); // Match the card by ID

        if (error) throw error;

        // Remove rejected card from local state
        this.cards = this.cards.filter(card => card.id !== cardId);
      } catch (error) {
        console.error('Failed to reject card:', error.message);
      }
    },
  },
});
