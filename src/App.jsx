// React
import { useState, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
// Map
import * as Plot from "@observablehq/plot";
import { feature } from "topojson-client";
import geoData from "./data/countries-geo.json"
// Components
import TimelineSlider from "./components/TimelineSlider";
import OptionsAccordion from './components/OptionsAccordion';
import Form from './components/Form';
import FilterSection from './components/FilterSection';
// UI
import './css/App.css';
import { Box, Typography } from '@mui/material';
import { allSymbols } from './constants/Map';
// Utilities
import { useMapStore} from './utilities/MapStore'
import { useFilterStore } from './utilities/FilterStore';
import { plotPointTitle } from './utilities/UtilityFunctions';
import { yearType as yrType } from './constants/FilterSection';
// DB
import { supabase } from './supabaseClient';

// TODO: Endpoints getting called in groups of threes?

function App() {
  const mapRef = useRef();
  const [visibleLocations, setVisibleLocations] = useState([]);
  const [mapData, setMapData] = useState([]);

  const { locations, setLocations, formSubmitted, locationTypes, setLocationTypes, setSelectedPoint } = useMapStore(
    useShallow((state) => ({ 
      formSubmitted: state.formSubmitted, 
      setLocations: state.setLocations, 
      locations: state.locations,
      locationTypes: state.locationTypes,
      setLocationTypes: state.setLocationTypes,
      setSelectedPoint: state.setSelectedPoint,
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

  // TODO: Add an effect to set symbols and types?
  let numTypes = locationTypes.length;
  let symbols = allSymbols.slice(0, numTypes);

  // TODO: use suspense on children?
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
  // TODO - all gets getting called twice?
  useEffect(() => {
    getLocations();
  }, [formSubmitted, filters, timelineStart, timelineEnd]);

  useEffect(() => {
    getTypes();
  }, [formSubmitted]);

  async function getLocations() {
    let resultFilters = Object
        .keys(filters)
        .reduce((r,key) => 
          (filters[key] && (r[key]=filters[key]), r),{})

    if (resultFilters) {
      const { data, error } = await supabase.from("locations")
      .select().match(resultFilters)
      .gte('created_year_start', timelineStart)
      .or(`created_year_end.is.null,created_year_end.lte.${timelineEnd}`);
      
      if (error) {
        console.log("getLocations filters error: ", error)
      }
      setLocations(data);
    } else {
      const { data, error } = await supabase.from("locations")
      .select()
      .gte('created_year_start', timelineStart)
      .or(`created_year_end.is.null,created_year_end.lte.${timelineEnd}`);
      
      if (error) {
        console.log("getLocations without filters error: ", error)
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

  const addClick = (index, scales, values, dimensions, context, next) => {
    const el = next(index, scales, values, dimensions, context);
    // Works if every mark is a circle
    // Do a selector for each symbol type?
    const circles = el.querySelectorAll("circle");
    for (let i = 0; i < circles.length; i++) {
      circles[i].addEventListener("click", () => {
        // This won't work with other symbols, filter for 'id' instead
        setSelectedPoint(locations[i]) 
      });
    } 
    return el;
  }

  useEffect(() => {
    if (visibleLocations === undefined) return;
    if (!mapData) return <div>Loading...</div>;
    // TODO: Move plot to separate file?
    const chart = Plot.plot({
      style: {
        background: "lightBlue"
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
            //symbol: "//"location_type",
            render: addClick,
          }),
          Plot.tip(visibleLocations, Plot.pointer({
            x: "longitude",
            y: "latitude",
            title: (d) => plotPointTitle(d)
          })),
        ],
        // Canvas doesn't include legend
        height: 600, // Canvas height
        width: 850, // Canvas width
        //symbol: {legend: true, domain: locationTypes, range: symbols},
        color: { legend: true, domain: locationTypes, scheme: "turbo"},
    });
    
    mapRef.current.append(chart);
    return () => chart.remove();
  }, [visibleLocations]);

  // TODO: Map changes causing re-rendering of all of App?
  return (
    <>
      <Box sx={{ width: '85%', justifySelf: 'center' }} >
        <Typography variant="h1" gutterBottom> ROTAS Squares Map </Typography>
        <Box sx={{margin: '10px'}} >
          <Box className="card">
            {/* TODO - Control size of map section */}
            <TimelineSlider onValueChange={setTimelineYear} type={yearType} />
            <Box>
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