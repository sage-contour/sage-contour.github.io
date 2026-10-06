import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { CaseStudyPage } from './pages/CaseStudyPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CaseStudyPage />
  </StrictMode>,
)
