import React from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const AnalysisCharts = ({ results, layers }) => {
  if (!results || !results.layers) {
    return <div>No data available for charts</div>
  }

  // Prepare data for correlation chart
  const prepareCorrelationData = () => {
    const data = []
    const layerEntries = Object.entries(results.layers)
    
    // Create scatter plot data for LST vs Vulnerability
    if (results.layers.lst && results.layers.vulnerability) {
      data.push({
        name: 'Current Analysis',
        lst: results.layers.lst.mean,
        vulnerability: results.layers.vulnerability.mean,
        ndvi: results.layers.ndvi?.mean || 0,
        ndbi: results.layers.ndbi?.mean || 0,
        ntl: results.layers.ntl?.mean || 0
      })
    }
    
    return data
  }

  // Prepare data for histogram
  const prepareHistogramData = () => {
    const data = []
    Object.entries(results.layers).forEach(([layerId, stats]) => {
      if (stats && stats.mean !== null && stats.mean !== undefined) {
        data.push({
          layer: layerId.toUpperCase(),
          mean: stats.mean,
          min: stats.min,
          max: stats.max,
          color: getLayerColor(layerId)
        })
      }
    })
    return data
  }

  const getLayerColor = (layerId) => {
    const colors = {
      lst: '#e74c3c',
      vulnerability: '#f39c12',
      ndvi: '#27ae60',
      ndbi: '#8e44ad',
      ntl: '#3498db'
    }
    return colors[layerId] || '#95a5a6'
  }

  const correlationData = prepareCorrelationData()
  const histogramData = prepareHistogramData()

  return (
    <div className="charts-container">
      <div className="chart-container">
        <h4>LST vs Vulnerability Correlation</h4>
        <ResponsiveContainer width="100%" height={200}>
          <ScatterChart data={correlationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="lst" 
              name="LST" 
              unit="°C"
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <YAxis 
              type="number" 
              dataKey="vulnerability" 
              name="Vulnerability"
              domain={[0, 1]}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              formatter={(value, name) => [value, name]}
            />
            <Scatter 
              dataKey="vulnerability" 
              fill="#e74c3c" 
              r={8}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h4>Layer Values Comparison</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={histogramData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="layer" />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [value, name]}
            />
            <Bar 
              dataKey="mean" 
              fill="#3498db"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional insights */}
      <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
        <h4>Analysis Insights</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {results.layers.lst && results.layers.lst.mean > 35 && (
            <div style={{ padding: '0.5rem', background: '#ffeaea', borderRadius: '4px', border: '1px solid #e74c3c' }}>
              <strong>🌡️ High Temperature Alert</strong>
              <br />
              LST: {results.layers.lst.mean.toFixed(2)}°C
            </div>
          )}
          
          {results.layers.vulnerability && results.layers.vulnerability.mean > 0.7 && (
            <div style={{ padding: '0.5rem', background: '#fff3cd', borderRadius: '4px', border: '1px solid #f39c12' }}>
              <strong>⚠️ High Vulnerability</strong>
              <br />
              Index: {results.layers.vulnerability.mean.toFixed(3)}
            </div>
          )}
          
          {results.layers.ndvi && results.layers.ndvi.mean > 0.5 && (
            <div style={{ padding: '0.5rem', background: '#d4edda', borderRadius: '4px', border: '1px solid #27ae60' }}>
              <strong>🌱 High Vegetation</strong>
              <br />
              NDVI: {results.layers.ndvi.mean.toFixed(3)}
            </div>
          )}
          
          {results.layers.ndbi && results.layers.ndbi.mean > 0.3 && (
            <div style={{ padding: '0.5rem', background: '#e2e3e5', borderRadius: '4px', border: '1px solid #6c757d' }}>
              <strong>🏗️ Built-up Area</strong>
              <br />
              NDBI: {results.layers.ndbi.mean.toFixed(3)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalysisCharts
