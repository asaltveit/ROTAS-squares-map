import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Plot from "@observablehq/plot";
import mapData from "./data/custom.geo.json";
import TimelineSlider from "./components/TimelineSlider";
import OptionsAccordion from './components/OptionsAccordion';
import Form from './components/Form';
import './css/App.css';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { allSymbols } from './constants/Map';

// TODO: Look into state management (types prop drilling)

function App() {
  const mapRef = useRef();
  const [locations, setLocations] = useState([]);
  const [year, setYear] = useState(0);
  const [visibleLocations, setVisibleLocations] = useState([]);

  // TODO: store these in database? Or choose the current # from stored list?
  // TODO: Add an effect to set symbols and types?
  let types = ["manuscript", "amulet", "inscription", "graffito", "dipinto"];
  let numTypes = types.length;
  let symbols = allSymbols.slice(0, numTypes);

  const addNewType = (type) => {
    if (types.length >= 8){
      console.log("Error: No more symbols available to add.");
      return -1;
    }
    if (types.filter(type).length > 0) {
      console.log(`Error: Type ${type} already exists.`);
      return -1;
    }
    types.append(type);
    console.log("Success: Type added.")
    types.length == 8 ? console.log("Warning: No more symbols available to add.") : '';
    return 1;
  }

  const accordionChildren = [
    {
      header: "Filters",
      body: <Box>TODO</Box>,
    },
    {
      header: "Manipulate Data",
      body: <Form types={types} addNewType={addNewType} />,
    },
  ];

  useEffect(() => {
    axios.get('http://localhost:3000/locations').then((data) => {
      setLocations(data.data);
    })
  }, []);

  useEffect(() => {
    setVisibleLocations(locations.filter((loc) => {
      return loc.created_year_start <= year;
    }))

  }, [year, locations]);

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
            title: (d) => ["Created from: " + d.created_year_start + "-" + d.created_year_end, "Text: " + d.text, "Place: " + d.place, "Location: " + d.location, "Year Discovered: " + d.discovered_year, "Shelfmark: " + d.shelfmark].join("\n\n")
          })),
        ],
        // Canvas doesn't include legend
        height: 600, // Canvas height
        width: 800, // Canvas width
        symbol: {legend: true, domain: types, range: symbols},
        color: { domain: types, scheme: "turbo"},
    });
    mapRef.current.append(chart);
    return () => chart.remove();
  }, [visibleLocations]);

  return (
    <>
      <Typography variant="h1" gutterBottom>ROTAS Squares Map</Typography>
      <Box>
        {/* TODO - Control size of map section */}
        <TimelineSlider min={0} max={1100} onValueChange={setYear}/>
        <Box className="card">
          <Box ref={mapRef}></Box>
        </Box>
      </Box>
      <OptionsAccordion children={accordionChildren} />
    </>
  )
}

export default App;