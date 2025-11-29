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
        const { data, error } = await supabase
          .from('admin_posts_data')
          .select('*')
          .eq('status', 'pending'); 

        if (error) throw error;
    
        console.log('Fetched data:', data);
        this.boardinghouse = data;
      } catch (error) {
        console.error('Failed to fetch boarding houses:', error.message);
      }
    },

    async fetchBoardData2() {
      try {
        const { data, error } = await supabase
          .from('admin_posts_data')
          .select('*')
          .eq('status', 'approved'); // This already excludes 'deleted' status
    
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
          .from('boarding_houses')
          .update({ status: 'approved' })
          .eq('id', boardinghouseID);
    
        if (error) throw error;
    
        this.boardinghouse = this.boardinghouse.filter((boardinghouse) => boardinghouse.id !== boardinghouseID);
      } catch (error) {
        console.error('Failed to approve card:', error.message);
      }
    },
    
    async rejectCard(boardinghouseID) {
      try {
        const { error } = await supabase
          .from('boarding_houses')
          .delete()
          .eq('id', boardinghouseID);
    
        if (error) throw error;
    
        this.boardinghouse = this.boardinghouse.filter((boardinghouse) => boardinghouse.id !== boardinghouseID);
      } catch (error) {
        console.error('Failed to reject card:', error.message);
      }
    },

    // Soft delete function - marks post as deleted instead of removing
    async deletePost(boardinghouseID) {
      try {
        // Update status to 'deleted' instead of actually deleting
        const { error } = await supabase
          .from('boarding_houses')
          .update({ 
            status: 'deleted',
            deleted_at: new Date().toISOString()
          })
          .eq('id', boardinghouseID);
    
        if (error) throw error;
    
        // Remove from local state (since we only show approved posts)
        this.boardinghouse = this.boardinghouse.filter((boardinghouse) => boardinghouse.id !== boardinghouseID);
        
        console.log('Post marked as deleted successfully');
        return { success: true };
      } catch (error) {
        console.error('Failed to delete post:', error.message);
        return { success: false, error: error.message };
      }
    },

    async fetchPostLogs() {
      try {
        const { data, error } = await supabase
          .from('post_logs_view')
          .select('*')
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
          .from('admin_posts_data')
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
  }
})