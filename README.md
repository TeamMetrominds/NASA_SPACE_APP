# Geospatial Analysis Application

A comprehensive web application for visualizing and analyzing geospatial data layers including NDVI, NDBI, LST, NTL, and Human Settlement Vulnerability. The application provides interactive mapping, polygon analysis, and smart urban planning strategies.

## Features

### 🗺️ Interactive Map
- Visualize multiple geospatial layers with XYZ tiles
- Layer opacity controls and toggle switches
- Real-time layer management

### 📊 Analysis Tools
- Draw polygons, rectangles, and circles on the map
- Extract statistical data (mean, min, max, std) from all layers
- Interactive charts and correlation analysis
- Save analysis results as JSON files

### 🎯 Smart Strategies
- AI-powered urban planning recommendations
- Rule-based strategy engine
- Priority-based action plans
- Export strategies for further use

## Architecture

- **Backend**: Python Flask with geospatial libraries (rasterio, geopandas)
- **Frontend**: React with Leaflet for mapping
- **Data Flow**: XYZ tiles for visualization → GeoTIFFs for analysis → JSON storage

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- GeoTIFF files for each layer
- XYZ tiles in the specified directory structure

## Installation

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create necessary directories
mkdir -p data/geotiffs
mkdir -p data/analysis_results
mkdir -p rules
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Data Preparation

Place your data files in the following structure:

```
backend/data/geotiffs/
├── ndvi.tif
├── ndbi.tif
├── lst.tif
├── ntl.tif
└── vulnerability.tif

tiles/
├── ndvi/
│   └── {z}/{x}/{y}.png
├── ndbi/
│   └── {z}/{x}/{y}.png
├── lst/
│   └── {z}/{x}/{y}.png
├── ntl/
│   └── {z}/{x}/{y}.png
└── vulnerability/
    └── {z}/{x}/{y}.png
```

## Running the Application

### 1. Start the Backend Server

```bash
cd backend
python app.py
```

The backend will start on `http://localhost:5000`

### 2. Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage

### Interactive Map Tab
1. Navigate to the Interactive Map tab
2. Use layer controls to toggle layers on/off
3. Adjust opacity sliders for each layer
4. Explore your geospatial data

### Analysis Tab
1. Navigate to the Analysis tab
2. Use drawing tools to create polygons, rectangles, or circles
3. View statistical analysis results in the popup table
4. Examine correlation charts and histograms
5. Save analysis results for later use

### Smart Strategies Tab
1. Navigate to the Smart Strategies tab
2. Select a saved analysis from the left panel
3. View AI-generated urban planning strategies
4. Export strategies as JSON files

## API Endpoints

- `GET /api/layers` - List available data layers
- `POST /api/analyze` - Analyze polygon against all layers
- `POST /api/save-analysis` - Save analysis results
- `POST /api/strategies` - Get smart strategies
- `GET /api/saved-analyses` - Get all saved analyses
- `GET /api/tile-config` - Get tile server configuration
- `GET /api/bounds` - Get layer bounds
- `GET /tiles/{layer}/{z}/{x}/{y}.png` - Serve XYZ tiles

## Configuration

### Layer Configuration
Edit `backend/config.py` to modify layer settings:

```python
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
    # ... other layers
}
```

### Strategy Rules
Edit `backend/rules/planning_rules.json` to customize urban planning rules:

```json
{
  "rules": [
    {
      "id": "high_heat_high_vulnerability",
      "name": "High Heat & High Vulnerability",
      "conditions": {
        "lst": {"min": 35},
        "vulnerability": {"min": 0.7}
      },
      "priority": 1,
      "strategies": [
        "Implement urban cooling strategies",
        "Increase green spaces and tree canopy"
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Backend connection error**: Ensure the Flask server is running on port 5000
2. **Missing tiles**: Check that XYZ tiles are in the correct directory structure
3. **GeoTIFF errors**: Verify that GeoTIFF files exist and are in the correct CRS
4. **Analysis fails**: Check that drawn polygons are within the data bounds

### Debug Mode

Enable debug mode in `backend/app.py`:
```python
app.run(host=API_HOST, port=API_PORT, debug=True)
```

## Development

### Adding New Layers

1. Add layer configuration to `backend/config.py`
2. Place GeoTIFF file in `backend/data/geotiffs/`
3. Generate XYZ tiles and place in `tiles/{layer_name}/`
4. Restart the backend server

### Customizing Strategies

1. Edit `backend/rules/planning_rules.json`
2. Modify conditions and strategies as needed
3. Restart the backend server

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the project repository.
