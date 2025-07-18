import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { yearType as yrType } from '../constants'


export const useFilterStore = create()(
  immer((set) => ({
    filters: {
      location_type: '',
      script: '',
      text: '',
      first_word: '',
      place: '',
      location: '',
      longitude: '',
      latitude: '',
    },
    // 6 below are fetched
    // TODO: why are option types and location types different?
    optionTypes: ["manuscript", "amulet", "inscription", "graffito", "dipinto"],
    scripts: [],
    texts: [],
    locs: [],
    firstWords: [],
    places: [],
    // Timeline years
    yearType: yrType.created, // "created" vs "discovered"
    timelineYear: 0,
    timelineStart: 0,
    timelineEnd: 2100,
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
    setTimelineYear: (year) => 
      set((state) => {
        state.timelineYear = year
      }
    ),
    setTimelineStart: (year) =>
      set((state) => {
        state.timelineStart = year
      }
    ),
    setTimelineEnd: (year) =>
      set((state) => {
        state.timelineEnd = year
      }
    ),
    // Set filters to be searched
    setYearType: (type) =>
        set((state) => {
          state.yearType = type
        }),
    setTypeFilter: (type) =>
      set((state) => {
        state.filters.location_type = type
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
                location_type: '',
                script: '',
                text: '',
                first_word: '',
                place: '',
                location: '',
                longitude: '',
                latitude: '',
// check that the correct fixed_ vs not is getting searched and returned
            }
            state.yearType = yrType.created
            state.timelineStart = 0
            state.timelineEnd = 2100
        }),
                                                                                                        
  })),
)