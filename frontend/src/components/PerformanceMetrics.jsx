import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area } from 'recharts'
import './PerformanceMetrics.css'

const PerformanceMetrics = ({ data, interventions, onUpdate }) => {
  const [selectedMetric, setSelectedMetric] = useState('overall')
  const [timeRange, setTimeRange] = useState('6months') // 3months, 6months, 1year, all

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'completion_rate': return '#3b82f6'
      case 'budget_efficiency': return '#10b981'
      case 'stakeholder_satisfaction': return '#f59e0b'
      case 'environmental_impact': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  const getPerformanceLevel = (value) => {
    if (value >= 0.8) return { level: 'Excellent', color: '#16a34a' }
    if (value >= 0.6) return { level: 'Good', color: '#d97706' }
    if (value >= 0.4) return { level: 'Fair', color: '#ea580c' }
    return { level: 'Poor', color: '#dc2626' }
  }

  const overallData = data?.overall_performance ? [
    { metric: 'Completion Rate', value: data.overall_performance.completion_rate },
    { metric: 'Budget Efficiency', value: data.overall_performance.budget_efficiency },
    { metric: 'Stakeholder Satisfaction', value: data.overall_performance.stakeholder_satisfaction },
    { metric: 'Environmental Impact', value: data.overall_performance.environmental_impact }
  ] : []

  const interventionData = data?.intervention_performance?.map(intervention => ({
    intervention: intervention.intervention,
    completion: intervention.completion,
    budget: intervention.budget_utilization,
    stakeholders: intervention.stakeholder_satisfaction,
    environment: intervention.environmental_impact
  })) || []

  const trendsData = data?.trends || []

  const getFilteredTrends = () => {
    const months = {
      '3months': 3,
      '6months': 6,
      '1year': 12,
      'all': trendsData.length
    }
    return trendsData.slice(-months[timeRange])
  }

  const radarData = overallData.map(item => ({
    metric: item.metric,
    value: item.value,
    max: 1
  }))

  return (
    <div className="performance-metrics">
      <div className="metrics-header">
        <h3>📈 Performance Metrics</h3>
        <div className="metrics-controls">
          <div className="metric-selector">
            <label>Metric:</label>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
            >
              <option value="overall">Overall Performance</option>
              <option value="completion">Completion Rate</option>
              <option value="budget">Budget Efficiency</option>
              <option value="stakeholders">Stakeholder Satisfaction</option>
              <option value="environment">Environmental Impact</option>
            </select>
          </div>
          <div className="time-selector">
            <label>Time Range:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      <div className="metrics-content">
        {selectedMetric === 'overall' && (
          <div className="overall-metrics">
            <div className="metrics-overview">
              <h4>Overall Performance Dashboard</h4>
              <div className="metrics-grid">
                {overallData.map((metric, index) => {
                  const performance = getPerformanceLevel(metric.value)
                  return (
                    <div key={index} className="metric-card">
                      <div className="metric-header">
                        <h5>{metric.metric}</h5>
                        <span 
                          className="performance-level"
                          style={{ color: performance.color }}
                        >
                          {performance.level}
                        </span>
                      </div>
                      <div className="metric-value">
                        {Math.round(metric.value * 100)}%
                      </div>
                      <div className="metric-bar">
                        <div 
                          className="metric-fill"
                          style={{ 
                            width: `${metric.value * 100}%`,
                            backgroundColor: getMetricColor(metric.metric.toLowerCase().replace(' ', '_'))
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="performance-radar">
              <h4>Performance Radar</h4>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 1]} />
                  <Radar 
                    name="Performance" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="trends-chart">
              <h4>Performance Trends</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={getFilteredTrends()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="performance" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'completion' && (
          <div className="completion-metrics">
            <div className="completion-overview">
              <h4>Completion Rate Analysis</h4>
              <div className="completion-stats">
                <div className="stat-item">
                  <span className="stat-label">Average Completion:</span>
                  <span className="stat-value">
                    {Math.round((data?.overall_performance?.completion_rate || 0) * 100)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed Projects:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.completion_rate === 1).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">In Progress:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.completion_rate > 0 && i.metrics.completion_rate < 1).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="completion-chart">
              <h4>Intervention Completion Rates</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interventionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="intervention" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="completion" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'budget' && (
          <div className="budget-metrics">
            <div className="budget-overview">
              <h4>Budget Efficiency Analysis</h4>
              <div className="budget-stats">
                <div className="stat-item">
                  <span className="stat-label">Average Efficiency:</span>
                  <span className="stat-value">
                    {Math.round((data?.overall_performance?.budget_efficiency || 0) * 100)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Under Budget:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.budget_utilization < 1).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Over Budget:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.budget_utilization > 1).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="budget-chart">
              <h4>Budget Utilization by Intervention</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interventionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="intervention" />
                  <YAxis domain={[0, 1.5]} />
                  <Tooltip />
                  <Bar dataKey="budget" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'stakeholders' && (
          <div className="stakeholder-metrics">
            <div className="stakeholder-overview">
              <h4>Stakeholder Satisfaction Analysis</h4>
              <div className="stakeholder-stats">
                <div className="stat-item">
                  <span className="stat-label">Average Satisfaction:</span>
                  <span className="stat-value">
                    {Math.round((data?.overall_performance?.stakeholder_satisfaction || 0) * 100)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">High Satisfaction:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.stakeholder_satisfaction >= 0.8).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Satisfaction:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.stakeholder_satisfaction < 0.6).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="stakeholder-chart">
              <h4>Stakeholder Satisfaction by Intervention</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interventionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="intervention" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="stakeholders" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedMetric === 'environment' && (
          <div className="environment-metrics">
            <div className="environment-overview">
              <h4>Environmental Impact Analysis</h4>
              <div className="environment-stats">
                <div className="stat-item">
                  <span className="stat-label">Average Impact:</span>
                  <span className="stat-value">
                    {Math.round((data?.overall_performance?.environmental_impact || 0) * 100)}%
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">High Impact:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.environmental_impact >= 0.7).length}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Low Impact:</span>
                  <span className="stat-value">
                    {interventions.filter(i => i.metrics.environmental_impact < 0.3).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="environment-chart">
              <h4>Environmental Impact by Intervention</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interventionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="intervention" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip />
                  <Bar dataKey="environment" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMetrics
