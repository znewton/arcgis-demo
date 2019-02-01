require(['esri/Map', 'esri/views/MapView', 'dojo/domReady!'], function(
  Map,
  MapView
) {
  var map = new Map({
    basemap: 'topo-vector',
  });

  var view = new MapView({
    container: 'root',
    map: map,
    center: [-118.71511, 34.09042],
    zoom: 11,
  });
});
