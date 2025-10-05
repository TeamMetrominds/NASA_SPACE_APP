import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import './SimulationPanel.css'

const SimulationPanel = ({ data, onAnalysisComplete, loading }) => {
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [simulationResults, setSimulationResults] = useState(null)
  const [timeHorizon, setTimeHorizon] = useState(10) // years
  const [climateFactors, setClimateFactors] = useState({
    temperature: 0,
    precipitation: 0,
    urbanization: 0
  })

  useEffect(() => {
    // Load demo scenarios
    loadDemoScenarios()
  }, [])

  const loadDemoScenarios = () => {
    const demoScenarios = [
      {
        id: 'baseline',
        name: 'Baseline Scenario',
        description: 'Current trends continue without intervention',
        color: '#6b7280',
        factors: { temperature: 0, precipitation: 0, urbanization: 0 }
      },
      {
        id: 'optimistic',
        name: 'Optimistic Scenario',
        description: 'Best-case climate and development outcomes',
        color: '#10b981',
        factors: { temperature: -0.5, precipitation: 0.2, urbanization: 0.1 }
      },
      {
        id: 'pessimistic',
        name: 'Pessimistic Scenario',
        description: 'Worst-case climate and development outcomes',
        color: '#ef4444',
        factors: { temperature: 2.0, precipitation: -0.3, urbanization: 0.5 }
      },
      {
        id: 'intervention',
        name: 'Intervention Scenario',
        description: 'With strategic environmental interventions',
        color: '#3b82f6',
        factors: { temperature: -1.0, precipitation: 0.1, urbanization: 0.2 }
      }
    ]
    setScenarios(demoScenarios)
  }

  const runSimulation = async () => {
    if (!selectedScenario) return

    setLoading(true)
    try {
      // Simulate environmental changes over time
      const results = generateSimulationData(selectedScenario, timeHorizon)
      setSimulationResults(results)
      
      // Trigger analysis completion
      if (onAnalysisComplete) {
        onAnalysisComplete({
          type: 'simulation',
          scenario: selectedScenario,
          results: results,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Simulation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSimulationData = (scenario, years) => {
    const data = []
    const baseValues = {
      ndvi: 0.4,
      lst: 25,
      vulnerability: 0.3,
      ndbi: 0.2,
      ntl: 0.5
    }

    for (let year = 0; year <= years; year++) {
      const timeFactor = year / years
      const scenarioImpact = scenario.factors

      data.push({
        year: 2024 + year,
        ndvi: Math.max(0, Math.min(1, baseValues.ndvi + (scenarioImpact.temperature * -0.1 * timeFactor) + (scenarioImpact.precipitation * 0.2 * timeFactor))),
        lst: baseValues.lst + (scenarioImpact.temperature * 2 * timeFactor) + (scenarioImpact.urbanization * 3 * timeFactor),
        vulnerability: Math.max(0, Math.min(1, baseValues.vulnerability + (scenarioImpact.temperature * 0.1 * timeFactor) + (scenarioImpact.urbanization * 0.3 * timeFactor))),
        ndbi: Math.max(0, Math.min(1, baseValues.ndbi + (scenarioImpact.urbanization * 0.4 * timeFactor))),
        ntl: Math.max(0, Math.min(1, baseValues.ntl + (scenarioImpact.urbanization * 0.3 * timeFactor))),
        temperature: 20 + (scenarioImpact.temperature * timeFactor),
        precipitation: 1000 + (scenarioImpact.precipitation * 200 * timeFactor)
      })
    }

    return data
  }

  const getScenarioColor = (scenarioId) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    return scenario ? scenario.color : '#6b7280'
  }

  return (
    <div className="simulation-panel">
      <div className="panel-header">
        <h3>🌍 Environmental Simulation</h3>
        <p>Model environmental changes under different scenarios</p>
      </div>

      <div className="simulation-controls">
        <div className="control-group">
          <label>Scenario:</label>
          <select 
            value={selectedScenario?.id || ''} 
            onChange={(e) => setSelectedScenario(scenarios.find(s => s.id === e.target.value))}
          >
            <option value="">Select Scenario</option>
            {scenarios.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Time Horizon: {timeHorizon} years</label>
          <input
            type="range"
            min="5"
            max="50"
            value={timeHorizon}
            onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
          />
        </div>

        <button 
          className="run-simulation-btn"
          onClick={runSimulation}
          disabled={!selectedScenario || loading}
        >
          {loading ? 'Running...' : 'Run Simulation'}
        </button>
      </div>

      {selectedScenario && (
        <div className="scenario-info">
          <h4>{selectedScenario.name}</h4>
          <p>{selectedScenario.description}</p>
          <div className="scenario-factors">
            <div className="factor">
              <span>Temperature Change:</span>
              <span className={selectedScenario.factors.temperature > 0 ? 'positive' : 'negative'}>
                {selectedScenario.factors.temperature > 0 ? '+' : ''}{selectedScenario.factors.temperature}°C
              </span>
            </div>
            <div className="factor">
              <span>Precipitation Change:</span>
              <span className={selectedScenario.factors.precipitation > 0 ? 'positive' : 'negative'}>
                {selectedScenario.factors.precipitation > 0 ? '+' : ''}{selectedScenario.factors.precipitation * 100}%
              </span>
            </div>
            <div className="factor">
              <span>Urbanization:</span>
              <span className={selectedScenario.factors.urbanization > 0 ? 'positive' : 'negative'}>
                {selectedScenario.factors.urbanization > 0 ? '+' : ''}{selectedScenario.factors.urbanization * 100}%
              </span>
            </div>
          </div>
        </div>
      )}

      {simulationResults && (
        <div className="simulation-results">
          <h4>Simulation Results</h4>
          
          <div className="charts-container">
            <div className="chart-section">
              <h5>Environmental Indicators Over Time</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={simulationResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="ndvi" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="NDVI"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lst" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="LST (°C)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="vulnerability" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    name="Vulnerability"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h5>Final Year Comparison</h5>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { name: 'NDVI', value: simulationResults[simulationResults.length - 1]?.ndvi },
                  { name: 'LST', value: simulationResults[simulationResults.length - 1]?.lst },
                  { name: 'Vulnerability', value: simulationResults[simulationResults.length - 1]?.vulnerability },
                  { name: 'NDBI', value: simulationResults[simulationResults.length - 1]?.ndbi }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="key-insights">
            <h5>Key Insights</h5>
            <div className="insights-grid">
              <div className="insight-card">
                <span className="insight-label">Vegetation Health:</span>
                <span className={`insight-value ${simulationResults[simulationResults.length - 1]?.ndvi > 0.5 ? 'positive' : 'negative'}`}>
                  {simulationResults[simulationResults.length - 1]?.ndvi > 0.5 ? 'Good' : 'Poor'}
                </span>
              </div>
              <div className="insight-card">
                <span className="insight-label">Temperature Risk:</span>
                <span className={`insight-value ${simulationResults[simulationResults.length - 1]?.lst > 30 ? 'negative' : 'positive'}`}>
                  {simulationResults[simulationResults.length - 1]?.lst > 30 ? 'High' : 'Low'}
                </span>
              </div>
              <div className="insight-card">
                <span className="insight-label">Vulnerability:</span>
                <span className={`insight-value ${simulationResults[simulationResults.length - 1]?.vulnerability > 0.5 ? 'negative' : 'positive'}`}>
                  {simulationResults[simulationResults.length - 1]?.vulnerability > 0.5 ? 'High' : 'Low'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulationPanel
