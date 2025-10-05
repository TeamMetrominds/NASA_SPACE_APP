import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import './StrategicInterventions.css'

const StrategicInterventions = ({ data, onAnalysisComplete, loading }) => {
  const [interventions, setInterventions] = useState([])
  const [selectedIntervention, setSelectedIntervention] = useState(null)
  const [impactAnalysis, setImpactAnalysis] = useState(null)
  const [costBenefit, setCostBenefit] = useState(null)
  const [implementationPlan, setImplementationPlan] = useState(null)

  const interventionTypes = [
    {
      id: 'green_infrastructure',
      name: 'Green Infrastructure',
      category: 'Environmental',
      icon: '🌱',
      color: '#10b981',
      description: 'Implement green roofs, urban forests, and permeable surfaces'
    },
    {
      id: 'smart_planning',
      name: 'Smart Urban Planning',
      category: 'Urban Development',
      icon: '🏙️',
      color: '#3b82f6',
      description: 'AI-driven zoning and development regulations'
    },
    {
      id: 'climate_adaptation',
      name: 'Climate Adaptation',
      category: 'Resilience',
      icon: '🌡️',
      color: '#ef4444',
      description: 'Heat island mitigation and flood management'
    },
    {
      id: 'community_engagement',
      name: 'Community Engagement',
      category: 'Social',
      icon: '👥',
      color: '#8b5cf6',
      description: 'Participatory planning and education programs'
    },
    {
      id: 'technology_integration',
      name: 'Technology Integration',
      category: 'Innovation',
      icon: '🤖',
      color: '#f59e0b',
      description: 'IoT sensors, AI monitoring, and data analytics'
    }
  ]

  useEffect(() => {
    if (data) {
      generateStrategicInterventions()
    }
  }, [data])

  const generateStrategicInterventions = async () => {
    setLoading(true)
    try {
      // Generate AI-based strategic interventions
      const interventions = await createInterventions()
      setInterventions(interventions)
      
      // Analyze impact and cost-benefit
      const impact = analyzeInterventionImpact(interventions)
      setImpactAnalysis(impact)
      
      const costBenefit = calculateCostBenefit(interventions)
      setCostBenefit(costBenefit)
      
      const plan = createImplementationPlan(interventions)
      setImplementationPlan(plan)
      
      if (onAnalysisComplete) {
        onAnalysisComplete({
          type: 'strategic_interventions',
          interventions: interventions,
          impact: impact,
          costBenefit: costBenefit,
          implementationPlan: plan,
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Strategic interventions error:', error)
    } finally {
      setLoading(false)
    }
  }

  const createInterventions = async () => {
    const baseData = data?.layers || {
      ndvi: 0.4,
      lst: 25,
      vulnerability: 0.3,
      ndbi: 0.2,
      ntl: 0.5
    }

    return interventionTypes.map(type => {
      const effectiveness = Math.random() * 0.4 + 0.6 // 60-100% effectiveness
      const cost = Math.random() * 1000000 + 500000 // $500k - $1.5M
      const timeline = Math.floor(Math.random() * 24) + 6 // 6-30 months
      const priority = calculatePriority(type.id, baseData)
      
      return {
        ...type,
        effectiveness,
        cost,
        timeline,
        priority,
        expectedImpact: {
          ndvi: type.id === 'green_infrastructure' ? effectiveness * 0.3 : effectiveness * 0.1,
          lst: type.id === 'climate_adaptation' ? -effectiveness * 2 : -effectiveness * 0.5,
          vulnerability: -effectiveness * 0.2,
          ndbi: type.id === 'smart_planning' ? -effectiveness * 0.1 : 0,
          ntl: type.id === 'technology_integration' ? effectiveness * 0.1 : 0
        },
        roi: (effectiveness * 1000000) / cost,
        riskLevel: Math.random() * 0.4 + 0.2, // 20-60% risk
        stakeholders: generateStakeholders(type.id)
      }
    })
  }

  const calculatePriority = (typeId, baseData) => {
    const priorities = {
      green_infrastructure: baseData.ndvi < 0.4 ? 'high' : 'medium',
      smart_planning: baseData.ndbi > 0.3 ? 'high' : 'medium',
      climate_adaptation: baseData.lst > 28 ? 'high' : 'medium',
      community_engagement: baseData.vulnerability > 0.5 ? 'high' : 'medium',
      technology_integration: baseData.ntl > 0.6 ? 'high' : 'medium'
    }
    return priorities[typeId] || 'medium'
  }

  const generateStakeholders = (typeId) => {
    const stakeholderMap = {
      green_infrastructure: ['City Planning', 'Environmental Groups', 'Property Owners'],
      smart_planning: ['City Council', 'Developers', 'Residents'],
      climate_adaptation: ['Emergency Services', 'Public Health', 'Utilities'],
      community_engagement: ['Community Groups', 'Local Leaders', 'Schools'],
      technology_integration: ['Tech Companies', 'City IT', 'Universities']
    }
    return stakeholderMap[typeId] || ['General Public']
  }

  const analyzeInterventionImpact = (interventions) => {
    return {
      environmental: interventions.reduce((sum, i) => sum + i.expectedImpact.ndvi, 0),
      temperature: interventions.reduce((sum, i) => sum + i.expectedImpact.lst, 0),
      vulnerability: interventions.reduce((sum, i) => sum + i.expectedImpact.vulnerability, 0),
      urbanization: interventions.reduce((sum, i) => sum + i.expectedImpact.ndbi, 0),
      development: interventions.reduce((sum, i) => sum + i.expectedImpact.ntl, 0)
    }
  }

  const calculateCostBenefit = (interventions) => {
    const totalCost = interventions.reduce((sum, i) => sum + i.cost, 0)
    const totalBenefit = interventions.reduce((sum, i) => sum + (i.effectiveness * 1000000), 0)
    const netBenefit = totalBenefit - totalCost
    
    return {
      totalCost,
      totalBenefit,
      netBenefit,
      costBenefitRatio: totalBenefit / totalCost,
      paybackPeriod: totalCost / (totalBenefit / 12) // months
    }
  }

  const createImplementationPlan = (interventions) => {
    const phases = [
      { name: 'Phase 1: Foundation', duration: 6, interventions: interventions.slice(0, 2) },
      { name: 'Phase 2: Development', duration: 12, interventions: interventions.slice(2, 4) },
      { name: 'Phase 3: Optimization', duration: 18, interventions: interventions.slice(4) }
    ]
    
    return {
      phases,
      totalDuration: phases.reduce((sum, phase) => sum + phase.duration, 0),
      milestones: [
        { month: 6, milestone: 'Initial infrastructure deployment' },
        { month: 12, milestone: 'Community engagement programs' },
        { month: 18, milestone: 'Technology integration complete' },
        { month: 24, milestone: 'Full system optimization' }
      ]
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444'
      case 'medium': return '#f59e0b'
      case 'low': return '#10b981'
      default: return '#6b7280'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="strategic-interventions">
      <div className="panel-header">
        <h3>🎯 Strategic Interventions</h3>
        <p>AI-powered recommendations for sustainable urban development</p>
      </div>

      <div className="interventions-grid">
        {interventions.map((intervention, index) => (
          <div 
            key={intervention.id}
            className={`intervention-card ${selectedIntervention?.id === intervention.id ? 'selected' : ''}`}
            onClick={() => setSelectedIntervention(intervention)}
          >
            <div className="card-header">
              <div className="intervention-icon" style={{ color: intervention.color }}>
                {intervention.icon}
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
                <span className="metric-label">Effectiveness:</span>
                <span className="metric-value">{Math.round(intervention.effectiveness * 100)}%</span>
              </div>
              <div className="metric">
                <span className="metric-label">Cost:</span>
                <span className="metric-value">{formatCurrency(intervention.cost)}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Timeline:</span>
                <span className="metric-value">{intervention.timeline} months</span>
              </div>
              <div className="metric">
                <span className="metric-label">ROI:</span>
                <span className="metric-value">{intervention.roi.toFixed(1)}x</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedIntervention && (
        <div className="intervention-details">
          <h4>Detailed Analysis: {selectedIntervention.name}</h4>
          
          <div className="details-grid">
            <div className="impact-analysis">
              <h5>Expected Impact</h5>
              <div className="impact-metrics">
                <div className="impact-item">
                  <span>Vegetation (NDVI):</span>
                  <span className={selectedIntervention.expectedImpact.ndvi > 0 ? 'positive' : 'negative'}>
                    {selectedIntervention.expectedImpact.ndvi > 0 ? '+' : ''}{selectedIntervention.expectedImpact.ndvi.toFixed(3)}
                  </span>
                </div>
                <div className="impact-item">
                  <span>Temperature (LST):</span>
                  <span className={selectedIntervention.expectedImpact.lst < 0 ? 'positive' : 'negative'}>
                    {selectedIntervention.expectedImpact.lst.toFixed(1)}°C
                  </span>
                </div>
                <div className="impact-item">
                  <span>Vulnerability:</span>
                  <span className={selectedIntervention.expectedImpact.vulnerability < 0 ? 'positive' : 'negative'}>
                    {selectedIntervention.expectedImpact.vulnerability.toFixed(3)}
                  </span>
                </div>
              </div>
            </div>

            <div className="stakeholders">
              <h5>Key Stakeholders</h5>
              <div className="stakeholder-list">
                {selectedIntervention.stakeholders.map((stakeholder, index) => (
                  <div key={index} className="stakeholder-item">
                    {stakeholder}
                  </div>
                ))}
              </div>
            </div>

            <div className="risk-assessment">
              <h5>Risk Assessment</h5>
              <div className="risk-level">
                <span>Risk Level: </span>
                <span className={`risk-indicator ${selectedIntervention.riskLevel < 0.3 ? 'low' : selectedIntervention.riskLevel < 0.6 ? 'medium' : 'high'}`}>
                  {selectedIntervention.riskLevel < 0.3 ? 'Low' : selectedIntervention.riskLevel < 0.6 ? 'Medium' : 'High'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {impactAnalysis && (
        <div className="impact-overview">
          <h4>Combined Impact Analysis</h4>
          <div className="impact-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { name: 'Environmental', value: impactAnalysis.environmental },
                { name: 'Temperature', value: impactAnalysis.temperature },
                { name: 'Vulnerability', value: impactAnalysis.vulnerability },
                { name: 'Urbanization', value: impactAnalysis.urbanization },
                { name: 'Development', value: impactAnalysis.development }
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
      )}

      {costBenefit && (
        <div className="cost-benefit-analysis">
          <h4>Cost-Benefit Analysis</h4>
          <div className="cost-benefit-grid">
            <div className="cost-benefit-item">
              <span className="label">Total Investment:</span>
              <span className="value">{formatCurrency(costBenefit.totalCost)}</span>
            </div>
            <div className="cost-benefit-item">
              <span className="label">Expected Benefits:</span>
              <span className="value">{formatCurrency(costBenefit.totalBenefit)}</span>
            </div>
            <div className="cost-benefit-item">
              <span className="label">Net Benefit:</span>
              <span className={`value ${costBenefit.netBenefit > 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(costBenefit.netBenefit)}
              </span>
            </div>
            <div className="cost-benefit-item">
              <span className="label">ROI Ratio:</span>
              <span className="value">{costBenefit.costBenefitRatio.toFixed(2)}:1</span>
            </div>
            <div className="cost-benefit-item">
              <span className="label">Payback Period:</span>
              <span className="value">{Math.round(costBenefit.paybackPeriod)} months</span>
            </div>
          </div>
        </div>
      )}

      {implementationPlan && (
        <div className="implementation-plan">
          <h4>Implementation Roadmap</h4>
          <div className="phases-timeline">
            {implementationPlan.phases.map((phase, index) => (
              <div key={index} className="phase-item">
                <div className="phase-header">
                  <h5>{phase.name}</h5>
                  <span className="phase-duration">{phase.duration} months</span>
                </div>
                <div className="phase-interventions">
                  {phase.interventions.map((intervention, idx) => (
                    <div key={idx} className="phase-intervention">
                      {intervention.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="milestones">
            <h5>Key Milestones</h5>
            <div className="milestone-timeline">
              {implementationPlan.milestones.map((milestone, index) => (
                <div key={index} className="milestone-item">
                  <div className="milestone-month">Month {milestone.month}</div>
                  <div className="milestone-description">{milestone.milestone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StrategicInterventions
