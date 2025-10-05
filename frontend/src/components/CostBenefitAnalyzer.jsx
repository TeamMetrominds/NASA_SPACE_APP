import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts'
import './CostBenefitAnalyzer.css'

const CostBenefitAnalyzer = ({ data, interventions, onUpdate }) => {
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview') // overview, breakdown, sensitivity, roi

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getROIColor = (roi) => {
    if (roi >= 2.0) return '#16a34a'
    if (roi >= 1.5) return '#d97706'
    if (roi >= 1.0) return '#ea580c'
    return '#dc2626'
  }

  const costBreakdownData = data?.cost_breakdown?.map(item => ({
    category: item.category,
    cost: item.cost,
    percentage: item.percentage
  })) || []

  const benefitCategoriesData = data?.benefit_categories?.map(item => ({
    category: item.category,
    value: item.value,
    percentage: item.percentage
  })) || []

  const sensitivityData = data?.sensitivity_analysis?.map(item => ({
    scenario: item.scenario,
    roi: item.roi,
    paybackPeriod: item.payback_period
  })) || []

  const interventionROIData = interventions.map(intervention => ({
    intervention: intervention.name,
    cost: intervention.cost,
    effectiveness: intervention.effectiveness,
    roi: (intervention.cost * intervention.effectiveness * 2) / intervention.cost,
    paybackPeriod: intervention.cost / (intervention.cost * intervention.effectiveness * 2 / 12)
  }))

  const timeValueData = Array.from({ length: 10 }, (_, i) => ({
    year: 2024 + i,
    cumulativeCost: data?.total_investment * (i + 1) / 10,
    cumulativeBenefit: data?.expected_benefits * (i + 1) / 10,
    netBenefit: (data?.expected_benefits - data?.total_investment) * (i + 1) / 10
  }))

  return (
    <div className="costbenefit-analyzer">
      <div className="analyzer-header">
        <h3>💰 Cost-Benefit Analyzer</h3>
        <div className="analysis-controls">
          <button 
            className={`analysis-btn ${selectedAnalysis === 'overview' ? 'active' : ''}`}
            onClick={() => setSelectedAnalysis('overview')}
          >
            Overview
          </button>
          <button 
            className={`analysis-btn ${selectedAnalysis === 'breakdown' ? 'active' : ''}`}
            onClick={() => setSelectedAnalysis('breakdown')}
          >
            Cost Breakdown
          </button>
          <button 
            className={`analysis-btn ${selectedAnalysis === 'sensitivity' ? 'active' : ''}`}
            onClick={() => setSelectedAnalysis('sensitivity')}
          >
            Sensitivity
          </button>
          <button 
            className={`analysis-btn ${selectedAnalysis === 'roi' ? 'active' : ''}`}
            onClick={() => setSelectedAnalysis('roi')}
          >
            ROI Analysis
          </button>
        </div>
      </div>

      <div className="analyzer-content">
        {selectedAnalysis === 'overview' && (
          <div className="overview-analysis">
            <div className="financial-summary">
              <h4>Financial Summary</h4>
              <div className="summary-grid">
                <div className="summary-card">
                  <h5>Total Investment</h5>
                  <div className="summary-value">{formatCurrency(data?.total_investment || 0)}</div>
                </div>
                <div className="summary-card">
                  <h5>Expected Benefits</h5>
                  <div className="summary-value">{formatCurrency(data?.expected_benefits || 0)}</div>
                </div>
                <div className="summary-card">
                  <h5>Net Benefit</h5>
                  <div className={`summary-value ${(data?.net_benefit || 0) >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(data?.net_benefit || 0)}
                  </div>
                </div>
                <div className="summary-card">
                  <h5>ROI</h5>
                  <div 
                    className="summary-value"
                    style={{ color: getROIColor(data?.roi || 0) }}
                  >
                    {(data?.roi || 0).toFixed(2)}x
                  </div>
                </div>
                <div className="summary-card">
                  <h5>Payback Period</h5>
                  <div className="summary-value">{data?.payback_period || 0} months</div>
                </div>
              </div>
            </div>

            <div className="value-timeline">
              <h4>Value Creation Timeline</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timeValueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeCost" 
                    stackId="1" 
                    stroke="#dc2626" 
                    fill="#dc2626" 
                    fillOpacity={0.3}
                    name="Cumulative Cost"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulativeBenefit" 
                    stackId="1" 
                    stroke="#16a34a" 
                    fill="#16a34a" 
                    fillOpacity={0.3}
                    name="Cumulative Benefit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="benefit-distribution">
              <h4>Benefit Distribution</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={benefitCategoriesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                  >
                    {benefitCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 60}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedAnalysis === 'breakdown' && (
          <div className="breakdown-analysis">
            <div className="cost-breakdown">
              <h4>Cost Breakdown by Category</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={costBreakdownData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="cost" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="cost-details">
              <h4>Cost Details</h4>
              <div className="costs-list">
                {costBreakdownData.map((item, index) => (
                  <div key={index} className="cost-item">
                    <div className="cost-info">
                      <span className="cost-category">{item.category}</span>
                      <span className="cost-amount">{formatCurrency(item.cost)}</span>
                    </div>
                    <div className="cost-percentage">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: '#3b82f6'
                          }}
                        ></div>
                      </div>
                      <span className="percentage-text">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="benefit-breakdown">
              <h4>Benefit Categories</h4>
              <div className="benefits-list">
                {benefitCategoriesData.map((item, index) => (
                  <div key={index} className="benefit-item">
                    <div className="benefit-info">
                      <span className="benefit-category">{item.category}</span>
                      <span className="benefit-value">{formatCurrency(item.value)}</span>
                    </div>
                    <div className="benefit-percentage">
                      <div className="percentage-bar">
                        <div 
                          className="percentage-fill"
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: '#10b981'
                          }}
                        ></div>
                      </div>
                      <span className="percentage-text">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedAnalysis === 'sensitivity' && (
          <div className="sensitivity-analysis">
            <div className="sensitivity-overview">
              <h4>Sensitivity Analysis</h4>
              <div className="sensitivity-stats">
                <div className="stat-item">
                  <span className="stat-label">Best Case ROI:</span>
                  <span className="stat-value" style={{ color: '#16a34a' }}>
                    {sensitivityData.find(s => s.scenario === 'Optimistic')?.roi?.toFixed(2)}x
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Baseline ROI:</span>
                  <span className="stat-value">
                    {sensitivityData.find(s => s.scenario === 'Baseline')?.roi?.toFixed(2)}x
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Worst Case ROI:</span>
                  <span className="stat-value" style={{ color: '#dc2626' }}>
                    {sensitivityData.find(s => s.scenario === 'Pessimistic')?.roi?.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            <div className="sensitivity-chart">
              <h4>ROI by Scenario</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sensitivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="roi" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="payback-analysis">
              <h4>Payback Period Analysis</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sensitivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="paybackPeriod" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="scenario-details">
              <h4>Scenario Details</h4>
              <div className="scenarios-grid">
                {sensitivityData.map((scenario, index) => (
                  <div key={index} className="scenario-card">
                    <h5>{scenario.scenario}</h5>
                    <div className="scenario-metrics">
                      <div className="metric">
                        <span className="metric-label">ROI:</span>
                        <span 
                          className="metric-value"
                          style={{ color: getROIColor(scenario.roi) }}
                        >
                          {scenario.roi.toFixed(2)}x
                        </span>
                      </div>
                      <div className="metric">
                        <span className="metric-label">Payback Period:</span>
                        <span className="metric-value">{scenario.paybackPeriod} months</span>
                      </div>
                    </div>
                    <div className="scenario-description">
                      {scenario.scenario === 'Optimistic' && 
                        'Best-case scenario with high stakeholder engagement and minimal implementation challenges.'
                      }
                      {scenario.scenario === 'Baseline' && 
                        'Expected scenario based on current project parameters and historical data.'
                      }
                      {scenario.scenario === 'Pessimistic' && 
                        'Worst-case scenario with significant challenges and stakeholder resistance.'
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedAnalysis === 'roi' && (
          <div className="roi-analysis">
            <div className="roi-overview">
              <h4>ROI Analysis by Intervention</h4>
              <div className="roi-stats">
                <div className="stat-item">
                  <span className="stat-label">Average ROI:</span>
                  <span className="stat-value">
                    {(interventionROIData.reduce((sum, i) => sum + i.roi, 0) / interventionROIData.length).toFixed(2)}x
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Highest ROI:</span>
                  <span className="stat-value">
                    {Math.max(...interventionROIData.map(i => i.roi)).toFixed(2)}x
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Lowest ROI:</span>
                  <span className="stat-value">
                    {Math.min(...interventionROIData.map(i => i.roi)).toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            <div className="roi-chart">
              <h4>ROI by Intervention</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interventionROIData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="intervention" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="roi" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="roi-efficiency">
              <h4>Cost-Effectiveness Analysis</h4>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={interventionROIData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="cost" 
                    label={{ value: 'Cost ($)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="roi" 
                    label={{ value: 'ROI', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${props.payload.intervention} - ${props.payload.roi.toFixed(2)}x ROI`,
                      `Cost: ${formatCurrency(props.payload.cost)}`
                    ]}
                  />
                  <Scatter dataKey="roi" fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="roi-ranking">
              <h4>ROI Ranking</h4>
              <div className="ranking-list">
                {interventionROIData
                  .sort((a, b) => b.roi - a.roi)
                  .map((intervention, index) => (
                    <div key={index} className="ranking-item">
                      <div className="ranking-position">#{index + 1}</div>
                      <div className="ranking-info">
                        <span className="ranking-name">{intervention.intervention}</span>
                        <span className="ranking-roi" style={{ color: getROIColor(intervention.roi) }}>
                          {intervention.roi.toFixed(2)}x ROI
                        </span>
                      </div>
                      <div className="ranking-cost">{formatCurrency(intervention.cost)}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CostBenefitAnalyzer
