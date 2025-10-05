import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts'
import InterventionDetails from './InterventionDetails'
import ImplementationTracker from './ImplementationTracker'
import CostBenefitAnalyzer from './CostBenefitAnalyzer'
import StakeholderManager from './StakeholderManager'
import RiskAssessment from './RiskAssessment'
import PerformanceMetrics from './PerformanceMetrics'
import { apiService } from '../utils/api'
import './EnhancedStrategicInterventions.css'

const EnhancedStrategicInterventions = ({ data, onAnalysisComplete, loading }) => {
  const [interventions, setInterventions] = useState([])
  const [selectedIntervention, setSelectedIntervention] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [implementationData, setImplementationData] = useState(null)
  const [stakeholderData, setStakeholderData] = useState(null)
  const [performanceMetrics, setPerformanceMetrics] = useState(null)
  const [riskData, setRiskData] = useState(null)
  const [costBenefitData, setCostBenefitData] = useState(null)
  const [queryResults, setQueryResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'details', name: 'Intervention Details', icon: '🔍' },
    { id: 'implementation', name: 'Implementation', icon: '📅' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '👥' },
    { id: 'performance', name: 'Performance', icon: '📈' },
    { id: 'risks', name: 'Risk Assessment', icon: '⚠️' },
    { id: 'costbenefit', name: 'Cost-Benefit', icon: '💰' },
    { id: 'queries', name: 'Data Queries', icon: '🔍' }
  ]

  useEffect(() => {
    if (data) {
      loadStrategicInterventions()
    }
  }, [data])

  const loadStrategicInterventions = async () => {
    setIsLoading(true)
    try {
      // Load comprehensive intervention data
      const [interventionsData, implementationData, stakeholderData, performanceData, riskData, costBenefitData] = await Promise.all([
        apiService.getStrategicInterventions(data),
        apiService.getImplementationData(data),
        apiService.getStakeholderData(data),
        apiService.getPerformanceMetrics(data),
        apiService.getRiskAssessment(data),
        apiService.getCostBenefitAnalysis(data)
      ])

      setInterventions(interventionsData.interventions || [])
      setImplementationData(implementationData)
      setStakeholderData(stakeholderData)
      setPerformanceMetrics(performanceData)
      setRiskData(riskData)
      setCostBenefitData(costBenefitData)

      if (onAnalysisComplete) {
        onAnalysisComplete({
          type: 'enhanced_strategic_interventions',
          interventions: interventionsData.interventions,
          implementation: implementationData,
          stakeholders: stakeholderData,
          performance: performanceData,
          risks: riskData,
          costBenefit: costBenefitData,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error loading strategic interventions:', error)
      // Load demo data
      loadDemoData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadDemoData = () => {
    const demoInterventions = [
      {
        id: 'green_infrastructure',
        name: 'Green Infrastructure Network',
        category: 'Environmental',
        description: 'Comprehensive green infrastructure implementation including urban forests, green roofs, and permeable surfaces',
        effectiveness: 0.85,
        cost: 2500000,
        timeline: 24,
        priority: 'high',
        status: 'planning',
        expected_impact: {
          ndvi: 0.35,
          lst: -3.2,
          vulnerability: -0.25,
          air_quality: 0.4,
          biodiversity: 0.3
        },
        stakeholders: ['City Planning', 'Environmental Groups', 'Property Owners', 'Community Organizations'],
        risks: [
          { type: 'implementation_delay', probability: 0.3, impact: 'medium' },
          { type: 'cost_overrun', probability: 0.2, impact: 'high' }
        ],
        metrics: {
          completion_rate: 0,
          budget_utilization: 0,
          stakeholder_satisfaction: 0,
          environmental_impact: 0
        }
      },
      {
        id: 'smart_planning',
        name: 'AI-Driven Urban Planning',
        category: 'Technology',
        description: 'Advanced AI system for zoning, development regulations, and urban growth management',
        effectiveness: 0.78,
        cost: 1800000,
        timeline: 18,
        priority: 'high',
        status: 'in_progress',
        expected_impact: {
          ndvi: 0.15,
          lst: -1.8,
          vulnerability: -0.15,
          efficiency: 0.4,
          data_quality: 0.6
        },
        stakeholders: ['City Council', 'Developers', 'Residents', 'Tech Companies'],
        risks: [
          { type: 'technology_adoption', probability: 0.4, impact: 'medium' },
          { type: 'data_privacy', probability: 0.2, impact: 'high' }
        ],
        metrics: {
          completion_rate: 0.3,
          budget_utilization: 0.2,
          stakeholder_satisfaction: 0.7,
          environmental_impact: 0.2
        }
      },
      {
        id: 'climate_adaptation',
        name: 'Climate Resilience Program',
        category: 'Resilience',
        description: 'Comprehensive climate adaptation measures including heat island mitigation and flood management',
        effectiveness: 0.82,
        cost: 3200000,
        timeline: 36,
        priority: 'critical',
        status: 'planning',
        expected_impact: {
          ndvi: 0.25,
          lst: -4.5,
          vulnerability: -0.35,
          resilience: 0.5,
          emergency_preparedness: 0.4
        },
        stakeholders: ['Emergency Services', 'Public Health', 'Utilities', 'Community Groups'],
        risks: [
          { type: 'climate_uncertainty', probability: 0.6, impact: 'high' },
          { type: 'funding_shortage', probability: 0.3, impact: 'high' }
        ],
        metrics: {
          completion_rate: 0,
          budget_utilization: 0,
          stakeholder_satisfaction: 0,
          environmental_impact: 0
        }
      },
      {
        id: 'community_engagement',
        name: 'Community Empowerment Initiative',
        category: 'Social',
        description: 'Participatory planning and education programs for sustainable development',
        effectiveness: 0.72,
        cost: 800000,
        timeline: 12,
        priority: 'medium',
        status: 'completed',
        expected_impact: {
          ndvi: 0.1,
          lst: -0.8,
          vulnerability: -0.1,
          community_engagement: 0.6,
          education_level: 0.4
        },
        stakeholders: ['Community Groups', 'Local Leaders', 'Schools', 'NGOs'],
        risks: [
          { type: 'participation_low', probability: 0.4, impact: 'medium' },
          { type: 'cultural_resistance', probability: 0.3, impact: 'low' }
        ],
        metrics: {
          completion_rate: 1.0,
          budget_utilization: 0.95,
          stakeholder_satisfaction: 0.85,
          environmental_impact: 0.3
        }
      },
      {
        id: 'technology_integration',
        name: 'Smart City Technology Hub',
        category: 'Innovation',
        description: 'IoT sensors, AI monitoring, and data analytics for environmental management',
        effectiveness: 0.88,
        cost: 1500000,
        timeline: 15,
        priority: 'high',
        status: 'in_progress',
        expected_impact: {
          ndvi: 0.2,
          lst: -2.0,
          vulnerability: -0.2,
          data_accuracy: 0.7,
          monitoring_efficiency: 0.8
        },
        stakeholders: ['Tech Companies', 'City IT', 'Universities', 'Research Institutes'],
        risks: [
          { type: 'technology_failure', probability: 0.2, impact: 'high' },
          { type: 'maintenance_cost', probability: 0.5, impact: 'medium' }
        ],
        metrics: {
          completion_rate: 0.6,
          budget_utilization: 0.4,
          stakeholder_satisfaction: 0.8,
          environmental_impact: 0.4
        }
      }
    ]

    setInterventions(demoInterventions)
    setImplementationData(generateDemoImplementationData())
    setStakeholderData(generateDemoStakeholderData())
    setPerformanceMetrics(generateDemoPerformanceData())
    setRiskData(generateDemoRiskData())
    setCostBenefitData(generateDemoCostBenefitData())
  }

  const generateDemoImplementationData = () => ({
    phases: [
      {
        name: 'Phase 1: Foundation',
        duration: 6,
        status: 'completed',
        interventions: ['community_engagement'],
        milestones: [
          { name: 'Community Outreach', status: 'completed', date: '2024-01-15' },
          { name: 'Stakeholder Meetings', status: 'completed', date: '2024-02-28' }
        ]
      },
      {
        name: 'Phase 2: Development',
        duration: 12,
        status: 'in_progress',
        interventions: ['smart_planning', 'technology_integration'],
        milestones: [
          { name: 'AI System Development', status: 'in_progress', date: '2024-06-30' },
          { name: 'IoT Sensor Deployment', status: 'pending', date: '2024-08-15' }
        ]
      },
      {
        name: 'Phase 3: Optimization',
        duration: 18,
        status: 'pending',
        interventions: ['green_infrastructure', 'climate_adaptation'],
        milestones: [
          { name: 'Green Infrastructure Start', status: 'pending', date: '2024-12-01' },
          { name: 'Climate Adaptation Launch', status: 'pending', date: '2025-03-01' }
        ]
      }
    ],
    timeline: {
      start_date: '2024-01-01',
      end_date: '2026-06-30',
      total_duration: 30
    },
    budget: {
      total_allocated: 9800000,
      total_spent: 1200000,
      remaining: 8600000,
      utilization_rate: 0.12
    }
  })

  const generateDemoStakeholderData = () => ({
    stakeholders: [
      {
        name: 'City Planning Department',
        role: 'Primary Implementer',
        influence: 'high',
        support_level: 0.9,
        engagement_level: 0.8,
        concerns: ['Budget constraints', 'Timeline feasibility'],
        benefits: ['Improved urban planning', 'Better data insights']
      },
      {
        name: 'Environmental Groups',
        role: 'Advocate',
        influence: 'medium',
        support_level: 0.95,
        engagement_level: 0.9,
        concerns: ['Environmental impact verification'],
        benefits: ['Green infrastructure', 'Climate resilience']
      },
      {
        name: 'Property Owners',
        role: 'Beneficiary',
        influence: 'medium',
        support_level: 0.7,
        engagement_level: 0.6,
        concerns: ['Property value impact', 'Construction disruption'],
        benefits: ['Increased property values', 'Better amenities']
      },
      {
        name: 'Community Organizations',
        role: 'Facilitator',
        influence: 'high',
        support_level: 0.85,
        engagement_level: 0.9,
        concerns: ['Community representation'],
        benefits: ['Community empowerment', 'Local development']
      }
    ],
    engagement_strategies: [
      {
        stakeholder: 'City Planning Department',
        strategy: 'Regular progress meetings and technical briefings',
        frequency: 'weekly',
        effectiveness: 0.9
      },
      {
        stakeholder: 'Environmental Groups',
        strategy: 'Environmental impact assessments and green certification',
        frequency: 'monthly',
        effectiveness: 0.85
      }
    ]
  })

  const generateDemoPerformanceData = () => ({
    overall_performance: {
      completion_rate: 0.45,
      budget_efficiency: 0.78,
      stakeholder_satisfaction: 0.82,
      environmental_impact: 0.35
    },
    intervention_performance: [
      {
        intervention: 'Community Engagement',
        completion: 1.0,
        budget_utilization: 0.95,
        stakeholder_satisfaction: 0.85,
        environmental_impact: 0.3
      },
      {
        intervention: 'Smart Planning',
        completion: 0.3,
        budget_utilization: 0.2,
        stakeholder_satisfaction: 0.7,
        environmental_impact: 0.2
      },
      {
        intervention: 'Technology Integration',
        completion: 0.6,
        budget_utilization: 0.4,
        stakeholder_satisfaction: 0.8,
        environmental_impact: 0.4
      }
    ],
    trends: [
      { month: '2024-01', performance: 0.2 },
      { month: '2024-02', performance: 0.3 },
      { month: '2024-03', performance: 0.35 },
      { month: '2024-04', performance: 0.4 },
      { month: '2024-05', performance: 0.42 },
      { month: '2024-06', performance: 0.45 }
    ]
  })

  const generateDemoRiskData = () => ({
    risk_matrix: [
      { risk: 'Implementation Delay', probability: 0.3, impact: 0.6, severity: 'medium' },
      { risk: 'Budget Overrun', probability: 0.4, impact: 0.8, severity: 'high' },
      { risk: 'Stakeholder Resistance', probability: 0.2, impact: 0.4, severity: 'low' },
      { risk: 'Technology Failure', probability: 0.1, impact: 0.9, severity: 'high' },
      { risk: 'Climate Uncertainty', probability: 0.6, impact: 0.7, severity: 'high' }
    ],
    mitigation_strategies: [
      {
        risk: 'Implementation Delay',
        strategy: 'Agile project management with regular milestone reviews',
        effectiveness: 0.8,
        cost: 50000
      },
      {
        risk: 'Budget Overrun',
        strategy: 'Contingency fund allocation and cost monitoring',
        effectiveness: 0.7,
        cost: 200000
      }
    ],
    risk_trends: [
      { month: '2024-01', risk_level: 0.6 },
      { month: '2024-02', risk_level: 0.5 },
      { month: '2024-03', risk_level: 0.4 },
      { month: '2024-04', risk_level: 0.3 },
      { month: '2024-05', risk_level: 0.35 },
      { month: '2024-06', risk_level: 0.3 }
    ]
  })

  const generateDemoCostBenefitData = () => ({
    total_investment: 9800000,
    expected_benefits: 15600000,
    net_benefit: 5800000,
    roi: 1.59,
    payback_period: 18,
    cost_breakdown: [
      { category: 'Green Infrastructure', cost: 2500000, percentage: 25.5 },
      { category: 'Smart Planning', cost: 1800000, percentage: 18.4 },
      { category: 'Climate Adaptation', cost: 3200000, percentage: 32.7 },
      { category: 'Community Engagement', cost: 800000, percentage: 8.2 },
      { category: 'Technology Integration', cost: 1500000, percentage: 15.3 }
    ],
    benefit_categories: [
      { category: 'Environmental Benefits', value: 6200000, percentage: 39.7 },
      { category: 'Economic Benefits', value: 4800000, percentage: 30.8 },
      { category: 'Social Benefits', value: 3200000, percentage: 20.5 },
      { category: 'Health Benefits', value: 1400000, percentage: 9.0 }
    ],
    sensitivity_analysis: [
      { scenario: 'Optimistic', roi: 2.1, payback_period: 12 },
      { scenario: 'Baseline', roi: 1.59, payback_period: 18 },
      { scenario: 'Pessimistic', roi: 1.2, payback_period: 24 }
    ]
  })

  const runDataQuery = async (queryType, parameters) => {
    setIsLoading(true)
    try {
      const results = await apiService.runStrategicQuery(queryType, parameters)
      setQueryResults(results)
    } catch (error) {
      console.error('Query error:', error)
      // Demo query results
      setQueryResults(generateDemoQueryResults(queryType, parameters))
    } finally {
      setIsLoading(false)
    }
  }

  const generateDemoQueryResults = (queryType, parameters) => {
    const queryTypes = {
      'intervention_effectiveness': {
        results: interventions.map(i => ({
          intervention: i.name,
          effectiveness: i.effectiveness,
          cost: i.cost,
          timeline: i.timeline
        })),
        summary: 'Analysis of intervention effectiveness across all projects'
      },
      'stakeholder_engagement': {
        results: stakeholderData?.stakeholders.map(s => ({
          stakeholder: s.name,
          support_level: s.support_level,
          engagement_level: s.engagement_level,
          influence: s.influence
        })) || [],
        summary: 'Stakeholder engagement levels and support analysis'
      },
      'risk_assessment': {
        results: riskData?.risk_matrix.map(r => ({
          risk: r.risk,
          probability: r.probability,
          impact: r.impact,
          severity: r.severity
        })) || [],
        summary: 'Comprehensive risk assessment across all interventions'
      },
      'performance_metrics': {
        results: performanceMetrics?.intervention_performance.map(p => ({
          intervention: p.intervention,
          completion: p.completion,
          budget_utilization: p.budget_utilization,
          stakeholder_satisfaction: p.stakeholder_satisfaction
        })) || [],
        summary: 'Performance metrics analysis for all active interventions'
      }
    }
    
    return queryTypes[queryType] || { results: [], summary: 'No data available' }
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

  return (
    <div className="enhanced-strategic-interventions">
      <div className="interventions-header">
        <h2>🎯 Enhanced Strategic Interventions</h2>
        <p>Comprehensive AI-powered urban planning and environmental management system</p>
      </div>

      <div className="interventions-layout">
        {/* Navigation Tabs */}
        <div className="tabs-navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-name">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="interventions-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="interventions-grid">
                {interventions.map((intervention, index) => (
                  <div 
                    key={intervention.id}
                    className={`intervention-card ${selectedIntervention?.id === intervention.id ? 'selected' : ''}`}
                    onClick={() => setSelectedIntervention(intervention)}
                  >
                    <div className="card-header">
                      <div className="intervention-icon">
                        {intervention.category === 'Environmental' ? '🌱' : 
                         intervention.category === 'Technology' ? '🤖' :
                         intervention.category === 'Resilience' ? '🛡️' :
                         intervention.category === 'Social' ? '👥' : '💡'}
                      </div>
                      <div className="intervention-info">
                        <h4>{intervention.name}</h4>
                        <p>{intervention.description}</p>
                      </div>
                      <div className="priority-badge" style={{ backgroundColor: getPriorityColor(intervention.priority) }}>
                        {intervention.priority.toUpperCase()}
                      </div>
                    </div>
                    
                    <div className="card-metrics">
                      <div className="metric">
                        <span className="metric-label">Status:</span>
                        <span className="metric-value" style={{ color: getStatusColor(intervention.status) }}>
                          {intervention.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Effectiveness:</span>
                        <span className="metric-value">{Math.round(intervention.effectiveness * 100)}%</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Cost:</span>
                        <span className="metric-value">${(intervention.cost / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Timeline:</span>
                        <span className="metric-value">{intervention.timeline} months</span>
                      </div>
                    </div>

                    <div className="card-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${intervention.metrics.completion_rate * 100}%`,
                            backgroundColor: getStatusColor(intervention.status)
                          }}
                        ></div>
                      </div>
                      <span className="progress-text">
                        {Math.round(intervention.metrics.completion_rate * 100)}% Complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Statistics */}
              <div className="summary-stats">
                <div className="stat-card">
                  <h4>Total Investment</h4>
                  <div className="stat-value">${(costBenefitData?.total_investment / 1000000).toFixed(1)}M</div>
                </div>
                <div className="stat-card">
                  <h4>Expected ROI</h4>
                  <div className="stat-value">{(costBenefitData?.roi || 0).toFixed(1)}x</div>
                </div>
                <div className="stat-card">
                  <h4>Active Interventions</h4>
                  <div className="stat-value">{interventions.filter(i => i.status === 'in_progress').length}</div>
                </div>
                <div className="stat-card">
                  <h4>Stakeholder Satisfaction</h4>
                  <div className="stat-value">{Math.round((performanceMetrics?.overall_performance?.stakeholder_satisfaction || 0) * 100)}%</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && selectedIntervention && (
            <InterventionDetails 
              intervention={selectedIntervention}
              onUpdate={(updatedIntervention) => {
                setInterventions(prev => prev.map(i => 
                  i.id === updatedIntervention.id ? updatedIntervention : i
                ))
                setSelectedIntervention(updatedIntervention)
              }}
            />
          )}

          {activeTab === 'implementation' && (
            <ImplementationTracker 
              data={implementationData}
              interventions={interventions}
              onUpdate={setImplementationData}
            />
          )}

          {activeTab === 'stakeholders' && (
            <StakeholderManager 
              data={stakeholderData}
              interventions={interventions}
              onUpdate={setStakeholderData}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceMetrics 
              data={performanceMetrics}
              interventions={interventions}
              onUpdate={setPerformanceMetrics}
            />
          )}

          {activeTab === 'risks' && (
            <RiskAssessment 
              data={riskData}
              interventions={interventions}
              onUpdate={setRiskData}
            />
          )}

          {activeTab === 'costbenefit' && (
            <CostBenefitAnalyzer 
              data={costBenefitData}
              interventions={interventions}
              onUpdate={setCostBenefitData}
            />
          )}

          {activeTab === 'queries' && (
            <div className="queries-section">
              <h3>Data Queries & Analysis</h3>
              <div className="query-buttons">
                <button 
                  className="query-btn"
                  onClick={() => runDataQuery('intervention_effectiveness', {})}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Intervention Effectiveness'}
                </button>
                <button 
                  className="query-btn"
                  onClick={() => runDataQuery('stakeholder_engagement', {})}
                  disabled={isLoading}
                >
                  Stakeholder Engagement
                </button>
                <button 
                  className="query-btn"
                  onClick={() => runDataQuery('risk_assessment', {})}
                  disabled={isLoading}
                >
                  Risk Assessment
                </button>
                <button 
                  className="query-btn"
                  onClick={() => runDataQuery('performance_metrics', {})}
                  disabled={isLoading}
                >
                  Performance Metrics
                </button>
              </div>

              {queryResults && (
                <div className="query-results">
                  <h4>Query Results</h4>
                  <p className="query-summary">{queryResults.summary}</p>
                  <div className="results-table">
                    <table>
                      <thead>
                        <tr>
                          {Object.keys(queryResults.results[0] || {}).map(key => (
                            <th key={key}>{key.replace('_', ' ').toUpperCase()}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResults.results.map((result, index) => (
                          <tr key={index}>
                            {Object.values(result).map((value, idx) => (
                              <td key={idx}>{typeof value === 'number' ? value.toFixed(2) : value}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnhancedStrategicInterventions
