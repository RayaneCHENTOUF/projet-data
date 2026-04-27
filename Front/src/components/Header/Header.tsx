import { MapPin } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-secondary border-b border-slate-700 px-6 py-4 shadow-lg">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <MapPin className="w-8 h-8 text-accent" />
        <div>
          <h1 className="text-2xl font-bold text-white">Paris Urban Explorer</h1>
          <p className="text-sm text-slate-400">Cartographie interactive des données urbaines</p>
        </div>
      </div>
    </header>
  )
}
