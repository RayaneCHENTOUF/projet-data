import { useState, useEffect, useMemo } from 'react'
import MapboxMap from './components/Map/MapboxMap'
import Sidebar from './components/Sidebar/Sidebar'
import KPIDisplay from './components/KPI/KPIDisplay'
import ArrondissementRanking from './components/Ranking/ArrondissementRanking'
import { KPICategory, QuartierKPIResponse, RankingResponse, fetchQuartierKPIs, fetchArrondissementRanking, searchAddress, lookupQuartier } from './services/apiService'
import parisData from './data/paris-quartiers.json'

export interface SelectedQuartier {
  code_insee: string
  nom_quartier: string
  arrondissement: number
  lat: number
  lon: number
}

type ViewMode = 'quartier' | 'arrondissement'

function App() {
  // ─── State ──────────────────────────────────────────────────────────
  const [selectedQuartier, setSelectedQuartier] = useState<SelectedQuartier | null>(null)
  const [selectedArrondissement, setSelectedArrondissement] = useState<number | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<KPICategory[]>(['confort', 'surete', 'prix_m2'])
  const [viewMode, setViewMode] = useState<ViewMode>('quartier')
  const [kpiData, setKpiData] = useState<QuartierKPIResponse | null>(null)
  const [rankingData, setRankingData] = useState<RankingResponse | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ─── Fetch KPIs when quartier or categories change ─────────────────
  useEffect(() => {
    if (!selectedQuartier || selectedCategories.length === 0) {
      setKpiData(null)
      return
    }
    setIsLoading(true)
    fetchQuartierKPIs(selectedQuartier.code_insee, selectedCategories)
      .then(data => setKpiData(data))
      .catch(err => console.error('KPI fetch error:', err))
      .finally(() => setIsLoading(false))
  }, [selectedQuartier, selectedCategories])

  // ─── Fetch ranking when arrondissement or categories change ────────
  useEffect(() => {
    if (viewMode !== 'arrondissement' || selectedArrondissement === null || selectedCategories.length === 0) {
      setRankingData(null)
      return
    }
    setIsLoading(true)
    fetchArrondissementRanking(selectedArrondissement, selectedCategories)
      .then(data => setRankingData(data))
      .catch(err => console.error('Ranking fetch error:', err))
      .finally(() => setIsLoading(false))
  }, [selectedArrondissement, selectedCategories, viewMode])

  // ─── Selection Handlers ────────────────────────────────────────────
  const handleQuartierSelect = (name: string) => {
    // Check if it's an address (from search) or a quartier name
    if (name.includes(',') || name.match(/\d+/)) {
      // It's likely an address search result
      searchAddress(name).then(results => {
        if (results.length > 0) {
          const addr = results[0]
          setSelectedAddress(addr)
          // Find quartier for this address
          lookupQuartier(addr.lat, addr.lon).then(q => {
            setSelectedQuartier({
              code_insee: q.code_insee,
              nom_quartier: q.nom_quartier,
              arrondissement: q.arrondissement,
              lat: addr.lat,
              lon: addr.lon
            })
            setSelectedArrondissement(q.arrondissement)
            setViewMode('quartier')
          }).catch(console.error)
        }
      })
    } else {
      // It's a quartier name
      const feature = (parisData as any).features.find(
        (f: any) => f.properties.l_qu === name
      )
      if (feature) {
        const props = feature.properties
        setSelectedQuartier({
          code_insee: props.c_quinsee,
          nom_quartier: props.l_qu,
          arrondissement: props.c_ar,
          lat: props.geom_x_y?.lat || 0,
          lon: props.geom_x_y?.lon || 0,
        })
        setSelectedArrondissement(props.c_ar)
        setViewMode('quartier')
        setSelectedAddress(null)
      }
    }
  }

  const handleArrondissementSelect = (arrNum: number) => {
    setSelectedArrondissement(arrNum)
    setViewMode('arrondissement')
    setSelectedQuartier(null)
    setSelectedAddress(null)
  }

  const toggleCategory = (cat: KPICategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans selection:bg-blue-500/30">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <MapboxMap
          selectedArrondissement={selectedQuartier?.nom_quartier || null}
          setSelectedArrondissement={handleQuartierSelect}
          selectedAddress={selectedAddress}
        />
      </div>

      {/* Sidebar — Left */}
      <div className="absolute top-4 left-4 bottom-4 w-[380px] z-10 flex flex-col pointer-events-auto">
        <Sidebar
          selectedQuartier={selectedQuartier}
          selectedArrondissement={selectedArrondissement}
          selectedCategories={selectedCategories}
          viewMode={viewMode}
          onQuartierSelect={handleQuartierSelect}
          onArrondissementSelect={handleArrondissementSelect}
          onCategoryToggle={toggleCategory}
          onViewModeChange={setViewMode}
          onAddressSelect={(addr) => {
            setSelectedAddress(addr);
            // Ensure the quartier KPIs are visible if they weren't
            if (!selectedQuartier || selectedQuartier.code_insee !== selectedQuartier?.code_insee) {
              handleQuartierSelect(selectedQuartier?.nom_quartier || '');
            }
          }}
          onClose={() => {
            setSelectedQuartier(null)
            setSelectedArrondissement(null)
            setSelectedAddress(null)
            setKpiData(null)
            setRankingData(null)
          }}
        />
      </div>

      {/* Dashboard — Right Panel */}
      <div className="absolute top-4 right-4 bottom-4 w-[460px] z-20 flex flex-col pointer-events-none">
        <div className="pointer-events-auto h-full overflow-hidden flex flex-col">
          {viewMode === 'quartier' && selectedQuartier && (
            <KPIDisplay
              quartier={selectedQuartier}
              kpiData={kpiData}
              selectedCategories={selectedCategories}
              isLoading={isLoading}
              onClose={() => {
                setSelectedQuartier(null)
                setKpiData(null)
              }}
            />
          )}
          {viewMode === 'arrondissement' && selectedArrondissement !== null && (
            <ArrondissementRanking
              arrondissement={selectedArrondissement}
              rankingData={rankingData}
              selectedCategories={selectedCategories}
              isLoading={isLoading}
              onClose={() => {
                setSelectedArrondissement(null)
                setRankingData(null)
                setViewMode('quartier')
              }}
              onQuartierClick={handleQuartierSelect}
            />
          )}
        </div>
      </div>


    </div>
  )
}

export default App
