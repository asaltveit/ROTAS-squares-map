import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/index.css'
import App from './App.jsx'
//import { GoogleOAuthProvider } from '@react-oauth/google';
// <GoogleOAuthProvider clientId="379743926732-29ilslou65co35ln58gasmsqjei9mdc1.apps.googleusercontent.com">
// </GoogleOAuthProvider>,
// ROTAS Map tab icon - https://en.wikipedia.org/wiki/Sator_Square#/media/File:Palindrom_TENET.svg.png

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
