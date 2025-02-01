import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { yearType } from '../constants/FilterSection'


export const useFilterStore = create()(
  immer((set) => ({
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
    // 6 below are fetched
    optionTypes: ["manuscript", "amulet", "inscription", "graffito", "dipinto"],
    scripts: null,
    texts: null,
    locs: null,
    firstWords: null,
    places: null,
    yearType: yearType.created, // "created" vs "discovered"
    // Lists of values to be turned into options (for fetched fields)
    setOptionTypes: (types) =>
        set((state) => {
          state.optionTypes = types
        }),  
    setFirstWords: (firstWords) =>
      set((state) => {
        state.firstWords = firstWords
      }
    ),
    setScripts: (scripts) =>
      set((state) => {
        state.scripts = scripts
      }
    ),
    setTexts: (texts) =>
      set((state) => {
        state.texts = texts
      }
    ),
    setLocs: (locs) =>
      set((state) => {
        state.locs = locs
      }
    ),
    setPlaces: (places) =>
      set((state) => {
        state.places = places
      }
    ),
    // Set filters to be searched
    setYearType: (type) =>
        set((state) => {
          state.yearType = type
        }),
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
    // Do we want these?
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