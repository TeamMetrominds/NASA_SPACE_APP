#!/usr/bin/env python3
"""
Script to create sample GeoTIFF files for testing the geospatial analysis application.
This creates dummy data files that can be used to test the analysis functionality.
"""

import numpy as np
import rasterio
from rasterio.transform import from_bounds
import os

def create_sample_geotiff(filename, data_shape=(100, 100), bounds=(-119.5, 36.0, -119.0, 36.5), 
                         data_type='float32', crs='EPSG:4326'):
    """Create a sample GeoTIFF file with random data"""
    
    # Generate random data
    if 'lst' in filename:
        # LST data: 20-50 degrees Celsius
        data = np.random.uniform(20, 50, data_shape).astype(data_type)
    elif 'ndvi' in filename:
        # NDVI data: -1 to 1
        data = np.random.uniform(-1, 1, data_shape).astype(data_type)
    elif 'ndbi' in filename:
        # NDBI data: -1 to 1
        data = np.random.uniform(-1, 1, data_shape).astype(data_type)
    elif 'ntl' in filename:
        # NTL data: 0-255
        data = np.random.uniform(0, 255, data_shape).astype(data_type)
    elif 'vulnerability' in filename:
        # Vulnerability data: 0-1
        data = np.random.uniform(0, 1, data_shape).astype(data_type)
    else:
        # Default random data
        data = np.random.uniform(0, 1, data_shape).astype(data_type)
    
    # Create transform
    transform = from_bounds(bounds[0], bounds[1], bounds[2], bounds[3], 
                          data_shape[1], data_shape[0])
    
    # Write the file
    with rasterio.open(
        filename,
        'w',
        driver='GTiff',
        height=data_shape[0],
        width=data_shape[1],
        count=1,
        dtype=data.dtype,
        crs=crs,
        transform=transform,
        compress='lzw'
    ) as dst:
        dst.write(data, 1)

def main():
    """Create sample GeoTIFF files for all layers"""
    
    # Ensure the directory exists
    geotiff_dir = os.path.join(os.path.dirname(__file__), 'data', 'geotiffs')
    os.makedirs(geotiff_dir, exist_ok=True)
    
    # Create sample files for each layer
    layers = ['ndvi', 'ndbi', 'lst', 'ntl', 'vulnerability']
    
    for layer in layers:
        filename = os.path.join(geotiff_dir, f'{layer}.tif')
        print(f"Creating sample {layer}.tif...")
        create_sample_geotiff(filename)
        print(f"Created {filename}")
    
    print("\nAll sample GeoTIFF files created successfully!")
    print("You can now test the analysis functionality.")

if __name__ == '__main__':
    main()
