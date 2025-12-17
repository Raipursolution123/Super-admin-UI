import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/store'
import './index.css'
import './styles/animations.css'
import './styles/glassmorphism.css'
import App from './App.jsx'
import { ThemeProvider } from './theme/ThemeContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
