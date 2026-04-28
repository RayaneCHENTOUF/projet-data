import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface FilterSectionProps {
  filters: {
    showIris: boolean
    showLogementsSociaux: boolean
    showDVF: boolean
    showLoyers: boolean
    showDelinquance: boolean
    showTransports: boolean
    priceRange: [number, number]
    zoom: number
  }
  handleFilterChange: (key: string, value: any) => void
}

export default function FilterSection({ filters, handleFilterChange }: FilterSectionProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    couches: true,
    prix: true,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const layerOptions = [
    { key: 'showIris', label: 'Zones IRIS', color: '#0EA5E9' },
    { key: 'showLogementsSociaux', label: 'Logements sociaux', color: '#10B981' },
    { key: 'showDVF', label: 'Transactions DVF', color: '#F59E0B' },
    { key: 'showLoyers', label: 'Encadrement loyers', color: '#EC4899' },
    { key: 'showDelinquance', label: 'Délinquance', color: '#EF4444' },
    { key: 'showTransports', label: 'Gares & Transports', color: '#8B5CF6' },
  ]

  return (
    <div className="p-4 space-y-4">
      {/* Couches */}
      <div className="border border-slate-600 rounded-lg">
        <button
          onClick={() => toggleSection('couches')}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 hover:bg-slate-600 transition rounded-t-lg"
        >
          <h3 className="font-semibold text-white">Couches de données</h3>
          <ChevronDown
            className={`w-5 h-5 transition ${expandedSections.couches ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.couches && (
          <div className="p-4 space-y-3 bg-slate-800">
            {layerOptions.map(option => (
              <label key={option.key} className="flex items-center gap-3 cursor-pointer hover:bg-slate-700 p-2 rounded transition">
                <input
                  type="checkbox"
                  checked={filters[option.key as keyof typeof filters] as boolean}
                  onChange={(e) => handleFilterChange(option.key, e.target.checked)}
                  className="w-4 h-4 rounded cursor-pointer"
                />
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm text-slate-300">{option.label}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Prix */}
      <div className="border border-slate-600 rounded-lg">
        <button
          onClick={() => toggleSection('prix')}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 hover:bg-slate-600 transition rounded-t-lg"
        >
          <h3 className="font-semibold text-white">Gamme de prix</h3>
          <ChevronDown
            className={`w-5 h-5 transition ${expandedSections.prix ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.prix && (
          <div className="p-4 bg-slate-800 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Min: {filters.priceRange[0].toLocaleString('fr-FR')} €
              </label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={filters.priceRange[0]}
                onChange={(e) => 
                  handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])
                }
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Max: {filters.priceRange[1].toLocaleString('fr-FR')} €
              </label>
              <input
                type="range"
                min="0"
                max="1000000"
                step="50000"
                value={filters.priceRange[1]}
                onChange={(e) => 
                  handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])
                }
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-4 text-xs text-slate-400 space-y-2">
        <p>Les données sont actualisées en temps réel à partir des sources officielles.</p>
        <p>Cliquez sur les arrondissements pour voir les détails.</p>
      </div>
    </div>
  )
}
