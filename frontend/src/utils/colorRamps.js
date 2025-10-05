// Color ramp utilities for geospatial data visualization

export const colorRamps = {
  // NDVI - Vegetation Index (Green spectrum)
  ndvi: {
    name: 'Vegetation Index',
    colors: [
      '#8B4513', // Brown (no vegetation)
      '#D2B48C', // Tan
      '#F4A460', // Sandy brown
      '#9ACD32', // Yellow green
      '#32CD32', // Lime green
      '#228B22', // Forest green
      '#006400'  // Dark green
    ],
    stops: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0],
    description: 'Brown (no vegetation) to Green (dense vegetation)'
  },

  // NDBI - Built-up Index (Red spectrum)
  ndbi: {
    name: 'Built-up Index',
    colors: [
      '#000080', // Navy (water)
      '#4169E1', // Royal blue
      '#87CEEB', // Sky blue
      '#F0E68C', // Khaki
      '#FFD700', // Gold
      '#FF6347', // Tomato
      '#DC143C'  // Crimson
    ],
    stops: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0],
    description: 'Blue (water) to Red (built-up areas)'
  },

  // LST - Land Surface Temperature (Heat spectrum)
  lst: {
    name: 'Surface Temperature',
    colors: [
      '#0000FF', // Blue (cold)
      '#00FFFF', // Cyan
      '#00FF00', // Green
      '#FFFF00', // Yellow
      '#FF8000', // Orange
      '#FF0000', // Red
      '#800080'  // Purple (hot)
    ],
    stops: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0],
    description: 'Blue (cold) to Purple (hot)'
  },

  // NTL - Night Time Lights (Brightness spectrum)
  ntl: {
    name: 'Night Lights',
    colors: [
      '#000000', // Black (no light)
      '#191970', // Midnight blue
      '#000080', // Navy
      '#4169E1', // Royal blue
      '#87CEEB', // Sky blue
      '#FFFF00', // Yellow
      '#FFFFFF'  // White (bright)
    ],
    stops: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0],
    description: 'Black (no light) to White (bright)'
  },

  // Vulnerability - Risk spectrum
  vulnerability: {
    name: 'Vulnerability Index',
    colors: [
      '#00FF00', // Green (low risk)
      '#FFFF00', // Yellow
      '#FF8000', // Orange
      '#FF0000', // Red
      '#800000', // Maroon
      '#400000', // Dark red
      '#000000'  // Black (high risk)
    ],
    stops: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0],
    description: 'Green (low risk) to Black (high risk)'
  }
}

// Generate CSS gradient for color ramp
export const generateColorRampCSS = (colorRamp) => {
  const { colors, stops } = colorRamp
  const gradientStops = colors.map((color, index) => 
    `${color} ${(stops[index] * 100)}%`
  ).join(', ')
  
  return `linear-gradient(to right, ${gradientStops})`
}

// Get color for a specific value
export const getColorForValue = (value, minValue, maxValue, colorRamp) => {
  const { colors, stops } = colorRamp
  
  // Normalize value to 0-1 range
  const normalizedValue = (value - minValue) / (maxValue - minValue)
  
  // Find the appropriate color
  for (let i = 0; i < stops.length - 1; i++) {
    if (normalizedValue >= stops[i] && normalizedValue <= stops[i + 1]) {
      const ratio = (normalizedValue - stops[i]) / (stops[i + 1] - stops[i])
      return interpolateColor(colors[i], colors[i + 1], ratio)
    }
  }
  
  return colors[colors.length - 1] // Return last color if value is out of range
}

// Interpolate between two colors
const interpolateColor = (color1, color2, ratio) => {
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')
  
  const r1 = parseInt(hex1.substr(0, 2), 16)
  const g1 = parseInt(hex1.substr(2, 2), 16)
  const b1 = parseInt(hex1.substr(4, 2), 16)
  
  const r2 = parseInt(hex2.substr(0, 2), 16)
  const g2 = parseInt(hex2.substr(2, 2), 16)
  const b2 = parseInt(hex2.substr(4, 2), 16)
  
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Get color ramp for a specific layer
export const getColorRampForLayer = (layerId) => {
  return colorRamps[layerId] || colorRamps.ndvi // Default to NDVI if not found
}
