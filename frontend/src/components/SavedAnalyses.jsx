import React from 'react'

const SavedAnalyses = ({ analyses, loading, error, onSelectAnalysis, onRefresh }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date'
    return new Date(timestamp).toLocaleString()
  }

  const getAnalysisSummary = (analysis) => {
    if (!analysis.layers) return 'No data available'
    
    const lst = analysis.layers.lst?.mean
    const vulnerability = analysis.layers.vulnerability?.mean
    
    if (lst !== null && vulnerability !== null) {
      return `LST: ${lst.toFixed(2)}°C, Vulnerability: ${vulnerability.toFixed(3)}`
    }
    
    return 'Analysis data available'
  }

  const getAnalysisStatus = (analysis) => {
    if (!analysis.layers) return { status: 'error', color: '#e74c3c', text: 'Error' }
    
    const lst = analysis.layers.lst?.mean
    const vulnerability = analysis.layers.vulnerability?.mean
    
    if (lst > 35 && vulnerability > 0.7) {
      return { status: 'critical', color: '#e74c3c', text: 'Critical' }
    } else if (lst > 35 || vulnerability > 0.7) {
      return { status: 'warning', color: '#f39c12', text: 'Warning' }
    } else {
      return { status: 'normal', color: '#27ae60', text: 'Normal' }
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="loading-spinner" style={{ width: '30px', height: '30px' }}></div>
        <p>Loading analyses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <div style={{ 
          color: '#e74c3c', 
          padding: '1rem', 
          background: '#ffeaea', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          {error}
        </div>
        <button className="btn btn-primary" onClick={onRefresh}>
          Retry
        </button>
      </div>
    )
  }

  if (analyses.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '2rem', 
        color: '#666',
        background: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <h3>No Saved Analyses</h3>
        <p>Create and save analyses in the Analysis tab to view them here.</p>
        <button className="btn btn-primary" onClick={onRefresh}>
          Refresh
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>Analyses ({analyses.length})</h3>
        <button className="btn btn-secondary" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {analyses.map((analysis, index) => {
          const status = getAnalysisStatus(analysis)
          const summary = getAnalysisSummary(analysis)
          
          return (
            <div 
              key={analysis.filename || index}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3498db'
                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#ddd'
                e.target.style.boxShadow = 'none'
              }}
              onClick={() => onSelectAnalysis(analysis)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem' }}>
                    Analysis #{index + 1}
                  </h4>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    {formatDate(analysis.timestamp)}
                  </div>
                </div>
                <div style={{
                  padding: '0.25rem 0.5rem',
                  background: status.color,
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {status.text}
                </div>
              </div>
              
              <div style={{ fontSize: '0.9rem', color: '#2c3e50' }}>
                {summary}
              </div>
              
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#666', 
                marginTop: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>Click to view strategies</span>
                <span>→</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SavedAnalyses
