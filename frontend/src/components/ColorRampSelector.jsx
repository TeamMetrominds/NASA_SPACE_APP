import React, { useState } from 'react'
import { colorRamps, generateColorRampCSS } from '../utils/colorRamps'

const ColorRampSelector = ({ layerId, currentRamp, onRampChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const availableRamps = [
    { id: 'ndvi', name: 'Vegetation', description: 'Green spectrum for vegetation' },
    { id: 'ndbi', name: 'Built-up', description: 'Blue to red for urban areas' },
    { id: 'lst', name: 'Temperature', description: 'Blue to purple for heat' },
    { id: 'ntl', name: 'Night Lights', description: 'Black to white for brightness' },
    { id: 'vulnerability', name: 'Risk', description: 'Green to black for risk levels' }
  ]

  const handleRampSelect = (rampId) => {
    onRampChange(rampId)
    setIsOpen(false)
  }

  return (
    <div style={{ position: 'relative', marginTop: '0.5rem' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '0.5rem',
          border: '1px solid #ddd',
          borderRadius: '4px',
          background: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem'
        }}
      >
        <span>Color Scheme: {colorRamps[currentRamp]?.name || 'Default'}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {availableRamps.map((ramp) => (
            <div
              key={ramp.id}
              onClick={() => handleRampSelect(ramp.id)}
              style={{
                padding: '0.75rem',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: currentRamp === ramp.id ? '#e3f2fd' : 'white'
              }}
              onMouseEnter={(e) => {
                if (currentRamp !== ramp.id) {
                  e.target.style.background = '#f8f9fa'
                }
              }}
              onMouseLeave={(e) => {
                if (currentRamp !== ramp.id) {
                  e.target.style.background = 'white'
                }
              }}
            >
              <div style={{
                width: '30px',
                height: '15px',
                background: generateColorRampCSS(colorRamps[ramp.id]),
                borderRadius: '3px',
                border: '1px solid #ccc'
              }}></div>
              <div>
                <div style={{ 
                  fontSize: '0.8rem', 
                  fontWeight: '500',
                  color: '#2c3e50'
                }}>
                  {ramp.name}
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: '#666',
                  lineHeight: '1.2'
                }}>
                  {ramp.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ColorRampSelector
