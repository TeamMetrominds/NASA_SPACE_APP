import React from 'react'

const StrategyCard = ({ strategy, priority }) => {
  const getPriorityColor = (priority) => {
    if (priority === 1) return '#e74c3c' // High priority - red
    if (priority === 2) return '#f39c12' // Medium priority - orange
    if (priority === 3) return '#f1c40f' // Low priority - yellow
    return '#95a5a6' // Default - gray
  }

  const getPriorityLabel = (priority) => {
    if (priority === 1) return 'High Priority'
    if (priority === 2) return 'Medium Priority'
    if (priority === 3) return 'Low Priority'
    return 'Standard Priority'
  }

  return (
    <div className="strategy-card">
      <div 
        className="strategy-header"
        style={{ 
          background: getPriorityColor(priority),
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
            {strategy.rule_name}
          </h3>
          <div className="strategy-priority">
            Priority {priority}: {getPriorityLabel(priority)}
          </div>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '0.25rem 0.5rem', 
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}>
          {strategy.strategies?.length || 0} strategies
        </div>
      </div>

      <div className="strategy-content">
        {strategy.description && (
          <div className="strategy-description">
            {strategy.description}
          </div>
        )}

        {strategy.matched_conditions && (
          <div style={{ 
            background: '#f8f9fa', 
            padding: '0.75rem', 
            borderRadius: '4px', 
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            <strong>Triggered by:</strong>
            <ul style={{ margin: '0.5rem 0 0 1rem', padding: 0 }}>
              {Object.entries(strategy.matched_conditions).map(([layer, conditions]) => (
                <li key={layer}>
                  <strong>{layer.toUpperCase()}:</strong> {
                    Object.entries(conditions).map(([op, value]) => 
                      `${op} ${value}`
                    ).join(' and ')
                  }
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
            Recommended Actions:
          </h4>
          <ul className="strategy-list">
            {strategy.strategies?.map((action, index) => (
              <li key={index}>
                {action}
              </li>
            ))}
          </ul>
        </div>

        {/* Implementation timeline suggestion */}
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.75rem', 
          background: '#e8f5e8', 
          borderRadius: '4px',
          border: '1px solid #27ae60'
        }}>
          <strong style={{ color: '#27ae60' }}>💡 Implementation Suggestion:</strong>
          <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {priority === 1 && "Implement these strategies immediately to address critical conditions."}
            {priority === 2 && "Plan and implement these strategies within the next 6-12 months."}
            {priority === 3 && "Consider these strategies for long-term planning and development."}
            {priority > 3 && "These strategies can be implemented as part of regular maintenance and planning."}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StrategyCard
