import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'

import { AuthContext } from './context/authContext.jsx'
import { ThemeContext } from './context/themeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContext>
      <ThemeContext>
        <App />
      </ThemeContext>
    </AuthContext>
  </StrictMode>,
)
