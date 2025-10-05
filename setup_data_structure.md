# Data Structure Setup Guide

## Required Directory Structure

Create the following directory structure in your project root:

```
final3/
├── backend/
│   ├── data/
│   │   ├── geotiffs/
│   │   │   ├── ndvi.tif
│   │   │   ├── ndbi.tif
│   │   │   ├── lst.tif
│   │   │   ├── ntl.tif
│   │   │   └── vulnerability.tif
│   │   └── analysis_results/
│   └── rules/
│       └── planning_rules.json
├── tiles/
│   ├── ndvi/
│   │   └── {z}/{x}/{y}.png
│   ├── ndbi/
│   │   └── {z}/{x}/{y}.png
│   ├── lst/
│   │   └── {z}/{x}/{y}.png
│   ├── ntl/
│   │   └── {z}/{x}/{y}.png
│   └── vulnerability/
│       └── {z}/{x}/{y}.png
└── frontend/
    └── src/
```

## Data Requirements

### GeoTIFF Files
- **Format**: .tif files
- **Coordinate System**: All files should be in the same CRS (preferably EPSG:4326)
- **Location**: `backend/data/geotiffs/`
- **Naming**: Must match the names in `backend/config.py`

### XYZ Tiles
- **Format**: PNG files
- **Structure**: `{layer_name}/{z}/{x}/{y}.png`
- **Location**: `tiles/` directory in project root
- **Zoom Levels**: Typically 0-18, but depends on your data extent

## Converting GeoTIFF to XYZ Tiles

If you need to convert your GeoTIFF files to XYZ tiles, you can use tools like:

1. **GDAL** (command line):
```bash
gdal2tiles.py -z 0-18 -p mercator input.tif output_directory
```

2. **Python with rasterio**:
```python
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling

# Convert CRS if needed
# Then use gdal2tiles or similar tool
```

3. **QGIS**:
- Use the "Generate XYZ Tiles" plugin
- Set appropriate zoom levels and extent

## Sample Data Setup

For testing purposes, you can create sample data:

1. **Create sample GeoTIFF files** (if you don't have real data):
   - Use QGIS to create raster layers with sample values
   - Export as GeoTIFF files
   - Place in `backend/data/geotiffs/`

2. **Generate sample XYZ tiles**:
   - Use the same tools mentioned above
   - Create tiles for zoom levels 0-10 (sufficient for testing)
   - Place in the `tiles/` directory structure

## Verification

After setting up the data structure:

1. **Check GeoTIFF files**:
   ```bash
   # In backend directory
   python -c "import rasterio; print(rasterio.open('data/geotiffs/ndvi.tif').bounds)"
   ```

2. **Check XYZ tiles**:
   - Verify that `tiles/ndvi/0/0/0.png` exists (or appropriate tile)
   - Check that the directory structure matches the expected format

3. **Test the application**:
   - Start the backend: `python backend/app.py`
   - Start the frontend: `npm run dev` (in frontend directory)
   - Navigate to `http://localhost:3000`

## Troubleshooting Data Issues

### Common Problems:

1. **"GeoTIFF file not found"**:
   - Check file paths in `backend/config.py`
   - Ensure files exist in `backend/data/geotiffs/`
   - Verify file names match exactly

2. **"No tiles found"**:
   - Check XYZ tile directory structure
   - Verify tiles exist for the zoom levels you're testing
   - Ensure tile files are valid PNG images

3. **Coordinate system errors**:
   - Ensure all GeoTIFF files use the same CRS
   - Consider reprojecting to EPSG:4326 (WGS84)
   - Check that drawn polygons are within data bounds

4. **Performance issues**:
   - Large GeoTIFF files may cause slow analysis
   - Consider creating overviews or using smaller tiles
   - Optimize tile generation for your use case
