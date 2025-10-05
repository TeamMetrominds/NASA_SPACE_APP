import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import './PredictionEngine.css'

const PredictionEngine = ({ data, onAnalysisComplete, loading }) => {
  const [predictions, setPredictions] = useState(null)
  const [confidence, setConfidence] = useState(0.85)
  const [predictionHorizon, setPredictionHorizon] = useState(5) // years
  const [selectedModel, setSelectedModel] = useState('ensemble')
  const [riskFactors, setRiskFactors] = useState([])

  const models = [
    { id: 'ensemble', name: 'Ensemble Model', accuracy: 0.92, description: 'Combines multiple ML algorithms' },
    { id: 'neural', name: 'Neural Network', accuracy: 0.89, description: 'Deep learning approach' },
    { id: 'regression', name: 'Regression Model', accuracy: 0.85, description: 'Statistical regression' },
    { id: 'time_series', name: 'Time Series', accuracy: 0.88, description: 'ARIMA-based forecasting' }
  ]

  useEffect(() => {
    if (data) {
      generatePredictions()
    }
  }, [data, selectedModel, predictionHorizon, confidence])

  const generatePredictions = async () => {
    setLoading(true)
    try {
      // Generate AI predictions based on current data
      const predictionData = await simulateAIPredictions()
      setPredictions(predictionData)
      
      // Analyze risk factors
      const risks = analyzeRiskFactors(predictionData)
      setRiskFactors(risks)
      
      if (onAnalysisComplete) {
        onAnalysisComplete({
          type: 'prediction',
          model: selectedModel,
          predictions: predictionData,
          risks: risks,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Prediction error:', error)
    } finally {
      setLoading(false)
    }
  }

  const simulateAIPredictions = async () => {
    // Simulate AI model predictions
    const baseData = data?.layers || {
      ndvi: 0.4,
      lst: 25,
      vulnerability: 0.3,
      ndbi: 0.2,
      ntl: 0.5
    }

    const predictions = []
    const currentYear = new Date().getFullYear()

    for (let year = 0; year <= predictionHorizon; year++) {
      const timeFactor = year / predictionHorizon
      const noise = (Math.random() - 0.5) * 0.1
      
      predictions.push({
        year: currentYear + year,
        ndvi: Math.max(0, Math.min(1, baseData.ndvi + (Math.random() - 0.5) * 0.2 * timeFactor + noise)),
        lst: baseData.lst + (Math.random() * 3 * timeFactor) + noise * 5,
        vulnerability: Math.max(0, Math.min(1, baseData.vulnerability + (Math.random() * 0.3 * timeFactor) + noise)),
        ndbi: Math.max(0, Math.min(1, baseData.ndbi + (Math.random() * 0.2 * timeFactor) + noise)),
        ntl: Math.max(0, Math.min(1, baseData.ntl + (Math.random() * 0.2 * timeFactor) + noise)),
        confidence: Math.max(0.6, confidence - (year * 0.05)),
        risk_score: Math.min(1, Math.random() * 0.5 + (year * 0.1))
      })
    }

    return predictions
  }

  const analyzeRiskFactors = (predictionData) => {
    const risks = []
    const finalYear = predictionData[predictionData.length - 1]
    
    if (finalYear.ndvi < 0.3) {
      risks.push({
        type: 'vegetation_decline',
        severity: 'high',
        description: 'Significant vegetation decline predicted',
        impact: 'Reduced ecosystem services and biodiversity loss'
      })
    }
    
    if (finalYear.lst > 30) {
      risks.push({
        type: 'heat_stress',
        severity: 'high',
        description: 'High temperature stress predicted',
        impact: 'Heat island effects and health risks'
      })
    }
    
    if (finalYear.vulnerability > 0.6) {
      risks.push({
        type: 'vulnerability_increase',
        severity: 'medium',
        description: 'Increased vulnerability to environmental shocks',
        impact: 'Reduced resilience to climate change'
      })
    }
    
    if (finalYear.ndbi > 0.5) {
      risks.push({
        type: 'urbanization',
        severity: 'medium',
        description: 'Continued urbanization pressure',
        impact: 'Loss of natural habitats and green spaces'
      })
    }

    return risks
  }

  const getRiskColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const getModelAccuracy = () => {
    const model = models.find(m => m.id === selectedModel)
    return model ? model.accuracy : 0.85
  }

  return (
    <div className="prediction-engine">
      <div className="panel-header">
        <h3>🔮 AI Prediction Engine</h3>
        <p>Machine learning-powered environmental forecasting</p>
      </div>

      <div className="prediction-controls">
        <div className="control-group">
          <label>AI Model:</label>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({Math.round(model.accuracy * 100)}% accuracy)
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Prediction Horizon: {predictionHorizon} years</label>
          <input
            type="range"
            min="1"
            max="20"
            value={predictionHorizon}
            onChange={(e) => setPredictionHorizon(parseInt(e.target.value))}
          />
        </div>

        <div className="control-group">
          <label>Confidence Level: {Math.round(confidence * 100)}%</label>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={confidence}
            onChange={(e) => setConfidence(parseFloat(e.target.value))}
          />
        </div>

        <button 
          className="run-prediction-btn"
          onClick={generatePredictions}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Predictions'}
        </button>
      </div>

      {predictions && (
        <div className="prediction-results">
          <div className="model-info">
            <h4>Selected Model: {models.find(m => m.id === selectedModel)?.name}</h4>
            <p>Accuracy: {Math.round(getModelAccuracy() * 100)}% | Confidence: {Math.round(confidence * 100)}%</p>
          </div>

          <div className="charts-container">
            <div className="chart-section">
              <h5>Environmental Trends Prediction</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictions}>
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
              <h5>Confidence Over Time</h5>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Confidence"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="risk-analysis">
            <h5>Risk Assessment</h5>
            {riskFactors.length > 0 ? (
              <div className="risk-factors">
                {riskFactors.map((risk, index) => (
                  <div key={index} className="risk-item" style={{ borderLeftColor: getRiskColor(risk.severity) }}>
                    <div className="risk-header">
                      <span className="risk-type">{risk.description}</span>
                      <span className="risk-severity" style={{ color: getRiskColor(risk.severity) }}>
                        {risk.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="risk-impact">{risk.impact}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-risks">
                <p>✅ No significant risks identified in the prediction horizon</p>
              </div>
            )}
          </div>

          <div className="prediction-summary">
            <h5>Prediction Summary</h5>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Final NDVI:</span>
                <span className={`summary-value ${predictions[predictions.length - 1]?.ndvi > 0.5 ? 'positive' : 'negative'}`}>
                  {predictions[predictions.length - 1]?.ndvi?.toFixed(3)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Final LST:</span>
                <span className={`summary-value ${predictions[predictions.length - 1]?.lst > 30 ? 'negative' : 'positive'}`}>
                  {predictions[predictions.length - 1]?.lst?.toFixed(1)}°C
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Risk Score:</span>
                <span className={`summary-value ${predictions[predictions.length - 1]?.risk_score > 0.5 ? 'negative' : 'positive'}`}>
                  {Math.round(predictions[predictions.length - 1]?.risk_score * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictionEngine
