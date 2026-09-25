import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { CafeProvider } from './context/CafeContext.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CafeProvider>
      <App />
    </CafeProvider>
  </StrictMode>,
)
