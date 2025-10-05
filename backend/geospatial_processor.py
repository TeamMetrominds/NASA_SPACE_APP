import rasterio
import rasterio.features
import numpy as np
import geopandas as gpd
from shapely.geometry import shape
from shapely.ops import transform
import pyproj
from functools import partial
import json
import os
from config import LAYERS, GEOTIFF_DIR, DEFAULT_CRS

class GeospatialProcessor:
    def __init__(self):
        self.layer_paths = {}
        self._load_geotiff_paths()
    
    def _load_geotiff_paths(self):
        """Load paths to GeoTIFF files for each layer"""
        for layer_id, layer_config in LAYERS.items():
            geotiff_path = os.path.join(GEOTIFF_DIR, layer_config['geotiff_file'])
            if os.path.exists(geotiff_path):
                self.layer_paths[layer_id] = geotiff_path
            else:
                print(f"Warning: GeoTIFF file not found: {geotiff_path}")
    
    def _transform_geometry(self, geometry, from_crs, to_crs):
        """Transform geometry from one CRS to another"""
        project = pyproj.Transformer.from_crs(from_crs, to_crs, always_xy=True).transform
        return transform(project, geometry)
    
    def _extract_polygon_stats(self, geotiff_path, polygon_geojson):
        """Extract statistics from a GeoTIFF for a given polygon"""
        try:
            print(f"Processing GeoTIFF: {geotiff_path}")
            print(f"Polygon coordinates: {polygon_geojson['geometry']['coordinates']}")
            
            # Ensure coordinates are in [lng, lat] format
            coordinates = polygon_geojson['geometry']['coordinates']
            if coordinates and len(coordinates) > 0:
                first_coord = coordinates[0][0] if coordinates[0] else [0, 0]
                if len(first_coord) >= 2:
                    lng, lat = first_coord[0], first_coord[1]
                    # If coordinates look like [lat, lng] (lat between -90 and 90, lng between -180 and 180)
                    # and the lat value is larger than lng in absolute terms, swap them
                    if (-90 <= lng <= 90 and -180 <= lat <= 180 and abs(lng) > abs(lat)):
                        print("Detected [lat, lng] format, converting to [lng, lat]")
                        fixed_coords = []
                        for ring in coordinates:
                            fixed_ring = [[coord[1], coord[0]] for coord in ring]
                            fixed_coords.append(fixed_ring)
                        polygon_geojson['geometry']['coordinates'] = fixed_coords
                        print(f"Fixed coordinates: {polygon_geojson['geometry']['coordinates']}")
            
            # Parse the polygon geometry
            polygon_geom = shape(polygon_geojson['geometry'])
            print(f"Polygon bounds: {polygon_geom.bounds}")
            
            with rasterio.open(geotiff_path) as src:
                print(f"GeoTIFF bounds: {src.bounds}")
                print(f"GeoTIFF CRS: {src.crs}")
                print(f"GeoTIFF shape: {src.shape}")
                
                # Transform polygon to raster CRS if needed
                if src.crs != DEFAULT_CRS:
                    print(f"Transforming polygon from {DEFAULT_CRS} to {src.crs}")
                    polygon_geom = self._transform_geometry(polygon_geom, DEFAULT_CRS, src.crs)
                    print(f"Transformed polygon bounds: {polygon_geom.bounds}")
                
                # Create mask for the polygon
                mask = rasterio.features.geometry_mask(
                    [polygon_geom], 
                    out_shape=src.shape, 
                    transform=src.transform, 
                    invert=True
                )
                
                print(f"Mask created, {np.sum(mask)} pixels selected")
                
                # Read the data
                data = src.read(1)
                print(f"Data shape: {data.shape}, min: {np.min(data)}, max: {np.max(data)}")
                
                # Apply mask and get valid values
                masked_data = data[mask]
                valid_data = masked_data[~np.isnan(masked_data)]
                
                print(f"Valid data points: {len(valid_data)}")
                
                if len(valid_data) == 0:
                    print("No valid data points found")
                    return {
                        'mean': None,
                        'min': None,
                        'max': None,
                        'std': None,
                        'count': 0
                    }
                
                stats = {
                    'mean': float(np.mean(valid_data)),
                    'min': float(np.min(valid_data)),
                    'max': float(np.max(valid_data)),
                    'std': float(np.std(valid_data)),
                    'count': len(valid_data)
                }
                
                print(f"Calculated stats: {stats}")
                return stats
                
        except Exception as e:
            print(f"Error processing polygon: {str(e)}")
            import traceback
            traceback.print_exc()
            return {
                'mean': None,
                'min': None,
                'max': None,
                'std': None,
                'count': 0,
                'error': str(e)
            }
    
    def process_all_layers(self, polygon_geojson):
        """Process polygon against all available layers"""
        results = {
            'polygon': polygon_geojson,
            'timestamp': None,
            'layers': {}
        }
        
        for layer_id, geotiff_path in self.layer_paths.items():
            print(f"Processing layer: {layer_id}")
            layer_stats = self._extract_polygon_stats(geotiff_path, polygon_geojson)
            results['layers'][layer_id] = layer_stats
        
        # Add timestamp
        from datetime import datetime
        results['timestamp'] = datetime.now().isoformat()
        
        return results
    
    def get_layer_bounds(self, layer_id):
        """Get bounds of a specific layer"""
        if layer_id not in self.layer_paths:
            return None
        
        try:
            with rasterio.open(self.layer_paths[layer_id]) as src:
                bounds = src.bounds
                return {
                    'west': bounds.left,
                    'south': bounds.bottom,
                    'east': bounds.right,
                    'north': bounds.top
                }
        except Exception as e:
            print(f"Error getting bounds for {layer_id}: {str(e)}")
            return None
    
    def get_all_bounds(self):
        """Get bounds for all layers"""
        bounds = {}
        for layer_id in self.layer_paths.keys():
            bounds[layer_id] = self.get_layer_bounds(layer_id)
        return bounds
