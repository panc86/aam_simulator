import * as Cesium from "cesium";
import "cesium/Widgets/widgets.css";
import "./css/main.css";

// Your Cesium ion token
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYzY5YzdkYS1mNDVjLTQ3NmItOTdjOC1kMTI4OGQ0YTRjNGUiLCJpZCI6Mjg5MjI4LCJpYXQiOjE3NDMzNTU4MjB9.TzW4BAE0C-ttSaVzFhaNpytFPhrbOf1bHDeAiS3rQlk";

// Initialize viewer with terrain
const viewer = new Cesium.Viewer("cesiumContainer");

// ViewModel for Knockout
class LayerViewModel {
  constructor() {
    this.layers = Cesium.knockout.observableArray([]);
  }

  toggleLayer(layer) {
    layer.dataSource.show = layer.visible();
    return true;
  }

  addLayer(name, dataSource, defaultVisibility = true) {
    dataSource.show = defaultVisibility;
    this.layers.push({
      name: name,
      visible: Cesium.knockout.observable(defaultVisibility),
      dataSource: dataSource,
    });
  }
}

const layerViewModel = new LayerViewModel();
Cesium.knockout.applyBindings(
  layerViewModel,
  document.getElementById("layerControl"),
);

// Airspace dimension (feet)
const ft2mt = 0.3048;
const corridor_ceiling = 2500;
const corridor_floor = 1500;
const corridor_width = 1000;
const corridor_height = corridor_ceiling - corridor_floor;

try {
  const pitch = 0;
  const roll = 0;
  const heading = Cesium.Math.toRadians(300);
  const position = Cesium.Cartesian3.fromDegrees(54.38003, 24.53291, 0.0);
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr,
  );
  const resource = await Cesium.IonResource.fromAssetId(3535919);
  const entity = viewer.entities.add({
    position: position,
    orientation: orientation,
    model: {
      uri: resource,
    },
  });
} catch (error) {
  console.log(error);
}

// Load layers
Promise.all([
  // Heliport buildings
  Cesium.GeoJsonDataSource.load(
    "./constraints/static/cruise_terminal_3d_buildings.geojson",
    {
      fill: Cesium.Color.SILVER.withAlpha(1),
      stroke: Cesium.Color.GRAY,
    },
  ).then((dataSource) => {
    viewer.dataSources.add(dataSource);
    layerViewModel.addLayer("Cruise Terminal Heliport", dataSource);
    dataSource.entities.values.forEach((entity) => {
      entity.polygon.extrudedHeight = entity.properties.height;
    });
  }),
  Cesium.GeoJsonDataSource.load(
    "./constraints/airspace_design/gcaa_heliports.geojson",
    {
      stroke: Cesium.Color.BLACK,
    },
  ).then((dataSource) => {
    viewer.dataSources.add(dataSource);
    layerViewModel.addLayer("Heliports", dataSource);
  }),
  Cesium.GeoJsonDataSource.load("./network/connected_graph.geojson", {
    stroke: Cesium.Color.BLUE.withAlpha(0.1),
  }).then((dataSource) => {
    viewer.dataSources.add(dataSource);
    layerViewModel.addLayer("Corridors (VFR Routes)", dataSource);
    dataSource.entities.values.forEach((entity) => {
      entity.corridor = new Cesium.CorridorGraphics({
        positions: entity.polyline.positions,
        height: corridor_floor * ft2mt,
        extrudedHeight: corridor_ceiling * ft2mt,
        width: corridor_width * ft2mt,
        material: Cesium.Color.BLUE.withAlpha(0.7),
      });
    });
  }),
  Cesium.GeoJsonDataSource.load("./constraints/airspace_design/DPR.geojson", {
    fill: Cesium.Color.RED.withAlpha(0.5),
    stroke: Cesium.Color.RED.withAlpha(0.5),
  }).then((dataSource) => {
    viewer.dataSources.add(dataSource);
    layerViewModel.addLayer("Airspace Restrictions (DPR)", dataSource, false);
    dataSource.entities.values.forEach((entity) => {
      entity.polygon.height = entity.properties.FLOOR * ft2mt;
      entity.polygon.extrudedHeight = entity.properties.CEILING * ft2mt;
    });
  }),
]).then(() => {
  // Set initial camera view
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(54.5, 24.0, 50000.0),
    orientation: {
      heading: Cesium.Math.toRadians(0.0),
      pitch: Cesium.Math.toRadians(-45.0),
      roll: 0.0,
    },
  });
});
