import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from '@/App.jsx'
// ROTAS Map tab icon - https://en.wikipedia.org/wiki/Sator_Square#/media/File:Palindrom_TENET.svg.png

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="app-scale-wrapper">
      <App />
    </div>
  </StrictMode>
)
