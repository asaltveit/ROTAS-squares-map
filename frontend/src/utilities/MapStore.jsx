import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// This is for anything not filters
export const useMapStore = create()(
  immer((set) => ({
    locations: [],
    formSubmitted: 0,
    // Should these be here?
    locationTypes: ["manuscript", "amulet", "inscription", "graffito", "dipinto"],
    
    // Set the above
    setLocations: (locations) =>
      set((state) => {
        state.locations = locations
      }),  
    updateformSubmitted: () => 
      // Just increment for change, so that setting to false doesn't rerun?
      set((state) => {
          state.formSubmitted++
        }),
    setLocationTypes: (types) =>
      set((state) => {
        state.locationTypes = types
      }),                                                                                           
  })),
)