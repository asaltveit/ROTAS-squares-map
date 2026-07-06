
// React
import { useState, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Filter, Download } from 'lucide-react';
// Map
import * as Plot from "@observablehq/plot";
import { feature } from "topojson-client";
import geoData from "@/data/countries-geo.json"
// Utilities
import { useMapStore} from '@/stores/MapStore'
import { useFilterStore } from '@/stores/FilterStore';
import { plotPointTitle, estimateLegendHeight, getMapProjection } from '@/utilities/UtilityFunctions';
import { yearType as yrType } from '@/constants';
import { allSymbols } from '@/constants';
// Components
import FilterSection from '@/components/FilterSection';
import RecordingExportSection from '@/components/RecordingExportSection';
import TimelineSlider from '@/components/TimelineSlider';
//import RecordingSection from '@/components/recording/RecordingSection';
// DB
import { supabase } from '@/supabaseClient';
// Analytics (Fingerprint + search_results) — disabled; existing Supabase rows unchanged
// import FingerprintJS from '@sparkstone/fingerprintjs';

// TODO: Endpoints getting called in groups of threes?
export default function App() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const screenshotRef = useRef(null);
  const [visibleLocations, setVisibleLocations] = useState([]);
  const [mapData, setMapData] = useState([]);
  // const [FPResults, setFPResults] = useState({});
  const [mapDimensions, setMapDimensions] = useState({ width: 850, height: 600 });

  const { locations, setLocations, locationTypes, setLocationTypes, setScrollToMap } = useMapStore(
    useShallow((state) => ({ 
      setLocations: state.setLocations, 
      locations: state.locations,
      locationTypes: state.locationTypes,
      setLocationTypes: state.setLocationTypes,
      setScrollToMap: state.setScrollToMap,
    })),
  )

  const { filters, yearType, timelineYear, setTimelineYear, timelineStart, timelineEnd, playAnimation, animationSpeed, animationStep } = useFilterStore(
    useShallow((state) => ({ 
      filters: state.filters, 
      yearType: state.yearType, 
      timelineYear: state.timelineYear,
      setTimelineYear: state.setTimelineYear,
      timelineStart: state.timelineStart,
      timelineEnd: state.timelineEnd,
      playAnimation: state.playAnimation,
      animationSpeed: state.animationSpeed,
      animationStep: state.animationStep,
    })),
  )

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [recordingExportOpen, setRecordingExportOpen] = useState(false);

  useEffect(() => {
    // getVisitorInfo(); // analytics — disabled
    // Sends scroll to ScreenRecorder
    const scrollToElement = () => { // doesn't quite scroll to where I want it
      screenshotRef.current?.scrollIntoView({ behavior: 'smooth' }); // 'smooth' for animated scrolling
    };
    setScrollToMap(scrollToElement)
  }, []);

  // TODO - all gets getting called twice?
  // indiviudal calls for each filter change
  useEffect(() => {
    getLocations();
    // setSearchResults(); // analytics — disabled
  }, [filters, timelineStart, timelineEnd]);

  useEffect(() => {
    getTypes();
  }, []);

  // async function getVisitorInfo() {
  //   const fp = await FingerprintJS.load();
  //   const results = await fp.get();
  //   setFPResults(results);
  // }

  // async function setSearchResults() {
  //   if (FPResults && FPResults.components) {
  //     const resultFilters = Object.keys(filters).reduce(
  //       (r, key) => (filters[key] && (r[key] = filters[key]), r),
  //       {},
  //     );
  //     const notNullResultFilters = Object.keys(resultFilters);
  //     let filter = null;
  //     if (notNullResultFilters.length) {
  //       filter = notNullResultFilters[0];
  //     }
  //     const data = {
  //       timezone: FPResults.components.timezone.value,
  //       visitorId: FPResults.visitorId,
  //       platform: FPResults.components.platform.value,
  //       filter_type: filter,
  //       language: FPResults.components.languages.value[0][0],
  //       filter_value: resultFilters[filter],
  //     };
  //     await supabase.from('search_results').insert(data);
  //   }
  // }

  async function getLocations() {
    let resultFilters = Object
        .keys(filters)
        .reduce((r,key) => 
          (filters[key] && (r[key]=filters[key]), r),{})

    if (Object.keys(resultFilters).length > 0) {
      const { data, error } = await supabase.from("locations")
      .select().match(resultFilters)
      .gte('created_year_start', timelineStart)
      .or(`created_year_end.is.null,created_year_end.lte.${timelineEnd}`);
      
      if (error) {
        console.error("getLocations filters error: ", error)
      } else {
        setLocations(data);
      }
    } else {
      const { data, error } = await supabase.from("locations")
      .select()
      .gte('created_year_start', timelineStart)
      .or(`created_year_end.is.null,created_year_end.lte.${timelineEnd}`);
      
      if (error) {
        console.error("getLocations without filters error: ", error)
      } else {
        setLocations(data);
      }
    }
  }

  async function getTypes() {
    const { data, error } = await supabase.rpc('get_distinct_type');
    if (error) {
      console.error("getTypes error: ", error)
    } else {
      setLocationTypes(data);
    }
  }

  useEffect(() => {
    if (yearType == yrType.created) {
      setVisibleLocations(locations.filter((loc) => {
        return loc.created_year_start <= timelineYear;
      }))
    } else {
      setVisibleLocations(locations.filter((loc) => {
        return loc.discovered_year <= timelineYear;
      }))
    }

  }, [timelineYear, locations, yearType]);

  // Timeline animation - persists even when filters are closed
  useEffect(() => {
    if (!playAnimation) {
      return; // Don't set up interval if not playing
    }
    // TODO: could use effect event here
    const anim = setInterval(() => {

      // Read current value directly from store to avoid closure issues
      const state = useFilterStore.getState();
      const currentYear = state.timelineYear;
      const currentMin = state.timelineStart;
      const currentMax = state.timelineEnd;
      const step = state.animationStep;
      
      if (currentYear >= currentMax) {
        setTimelineYear(currentMin); // Update store
      } else {
        const nextYear = currentYear + step;
        setTimelineYear(nextYear); // Update store
      }
    }, animationSpeed);

    return () => {
      clearInterval(anim);
    };
  }, [playAnimation, animationSpeed, animationStep]);

  async function getMapData() {
    const geojson = feature(geoData, geoData.objects.land);
    return geojson;
  }

  useEffect(() => {
    async function fetchData() {
        const data = await getMapData();
        setMapData(data);
    }
    fetchData();
  }, []);

  // Update map dimensions based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (mapContainerRef.current) {
        const container = mapContainerRef.current;
        const width = Math.max(320, container.clientWidth);
        const legendHeight = estimateLegendHeight(locationTypes.length, width);
        const height = Math.max(320, container.clientHeight - legendHeight);

        if (width > 0 && height > 0 && container.clientWidth > 0 && container.clientHeight > 0) {
          setMapDimensions({ width, height });
        }
      }
    };

    // Initial measurement
    updateDimensions();

    // Create ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [filtersOpen, recordingExportOpen, locationTypes]); // Recalculate when side panels or legend size changes

  useEffect(() => {
    if (visibleLocations === undefined) return;
    if (!mapData) return;
    if (!mapRef.current) return;
    // Ensure dimensions are valid before rendering
    if (!mapDimensions.width || !mapDimensions.height || mapDimensions.width < 200 || mapDimensions.height < 200) {
      return;
    }

    // Calculate plot dimensions - use full container size
    const plotHeight = mapDimensions.height;
    const plotWidth = mapDimensions.width;

    const chart = Plot.plot({
      style: {
        background: "lightBlue",
      },
      projection: getMapProjection(locations),
        marks: [
          Plot.geo(mapData, {fill: "#638a5c "}),
          Plot.dot(visibleLocations, {
            x: "longitude",
            y: "latitude",
            stroke: "location_type",
            fill: "location_type",
            fillOpacity: 0.3,
            //symbol and color need to be bound to type
            r: 7,
            symbol: "location_type",
            //render: addClick,
          }),
          Plot.tip(visibleLocations, Plot.pointer({
            x: "longitude",
            y: "latitude",
            title: (d) => plotPointTitle(d)
          })),
        ],
        // Use full container dimensions
        height: plotHeight,
        width: plotWidth,
        symbol: {legend: true, domain: locationTypes, range: allSymbols}, // Only show symbol legend with labels
        color: {domain: locationTypes, scheme: "turbo"}, // Color scale without separate legend
    });
    
    mapRef.current.innerHTML = '';
    mapRef.current.append(chart);
    return () => {
      if (chart) chart.remove();
    };
  }, [visibleLocations, mapData, locationTypes, mapDimensions, locations]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location_type) count++;
    if (filters.script) count++;
    if (filters.text) count++;
    if (filters.first_word) count++;
    if (filters.place) count++;
    if (filters.location) count++;
    return count;
  };

  const getGridTemplateColumns = () => {
    if (filtersOpen && recordingExportOpen) return '3fr 7fr 2fr';
    if (filtersOpen) return '3fr 9fr';
    if (recordingExportOpen) return '10fr 2fr';
    return '1fr';
  };

  const gridTemplateColumns = getGridTemplateColumns();

  return (
    <div className="w-full bg-amber-50 overflow-x-hidden">
      <div className="w-full p-4 sm:p-6 lg:p-10 xl:p-12">
        <div className="app-container w-full max-w-[1600px] mx-auto min-w-0">
          {/* Header */}
          <header className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8 border-b-4 border-amber-800 flex-shrink-0 w-full" role="banner">
            <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">
              ROTAS SQUARES MAP
            </h1>
            <p className="text-lg italic text-amber-700">
              A Digital Repository of Ancient Palindromic Inscriptions
            </p>
          </header>

          <main
            id="main-content"
            role="main"
            className="main-layout grid items-start gap-4 sm:gap-5 lg:gap-6 w-full min-w-0"
            style={{ '--grid-cols': gridTemplateColumns }}
          >
            {/* FILTERS SECTION */}
            {filtersOpen && (
              <div className="min-w-0 overflow-hidden transition-opacity duration-300">
                <FilterSection onClose={() => setFiltersOpen(false)} />
              </div>
            )}

            {/* MAP AREA */}
            <div className="min-w-0 w-full">
              {/* Timeline — always visible */}
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-4 lg:mb-6 border-2 border-amber-200 w-full min-w-0">
                <h2 className="text-2xl font-serif font-bold text-amber-900 mb-4">Timeline</h2>
                <TimelineSlider />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border-4 border-amber-200 w-full min-w-0" ref={screenshotRef}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                  <h2 className="text-2xl font-serif font-bold text-amber-900">
                    Map
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <span className="text-sm text-amber-700" aria-live="polite">
                      Active filters: {getActiveFilterCount()}
                    </span>
                    {!filtersOpen && (
                      <button
                        onClick={() => setFiltersOpen(true)}
                        className="px-3 py-1 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Filter size={16} />
                        Show Filters
                      </button>
                    )}
                    {!recordingExportOpen && (
                      <button
                        onClick={() => setRecordingExportOpen(true)}
                        className="px-3 py-1 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors flex items-center gap-2 text-sm"
                        aria-label="Show recording and export"
                      >
                        <Download size={16} />
                        Show Recording & Export
                      </button>
                    )}
                  </div>
                </div>

                <div 
                  ref={mapContainerRef}
                  className="w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] flex flex-col border-4 border-dashed border-amber-300 rounded-lg bg-amber-50/30 overflow-hidden"
                  aria-label="Interactive map showing location markers"
                >
                  <div ref={mapRef} className="map-container w-full h-full flex flex-col items-stretch justify-start overflow-hidden"></div>
                </div>
              </div>
            </div>

            {/* RECORDING & EXPORT SECTION */}
            {recordingExportOpen && (
              <div className="min-w-0 overflow-hidden transition-opacity duration-300">
                <RecordingExportSection onClose={() => setRecordingExportOpen(false)} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}