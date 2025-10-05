import os

# Base directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BASE_DIR)

# Data directories
GEOTIFF_DIR = os.path.join(PROJECT_ROOT, 'backend', 'data', 'geotiffs')
TILES_DIR = os.path.join(PROJECT_ROOT, 'tiles')
ANALYSIS_RESULTS_DIR = os.path.join(PROJECT_ROOT, 'backend', 'data', 'analysis_results')

# Layer configurations
LAYERS = {
    'ndvi': {
        'name': 'NDVI',
        'description': 'Normalized Difference Vegetation Index',
        'geotiff_file': 'ndvi.tif',
        'tile_path': 'ndvi',
        'color_scheme': 'greens',
        'min_value': -1,
        'max_value': 1
    },
    'ndbi': {
        'name': 'NDBI',
        'description': 'Normalized Difference Built-up Index',
        'geotiff_file': 'ndbi.tif',
        'tile_path': 'ndbi',
        'color_scheme': 'reds',
        'min_value': -1,
        'max_value': 1
    },
    'lst': {
        'name': 'LST',
        'description': 'Land Surface Temperature',
        'geotiff_file': 'lst.tif',
        'tile_path': 'lst',
        'color_scheme': 'hot',
        'min_value': 20,
        'max_value': 50
    },
    'ntl': {
        'name': 'NTL',
        'description': 'Night Time Lights',
        'geotiff_file': 'ntl.tif',
        'tile_path': 'ntl',
        'color_scheme': 'viridis',
        'min_value': 0,
        'max_value': 255
    },
    'vulnerability': {
        'name': 'Human Settlement Vulnerability',
        'description': 'Human Settlement Vulnerability Index',
        'geotiff_file': 'vulnerability.tif',
        'tile_path': 'vulnerability',
        'color_scheme': 'plasma',
        'min_value': 0,
        'max_value': 1
    }
}

# API Configuration
API_HOST = 'localhost'
API_PORT = 5000
CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001']

# Analysis settings
DEFAULT_CRS = 'EPSG:4326'
MAX_POLYGON_VERTICES = 1000
