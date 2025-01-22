import { useState } from 'react';
import axios from 'axios';
import * as Plot from "@observablehq/plot";
import './App.css';



function App() {
  const [locations, setLocations] = useState([]);

  //data will be the string we send from our server
  const apiCall = () => {
    axios.get('http://localhost:3000/locations').then((data) => {
      //this console.log will be in our frontend console
      console.log(data.data)
      setLocations(data.data)
    })
  }

  return (
    <>
      <h1>ROTAS Map</h1>
      <div className="card">
        <button onClick={apiCall}>Make API Call</button>
        <p>
          { locations.map(loc => loc.id + " ") }
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
