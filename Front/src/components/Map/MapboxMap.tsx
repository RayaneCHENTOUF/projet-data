import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import Map, { Source, Layer, MapLayerMouseEvent, Marker, MapRef } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import parisData from '../../data/paris-quartiers.json'
import type { Address } from '../../services/apiService'

interface MapboxMapProps {
  selectedArrondissement: string | null
  setSelectedArrondissement: (id: string | null) => void
  selectedAddress: Address | null
  choroplethScores: Record<string, number>
  choroplethLabel: string
}

/**
 * Interpolate a score (0–100) to a color on a blue→green→yellow→red gradient.
 */
function scoreToColor(score: number): string {
  const s = Math.max(0, Math.min(100, score))
  if (s < 33) {
    // red to yellow
    const t = s / 33
    const r = 220
    const g = Math.round(60 + 140 * t)
    const b = Math.round(60 * (1 - t))
    return `rgb(${r},${g},${b})`
  } else if (s < 66) {
    // yellow to green
    const t = (s - 33) / 33
    const r = Math.round(220 - 150 * t)
    const g = Math.round(200 + 30 * t)
    const b = Math.round(40 + 60 * t)
    return `rgb(${r},${g},${b})`
  } else {
    // green to teal/blue
    const t = (s - 66) / 34
    const r = Math.round(70 - 30 * t)
    const g = Math.round(230 - 40 * t)
    const b = Math.round(100 + 80 * t)
    return `rgb(${r},${g},${b})`
  }
}

export default function MapboxMap({
  selectedArrondissement,
  setSelectedArrondissement,
  selectedAddress,
  choroplethScores,
  choroplethLabel,
}: MapboxMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; name: string; score: number | null } | null>(null)

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const {
      features,
      point: { x, y }
    } = event
    const hoveredFeature = features && features[0]
    if (hoveredFeature && hoveredFeature.properties?.l_qu) {
      const insee = hoveredFeature.properties.c_quinsee as string
      const score = choroplethScores[insee] ?? null
      setHoverInfo({ x, y, name: hoveredFeature.properties.l_qu as string, score })
    } else {
      setHoverInfo(null)
    }
  }, [choroplethScores])

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0]
    if (feature && feature.properties?.l_qu) {
      setSelectedArrondissement(feature.properties.l_qu as string)
    } else {
      setSelectedArrondissement(null)
    }
  }, [setSelectedArrondissement])

  // Fly to selected address
  useEffect(() => {
    if (selectedAddress && selectedAddress.lat && selectedAddress.lon && mapRef.current) {
      mapRef.current.flyTo({
        center: [selectedAddress.lon, selectedAddress.lat],
        zoom: 18,
        pitch: 60,
        bearing: 20,
        duration: 1800,
        essential: true
      })
    }
  }, [selectedAddress])

  // Build choropleth fill-color expression
  const hasChoropleth = Object.keys(choroplethScores).length > 0

  const fillColorExpression = useMemo(() => {
    if (!hasChoropleth) {
      // Fallback: color by arrondissement
      return [
        'match', ['get', 'c_ar'],
        1, '#fecaca', 2, '#fed7aa', 3, '#fef08a', 4, '#d9f99d',
        5, '#bbf7d0', 6, '#99f6e4', 7, '#a5f3fc', 8, '#bae6fd',
        9, '#bfdbfe', 10, '#c7d2fe', 11, '#ddd6fe', 12, '#e9d5ff',
        13, '#f5d0fe', 14, '#fbcfe8', 15, '#fecdd3', 16, '#ffedd5',
        17, '#ccfbf1', 18, '#e0e7ff', 19, '#fae8ff', 20, '#dcfce7',
        '#e2e8f0'
      ] as unknown as maplibregl.ExpressionSpecification
    }

    // Build a match expression: ['match', ['get', 'c_quinsee'], 'code1', 'color1', ..., defaultColor]
    const expr: (string | number | string[])[] = ['match', ['get', 'c_quinsee']]
    for (const [insee, score] of Object.entries(choroplethScores)) {
      expr.push(insee)
      expr.push(scoreToColor(score))
    }
    expr.push('#334155') // default: dark gray for missing data
    return expr as unknown as maplibregl.ExpressionSpecification
  }, [choroplethScores, hasChoropleth])

  const data = useMemo(() => parisData, [])

  // Paris bounds
  const parisBounds = [
    [2.225, 48.815],
    [2.4698, 48.9015]
  ] as [[number, number], [number, number]]

  return (
    <div className="w-full h-full bg-slate-950">
      <Map
        ref={mapRef}
        mapLib={maplibregl as unknown as typeof import('maplibre-gl')}
        initialViewState={{
          longitude: 2.3488,
          latitude: 48.8534,
          zoom: 12,
          pitch: 45,
          bearing: 0
        }}
        maxBounds={parisBounds}
        minZoom={11}
        maxZoom={20}
        mapStyle="https://tiles.openfreemap.org/styles/dark"
        interactiveLayerIds={['paris-fill']}
        onMouseMove={onHover}
        onClick={onClick}
        cursor={hoverInfo ? 'pointer' : 'grab'}
      >
        <Layer
          id="3d-buildings"
          source="openmaptiles"
          source-layer="building"
          type="fill-extrusion"
          minzoom={14.5}
          paint={{
            'fill-extrusion-color': '#1e293b',
            'fill-extrusion-height': ['get', 'render_height'],
            'fill-extrusion-base': ['get', 'render_min_height'],
            'fill-extrusion-opacity': 0.6
          }}
        />

        <Source id="paris" type="geojson" data={data}>
          <Layer
            id="paris-fill"
            type="fill"
            paint={{
              'fill-color': fillColorExpression,
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.8,
                hasChoropleth ? 0.65 : 0.4
              ]
            }}
          />
          <Layer
            id="paris-selected"
            type="fill"
            filter={['==', ['get', 'l_qu'], selectedArrondissement || '']}
            paint={{
              'fill-color': '#3b82f6',
              'fill-opacity': 0.5
            }}
          />
          <Layer
            id="paris-borders"
            type="line"
            paint={{
              'line-color': hasChoropleth ? '#0f172a' : '#334155',
              'line-width': hasChoropleth ? 1 : 1.5,
              'line-opacity': 0.8
            }}
          />
          <Layer
            id="paris-borders-selected"
            type="line"
            filter={['==', ['get', 'l_qu'], selectedArrondissement || '']}
            paint={{
              'line-color': '#60a5fa',
              'line-width': 2.5
            }}
          />
        </Source>

        {/* Address Marker */}
        {selectedAddress && selectedAddress.lat && selectedAddress.lon && (
          <Marker
            longitude={selectedAddress.lon}
            latitude={selectedAddress.lat}
            anchor="bottom"
          >
            <div className="relative flex flex-col items-center" style={{ filter: 'drop-shadow(0 4px 16px rgba(59,130,246,0.7))' }}>
              <div className="mb-2 bg-slate-900/95 backdrop-blur-sm border border-blue-500/40 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap max-w-[180px] truncate">
                {selectedAddress.numero} {selectedAddress.rue}
              </div>
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#3b82f6"/>
                <circle cx="14" cy="14" r="6" fill="white"/>
              </svg>
              <div className="absolute bottom-0 w-8 h-8 rounded-full bg-blue-400/30 animate-ping" style={{ bottom: '2px' }} />
            </div>
          </Marker>
        )}

        {/* Hover tooltip */}
        {hoverInfo && (
          <div
            className="absolute z-10 bg-slate-900/95 backdrop-blur-sm border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 rounded-xl shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
            style={{ left: hoverInfo.x, top: hoverInfo.y - 12 }}
          >
            <div className="text-white font-bold">{hoverInfo.name}</div>
            {hoverInfo.score !== null && (
              <div className="text-xs mt-0.5 flex items-center gap-2">
                <span className="text-slate-400">{choroplethLabel}:</span>
                <span
                  className="font-black"
                  style={{ color: scoreToColor(hoverInfo.score) }}
                >
                  {Math.round(hoverInfo.score)}/100
                </span>
              </div>
            )}
          </div>
        )}
      </Map>

      {/* Choropleth Legend */}
      {hasChoropleth && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-2xl pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{choroplethLabel}</span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-bold text-red-400">0</span>
            <div className="w-32 h-2.5 rounded-full" style={{
              background: 'linear-gradient(to right, rgb(220,60,60), rgb(220,200,0), rgb(70,230,100), rgb(40,190,180))'
            }} />
            <span className="text-[9px] font-bold text-teal-400">100</span>
          </div>
        </div>
      )}
    </div>
  )
}
