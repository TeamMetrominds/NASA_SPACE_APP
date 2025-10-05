import os
from flask import send_file, abort, request
from config import TILES_DIR
import numpy as np
from PIL import Image
import io

# Color ramp definitions
COLOR_RAMPS = {
    'ndvi': {
        'colors': [
            (139, 69, 19),    # Brown
            (210, 180, 140),  # Tan
            (244, 164, 96),   # Sandy brown
            (154, 205, 50),   # Yellow green
            (50, 205, 50),    # Lime green
            (34, 139, 34),    # Forest green
            (0, 100, 0)       # Dark green
        ],
        'stops': [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0]
    },
    'ndbi': {
        'colors': [
            (0, 0, 128),      # Navy
            (65, 105, 225),   # Royal blue
            (135, 206, 235),  # Sky blue
            (240, 230, 140),  # Khaki
            (255, 215, 0),    # Gold
            (255, 99, 71),    # Tomato
            (220, 20, 60)     # Crimson
        ],
        'stops': [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0]
    },
    'lst': {
        'colors': [
            (0, 0, 255),      # Blue
            (0, 255, 255),    # Cyan
            (0, 255, 0),      # Green
            (255, 255, 0),    # Yellow
            (255, 128, 0),    # Orange
            (255, 0, 0),      # Red
            (128, 0, 128)     # Purple
        ],
        'stops': [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0]
    },
    'ntl': {
        'colors': [
            (0, 0, 0),        # Black
            (25, 25, 112),    # Midnight blue
            (0, 0, 128),      # Navy
            (65, 105, 225),   # Royal blue
            (135, 206, 235),  # Sky blue
            (255, 255, 0),    # Yellow
            (255, 255, 255)   # White
        ],
        'stops': [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0]
    },
    'vulnerability': {
        'colors': [
            (0, 255, 0),      # Green
            (255, 255, 0),    # Yellow
            (255, 128, 0),    # Orange
            (255, 0, 0),      # Red
            (128, 0, 0),      # Maroon
            (64, 0, 0),       # Dark red
            (0, 0, 0)         # Black
        ],
        'stops': [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1.0]
    }
}

def apply_color_ramp(image_array, color_ramp, min_val, max_val):
    """Apply color ramp to grayscale image array"""
    # Normalize values to 0-1 range
    normalized = (image_array - min_val) / (max_val - min_val)
    normalized = np.clip(normalized, 0, 1)
    
    # Create RGB array
    height, width = image_array.shape
    rgb_array = np.zeros((height, width, 3), dtype=np.uint8)
    
    colors = color_ramp['colors']
    stops = color_ramp['stops']
    
    for i in range(len(stops) - 1):
        mask = (normalized >= stops[i]) & (normalized < stops[i + 1])
        if i == len(stops) - 2:  # Include the last stop
            mask = (normalized >= stops[i]) & (normalized <= stops[i + 1])
        
        if np.any(mask):
            # Interpolate between colors
            ratio = (normalized[mask] - stops[i]) / (stops[i + 1] - stops[i])
            ratio = np.clip(ratio, 0, 1)
            
            for j in range(3):  # RGB channels
                rgb_array[mask, j] = colors[i][j] + (colors[i + 1][j] - colors[i][j]) * ratio
    
    return rgb_array

def serve_tile(layer, z, x, y):
    """Serve XYZ tile from local directory with color ramp applied"""
    try:
        # Convert x, y, z to integers
        z = int(z)
        x = int(x)
        y = int(y)
        
        # Get color ramp from query parameter
        color_ramp_name = request.args.get('color_ramp', layer)
        print(f"Processing tile {layer}/{z}/{x}/{y} with color_ramp={color_ramp_name}")
        
        # Construct tile path
        tile_path = os.path.join(TILES_DIR, layer, str(z), str(x), f"{y}.png")
        
        # Check if tile exists
        if not os.path.exists(tile_path):
            # Return a transparent 256x256 PNG for missing tiles
            transparent_tile = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
            img_io = io.BytesIO()
            transparent_tile.save(img_io, format='PNG')
            img_io.seek(0)
            
            from flask import Response
            return Response(img_io.getvalue(), mimetype='image/png')
        
        # Load the original tile
        original_image = Image.open(tile_path)
        
        # Convert to numpy array
        img_array = np.array(original_image)
        
        # Apply color ramp if different from default
        if color_ramp_name in COLOR_RAMPS and color_ramp_name != layer:
            # Get layer value ranges
            min_vals = {'ndvi': -1, 'ndbi': -1, 'lst': 20, 'ntl': 0, 'vulnerability': 0}
            max_vals = {'ndvi': 1, 'ndbi': 1, 'lst': 50, 'ntl': 255, 'vulnerability': 1}
            
            min_val = min_vals.get(layer, 0)
            max_val = max_vals.get(layer, 1)
            
            # Convert to grayscale if needed, then apply color ramp
            if len(img_array.shape) == 3:  # RGB image
                # Convert RGB to grayscale using luminance formula
                gray_array = np.dot(img_array[...,:3], [0.299, 0.587, 0.114])
            else:  # Already grayscale
                gray_array = img_array
            
            # Apply color ramp to grayscale data
            colored_array = apply_color_ramp(gray_array, COLOR_RAMPS[color_ramp_name], min_val, max_val)
            colored_image = Image.fromarray(colored_array, 'RGB')
        else:
            colored_image = original_image
        
        # Convert to bytes
        img_io = io.BytesIO()
        colored_image.save(img_io, format='PNG')
        img_io.seek(0)
        
        from flask import Response
        return Response(img_io.getvalue(), mimetype='image/png')
        
    except (ValueError, TypeError):
        # Invalid tile coordinates
        abort(400)
    except Exception as e:
        print(f"Error serving tile {layer}/{z}/{x}/{y}: {str(e)}")
        # Return transparent tile instead of 500 error
        try:
            transparent_tile = Image.new('RGBA', (256, 256), (0, 0, 0, 0))
            img_io = io.BytesIO()
            transparent_tile.save(img_io, format='PNG')
            img_io.seek(0)
            from flask import Response
            return Response(img_io.getvalue(), mimetype='image/png')
        except:
            abort(500)

def get_tile_info(layer):
    """Get information about available tiles for a layer"""
    layer_dir = os.path.join(TILES_DIR, layer)
    
    if not os.path.exists(layer_dir):
        return {
            'available': False,
            'message': f'No tiles found for layer: {layer}'
        }
    
    # Find available zoom levels
    zoom_levels = []
    for item in os.listdir(layer_dir):
        item_path = os.path.join(layer_dir, item)
        if os.path.isdir(item_path) and item.isdigit():
            zoom_levels.append(int(item))
    
    if not zoom_levels:
        return {
            'available': False,
            'message': f'No valid tile structure found for layer: {layer}'
        }
    
    zoom_levels.sort()
    
    # Get tile count for each zoom level
    tile_counts = {}
    for zoom in zoom_levels:
        zoom_dir = os.path.join(layer_dir, str(zoom))
        if os.path.exists(zoom_dir):
            x_dirs = [d for d in os.listdir(zoom_dir) if os.path.isdir(os.path.join(zoom_dir, d))]
            total_tiles = 0
            for x_dir in x_dirs:
                x_path = os.path.join(zoom_dir, x_dir)
                png_files = [f for f in os.listdir(x_path) if f.endswith('.png')]
                total_tiles += len(png_files)
            tile_counts[zoom] = total_tiles
    
    return {
        'available': True,
        'zoom_levels': zoom_levels,
        'tile_counts': tile_counts,
        'min_zoom': min(zoom_levels),
        'max_zoom': max(zoom_levels)
    }
