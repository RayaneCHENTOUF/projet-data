import confortUrbainData from '@/data/kpi/confort_urbain.json'
import suretneData from '@/data/kpi/surete.json'
import prixM2Data from '@/data/kpi/prix_m2.json'
// import loyersData from '@/data/kpi/loyers.json'
// import comparaisonData from '@/data/kpi/comparaison_immobilier.json'
// import logementsSociauxData from '@/data/kpi/logements_sociaux.json'

export interface KPIConfortUrbain {
  arrondissement: number | string
  code_insee_quartier: number | string
  nom_quartier: string
  surface_quartier_m2: number
  part_surface: number
  incidents_estime: number
  travaux_estime: number
  gares_estime: number
  risque_incidents_100: number
  score_confort_urbain_100: number
}

export interface KPISurete {
  annee: number
  arrondissement: number | string
  code_insee_quartier: number | string
  score_surete_quartier_moyen_100: number
  score_risque_quartier_moyen_100: number
  score_surete_iris_min_100: number
  score_surete_iris_max_100: number
  score_surete_iris_std_100: number
  dist_commissariat_km_moyenne: number
  nb_cameras_arrondissement: number
}

export interface KPIPrixM2 {
  annee: number
  arrondissement: number | string
  code_insee_quartier: number | string
  prix_m2_median: number
  prix_m2_moyen: number
  nb_ventes: number
  nb_ventes_estime: number
  surface_quartier_m2: number
}

export interface QuartierKPIs {
  nom_quartier: string
  arrondissement: string | number
  code_insee_quartier: string | number
  confortUrbain?: KPIConfortUrbain
  surete?: KPISurete
  prixM2?: KPIPrixM2
}

export const kpiService = {
  getQuartierKPIs(quartierName: string): QuartierKPIs {
    const confort = (confortUrbainData as any[]).find(
      k => k.nom_quartier.toLowerCase() === quartierName.toLowerCase()
    )
    const surete = (suretneData as any[]).find(
      k => k.code_insee_quartier === confort?.code_insee_quartier && k.annee === new Date().getFullYear() - 1
    )
    const prixM2 = (prixM2Data as any[]).find(
      k => k.code_insee_quartier === confort?.code_insee_quartier && k.annee === new Date().getFullYear() - 1
    )

    return {
      nom_quartier: quartierName,
      arrondissement: confort?.arrondissement || '',
      code_insee_quartier: confort?.code_insee_quartier || '',
      confortUrbain: confort,
      surete: surete,
      prixM2: prixM2
    }
  },

  getAllQuartiers(): string[] {
    return (confortUrbainData as any[])
      .map((k: any) => k.nom_quartier)
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort()
  },

  searchQuartierByName(searchTerm: string): KPIConfortUrbain[] {
    return (confortUrbainData as any[]).filter((k: any) =>
      k.nom_quartier.toLowerCase().includes(searchTerm.toLowerCase())
    ) as KPIConfortUrbain[]
  }
}
