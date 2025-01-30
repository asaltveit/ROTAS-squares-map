import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'


export const useLocationStore = create()(
  immer((set) => ({
    // Does locations need to be stored here?
    //locations: [],
    filters: {
      type: null,
      script: null,
      text: null,
      first_word: null,
      place: null,
      location: null,
      longitude: null,
      latitude: null,
    },
    newType: null,
    // TODO: manually get list of types from locations?
    types: ["manuscript", "amulet", "inscription", "graffito", "dipinto"],
    yearType: "created",
    // yearType functions
    setYearType: (type) =>
        set((state) => {
          state.yearType = type
        }),
    // locations function
    /*setLocations: (locations) =>
        set((state) => {
          state.locations = locations
        }),*/
    // types functions
    setTypes: (types) =>
        set((state) => {
          state.types = types
        }),
    addType: (type) =>
        set((state) => {
          state.types.push(type)
        }),
    // For the future
    removeType: (type) =>
        set((state) => {
          state.types.filter((t) => {
            return t == type
          })
        }),
    // newType functions
    setNewTypeFilter: (type) =>
        set((state) => {
          state.newType = type
        }),
    // filters functions
    setTypeFilter: (type) =>
      set((state) => {
        state.filters.type = type
      }),
    setScriptFilter: (script) =>
        set((state) => {
            state.filters.script = script
        }),
    setTextFilter: (text) =>
        set((state) => {
            state.filters.text = text
        }),
    setFirstWordFilter: (first_word) =>
        set((state) => {
            state.filters.first_word = first_word
        }),
    setPlaceFilter: (place) =>
        set((state) => {
            state.filters.place = place
        }),
    setLocationFilter: (location) =>
        set((state) => {
            state.filters.location = location
        }),
    setLongitudeFilter: (longitude) =>
        set((state) => {
            state.filters.longitude = longitude
        }),
    setLatitudeFilter: (latitude) =>
        set((state) => {
            state.filters.latitude = latitude
        }),
    clearFilters: () =>
        set((state) => {
            state.filters = {
                type: null,
                script: null,
                text: null,
                first_word: null,
                place: null,
                location: null,
                longitude: null,
                latitude: null,
              }
        }),
                                                                                                        
  })),
)