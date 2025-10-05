import React from 'react'
import { getColorRampForLayer, generateColorRampCSS } from '../utils/colorRamps'

const ColorRampLegend = ({ layerId, layerConfig, values = null }) => {
  const colorRamp = getColorRampForLayer(layerId)
  const { min_value, max_value } = layerConfig

  return (
    <div style={{
      background: 'white',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '0.5rem 0'
    }}>
      <h4 style={{ 
        margin: '0 0 0.75rem 0', 
        color: '#2c3e50',
        fontSize: '1rem'
      }}>
        {layerConfig.name} Color Legend
      </h4>
      
      {/* Color Ramp Bar */}
      <div style={{
        height: '30px',
        background: generateColorRampCSS(colorRamp),
        borderRadius: '6px',
        border: '2px solid #ddd',
        marginBottom: '0.75rem',
        position: 'relative'
      }}>
        {/* Value indicators if provided */}
        {values && (
          <div style={{
            position: 'absolute',
            top: '-25px',
            left: '0',
            right: '0',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: '#666'
          }}>
            <span>{min_value}</span>
            <span>{max_value}</span>
          </div>
        )}
      </div>
      
      {/* Color Ramp Description */}
      <div style={{ 
        fontSize: '0.85rem', 
        color: '#555',
        lineHeight: '1.4',
        marginBottom: '0.5rem'
      }}>
        {colorRamp.description}
      </div>
      
      {/* Value Range */}
      <div style={{ 
        fontSize: '0.8rem', 
        color: '#777',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Min: {min_value}</span>
        <span>Max: {max_value}</span>
      </div>
      
      {/* Current Values if provided */}
      {values && (
        <div style={{
          marginTop: '0.75rem',
          padding: '0.5rem',
          background: '#f8f9fa',
          borderRadius: '4px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: '600',
            color: '#495057',
            marginBottom: '0.25rem'
          }}>
            Current Analysis Values:
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#6c757d',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>Mean: {values.mean?.toFixed(3) || 'N/A'}</span>
            <span>Min: {values.min?.toFixed(3) || 'N/A'}</span>
            <span>Max: {values.max?.toFixed(3) || 'N/A'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ColorRampLegend
