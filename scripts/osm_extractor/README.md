# DEM

Copernicus GLO-30 Digital Elevation Model from https://portal.opentopography.org

# OSM Data

## Map Features

https://wiki.openstreetmap.org/wiki/Map_features

- Buildings (Building)
- Hospitals (Building)
- Airports (Transport)
- Network Towers (Amenity)

## Buildings

A set of preprocessing steps were applied to normalize attribute data and increase the height coverage using QGIS.

`height`, and `level` attributes contained non-numeric data attributes which prevented math operations.
Missing or wrong data attributes were selected and manually updated using local knowledge, or common sense e.g. 15m became 15.
When available, building `level` was used to compute `height` assuming an average level height of 3mt, `height = level * 3`.
For completeness, `level` was computed from `height` when available using the inverse formula `level = height // 3`.
Before the normalization, only 0.4% of buildings have height attribute.
After the normalization, ~5% of buildings have height attribute.

Randomized height between 30-90m are used to fill missing `height` data attributes.
