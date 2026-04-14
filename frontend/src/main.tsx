import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- IMPORTA ESTO
import {App} from './App'
import './index.css'
import "./styles/pages.css";
import "./styles/components.css";


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- ENVOLVER TODA LA APP AQUÍ */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)