import React from 'react'

const LayerControl = ({ layerId, layerConfig, layerState, onToggle, onOpacityChange }) => {
  // Provide default values to prevent undefined errors
  const safeLayerState = layerState || { visible: false, opacity: 0.7 }

  const handleToggle = () => {
    onToggle(layerId)
  }

  const handleOpacityChange = (e) => {
    const opacity = parseFloat(e.target.value)
    onOpacityChange(layerId, opacity)
  }


  return (
    <div className="layer-control">
      <h3>{layerConfig.name}</h3>
      <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 0.5rem 0' }}>
        {layerConfig.description}
      </p>
      
      <div className="layer-toggle">
        <input
          type="checkbox"
          id={`toggle-${layerId}`}
          checked={safeLayerState.visible}
          onChange={handleToggle}
        />
        <label htmlFor={`toggle-${layerId}`}>
          {safeLayerState.visible ? 'Visible' : 'Hidden'}
        </label>
      </div>

      {safeLayerState.visible && (
        <div className="opacity-control">
          <label htmlFor={`opacity-${layerId}`}>Opacity:</label>
          <input
            type="range"
            id={`opacity-${layerId}`}
            min="0"
            max="1"
            step="0.1"
            value={safeLayerState.opacity}
            onChange={handleOpacityChange}
          />
          <span className="opacity-value">
            {Math.round(safeLayerState.opacity * 100)}%
          </span>
        </div>
      )}

      <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
        Range: {layerConfig.min_value} - {layerConfig.max_value}
      </div>
    </div>
  )
}

export default LayerControl
