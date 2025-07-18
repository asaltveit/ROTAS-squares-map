import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// This is for anything not filters
export const useMapStore = create()(
  immer((set) => ({
    locations: [],
    // Does this need to be set like this?
    locationTypes: ["manuscript", "amulet", "inscription", "graffito", "dipinto"],
    playAnimation: () => {}, // TODO: fix - state problems
    scrollToMap: () => {},
    
    // Set the above
    setLocations: (locations) =>
      set((state) => {
        state.locations = locations
      }),  
    setLocationTypes: (types) =>
      set((state) => {
        state.locationTypes = types
      }),
    setStorePlayAnimation: (func) =>
      set((state) => {
        state.playAnimation = func
      }),  
    setScrollToMap: (func) =>
      set((state) => {
        state.scrollToMap = func
      }),                                                                                       
  })),
)