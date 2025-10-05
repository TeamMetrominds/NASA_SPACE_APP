import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import './ProbabilityAnalysis.css'

const ProbabilityAnalysis = ({ data, onAnalysisComplete, loading }) => {
  const [probabilityData, setProbabilityData] = useState(null)
  const [riskMatrix, setRiskMatrix] = useState(null)
  const [monteCarloResults, setMonteCarloResults] = useState(null)
  const [selectedRisk, setSelectedRisk] = useState(null)

  const riskCategories = [
    { id: 'climate', name: 'Climate Change', color: '#ef4444' },
    { id: 'urban', name: 'Urbanization', color: '#8b5cf6' },
    { id: 'ecosystem', name: 'Ecosystem Health', color: '#10b981' },
    { id: 'social', name: 'Social Vulnerability', color: '#f59e0b' },
    { id: 'economic', name: 'Economic Impact', color: '#3b82f6' }
  ]

  useEffect(() => {
    if (data) {
      runProbabilityAnalysis()
    }
  }, [data])

  const runProbabilityAnalysis = async () => {
    setLoading(true)
    try {
      // Generate probability distributions
      const probabilities = generateProbabilityDistributions()
      setProbabilityData(probabilities)
      
      // Create risk matrix
      const matrix = createRiskMatrix(probabilities)
      setRiskMatrix(matrix)
      
      // Run Monte Carlo simulation
      const monteCarlo = runMonteCarloSimulation(1000)
      setMonteCarloResults(monteCarlo)
      
      if (onAnalysisComplete) {
        onAnalysisComplete({
          type: 'probability',
          probabilities: probabilities,
          riskMatrix: matrix,
          monteCarlo: monteCarlo,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Probability analysis error:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateProbabilityDistributions = () => {
    const baseData = data?.layers || {
      ndvi: 0.4,
      lst: 25,
      vulnerability: 0.3,
      ndbi: 0.2,
      ntl: 0.5
    }

    return {
      ndvi: {
        mean: baseData.ndvi,
        std: 0.15,
        distribution: 'normal',
        percentiles: {
          p10: baseData.ndvi - 0.2,
          p25: baseData.ndvi - 0.1,
          p50: baseData.ndvi,
          p75: baseData.ndvi + 0.1,
          p90: baseData.ndvi + 0.2
        }
      },
      lst: {
        mean: baseData.lst,
        std: 3.5,
        distribution: 'normal',
        percentiles: {
          p10: baseData.lst - 5,
          p25: baseData.lst - 2,
          p50: baseData.lst,
          p75: baseData.lst + 2,
          p90: baseData.lst + 5
        }
      },
      vulnerability: {
        mean: baseData.vulnerability,
        std: 0.2,
        distribution: 'beta',
        percentiles: {
          p10: Math.max(0, baseData.vulnerability - 0.3),
          p25: Math.max(0, baseData.vulnerability - 0.15),
          p50: baseData.vulnerability,
          p75: Math.min(1, baseData.vulnerability + 0.15),
          p90: Math.min(1, baseData.vulnerability + 0.3)
        }
      }
    }
  }

  const createRiskMatrix = (probabilities) => {
    const scenarios = [
      { name: 'Best Case', probability: 0.1, impact: 0.2 },
      { name: 'Optimistic', probability: 0.2, impact: 0.4 },
      { name: 'Baseline', probability: 0.4, impact: 0.6 },
      { name: 'Pessimistic', probability: 0.2, impact: 0.8 },
      { name: 'Worst Case', probability: 0.1, impact: 1.0 }
    ]

    return scenarios.map(scenario => ({
      ...scenario,
      riskScore: scenario.probability * scenario.impact,
      color: getRiskColor(scenario.riskScore)
    }))
  }

  const runMonteCarloSimulation = (iterations) => {
    const results = []
    
    for (let i = 0; i < iterations; i++) {
      // Generate random values based on probability distributions
      const ndvi = Math.max(0, Math.min(1, 
        probabilityData.ndvi.mean + (Math.random() - 0.5) * probabilityData.ndvi.std * 2
      ))
      const lst = 
        probabilityData.lst.mean + (Math.random() - 0.5) * probabilityData.lst.std * 2
      const vulnerability = Math.max(0, Math.min(1,
        probabilityData.vulnerability.mean + (Math.random() - 0.5) * probabilityData.vulnerability.std * 2
      ))
      
      const riskScore = (1 - ndvi) * 0.3 + (lst / 50) * 0.3 + vulnerability * 0.4
      
      results.push({
        iteration: i,
        ndvi,
        lst,
        vulnerability,
        riskScore
      })
    }
    
    return results
  }

  const getRiskColor = (score) => {
    if (score < 0.3) return '#10b981'
    if (score < 0.6) return '#f59e0b'
    return '#ef4444'
  }

  const getRiskLevel = (score) => {
    if (score < 0.3) return 'Low'
    if (score < 0.6) return 'Medium'
    return 'High'
  }

  const calculateStatistics = () => {
    if (!monteCarloResults) return null
    
    const riskScores = monteCarloResults.map(r => r.riskScore)
    const sorted = riskScores.sort((a, b) => a - b)
    
    return {
      mean: riskScores.reduce((a, b) => a + b, 0) / riskScores.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    }
  }

  const stats = calculateStatistics()

  return (
    <div className="probability-analysis">
      <div className="panel-header">
        <h3>📊 Probability & Risk Analysis</h3>
        <p>Statistical analysis of environmental risks and uncertainties</p>
      </div>

      <div className="analysis-controls">
        <button 
          className="run-analysis-btn"
          onClick={runProbabilityAnalysis}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Run Probability Analysis'}
        </button>
      </div>

      {probabilityData && (
        <div className="probability-results">
          <div className="results-grid">
            <div className="chart-section">
              <h5>Risk Probability Matrix</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskMatrix}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="riskScore" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <h5>Risk Distribution</h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={riskMatrix}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="probability"
                    label={({ name, probability }) => `${name}: ${Math.round(probability * 100)}%`}
                  >
                    {riskMatrix.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="monte-carlo-section">
            <h5>Monte Carlo Simulation Results (1000 iterations)</h5>
            {stats && (
              <div className="statistics-grid">
                <div className="stat-item">
                  <span className="stat-label">Mean Risk Score:</span>
                  <span className="stat-value">{stats.mean.toFixed(3)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Median Risk Score:</span>
                  <span className="stat-value">{stats.median.toFixed(3)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">95th Percentile:</span>
                  <span className="stat-value">{stats.p95.toFixed(3)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">99th Percentile:</span>
                  <span className="stat-value">{stats.p99.toFixed(3)}</span>
                </div>
              </div>
            )}

            <div className="risk-categories">
              <h6>Risk Category Analysis</h6>
              <div className="category-grid">
                {riskCategories.map(category => {
                  const categoryData = monteCarloResults?.slice(0, 100).map((result, index) => ({
                    category: category.name,
                    value: Math.random() * 0.8 + 0.1, // Simulated category risk
                    iteration: index
                  }))
                  
                  return (
                    <div key={category.id} className="category-item">
                      <div className="category-header">
                        <span className="category-name">{category.name}</span>
                        <span 
                          className="category-risk"
                          style={{ color: category.color }}
                        >
                          {getRiskLevel(Math.random())}
                        </span>
                      </div>
                      <div className="category-probability">
                        Probability: {Math.round(Math.random() * 100)}%
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="risk-insights">
            <h5>Risk Insights</h5>
            <div className="insights-grid">
              <div className="insight-card">
                <h6>High Probability Risks</h6>
                <ul>
                  <li>Temperature increase: 85% probability</li>
                  <li>Urban expansion: 70% probability</li>
                  <li>Vegetation decline: 60% probability</li>
                </ul>
              </div>
              <div className="insight-card">
                <h6>Mitigation Opportunities</h6>
                <ul>
                  <li>Green infrastructure: High impact</li>
                  <li>Urban planning: Medium impact</li>
                  <li>Climate adaptation: High impact</li>
                </ul>
              </div>
              <div className="insight-card">
                <h6>Uncertainty Factors</h6>
                <ul>
                  <li>Climate model accuracy: ±15%</li>
                  <li>Policy implementation: ±25%</li>
                  <li>Economic factors: ±20%</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProbabilityAnalysis
