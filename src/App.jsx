import { useState, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow'
import * as Plot from "@observablehq/plot";
import mapData from "./data/custom.geo.json";
import TimelineSlider from "./components/TimelineSlider";
import OptionsAccordion from './components/OptionsAccordion';
import Form from './components/Form';
import FilterSection from './components/FilterSection';
import './css/App.css';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { allSymbols } from './constants/Map';
import { useMapStore} from './utilities/MapStore'
import { useFilterStore } from './utilities/FilterStore';
import { plotPointTitle } from './utilities/UtilityFunctions';
import { yearType as yrType } from './constants/FilterSection';
import { supabase } from './supabaseClient';


function App() {
  const mapRef = useRef();
  const [visibleLocations, setVisibleLocations] = useState([]);

  const { locations, setLocations, formSubmitted, locationTypes, setLocationTypes } = useMapStore(
    useShallow((state) => ({ 
      formSubmitted: state.formSubmitted, 
      setLocations: state.setLocations, 
      locations: state.locations,
      locationTypes: state.locationTypes,
      setLocationTypes: state.setLocationTypes,
    })),
  )

  const { filters, yearType, timelineYear, setTimelineYear } = useFilterStore(
    useShallow((state) => ({ 
      filters: state.filters, 
      yearType: state.yearType, 
      timelineYear: state.timelineYear,
      setTimelineYear: state.setTimelineYear,
    })),
  )

  // TODO: Add an effect to set symbols and types?
  let numTypes = locationTypes.length;
  let symbols = allSymbols.slice(0, numTypes);

  const accordionChildren = [
    {
      header: "Filters",
      body: <FilterSection />,
    },
    {
      header: "Manipulate Data",
      body: <Form />,
    },
  ];
  // TODO - all gets getting called twice
  useEffect(() => {
    getLocations();
  }, [formSubmitted, filters]);

  useEffect(() => {
    getTypes();
  }, [formSubmitted]);

  async function getLocations() {
    let resultFilters = Object
        .keys(filters)
        .reduce((r,key) => 
          (filters[key] && (r[key]=filters[key]), r),{})
    if (resultFilters) {
      const { data, error } = await supabase.from("locations").select().match(resultFilters);
      if (error) {
        console.log("getLocations filters error: ", error)
      }
      setLocations(data);
    } else {
      const { data, error } = await supabase.from("locations").select();
      if (error) {
        console.log("getLocations error: ", error)
      }
      setLocations(data);
    }
  }

  async function getTypes() {
    const { data, error } = await supabase.rpc('get_distinct_type');
    if (error) {
      console.log("getTypes error: ", error)
    }
    setLocationTypes(data);
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

  useEffect(() => {
    if (visibleLocations === undefined) return;
    // TODO: Move plot to separate file
    const chart = Plot.plot({
      style: {
        background: "white"
      },
      projection: {type: "orthographic", inset: -450, rotate: [-10, -35]},
        marks: [
          Plot.geo(mapData),
          Plot.dot(visibleLocations, {
            x: "longitude",
            y: "latitude",
            stroke: "location_type",
            fill: "location_type",
            fillOpacity: 0.3,
            //symbol and color need to be bound to type
            r: 7,
            symbol: "location_type",
            
          }),
          Plot.tip(visibleLocations, Plot.pointer({
            x: "longitude",
            y: "latitude",
            title: (d) => plotPointTitle(d)
          })),
        ],
        // Canvas doesn't include legend
        height: 600, // Canvas height
        width: 800, // Canvas width
        symbol: {legend: true, domain: locationTypes, range: symbols},
        color: { domain: locationTypes, scheme: "turbo"},
    });
    mapRef.current.append(chart);
    return () => chart.remove();
  }, [visibleLocations]);

  return (
    <>
      <Box sx={{ width: '85%', justifySelf: 'center' }} >
        <Typography variant="h1" gutterBottom>ROTAS Squares Map</Typography>
        <Box  sx={{margin: '20px'}}  >
          <Box className="card">
            {/* TODO - Control size of map section */}
            <TimelineSlider onValueChange={setTimelineYear} type={yearType} />
            <Box className="card">
              <Box ref={mapRef}></Box>
            </Box>
          </Box>
          <OptionsAccordion children={accordionChildren} />
        </Box>
      </Box>
    </>
  )
}

export default App;