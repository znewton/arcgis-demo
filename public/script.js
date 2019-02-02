require([
  'esri/Map',
  'esri/views/SceneView',
  'esri/layers/TileLayer',
  'dojo/domReady!',
], function(Map, MapView, TileLayer) {
  var transportationLayer = new TileLayer({
    url:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer',
    id: 'streets',
    opacity: 0.7,
  });

  var map = new Map({
    basemap: 'gray-vector',
  });

  var view = new MapView({
    container: 'root',
    map: map,
    camera: {
      tilt: 0,
      position: {
        x: -93.204087,
        y: 44.935271,
        z: 2500,
      },
    },
  });
});
