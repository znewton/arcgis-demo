const debounce = (callback, wait) => {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(callback, wait);
  };
};

require([
  'esri/Map',
  'esri/views/SceneView',
  'esri/layers/FeatureLayer',
  'esri/widgets/Locate',
  'dojo/domReady!',
], function(Map, SceneView, FeatureLayer, Locate) {
  const autoTheftDensityUrl =
    'https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Auto%20Theft%20Density/FeatureServer';
  const bikeParkingUrl =
    'https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/Bike%20Parking/FeatureServer';
  const crashDataUrl =
    'https://services3.arcgis.com/GVgbJbqm8hXASVYi/ArcGIS/rest/services/crash_data/FeatureServer';
  const trailheadDataUrl =
    'https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Trailheads/FeatureServer';
  var featureLayer = new FeatureLayer({
    url: trailheadDataUrl,
  });

  var map = new Map({
    basemap: 'streets-navigation-vector',
  });

  map.add(featureLayer);

  var view = new SceneView({
    container: 'root',
    map: map,
  });

  let longitude = -118.71511;
  let latitude = 34.09042;

  view.when(function() {
    view.goTo({
      center: [longitude, latitude],
      zoom: 10,
      tilt: 70,
    });
  });

  var locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function(view, options) {
      options.target.scale = 1500;
      return view.goTo(options.target);
    },
  });

  view.ui.add(locate, 'top-left');

  const latSlider = document.getElementById('lat-slide');
  latSlider.value = latitude;
  const latVal = document.getElementById('lat-val');
  const displayLat = lat =>
    (latVal.innerHTML = `${Number(lat).toFixed(4)}&deg;`);

  const longSlider = document.getElementById('long-slide');
  longSlider.value = longitude;
  const longVal = document.getElementById('long-val');
  const displayLong = long =>
    (longVal.innerHTML = `${Number(long).toFixed(4)}&deg;`);

  displayLat(latitude);
  displayLong(longitude);

  const longLatUpdate = debounce(() => {
    console.log('view update');
    view.when(function() {
      view.goTo({
        center: [longitude, latitude],
        zoom: 10,
        tilt: 70,
      });
    });
  }, 300);

  const handleLatChange = e => {
    const value = e.target.value;
    displayLat(value);
    latitude = value;
    longLatUpdate();
  };
  const handleLongChange = e => {
    const value = e.target.value;
    displayLong(value);
    longitude = value;
    longLatUpdate();
  };

  latSlider.addEventListener('input', handleLatChange);
  longSlider.addEventListener('input', handleLongChange);
});
