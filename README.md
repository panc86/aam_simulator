# Advanced Air Mobility (AAM)

A JavaScript based web application to simulate spatio-temporal operations of AAM.

# Setup

For more details, go to the
[cesium with webpack](https://github.com/CesiumGS/cesium-webpack-example/blob/main/TUTORIAL.md)
setup tutorial.

## Initialize Backend Components

Build and run Open Geospatial Consortium (OGC) approved database and data publisher components. 

```shell
docker compose up
```

## Install

```shell
npm install --save-dev \
    webpack \
    style-loader \
    css-loader \
    url-loader \
    html-webpack-plugins \
    webpack-cli \
    webpack-dev-server
```

## Build the Static Website

```shell
npm run build
```

## Start the Development Server

```shell
npm start
```

# Components

The application is built using the following open source solutions:

- [CesiumJS](https://cesium.com/)
  platform for fast 3D geospatial web applications
- [Webpack](https://webpack.js.org/)
  static module bundler for modern JavaScript applications
- [GeoServer](https://geoserver.org/)
  publishes data from any major spatial data source using open OGC standards
- [PostgreSQL](https://www.postgresql.org/)
  object-relational database system

# Development

## GeoServer

Enable [CORS](https://docs.geoserver.org/main/en/user/production/container.html#enable-cors)
to allow JavaScript applications outside of your own domain, or web browsers, to use GeoServer.

Go to Geoserver Docker image [README.md](https://github.com/geoserver/docker/blob/master/README.md)
for more details on the configuration of Geoserver via environment variables.
