import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import parisData from '@/data/paris-arrondissements.json'

export default function Map(): JSX.Element {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const [selectedArrondissement, setSelectedArrondissement] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    if (mapInstance.current) {
      mapInstance.current.remove()
    }

    mapInstance.current = L.map(mapContainer.current, {
      center: [48.8566, 2.3522],
      zoom: 12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
      minZoom: 10,
    }).addTo(mapInstance.current)

    L.geoJSON(parisData as any, {
      style: {
        color: '#0EA5E9',
        weight: 2,
        opacity: 1,
        fillColor: '#1e293b',
        fillOpacity: 0.4,
      },
      onEachFeature: (feature, layer) => {
        const props = feature.properties as any

        const popupContent = `
          <div style="font-size: 13px; font-family: system-ui;">
            <strong>${props.arrondissement}</strong><br/>
            Population: ${props.population?.toLocaleString('fr-FR') || 'N/A'}<br/>
            Superficie: ${props.area || 'N/A'} km²
          </div>
        `
        
        layer.bindPopup(popupContent)

        layer.on('click', () => {
          setSelectedArrondissement(props.arrondissement)
        })

        layer.on('mouseover', () => {
          if (layer instanceof L.Path) {
            layer.setStyle({
              fillColor: '#0EA5E9',
              fillOpacity: 0.7,
              weight: 3,
            })
            layer.bringToFront()
          }
        })

        layer.on('mouseout', () => {
          if (layer instanceof L.Path) {
            layer.setStyle({
              fillColor: '#1e293b',
              fillOpacity: 0.4,
              weight: 2,
            })
          }
        })
      },
    }).addTo(mapInstance.current)

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          background: 'rgba(0, 0, 0, 0.7)',
          color: '#e2e8f0',
          padding: '12px 16px',
          borderRadius: '6px',
          fontSize: '14px',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <p>Paris</p>
        <p>Zoom: 12</p>
        {selectedArrondissement && (
          <p style={{ marginTop: '8px', color: '#0EA5E9', fontWeight: 'bold' }}>
            Sélectionné: {selectedArrondissement}
          </p>
        )}
      </div>
    </div>
  )
}
