import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiService = {
  getLayers: async () => {
    try {
      const response = await api.get('/layers')
      return response.data
    } catch (error) {
      console.error('Error fetching layers:', error)
      throw error
    }
  },

  analyzePolygon: async (polygonData) => {
    try {
      const response = await api.post('/analyze', polygonData)
      return response.data
    } catch (error) {
      console.error('Error analyzing polygon:', error)
      throw error
    }
  },

  saveAnalysis: async (analysisData) => {
    try {
      const response = await api.post('/save-analysis', analysisData)
      return response.data
    } catch (error) {
      console.error('Error saving analysis:', error)
      throw error
    }
  },

  getStrategies: async (analysisResults) => {
    try {
      const response = await api.post('/strategies', analysisResults)
      return response.data
    } catch (error) {
      console.error('Error fetching strategies:', error)
      throw error
    }
  },

  getSavedAnalyses: async () => {
    try {
      const response = await api.get('/saved-analyses')
      return response.data
    } catch (error) {
      console.error('Error fetching saved analyses:', error)
      throw error
    }
  },

  getTileConfig: async () => {
    try {
      const response = await api.get('/tile-config')
      return response.data
    } catch (error) {
      console.error('Error fetching tile config:', error)
      throw error
    }
  },

  getBounds: async () => {
    try {
      const response = await api.get('/bounds')
      return response.data
    } catch (error) {
      console.error('Error fetching bounds:', error)
      throw error
    }
  },

  healthCheck: async () => {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  },

  // Advanced Analytics Endpoints
  runSimulation: async (baseResults) => {
    try {
      const response = await api.post('/advanced/simulation', baseResults)
      return response.data
    } catch (error) {
      console.error('Error running simulation:', error)
      // Return demo data if API fails
      return generateDemoSimulationData()
    }
  },

  generatePredictions: async (baseResults) => {
    try {
      const response = await api.post('/advanced/predictions', baseResults)
      return response.data
    } catch (error) {
      console.error('Error generating predictions:', error)
      // Return demo data if API fails
      return generateDemoPredictionData()
    }
  },

  calculateProbability: async (baseResults) => {
    try {
      const response = await api.post('/advanced/probability', baseResults)
      return response.data
    } catch (error) {
      console.error('Error calculating probability:', error)
      // Return demo data if API fails
      return generateDemoProbabilityData()
    }
  },

  getStrategicInterventions: async (baseResults) => {
    try {
      const response = await api.post('/advanced/interventions', baseResults)
      return response.data
    } catch (error) {
      console.error('Error getting strategic interventions:', error)
      // Return demo data if API fails
      return generateDemoInterventionsData()
    }
  },

  // Enhanced Strategic Interventions Endpoints
  getImplementationData: async (baseResults) => {
    try {
      const response = await api.post('/advanced/implementation', baseResults)
      return response.data
    } catch (error) {
      console.error('Error getting implementation data:', error)
      return generateDemoImplementationData()
    }
  },

  getStakeholderData: async (baseResults) => {
    try {
      const response = await api.post('/advanced/stakeholders', baseResults)
      return response.data
    } catch (error) {
      console.error('Error getting stakeholder data:', error)
      return generateDemoStakeholderData()
    }
  },

  getPerformanceMetrics: async (baseResults) => {
    try {
      const response = await api.post('/advanced/performance', baseResults)
      return response.data
    } catch (error) {
      console.error('Error getting performance metrics:', error)
      return generateDemoPerformanceData()
    }
  },

  getRiskAssessment: async (baseResults) => {
    try {
      const response = await api.post('/advanced/risks', baseResults)
      return response.data
    } catch (error) {
      console.error('Error getting risk assessment:', error)
      return generateDemoRiskData()
    }
  },

  getCostBenefitAnalysis: async (baseResults) => {
    try {
      const response = await api.post('/advanced/costbenefit', baseResults)
      return response.data
    } catch (error) {
      console.error('Error getting cost-benefit analysis:', error)
      return generateDemoCostBenefitData()
    }
  },

  runStrategicQuery: async (queryType, parameters) => {
    try {
      const response = await api.post('/advanced/query', { queryType, parameters })
      return response.data
    } catch (error) {
      console.error('Error running strategic query:', error)
      return generateDemoQueryResults(queryType, parameters)
    }
  }
}

// Demo data generators for when backend is not available
const generateDemoSimulationData = () => {
  return {
    scenarios: [
      { name: 'Baseline', ndvi: 0.4, lst: 25, vulnerability: 0.3 },
      { name: 'Optimistic', ndvi: 0.6, lst: 22, vulnerability: 0.2 },
      { name: 'Pessimistic', ndvi: 0.2, lst: 30, vulnerability: 0.5 }
    ],
    timeSeries: Array.from({ length: 10 }, (_, i) => ({
      year: 2024 + i,
      ndvi: 0.4 + (Math.random() - 0.5) * 0.2,
      lst: 25 + (Math.random() - 0.5) * 5,
      vulnerability: 0.3 + (Math.random() - 0.5) * 0.2
    }))
  }
}

const generateDemoPredictionData = () => {
  return {
    predictions: Array.from({ length: 5 }, (_, i) => ({
      year: 2024 + i,
      ndvi: 0.4 + (Math.random() - 0.5) * 0.2,
      lst: 25 + (Math.random() - 0.5) * 5,
      vulnerability: 0.3 + (Math.random() - 0.5) * 0.2,
      confidence: 0.9 - (i * 0.1)
    })),
    risks: [
      { type: 'temperature_increase', severity: 'medium', probability: 0.7 },
      { type: 'vegetation_decline', severity: 'low', probability: 0.4 }
    ]
  }
}

const generateDemoProbabilityData = () => {
  return {
    distributions: {
      ndvi: { mean: 0.4, std: 0.15 },
      lst: { mean: 25, std: 3.5 },
      vulnerability: { mean: 0.3, std: 0.2 }
    },
    riskMatrix: [
      { scenario: 'Best Case', probability: 0.1, impact: 0.2 },
      { scenario: 'Baseline', probability: 0.4, impact: 0.6 },
      { scenario: 'Worst Case', probability: 0.1, impact: 1.0 }
    ]
  }
}

const generateDemoInterventionsData = () => {
  return {
    interventions: [
      {
        id: 'green_infrastructure',
        name: 'Green Infrastructure',
        effectiveness: 0.85,
        cost: 1000000,
        timeline: 12,
        priority: 'high'
      },
      {
        id: 'smart_planning',
        name: 'Smart Urban Planning',
        effectiveness: 0.75,
        cost: 750000,
        timeline: 18,
        priority: 'medium'
      }
    ],
    impactAnalysis: {
      environmental: 0.3,
      temperature: -2.5,
      vulnerability: -0.2
    },
    costBenefit: {
      totalCost: 1750000,
      totalBenefit: 2500000,
      roi: 1.43
    }
  }
}

export default apiService
