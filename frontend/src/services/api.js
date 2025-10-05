import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// API functions
export const apiService = {
  // Get available layers
  getLayers: async () => {
    try {
      const response = await api.get('/layers')
      return response.data
    } catch (error) {
      console.error('Error fetching layers:', error)
      throw error
    }
  },

  // Analyze polygon against all layers
  analyzePolygon: async (polygonData) => {
    try {
      const response = await api.post('/analyze', polygonData)
      return response.data
    } catch (error) {
      console.error('Error analyzing polygon:', error)
      throw error
    }
  },

  // Save analysis results
  saveAnalysis: async (analysisData) => {
    try {
      const response = await api.post('/save-analysis', { results: analysisData })
      return response.data
    } catch (error) {
      console.error('Error saving analysis:', error)
      throw error
    }
  },

  // Get strategies based on analysis
  getStrategies: async (analysisResults) => {
    try {
      const response = await api.post('/strategies', { analysis_results: analysisResults })
      return response.data
    } catch (error) {
      console.error('Error fetching strategies:', error)
      throw error
    }
  },

  // Get saved analyses
  getSavedAnalyses: async () => {
    try {
      const response = await api.get('/saved-analyses')
      return response.data
    } catch (error) {
      console.error('Error fetching saved analyses:', error)
      throw error
    }
  },

  // Get tile configuration
  getTileConfig: async () => {
    try {
      const response = await api.get('/tile-config')
      return response.data
    } catch (error) {
      console.error('Error fetching tile config:', error)
      throw error
    }
  },

  // Get layer bounds
  getBounds: async () => {
    try {
      const response = await api.get('/bounds')
      return response.data
    } catch (error) {
      console.error('Error fetching bounds:', error)
      throw error
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Error checking health:', error)
      throw error
    }
  }
}

export default apiService
