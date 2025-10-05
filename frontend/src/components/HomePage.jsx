import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './HomePage.css'

const HomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Trigger load animation
    setTimeout(() => setIsLoaded(true), 300)

    return () => clearInterval(timer)
  }, [])

  const navigationCards = [
    {
      title: 'Interactive Map',
      description: 'Explore geospatial data layers with interactive visualization tools and real-time analysis',
      icon: '🗺️',
      path: '/map',
      primaryColor: '#2563eb',
      secondaryColor: '#1d4ed8',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
    },
    {
      title: 'Analysis Tools',
      description: 'Draw polygons and analyze environmental data with advanced statistical calculations',
      icon: '📊',
      path: '/analysis',
      primaryColor: '#dc2626',
      secondaryColor: '#b91c1c',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    },
    {
      title: 'Advanced Analytics',
      description: 'AI-powered simulations, predictions, probability analysis, and strategic interventions',
      icon: '🚀',
      path: '/advanced',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      title: 'Smart Strategies',
      description: 'Get AI-powered urban planning recommendations and sustainable development insights',
      icon: '🧠',
      path: '/strategies',
      primaryColor: '#7c3aed',
      secondaryColor: '#6d28d9',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
    }
  ]

  return (
    <div className="homepage">
      {/* Premium Animated Background */}
      <div className="homepage-background">
        <div className="geometric-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
        <div className="floating-particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className={`homepage-content ${isLoaded ? 'loaded' : ''}`}>
        {/* Premium Header */}
        <header className="homepage-header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-container">
                <div className="logo-icon">🌍</div>
                <div className="logo-pulse"></div>
              </div>
              <div className="title-section">
                <h1 className="main-title">
                  <span className="title-line">Geospatial</span>
                  <span className="title-line">Analysis</span>
                  <span className="title-line">Platform</span>
                </h1>
                <p className="subtitle">Advanced Environmental Data Analysis & Urban Planning Solutions</p>
              </div>
            </div>
            
            <div className="header-info">
              <div className="time-display">
                <div className="time-icon">🕐</div>
                <div className="time-content">
                  <div className="time">{currentTime.toLocaleTimeString()}</div>
                  <div className="date">{currentTime.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Premium Navigation Section */}
        <div className="navigation-section">
          <div className="section-header">
            <h2 className="section-title">Explore Our Tools</h2>
            <p className="section-subtitle">Choose your analysis workflow</p>
          </div>
          
          <div className="cards-grid">
            {navigationCards.map((card, index) => (
              <Link 
                key={card.title} 
                to={card.path} 
                className={`nav-card ${hoveredCard === index ? 'hovered' : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-background" style={{ background: card.gradient }}></div>
                <div className="card-glow" style={{ background: card.gradient }}></div>
                <div className="card-content">
                  <div className="card-icon-container">
                    <div className="card-icon">{card.icon}</div>
                    <div className="icon-ring"></div>
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                  <div className="card-arrow">→</div>
                </div>
                <div className="card-hover-effect"></div>
              </Link>
            ))}
          </div>
        </div>


        {/* Premium Footer */}
        <footer className="homepage-footer">
          <div className="footer-content">
            <p>&copy; 2025 Geospatial Analysis Platform. Advanced Environmental Data Analysis.</p>
            <div className="footer-links">
              <span>Powered by AI</span>
              <span>•</span>
              <span>Real-time Processing</span>
              <span>•</span>
              <span>Cloud Infrastructure</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default HomePage
