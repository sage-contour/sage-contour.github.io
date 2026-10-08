/**
 * Case-study copy. Each study's figures come from its orchestrator run
 * (orchestrator/data/<slug>: manifest.json, scenario.json, cfd/wind_results/summary.json,
 * fire_3d/summary.json, risk/summary.json). Keep the limitations intact: the CFD solves are
 * preliminary and the fire runs use a separate surface-fire model, so nothing here is a
 * validated property risk score.
 */

/** Page paths are relative to the site base (see vite.config.ts). */
export const CASE_STUDIES_PATH = 'case-studies/'
export const caseStudyPath = (slug: string) => `${CASE_STUDIES_PATH}${slug}/`

type Stat = { value: string; label: string; note: string }
type Item = { title: string; body: string }

export type CaseStudy = {
  slug: string
  /** Short name for cards and links, e.g. "Rancho Bernardo". */
  name: string
  /** City and state, e.g. "San Diego, California". */
  place: string
  /** One or two sentences for the case-study list. */
  summary: string
  /** Number of fire simulations in the risk ensemble, formatted. */
  runs: string
  meta: { title: string; description: string }
  eyebrow: string
  heading: string
  intro: string
  video: { label: string; caption: string }
  stats: Stat[]
  riskMap: {
    /** Width and height of the map in metres (the risk JSON's width and height), to reserve its space. */
    size: [number, number]
    copy: string
    label: string
    highlights: { value: string; label: string }[]
    note: string
  }
  steps: Item[]
  findings: Item[]
  limits: string[]
}

/** Wording shared by every case-study page. */
export const caseStudyCopy = {
  back: 'All case studies',
  riskMap: {
    eyebrow: 'The risk map',
    heading: 'Same neighborhood. Different homes. Different risk.',
    layers: { burn: 'Burn probability', homes: 'Home risk' },
    burnLegend: { title: 'Burn probability', note: 'Share of simulated fires that reach each 4 m cell' },
    homeLegend: { title: 'Home risk tier', note: 'Share of simulated fires in which the home ignites' },
    tiers: {
      low: 'Lower · under 10%',
      moderate: 'Moderate · 10–20%',
      elevated: 'Elevated · 20–30%',
      severe: 'Severe · 30% or more',
    },
    tooltip: {
      ignites: 'Ignites in',
      of: 'of simulated fires',
      median: 'Typically ignites',
      after: 'into the fire',
      never: 'Did not ignite in any run',
    },
  },
  steps: { eyebrow: 'What we ran', heading: 'From raw data to a simulated neighborhood' },
  findings: { eyebrow: 'What it shows', heading: 'Same wind, different exposure' },
  limits: { eyebrow: 'Read this as a demonstration', heading: 'What this case study does not show' },
  next: {
    heading: 'Where this goes next',
    copy: 'Converged, validated CFD fields coupled to ember and fire physics, run across many weather scenarios per home. That is the training data behind Sage’s fast property risk model.',
  },
  email: 'Email us about this study',
}

/** The case-study list at /case-studies/. */
export const caseStudiesPage = {
  meta: {
    title: 'Case studies | Sage',
    description:
      'Neighborhood wildfire case studies from the Sage platform: high-resolution digital twins, CFD wind fields and home-by-home risk maps across California and Utah.',
  },
  eyebrow: 'Case studies',
  heading: 'Wildfire risk, mapped home by home',
  intro:
    'Each study runs the Sage platform on one wildland-urban neighborhood: a digital twin of every building and tree, a CFD wind field for local fire weather, and hundreds of fire simulations that rank each home’s exposure.',
  cta: 'Read the case study',
  statLabels: { homes: 'Buildings', runs: 'Fire simulations' },
  note: 'Every study is a demonstration of the platform. Results rank homes within each neighborhood; they are not annual probabilities, prices or underwriting decisions.',
}

const ranchoBernardo: CaseStudy = {
  slug: 'rancho-bernardo',
  name: 'Rancho Bernardo',
  place: 'San Diego, California',
  summary:
    'The Trails, where homes meet open chaparral. 221 buildings, 2,871 trees and 816 fire simulations under dry offshore wind.',
  runs: '816',
  meta: {
    title: 'Rancho Bernardo case study | Sage',
    description:
      'How Sage mapped wildfire risk home by home across The Trails in Rancho Bernardo, San Diego: a high-resolution digital twin, a CFD wind field, and 816 fire simulations.',
  },
  eyebrow: 'Case study · San Diego County, California',
  heading: 'Rancho Bernardo: mapping wildfire risk home by home',
  intro:
    'The Trails sits where homes meet open chaparral. We built a high-resolution digital twin of roughly a square kilometre of it, down to every building and tree, solved the wind field with CFD, and ran 816 fire simulations to map the risk to each home.',
  video: {
    label:
      'Ten-second film of The Trails, Rancho Bernardo. Wind ribbons coloured by CFD speed flow from east-northeast to west-southwest across 3D buildings and trees, then an illustrative fire spreads from the northeast edge and ignites buildings in its path.',
    caption:
      'CFD wind sampled 10 m above terrain, coloured by speed. The fire is a separate illustrative scenario, shown for its first 30 simulated minutes.',
  },
  stats: [
    { value: '221', label: 'Buildings modeled', note: 'Measured heights from lidar' },
    { value: '2,871', label: 'Trees resolved', note: 'Height and crown from lidar' },
    { value: '844k', label: 'CFD mesh cells', note: 'Refined around buildings and canopy' },
    { value: '10.3 m/s', label: 'Mean local wind', note: 'Peak 20.3 m/s, from ENE' },
  ],
  riskMap: {
    size: [1120, 796],
    copy: 'One fire run shows one possible outcome, so we ran 816. They cover every dry, windy day in five years of local weather, with fire arriving from each of eight directions. Shading shows how often the fire reached each spot. Each home is coloured by how often it ignited.',
    label:
      'Risk map of The Trails, Rancho Bernardo. Burn probability is highest in the open chaparral on the east and north and falls off into the streets to the west. Of 221 homes, 35 are severe, 52 elevated, 72 moderate and 62 lower risk.',
    highlights: [
      { value: '47%', label: 'of homes fall in a different tier from their nearest neighbour, typically about 34 m away' },
      { value: '0.1–47%', label: 'range of ignition frequency across 221 homes in one neighborhood' },
      { value: '816', label: 'fire simulations: 51 fire-weather days × 8 directions × 2 random seeds' },
    ],
    note: 'Assumes a fire reaches the neighborhood under local fire weather, with every direction and weather day weighted equally. The results are uncalibrated and rank homes within this neighborhood only. They are not annual probabilities or prices.',
  },
  steps: [
    {
      title: 'Property and terrain data',
      body: 'Building footprints, 4.5 million aerial lidar points, high-resolution imagery and fuel and vegetation layers, fused into one model of a 1.1 × 0.8 km area.',
    },
    {
      title: '3D geometry',
      body: 'Lidar gives each building its measured height and each tree its height and crown. Terrain comes from the same survey.',
    },
    {
      title: 'Weather scenario',
      body: 'From five years of local hourly weather we chose the strongest dry, warm offshore hour: 10.4 m/s from the east-northeast, gusting to 17.7 m/s.',
    },
    {
      title: 'CFD wind field',
      body: 'Our CFD engine resolves the flow over the terrain, around 211 buildings, and through tree crowns modeled as porous zones.',
    },
    {
      title: 'Illustrative fire scenario',
      body: 'A separate surface-fire model ignites at the northeast edge under the same weather and runs for 30 minutes. This is the run shown in the film.',
    },
    {
      title: 'Risk ensemble',
      body: 'The same fire model, run 816 times for one simulated hour each across local fire weather and ignition directions, gives every cell a burn probability and every home an ignition frequency.',
    },
  ],
  findings: [
    {
      title: 'Wind is not uniform',
      body: 'Within one neighborhood, local wind at 10 m ranges from near calm in sheltered pockets to over 20 m/s in the most exposed spots. About a fifth of sampled points see less than half the reference wind speed.',
    },
    {
      title: 'Terrain and structures steer it',
      body: 'Terrain, buildings and tree canopy speed the flow up in some places and shelter it in others. A single regional wind value cannot show this.',
    },
    {
      title: 'Exposure follows the flow',
      body: 'In the scenario, 50 of 221 buildings ignite within 30 minutes. Fire enters from the wildland edge and runs downwind into the streets, and neighboring homes end up with different outcomes.',
    },
  ],
  limits: [
    'The CFD solve ran 1,000 iterations but did not meet its convergence thresholds. Treat the wind field as preliminary.',
    'The fire runs, including the risk ensemble, use a separate surface-fire model with uniform hourly wind. They are not driven by the CFD wind field.',
    'The risk map weights every ignition direction and fire-weather day equally and leaves out how likely ignition is and any firefighting response. It ranks homes against each other; it is not calibrated against observed losses.',
    'The source data were captured in different years, so the model is not a survey of current conditions.',
    'Building materials and vulnerability use default assumptions because no inspection records exist for this area. A home that rarely ignites in the simulations is not safe.',
  ],
}

const fountaingrove: CaseStudy = {
  slug: 'fountaingrove',
  name: 'Fountaingrove',
  place: 'Santa Rosa, California',
  summary:
    'A hillside neighborhood the 2017 Tubbs Fire burned through, now rebuilding. 81 buildings, 1,457 trees and 640 fire simulations under dry northerly wind.',
  runs: '640',
  meta: {
    title: 'Fountaingrove case study | Sage',
    description:
      'How Sage mapped wildfire risk building by building in Fountaingrove, Santa Rosa, where the 2017 Tubbs Fire burned: a high-resolution digital twin, a CFD wind field, and 640 fire simulations.',
  },
  eyebrow: 'Case study · Sonoma County, California',
  heading: 'Fountaingrove: mapping risk where the Tubbs Fire burned',
  intro:
    'The 2017 Tubbs Fire burned across all of this part of Fountaingrove, and the neighborhood is still rebuilding. We built a digital twin of about 45 hectares of it, down to every building and tree, solved the wind field with CFD, and ran 640 fire simulations to map the risk to each building.',
  video: {
    label:
      'Ten-second film of Fountaingrove, Santa Rosa. Wind ribbons coloured by CFD speed flow from north to south across 3D buildings and trees, then an illustrative fire spreads from the northern edge and ignites buildings in its path.',
    caption:
      'CFD wind sampled 10 m above terrain, coloured by speed. The fire is a separate illustrative scenario, shown for its first 30 simulated minutes.',
  },
  stats: [
    { value: '81', label: 'Buildings modeled', note: 'Measured heights from lidar' },
    { value: '1,457', label: 'Trees resolved', note: 'Height and crown from lidar' },
    { value: '405k', label: 'CFD mesh cells', note: 'Refined around buildings and canopy' },
    { value: '7.1 m/s', label: 'Mean local wind', note: 'Peak 16.7 m/s, from N' },
  ],
  riskMap: {
    size: [664, 676],
    copy: 'One fire run shows one possible outcome, so we ran 640. They cover every dry, windy day in five years of local weather, with fire arriving from each of eight directions. Shading shows how often the fire reached each spot. Each building is coloured by how often it ignited.',
    label:
      'Risk map of Fountaingrove, Santa Rosa. Burn probability is highest in the open grassland and scattered trees to the north-east and south and on the wooded slope to the west. The large buildings along that western slope are mostly severe, while the rebuilt cul-de-sac in the centre is mostly lower risk. Of 81 buildings, 23 are severe, 7 elevated, 12 moderate and 39 lower risk.',
    highlights: [
      { value: '0.2–55%', label: 'range of ignition frequency across 81 buildings in one neighborhood' },
      { value: '23 of 81', label: 'buildings ignite in 30% or more of simulated fires; 39 ignite in under 10%' },
      { value: '640', label: 'fire simulations: 40 fire-weather days × 8 directions × 2 random seeds' },
    ],
    note: 'Assumes a fire reaches the neighborhood under local fire weather, with every direction and weather day weighted equally. The results are uncalibrated and rank buildings within this neighborhood only. They are not annual probabilities or prices.',
  },
  steps: [
    {
      title: 'Property and terrain data',
      body: 'Building footprints, 7.9 million aerial lidar points, high-resolution imagery and fuel and vegetation layers, fused into one model of a 0.66 × 0.68 km area.',
    },
    {
      title: '3D geometry',
      body: 'Lidar gives each building its measured height and each tree its height and crown. Terrain comes from the same survey.',
    },
    {
      title: 'Weather scenario',
      body: 'From five years of local hourly weather we chose the windiest dry, warm hour: 8.3 m/s from the north, gusting to 18.6 m/s, at 13% relative humidity.',
    },
    {
      title: 'CFD wind field',
      body: 'Our CFD engine resolves the flow over the terrain, around 79 buildings, and through tree crowns modeled as porous zones.',
    },
    {
      title: 'Illustrative fire scenario',
      body: 'A separate surface-fire model ignites at the northern edge under the same weather and runs for 30 minutes. This is the run shown in the film.',
    },
    {
      title: 'Risk ensemble',
      body: 'The same fire model, run 640 times for one simulated hour each across local fire weather and ignition directions, gives every cell a burn probability and every building an ignition frequency.',
    },
  ],
  findings: [
    {
      title: 'Wind is not uniform',
      body: 'Local wind at 10 m ranges from near calm to almost 17 m/s within one neighborhood. About half of the sampled points see less than half the reference wind speed, sheltered by the terrain, buildings and canopy.',
    },
    {
      title: 'Surroundings set the risk',
      body: 'Buildings backing onto the wooded western slope ignite in up to 55% of simulated fires. Homes on the rebuilt cul-de-sac, ringed by pavement and irrigated yards, mostly ignite in under 10%.',
    },
    {
      title: 'Exposure follows the flow',
      body: 'In the scenario, 38 of 81 buildings ignite within 30 minutes, half of them in the first 15. Fire enters from the wildland edge and runs downwind, and neighboring buildings end up with different outcomes.',
    },
  ],
  limits: [
    'The CFD solve ran 1,000 iterations but did not meet its convergence thresholds. Treat the wind field as preliminary.',
    'The fire runs, including the risk ensemble, use a separate surface-fire model with uniform hourly wind. They are not driven by the CFD wind field.',
    'The risk map weights every ignition direction and fire-weather day equally and leaves out how likely ignition is and any firefighting response. It ranks buildings against each other; it is not calibrated against observed losses.',
    'Some homes rebuilt since the Tubbs Fire are not yet in the building inventory, so the newest lots are under-counted. The source data were captured in different years, so the model is not a survey of current conditions.',
    'Building materials and vulnerability use default assumptions because no inspection records exist for this area. A building that rarely ignites in the simulations is not safe.',
  ],
}

const suncrest: CaseStudy = {
  slug: 'suncrest',
  name: 'SunCrest',
  place: 'Draper, Utah',
  summary:
    'A ridge-top community ringed by steep shrubland on the Traverse Mountains. 167 buildings, 1,374 trees and 3,424 fire simulations across 214 fire-weather days.',
  runs: '3,424',
  meta: {
    title: 'SunCrest case study | Sage',
    description:
      'How Sage mapped wildfire risk home by home in SunCrest, Draper, Utah: a high-resolution digital twin of ridge-top homes and shrubland, a CFD wind field, and 3,424 fire simulations.',
  },
  eyebrow: 'Case study · Salt Lake and Utah counties, Utah',
  heading: 'SunCrest: mountain homes on the wildland edge',
  intro:
    'SunCrest sits on a ridge of the Traverse Mountains, with streets of homes threaded between steep shrub-covered slopes. We built a digital twin of about 42 hectares of it, down to every building and tree, solved the wind field with CFD, and ran 3,424 fire simulations to map the risk to each home.',
  video: {
    label:
      'Ten-second film of SunCrest, Draper. Wind ribbons coloured by CFD speed flow from south-southwest to north-northeast across 3D buildings and trees, then an illustrative fire spreads from the southern edge and ignites homes in its path.',
    caption:
      'CFD wind sampled 10 m above terrain, coloured by speed. The fire is a separate illustrative scenario, shown for its first 30 simulated minutes.',
  },
  stats: [
    { value: '167', label: 'Buildings modeled', note: 'Measured heights from lidar' },
    { value: '1,374', label: 'Trees resolved', note: 'Height and crown from lidar' },
    { value: '659k', label: 'CFD mesh cells', note: 'Refined around buildings and canopy' },
    { value: '7.4 m/s', label: 'Mean local wind', note: 'Peak 22.6 m/s, from SSW' },
  ],
  riskMap: {
    size: [624, 680],
    copy: 'One fire run shows one possible outcome, so we ran 3,424. They cover every dry, windy day in five years of local weather, 214 of them, with fire arriving from each of eight directions. Shading shows how often the fire reached each spot. Each home is coloured by how often it ignited.',
    label:
      'Risk map of SunCrest, Draper. Burn probability is highest on the open shrub-covered slopes to the south, east and north-west, and low on the paved streets between them. Homes along the slope edges are mostly severe or elevated, while homes on interior streets are mostly moderate. Of 167 homes, 33 are severe, 27 elevated, 81 moderate and 26 lower risk.',
    highlights: [
      { value: '27%', label: 'of homes fall in a different tier from their nearest neighbour, typically about 23 m away' },
      { value: '2–49%', label: 'range of ignition frequency across 167 homes in one neighborhood' },
      { value: '3,424', label: 'fire simulations: 214 fire-weather days × 8 directions × 2 random seeds' },
    ],
    note: 'Assumes a fire reaches the neighborhood under local fire weather, with every direction and weather day weighted equally. The results are uncalibrated and rank homes within this neighborhood only. They are not annual probabilities or prices.',
  },
  steps: [
    {
      title: 'Property and terrain data',
      body: 'Building footprints, 7.4 million aerial lidar points, high-resolution imagery and fuel and vegetation layers, fused into one model of a 0.62 × 0.68 km area.',
    },
    {
      title: '3D geometry',
      body: 'Lidar gives each building its measured height and each tree its height and crown. Terrain comes from the same survey.',
    },
    {
      title: 'Weather scenario',
      body: 'From five years of local hourly weather we chose the windiest dry, warm hour: 9.5 m/s from the south-southwest, gusting to 22.2 m/s, at 6% relative humidity and 27 °C.',
    },
    {
      title: 'CFD wind field',
      body: 'Our CFD engine resolves the flow over the ridge, around 163 buildings, and through tree crowns modeled as porous zones.',
    },
    {
      title: 'Illustrative fire scenario',
      body: 'A separate surface-fire model ignites at the southern edge under the same weather and runs for 30 minutes. This is the run shown in the film.',
    },
    {
      title: 'Risk ensemble',
      body: 'The same fire model, run 3,424 times for one simulated hour each across local fire weather and ignition directions, gives every cell a burn probability and every home an ignition frequency.',
    },
  ],
  findings: [
    {
      title: 'Wind is not uniform',
      body: 'Local wind at 10 m ranges from near calm to over 22 m/s within one neighborhood. About three in five sampled points see less than half the reference wind speed, sheltered by the ridge, buildings and canopy.',
    },
    {
      title: 'The slope edge sets the risk',
      body: 'Homes that back onto the shrub-covered slopes ignite in up to 49% of simulated fires. One street in, behind a row of houses and pavement, most homes fall to the moderate tier.',
    },
    {
      title: 'Exposure follows the flow',
      body: 'In the scenario, 55 of 167 buildings ignite within 30 minutes. Fire climbs from the southern slope and runs downwind across the streets, and neighboring homes end up with different outcomes.',
    },
  ],
  limits: [
    'The CFD solve ran 1,000 iterations but did not meet its convergence thresholds. Treat the wind field as preliminary.',
    'The fire runs, including the risk ensemble, use a separate surface-fire model with uniform hourly wind. They are not driven by the CFD wind field.',
    'The risk map weights every ignition direction and fire-weather day equally and leaves out how likely ignition is and any firefighting response. It ranks homes against each other; it is not calibrated against observed losses.',
    'The source data were captured in different years, so the model is not a survey of current conditions.',
    'Building materials and vulnerability use default assumptions because no inspection records exist for this area. A home that rarely ignites in the simulations is not safe.',
  ],
}

const topangaCanyon: CaseStudy = {
  slug: 'topanga-canyon',
  name: 'Topanga Canyon',
  place: 'Los Angeles County, California',
  summary:
    'Homes scattered through continuous woodland and chaparral in the Santa Monica Mountains. 146 buildings, 2,252 trees and 1,376 fire simulations under dry offshore wind.',
  runs: '1,376',
  meta: {
    title: 'Topanga Canyon case study | Sage',
    description:
      'How Sage mapped wildfire risk building by building in Topanga Canyon, Los Angeles County: a high-resolution digital twin of homes under dense tree canopy, a CFD wind field, and 1,376 fire simulations.',
  },
  eyebrow: 'Case study · Los Angeles County, California',
  heading: 'Topanga Canyon: homes under a continuous canopy',
  intro:
    'In the middle of Topanga Canyon, homes sit under woodland and chaparral that runs unbroken from ridge to creek, and the whole area is mapped at the highest state fire hazard class. We built a digital twin of about 46 hectares of it, down to every building and tree, solved the wind field with CFD, and ran 1,376 fire simulations to map the risk to each building.',
  video: {
    label:
      'Ten-second film of Topanga Canyon. Wind ribbons coloured by CFD speed flow from north-northeast to south-southwest across 3D buildings and dense tree canopy, then an illustrative fire spreads from the northern edge and ignites buildings in its path.',
    caption:
      'CFD wind sampled 10 m above terrain, coloured by speed. The fire is a separate illustrative scenario, shown for its first 30 simulated minutes.',
  },
  stats: [
    { value: '146', label: 'Buildings modeled', note: 'Measured heights from lidar' },
    { value: '2,252', label: 'Trees resolved', note: 'Height and crown from lidar' },
    { value: '487k', label: 'CFD mesh cells', note: 'Refined around buildings and canopy' },
    { value: '4.7 m/s', label: 'Mean local wind', note: 'Peak 21.4 m/s, from NNE' },
  ],
  riskMap: {
    size: [680, 672],
    copy: 'One fire run shows one possible outcome, so we ran 1,376. They cover every dry, windy day in five years of local weather, 86 of them, with fire arriving from each of eight directions. Shading shows how often the fire reached each spot. Each building is coloured by how often it ignited.',
    label:
      'Risk map of Topanga Canyon. Burn probability is high almost everywhere under the continuous canopy and falls off only along roads and in the paved village centre. Most buildings are severe; the lower-risk ones cluster in the village centre. Of 146 buildings, 103 are severe, 20 elevated, 10 moderate and 13 lower risk.',
    highlights: [
      { value: '103 of 146', label: 'buildings ignite in 30% or more of simulated fires, the highest share of any study' },
      { value: '3–82%', label: 'range of ignition frequency across 146 buildings in one neighborhood' },
      { value: '1,376', label: 'fire simulations: 86 fire-weather days × 8 directions × 2 random seeds' },
    ],
    note: 'Assumes a fire reaches the neighborhood under local fire weather, with every direction and weather day weighted equally. The results are uncalibrated and rank buildings within this neighborhood only. They are not annual probabilities or prices.',
  },
  steps: [
    {
      title: 'Property and terrain data',
      body: 'Building footprints, 20.3 million aerial lidar points, high-resolution imagery and fuel and vegetation layers, fused into one model of a 0.67 × 0.67 km area.',
    },
    {
      title: '3D geometry',
      body: 'Lidar gives each building its measured height and each tree its height and crown. Terrain comes from the same survey.',
    },
    {
      title: 'Weather scenario',
      body: 'From five years of local hourly weather we chose the windiest dry, warm hour: an offshore 9.8 m/s from the north-northeast, gusting to 20.1 m/s, at 7% relative humidity.',
    },
    {
      title: 'CFD wind field',
      body: 'Our CFD engine resolves the flow over the canyon terrain, around 145 buildings, and through tree crowns modeled as porous zones.',
    },
    {
      title: 'Illustrative fire scenario',
      body: 'A separate surface-fire model ignites at the northern edge under the same weather and runs for 30 minutes. This is the run shown in the film.',
    },
    {
      title: 'Risk ensemble',
      body: 'The same fire model, run 1,376 times for one simulated hour each across local fire weather and ignition directions, gives every cell a burn probability and every building an ignition frequency.',
    },
  ],
  findings: [
    {
      title: 'The canopy shelters the wind',
      body: 'Under the dense tree canopy, more than four in five sampled points see less than half the reference wind speed at 10 m, while exposed clearings and ridges reach over 21 m/s.',
    },
    {
      title: 'Continuous fuel, high risk',
      body: 'With unbroken woodland and chaparral between homes, 103 of 146 buildings ignite in 30% or more of simulated fires. The lowest-risk buildings sit in the paved village centre.',
    },
    {
      title: 'Exposure follows the flow',
      body: 'In the scenario, 112 of 146 buildings ignite within 30 minutes, half of them in the first 11. Fire runs downwind through the canopy from the wildland edge.',
    },
  ],
  limits: [
    'The CFD solve ran 1,000 iterations but did not meet its convergence thresholds. Treat the wind field as preliminary.',
    'The fire runs, including the risk ensemble, use a separate surface-fire model with uniform hourly wind. They are not driven by the CFD wind field.',
    'The risk map weights every ignition direction and fire-weather day equally and leaves out how likely ignition is and any firefighting response. It ranks buildings against each other; it is not calibrated against observed losses.',
    'The source data were captured in different years, so the model is not a survey of current conditions.',
    'Only three buildings here have post-fire inspection records; the rest use default material and vulnerability assumptions. A building that rarely ignites in the simulations is not safe.',
  ],
}

const montclair: CaseStudy = {
  slug: 'montclair',
  name: 'Montclair',
  place: 'Oakland, California',
  summary:
    'Closely spaced hillside homes under tall trees in the Oakland hills. 382 buildings, 1,691 trees and 240 fire simulations under dry northerly wind.',
  runs: '240',
  meta: {
    title: 'Montclair case study | Sage',
    description:
      'How Sage mapped wildfire risk building by building in Montclair, Oakland: a high-resolution digital twin of a dense hillside neighborhood, a CFD wind field, and 240 fire simulations.',
  },
  eyebrow: 'Case study · Alameda County, California',
  heading: 'Montclair: a dense hillside neighborhood under tall trees',
  intro:
    'Montclair climbs the Oakland hills from a village of shops into streets of closely spaced homes under a canopy of tall trees, some over 40 m. We built a digital twin of about 42 hectares of it, down to every building and tree, solved the wind field with CFD, and ran 240 fire simulations to map the risk to each building.',
  video: {
    label:
      'Ten-second film of Montclair, Oakland. Wind ribbons coloured by CFD speed flow from north-northwest to south-southeast across 3D buildings and tall trees, then an illustrative fire spreads from the northern edge and ignites buildings in its path.',
    caption:
      'CFD wind sampled 10 m above terrain, coloured by speed. The fire is a separate illustrative scenario, shown for its first 30 simulated minutes.',
  },
  stats: [
    { value: '382', label: 'Buildings modeled', note: 'Measured heights from lidar' },
    { value: '1,691', label: 'Trees resolved', note: 'Height and crown from lidar' },
    { value: '385k', label: 'CFD mesh cells', note: 'Refined around buildings and canopy' },
    { value: '5.6 m/s', label: 'Mean local wind', note: 'Peak 22.0 m/s, from NNW' },
  ],
  riskMap: {
    size: [628, 668],
    copy: 'One fire run shows one possible outcome, so we ran 240. Dry, windy days are rare here: the runs cover all 15 in five years of local weather, with fire arriving from each of eight directions. Shading shows how often the fire reached each spot. Each building is coloured by how often it ignited.',
    label:
      'Risk map of Montclair, Oakland. Burn probability is highest on the wooded slope west of the freeway and on the canopy-covered hillsides to the east, and lower on the streets to the north. The commercial village to the south and the homes beside the woodland are mostly severe; homes in the north are mostly moderate. Of 382 buildings, 144 are severe, 124 elevated, 100 moderate and 14 lower risk.',
    highlights: [
      { value: '24%', label: 'of buildings fall in a different tier from their nearest neighbour, typically about 16 m away' },
      { value: '0–67%', label: 'range of ignition frequency across 382 buildings in one neighborhood' },
      { value: '240', label: 'fire simulations: 15 fire-weather days × 8 directions × 2 random seeds' },
    ],
    note: 'Assumes a fire reaches the neighborhood under local fire weather, with every direction and weather day weighted equally. The results are uncalibrated and rank buildings within this neighborhood only. They are not annual probabilities or prices.',
  },
  steps: [
    {
      title: 'Property and terrain data',
      body: 'Building footprints, 29.5 million aerial lidar points, high-resolution imagery and fuel and vegetation layers, fused into one model of a 0.62 × 0.67 km area.',
    },
    {
      title: '3D geometry',
      body: 'Lidar gives each building its measured height and each tree its height and crown. Terrain comes from the same survey.',
    },
    {
      title: 'Weather scenario',
      body: 'From five years of local hourly weather we chose the windiest dry, warm hour: 8.2 m/s from the north-northwest, gusting to 19.9 m/s, at 11% relative humidity.',
    },
    {
      title: 'CFD wind field',
      body: 'Our CFD engine resolves the flow over the hills, around 365 buildings, and through tree crowns modeled as porous zones.',
    },
    {
      title: 'Illustrative fire scenario',
      body: 'A separate surface-fire model ignites at the northern edge under the same weather and runs for 30 minutes. This is the run shown in the film.',
    },
    {
      title: 'Risk ensemble',
      body: 'The same fire model, run 240 times for one simulated hour each across local fire weather and ignition directions, gives every cell a burn probability and every building an ignition frequency.',
    },
  ],
  findings: [
    {
      title: 'Wind is not uniform',
      body: 'Local wind at 10 m ranges from near calm to 22 m/s within one neighborhood. Seven in ten sampled points see less than half the reference wind speed, sheltered by the hills, the closely spaced homes and the tall canopy.',
    },
    {
      title: 'Density carries the fire',
      body: 'In the scenario, 245 of 382 buildings ignite within 30 minutes. More than a quarter of those ignitions come from radiant heat or direct flame contact, and about a fifth from embers.',
    },
    {
      title: 'Neighbors still differ',
      body: 'Homes here stand about 16 m apart, yet 24% of buildings fall in a different risk tier from their nearest neighbour.',
    },
  ],
  limits: [
    'The CFD solve ran 1,000 iterations on a 10 m base mesh, because the finer 8 m mesh did not give a stable solution here, and did not meet its convergence thresholds. Treat the wind field as preliminary.',
    'The fire runs, including the risk ensemble, use a separate surface-fire model with uniform hourly wind. They are not driven by the CFD wind field.',
    'Dry, windy days are rare in this record, so the risk map draws on only 15 weather days. It weights every ignition direction and weather day equally and leaves out how likely ignition is and any firefighting response. It ranks buildings against each other; it is not calibrated against observed losses.',
    'The source data were captured in different years, so the model is not a survey of current conditions.',
    'Building materials and vulnerability use default assumptions because no inspection records exist for this area. A building that rarely ignites in the simulations is not safe.',
  ],
}

const summitPark: CaseStudy = {
  slug: 'summit-park',
  name: 'Summit Park',
  place: 'Summit County, Utah',
  summary:
    'Mountain homes spread through dense forest above Parleys Canyon. 199 buildings, 2,750 trees and 672 fire simulations under dry south-westerly wind.',
  runs: '672',
  meta: {
    title: 'Summit Park case study | Sage',
    description:
      'How Sage mapped wildfire risk home by home in Summit Park, Utah: a high-resolution digital twin of homes in dense mountain forest, a CFD wind field, and 672 fire simulations.',
  },
  eyebrow: 'Case study · Summit County, Utah',
  heading: 'Summit Park: homes inside a mountain forest',
  intro:
    'Summit Park is a forest community in the Wasatch, with homes set among dense stands of tall trees on steep, winding streets. We built a digital twin of about 43 hectares of it, down to every building and tree, solved the wind field with CFD, and ran 672 fire simulations to map the risk to each home.',
  video: {
    label:
      'Ten-second film of Summit Park, Utah. Wind ribbons coloured by CFD speed flow from southwest to northeast across 3D buildings and dense forest, then an illustrative fire spreads from the southwestern edge and ignites homes in its path.',
    caption:
      'CFD wind sampled 10 m above terrain, coloured by speed. The fire is a separate illustrative scenario, shown for its first 30 simulated minutes.',
  },
  stats: [
    { value: '199', label: 'Buildings modeled', note: 'Measured heights from lidar' },
    { value: '2,750', label: 'Trees resolved', note: 'Height and crown from lidar' },
    { value: '600k', label: 'CFD mesh cells', note: 'Refined around buildings and canopy' },
    { value: '3.3 m/s', label: 'Mean local wind', note: 'Inflow 12.9 m/s, from SW' },
  ],
  riskMap: {
    size: [628, 680],
    copy: 'One fire run shows one possible outcome, so we ran 672. They cover every dry, windy day in five years of local weather, 42 of them, with fire arriving from each of eight directions. Shading shows how often the fire reached each spot. Each home is coloured by how often it ignited.',
    label:
      'Risk map of Summit Park, Utah. Burn probability is highest in the dense forest on the north-eastern and eastern slopes and lower to the west. Severe homes are spread through the forest, often next to homes in a lower tier; the lowest-risk homes cluster in the north-west. Of 199 homes, 76 are severe, 55 elevated, 49 moderate and 19 lower risk.',
    highlights: [
      { value: '49%', label: 'of homes fall in a different tier from their nearest neighbour, typically about 28 m away' },
      { value: '3–63%', label: 'range of ignition frequency across 199 homes in one neighborhood' },
      { value: '672', label: 'fire simulations: 42 fire-weather days × 8 directions × 2 random seeds' },
    ],
    note: 'Assumes a fire reaches the neighborhood under local fire weather, with every direction and weather day weighted equally. The results are uncalibrated and rank homes within this neighborhood only. They are not annual probabilities or prices.',
  },
  steps: [
    {
      title: 'Property and terrain data',
      body: 'Building footprints, 10.2 million aerial lidar points, high-resolution imagery and fuel and vegetation layers, fused into one model of a 0.62 × 0.68 km area.',
    },
    {
      title: '3D geometry',
      body: 'Lidar gives each building its measured height and each tree its height and crown. Terrain comes from the same survey.',
    },
    {
      title: 'Weather scenario',
      body: 'From five years of local hourly weather we chose the windiest dry, warm hour: 7.5 m/s from the southwest, gusting to 18.4 m/s, at 8% relative humidity and 27 °C.',
    },
    {
      title: 'CFD wind field',
      body: 'Our CFD engine resolves the flow over the mountain terrain, around 195 buildings, and through tree crowns modeled as porous zones.',
    },
    {
      title: 'Illustrative fire scenario',
      body: 'A separate surface-fire model ignites at the southwestern edge under the same weather and runs for 30 minutes. This is the run shown in the film.',
    },
    {
      title: 'Risk ensemble',
      body: 'The same fire model, run 672 times for one simulated hour each across local fire weather and ignition directions, gives every cell a burn probability and every home an ignition frequency.',
    },
  ],
  findings: [
    {
      title: 'The forest stills the wind',
      body: 'Wind enters the area at nearly 13 m/s and slows sharply once it reaches the forest: the mean at 10 m is 3.3 m/s, and more than four in five sampled points see less than half the reference speed.',
    },
    {
      title: 'Next door is not the same',
      body: 'Nearly half of all homes fall in a different risk tier from their nearest neighbour, about 28 m away. Clearings, slope and the trees around each lot matter more than the street address.',
    },
    {
      title: 'Exposure follows the flow',
      body: 'In the scenario, 81 of 199 buildings ignite within 30 minutes. Fire enters from the southwest and moves through the forest between homes, and neighboring homes end up with different outcomes.',
    },
  ],
  limits: [
    'The CFD solve ran 1,000 iterations but did not meet its convergence thresholds. Treat the wind field as preliminary. The strongest sampled winds (up to 28 m/s, shown as the peak in the film) sit at the inflow boundary, not inside the neighborhood.',
    'The fire runs, including the risk ensemble, use a separate surface-fire model with uniform hourly wind. They are not driven by the CFD wind field.',
    'The risk map weights every ignition direction and fire-weather day equally and leaves out how likely ignition is and any firefighting response. It ranks homes against each other; it is not calibrated against observed losses.',
    'Most footprints here come from machine-detected building outlines, and the aerial imagery was flown in November with early snow on the ground. The source data were captured in different years, so the model is not a survey of current conditions.',
    'Building materials and vulnerability use default assumptions because no inspection records exist for this area. A home that rarely ignites in the simulations is not safe.',
  ],
}

export const caseStudies: CaseStudy[] = [ranchoBernardo, montclair, fountaingrove, topangaCanyon, suncrest, summitPark]

export const findCaseStudy = (slug: string | undefined) => caseStudies.find((c) => c.slug === slug)
