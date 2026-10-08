import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'
import App from './App'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
