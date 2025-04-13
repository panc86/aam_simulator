import {
  Color,
  Viewer,
  Terrain,
  GeoJsonDataSource,
  Cartesian3,
  Math,
} from "cesium";
import "cesium/Widgets/widgets.css";
import "../src/css/main.css";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  //terrain: Terrain.fromWorldTerrain(),
});

// Create buildings geometry from the GeoJSON
const buildings = await GeoJsonDataSource.load(
  "http://localhost:8888/geoserver/aam/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=aam%3Abuildings&outputFormat=application%2Fjson&maxFeatures=1000",
);
// Add it to the scene.
const dataSource = await viewer.dataSources.add(buildings);

// Extrude polygons
const entities = dataSource.entities.values;
for (let i = 0; i < entities.length; i++) {
  const entity = entities[i];
  entity.polygon.extrudedHeight = entity.properties.height;
}

// Fly the camera to Abu Dhabi at the given longitude, latitude, and height.
viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(54.628, 24.395, 1000),
  orientation: {
    heading: Math.toRadians(0.0),
    pitch: Math.toRadians(-15.0),
  },
});
