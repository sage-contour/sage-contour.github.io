import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProblemSection } from './components/ProblemSection'
import { RiskComparison } from './components/RiskComparison'
import { HowItWorks } from './components/HowItWorks'
import { LearningLoop } from './components/LearningLoop'
import { CaseStudyTeaser } from './components/CaseStudyTeaser'
import { MgaModel } from './components/MgaModel'
import { MarketFocus } from './components/MarketFocus'
import { ClosingCTA } from './components/ClosingCTA'
import { Footer } from './components/Footer'
import { useReveal } from './hooks/useReveal'

export default function App() {
  useReveal()
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <ProblemSection />
        <RiskComparison />
        <HowItWorks />
        <LearningLoop />
        <CaseStudyTeaser />
        <MgaModel />
        <MarketFocus />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
