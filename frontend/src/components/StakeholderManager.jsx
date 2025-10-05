import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import './StakeholderManager.css'

const StakeholderManager = ({ data, interventions, onUpdate }) => {
  const [selectedStakeholder, setSelectedStakeholder] = useState(null)
  const [viewMode, setViewMode] = useState('overview') // overview, engagement, influence

  const getInfluenceColor = (influence) => {
    switch (influence) {
      case 'high': return '#dc2626'
      case 'medium': return '#d97706'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getSupportColor = (level) => {
    if (level >= 0.8) return '#16a34a'
    if (level >= 0.6) return '#d97706'
    return '#dc2626'
  }

  const stakeholderData = data?.stakeholders?.map(stakeholder => ({
    name: stakeholder.name,
    support: stakeholder.support_level,
    engagement: stakeholder.engagement_level,
    influence: stakeholder.influence === 'high' ? 3 : stakeholder.influence === 'medium' ? 2 : 1
  })) || []

  const engagementData = data?.engagement_strategies?.map(strategy => ({
    stakeholder: strategy.stakeholder,
    effectiveness: strategy.effectiveness,
    frequency: strategy.frequency
  })) || []

  const influenceMatrix = data?.stakeholders?.map(stakeholder => ({
    name: stakeholder.name,
    influence: stakeholder.influence === 'high' ? 3 : stakeholder.influence === 'medium' ? 2 : 1,
    support: stakeholder.support_level,
    engagement: stakeholder.engagement_level
  })) || []

  return (
    <div className="stakeholder-manager">
      <div className="manager-header">
        <h3>👥 Stakeholder Manager</h3>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'overview' ? 'active' : ''}`}
            onClick={() => setViewMode('overview')}
          >
            Overview
          </button>
          <button 
            className={`view-btn ${viewMode === 'engagement' ? 'active' : ''}`}
            onClick={() => setViewMode('engagement')}
          >
            Engagement
          </button>
          <button 
            className={`view-btn ${viewMode === 'influence' ? 'active' : ''}`}
            onClick={() => setViewMode('influence')}
          >
            Influence Matrix
          </button>
        </div>
      </div>

      <div className="manager-content">
        {viewMode === 'overview' && (
          <div className="overview-view">
            <div className="stakeholders-grid">
              {data?.stakeholders?.map((stakeholder, index) => (
                <div 
                  key={index}
                  className={`stakeholder-card ${selectedStakeholder === index ? 'selected' : ''}`}
                  onClick={() => setSelectedStakeholder(selectedStakeholder === index ? null : index)}
                >
                  <div className="stakeholder-header">
                    <h4>{stakeholder.name}</h4>
                    <div className="stakeholder-badges">
                      <span 
                        className="influence-badge"
                        style={{ backgroundColor: getInfluenceColor(stakeholder.influence) }}
                      >
                        {stakeholder.influence.toUpperCase()}
                      </span>
                      <span className="role-badge">{stakeholder.role}</span>
                    </div>
                  </div>
                  
                  <div className="stakeholder-metrics">
                    <div className="metric">
                      <span className="metric-label">Support Level:</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill"
                          style={{ 
                            width: `${stakeholder.support_level * 100}%`,
                            backgroundColor: getSupportColor(stakeholder.support_level)
                          }}
                        ></div>
                      </div>
                      <span className="metric-value">{Math.round(stakeholder.support_level * 100)}%</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Engagement:</span>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill"
                          style={{ 
                            width: `${stakeholder.engagement_level * 100}%`,
                            backgroundColor: '#3b82f6'
                          }}
                        ></div>
                      </div>
                      <span className="metric-value">{Math.round(stakeholder.engagement_level * 100)}%</span>
                    </div>
                  </div>

                  {selectedStakeholder === index && (
                    <div className="stakeholder-details">
                      <div className="concerns-section">
                        <h5>Concerns:</h5>
                        <ul>
                          {stakeholder.concerns?.map((concern, idx) => (
                            <li key={idx}>{concern}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="benefits-section">
                        <h5>Benefits:</h5>
                        <ul>
                          {stakeholder.benefits?.map((benefit, idx) => (
                            <li key={idx}>{benefit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="stakeholder-chart">
              <h4>Support vs Engagement</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={stakeholderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="support" 
                    domain={[0, 1]}
                    label={{ value: 'Support Level', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="engagement" 
                    domain={[0, 1]}
                    label={{ value: 'Engagement Level', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Scatter dataKey="influence" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'engagement' && (
          <div className="engagement-view">
            <div className="engagement-strategies">
              <h4>Engagement Strategies</h4>
              {data?.engagement_strategies?.map((strategy, index) => (
                <div key={index} className="strategy-item">
                  <div className="strategy-header">
                    <h5>{strategy.stakeholder}</h5>
                    <span className="strategy-frequency">{strategy.frequency}</span>
                  </div>
                  <div className="strategy-content">
                    <p>{strategy.strategy}</p>
                    <div className="strategy-effectiveness">
                      <span className="effectiveness-label">Effectiveness:</span>
                      <div className="effectiveness-bar">
                        <div 
                          className="effectiveness-fill"
                          style={{ 
                            width: `${strategy.effectiveness * 100}%`,
                            backgroundColor: '#10b981'
                          }}
                        ></div>
                      </div>
                      <span className="effectiveness-value">{Math.round(strategy.effectiveness * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="engagement-chart">
              <h4>Strategy Effectiveness</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="stakeholder" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="effectiveness" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'influence' && (
          <div className="influence-view">
            <div className="influence-matrix">
              <h4>Influence vs Support Matrix</h4>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={influenceMatrix}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="influence" 
                    domain={[0, 4]}
                    label={{ value: 'Influence Level', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="support" 
                    domain={[0, 1]}
                    label={{ value: 'Support Level', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Scatter dataKey="engagement" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="influence-quadrants">
              <h4>Stakeholder Quadrants</h4>
              <div className="quadrants-grid">
                <div className="quadrant high-influence-high-support">
                  <h5>High Influence, High Support</h5>
                  <div className="quadrant-stakeholders">
                    {data?.stakeholders?.filter(s => s.influence === 'high' && s.support_level >= 0.8).map((s, idx) => (
                      <span key={idx} className="stakeholder-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
                <div className="quadrant high-influence-low-support">
                  <h5>High Influence, Low Support</h5>
                  <div className="quadrant-stakeholders">
                    {data?.stakeholders?.filter(s => s.influence === 'high' && s.support_level < 0.8).map((s, idx) => (
                      <span key={idx} className="stakeholder-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
                <div className="quadrant low-influence-high-support">
                  <h5>Low Influence, High Support</h5>
                  <div className="quadrant-stakeholders">
                    {data?.stakeholders?.filter(s => s.influence === 'low' && s.support_level >= 0.8).map((s, idx) => (
                      <span key={idx} className="stakeholder-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
                <div className="quadrant low-influence-low-support">
                  <h5>Low Influence, Low Support</h5>
                  <div className="quadrant-stakeholders">
                    {data?.stakeholders?.filter(s => s.influence === 'low' && s.support_level < 0.8).map((s, idx) => (
                      <span key={idx} className="stakeholder-tag">{s.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StakeholderManager
