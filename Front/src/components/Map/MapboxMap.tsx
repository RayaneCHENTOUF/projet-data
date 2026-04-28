import { useCallback, useMemo, useState, useEffect, useRef } from 'react'
import Map, { Source, Layer, MapLayerMouseEvent, Marker, MapRef } from 'react-map-gl'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import parisData from '../../data/paris-quartiers.json'
import { Address } from '../../services/apiService'

interface MapboxMapProps {
  selectedArrondissement: string | null
  setSelectedArrondissement: (id: string | null) => void
  selectedAddress: Address | null
}

export default function MapboxMap({ selectedArrondissement, setSelectedArrondissement, selectedAddress }: MapboxMapProps) {
  const mapRef = useRef<MapRef>(null)
  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; name: string } | null>(null)

  const onHover = useCallback((event: MapLayerMouseEvent) => {
    const {
      features,
      point: { x, y }
    } = event
    const hoveredFeature = features && features[0]
    setHoverInfo(
      hoveredFeature && hoveredFeature.properties?.l_qu
        ? { x, y, name: hoveredFeature.properties.l_qu }
        : null
    )
  }, [])

  const onClick = useCallback((event: MapLayerMouseEvent) => {
    const feature = event.features && event.features[0]
    if (feature && feature.properties?.l_qu) {
      setSelectedArrondissement(feature.properties.l_qu)
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

  const data = useMemo(() => {
    return parisData as any
  }, [])

  // Paris bounds to restrict map view
  const parisBounds = [
    [2.225, 48.815], // Southwest corner
    [2.4698, 48.9015] // Northeast corner
  ] as any

  return (
    <div className="w-full h-full bg-slate-950">
      <Map
        ref={mapRef}
        mapLib={maplibregl as any}
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
              'fill-color': [
                'match',
                ['get', 'c_ar'],
                1, '#fecaca',
                2, '#fed7aa',
                3, '#fef08a',
                4, '#d9f99d',
                5, '#bbf7d0',
                6, '#99f6e4',
                7, '#a5f3fc',
                8, '#bae6fd',
                9, '#bfdbfe',
                10, '#c7d2fe',
                11, '#ddd6fe',
                12, '#e9d5ff',
                13, '#f5d0fe',
                14, '#fbcfe8',
                15, '#fecdd3',
                16, '#ffedd5',
                17, '#ccfbf1',
                18, '#e0e7ff',
                19, '#fae8ff',
                20, '#dcfce7',
                '#e2e8f0'
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.7,
                0.4
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
              'line-color': '#334155',
              'line-width': 1.5,
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
              {/* Tooltip */}
              <div className="mb-2 bg-slate-900/95 backdrop-blur-sm border border-blue-500/40 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap max-w-[180px] truncate">
                {selectedAddress.numero} {selectedAddress.rue}
              </div>
              {/* Pin SVG */}
              <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="#3b82f6"/>
                <circle cx="14" cy="14" r="6" fill="white"/>
              </svg>
              {/* Ripple ring */}
              <div className="absolute bottom-0 w-8 h-8 rounded-full bg-blue-400/30 animate-ping" style={{ bottom: '2px' }} />
            </div>
          </Marker>
        )}

        {hoverInfo && (
          <div
            className="absolute z-10 bg-slate-900/90 backdrop-blur-sm border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-100 rounded-lg shadow-lg shadow-black/50 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px] transition-all duration-75"
            style={{ left: hoverInfo.x, top: hoverInfo.y }}
          >
            {hoverInfo.name}
          </div>
        )}
      </Map>
    </div>
  )
}
