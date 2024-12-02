import { defineStore } from 'pinia';
import { supabase, formActionDefault } from '@/lib/supabaseClient';

export const useMapStore = defineStore('map', {
  state: () => ({
    boardingHouseCoordinates: [], 
    formAction: { ...formActionDefault },
  }),
  actions: {
    async fetchUserBoardingHouseData() {
      try {
        const { data: mapData, error: mapError } = await supabase
          .from('boarding_houses')
          .select('id,name,latitude, longitude'); 
        if (mapError) throw mapError;

        
        this.boardingHouseCoordinates = mapData.filter(
          (item) => item.latitude !== null && item.longitude !== null
        );
      } catch (error) {
        console.error('Error fetching boarding house data:', error);
      }
    }
  }
});
