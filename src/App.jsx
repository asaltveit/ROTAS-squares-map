
// React
import { useState, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Filter, Download, Share, Bookmark, Save, ChevronDown, ChevronUp } from 'lucide-react';
// Map
import * as Plot from "@observablehq/plot";
import { feature } from "topojson-client";
import geoData from "@/data/countries-geo.json"
// Utilities
import { useMapStore} from '@/stores/MapStore'
import { useFilterStore } from '@/stores/FilterStore';
import { plotPointTitle } from '@/utilities/UtilityFunctions';
import { yearType as yrType } from '@/constants';
import { allSymbols } from '@/constants';
// Components
import FilterSection from '@/components/FilterSection';
import RecordingSection from '@/components/recording/RecordingSection';
// DB
import { supabase } from '@/supabaseClient';
//Fingerprint
import FingerprintJS from '@sparkstone/fingerprintjs';

// TODO: Endpoints getting called in groups of threes?
export default function App() {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const screenshotRef = useRef(null);
  const [visibleLocations, setVisibleLocations] = useState([]);
  const [mapData, setMapData] = useState([]);
  const [FPResults, setFPResults] = useState({});
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

  const { filters, yearType, timelineYear, setTimelineYear, timelineStart, timelineEnd } = useFilterStore(
    useShallow((state) => ({ 
      filters: state.filters, 
      yearType: state.yearType, 
      timelineYear: state.timelineYear,
      setTimelineYear: state.setTimelineYear,
      timelineStart: state.timelineStart,
      timelineEnd: state.timelineEnd,
    })),
  )

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [recording, setRecording] = useState({
    isRecording: false,
    isPaused: false,
    savedViews: [],
    bookmarked: false
  });
  
  const [expandedSections, setExpandedSections] = useState({
    recording: false,
    export: false,
    savedViews: true
  });
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const saveView = () => {
    const view = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      filters: { ...filters },
    };
    setRecording(prev => ({
      ...prev,
      savedViews: [...prev.savedViews, view]
    }));
  };

  useEffect(() => {
    getVisitorInfo(); // collecting stats
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
    setSearchResults();
  }, [filters, timelineStart, timelineEnd]);

  useEffect(() => {
    getTypes();
  }, []);

  async function getVisitorInfo() {
    // Initialize fingerprint agent
    const fp = await FingerprintJS.load();
    const results = await fp.get()
    setFPResults(results);
  }

  // Save filter events
  async function setSearchResults() {
    // FPResults is empty on initialization
    if (FPResults && FPResults.components) {
      const resultFilters = Object
        .keys(filters)
        .reduce((r,key) => 
          (filters[key] && (r[key]=filters[key]), r),{})
    const notNullResultFilters = Object.keys(resultFilters);
    
    let filter = null;
    if (notNullResultFilters.length) {
      filter = notNullResultFilters[0];
    }
    const data = {
      timezone: FPResults.components.timezone.value,
      visitorId: FPResults.visitorId,
      platform: FPResults.components.platform.value,
      filter_type: filter,
      // languages should be an array?
      language: FPResults.components.languages.value[0][0],
      filter_value: resultFilters[filter]
    }
    await supabase
      .from('search_results')
      .insert(data)
    }
  }

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
        const rect = mapContainerRef.current.getBoundingClientRect();
        // Account for padding (p-2 = 8px on each side = 16px total)
        // Use the full container size - Plot will handle margins internally
        const width = Math.max(500, rect.width - 26);
        const height = Math.max(500, rect.height - 66); // Add space for legend
        // Only update if dimensions are valid
        if (width > 0 && height > 0 && (rect.width > 0 || rect.height > 0)) {
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
  }, [filtersOpen]); // Recalculate when filters panel opens/closes

  useEffect(() => {
    if (visibleLocations === undefined) return;
    if (!mapData) return;
    if (!mapRef.current) return;
    // Ensure dimensions are valid before rendering
    if (!mapDimensions.width || !mapDimensions.height || mapDimensions.width < 400 || mapDimensions.height < 400) {
      return;
    }

    // Calculate plot dimensions - use full container size
    const plotHeight = mapDimensions.height;
    const plotWidth = mapDimensions.width;

    const chart = Plot.plot({
      style: {
        background: "lightBlue",
      },
      projection: {type: "orthographic", inset: -800, rotate: [-15, -43]},
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
  }, [visibleLocations, mapData, locationTypes, mapDimensions]);

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

  return (
    <div className="min-h-screen w-full bg-amber-50">
      <div className="w-full h-full p-6">
        <div className="max-w-[1600px] mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-b-4 border-amber-800">
            <h1 className="text-4xl font-serif font-bold text-amber-900 mb-2">
              ROTAS SQUARES MAP
            </h1>
            <p className="text-lg italic text-amber-700">
              A Digital Repository of Ancient Palindromic Inscriptions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* FILTERS SECTION */}
            {filtersOpen && (
              <FilterSection onClose={() => setFiltersOpen(false)} />
            )}

            {/* MAP AREA */}
            <div className={filtersOpen ? "lg:col-span-6" : "lg:col-span-9"}>
              <div className="bg-white rounded-lg shadow-lg p-6 h-full min-h-[600px] border-4 border-amber-200" ref={screenshotRef}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-serif font-bold text-amber-900">
                    Map
                  </h2>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-amber-700">
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
                  </div>
                </div>

                <div 
                  ref={mapContainerRef}
                  className="w-full h-[400px] sm:h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center border-4 border-dashed border-amber-300 rounded-lg bg-amber-50/30 overflow-hidden p-2"
                >
                  <div ref={mapRef} className="map-container w-full h-full flex flex-col items-center justify-center overflow-auto"></div>
                </div>
              </div>
            </div>

            {/* RECORDING & ACTIONS SECTION */}
            <div className="lg:col-span-3">
              {/* Recording Controls */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border-2 border-amber-200">
                <button
                  onClick={() => toggleSection('recording')}
                  className="w-full flex items-center justify-between hover:bg-amber-50 transition-colors p-2 rounded"
                >
                  <h2 className="text-xl font-serif font-bold text-amber-900">
                    Recording Session
                  </h2>
                  {expandedSections.recording ? <ChevronUp size={20} className="text-amber-900" /> : <ChevronDown size={20} className="text-amber-900" />}
                </button>

                {expandedSections.recording && (
                  <div className="mt-4">
                    <RecordingSection screenRef={screenshotRef} />

                    <div className="border-t-2 border-amber-200 my-4"></div>

                    <button
                      onClick={saveView}
                      className="w-full mb-2 px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-900 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save Current View
                    </button>

                    <button
                      onClick={() => setRecording(prev => ({ ...prev, bookmarked: !prev.bookmarked }))}
                      className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Bookmark size={18} fill={recording.bookmarked ? 'currentColor' : 'none'} />
                      {recording.bookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  </div>
                )}
              </div>

              {/* Export & Share */}
              <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border-2 border-amber-200">
                <button
                  onClick={() => toggleSection('export')}
                  className="w-full flex items-center justify-between hover:bg-amber-50 transition-colors p-2 rounded"
                >
                  <h2 className="text-xl font-serif font-bold text-amber-900">
                    Export & Share
                  </h2>
                  {expandedSections.export ? <ChevronUp size={20} className="text-amber-900" /> : <ChevronDown size={20} className="text-amber-900" />}
                </button>

                {expandedSections.export && (
                  <div className="space-y-2 mt-4">
                    <button className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                      <Download size={18} />
                      Export as CSV
                    </button>
                    <button className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                      <Download size={18} />
                      Export as PDF
                    </button>
                    <button className="w-full px-4 py-2 border-2 border-amber-800 text-amber-900 rounded hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                      <Share size={18} />
                      Share Configuration
                    </button>
                  </div>
                )}
              </div>

              {/* Saved Views */}
              {recording.savedViews.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-amber-200">
                  <button
                    onClick={() => toggleSection('savedViews')}
                    className="w-full flex items-center justify-between hover:bg-amber-50 transition-colors p-2 rounded"
                  >
                    <h2 className="text-xl font-serif font-bold text-amber-900">
                      Saved Views ({recording.savedViews.length})
                    </h2>
                    {expandedSections.savedViews ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>

                  {expandedSections.savedViews && (
                    <div className="max-h-48 overflow-y-auto space-y-2 mt-4">
                      {recording.savedViews.map(view => (
                        <div
                          key={view.id}
                          className="p-3 bg-amber-50 border border-amber-200 rounded"
                        >
                          <p className="text-sm text-amber-900">{view.timestamp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}