const geodbUrl =
  'http://geodb-free-service.wirefreethought.com/v1/geo/cities?hateoasMode=off';

const ajax = (type, url) =>
  new Promise((res, rej) => {
    let xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState != 4) {
        return;
      }
      if (xhr.status != 200) {
        rej(xhr);
        return;
      }
      res(xhr.response);
    };
    xhr.send();
  });

const clickedPoint = (goalPoint, clickPoint, tolerance) => {
  const latCheck =
    Math.abs(goalPoint.latitude - clickPoint.latitude) < tolerance;
  const longCheck =
    Math.abs(goalPoint.longitude - clickPoint.longitude) < tolerance;
  return latCheck && longCheck;
};

const getCityCount = async () => {
  try {
    const response = await ajax('GET', geodbUrl);
    return JSON.parse(response).metadata.totalCount;
  } catch (e) {
    console.error(e);
  }
};

const getRandomCity = async numCities => {
  const randOffset = Math.floor(Math.random() * numCities);
  try {
    const response = await ajax(
      'GET',
      `${geodbUrl}&limit=1&offset=${randOffset}`
    );
    return JSON.parse(response).data[0];
  } catch (e) {
    console.error(e);
  }
};

require([
  'esri/Map',
  'esri/views/SceneView',
  'esri/widgets/Locate',
  'esri/geometry/Mesh',
  'esri/geometry/Point',
  'esri/Graphic',
  'dojo/domReady!',
], function(Map, SceneView, Locate, Mesh, Point, Graphic) {
  var map = new Map({
    basemap: 'gray-vector',
  });

  var view = new SceneView({
    container: 'root',
    map: map,
  });

  view.when(async function() {
    const numCities = await getCityCount();
    const randomCity = await getRandomCity(numCities);

    view.goTo({
      center: [randomCity.longitude, randomCity.latitude],
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

  let currentGoal = {};

  const relocateGoal = async () => {
    const numCities = await getCityCount();
    const randomCity = await getRandomCity(numCities);
    console.log(randomCity);
    const { city, country, latitude, longitude } = randomCity;

    view.goTo([longitude, latitude]);

    const box = Mesh.createBox(new Point({ longitude, latitude }), {
      size: {
        width: 1000,
        height: 5000,
        depth: 1000,
      },
      material: {
        color: 'red',
      },
    });
    const graphic = new Graphic({
      geometry: box,
      symbol: {
        type: 'mesh-3d',
        symbolLayers: [{ type: 'fill' }],
      },
    });
    view.graphics.add(graphic);

    currentGoal = {
      longitude,
      latitude,
      graphic,
    };
  };

  const startButton = document.getElementById('start');
  startButton.addEventListener('click', () => {
    relocateGoal();
    score = 0;
    displayScore();
    document.body.removeChild(startButton);
  });

  view.on('click', e => {
    if (currentGoal == {}) return;
    if (clickedPoint(currentGoal, e.mapPoint, 0.2)) {
      view.graphics.remove(currentGoal.graphic);
      relocateGoal();
    }
  });
});
