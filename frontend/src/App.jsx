import { useState, useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow'
import axios from 'axios';
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
import _ from 'lodash'
import { yearType as yrType } from './constants/FilterSection';


function App() {
  const mapRef = useRef();
  const [year, setYear] = useState(0);
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

  const { filters, yearType } = useFilterStore(
    useShallow((state) => ({ 
      filters: state.filters, 
      yearType: state.yearType, 
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

  useEffect(() => {

    axios.get('http://localhost:3000/locations', { params: filters }).then((data) => {
      setLocations(data.data);
    })
  }, [formSubmitted, filters]);

  useEffect(() => {
    if (yearType == yrType.created) {
      setVisibleLocations(locations.filter((loc) => {
        return loc.created_year_start <= year;
      }))
    } else {
      setVisibleLocations(locations.filter((loc) => {
        return loc.discovered_year <= year;
      }))
    }

  }, [year, locations, yearType]);

  useEffect(() => {
    axios.get('http://localhost:3000/locations/types').then((data) => {
      setLocationTypes(data.data);
    })
  }, [formSubmitted]);

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
            stroke: "type",
            fill: "type",
            fillOpacity: 0.3,
            //symbol and color need to be bound to type
            r: 7,
            symbol: "type",
            
          }),
          Plot.tip(visibleLocations, Plot.pointer({
            x: "longitude",
            y: "latitude",
            title: (d) => ["Created from: " + d.created_year_start + "-" + d.created_year_end, "Script: " + d.script, "Text: " + d.text, "Place: " + d.place, "Location: " + d.location, "Year Discovered: " + d.discovered_year, "Shelfmark: " + d.shelfmark].join("\n\n")
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
      <Typography variant="h1" gutterBottom>ROTAS Squares Map</Typography>
      <Box  >
        <Box >
          {/* TODO - Control size of map section */}
          <TimelineSlider onValueChange={setYear} type={yearType} />
          <Box className="card">
            <Box ref={mapRef}></Box>
          </Box>
        </Box>
      </Box>
      <OptionsAccordion children={accordionChildren} />
    </>
  )
}

export default App;