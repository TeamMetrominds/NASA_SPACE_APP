import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import { apiService } from '../services/api'
import AnalysisResults from './AnalysisResults'
import AnalysisCharts from './AnalysisCharts'

// Import leaflet-draw after L is defined
import 'leaflet-draw'

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const AnalysisTab = ({ layers }) => {
  const [mapCenter, setMapCenter] = useState([36.7783, -119.4179]) // California, USA
  const [mapZoom, setMapZoom] = useState(6)
  const [bounds, setBounds] = useState(null)
  const [analysisResults, setAnalysisResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [drawingMode, setDrawingMode] = useState(null)
  const [drawnPolygons, setDrawnPolygons] = useState([])
  const [drawingToolsReady, setDrawingToolsReady] = useState(false)
  const mapRef = useRef(null)
  const drawControlRef = useRef(null)
  const drawnItemsRef = useRef(null)

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
    loadMapBounds()
  }, [])

  useEffect(() => {
    // Initialize drawing tools after map is ready
    if (mapRef.current) {
      const timer = setTimeout(() => {
        console.log('Attempting to initialize drawing tools...')
        initializeDrawingTools()
      }, 2000) // Wait 2 seconds for map to be fully ready
      
      return () => clearTimeout(timer)
    }
  }, [mapRef.current])

  const loadMapBounds = async () => {
    try {
      const response = await apiService.getBounds()
      if (response.success && response.bounds) {
        // Calculate overall bounds from all layers
        let minLat = Infinity, maxLat = -Infinity
        let minLng = Infinity, maxLng = -Infinity
        
        Object.values(response.bounds).forEach(bound => {
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

  const initializeDrawingTools = () => {
    try {
      console.log('Initializing drawing tools...')
      
      if (!mapRef.current) {
        console.error('Map reference not available')
        return false
      }
      
      if (!L.Control.Draw) {
        console.error('L.Control.Draw not available')
        return false
      }
      
      const map = mapRef.current
      
      // Remove existing draw control if it exists
      if (drawControlRef.current) {
        console.log('Removing existing draw control')
        map.removeControl(drawControlRef.current)
        drawControlRef.current = null
      }
      
      // Remove existing event listeners
      map.off(L.Draw.Event.CREATED)
      map.off(L.Draw.Event.EDITED)
      map.off(L.Draw.Event.DELETED)
      
      // Create feature group for drawn items
      const drawnItems = new L.FeatureGroup()
      map.addLayer(drawnItems)
      drawnItemsRef.current = drawnItems
      
      // Create draw control with error handling
      const drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            drawError: {
              color: '#e1e100',
              message: '<strong>Error:</strong> shape edges cannot cross!'
            },
            shapeOptions: {
              color: '#bada55',
              fillColor: '#bada55',
              fillOpacity: 0.2
            }
          },
          rectangle: {
            shapeOptions: {
              color: '#bada55',
              fillColor: '#bada55',
              fillOpacity: 0.2
            }
          },
          circle: {
            shapeOptions: {
              color: '#bada55',
              fillColor: '#bada55',
              fillOpacity: 0.2
            }
          },
          marker: false,
          polyline: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItems,
          remove: true
        }
      })

      map.addControl(drawControl)
      drawControlRef.current = drawControl

      // Handle draw events with explicit binding
      map.on(L.Draw.Event.CREATED, (e) => {
        console.log('🎯 Draw created event triggered:', e)
        try {
          handleDrawCreated(e)
        } catch (error) {
          console.error('Error in handleDrawCreated:', error)
        }
      })
      
      map.on(L.Draw.Event.EDITED, (e) => {
        console.log('🎯 Draw edited event triggered:', e)
        try {
          handleDrawEdited(e)
        } catch (error) {
          console.error('Error in handleDrawEdited:', error)
        }
      })
      
      map.on(L.Draw.Event.DELETED, (e) => {
        console.log('🎯 Draw deleted event triggered:', e)
        try {
          handleDrawDeleted(e)
        } catch (error) {
          console.error('Error in handleDrawDeleted:', error)
        }
      })
      
      console.log('✅ Drawing tools initialized successfully')
      setDrawingToolsReady(true)
      return true
    } catch (error) {
      console.error('❌ Error in initializeDrawingTools:', error)
      return false
    }
  }

  const handleDrawCreated = (e) => {
    console.log('Draw created event:', e)
    const { layerType, layer } = e
    
    // Add to drawn items
    if (drawnItemsRef.current) {
      drawnItemsRef.current.addLayer(layer)
    }
    
    const polygonData = layer.toGeoJSON()
    console.log('Polygon data:', polygonData)
    
    setDrawnPolygons(prev => [...prev, {
      id: Date.now(),
      type: layerType,
      layer: layer,
      data: polygonData
    }])
    
    // Automatically analyze the drawn polygon
    console.log('Starting analysis...')
    analyzePolygon(polygonData)
  }

  const handleDrawEdited = (e) => {
    console.log('Polygon edited:', e)
    // Handle polygon editing if needed
    const { layers } = e
    layers.eachLayer(layer => {
      const polygonData = layer.toGeoJSON()
      analyzePolygon(polygonData)
    })
  }

  const handleDrawDeleted = (e) => {
    console.log('Polygon deleted:', e)
    setAnalysisResults(null)
    setDrawnPolygons([])
  }

  const analyzePolygon = async (polygonData) => {
    try {
      console.log('Analyzing polygon:', polygonData)
      setLoading(true)
      setError(null)
      
      const response = await apiService.analyzePolygon(polygonData)
      console.log('Analysis response:', response)
      
      if (response.success) {
        console.log('Analysis successful, setting results:', response.results)
        setAnalysisResults(response.results)
      } else {
        console.error('Analysis failed:', response.error)
        setError(response.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Error analyzing polygon:', error)
      setError('Failed to analyze polygon. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const testAnalysis = () => {
    // Create a test polygon for analysis
    const testPolygon = {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-119.4, 36.1],
          [-119.3, 36.1],
          [-119.3, 36.2],
          [-119.4, 36.2],
          [-119.4, 36.1]
        ]]
      },
      "properties": {
        "name": "Test Area"
      }
    }
    
    console.log('Testing analysis with polygon:', testPolygon)
    analyzePolygon(testPolygon)
  }

  const createTestPolygon = () => {
    // Create a test polygon on the map
    if (mapRef.current) {
      const map = mapRef.current
      
      // Create a test polygon
      const testPolygon = L.polygon([
        [-119.4, 36.1],
        [-119.3, 36.1],
        [-119.3, 36.2],
        [-119.4, 36.2],
        [-119.4, 36.1]
      ], {
        color: '#bada55',
        fillColor: '#bada55',
        fillOpacity: 0.2
      })
      
      // Add to map
      map.addLayer(testPolygon)
      
      // Convert to GeoJSON and analyze
      const polygonData = testPolygon.toGeoJSON()
      console.log('Created test polygon:', polygonData)
      analyzePolygon(polygonData)
    }
  }

  const clearAnalysis = () => {
    setAnalysisResults(null)
    setDrawnPolygons([])
    if (mapRef.current) {
      mapRef.current.eachLayer(layer => {
        if (layer instanceof L.FeatureGroup) {
          mapRef.current.removeLayer(layer)
        }
      })
    }
    if (drawnItemsRef.current) {
      drawnItemsRef.current.clearLayers()
    }
  }

  const saveAnalysis = async () => {
    if (!analysisResults) return

    try {
      setLoading(true)
      const response = await apiService.saveAnalysis(analysisResults)
      
      if (response.success) {
        alert('Analysis saved successfully!')
      } else {
        alert('Failed to save analysis: ' + response.error)
      }
    } catch (error) {
      console.error('Error saving analysis:', error)
      alert('Failed to save analysis. Please try again.')
    } finally {
      setLoading(false)
    }
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
          {Object.entries(layers).map(([layerId, layerConfig]) => (
            <LayersControl.Overlay
              key={layerId}
              name={layerConfig.name}
            >
              <TileLayer
                url={`/tiles/${layerConfig.tile_path}/{z}/{x}/{y}.png`}
                opacity={0.7}
                attribution={`${layerConfig.name} Layer`}
              />
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>

      <div className="analysis-panel">
        <h3>Analysis Tools</h3>
        
        <div className="drawing-tools">
          <button 
            className={drawingMode === 'polygon' ? 'active' : ''}
            onClick={() => setDrawingMode('polygon')}
          >
            Draw Polygon
          </button>
          <button 
            className={drawingMode === 'rectangle' ? 'active' : ''}
            onClick={() => setDrawingMode('rectangle')}
          >
            Draw Rectangle
          </button>
          <button 
            className={drawingMode === 'circle' ? 'active' : ''}
            onClick={() => setDrawingMode('circle')}
          >
            Draw Circle
          </button>
        </div>

        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button 
            onClick={testAnalysis}
            style={{ backgroundColor: '#007bff', color: 'white', padding: '8px', borderRadius: '4px', border: 'none' }}
          >
            Test Analysis
          </button>
          <button 
            onClick={() => {
              console.log('Manually initializing drawing tools...')
              initializeDrawingTools()
            }}
            style={{ backgroundColor: '#28a745', color: 'white', padding: '8px', borderRadius: '4px', border: 'none' }}
          >
            Initialize Drawing Tools
          </button>
          <button 
            onClick={createTestPolygon}
            style={{ backgroundColor: '#17a2b8', color: 'white', padding: '8px', borderRadius: '4px', border: 'none' }}
          >
            Create Test Polygon
          </button>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
            <p>Analyzing...</p>
          </div>
        )}

        {error && (
          <div style={{ color: '#e74c3c', padding: '0.5rem', background: '#ffeaea', borderRadius: '4px', margin: '0.5rem 0' }}>
            {error}
          </div>
        )}

        {analysisResults && (
          <div>
            <AnalysisResults results={analysisResults} />
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-success" 
                onClick={saveAnalysis}
                disabled={loading}
              >
                Save Analysis
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={clearAnalysis}
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {!drawingToolsReady && (
          <div style={{ 
            padding: '1rem', 
            background: '#fff3cd', 
            borderRadius: '4px', 
            marginTop: '1rem',
            border: '1px solid #ffeaa7'
          }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
              Drawing tools are initializing... If they don't appear, click "Initialize Drawing Tools"
            </p>
          </div>
        )}
      </div>

      {analysisResults && (
        <div style={{ 
          position: 'absolute', 
          bottom: '10px', 
          left: '10px', 
          right: '10px', 
          background: 'white', 
          padding: '1rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxHeight: '40vh',
          overflowY: 'auto'
        }}>
          <AnalysisCharts results={analysisResults} layers={layers} />
        </div>
      )}
    </div>
  )
}

export default AnalysisTab