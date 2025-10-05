import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import StrategyCard from './StrategyCard'
import SavedAnalyses from './SavedAnalyses'

const StrategiesTab = () => {
  const [savedAnalyses, setSavedAnalyses] = useState([])
  const [selectedAnalysis, setSelectedAnalysis] = useState(null)
  const [strategies, setStrategies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadSavedAnalyses()
  }, [])

  const loadSavedAnalyses = async () => {
    try {
      setLoading(true)
      const response = await apiService.getSavedAnalyses()
      
      if (response.success) {
        setSavedAnalyses(response.analyses)
      } else {
        setError(response.error || 'Failed to load saved analyses')
      }
    } catch (error) {
      console.error('Error loading saved analyses:', error)
      setError('Failed to load saved analyses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadStrategies = async (analysis) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiService.getStrategies(analysis)
      
      if (response.success) {
        setStrategies(response.strategies.strategies || [])
        setSelectedAnalysis(analysis)
      } else {
        setError(response.error || 'Failed to load strategies')
      }
    } catch (error) {
      console.error('Error loading strategies:', error)
      setError('Failed to load strategies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportStrategies = () => {
    if (strategies.length === 0) return

    const exportData = {
      analysis: selectedAnalysis,
      strategies: strategies,
      exported_at: new Date().toISOString()
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `strategies_${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="strategies-container">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', height: '100vh' }}>
        {/* Left panel - Saved Analyses */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem', overflowY: 'auto' }}>
          <h2>Saved Analyses</h2>
          <SavedAnalyses 
            analyses={savedAnalyses}
            loading={loading}
            error={error}
            onSelectAnalysis={loadStrategies}
            onRefresh={loadSavedAnalyses}
          />
        </div>

        {/* Right panel - Strategies */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Smart Strategies</h2>
            {strategies.length > 0 && (
              <button 
                className="btn btn-primary"
                onClick={exportStrategies}
              >
                Export Strategies
              </button>
            )}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div className="loading-spinner"></div>
              <p>Loading strategies...</p>
            </div>
          )}

          {error && (
            <div style={{ 
              color: '#e74c3c', 
              padding: '1rem', 
              background: '#ffeaea', 
              borderRadius: '4px', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}

          {!selectedAnalysis && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#666',
              background: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <h3>Select an Analysis</h3>
              <p>Choose a saved analysis from the left panel to view smart strategies and recommendations.</p>
            </div>
          )}

          {selectedAnalysis && strategies.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem', 
              color: '#666',
              background: '#f8f9fa',
              borderRadius: '4px'
            }}>
              <h3>No Strategies Found</h3>
              <p>No specific strategies were identified for this analysis. The area may have moderate conditions that don't require immediate intervention.</p>
            </div>
          )}

          {strategies.length > 0 && (
            <div>
              <div style={{ 
                background: '#e8f4fd', 
                padding: '1rem', 
                borderRadius: '4px', 
                marginBottom: '1rem',
                border: '1px solid #3498db'
              }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                  Analysis Summary
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Based on the selected analysis, {strategies.length} strategy categories have been identified 
                  to address the specific conditions in this area.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {strategies.map((strategy, index) => (
                  <StrategyCard 
                    key={strategy.rule_id || index}
                    strategy={strategy}
                    priority={index + 1}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StrategiesTab
