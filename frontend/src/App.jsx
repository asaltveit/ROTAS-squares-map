import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as Plot from "@observablehq/plot";
import './App.css';
import mapData from "./data/custom.geo.json";

function App() {
  const mapRef = useRef();
  const [locations, setLocations] = useState([]);

  let symbols = ["asterisk", "circle", "square", "cross", "triangle"];
  let types = ["manuscript", "amulet", "inscription", "graffito", "dipinto"];

  useEffect(() => {
    axios.get('http://localhost:3000/locations').then((data) => {
      //console.log(data) // Data doesn't appear in console
      setLocations(data.data);
    })
  }, []);

  console.log(locations)

  useEffect(() => {
    if (locations === undefined) return;
    const chart = Plot.plot({
      style: {
        background: "transparent"
      },
      projection: {type: "orthographic", inset: -450, rotate: [-10, -35]},
        marks: [
          Plot.geo(mapData),
          Plot.dot(locations, {
            x: "longitude",
            y: "latitude",
            stroke: "type",
            fill: "type",
            fillOpacity: 0.3,
            //symbol and color need to be bound to type
            r: 7,
            symbol: "type",
            
          }),
          Plot.tip(locations, Plot.pointer({
            x: "longitude",
            y: "latitude",
            title: (d) => ["Created from: " + d.created_year_start + "-" + d.created_year_end, "Text: " + d.text, "Place: " + d.place, "Location: " + d.location, "Year Discovered: " + d.discovered_year, "Shelfmark: " + d.shelfmark].join("\n\n")
          })),
        ],
        height: 500, // Canvas height
        width: 700, // Canvas width
        symbol: {legend: true, domain: types, range: symbols},
        color: { domain: types, scheme: "turbo"}
    });
    mapRef.current.append(chart);
    return () => chart.remove();
  }, [locations]);

  return (
    <>
      <h1>ROTAS Map</h1>
      <div className="card">
        <div ref={mapRef}></div>
      </div>
    </>
  )
}

export default App;

/*
index.css:
 color: rgba(255, 255, 255, 0.87);
   background-color: #242424;

*/
