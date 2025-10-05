import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import HomePage from './components/HomePage'
import InteractiveMap from './components/InteractiveMap'
import AnalysisTab from './components/AnalysisTab'
import StrategiesTab from './components/StrategiesTab'
import AdvancedAnalytics from './components/AdvancedAnalytics'
import { apiService } from './services/api'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('map')
  const [layers, setLayers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check backend health
      await apiService.healthCheck()
      
      // Load layers configuration
      const layersResponse = await apiService.getLayers()
      
      if (layersResponse.success) {
        setLayers(layersResponse.layers)
      } else {
        throw new Error('Failed to load layers configuration')
      }
    } catch (error) {
      console.error('Error initializing app:', error)
      setError(`Failed to connect to backend. Please ensure the backend server is running on http://localhost:5000. Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Loading Geospatial Analysis Application...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app-error">
        <h2>Connection Error</h2>
        <p>{error}</p>
        <button onClick={initializeApp} className="retry-button">
          Retry Connection
        </button>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={
            <div className="app">
              <header className="app-header">
                <h1>Geospatial Analysis Application</h1>
                        <nav className="app-nav">
                          <Link to="/" className="nav-link">🏠 Home</Link>
                          <Link to="/map" className="nav-link active">🗺️ Interactive Map</Link>
                          <Link to="/analysis" className="nav-link">📊 Analysis</Link>
                          <Link to="/advanced" className="nav-link">🚀 Advanced Analytics</Link>
                          <Link to="/strategies" className="nav-link">🧠 Smart Strategies</Link>
                        </nav>
              </header>
              <main className="app-main">
                <InteractiveMap layers={layers} />
              </main>
            </div>
          } />
          <Route path="/analysis" element={
            <div className="app">
              <header className="app-header">
                <h1>Geospatial Analysis Application</h1>
                        <nav className="app-nav">
                          <Link to="/" className="nav-link">🏠 Home</Link>
                          <Link to="/map" className="nav-link">🗺️ Interactive Map</Link>
                          <Link to="/analysis" className="nav-link active">📊 Analysis</Link>
                          <Link to="/advanced" className="nav-link">🚀 Advanced Analytics</Link>
                          <Link to="/strategies" className="nav-link">🧠 Smart Strategies</Link>
                        </nav>
              </header>
              <main className="app-main">
                <AnalysisTab layers={layers} />
              </main>
            </div>
          } />
          <Route path="/advanced" element={
            <div className="app">
              <header className="app-header">
                <h1>Geospatial Analysis Application</h1>
                        <nav className="app-nav">
                          <Link to="/" className="nav-link">🏠 Home</Link>
                          <Link to="/map" className="nav-link">🗺️ Interactive Map</Link>
                          <Link to="/analysis" className="nav-link">📊 Analysis</Link>
                          <Link to="/advanced" className="nav-link active">🚀 Advanced Analytics</Link>
                          <Link to="/strategies" className="nav-link">🧠 Smart Strategies</Link>
                        </nav>
              </header>
              <main className="app-main">
                <AdvancedAnalytics layers={layers} />
              </main>
            </div>
          } />
          <Route path="/strategies" element={
            <div className="app">
              <header className="app-header">
                <h1>Geospatial Analysis Application</h1>
                <nav className="app-nav">
                  <Link to="/" className="nav-link">🏠 Home</Link>
                  <Link to="/map" className="nav-link">🗺️ Interactive Map</Link>
                  <Link to="/analysis" className="nav-link">📊 Analysis</Link>
                  <Link to="/advanced" className="nav-link">🚀 Advanced Analytics</Link>
                  <Link to="/strategies" className="nav-link active">🧠 Smart Strategies</Link>
                </nav>
              </header>
              <main className="app-main">
                <StrategiesTab />
              </main>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
