import { X, Shield, Banknote, Home, Building, Scale, ArrowRight, Leaf, Info } from 'lucide-react'
import { QuartierKPIResponse, KPICategory, KPI_CATEGORIES } from '../../services/apiService'
import { SelectedQuartier } from '../../App'

interface KPIDisplayProps {
  quartier: SelectedQuartier
  kpiData: QuartierKPIResponse | null
  selectedCategories: KPICategory[]
  isLoading: boolean
  onClose: () => void
}

export default function KPIDisplay({
  quartier,
  kpiData,
  selectedCategories,
  isLoading,
  onClose
}: KPIDisplayProps) {
  
  const getIcon = (cat: KPICategory) => {
    switch (cat) {
      case 'confort': return <Leaf className="w-5 h-5 text-slate-400" />
      case 'surete': return <Shield className="w-5 h-5 text-slate-400" />
      case 'prix_m2': return <Banknote className="w-5 h-5 text-slate-400" />
      case 'loyers': return <Home className="w-5 h-5 text-slate-400" />
      case 'logements_sociaux': return <Building className="w-5 h-5 text-slate-400" />
      case 'comparaison': return <Scale className="w-5 h-5 text-slate-400" />
      default: return <Info className="w-5 h-5 text-slate-400" />
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 border border-white/5 rounded-2xl shadow-xl overflow-hidden animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">
                {quartier.arrondissement}e ARR.
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{quartier.nom_quartier}</h2>
            <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mt-1">Données Officielles • {quartier.code_insee}</div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
        {isLoading ? (
          <div className="space-y-4 py-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : kpiData ? (
          <div className="space-y-4 py-6">
            {selectedCategories.map(catKey => {
              const data = kpiData.kpis[catKey as keyof typeof kpiData.kpis]
              const catInfo = KPI_CATEGORIES.find(c => c.key === catKey)
              
              if (!data) return null

              return (
                <div 
                  key={catKey} 
                  className="bg-slate-800/40 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-white/5">
                        {getIcon(catKey as KPICategory)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{catInfo?.label}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Mise à jour 2024</p>
                      </div>
                    </div>
                    
                    {/* Score Value */}
                    {(catKey === 'confort' || catKey === 'surete') && (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {Math.round((data as any)[catKey === 'confort' ? 'score_confort_urbain_100' : 'score_surete_quartier_moyen_100'] || 0)}
                          <span className="text-xs text-slate-500 ml-1">/100</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {catKey === 'confort' && (
                      <>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Points Gares</div>
                          <div className="text-base font-bold text-slate-200">{Math.round((data as any).gares_estime || 0)}</div>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Niveau Risque</div>
                          <div className="text-base font-bold text-slate-200">{Math.round((data as any).risque_incidents_100 || 0)}%</div>
                        </div>
                      </>
                    )}
                    {catKey === 'prix_m2' && (
                      <>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Prix Médian</div>
                          <div className="text-base font-bold text-slate-200">{Math.round((data as any).prix_m2_median || 0).toLocaleString()} €</div>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Ventes/An</div>
                          <div className="text-base font-bold text-slate-200">{Math.round((data as any).nb_ventes_estime || 0)}</div>
                        </div>
                      </>
                    )}
                    {catKey === 'loyers' && (
                      <>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Ref. Loyer</div>
                          <div className="text-base font-bold text-slate-200">{Math.round((data as any).loyer_reference_median || 0)} €/m²</div>
                        </div>
                        <div className="bg-slate-900/40 p-3 rounded-lg border border-white/5">
                          <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Taille Médiane</div>
                          <div className="text-base font-bold text-slate-200">{Math.round((data as any).nombre_pieces_median || 0)} p.</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Info className="w-8 h-8 text-slate-700 mb-3" />
            <p className="text-slate-500 text-sm font-medium">Aucune donnée sélectionnée</p>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="p-6 border-t border-white/5 bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Indice Global</div>
            <div className="text-xl font-bold text-white">{Math.round((kpiData?.kpis?.confort as any)?.score_confort_urbain_100 || 0)}<span className="text-xs text-slate-500 ml-1">/100</span></div>
          </div>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2">
            RAPPORT COMPLET <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
