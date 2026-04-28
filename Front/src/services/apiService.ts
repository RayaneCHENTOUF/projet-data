/**
 * API Service — Client-side mock service using local JSON data
 */

import quartiersData from '../data/paris-quartiers.json'
import arrondissementsData from '../data/paris-arrondissements.json'
import confortKPI from '../data/kpi/confort_urbain.json'
import sureteKPI from '../data/kpi/surete.json'
import prixM2KPI from '../data/kpi/prix_m2.json'
import loyersKPI from '../data/kpi/loyers.json'
import socialKPI from '../data/kpi/logements_sociaux.json'
import comparaisonKPI from '../data/kpi/comparaison_immobilier.json'

export interface Quartier {
  code_insee: string
  nom_quartier: string
  arrondissement: number
  code_quartier: string
  surface: number
  perimetre: number
  lat: number
  lon: number
}

export interface Arrondissement {
  arrondissement: number
  nb_quartiers: number
  quartiers: string[]
}

export interface KPIConfort {
  arrondissement: number | string
  code_insee_quartier: number | string
  nom_quartier: string
  surface_quartier_m2: number
  incidents_estime: number
  travaux_estime: number
  gares_estime: number
  risque_incidents_100: number
  score_confort_urbain_100: number
}

export interface KPISurete {
  annee: number
  score_surete_quartier_moyen_100: number
  score_risque_quartier_moyen_100: number
  dist_commissariat_km_moyenne: number
  nb_cameras_arrondissement: number
}

export interface KPIPrixM2 {
  annee: number
  prix_m2_median: number
  prix_m2_moyen: number
  nb_ventes: number
  nb_ventes_estime: number
}

export interface KPILoyers {
  annee: number
  loyer_reference_median: number
  loyer_reference_moyen: number
  loyer_reference_majore_median: number
  loyer_reference_minore_median: number
  nombre_pieces_median: number
  nom_quartier: string
  type_location_mode: string
  epoque_construction_mode: string
}

export interface KPILogementsSociaux {
  annee: number
  nom_quartier: string
  logements_finances_total: number
  nb_programmes: number
  nb_bailleurs: number
  nb_pla_i_total: number
  nb_plus_total: number
  nb_pls_total: number
}

export interface KPIComparaison {
  annee: number
  prix_m2_median: number
  loyer_reference_median: number
  kpi_comparaison_achat_location: number
  nb_transactions_estime: number
}

export interface QuartierKPIResponse {
  quartier: Quartier | null
  kpis: {
    confort?: KPIConfort
    surete?: KPISurete
    surete_historique?: KPISurete[]
    prix_m2?: KPIPrixM2
    prix_m2_historique?: KPIPrixM2[]
    loyers?: KPILoyers
    loyers_historique?: KPILoyers[]
    logements_sociaux?: KPILogementsSociaux
    logements_sociaux_historique?: KPILogementsSociaux[]
    comparaison?: KPIComparaison
    comparaison_historique?: KPIComparaison[]
  }
  categories_requested: string[]
}

export interface RankedQuartier {
  code_insee: string
  nom_quartier: string
  arrondissement: number
  scores: Record<string, number | null>
  composite_score: number
  rank: number
}

export interface RankingResponse {
  arrondissement: number
  categories: string[]
  ranking: RankedQuartier[]
}

export type KPICategory = 'confort' | 'surete' | 'prix_m2' | 'loyers' | 'logements_sociaux' | 'comparaison'

export const KPI_CATEGORIES: { key: KPICategory; label: string; icon: string; description: string }[] = [
  { key: 'confort', label: 'Confort Urbain', icon: 'confort', description: 'Gares, espaces verts et nuisances' },
  { key: 'surete', label: 'Sûreté', icon: 'surete', description: 'Indices de sécurité et incidents' },
  { key: 'prix_m2', label: 'Prix au m²', icon: 'prix', description: 'Prix médians de vente immobilière' },
  { key: 'loyers', label: 'Encadrement Loyers', icon: 'loyer', description: 'Loyers de référence par m²' },
  { key: 'logements_sociaux', label: 'Logements Sociaux', icon: 'social', description: 'Part de logements sociaux' },
  { key: 'comparaison', label: 'Comparaison', icon: 'compare', description: 'Analyse comparative locale' },
]

export interface Address {
  numero: string
  rue: string
  code_postal: string
  lat: number
  lon: number
  full: string
  type?: string
  statut?: string
}

// ─── Utility ────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function normalizeString(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// ─── API calls (Mocked) ──────────────────────────────────────────────────

export async function fetchQuartiers(): Promise<Quartier[]> {
  await delay(200)
  return (quartiersData as any).features.map((f: any) => ({
    code_insee: f.properties.c_quinsee,
    nom_quartier: f.properties.l_qu,
    arrondissement: f.properties.c_ar,
    code_quartier: f.properties.c_qu,
    surface: f.properties.surface,
    perimetre: f.properties.perimetre,
    lat: f.properties.geom_x_y.lat,
    lon: f.properties.geom_x_y.lon,
  }))
}

export async function fetchArrondissements(): Promise<Arrondissement[]> {
  await delay(200)
  const quartiers = await fetchQuartiers()
  
  return Array.from({ length: 20 }, (_, i) => i + 1).map(num => {
    const arrQuartiers = quartiers.filter(q => q.arrondissement === num)
    return {
      arrondissement: num,
      nb_quartiers: arrQuartiers.length,
      quartiers: arrQuartiers.map(q => q.nom_quartier)
    }
  })
}

export async function searchAddress(query: string): Promise<Address[]> {
  await delay(300)
  const normalizedQuery = normalizeString(query)
  const results: Address[] = []
  
  // Very simple mock search
  const streets = [
    'Rue de Rivoli', 'Rue du Louvre', 'Boulevard Haussmann', 'Avenue des Champs-Élysées',
    'Rue de Rennes', 'Boulevard Saint-Germain', 'Rue de Vaugirard', 'Rue Oberkampf'
  ]
  
  streets.forEach(street => {
    if (normalizeString(street).includes(normalizedQuery)) {
      results.push({
        numero: '12',
        rue: street,
        code_postal: '75001',
        lat: 48.8566 + (Math.random() - 0.5) * 0.05,
        lon: 2.3488 + (Math.random() - 0.5) * 0.05,
        full: `12 ${street}, 75001 Paris`
      })
    }
  })
  
  return results
}

export async function lookupQuartier(lat: number, lon: number): Promise<Quartier> {
  await delay(100)
  const quartiers = await fetchQuartiers()
  // Proximity lookup
  return quartiers.sort((a, b) => {
    const distA = Math.pow(a.lat - lat, 2) + Math.pow(a.lon - lon, 2)
    const distB = Math.pow(b.lat - lat, 2) + Math.pow(b.lon - lon, 2)
    return distA - distB
  })[0]
}

import { generateMockAddresses } from '../data/mock-addresses'

export async function fetchQuartierAddresses(codeInsee: string): Promise<Address[]> {
  await delay(300)
  const quartiers = await fetchQuartiers()
  const quartier = quartiers.find(q => q.code_insee === codeInsee)
  if (!quartier) return []

  const mockDetails = generateMockAddresses(quartier.nom_quartier)
  
  return mockDetails.map(d => ({
    numero: d.numero,
    rue: d.rue,
    code_postal: `7500${quartier.arrondissement}`.slice(-5),
    lat: quartier.lat + (Math.random() - 0.5) * 0.005,
    lon: quartier.lon + (Math.random() - 0.5) * 0.005,
    full: `${d.numero} ${d.rue}, 7500${quartier.arrondissement} Paris`.slice(0, -6) + `7500${quartier.arrondissement}`.slice(-5) + ' Paris',
    type: d.type,
    statut: d.statut
  }))
}


export async function fetchQuartierKPIs(
  codeInsee: string,
  categories: KPICategory[],
  annee: number = 2023
): Promise<QuartierKPIResponse> {
  await delay(400)
  const quartiers = await fetchQuartiers()
  const quartier = quartiers.find(q => q.code_insee === codeInsee) || null
  
  const response: QuartierKPIResponse = {
    quartier,
    kpis: {},
    categories_requested: categories
  }
  
  const insee = parseInt(codeInsee)
  
  if (categories.includes('confort')) {
    response.kpis.confort = (confortKPI as any[]).find(k => k.code_insee_quartier === insee)
  }
  if (categories.includes('surete')) {
    const data = (sureteKPI as any[]).filter(k => k.code_insee_quartier === insee)
    response.kpis.surete = data.find(k => k.annee === annee) || data[0]
    response.kpis.surete_historique = data.sort((a, b) => a.annee - b.annee)
  }
  if (categories.includes('prix_m2')) {
    const data = (prixM2KPI as any[]).filter(k => k.code_insee_quartier === insee)
    response.kpis.prix_m2 = data.find(k => k.annee === annee) || data[0]
    response.kpis.prix_m2_historique = data.sort((a, b) => a.annee - b.annee)
  }
  if (categories.includes('loyers')) {
    const data = (loyersKPI as any[]).filter(k => k.code_insee_quartier === insee)
    response.kpis.loyers = data.find(k => k.annee === annee) || data[0]
    response.kpis.loyers_historique = data.sort((a, b) => a.annee - b.annee)
  }
  if (categories.includes('logements_sociaux')) {
    const data = (socialKPI as any[]).filter(k => k.code_insee_quartier === insee)
    response.kpis.logements_sociaux = data.find(k => k.annee === annee) || data[0]
    response.kpis.logements_sociaux_historique = data.sort((a, b) => a.annee - b.annee)
  }
  if (categories.includes('comparaison')) {
    const data = (comparaisonKPI as any[]).filter(k => k.code_insee_quartier === insee)
    response.kpis.comparaison = data.find(k => k.annee === annee) || data[0]
    response.kpis.comparaison_historique = data.sort((a, b) => a.annee - b.annee)
  }
  
  return response
}

export async function fetchArrondissementRanking(
  arrNum: number,
  categories: KPICategory[]
): Promise<RankingResponse> {
  await delay(500)
  const quartiers = await fetchQuartiers()
  const arrQuartiers = quartiers.filter(q => q.arrondissement === arrNum)
  
  const ranking: RankedQuartier[] = arrQuartiers.map(q => {
    const insee = parseInt(q.code_insee)
    const scores: Record<string, number | null> = {}
    
    // Simple composite score based on available KPIs
    let totalScore = 0
    let count = 0
    
    if (categories.includes('confort')) {
      const val = (confortKPI as any[]).find(k => k.code_insee_quartier === insee)?.score_confort_urbain_100
      scores.confort = val || null
      if (val) { totalScore += val; count++ }
    }
    if (categories.includes('surete')) {
      const val = (sureteKPI as any[]).find(k => k.code_insee_quartier === insee && k.annee === 2023)?.score_surete_quartier_moyen_100
      scores.surete = val || null
      if (val) { totalScore += val; count++ }
    }
    // Add other categories as needed...
    
    return {
      code_insee: q.code_insee,
      nom_quartier: q.nom_quartier,
      arrondissement: q.arrondissement,
      scores,
      composite_score: count > 0 ? totalScore / count : 0,
      rank: 0 // Will be set after sorting
    }
  })
  
  ranking.sort((a, b) => b.composite_score - a.composite_score)
  ranking.forEach((r, i) => r.rank = i + 1)
  
  return {
    arrondissement: arrNum,
    categories,
    ranking
  }
}

