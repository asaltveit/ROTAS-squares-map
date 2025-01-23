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
      setLocations(data.data);
    })
  }, []);

  console.log(locations) // Data appears here, not in the get

  useEffect(() => {
    if (locations === undefined) return;
    const chart = Plot.plot({
      style: {
        background: "white"
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
        // Canvas doesn't include legend
        height: 600, // Canvas height
        width: 800, // Canvas width
        symbol: {legend: true, domain: types, range: symbols},
        color: { domain: types, scheme: "turbo"},
    });
    mapRef.current.append(chart);
    return () => chart.remove();
  }, [locations]);

  return (
    <>
      <h1>ROTAS Squares Map</h1>
      <div className="card">
        <div ref={mapRef}></div>
      </div>
    </>
  )
}

export default App;
