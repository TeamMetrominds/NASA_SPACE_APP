import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import './ImplementationTracker.css'

const ImplementationTracker = ({ data, interventions, onUpdate }) => {
  const [selectedPhase, setSelectedPhase] = useState(null)
  const [viewMode, setViewMode] = useState('timeline') // timeline, budget, milestones

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#16a34a'
      case 'in_progress': return '#2563eb'
      case 'pending': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getPhaseStatus = (phase) => {
    if (phase.status === 'completed') return 'completed'
    if (phase.status === 'in_progress') return 'in_progress'
    return 'pending'
  }

  const getPhaseColor = (status) => {
    switch (status) {
      case 'completed': return '#16a34a'
      case 'in_progress': return '#2563eb'
      case 'pending': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const timelineData = data?.phases?.map((phase, index) => ({
    phase: phase.name,
    duration: phase.duration,
    status: getPhaseStatus(phase),
    startMonth: index * 6,
    endMonth: (index * 6) + phase.duration,
    progress: phase.status === 'completed' ? 100 : phase.status === 'in_progress' ? 50 : 0
  })) || []

  const budgetData = [
    { category: 'Spent', value: data?.budget?.total_spent || 0, color: '#ef4444' },
    { category: 'Remaining', value: data?.budget?.remaining || 0, color: '#10b981' }
  ]

  const milestoneData = data?.phases?.flatMap(phase => 
    phase.milestones?.map(milestone => ({
      name: milestone.name,
      status: milestone.status,
      date: milestone.date,
      phase: phase.name
    })) || []
  ) || []

  const progressData = [
    { month: 'Jan 2024', progress: 10 },
    { month: 'Feb 2024', progress: 15 },
    { month: 'Mar 2024', progress: 25 },
    { month: 'Apr 2024', progress: 35 },
    { month: 'May 2024', progress: 40 },
    { month: 'Jun 2024', progress: 45 }
  ]

  return (
    <div className="implementation-tracker">
      <div className="tracker-header">
        <h3>📅 Implementation Tracker</h3>
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
          <button 
            className={`view-btn ${viewMode === 'budget' ? 'active' : ''}`}
            onClick={() => setViewMode('budget')}
          >
            Budget
          </button>
          <button 
            className={`view-btn ${viewMode === 'milestones' ? 'active' : ''}`}
            onClick={() => setViewMode('milestones')}
          >
            Milestones
          </button>
        </div>
      </div>

      <div className="tracker-content">
        {viewMode === 'timeline' && (
          <div className="timeline-view">
            <div className="timeline-overview">
              <h4>Implementation Timeline</h4>
              <div className="timeline-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Duration:</span>
                  <span className="stat-value">{data?.timeline?.total_duration || 0} months</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Start Date:</span>
                  <span className="stat-value">{formatDate(data?.timeline?.start_date || '2024-01-01')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">End Date:</span>
                  <span className="stat-value">{formatDate(data?.timeline?.end_date || '2026-06-30')}</span>
                </div>
              </div>
            </div>

            <div className="phases-timeline">
              {data?.phases?.map((phase, index) => (
                <div 
                  key={index}
                  className={`phase-item ${selectedPhase === index ? 'selected' : ''}`}
                  onClick={() => setSelectedPhase(selectedPhase === index ? null : index)}
                >
                  <div className="phase-header">
                    <div className="phase-info">
                      <h5>{phase.name}</h5>
                      <span className="phase-duration">{phase.duration} months</span>
                    </div>
                    <div 
                      className="phase-status"
                      style={{ backgroundColor: getPhaseColor(getPhaseStatus(phase)) }}
                    >
                      {phase.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="phase-interventions">
                    <h6>Interventions:</h6>
                    <div className="intervention-tags">
                      {phase.interventions?.map((interventionId, idx) => {
                        const intervention = interventions.find(i => i.id === interventionId)
                        return (
                          <span key={idx} className="intervention-tag">
                            {intervention?.name || interventionId}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  {selectedPhase === index && (
                    <div className="phase-details">
                      <div className="milestones-section">
                        <h6>Milestones:</h6>
                        {phase.milestones?.map((milestone, idx) => (
                          <div key={idx} className="milestone-item">
                            <div className="milestone-info">
                              <span className="milestone-name">{milestone.name}</span>
                              <span className="milestone-date">{formatDate(milestone.date)}</span>
                            </div>
                            <div 
                              className="milestone-status"
                              style={{ backgroundColor: getStatusColor(milestone.status) }}
                            >
                              {milestone.status.toUpperCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="progress-chart">
              <h4>Overall Progress</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="progress" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Progress %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {viewMode === 'budget' && (
          <div className="budget-view">
            <div className="budget-overview">
              <h4>Budget Overview</h4>
              <div className="budget-stats">
                <div className="budget-stat">
                  <span className="budget-label">Total Allocated:</span>
                  <span className="budget-value">{formatCurrency(data?.budget?.total_allocated || 0)}</span>
                </div>
                <div className="budget-stat">
                  <span className="budget-label">Total Spent:</span>
                  <span className="budget-value">{formatCurrency(data?.budget?.total_spent || 0)}</span>
                </div>
                <div className="budget-stat">
                  <span className="budget-label">Remaining:</span>
                  <span className="budget-value">{formatCurrency(data?.budget?.remaining || 0)}</span>
                </div>
                <div className="budget-stat">
                  <span className="budget-label">Utilization Rate:</span>
                  <span className="budget-value">{Math.round((data?.budget?.utilization_rate || 0) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="budget-chart">
              <h4>Budget Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ category, value }) => `${category}: ${formatCurrency(value)}`}
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="intervention-costs">
              <h4>Intervention Costs</h4>
              <div className="costs-list">
                {interventions.map((intervention, index) => (
                  <div key={index} className="cost-item">
                    <div className="cost-info">
                      <span className="cost-name">{intervention.name}</span>
                      <span className="cost-amount">{formatCurrency(intervention.cost)}</span>
                    </div>
                    <div className="cost-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${intervention.metrics.budget_utilization * 100}%`,
                            backgroundColor: '#3b82f6'
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {Math.round(intervention.metrics.budget_utilization * 100)}% Used
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'milestones' && (
          <div className="milestones-view">
            <div className="milestones-overview">
              <h4>Project Milestones</h4>
              <div className="milestones-stats">
                <div className="milestone-stat">
                  <span className="milestone-label">Total Milestones:</span>
                  <span className="milestone-value">{milestoneData.length}</span>
                </div>
                <div className="milestone-stat">
                  <span className="milestone-label">Completed:</span>
                  <span className="milestone-value">
                    {milestoneData.filter(m => m.status === 'completed').length}
                  </span>
                </div>
                <div className="milestone-stat">
                  <span className="milestone-label">In Progress:</span>
                  <span className="milestone-value">
                    {milestoneData.filter(m => m.status === 'in_progress').length}
                  </span>
                </div>
                <div className="milestone-stat">
                  <span className="milestone-label">Pending:</span>
                  <span className="milestone-value">
                    {milestoneData.filter(m => m.status === 'pending').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="milestones-timeline">
              {milestoneData.map((milestone, index) => (
                <div key={index} className="milestone-timeline-item">
                  <div className="milestone-timeline-content">
                    <div className="milestone-timeline-header">
                      <h5>{milestone.name}</h5>
                      <span className="milestone-phase">{milestone.phase}</span>
                    </div>
                    <div className="milestone-timeline-details">
                      <span className="milestone-date">{formatDate(milestone.date)}</span>
                      <div 
                        className="milestone-status-badge"
                        style={{ backgroundColor: getStatusColor(milestone.status) }}
                      >
                        {milestone.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="milestones-chart">
              <h4>Milestone Status Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { status: 'Completed', count: milestoneData.filter(m => m.status === 'completed').length },
                  { status: 'In Progress', count: milestoneData.filter(m => m.status === 'in_progress').length },
                  { status: 'Pending', count: milestoneData.filter(m => m.status === 'pending').length }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImplementationTracker
