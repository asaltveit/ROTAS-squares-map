import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// This is for anything not filters
export const useMapStore = create()(
  immer((set) => ({
    locations: [],
    formSubmitted: 0,
    filtersSubmitted: 0, // Is this needed?
    selectedPoint: '', // Select by clicking on map
    // Does this need to be set like this?
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
    updateFiltersSubmitted: () => 
      // Just increment for change, so that setting to false doesn't rerun?
      set((state) => {
          state.filtersSubmitted++
        }),
    setSelectedPoint: (point) =>
      set((state) => {
        state.selectedPoint = point
    }),
    setLocationTypes: (types) =>
      set((state) => {
        state.locationTypes = types
      }),                                                                                           
  })),
)