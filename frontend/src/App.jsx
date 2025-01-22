import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Plot from "@observablehq/plot";
import './App.css';
import mapData from "./data/custom.geo.json";
import PlotFigure from "./PlotFigure.jsx";

function App() {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/locations').then((data) => {
      //console.log(data) // Data doesn't appear in console
      setLocations(data.data)
    })
  }, []);

  let symbols = ["asterisk", "circle", "square", "cross", "triangle"]
  let types = ["manuscript", "amulet", "inscription", "graffito", "dipinto"]

  /*const map = Plot.plot({ // What to do with multiple artifacts on same coordinates?
    // May need to be more zoomed in (TODO)
    projection: {type: "orthographic", inset: -450, rotate: [-10, -35]},//"equirectangular", // Set the projection // orthographic - current // stereographic - previous
    marks: [
      Plot.geo(mapData), // Add the state boundaries
      Plot.dot(locations, {
        x: "longitude", // Provide longitude values
        y: "latitude", // Provide latitude values
        stroke: "type",
        fill: "type",
        fillOpacity: 0.3,
        //symbol and color need to be bound to type
        r: 7,
        symbol: "type",
      }),
      Plot.tip(locations, Plot.pointer({
        x: "longitude", // Provide longitude values
        y: "latitude", // Provide latitude values
        title: (d) => ["Created from: " + d.created_year_start + "-" + d.created_year_end, "Text: " + d.text, "Place: " + d.place, "Location: " + d.location, "Year Discovered: " + d.discovered_year, "Shelfmark: " + d.shelfmark].join("\n\n")
      })),
    ],
    height: 500, // Canvas height
    width: 800, // Canvas width
    // Binds the type to a specific color and symbol, doesn't change on reload
    symbol: {legend: true, domain: types, range: symbols},
    color: { legend: true, domain: types, scheme: "turbo"}//range: colors },
  }) // { map }*/

  /*const map2 = Plot.plot({ 
    projection: {type: "orthographic", inset: -450, rotate: [-10, -35]},//"equirectangular", // Set the projection // orthographic - current // stereographic - previous
    marks: [
      Plot.geo(mapData), // Add the state boundaries
    ],
    height: 500, // Canvas height
    width: 800, // Canvas width
  })*/

  /*useEffect(() => {
    if (mapData === undefined || mapData == []) return;

    const plot = Plot.plot({
      projection: {type: "orthographic", inset: -450, rotate: [-10, -35]},
      marks: [
        Plot.geo(mapData),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [mapData]);*/

  return (
    <>
      <h1>ROTAS Map</h1>
      <div className="card">
        <PlotFigure
          options={{
            projection: {type: "orthographic", inset: -450, rotate: [-10, -35]},
            marks: [
              Plot.geo(mapData),
              Plot.dot(locations, {
                x: "longitude", // Provide longitude values
                y: "latitude", // Provide latitude values
                stroke: "type",
                fill: "type",
                fillOpacity: 0.3,
                //symbol and color need to be bound to type
                r: 7,
                symbol: "type",
              }),
              Plot.tip(locations, Plot.pointer({ // Don't see this show up
                x: "longitude", // Provide longitude values
                y: "latitude", // Provide latitude values
                title: (d) => "woo"//["Created from: " + d.created_year_start + "-" + d.created_year_end, "Text: " + d.text, "Place: " + d.place, "Location: " + d.location, "Year Discovered: " + d.discovered_year, "Shelfmark: " + d.shelfmark].join("\n\n")
              })),
            ],
            height: 500, // Canvas height
            width: 800, // Canvas width
            symbol: {legend: true, domain: types, range: symbols},
            color: { legend: true, domain: types, scheme: "turbo"}//range: colors },
          }}
        />
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
