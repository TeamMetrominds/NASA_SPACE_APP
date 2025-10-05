import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, LayersControl, LayerGroup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw'
import AnalysisResults from './AnalysisResults'
import SimulationPanel from './SimulationPanel'
import PredictionEngine from './PredictionEngine'
import ProbabilityAnalysis from './ProbabilityAnalysis'
import StrategicInterventions from './StrategicInterventions'
import { apiService } from '../services/api'
import './AdvancedAnalytics.css'

// Fix for Leaflet markers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const AdvancedAnalytics = ({ layers }) => {
  const [activeTool, setActiveTool] = useState('simulation')
  const [analysisResults, setAnalysisResults] = useState(null)
  const [simulationData, setSimulationData] = useState(null)
  const [predictionResults, setPredictionResults] = useState(null)
  const [probabilityData, setProbabilityData] = useState(null)
  const [strategicRecommendations, setStrategicRecommendations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const tools = [
    { id: 'simulation', name: 'Environmental Simulation', icon: '🌍', color: '#3b82f6' },
    { id: 'prediction', name: 'AI Predictions', icon: '🔮', color: '#8b5cf6' },
    { id: 'probability', name: 'Risk Analysis', icon: '📊', color: '#ef4444' },
    { id: 'interventions', name: 'Strategic Interventions', icon: '🎯', color: '#10b981' }
  ]

  const handleToolChange = (toolId) => {
    setActiveTool(toolId)
    setError(null)
  }

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results)
    
    // Trigger advanced analysis based on results
    if (results && results.layers) {
      runAdvancedAnalysis(results)
    }
  }

  const runAdvancedAnalysis = async (baseResults) => {
    setLoading(true)
    try {
      // Run all advanced analyses in parallel
      const [simulation, prediction, probability, interventions] = await Promise.all([
        apiService.runSimulation(baseResults),
        apiService.generatePredictions(baseResults),
        apiService.calculateProbability(baseResults),
        apiService.getStrategicInterventions(baseResults)
      ])

      setSimulationData(simulation)
      setPredictionResults(prediction)
      setProbabilityData(probability)
      setStrategicRecommendations(interventions)
    } catch (error) {
      console.error('Advanced analysis error:', error)
      setError('Failed to run advanced analysis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="advanced-analytics">
      <div className="analytics-header">
        <h1>Advanced Analytics & AI Insights</h1>
        <p>Comprehensive environmental analysis with simulation, prediction, and strategic planning</p>
      </div>

      <div className="analytics-layout">
        {/* Tool Selection */}
        <div className="tool-selector">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`tool-button ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => handleToolChange(tool.id)}
              style={{ '--tool-color': tool.color }}
            >
              <span className="tool-icon">{tool.icon}</span>
              <span className="tool-name">{tool.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="analytics-content">
          {/* Map Section */}
          <div className="map-section">
            <MapContainer
              center={[36.7783, -119.4179]}
              zoom={6}
              style={{ height: '100%', width: '100%' }}
            >
              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="Satellite">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Terrain">
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri"
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Dark">
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution="CartoDB"
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              {/* Data Layers */}
              <LayersControl position="topleft">
                {Object.entries(layers).map(([layerId, config]) => (
                  <LayersControl.Overlay key={layerId} name={config.name}>
                    <TileLayer
                      url={`http://localhost:5000/tiles/${config.tile_path}/{z}/{x}/{y}.png`}
                      opacity={0.7}
                    />
                  </LayersControl.Overlay>
                ))}
              </LayersControl>
            </MapContainer>
          </div>

          {/* Analysis Panel */}
          <div className="analysis-panel">
            {activeTool === 'simulation' && (
              <SimulationPanel
                data={simulationData}
                onAnalysisComplete={handleAnalysisComplete}
                loading={loading}
              />
            )}
            
            {activeTool === 'prediction' && (
              <PredictionEngine
                data={predictionResults}
                onAnalysisComplete={handleAnalysisComplete}
                loading={loading}
              />
            )}
            
            {activeTool === 'probability' && (
              <ProbabilityAnalysis
                data={probabilityData}
                onAnalysisComplete={handleAnalysisComplete}
                loading={loading}
              />
            )}
            
            {activeTool === 'interventions' && (
              <StrategicInterventions
                data={strategicRecommendations}
                onAnalysisComplete={handleAnalysisComplete}
                loading={loading}
              />
            )}
          </div>
        </div>

        {/* Results Display */}
        {analysisResults && (
          <div className="results-section">
            <AnalysisResults results={analysisResults} />
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvancedAnalytics
