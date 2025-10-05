import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import './InterventionDetails.css'

const InterventionDetails = ({ intervention, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedIntervention, setEditedIntervention] = useState(intervention)

  const handleSave = () => {
    onUpdate(editedIntervention)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedIntervention(intervention)
    setIsEditing(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#dc2626'
      case 'high': return '#ea580c'
      case 'medium': return '#d97706'
      case 'low': return '#16a34a'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#16a34a'
      case 'in_progress': return '#2563eb'
      case 'planning': return '#d97706'
      case 'pending': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const impactData = [
    { metric: 'NDVI', value: intervention.expected_impact.ndvi, max: 1 },
    { metric: 'LST Reduction', value: Math.abs(intervention.expected_impact.lst), max: 5 },
    { metric: 'Vulnerability', value: Math.abs(intervention.expected_impact.vulnerability), max: 1 },
    { metric: 'Air Quality', value: intervention.expected_impact.air_quality || 0, max: 1 },
    { metric: 'Biodiversity', value: intervention.expected_impact.biodiversity || 0, max: 1 }
  ]

  const metricsData = [
    { name: 'Completion', value: intervention.metrics.completion_rate },
    { name: 'Budget', value: intervention.metrics.budget_utilization },
    { name: 'Stakeholders', value: intervention.metrics.stakeholder_satisfaction },
    { name: 'Environment', value: intervention.metrics.environmental_impact }
  ]

  return (
    <div className="intervention-details">
      <div className="details-header">
        <div className="header-info">
          <h3>{intervention.name}</h3>
          <p>{intervention.description}</p>
          <div className="header-badges">
            <span 
              className="priority-badge" 
              style={{ backgroundColor: getPriorityColor(intervention.priority) }}
            >
              {intervention.priority.toUpperCase()}
            </span>
            <span 
              className="status-badge" 
              style={{ backgroundColor: getStatusColor(intervention.status) }}
            >
              {intervention.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="edit-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
          {isEditing && (
            <button 
              className="save-btn"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
      </div>

      <div className="details-content">
        <div className="details-grid">
          {/* Basic Information */}
          <div className="info-section">
            <h4>Basic Information</h4>
            <div className="info-grid">
              <div className="info-item">
                <label>Category:</label>
                <span>{intervention.category}</span>
              </div>
              <div className="info-item">
                <label>Effectiveness:</label>
                <span>{Math.round(intervention.effectiveness * 100)}%</span>
              </div>
              <div className="info-item">
                <label>Cost:</label>
                <span>{formatCurrency(intervention.cost)}</span>
              </div>
              <div className="info-item">
                <label>Timeline:</label>
                <span>{intervention.timeline} months</span>
              </div>
            </div>
          </div>

          {/* Expected Impact */}
          <div className="impact-section">
            <h4>Expected Impact</h4>
            <div className="impact-chart">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={impactData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 1]} />
                  <Radar 
                    name="Impact" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="impact-details">
              {Object.entries(intervention.expected_impact).map(([key, value]) => (
                <div key={key} className="impact-item">
                  <span className="impact-label">{key.toUpperCase()}:</span>
                  <span className="impact-value">{typeof value === 'number' ? value.toFixed(3) : value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="metrics-section">
            <h4>Performance Metrics</h4>
            <div className="metrics-chart">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={metricsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="metrics-details">
              <div className="metric-item">
                <span className="metric-label">Completion Rate:</span>
                <span className="metric-value">{Math.round(intervention.metrics.completion_rate * 100)}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Budget Utilization:</span>
                <span className="metric-value">{Math.round(intervention.metrics.budget_utilization * 100)}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Stakeholder Satisfaction:</span>
                <span className="metric-value">{Math.round(intervention.metrics.stakeholder_satisfaction * 100)}%</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Environmental Impact:</span>
                <span className="metric-value">{Math.round(intervention.metrics.environmental_impact * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Stakeholders */}
          <div className="stakeholders-section">
            <h4>Key Stakeholders</h4>
            <div className="stakeholders-list">
              {intervention.stakeholders.map((stakeholder, index) => (
                <div key={index} className="stakeholder-item">
                  <span className="stakeholder-name">{stakeholder}</span>
                  <span className="stakeholder-role">Stakeholder</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="risks-section">
            <h4>Risk Assessment</h4>
            <div className="risks-list">
              {intervention.risks.map((risk, index) => (
                <div key={index} className="risk-item">
                  <div className="risk-header">
                    <span className="risk-type">{risk.type.replace('_', ' ').toUpperCase()}</span>
                    <span className={`risk-severity ${risk.impact}`}>
                      {risk.impact.toUpperCase()}
                    </span>
                  </div>
                  <div className="risk-probability">
                    Probability: {Math.round(risk.probability * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost-Benefit Analysis */}
          <div className="costbenefit-section">
            <h4>Cost-Benefit Analysis</h4>
            <div className="costbenefit-grid">
              <div className="costbenefit-item">
                <span className="costbenefit-label">Total Cost:</span>
                <span className="costbenefit-value">{formatCurrency(intervention.cost)}</span>
              </div>
              <div className="costbenefit-item">
                <span className="costbenefit-label">Expected ROI:</span>
                <span className="costbenefit-value">{(intervention.cost * intervention.effectiveness * 2 / intervention.cost).toFixed(1)}x</span>
              </div>
              <div className="costbenefit-item">
                <span className="costbenefit-label">Payback Period:</span>
                <span className="costbenefit-value">{Math.round(intervention.cost / (intervention.cost * intervention.effectiveness * 2 / 12))} months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="edit-form">
            <h4>Edit Intervention</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editedIntervention.name}
                  onChange={(e) => setEditedIntervention({
                    ...editedIntervention,
                    name: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={editedIntervention.description}
                  onChange={(e) => setEditedIntervention({
                    ...editedIntervention,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Priority:</label>
                <select
                  value={editedIntervention.priority}
                  onChange={(e) => setEditedIntervention({
                    ...editedIntervention,
                    priority: e.target.value
                  })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={editedIntervention.status}
                  onChange={(e) => setEditedIntervention({
                    ...editedIntervention,
                    status: e.target.value
                  })}
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div className="form-group">
                <label>Effectiveness:</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={editedIntervention.effectiveness}
                  onChange={(e) => setEditedIntervention({
                    ...editedIntervention,
                    effectiveness: parseFloat(e.target.value)
                  })}
                />
                <span>{Math.round(editedIntervention.effectiveness * 100)}%</span>
              </div>
              <div className="form-group">
                <label>Cost:</label>
                <input
                  type="number"
                  value={editedIntervention.cost}
                  onChange={(e) => setEditedIntervention({
                    ...editedIntervention,
                    cost: parseInt(e.target.value)
                  })}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default InterventionDetails
