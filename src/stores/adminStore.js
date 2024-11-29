import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient' // Ensure this is correctly set up

export const useAdminStore = defineStore('adminStore', {
  state: () => ({
    id:'',
    name:'',
    status:'',
    boardinghouse:[],
    session: null // Store user session
  }),
  actions: {
    // Fetch cards from the Supabase database
    async fetchBoardData() {
      try {
        // Skip session validation for testing
        console.warn('Bypassing session check for testing.');
        const { data, error } = await supabase
          .from('boarding_houses') // Replace with your table name
          .select('*')
          .eq('status', 'pending'); // Fetch only pending cards
    
        if (error) throw error;
    
        console.log('Fetched data:', data); // Log fetched data for debugging
        this.boardinghouse = data;
      } catch (error) {
        console.error('Failed to fetch boarding houses:', error.message);
      }
    },

    async fetchBoardData2() {
      try {
        // Skip session validation for testing
        console.warn('Bypassing session check for testing.');
        const { data, error } = await supabase
          .from('boarding_houses') // Replace with your table name
          .select('*')
          .eq('status', 'approved'); // Fetch only pending cards
    
        if (error) throw error;
    
        console.log('Fetched data:', data); // Log fetched data for debugging
        this.boardinghouse = data;
      } catch (error) {
        console.error('Failed to fetch boarding houses:', error.message);
      }
    },

    // Approve a card and update its status in Supabase
    async approveCard(boardinghouseID) {
      try {
        const { error } = await supabase
          .from('boarding_houses') // Replace with your table name
          .update({ status: 'approved' }) // Update status to approved
          .eq('id', boardinghouseID); // Match the card by ID
    
        if (error) throw error;
    
        // Remove approved card from local state
        this.boardinghouse = this.boardinghouse.filter((boardinghouse) => boardinghouse.id !== boardinghouseID);
      } catch (error) {
        console.error('Failed to approve card:', error.message);
      }
    },
    
    // Reject a card and update its status in Supabase
    async rejectCard(boardinghouseID) {
      try {
        const { error } = await supabase
          .from('boarding_houses') // Replace with your table name
          .delete() // Remove from database
          .eq('id', boardinghouseID); // Match the card by ID
    
        if (error) throw error;
    
        // Remove rejected card from local state
        this.boardinghouse = this.boardinghouse.filter((boardinghouse) => boardinghouse.id !== boardinghouseID);
      } catch (error) {
        console.error('Failed to reject card:', error.message);
      }
    }
  }
})
