from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

from config import API_HOST, API_PORT, CORS_ORIGINS, LAYERS, ANALYSIS_RESULTS_DIR
from geospatial_processor import GeospatialProcessor
from strategy_engine import StrategyEngine
from tile_server import serve_tile, get_tile_info
from advanced_analytics import AdvancedAnalyticsEngine

app = Flask(__name__)
CORS(app, origins=CORS_ORIGINS)

# Initialize processors
geo_processor = GeospatialProcessor()
strategy_engine = StrategyEngine()
advanced_analytics = AdvancedAnalyticsEngine()

# Ensure analysis results directory exists
os.makedirs(ANALYSIS_RESULTS_DIR, exist_ok=True)

@app.route('/api/layers', methods=['GET'])
def get_layers():
    """Get available data layers configuration"""
    try:
        layers_info = {}
        for layer_id, layer_config in LAYERS.items():
            layers_info[layer_id] = {
                'name': layer_config['name'],
                'description': layer_config['description'],
                'color_scheme': layer_config['color_scheme'],
                'min_value': layer_config['min_value'],
                'max_value': layer_config['max_value'],
                'tile_path': layer_config['tile_path'],
                'tile_url': f'/tiles/{layer_config["tile_path"]}/{{z}}/{{x}}/{{y}}.png'
            }
        
        return jsonify({
            'success': True,
            'layers': layers_info
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/analyze', methods=['POST'])
def analyze_polygon():
    """Analyze polygon against all layers"""
    try:
        data = request.get_json()
        
        if not data or 'geometry' not in data:
            return jsonify({
                'success': False,
                'error': 'Invalid polygon data'
            }), 400
        
        # Process the polygon
        results = geo_processor.process_all_layers(data)
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/save-analysis', methods=['POST'])
def save_analysis():
    """Save analysis results to JSON file"""
    try:
        data = request.get_json()
        
        if not data or 'results' not in data:
            return jsonify({
                'success': False,
                'error': 'Invalid analysis data'
            }), 400
        
        # Save the analysis
        filename = strategy_engine.save_analysis(data['results'])
        
        if filename:
            return jsonify({
                'success': True,
                'filename': filename,
                'message': 'Analysis saved successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save analysis'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/strategies', methods=['POST'])
def get_strategies():
    """Get smart strategies based on analysis results"""
    try:
        data = request.get_json()
        
        if not data or 'analysis_results' not in data:
            return jsonify({
                'success': False,
                'error': 'Invalid analysis data'
            }), 400
        
        # Get strategies
        strategies = strategy_engine.get_strategies(data['analysis_results'])
        summary = strategy_engine.get_strategy_summary(data['analysis_results'])
        
        return jsonify({
            'success': True,
            'strategies': strategies,
            'summary': summary
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/saved-analyses', methods=['GET'])
def get_saved_analyses():
    """Get all saved analysis results"""
    try:
        analyses = strategy_engine.load_saved_analyses()
        
        return jsonify({
            'success': True,
            'analyses': analyses
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/tile-config', methods=['GET'])
def get_tile_config():
    """Get tile server configuration"""
    try:
        tile_config = {}
        
        for layer_id, layer_config in LAYERS.items():
            tile_info = get_tile_info(layer_config['tile_path'])
            tile_config[layer_id] = {
                'name': layer_config['name'],
                'tile_url': f'/tiles/{layer_config["tile_path"]}/{{z}}/{{x}}/{{y}}.png',
                'available': tile_info['available'],
                'zoom_levels': tile_info.get('zoom_levels', []),
                'min_zoom': tile_info.get('min_zoom', 0),
                'max_zoom': tile_info.get('max_zoom', 18)
            }
        
        return jsonify({
            'success': True,
            'tile_config': tile_config
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/tiles/<layer>/<int:z>/<int:x>/<int:y>.png')
def serve_tile_endpoint(layer, z, x, y):
    """Serve individual tiles"""
    return serve_tile(layer, z, x, y)

@app.route('/api/bounds', methods=['GET'])
def get_bounds():
    """Get bounds for all layers"""
    try:
        bounds = geo_processor.get_all_bounds()
        
        return jsonify({
            'success': True,
            'bounds': bounds
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })

# Advanced Analytics Endpoints
@app.route('/api/advanced/simulation', methods=['POST'])
def run_simulation():
    """Run environmental simulation"""
    try:
        data = request.get_json()
        
        if not data or 'layers' not in data:
            return jsonify({
                'success': False,
                'error': 'Invalid simulation data'
            }), 400
        
        # Extract base data from analysis results
        base_data = {}
        for layer_id, layer_data in data['layers'].items():
            if layer_data and 'mean' in layer_data:
                base_data[layer_id] = layer_data['mean']
        
        # Get simulation parameters
        scenario = data.get('scenario', 'Baseline')
        years = data.get('years', 10)
        
        # Run simulation
        results = advanced_analytics.run_simulation(base_data, scenario, years)
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/advanced/predictions', methods=['POST'])
def generate_predictions():
    """Generate AI predictions"""
    try:
        data = request.get_json()
        
        if not data or 'layers' not in data:
            return jsonify({
                'success': False,
                'error': 'Invalid prediction data'
            }), 400
        
        # Extract base data
        base_data = {}
        for layer_id, layer_data in data['layers'].items():
            if layer_data and 'mean' in layer_data:
                base_data[layer_id] = layer_data['mean']
        
        # Get prediction parameters
        model_type = data.get('model', 'ensemble')
        horizon = data.get('horizon', 5)
        
        # Generate predictions
        results = advanced_analytics.generate_predictions(base_data, model_type, horizon)
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/advanced/probability', methods=['POST'])
def calculate_probability():
    """Calculate probability distributions"""
    try:
        data = request.get_json()
        
        if not data or 'layers' not in data:
            return jsonify({
                'success': False,
                'error': 'Invalid probability data'
            }), 400
        
        # Extract base data
        base_data = {}
        for layer_id, layer_data in data['layers'].items():
            if layer_data and 'mean' in layer_data:
                base_data[layer_id] = layer_data['mean']
        
        # Calculate probability
        results = advanced_analytics.calculate_probability(base_data)
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/advanced/interventions', methods=['POST'])
def get_strategic_interventions():
    """Get strategic interventions"""
    try:
        data = request.get_json()
        
        if not data or 'layers' not in data:
            return jsonify({
                'success': False,
                'error': 'Invalid intervention data'
            }), 400
        
        # Extract base data
        base_data = {}
        for layer_id, layer_data in data['layers'].items():
            if layer_data and 'mean' in layer_data:
                base_data[layer_id] = layer_data['mean']
        
        # Get interventions
        results = advanced_analytics.get_strategic_interventions(base_data)
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print(f"Starting Geospatial Analysis API on {API_HOST}:{API_PORT}")
    print(f"Available layers: {list(LAYERS.keys())}")
    app.run(host=API_HOST, port=API_PORT, debug=True)
