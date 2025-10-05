import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, Heatmap } from 'recharts'
import './RiskAssessment.css'

const RiskAssessment = ({ data, interventions, onUpdate }) => {
  const [selectedRisk, setSelectedRisk] = useState(null)
  const [viewMode, setViewMode] = useState('matrix') // matrix, trends, mitigation

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#dc2626'
      case 'medium': return '#d97706'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getRiskLevel = (probability, impact) => {
    const riskScore = probability * impact
    if (riskScore >= 0.7) return 'High'
    if (riskScore >= 0.4) return 'Medium'
    return 'Low'
  }

  const getRiskColor = (probability, impact) => {
    const riskScore = probability * impact
    if (riskScore >= 0.7) return '#dc2626'
    if (riskScore >= 0.4) return '#d97706'
    return '#16a34a'
  }

  const riskMatrixData = data?.risk_matrix?.map(risk => ({
    risk: risk.risk,
    probability: risk.probability,
    impact: risk.impact,
    severity: risk.severity,
    riskScore: risk.probability * risk.impact,
    riskLevel: getRiskLevel(risk.probability, risk.impact)
  })) || []

  const mitigationData = data?.mitigation_strategies?.map(strategy => ({
    risk: strategy.risk,
    strategy: strategy.strategy,
    effectiveness: strategy.effectiveness,
    cost: strategy.cost
  })) || []

  const trendsData = data?.risk_trends || []

  const riskCategories = {
    'Implementation Delay': { count: 0, totalRisk: 0 },
    'Budget Overrun': { count: 0, totalRisk: 0 },
    'Stakeholder Resistance': { count: 0, totalRisk: 0 },
    'Technology Failure': { count: 0, totalRisk: 0 },
    'Climate Uncertainty': { count: 0, totalRisk: 0 }
  }

  riskMatrixData.forEach(risk => {
    if (riskCategories[risk.risk]) {
      riskCategories[risk.risk].count++
      riskCategories[risk.risk].totalRisk += risk.riskScore
    }
  })

  const categoryData = Object.entries(riskCategories).map(([category, data]) => ({
    category,
    count: data.count,
    averageRisk: data.totalRisk / data.count || 0
  }))

  return (
    <div className="risk-assessment">
      <div className="assessment-header">
        <h3>⚠️ Risk Assessment</h3>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'matrix' ? 'active' : ''}`}
            onClick={() => setViewMode('matrix')}
          >
            Risk Matrix
          </button>
          <button 
            className={`view-btn ${viewMode === 'trends' ? 'active' : ''}`}
            onClick={() => setViewMode('trends')}
          >
            Risk Trends
          </button>
          <button 
            className={`view-btn ${viewMode === 'mitigation' ? 'active' : ''}`}
            onClick={() => setViewMode('mitigation')}
          >
            Mitigation
          </button>
        </div>
      </div>

      <div className="assessment-content">
        {viewMode === 'matrix' && (
          <div className="matrix-view">
            <div className="risk-overview">
              <h4>Risk Overview</h4>
              <div className="risk-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Risks:</span>
                  <span className="stat-value">{riskMatrixData.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">High Risk:</span>
                  <span className="stat-value">
                    {riskMatrixData.filter(r => r.riskLevel === 'High').length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Medium Risk:</span>
                  <span className="stat-value">
                    {riskMatrixData.filter(r => r.riskLevel === 'Medium').length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Risk:</span>
                  <span className="stat-value">
                    {riskMatrixData.filter(r => r.riskLevel === 'Low').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="risk-matrix">
              <h4>Risk Probability vs Impact Matrix</h4>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={riskMatrixData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="probability" 
                    domain={[0, 1]}
                    label={{ value: 'Probability', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="impact" 
                    domain={[0, 1]}
                    label={{ value: 'Impact', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${props.payload.risk} - ${props.payload.riskLevel} Risk`,
                      `Probability: ${(props.payload.probability * 100).toFixed(0)}%, Impact: ${(props.payload.impact * 100).toFixed(0)}%`
                    ]}
                  />
                  <Scatter 
                    dataKey="riskScore" 
                    fill={(entry) => getRiskColor(entry.probability, entry.impact)}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="risk-list">
              <h4>Risk Details</h4>
              <div className="risks-grid">
                {riskMatrixData.map((risk, index) => (
                  <div 
                    key={index}
                    className={`risk-item ${selectedRisk === index ? 'selected' : ''}`}
                    onClick={() => setSelectedRisk(selectedRisk === index ? null : index)}
                  >
                    <div className="risk-header">
                      <h5>{risk.risk}</h5>
                      <div className="risk-badges">
                        <span 
                          className="severity-badge"
                          style={{ backgroundColor: getSeverityColor(risk.severity) }}
                        >
                          {risk.severity.toUpperCase()}
                        </span>
                        <span 
                          className="risk-level-badge"
                          style={{ backgroundColor: getRiskColor(risk.probability, risk.impact) }}
                        >
                          {risk.riskLevel}
                        </span>
                      </div>
                    </div>
                    
                    <div className="risk-metrics">
                      <div className="metric">
                        <span className="metric-label">Probability:</span>
                        <span className="metric-value">{Math.round(risk.probability * 100)}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Impact:</span>
                        <span className="metric-value">{Math.round(risk.impact * 100)}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Risk Score:</span>
                        <span className="metric-value">{risk.riskScore.toFixed(2)}</span>
                      </div>
                    </div>

                    {selectedRisk === index && (
                      <div className="risk-details">
                        <div className="risk-description">
                          <h6>Description:</h6>
                          <p>Detailed description of the risk and its potential impact on the project.</p>
                        </div>
                        <div className="risk-impacts">
                          <h6>Potential Impacts:</h6>
                          <ul>
                            <li>Project timeline delays</li>
                            <li>Budget overruns</li>
                            <li>Stakeholder dissatisfaction</li>
                            <li>Quality compromises</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="risk-categories">
              <h4>Risk Categories</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'trends' && (
          <div className="trends-view">
            <div className="trends-overview">
              <h4>Risk Trends Over Time</h4>
              <div className="trends-stats">
                <div className="stat-item">
                  <span className="stat-label">Current Risk Level:</span>
                  <span className="stat-value">
                    {trendsData.length > 0 ? Math.round(trendsData[trendsData.length - 1].risk_level * 100) : 0}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Risk Trend:</span>
                  <span className="stat-value">
                    {trendsData.length > 1 ? 
                      (trendsData[trendsData.length - 1].risk_level > trendsData[0].risk_level ? 'Increasing' : 'Decreasing') : 
                      'Stable'
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="trends-chart">
              <h4>Risk Level Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="risk_level" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    name="Risk Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="risk-forecast">
              <h4>Risk Forecast</h4>
              <div className="forecast-analysis">
                <div className="forecast-item">
                  <h5>Next 3 Months</h5>
                  <div className="forecast-level high">High Risk</div>
                  <p>Based on current trends, risk levels are expected to remain elevated due to ongoing implementation challenges.</p>
                </div>
                <div className="forecast-item">
                  <h5>Next 6 Months</h5>
                  <div className="forecast-level medium">Medium Risk</div>
                  <p>Risk levels are expected to decrease as mitigation strategies take effect and project milestones are achieved.</p>
                </div>
                <div className="forecast-item">
                  <h5>Next 12 Months</h5>
                  <div className="forecast-level low">Low Risk</div>
                  <p>Long-term risk levels are expected to stabilize as the project matures and stakeholder confidence increases.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'mitigation' && (
          <div className="mitigation-view">
            <div className="mitigation-overview">
              <h4>Mitigation Strategies</h4>
              <div className="mitigation-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Strategies:</span>
                  <span className="stat-value">{mitigationData.length}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">High Effectiveness:</span>
                  <span className="stat-value">
                    {mitigationData.filter(m => m.effectiveness >= 0.8).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Cost:</span>
                  <span className="stat-value">
                    ${mitigationData.reduce((sum, m) => sum + m.cost, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mitigation-strategies">
              <h4>Mitigation Strategy Details</h4>
              <div className="strategies-list">
                {mitigationData.map((strategy, index) => (
                  <div key={index} className="strategy-item">
                    <div className="strategy-header">
                      <h5>{strategy.risk}</h5>
                      <div className="strategy-badges">
                        <span className="effectiveness-badge">
                          {Math.round(strategy.effectiveness * 100)}% Effective
                        </span>
                        <span className="cost-badge">
                          ${strategy.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="strategy-content">
                      <p>{strategy.strategy}</p>
                      <div className="strategy-metrics">
                        <div className="metric">
                          <span className="metric-label">Effectiveness:</span>
                          <div className="metric-bar">
                            <div 
                              className="metric-fill"
                              style={{ 
                                width: `${strategy.effectiveness * 100}%`,
                                backgroundColor: '#10b981'
                              }}
                            ></div>
                          </div>
                          <span className="metric-value">{Math.round(strategy.effectiveness * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mitigation-chart">
              <h4>Strategy Effectiveness vs Cost</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={mitigationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="cost" 
                    label={{ value: 'Cost ($)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="effectiveness" 
                    domain={[0, 1]}
                    label={{ value: 'Effectiveness', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${props.payload.risk} - ${Math.round(props.payload.effectiveness * 100)}% Effective`,
                      `Cost: $${props.payload.cost.toLocaleString()}`
                    ]}
                  />
                  <Scatter dataKey="effectiveness" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RiskAssessment
