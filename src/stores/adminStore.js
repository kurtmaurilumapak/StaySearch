import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabaseClient' 

export const useAdminStore = defineStore('adminStore', {
  state: () => ({
    id:'',
    name:'',
    status:'',
    boardinghouse:[],
    postLogs: [], 
    session: null 
  }),
  actions: {

    async fetchBoardData() {
      try {
       
        console.warn('Bypassing session check for testing.');
        const { data, error } = await supabase
          .from('posts_data') 
          .select('*')
          .eq('status', 'pending'); 

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
          .from('posts_data') // Replace with your table name
          .select('*')
          .eq('status', 'approved'); // Fetch only pending cards
    
        if (error) throw error;
    
        console.log('Fetched data:', data); 
        this.boardinghouse = data;
      } catch (error) {
        console.error('Failed to fetch boarding houses:', error.message);
      }
    },

    
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
    },
    async fetchPostLogs() {
      try {
        const { data, error } = await supabase
          .from('post_logs') 
          .select('id, table_name, action, updated_at, username') 
          .order('updated_at', { ascending: false }); 
    
        if (error) throw error;
    
        console.log('Fetched post logs in descending order:', data); 
        this.postLogs = data;
      } catch (error) {
        console.error('Failed to fetch post logs:', error.message);
      }
    },
    async fetchRecentPosts() {
      try {
        const { data, error } = await supabase
          .from('posts_data') 
          .select('*') 
          .order('created_at', { ascending: false }) 
          .limit(5); 
    
        if (error) throw error;
    
        console.log('Fetched recent posts:', data); 
        this.boardinghouse = data;
      } catch (error) {
        console.error('Failed to fetch recent posts:', error.message);
      }
    }
    ,
  }
})
