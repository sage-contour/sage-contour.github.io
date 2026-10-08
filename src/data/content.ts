/**
 * All site copy lives here so wording (especially insurance positioning)
 * can be reviewed and edited in one place. Case-study pages: case-studies.ts.
 */

import { CASE_STUDIES_PATH } from './case-studies'

export const CONTACT_EMAIL = 'hello@sageinsurance.ai'
/** Inbox that receives contact-form submissions via formsubmit.co (no backend needed on GitHub Pages). */
export const FORM_EMAIL = 'b.goshayeshi@diphyx.com'
export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`

export const mailto = (subject: string) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`

export const site = {
  name: 'Sage',
  tagline: 'Physics-Informed AI for Home Insurance',
  description:
    'Sage models how individual homes respond to wildfire and other hazards, helping insurance partners identify risks traditional models may misprice.',
  primaryCta: 'Request an Intro',
  primaryCtaHref: '#contact',
  secondaryCta: 'See How Sage Works',
  secondaryCtaHref: '#how-it-works',
}

export const nav = [
  { label: 'Why Sage', href: '#why-sage' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Case Studies', href: CASE_STUDIES_PATH },
  { label: 'Model', href: '#model' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  headline: 'Physics-Informed AI for Home Insurance',
  subheadline:
    'We model how individual homes respond to wildfire and other hazards, helping insurance partners identify risks traditional models may misprice.',
  supporting: 'Regional models see the neighborhood. Sage understands the home.',
  toggle: { without: 'Without Sage', with: 'With Sage', label: 'Compare the regional view with the Sage view' },
  regionalCaption: { title: 'Without Sage', line: 'One area. One rating. Every home looks the same.' },
  propertyCaption: { title: 'With Sage', line: 'Same neighborhood. Different homes. Different risk.' },
}

export const problem = {
  eyebrow: 'The problem',
  heading: 'The risk is regional. The damage is property-specific.',
  copy:
    'Regional models can force regional decisions. When individual risks are hard to distinguish, insurers may restrict entire areas, overprice resilient homes, or underprice vulnerable ones.',
  cards: [
    {
      title: 'Good risks get rejected',
      body: 'Resilient homes can lose access to coverage when grouped with more vulnerable properties.',
    },
    {
      title: 'Bad risks get underpriced',
      body: 'Missed property vulnerability can become portfolio loss when many homes face the same event.',
    },
    {
      title: 'Better selection can unlock capacity',
      body: 'Property-level insight can help insurance partners identify attractive risks and reward verified mitigation.',
    },
  ],
}

export const insight = {
  eyebrow: 'Underwriting insight',
  heading: 'Same neighborhood. Different homes. Different risk.',
  supporting: 'Sage adds property-level physics to the broader view of hazard exposure.',
  body: 'Find the physical differences that matter to loss—and use them to inform risk selection, pricing, and mitigation.',
  note: 'Roof, vents, slope, vegetation, defensible space, and neighboring structures can shape how each home responds.',
  regional: { title: 'Regional view', line: 'One area. Shared hazard.' },
  property: { title: 'Sage view', line: 'Each home. Its own risk.' },
}

export const riskLegend = [
  { key: 'low', label: 'Lower risk', color: 'var(--color-risk-low)' },
  { key: 'moderate', label: 'Moderate risk', color: 'var(--color-risk-moderate)' },
  { key: 'elevated', label: 'Elevated risk', color: 'var(--color-risk-elevated)' },
  { key: 'severe', label: 'Severe risk', color: 'var(--color-risk-severe)' },
] as const

export const howItWorks = {
  eyebrow: 'How Sage works',
  heading: 'From property data to underwriting insight',
  steps: [
    { title: 'Property data', body: 'Parcel, imagery, building records' },
    { title: 'Terrain & building geometry', body: 'Structure, slope, fuels, elevation' },
    { title: 'Weather & hazard scenarios', body: 'Wind, embers, rainfall, surge' },
    { title: 'Physics + AI', body: 'Simulations train faster models' },
    { title: 'Property risk profile', body: 'Risk estimate + uncertainty' },
    { title: 'Underwriting recommendation', body: 'Quote · refer · decline · mitigate' },
  ],
  bottomLine:
    'The goal: a clear recommendation, a traceable rationale, and a practical mitigation path.',
}

export const learningLoop = {
  eyebrow: 'Why Sage',
  heading: 'A simulation loop that compounds',
  supporting:
    'CFD resolves how wind, embers, and heat move around each home. AI distills those simulations into scores that take seconds. Observed outcomes recalibrate the physics.',
  center: 'CFD simulation of wind flow around a single home: streamlines accelerate over the roof ridge and slow in the wake behind the house.',
  legend: { low: 'Slow', high: 'Fast', label: 'Wind speed around the home' },
  nodes: [
    'Physics simulations',
    'Proprietary synthetic data',
    'Fast AI risk model',
    'Policies + mitigation',
    'Claims + inspections',
    'Calibrate + improve',
  ],
  nodeNotes: [
    'CFD resolves wind, ember transport, and heat around each structure, roof, vent, and neighbouring tree.',
    'Thousands of simulated scenarios per home become labeled training data that does not exist in the market today.',
    'Trained models score properties in seconds, at a cost that supports underwriting at scale.',
    'Recommendations flow into quotes, referrals, and mitigation guidance for partners.',
    'As policies are written, inspections and observed outcomes are intended to feed back in.',
    'Real-world results are used to calibrate the engine and sharpen the next cycle.',
  ],
  infra: {
    eyebrow: 'Built on proven infrastructure',
    body: 'Sage starts with years of computational infrastructure already built. DiPhyx/dxflow provides simulation orchestration, scalable compute, reproducible workflows, and data pipelines—allowing Sage to focus development on property risk and insurance intelligence.',
  },
}

export const mgaModel = {
  eyebrow: 'Planned MGA model',
  heading: 'A capital-efficient insurance model',
  copy:
    'Sage is building toward a planned MGA model. Sage provides property-level risk intelligence, underwriting workflow, and distribution under carrier-delegated authority, while licensed carrier partners provide insurance capacity, issue policies, and bear the insurance risk.',
  flow: [
    { title: 'Broker / Homeowner', body: 'Submits coverage needs and property information.' },
    {
      title: 'Sage MGA',
      body: 'Risk selection, pricing workflow, and distribution within carrier-delegated authority.',
      highlight: true,
    },
    { title: 'Carrier Partner', body: 'Licensed insurer of record; issues policies and bears insurance risk.' },
    { title: 'Reinsurance', body: "Supports the carrier's portfolio risk-transfer structure." },
  ],
  revenueHeading: 'Revenue model',
  revenue: ['MGA commission', 'Potential profit share', 'Permitted policy fees, where applicable'],
  callout: 'Sage is not the risk-bearing insurance carrier.',
  scale:
    "The model is designed to scale written premium through carrier partners rather than through Sage's own insurance balance sheet.",
}

export const market = {
  eyebrow: 'Initial market focus',
  heading: 'Start focused. Expand with evidence.',
  copy: 'Initial focus: high-value California homes exposed to wildfire.',
  reasons: [
    {
      title: 'High premium per policy',
      body: 'Higher insured values can support meaningful economics and detailed property-level risk assessment.',
    },
    {
      title: 'Constrained capacity',
      body: 'Broker distribution can reach homeowners seeking coverage in difficult-to-place areas.',
    },
    {
      title: 'Property variation + mitigation',
      body: 'Roof design, vents, fuels, defensible space, terrain, and neighboring structures create property-level differences physics-informed models can test.',
    },
  ],
  expansionLabel: 'Expansion path',
  hazards: ['Wildfire', 'Wind', 'Flood'],
  geographies: ['California', 'Additional markets'],
  expansionNote:
    'as models, capacity, validation, and operating readiness mature.',
}

export const closing = {
  heading: 'Understand the home. Price the risk.',
  copy:
    'Regional models see the neighborhood. Sage understands the home. Property-level physics can help identify better risks, price intelligently, and reward mitigation.',
  finalLine: 'Building the physics-informed engine for the next generation of home insurance.',
  form: {
    eyebrow: 'Get in touch',
    name: 'Name',
    email: 'Email address',
    message: 'Message',
    messagePlaceholder: 'Tell us who you are and what you would like to discuss.',
    submit: 'Send message',
    sending: 'Sending…',
    subject: 'Sage website — new message',
    success: 'Thanks — your message is on its way. We will reply by email.',
    error: 'Something went wrong sending your message. Please try again in a moment.',
  },
}

/** Home-page teaser for the case studies (their pages and copy live in case-studies.ts). */
export const caseStudyTeaser = {
  eyebrow: 'Case studies',
  heading: 'One neighborhood at a time, mapped home by home',
  copy: 'We ran the Sage platform on wildland-urban neighborhoods across California and Utah: from raw property and terrain data to 3D geometry, a CFD wind field, and a home-by-home risk map built from hundreds of fire simulations.',
  cta: 'See the case studies',
}

export const footer = {
  disclaimer:
    'Sage is an early-stage company developing technology and a planned MGA model. Insurance products, delegated authority, and capacity are subject to licensing, partner agreements, and applicable approvals.',
}
