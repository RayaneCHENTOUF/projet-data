import { useState } from 'react'
import MapboxMap from './components/Map/MapboxMap'
import Sidebar from './components/Sidebar/Sidebar'
import { OverpassAddress } from './services/overpassApi'
import parisData from './data/paris-quartiers.json'
import { Maximize2, Route } from 'lucide-react'

function App() {
  const [selectedArrondissement, setSelectedArrondissement] = useState<string | null>(null)
  const [selectedAddress, setSelectedAddress] = useState<OverpassAddress | null>(null)

  const quartierInfo = selectedArrondissement
    ? (parisData as any).features.find((f: any) => f.properties.l_qu === selectedArrondissement)?.properties
    : null

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <MapboxMap
          selectedArrondissement={selectedArrondissement}
          setSelectedArrondissement={setSelectedArrondissement}
          selectedAddress={selectedAddress}
        />
      </div>

      {/* Top Info Bar — Superficie & Périmètre */}
      {selectedArrondissement && quartierInfo && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 pointer-events-none" style={{ left: 'calc(200px + 50%)' }}>
          {/* Superficie */}
          <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl px-5 py-3 shadow-xl shadow-black/30">
            <div className="p-2 bg-indigo-500/15 text-indigo-400 rounded-xl">
              <Maximize2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Superficie</p>
              <p className="text-base font-extrabold text-white leading-tight">
                {Math.round(quartierInfo.surface / 10000)}{' '}
                <span className="text-xs font-medium text-slate-400">ha</span>
              </p>
            </div>
          </div>

          {/* Séparateur */}
          <div className="w-px h-8 bg-slate-700/50" />

          {/* Périmètre */}
          <div className="flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-2xl px-5 py-3 shadow-xl shadow-black/30">
            <div className="p-2 bg-sky-500/15 text-sky-400 rounded-xl">
              <Route className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Périmètre</p>
              <p className="text-base font-extrabold text-white leading-tight">
                {(quartierInfo.perimetre / 1000).toFixed(2)}{' '}
                <span className="text-xs font-medium text-slate-400">km</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="absolute top-0 left-0 h-full w-[400px] bg-slate-950 border-r border-slate-800 z-10 flex flex-col">
        <Sidebar
          selectedArrondissement={selectedArrondissement}
          onClose={() => {
            setSelectedArrondissement(null)
            setSelectedAddress(null)
          }}
          onSelect={setSelectedArrondissement}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
        />
      </div>
    </div>
  )
}

export default App
