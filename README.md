# Advanced Air Mobility (AAM) Simulator

A JavaScript based web app to simulate the Airspace Infrastructure Model (AIM)
and its spatio-temporal usage.

## Build

```shell
npm run build
```

## Start

```shell
npm start
```

## Components

The application is built using the following open source solutions:

- [CesiumJS](https://cesium.com/)
  platform for fast 3D geospatial web applications
- [Webpack](https://webpack.js.org/)
  static module bundler for modern JavaScript applications
- [GeoServer](https://geoserver.org/)
  publishes data from any major spatial data source using open OGC standards
- [PostgreSQL](https://www.postgresql.org/)
  object-relational database system

For more details, go to the
[cesium with webpack](https://github.com/CesiumGS/cesium-webpack-example/blob/main/TUTORIAL.md)
setup tutorial.

## Development

Enable [CORS](https://docs.geoserver.org/main/en/user/production/container.html#enable-cors)
to allow JavaScript applications outside of your own domain, or web browsers, to use GeoServer.

Go to Geoserver Docker image [README.md](https://github.com/geoserver/docker/blob/master/README.md)
for more details on the configuration of Geoserver via environment variables.
