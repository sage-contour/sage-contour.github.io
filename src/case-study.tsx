import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { findCaseStudy } from './data/case-studies'

// Each case-studies/<slug>/index.html mounts this entry with data-slug on #root.
const root = document.getElementById('root')!
const study = findCaseStudy(root.dataset.slug)
if (!study) throw new Error(`Unknown case study: ${root.dataset.slug}`)

createRoot(root).render(
  <StrictMode>
    <CaseStudyPage cs={study} />
  </StrictMode>,
)
