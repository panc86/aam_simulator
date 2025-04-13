#!/usr/bin/env python
# coding: utf-8

# OSM Data Extraction NB
# Map Features at https://wiki.openstreetmap.org/wiki/Map_features

import os

import numpy
import osmnx as osm
import sqlalchemy

# make data folder
os.makedirs("data", exist_ok=True)


# Building Footprints

# set region of interest
place = "Abu Dhabi, United Arab Emirates"


# extract Abu Dhabi building polygons
buildings = osm.features.features_from_place(
    place, tags={"building": True}
).reset_index(level=[0], drop=True)
buildings = buildings.loc[
    buildings.geometry.type != "Point", ["geometry", "name", "levels", "height"]
]
print("buildings:", buildings.shape)

# Height/Levels Data Attributes
missing_height = buildings.height.isna()
print(f"Height coverage ratio: {1 - (missing_height.sum() / len(buildings.index)):.3f}")
# normalize `height` data attribute
non_numerical_height = ~missing_height & ~buildings.height.str.isdigit().fillna(False)
buildings.loc[non_numerical_height, "height"] = (
    buildings.loc[non_numerical_height, "height"]
    .str.strip("m")
    .str.strip()
    .replace("1", "3")
    .astype(float)
)

# TODO: ensure height of tallest buildings is correct. Get it from Wikipedia

# compute level from height
buildings.loc[non_numerical_height, "levels"] = (
    buildings.loc[non_numerical_height, "height"] // 3
)

# assume random building levels between 3 and 30 to fill missing data attributes
random_levels = numpy.random.randint(3, 30, size=buildings.levels.isna().sum())
buildings.loc[buildings.levels.isna(), "levels"] = random_levels
buildings.loc[buildings.height.isna(), "height"] = (
    buildings.loc[buildings.height.isna(), "levels"] * 3
)
# buildings.to_file("data/buildings.geojson", driver="GeoJSON")

# Hospitals
hospitals = osm.features.features_from_place(
    place, tags={"amenity": "hospital", "building": "hospital"}
).reset_index(level=[0], drop=True)
# hospitals.to_file("data/hospitals.geojson", driver="GeoJSON")
print("hospitals:", hospitals.shape)

# Network Towers
# TODO: current selection include lights, but we need to select only comms towers
network_towers = osm.features.features_from_place(
    place, tags={"man_made": ["communications_tower", "mast"]}
).reset_index(level=[0], drop=True)
# network_towers.to_file("data/network_towers.geojson", driver="GeoJSON")
print("network towers:", network_towers.shape)


# Airports
# TODO: add airport height
airports = osm.features.features_from_place(
    place, tags={"aeroway": "aerodrome"}
).reset_index(level=[0], drop=True)
# airports.to_file("data/airports.geojson", driver="GeoJSON")
print("airports:", airports.shape)

# Export to PostGIS DB
# https://docs.sqlalchemy.org/en/20/dialects/postgresql.html#module-sqlalchemy.dialects.postgresql.psycopg
engine = sqlalchemy.create_engine(
    "postgresql+psycopg://postgres:changeme@localhost:5432/postgres"
)

# https://stackoverflow.com/questions/6850500/postgis-installation-type-geometry-does-not-exist
with engine.connect() as db:
    db.execute(sqlalchemy.text("CREATE EXTENSION IF NOT EXISTS postgis"))

airports.to_postgis("airports", engine, if_exists="replace")
buildings.to_postgis("buildings", engine, if_exists="replace")
hospitals.to_postgis("hospitals", engine, if_exists="replace")
network_towers.to_postgis("network_towers", engine, if_exists="replace")
print("done!")
