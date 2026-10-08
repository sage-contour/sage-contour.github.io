import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { CaseStudiesPage } from './pages/CaseStudiesPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CaseStudiesPage />
  </StrictMode>,
)
