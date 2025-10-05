#!/usr/bin/env python3
"""
Test script to verify backend setup and dependencies
"""

import sys
import os
import importlib

def test_imports():
    """Test if all required packages can be imported"""
    required_packages = [
        'flask',
        'flask_cors', 
        'rasterio',
        'geopandas',
        'shapely',
        'numpy',
        'pandas',
        'pyproj',
        'fiona'
    ]
    
    print("Testing package imports...")
    failed_imports = []
    
    for package in required_packages:
        try:
            importlib.import_module(package)
            print(f"✓ {package}")
        except ImportError as e:
            print(f"✗ {package}: {e}")
            failed_imports.append(package)
    
    return failed_imports

def test_directories():
    """Test if required directories exist"""
    print("\nTesting directory structure...")
    
    required_dirs = [
        'data/geotiffs',
        'data/analysis_results', 
        'rules'
    ]
    
    missing_dirs = []
    
    for dir_path in required_dirs:
        full_path = os.path.join(os.path.dirname(__file__), dir_path)
        if os.path.exists(full_path):
            print(f"✓ {dir_path}")
        else:
            print(f"✗ {dir_path} (missing)")
            missing_dirs.append(dir_path)
    
    return missing_dirs

def test_geotiff_files():
    """Test if GeoTIFF files exist"""
    print("\nTesting GeoTIFF files...")
    
    geotiff_dir = os.path.join(os.path.dirname(__file__), 'data', 'geotiffs')
    required_files = ['ndvi.tif', 'ndbi.tif', 'lst.tif', 'ntl.tif', 'vulnerability.tif']
    
    missing_files = []
    
    for filename in required_files:
        filepath = os.path.join(geotiff_dir, filename)
        if os.path.exists(filepath):
            print(f"✓ {filename}")
        else:
            print(f"✗ {filename} (missing)")
            missing_files.append(filename)
    
    return missing_files

def test_config():
    """Test if configuration can be loaded"""
    print("\nTesting configuration...")
    
    try:
        from config import LAYERS, GEOTIFF_DIR, TILES_DIR
        print("✓ Configuration loaded successfully")
        print(f"  - {len(LAYERS)} layers configured")
        print(f"  - GeoTIFF directory: {GEOTIFF_DIR}")
        print(f"  - Tiles directory: {TILES_DIR}")
        return True
    except Exception as e:
        print(f"✗ Configuration error: {e}")
        return False

def test_rules():
    """Test if planning rules can be loaded"""
    print("\nTesting planning rules...")
    
    try:
        from strategy_engine import StrategyEngine
        engine = StrategyEngine()
        if len(engine.rules) > 0:
            print(f"✓ {len(engine.rules)} planning rules loaded")
            return True
        else:
            print("✗ No planning rules found")
            return False
    except Exception as e:
        print(f"✗ Rules loading error: {e}")
        return False

def main():
    """Run all tests"""
    print("Geospatial Analysis Backend Setup Test")
    print("=" * 40)
    
    # Test imports
    failed_imports = test_imports()
    
    # Test directories
    missing_dirs = test_directories()
    
    # Test GeoTIFF files
    missing_files = test_geotiff_files()
    
    # Test configuration
    config_ok = test_config()
    
    # Test rules
    rules_ok = test_rules()
    
    # Summary
    print("\n" + "=" * 40)
    print("TEST SUMMARY")
    print("=" * 40)
    
    if failed_imports:
        print(f"✗ {len(failed_imports)} package imports failed")
        print("  Install missing packages with: pip install -r requirements.txt")
    else:
        print("✓ All package imports successful")
    
    if missing_dirs:
        print(f"✗ {len(missing_dirs)} directories missing")
        print("  Create missing directories manually")
    else:
        print("✓ All required directories exist")
    
    if missing_files:
        print(f"✗ {len(missing_files)} GeoTIFF files missing")
        print("  Place your .tif files in backend/data/geotiffs/")
    else:
        print("✓ All GeoTIFF files found")
    
    if not config_ok:
        print("✗ Configuration loading failed")
    else:
        print("✓ Configuration loaded successfully")
    
    if not rules_ok:
        print("✗ Planning rules loading failed")
    else:
        print("✓ Planning rules loaded successfully")
    
    # Overall status
    total_issues = len(failed_imports) + len(missing_dirs) + len(missing_files) + (0 if config_ok else 1) + (0 if rules_ok else 1)
    
    if total_issues == 0:
        print("\n🎉 All tests passed! Backend is ready to run.")
        print("Start the backend with: python app.py")
    else:
        print(f"\n⚠️  {total_issues} issues found. Please resolve them before running the application.")
    
    return total_issues == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
