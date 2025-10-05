import React from 'react'

const AnalysisResults = ({ results }) => {
  console.log('AnalysisResults received:', results)
  
  if (!results || !results.layers) {
    return <div>No analysis results available</div>
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return typeof value === 'number' ? value.toFixed(3) : value
  }

  const getLayerStats = (layerId, stats) => {
    if (!stats) {
      return {
        mean: 'N/A',
        min: 'N/A',
        max: 'N/A',
        std: 'N/A',
        count: 0
      }
    }

    if (stats.error) {
      return {
        mean: 'Error',
        min: 'Error',
        max: 'Error',
        std: 'Error',
        count: 0
      }
    }

    return {
      mean: formatValue(stats.mean),
      min: formatValue(stats.min),
      max: formatValue(stats.max),
      std: formatValue(stats.std),
      count: stats.count || 0
    }
  }

  return (
    <div>
      <h4>Analysis Results</h4>
      <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
        Analyzed on: {new Date(results.timestamp).toLocaleString()}
      </div>
      
      <table className="results-table">
        <thead>
          <tr>
            <th>Layer</th>
            <th>Mean</th>
            <th>Min</th>
            <th>Max</th>
            <th>Std Dev</th>
            <th>Pixels</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(results.layers).map(([layerId, stats]) => {
            const formattedStats = getLayerStats(layerId, stats)
            return (
              <tr key={layerId}>
                <td style={{ fontWeight: '600' }}>{layerId.toUpperCase()}</td>
                <td style={{ 
                  color: layerId === 'lst' ? '#e74c3c' : 
                         layerId === 'vulnerability' ? '#f39c12' : '#2c3e50',
                  fontWeight: '500'
                }}>
                  {formattedStats.mean}
                </td>
                <td>{formattedStats.min}</td>
                <td>{formattedStats.max}</td>
                <td>{formattedStats.std}</td>
                <td>{formattedStats.count}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Key metrics summary */}
      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
        <h5 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>Key Metrics</h5>
        {results.layers.lst && results.layers.lst.mean && (
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Land Surface Temperature:</strong> {formatValue(results.layers.lst.mean)}°C
            {results.layers.lst.mean > 35 && (
              <span style={{ color: '#e74c3c', marginLeft: '0.5rem' }}>⚠️ High Temperature</span>
            )}
          </div>
        )}
        {results.layers.vulnerability && results.layers.vulnerability.mean && (
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Vulnerability Index:</strong> {formatValue(results.layers.vulnerability.mean)}
            {results.layers.vulnerability.mean > 0.7 && (
              <span style={{ color: '#e74c3c', marginLeft: '0.5rem' }}>⚠️ High Vulnerability</span>
            )}
          </div>
        )}
        {results.layers.ndvi && results.layers.ndvi.mean && (
          <div>
            <strong>Vegetation Index (NDVI):</strong> {formatValue(results.layers.ndvi.mean)}
            {results.layers.ndvi.mean > 0.5 && (
              <span style={{ color: '#27ae60', marginLeft: '0.5rem' }}>🌱 High Vegetation</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisResults
