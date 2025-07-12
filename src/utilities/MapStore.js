import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// This is for anything not filters
export const useMapStore = create()(
  immer((set) => ({
    locations: [],
    // Does this need to be set like this?
    locationTypes: ["manuscript", "amulet", "inscription", "graffito", "dipinto"],
    
    // Set the above
    setLocations: (locations) =>
      set((state) => {
        state.locations = locations
      }),  
    setLocationTypes: (types) =>
      set((state) => {
        state.locationTypes = types
      }),                                                                                           
  })),
)