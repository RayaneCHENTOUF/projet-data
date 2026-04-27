import { X, Search, MapPin, Info, Navigation } from 'lucide-react'
import { useMemo, useState, useEffect } from 'react'
import parisData from '@/data/paris-quartiers.json'
import { fetchAddressesInPolygon, OverpassAddress } from '@/services/overpassApi'

interface SidebarProps {
  selectedArrondissement: string | null
  onClose: () => void
  onSelect: (id: string) => void
  selectedAddress: OverpassAddress | null
  setSelectedAddress: (addr: OverpassAddress | null) => void
}

export default function Sidebar({ selectedArrondissement, onClose, onSelect, selectedAddress, setSelectedAddress }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const quartierInfo = selectedArrondissement 
    ? (parisData as any).features.find((f: any) => f.properties.l_qu === selectedArrondissement)?.properties 
    : null;

  const allQuartiers = useMemo(() => {
    const list = (parisData as any).features.map((f: any) => f.properties.l_qu)
    return list.sort((a: string, b: string) => a.localeCompare(b, 'fr'))
  }, [])

  const filteredQuartiers = allQuartiers.filter((q: string) => 
    q.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const [realAddresses, setRealAddresses] = useState<OverpassAddress[]>([])
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedArrondissement) {
      setRealAddresses([])
      setSelectedAddress(null)
      return
    }

    const feature = (parisData as any).features.find((f: any) => f.properties.l_qu === selectedArrondissement)
    if (feature && feature.geometry && feature.geometry.coordinates) {
      const coords = feature.geometry.coordinates[0]
      
      setIsLoadingAddresses(true)
      setAddressError(null)
      setSelectedAddress(null)
      
      fetchAddressesInPolygon(coords)
        .then(addresses => {
          setRealAddresses(addresses)
        })
        .catch(err => {
          console.error(err)
          setAddressError("Impossible de charger les adresses du quartier.")
        })
        .finally(() => {
          setIsLoadingAddresses(false)
        })
    }
  }, [selectedArrondissement])

  const handleAddressClick = (addr: OverpassAddress) => {
    setSelectedAddress(selectedAddress?.id === addr.id ? null : addr)
  }

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col pointer-events-auto border-r border-slate-800 shadow-2xl z-20">
      {/* Header */}
      <div className="px-8 py-7 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/10 blur-2xl"></div>
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2 relative z-10">
          <MapPin className="w-6 h-6 text-blue-500" />
          Paris Explorer
        </h1>
        <p className="text-sm text-slate-400 mt-1.5 font-medium relative z-10">Cartographie interactive des quartiers</p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-transparent">
        {selectedArrondissement && quartierInfo ? (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 ease-out">
            <div className="flex justify-between items-start mb-8">
              <div className="pr-4">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  <span>Sélection</span>
                </span>
                <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight">{selectedArrondissement}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 shadow-sm border border-slate-700 rounded-full text-slate-400 hover:text-white transition-all flex-shrink-0"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* KPI — Arrondissement */}
              <div className="bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-800 flex items-center space-x-4 transition-transform hover:-translate-y-0.5">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Arrondissement</p>
                  <p className="text-lg font-bold text-slate-100">{quartierInfo.c_ar}e Arrondissement</p>
                </div>
              </div>

              {/* Placeholder KPI — branché à l'API */}
              <div className="bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-800 border-dashed flex items-center space-x-4 opacity-50">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">KPI Confort</p>
                  <p className="text-sm text-slate-500 italic">En attente de l'API…</p>
                </div>
              </div>
            </div>

            {/* Address list */}
            <div className="mt-8 border-t border-slate-800 pt-8 pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-500" />
                  Toutes les Adresses ({isLoadingAddresses ? '...' : realAddresses.length})
                </h3>
                {selectedAddress && (
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full animate-pulse">
                    📍 Localisée
                  </span>
                )}
              </div>
              
              <div className="space-y-2">
                {isLoadingAddresses ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 animate-pulse">
                      <div className="h-4 bg-slate-800 rounded w-3/4 mb-3"></div>
                      <div className="h-3 bg-slate-800/50 rounded w-1/2"></div>
                    </div>
                  ))
                ) : addressError ? (
                  <div className="p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
                    {addressError}
                  </div>
                ) : realAddresses.length === 0 ? (
                  <div className="p-4 text-sm text-slate-500 text-center">
                    Aucune adresse trouvée pour ce quartier.
                  </div>
                ) : (
                  realAddresses.map((addr) => {
                    const isSelected = selectedAddress?.id === addr.id
                    return (
                      <button
                        key={addr.id}
                        onClick={() => handleAddressClick(addr)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 group ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                            : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Numéro Badge */}
                          <div className={`font-bold text-sm w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-blue-500 text-white border-blue-400'
                              : 'bg-slate-800 text-slate-300 border-slate-700 group-hover:border-slate-600'
                          }`}>
                            {addr.numero}
                          </div>
                          {/* Rue + info */}
                          <div className="flex-1 min-w-0">
                            <div className={`font-semibold text-sm truncate transition-colors ${
                              isSelected ? 'text-blue-300' : 'text-slate-200 group-hover:text-white'
                            }`}>
                              {addr.rue}
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {selectedArrondissement}
                            </div>
                          </div>
                          {/* Localiser icon */}
                          <Navigation className={`w-4 h-4 shrink-0 transition-all ${
                            isSelected
                              ? 'text-blue-400 opacity-100'
                              : 'text-slate-600 opacity-0 group-hover:opacity-100'
                          }`} />
                        </div>
                        {/* KPI placeholder — l'équipe API pourra brancher ici */}
                        {isSelected && (
                          <div className="mt-3 pt-3 border-t border-blue-500/20">
                            <p className="text-[11px] text-blue-400/70 italic flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block"></span>
                              KPI en cours de chargement par l'API…
                            </p>
                          </div>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500 ease-out h-full flex flex-col">
            <div className="bg-slate-900 shadow-lg border border-slate-800 rounded-2xl p-6 mb-6 flex items-start space-x-4">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-slate-300 text-sm font-medium leading-relaxed">
                Naviguez librement sur la carte ou utilisez l'index ci-dessous pour trouver l'un des 80 quartiers parisiens.
              </p>
            </div>

            {/* Liste de tous les quartiers */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex-1 flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                <div className="relative group">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Filtrer les quartiers..." 
                    className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm font-medium text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-slate-500 shadow-inner"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <ul className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-800">
                {filteredQuartiers.length > 0 ? (
                  filteredQuartiers.map((q: string) => (
                    <li key={q}>
                      <button 
                        className="w-full relative flex items-center justify-between px-6 py-4 text-left group hover:bg-slate-800/50 focus:bg-slate-800 focus:outline-none transition-all"
                        onClick={() => onSelect(q)}
                      >
                        <span className="text-sm font-semibold text-slate-300 group-hover:text-blue-400 transition-colors">
                          {q}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="px-6 py-12 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-5 h-5 text-slate-500" />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Aucun quartier correspondant</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
