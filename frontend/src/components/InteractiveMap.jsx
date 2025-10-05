import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import LayerControl from './LayerControl'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const InteractiveMap = ({ layers }) => {
  const [layerStates, setLayerStates] = useState({})
  const [mapCenter, setMapCenter] = useState([36.7783, -119.4179]) // California, USA
  const [mapZoom, setMapZoom] = useState(6)
  const [bounds, setBounds] = useState(null)
  const [selectedBaseMap, setSelectedBaseMap] = useState('satellite')
  const mapRef = useRef(null)

  // Base map configurations
  const baseMaps = {
    osm: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    dark: {
      name: 'Dark Map',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    terrain: {
      name: 'Terrain',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
    },
    satellite: {
      name: 'Satellite',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    topographic: {
      name: 'Topographic',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
    },
    watercolor: {
      name: 'Watercolor',
      url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
      attribution: '&copy; <a href="https://stamen.com">Stamen Design</a>'
    }
  }


  useEffect(() => {
    initializeLayers()
    loadMapBounds()
  }, [layers])

  const initializeLayers = () => {
    const initialStates = {}
    Object.keys(layers).forEach(layerId => {
      initialStates[layerId] = {
        visible: false,
        opacity: 0.7
      }
    })
    setLayerStates(initialStates)
  }

  const loadMapBounds = async () => {
    try {
      const response = await fetch('/api/bounds')
      const data = await response.json()
      if (data.success && data.bounds) {
        // Calculate overall bounds from all layers
        let minLat = Infinity, maxLat = -Infinity
        let minLng = Infinity, maxLng = -Infinity
        
        Object.values(data.bounds).forEach(bound => {
          if (bound) {
            minLat = Math.min(minLat, bound.south)
            maxLat = Math.max(maxLat, bound.north)
            minLng = Math.min(minLng, bound.west)
            maxLng = Math.max(maxLng, bound.east)
          }
        })
        
        if (isFinite(minLat) && isFinite(maxLat) && isFinite(minLng) && isFinite(maxLng)) {
          const centerLat = (minLat + maxLat) / 2
          const centerLng = (minLng + maxLng) / 2
          setMapCenter([centerLat, centerLng])
          setMapZoom(10)
          setBounds([[minLat, minLng], [maxLat, maxLng]])
        }
      }
    } catch (error) {
      console.error('Error loading bounds:', error)
    }
  }

  const toggleLayer = (layerId) => {
    setLayerStates(prev => ({
      ...prev,
      [layerId]: {
        ...prev[layerId],
        visible: !prev[layerId].visible
      }
    }))
  }

  const updateLayerOpacity = (layerId, opacity) => {
    setLayerStates(prev => ({
      ...prev,
      [layerId]: {
        ...prev[layerId],
        opacity: opacity
      }
    }))
  }


  const getVisibleLayers = () => {
    return Object.entries(layerStates)
      .filter(([_, state]) => state.visible)
      .map(([layerId, state]) => ({
        id: layerId,
        config: layers[layerId],
        state: state
      }))
  }

  // Don't render if layers is empty or not loaded yet
  if (!layers || Object.keys(layers).length === 0) {
    return (
      <div className="map-container">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          background: '#f8f9fa'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="loading-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }}></div>
            <p>Loading layers...</p>
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              Waiting for backend connection...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        bounds={bounds}
        ref={mapRef}
      >
        <LayersControl position="topright">
          {/* Base Maps */}
          <LayersControl.BaseLayer name="OpenStreetMap">
            <TileLayer
              attribution={baseMaps.osm.attribution}
              url={baseMaps.osm.url}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Dark Map">
            <TileLayer
              attribution={baseMaps.dark.attribution}
              url={baseMaps.dark.url}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Terrain">
            <TileLayer
              attribution={baseMaps.terrain.attribution}
              url={baseMaps.terrain.url}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer checked name="Satellite">
            <TileLayer
              attribution={baseMaps.satellite.attribution}
              url={baseMaps.satellite.url}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Topographic">
            <TileLayer
              attribution={baseMaps.topographic.attribution}
              url={baseMaps.topographic.url}
            />
          </LayersControl.BaseLayer>
          
          <LayersControl.BaseLayer name="Watercolor">
            <TileLayer
              attribution={baseMaps.watercolor.attribution}
              url={baseMaps.watercolor.url}
            />
          </LayersControl.BaseLayer>
          
          {/* Data Layers */}
          {getVisibleLayers().map(({ id, config, state }) => (
            <LayersControl.Overlay
              key={id}
              name={config.name}
              checked={state.visible}
            >
              <TileLayer
                url={`/tiles/${config.tile_path}/{z}/{x}/{y}.png`}
                opacity={state.opacity}
                attribution={`${config.name} Layer`}
              />
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>

      <div className="layer-controls">
        <h3>Layer Controls</h3>
        {Object.entries(layers).map(([layerId, layerConfig]) => (
          <LayerControl
            key={layerId}
            layerId={layerId}
            layerConfig={layerConfig}
            layerState={layerStates[layerId] || { visible: false, opacity: 0.7 }}
            onToggle={toggleLayer}
            onOpacityChange={updateLayerOpacity}
          />
        ))}
      </div>
    </div>
  )
}

export default InteractiveMap
