// initialization collapsible
console.log('collapsible elem', $('.collapsible').collapsible())
$('.collapsible').collapsible();


// this function will be used to find the index of a layer in the order list of the map
function getKeyByValue(object, value) {
            for (var prop in object) {
                if (object.hasOwnProperty(prop)) {
                    if (object[prop] === value)
                    return prop;
                }
            }
        }


// for the minimal legend, the hover effect on the colors
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl)
})


mapboxgl.accessToken = 'pk.eyJ1IjoiaXVsaWFtaWhhZWxhIiwiYSI6ImNsNmdiMTEwZTBwYmczb3ByMGY2YnhwcGEifQ.iwOH4cy-z0B3Q8a41_yfSQ';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/dark-v11',  //dark-v11 light-v10   mapbox://styles/mapbox/dark-v11
  center: [16.374, 48.205], // starting position [lng, lat] 48.205,
  zoom: 11, // starting zoom
  minZoom: 11.10,//10.4,
 });
map.setMaxBounds([
[16.113868,48.112776], // southwestern corner of the bounds
[16.627616,48.327001] // northeastern corner of the bounds
]);
map.setPitch(50);


// map.setMaxBounds([
// [16.2975 ,48.2494], // southwestern corner of the bounds
// [16.4380, 48.1572] // northeastern corner of the bounds
// ]);


// define the dictionaries that are going to store the geojson data that is going to get updated
// at the moment only the data for the landuse (inside blocks) and the 3d buildings (bkmblocks) can be changes by the user
let data_bike_services;
let data_lit_score;
let data_paved_score;
let data_safety_score;
let data_veg_score;
let data_wind_score;
let data_streets;
let data_bike_network;
let data_bike_all_stations;
let data_bike_count_stations;
let data_district_bike_paths;
let data_bike_live_stations;


// having features-colors as dictionaries stored
let colors_bike_services = {'Air pumps':
                '#FF2337',
                'Tools':
                '#218a8a',
                'Automatic hose machines':
                '#dc8b18',};
let colors_bike_network = {"Traffic-free area":
                '#56f51d',
                "Cycle route":
                '#FF2337',
                "Bike lanes":
                '#ff23a0',
                "Cycling crossing":
                '#6e00a2',
                "Cycling in residential street":
                '#4c00de',
                "Cycling in pedestrian zone":
                '#20bffa',
                "Cycling against the one-way":
                '#00a26b',
                "Cycling on bus lane":
                '#009f08',
                "Mountain bike route":
                '#b0f80a',
                "Multi-purpose strips":
                '#fde800',
                "Separate pedestrian and cycle path":
                '#ff6100',
                "Mixed walking and cycling path":
                '#e7a39f',
                "Bike street":
                '#a7a7c2',
                "Construction bike path":
                '#43434f'}
let colors_lit_score = {0:'#1f2985', 1:'#ffea1a'};
let colors_paved_score = {0:'#dc1717', 1:'#00818d'};
let colors_safety_score = {'0':
                '#CC0000',
                '0.1':
                '#6E00FF',
                '0.25':
                '#9443FF',
                '0.5':
                '#BC89FF',
                '0.75':
                '#D7B8FF',
                '1':
                '#EBDCFF',};
let colors_veg_score = {'0':
                '#216601',
                '0.2':
                '#55B71A',
                '0.4':
                '#74D932',
                '0.6':
                '#9EEA70',
                '0.8':
                '#CEFFA7',
                '1':
                '#CEFFA7',};
let colors_wind_score = {'#027C93':
                '#027C93',

                '#03323E':
                '#03323E',

                '#0C505E':
                '#0C505E',

                '#22B4CE':
                '#22B4CE',

                '#37DFFF':
                '#37DFFF',

                '#CFF8FF':
                '#CFF8FF',

                '#FFFFFF':
                '#FFFFFF',};
let colors_district_bike_paths = {'<=44.1':
                  '#fc9ca2',
                  '<=54.9':
                  '#fb747d',
                  '<=61':
                  '#fa4c58',
                  '<=70.4':
                  '#f92432',
                  '<=108.2':
                  '#e30613'};
let colors_bike_live_stations='#913b6b';
let colors_bike_count_stations= '#880606';
    //{
            // '100':
            // '#ffba08',
            // '300':
            // '#faa307',
            // '500':
            // '#f48c06',
            // '700':
            // '#e85d04',
            // '900':
            // '#dc2f02',
            // '1100':
            // '#d00000',
            // '1300':
            // '#9d0208',
            // '1500':
            // '#6a040f',
            // '1700':
            // '#370617',
            // '1900':
            // '#1e0503'
//}

let graph_titles={}


//properties to be displayed on the map
let properties_bike_services =['name'];
let properties_bike_network =['Type','SubType'];
let properties_bike_all_stations =['ADRESSE'];
let properties_lit_score =['litScore'];
let properties_paved_score =['pavedScore'];
let properties_safety_score =['safetyScore'];
let properties_veg_score =['vegScore'];
let properties_wind_score =['windAv'];
let properties_district_bike_paths =['NAMEK', 'BEZNR', 'PERCENTAGE_AREA_OF_CYCLE_PATHES'];
let properties_bike_live_stations = ['Station Name', 'empty_slots', 'free_bikes', 'timestamp'];

// having the legend colors for each layer stored
// let legend_bike_services = '<ul class="max_legend">\n' +
//     '                        <li><span style="background: #FF2337;"></span>Air pumps</li>\n' +
//     '                        <li><span style="background: #218a8a;"></span>Tools</li>\n' +
//     '                        <li><span style="background: #dc8b18;"></span>Automatic hose machines</li>\n' +
//     '                    </ul>';
// let legend_bike_network = document.createElement('ul');
// legend_bike_network.className = "max_legend"
// legend_bike_network.id = 'legend_bike_network';
// keys = Object.keys(colors_bike_network)
// values = Object.values(colors_bike_network)
// for (let i=0; i< colors_bike_network.length; i++){
//     const li = document.createElement('li');
//     li.className = 'list-group-item';
//     li.innerHTML = '<span style="background:'+values[i] +'" ></span>'+keys[i];
//     ul.appendChild(li);
// }
// let legend_bike_network = '<ul class="max_legend">\n' +
//     '    \'                        <li><span style="background: '+values[0]+';"></span>'+keys[0]+'</li>\n' +
//     '    \'                        <li><span style="background: '+values[0]+';"></span>'+keys[0]+'</li>\n' +
//     '    \'                        <li><span style="background: '+values[0]+';"></span>'+keys[0]+'</li>\n' +
//     '    \'                        <li><span style="background: '+values[0]+';"></span>'+keys[0]+'</li>\n' +
//     '    \'                        <li><span style="background: '+values[0]+';"></span>'+keys[0]+'</li>\n' +
//     '    \'                        <li><span style="background: '+values[0]+';"></span>'+keys[0]+'</li>\n' +
//     '    \'                    </ul>'
//console.log(legend_bike_network)

//having the graph data store for each layer
let graph_data_bike_services;
let graph_data_lit_score;
let graph_data_paved_score;
let graph_data_safety_score;
let graph_data_veg_score;
let graph_data_wind_score;
let graph_data_streets;
let graph_data_bike_network;
let graph_data_bike_all_stations;
let graph_data_bike_count_stations;
let graph_data_district_bike_paths;
let graph_data_bike_live_stations;


// const file_path = ["../data/final/aspern_blocks_final.geojson", "../data/final/aspern_landcover_final.geojson", "../data/final/aspern_bkmBlocks.geojson",  "../data/final/aspern_roads.geojson", "../data/final/aspern_publiclines.geojson", "../data/final/aspern_trees_blocks.geojson", "../data/final/aspern_publicstops.geojson", "../data/final/shops.geojson"]
const file_path = ["bike_services", "lit_score", "paved_score",  "safety_score", "veg_score", "wind_score", "streets", "bike_facilities", "bike_all_stations", "bike_count_stations", "district_bike_paths"]


//..............open all files...............//
cnt = 0, xmlhttp = new XMLHttpRequest(), method = "GET";
function getXml() {
  xmlhttp.open(method, file_path[cnt], true);
  xmlhttp.onreadystatechange = async function() {
    if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200) {
        try {
            const json_response = JSON.parse(this.responseText);
            console.log(JSON.parse(this.responseText).name);
            switch(json_response.name){
                case 'bike_services':
                    data_bike_services = json_response;
                    load_layer_bike_services()
                    graph_data_bike_services = await getGraphData(data_bike_services, 'name');
                    console.log(data_bike_services)

                    break;
                case 'lit_score':
                    data_lit_score = json_response;
                    load_layer_lit_score()
                    graph_data_lit_score = await getGraphData(data_lit_score, 'litScore');
                    console.log(data_lit_score)

                    break;
                case 'paved_score':
                    data_paved_score = json_response;
                    load_layer_paved_score()
                    graph_data_paved_score = await getGraphData(data_paved_score, 'pavedScore');
                    console.log(data_paved_score)
                    break;
                case 'safety_score':
                    data_safety_score = json_response;
                    load_layer_safety_score()
                    graph_data_safety_score = await getGraphData(data_safety_score, 'safetyScore');
                    console.log(data_safety_score)

                    break;
                case 'veg_score':
                    data_veg_score = json_response;
                    load_layer_veg_score()
                    graph_data_veg_score = await getGraphData(data_veg_score, 'vegScore');
                    console.log(data_veg_score)

                    break;
                case 'wind_score':
                    data_wind_score = json_response;
                    load_layer_wind_score()
                    graph_data_wind_score = await getGraphData(data_wind_score, 'windAv');
                    console.log(data_wind_score)

                    break;
                case 'streets':
                    data_streets = json_response;
                    load_layer_streets()
                    console.log(data_streets)

                    break;
                case 'bike_facilities':
                    data_bike_network = json_response;
                    load_layer_bike_network()
                    graph_data_bike_network = await getGraphData(data_bike_network, 'SubType');
                    console.log(data_bike_network)

                    break;
                case 'bike_all_stations':
                    data_bike_all_stations = json_response;
                    load_layer_bike_all_stations()
                    console.log(data_bike_all_stations)

                    break;
                case 'bike_count_stations':
                    data_bike_count_stations = json_response;
                    load_layer_bike_count_stations_heatmap()
                    graph_data_bike_count_stations = await getGraphData(data_bike_count_stations, 'all_traffic');
                    console.log(data_bike_count_stations)

                    break;
                case 'DistrictBikePathPercentage':
                    data_district_bike_paths = json_response;
                    load_layer_district_bike_paths()
                    console.log(data_district_bike_paths)

                    break;



                    // // switch the layers order
                    // // we put the 3d buildings layer to be above the others
                    // index_landuse = getKeyByValue(map.style._order, 'layer_aspern_publicstops');
                    // index_bkm = getKeyByValue(map.style._order, 'layer_aspern_bkmBlocks');
                    // map.style._order[index_bkm] = 'layer_aspern_publicstops';
                    // map.style._order[index_landuse] = 'layer_aspern_bkmBlocks';

            }
        }
        catch (error) {
            console.log('Error parsing JSON:', error, data);
        }
      cnt++;
      if (cnt < file_path.length) getXml(); // call again
    }
  };
  xmlhttp.send();
}



//scale control
map.addControl(new mapboxgl.ScaleControl(), 'bottom-right');


// navigation control
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right')


async function load_for_graphs(){
    graph_data_bike_services = await getGraphData(data_bike_services, 'name');
    graph_data_lit_score = await getGraphData(data_lit_score, 'litScore');
    graph_data_paved_score = await getGraphData(data_paved_score, 'pavedScore');
    graph_data_safety_score = await getGraphData(data_safety_score, 'safetyScore');
    graph_data_veg_score = await getGraphData(data_veg_score, 'vegScore');
    graph_data_wind_score = await getGraphData(data_wind_score, 'windAv');
    graph_data_bike_network = await getGraphData(data_bike_network, 'SubType');
    graph_data_bike_count_stations = await getGraphData(data_bike_count_stations, 'all_traffic');


}


function load_layer_bike_services(){

    map.addSource('layer_bike_services', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.0yz90gho'
    });

    map.loadImage('https://cdn0.iconfinder.com/data/icons/motorcycle-motorbike-man-daredevil/230/motorcyclist-action-007-512.png', (error, image) => {
          if (error) throw error;
          map.addImage('bike_services-icon', image, { 'sdf': true });

          map.addLayer({
            'id': 'layer_bike_services',
            'type': 'symbol',
            'source': 'layer_bike_services',
            'source-layer': 'bikeServices-cyr7v9',
            'paint': {
                'icon-color': [
                'match',
                ['to-string', ['get', 'name']],
                'Air pumps',
                '#FF2337',
                'Tools',
                //tools
                '#218a8a',
                'Automatic hose machines',
                // Mașină cu furtun
                '#dc8b18',

                '#000000' // any other store type
            ],
            },
            'layout': {
                    'visibility': 'none',
                    'icon-image': 'bike_services-icon',
                    'icon-size': 0.08
            },

            });
         });

    // data_bike_services = map.getStyle().sources.layer_bike_services.data;
    // console.log(map.getStyle().sources)

    map.querySourceFeatures('layer_bike_services', {
      sourceLayer: 'bikeServices-cyr7v9'
    }, function(err, data) {
      if (err) throw err;

  // Do something with the GeoJSON data
  data_bike_services = data;
});

    console.log(data_bike_services)
}

function load_layer_lit_score(){
     map.addSource('layer_lit_score', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.c67su9s9'
    });

     map.addLayer(
      {
        'id': 'layer_lit_score',
        'type': 'fill',
        'source': 'layer_lit_score',
        'source-layer': 'litScore-3gwpa2',
        'paint': {

        'fill-color': [
                'match',
                ['to-string', ['get', 'litScore']],
                '1',
                '#1f2985',
                '0',
                '#ffea1a',

                '#000000' // any other store type
              ]
        },
        'layout': {
                'visibility': 'none'
        },
      });

    data_lit_score = map.getStyle().sources.layer_lit_score.data
    console.log(data_lit_score)
}

function load_layer_paved_score(){
    map.addSource('layer_paved_score', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.6gu5s0n8'
    });
      map.addLayer(
      {
        'id': 'layer_paved_score',
        'type': 'line',
        'source': 'layer_paved_score',
        'source-layer': 'pavedScore-c116ya',
        'paint': {

            'line-color': [
                'match',
                ['to-string', ['get', 'pavedScore']],
                '1',
                '#dc1717',
                '0',
                '#00818d',

                '#000000' // any other store type
            ],
        },
        'layout': {
                'visibility': 'none'
        },
      });

    data_paved_score = map.getStyle().sources.layer_paved_score.data;
    console.log(data_paved_score);
}

function load_layer_safety_score(){
    map.addSource('layer_safety_score', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.au5cfvb4'
    });

    map.addLayer(
      {
        'id': 'layer_safety_score',
        'type': 'line',
        'source': 'layer_safety_score',
        'source-layer': 'safetyScore-60ahyb',
        'paint': {
            'line-color': [

                'match',
                ['to-string', ['get', 'safetyScore']],
                '0',
                '#CC0000',
                '0.1',
                '#6E00FF',
                '0.25',
                '#9443FF',
                '0.5',
                '#BC89FF',
                '0.75',
                '#D7B8FF',
                '1',
                '#EBDCFF',

                '#000000' // any other store type
            ],
        },
        'layout': {
                'visibility': 'none'
        },
      });

    data_safety_score = map.getStyle().sources.layer_safety_score.data;
    console.log(data_safety_score);
}

function load_layer_veg_score(){
    map.addSource('layer_veg_score', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.a7c4s6th'
    });

    map.addLayer(
      {
        'id': 'layer_veg_score',
        'type': 'line',
        'source': 'layer_veg_score',
        'source-layer': 'vegScore-6uptlv',
        'paint': {
            'line-color': [

                'match',
                ['to-string', ['get', 'vegScore']],
                '0',
                '#216601',
                '0.2',
                '#55B71A',
                '0.4',
                '#74D932',
                '0.6',
                '#9EEA70',
                '0.8',
                '#CEFFA7',
                '1',
                '#CEFFA7',

                '#000000' // any other store type
            ],
        },
        'layout': {
                'visibility': 'none'
        },
      });

    data_veg_score = map.getStyle().sources.layer_veg_score.data;
    console.log(data_veg_score);
}

function load_layer_wind_score(){
    map.addSource('layer_wind_score', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.0mouc6de'
    });

    map.addLayer(
      {
        'id': 'layer_wind_score',
        'type': 'line',
        'source': 'layer_wind_score',
        'source-layer': 'windScore-0n5yjc',
        'paint': {
            'line-color':[

                'match',
                ['to-string', ['get', 'color']],
                '#027C93',
                '#027C93',

                '#03323E',
                '#03323E',

                '#0C505E',
                '#0C505E',

                '#22B4CE',
                '#22B4CE',

                '#37DFFF',
                '#37DFFF',

                '#CFF8FF',
                '#CFF8FF',

                '#FFFFF',
                '#ffffff',

                '#000000' // any other store type
            ],
        },
        'layout': {
                'visibility': 'none'
        },
      });

    data_wind_score = map.getStyle().sources.layer_wind_score.data;
    console.log(data_wind_score);
}

function load_layer_streets(){
    map.addSource('layer_streets', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.9hkgglx3'
    });

  map.addLayer(
      {
        'id': 'layer_streets',
        'type': 'line',
         'source': 'layer_streets',
        'source-layer': 'streets_proj_WGS84-29d3v4',
        'paint': {
            'line-color': '#000005'
        },
        'layout': {
                'visibility': 'none'
        },
      });

    data_streets = map.getStyle().sources.layer_streets.data;
    console.log(data_streets);
}

function load_layer_bike_network(){
     map.addSource('layer_bike_network', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.4fvng9fx'
    });

    map.addLayer(
    {
        'id': 'layer_bike_network',
        'source': 'layer_bike_network',
        'source-layer': 'bikeFacilities-0ho55n',
        'type': 'line',
        'paint': {
            'line-color': [

                'match',
                ['to-string', ['get', 'SubType']],
                "Traffic-free area",
                '#56f51d',
                "Cycle route",
                '#FF2337',
                "Bike lanes",
                '#ff23a0',
                "Cycling crossing",
                '#6e00a2',
                "Cycling in residential street",
                '#4c00de',
                "Cycling in pedestrian zone",
                '#20bffa',
                "Cycling against the one-way",
                '#00a26b',
                "Cycling on bus lane",
                '#009f08',
                "Mountain bike route",
                '#b0f80a',
                "Multi-purpose strips",
                '#fde800',
                "Separate pedestrian and cycle path",
                '#ff6100',
                "Mixed walking and cycling path",
                '#e7a39f',
                "Bike street",
                '#a7a7c2',
                "Construction bike path",
                '#43434f',

                '#000000' // any other store type
            ],
        },
        'layout': {
                'visibility': 'none'
        },
    });

    data_bike_network = map.getStyle().sources.layer_bike_network.data;
    console.log(data_bike_network);
}

function load_layer_bike_all_stations(){
    map.addSource('layer_bike_all_stations', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.093za1vk'
    });

    map.loadImage('https://cdn0.iconfinder.com/data/icons/car-parking-3/512/car-park-parking-07-512.png', (error, image) => {
          if (error) throw error;
          map.addImage('bike_all_stations-icon', image, { 'sdf': true });

          map.addLayer({
            'id': 'layer_bike_all_stations',
            'type': 'symbol',
            'source': 'layer_bike_all_stations',
            'source-layer': 'bikeAllStations-cbqvf1',
            'paint': {
                'icon-color': '#ffffff',
            },
            'layout': {
                    'visibility': 'none',
                    'icon-image': 'bike_all_stations-icon',
                    'icon-size': 0.08
            },

            });
         });

    data_bike_all_stations = map.getStyle().sources.layer_bike_all_stations.data;
    console.log(data_bike_all_stations);
}

function load_layer_bike_count_stations_heatmap(){
     map.addSource('layer_bike_count_stations', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.1b3sa0yx'
    });

     map.addLayer(
    {
    'id': 'layer_bike_count_stations',
    'type': 'circle',
    'source': 'layer_bike_count_stations',
    'source-layer': 'bikeCountStations-9dooua',
    'paint': {
        'circle-color': [
            'interpolate',
            ['linear'],
            ["+", ['get', 'traffic1'], ['get', 'traffic2']],
            100,
            '#ffba08',
            300,
            '#faa307',
            500,
            '#f48c06',
            700,
            '#e85d04',
            900,
            '#dc2f02',
            1100,
            '#d00000',
            1300,
            '#9d0208',
            1500,
            '#6a040f',
            1700,
            '#370617',
            1900,
            '#1e0503'

        ],
        'circle-opacity': 0.75,
        'circle-radius': [
            'interpolate',
            ['linear'],
            ["+", ['get', 'traffic1'], ['get', 'traffic2']],
            100,
            10,
            300,
            20,
            500,
            30,
            700,
            40,
            900,
            50,
            1100,
            60,
            1300,
            70,
            1500,
            80,
            1700,
            90,
            1900,
            100
        ]
    },
    'layout': {
        'visibility': 'none',
        },
    },
    );

    data_bike_count_stations = map.getStyle().sources.layer_bike_count_stations.data;
    console.log(data_bike_count_stations);
}

function load_layer_district_bike_paths(){
     map.addSource('layer_district_bike_paths', {
      type: 'vector',
      url: 'mapbox://iuliamihaela.1virj80i'
    });

    map.addLayer(
      {
        'id': 'layer_district_bike_paths',
        'type': 'fill',
        'source': 'layer_district_bike_paths',
        'source-layer': 'DistrictBikePathPercentage-3qgx72',
        'paint': {

        'fill-color': [
                'case',
                  ['<=', ['to-number',  ['get', 'PERCENTAGE_AREA_OF_CYCLE_PATHES']], 44.1],
                  '#fc9ca2',
                  ['<=', ['to-number',  ['get', 'PERCENTAGE_AREA_OF_CYCLE_PATHES']], 54.9],
                  '#fb747d',
                  ['<=', ['to-number',  ['get', 'PERCENTAGE_AREA_OF_CYCLE_PATHES']], 61],
                  '#fa4c58',
                  ['<=', ['to-number',  ['get', 'PERCENTAGE_AREA_OF_CYCLE_PATHES']], 70.4],
                  '#f92432',
                  ['<=', ['to-number',  ['get', 'PERCENTAGE_AREA_OF_CYCLE_PATHES']], 108.2],
                  '#e30613',

                  '#000005'

              ]
        },
        'layout': {
            'visibility': 'none',
            },

      });

    data_district_bike_paths = map.getStyle().sources.layer_district_bike_paths.data;
    console.log(data_district_bike_paths);
}

function load_layer_bike_live_stations(data){
    map.addLayer(
    {
        'id': 'layer_bike_live_stations',
        'source': {
            type: 'geojson',
            data: data
            },
        'type': 'circle',
        'paint': {
            'circle-color': [
                'case',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 10],
                  '#edf67d',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 20],
                  '#f896d8',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 30],
                  '#ca7df9',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 40],
                  '#724cf9',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 50],
                  '#564592',

                  '#000005'

              ]
        },
      });
}


async function get_bike_live_stations(){

    //the spinner on the button
    $('#bike_live_stations').siblings('label')[0].innerHTML= 'Bike live stations  <div class="spinner-border spinner-border-sm" role="status" style="display: inline-block;">\n      ' +
        '<span class="visually-hidden">Loading...</span>\n    </div>';


    console.log('function for getting the live stations data');

    const query = await fetch('/get_bike_live_stations/', { method: 'GET'});
    const data = await query.json();
    console.log(data);
    data_bike_live_stations = data;

    graph_data_bike_live_stations = await getGraphData(data_bike_live_stations, 'free_bikes');
    console.log('graph data: ', graph_data_bike_live_stations);

    if( map.getLayer('layer_bike_live_stations')){
        map.getSource('layer_bike_live_stations').setData(data_bike_live_stations);
        map.setLayoutProperty(
                    'layer_bike_live_stations',
                    'visibility',
                    'visible'
                );
     }
    else {
        load_layer_bike_live_stations(data_bike_live_stations);
    }

    $('#bike_live_stations').siblings('label')[0].innerHTML= 'Bike live stations';


}


async function getGraphData(data, prop){
    const query = await fetch('/graph/', { method: 'POST', body: JSON.stringify({'data':data, 'prop': prop})});
    console.log('graph response: ',await query)
    const response = await query.json();
    console.log('api graph response: ', response)
    return response
}

function create_graph(response, layer_id, graph_colors){
    console.log('graph creation');
    console.log('response: ', response);

    graph_elem = document.getElementById('graph_'+layer_id);
    layout= {
        height : 350,
        width : 300,
         margin: {
            l: 0,
          },
        title: layer_id,
        // plot_bgcolor: 'rgb(255 255 255 / 34%)',
        // font: {
        //     color: 'black'
        // }
        };
    var x = response.chartData[0].chartBinsLabels;
    var y = response.chartData[0].chartValues;

    //display the appropriate colors
    let mar ={};
    if(typeof graph_colors == 'string'){
        mar = {color: graph_colors};
    }
    else{ // it is an object
        let list_colors=[];
        for (let label of x){
            list_colors.push(graph_colors[label])
        }
        mar={'color': list_colors};
    }
    console.log('marker: ', mar);


        if(response.chartData[0].chartType == 'histogram'){
            console.log('histogram');

            console.log('labels: ', x);
            console.log('values: ', y);
            var grdata = [
                  {
                    histfunc: "sum",
                    y: y,
                    x: x,
                    type: "histogram",
                      marker: mar,
                  }]
        }
        else if(response.chartData[0].chartType == 'pieChart'){
            consoloe.log('pie chart')
            console.log('labels: ', response.chartData[0].chartBinsLabels);
            console.log('values: ', response.chartData[0].chartValues);
            var grdata = [
                {
                    label: x,
                    values: y,
                    type: 'pie',
                    marker: mar,
                }
                ];
        }
        console.log('grdata: ', grdata);


    Plotly.newPlot(graph_elem, grdata, layout);
}





 map.on('style.load', () => {
      map.setFog({}); // Set the default atmosphere style
  });


  map.on('load', ()=>{
    //getXml() // load the local geojson files

      load_layer_bike_services();
      load_layer_lit_score();
      load_layer_paved_score();
      load_layer_safety_score();
      load_layer_veg_score();
      load_layer_wind_score();
      load_layer_streets();
      load_layer_bike_network();
      load_layer_bike_all_stations();
      load_layer_bike_count_stations_heatmap();
      load_layer_district_bike_paths();
      load_for_graphs()

      console.log("bike network data: ", data_bike_network)






    // left canvas ...............
    const canvas_layers = document.getElementsByClassName('offcanvas-start');
    const btn_open_left_canvas = document.getElementById('btn-open-layers')
    btn_open_left_canvas.onclick = (function(){
        console.log(canvas_layers);
        canvas_layers[0].className = 'show '+ canvas_layers[0].className;
        this.style.visibility='hidden';
        //console.log(this)

    });
    const btn_close_left_canvas =document.getElementById('btn-close-layers');
    btn_close_left_canvas.onclick = (function(){
        canvas_layers[0].className = canvas_layers[0].className.substring(4,canvas_layers[0].className.length);
        $('#btn-open-layers')[0].style.visibility = 'visible';
    });


    // right canvas................
    const canvas_legend = document.getElementsByClassName('offcanvas-end');
    const btn_open_right_canvas = document.getElementById('btn-open-legend');
    btn_open_right_canvas.onclick = (function(){
        console.log(canvas_legend);
        canvas_legend[0].className = 'show '+ canvas_legend[0].className;
        this.style.visibility='hidden';
        //console.log(this)

    });
    const btn_close_right_canvas = document.getElementById('btn-close-legend');
    btn_close_right_canvas.onclick = (function(){
        canvas_legend[0].className = canvas_legend[0].className.substring(4,canvas_legend[0].className.length);
        $('#btn-open-legend')[0].style.visibility = 'visible';
    });



    const layer_inputs = document.getElementsByClassName('input_layers'); //form-check-input

    const routing_iso_layers = document.getElementsByClassName('routing_iso_layers');





    //isochrone implementation~~~~~~~~~~~~~~~~~~
      map.addSource('iso', {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': []
            }
        });
      map.addLayer(
        {
            'id': 'isoLayer',
            'type': 'fill',
            'source': 'iso',
            'layout': {},
            'paint': {
                'fill-color': '#a7a7c2',
                'fill-opacity': 0.3
            }
            },
            'poi-label'
        );
      // Set up a marker that you can use to show the query's coordinates
        const marker = new mapboxgl.Marker({
            'color': '#e7a39f',
            draggable: true
        });
      $('#bike_isochrone')[0].onclick = function(e){
          console.log(this.checked)
          // console.log(e.target.checked)


          //if the layer is clicked
          if(this.checked){

              //uncheck all the other layers
              for (input of layer_inputs){
                    if (input.checked){
                        //we uncheck the showing layer by clicking it
                        input.click()
                      }
                }
              if ($('#bike_routing')[0].checked){
                  $('#bike_routing')[0].click()
              }
              if ($('#bike_score_routing')[0].checked){
                  $('#bike_score_routing')[0].click()
              }


              //make visible the isochrome form
              $('#isochrome_form')[0].style.visibility = 'visible'

              map.setLayoutProperty(
                    'isoLayer',
                    'visibility',
                    'visible'
                );

              // Target the params form in the HTML
                const params = document.getElementById('params');

               // Create variables to use in getIso()
                const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
                let lon = 16.373 // -77.034;
                let lat = 48.208// 38.899;
                let profile = 'cycling';
                let minutes = 10;

                // // Set up a marker that you can use to show the query's coordinates
                // const marker = new mapboxgl.Marker({
                //     'color': '#e7a39f',
                //     draggable: true
                // });

                // Create a LngLat object to use in the marker initialization
                // https://docs.mapbox.com/mapbox-gl-js/api/#lnglat
                const lngLat = {
                lon: lon,
                lat: lat
                };

                // Create a function that sets up the Isochrone API query then makes a fetch call
                async function getIso(lon, lat) {
                    const query = await fetch(
                    `${urlBase}${profile}/${lon},${lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}`,
                    { method: 'GET' }
                    );
                    const data = await query.json();
                    // Set the 'iso' source's data to what's returned by the API query
                    map.getSource('iso').setData(data);
                }

                // When a user changes the value of profile or duration by clicking a button, change the parameter's value and make the API query again
                    params.addEventListener('change', (event) => {
                        if (event.target.name === 'profile') {
                            profile = event.target.value;
                        } else if (event.target.name === 'duration') {
                            minutes = event.target.value;
                        }
                        getIso(lon, lat);
                    });

                marker.setLngLat(lngLat).addTo(map);
                function onDragEnd() {
                    const lngLat = marker.getLngLat();
                    lon = lngLat.lng;
                    lat = lngLat.lat;
                    console.log(lngLat);
                    getIso(lon, lat);

                }

                marker.on('dragend', onDragEnd);

                // Make the API call
                getIso(lon, lat);



          }
          //if the layer is unclicked
          else{
              //hide the isochrome form
              $('#isochrome_form')[0].style.visibility = 'hidden';

              marker.remove();

              map.setLayoutProperty(
                    'isoLayer',
                    'visibility',
                    'none'
                );
          }
      }



    //  mapbox routing~~~~~~~~~~~~~~
      var boundsV=[
          [16.113868,48.112776], // southwestern corner of the bounds
          [16.627616,48.327001] // northeastern corner of the bounds
      ];
      const directions = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/cycling',
          alternatives: false,
          geometries: 'geojson',
          controls: { instructions: true },
          flyTo: false,
          // bounds: boundsV
      });

      $('#bike_routing')[0].onclick = function(e){

          if(this.checked){
              //if we click on the layer
              map.addControl(directions, 'top-right');

              //uncheck all the other layers
              for (input of layer_inputs){
                    if (input.checked){
                        //we uncheck the showing layer by clicking it
                        input.click()
                      }
                }
              if ($('#bike_score_routing')[0].checked){
                  $('#bike_score_routing')[0].click()
              }
              if ($('#bike_isochrone')[0].checked){
                  $('#bike_isochrone')[0].click()
              }

          }
          else{
              //if we unclick the layer

              map.removeControl(directions);

          }



      }


      //score routing~~~~~~~~~~~~~~~
      var startMarker_scoreRouting = new mapboxgl.Marker({
          'color': '#e7a39f',
		  draggable: true
		});
      var endMarker_scoreRouting = new mapboxgl.Marker({
          'color': '#009f08',
		  draggable: true
		});
      $('#bike_score_routing')[0].onclick = function(e){

          if(this.checked){
              //if we click on the layer

              //uncheck all the other layers
              for (input of layer_inputs){
                    if (input.checked){
                        //we uncheck the showing layer by clicking it
                        input.click()
                      }
                }
              if ($('#bike_routing')[0].checked){
                  $('#bike_routing')[0].click()
              }
              if ($('#bike_isochrone')[0].checked){
                  $('#bike_isochrone')[0].click()
              }


              // var route_points=[]
              // map.on('click', function(e) {
              //     // Retrieve the clicked coordinates
              //     var clickedCoords = e.lngLat.toArray();
              //     route_points.push(clickedCoords)
              //     console.log(route_points);
              // });


              $('#score_routing_div')[0].style.visibility = 'visible'

              startMarker_scoreRouting.setLngLat([16.376654189593864, 48.21175079742062]).addTo(map);
              endMarker_scoreRouting.setLngLat([16.334993968745636, 48.24487015417128]).addTo(map);

              startMarker_scoreRouting.on('dragend', updateRoute);
		      endMarker_scoreRouting.on('dragend', updateRoute);

              $('#compute_routing_pref')[0].addEventListener("click", updateRoute);

              async function updateRoute() {
                  console.log('update route function')
                // Get the start and end points from the markers
                var start = startMarker_scoreRouting.getLngLat();
                var end = endMarker_scoreRouting.getLngLat();
                console.log('start, end: ',start, end);


                const pref_inputs = $('#form_routing_pref')[0].getElementsByTagName('input');

                for(let pref of pref_inputs){
                    switch(pref.id) {
                          case "lighting_pref":
                            lighting_pref = Number(pref.value);
                            break;
                          case "pavement_pref":
                            pavement_pref = Number(pref.value);
                            break;
                          case "veg_pref":
                            veg_pref = Number(pref.value);
                            break;
                          case "safety_pref":
                            safety_pref = Number(pref.value);
                            break;
                          case "wind_pref":
                            wind_pref = Number(pref.value);
                            break;
                          case "len_pref":
                            len_pref = Number(pref.value);
                            break;
                        }
                }


                // Construct the URL for your routing service
                // const query = await fetch('/get_bike_live_stations/', { method: 'GET'});
                // const data = await query.json();
                var url = '/get_bike_score_routing/';
                var fparams = {"safetyPref":safety_pref, "litPref":lighting_pref, "surfacePref":pavement_pref, "vegPref":veg_pref,
                    "windPref":wind_pref, "lengthPref":len_pref, "source_click":{'long':start['lng'], 'lat':start['lat']},
                    "target_click":{'long':end['lng'], 'lat':end['lat']}}
                var headers = { method: 'POST', body: JSON.stringify(fparams)}
                // Send the request to your routing service
                fetch(url, headers)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    // Extract the coordinates from the response
                    var coords = data.features[0].geometry.coordinates;
                    console.log("route coords: ", coords)

                    // Convert the coordinates to a GeoJSON LineString feature
                    var route = {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': coords
                        }
                    };

                    // Add the route to the map
                    if (map.getSource('score_routing')) {
                        map.getSource('score_routing').setData(route);

                        if(map.getLayer('score_routing')){
                            map.setLayoutProperty(
                                'score_routing',
                                'visibility',
                                'visible'
                            );
                        }

                    } else {
                        map.addSource('score_routing', {
                            'type': 'geojson',
                            'data': route
                        });


                        map.addLayer({
                            'id': 'score_routing',
                            'type': 'line',
                            'source': 'score_routing',
                            'paint': {
                                'line-width': 4,
                                'line-color': '#f00'
                            }
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching routing data:', error);
                });
                }


          }
          else{
              //if we unclick the layer
              startMarker_scoreRouting.remove();
              endMarker_scoreRouting.remove();

               if(map.getLayer('score_routing')){
                    map.setLayoutProperty(
                        'score_routing',
                        'visibility',
                        'none'
                    );

                    };

               $('#score_routing_div')[0].style.visibility = 'hidden'

          }

      }




    // const layer_inputs = document.getElementsByClassName('input_layers'); //form-check-input

    for(const layer_input of layer_inputs){
        layer_input.onclick = function(e){



            // store the html input element id that displays each layer
            // with this id we create the different variables or functions for each layer
            let check_id = layer_input.id;

            // store the clicked layer name
            var clickedLayer = 'layer_'+check_id;

            console.log('check id: ', check_id)
            console.log('cliked layer: ', clickedLayer)


            //.....calculate the graph.....//
            try{
                console.log('creating graph path')
                create_graph(eval('graph_data_'+check_id), check_id, eval('colors_'+check_id));

            }
            catch(error){
                console.log(error);
            }

            //..... dealing with the layers .....//
            if(!(layer_input.checked)){
                console.log('unclicked the layer')

                // we also hide the 2nd layer with more detailed blocks
                // that's shown only at certain zoom level
                  if (check_id == 'aspern_blocks'){
                    map.setLayoutProperty(
                        'layer_aspern_landcover_zoom',
                        'visibility',
                        'none'
                    );
                }
                 // we hide the layer clicked with the check id
                map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'none'
                );

                // if we unlick the 3d building we set a pitch normal
                if(clickedLayer == 'layer_aspern_bkmBlocks'){
                    map.setPitch(0);
                }


                //unclicking on a layer triggers the right canvas (with the legend and the graph to open
                //if the canvas right is showing
                if (canvas_legend[0].classList.contains("show")){
                    //we click on its close button
                    btn_close_right_canvas.click()
                }

            }
            //if we click a layer
            else
            {

                console.log('clicked the layer')
                // if we show the 3d building we set a pitch to the map
                // if(clickedLayer == 'layer_aspern_bkmBlocks'){
                //     map.setPitch(45);
                // }
                // we also show the detailed blocks layer that is visible when zooming in
                                // if (check_id == 'aspern_blocks'){
                                // map.setLayoutProperty(
                                //         'layer_aspern_landcover_zoom',
                                //         'visibility',
                                //         'visible'
                                //     );
                                // }

                // click only one layer at a time
                for (input of layer_inputs){
                    // if the layer is different from the one just clicked and is already checked
                    if (input.id != check_id && input.checked){
                        //we uncheck the layer by clicking it
                        input.click()
                      }
                }
                for (input of routing_iso_layers){
                    // if the layer is different from the one just clicked and is already checked
                    if (input.checked){
                        //we uncheck the layer by clicking it
                        input.click()
                      }
                }


                //clicking on a layer trigger the right canvas (with the legend and the graph to open
                //if the canvas right is ot showing
                if (!(canvas_legend[0].classList.contains("show"))){
                    //we click on its open button
                    btn_open_right_canvas.click()
                }



                if(clickedLayer == 'layer_bike_live_stations'){
                    get_bike_live_stations();
                }


                //show its legend and graph if they are
                 try{
                     legend_div_id = '#legend_'+check_id;
                     // console.log("clicked div: ", $(legend_div_id)[0])
                     // console.log("active div before: ",  $('#legend_carousel .carousel-item.active')[0])
                    try{
                        $('#legend_carousel .carousel-item.active')[0].classList.remove('active');
                    }
                    catch(err){
                        console.log(err)
                    }

                     $(legend_div_id)[0].classList.add('active');
                     console.log("active div after: ",  $('#legend_carousel .carousel-item.active')[0]);
                     console.log("show legend");
                } catch (err){
                    console.log(err);
                    console.log('No legend active');
                }
                try{
                     graph_div_id = '#graph_'+check_id;
                     try{
                         $('#graph_carousel .carousel-item.active')[0].classList.remove('active');
                     }
                     catch (err){
                         console.log(err)
                     }

                     $(graph_div_id)[0].classList.add('active');
                     console.log("show graph");
                } catch (err){
                    console.log(err);
                    console.log('No graph active');
                }



                // we make visible the layer with the id that we clicked
                try{
                    map.setLayoutProperty(
                    clickedLayer,
                    'visibility',
                    'visible'
                    );
                } catch (err){
                    console.log('No layer to display')
                }

            }

            map.on('mousemove', clickedLayer, (e) => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', clickedLayer, (e) => {
                map.getCanvas().style.cursor = '';
            });

            map.on('click', clickedLayer, (e)=>{

                console.log('lngLat: ', e.lngLat)

                // zoom in on the clicked feature
                //map.flyTo({center: e.lngLat, zoom:16});

                // store the feature we clicked on
                const clicked_feature = e.features[0];
                console.log('feature clicked: ', clicked_feature)

                // having a variable which stores the id of the layer
                let id_property;
                // store the id (its value) of the clicked feature
                let value_clicked_feature_id;

                // assign values for the id name and its value depending on the layer clicked
                // we use these 2 variables when we want to change some properties
                switch(clickedLayer){
                    case 'layer_aspern_blocks':
                        id_property= 'OBJECTID';//'id';
                        value_clicked_feature_id = clicked_feature.properties.OBJECTID;
                        break;
                    case 'layer_aspern_landcover':
                        id_property = 'OBJECTID';//'blockID';
                        value_clicked_feature_id = clicked_feature.properties.OBJECTID;
                        break;
                    case 'layer_aspern_bkmBlocks':
                        id_property= 'FMZK_ID';
                        value_clicked_feature_id = clicked_feature.properties.FMZK_ID;
                        break;
                    case 'layer_aspern_landuse':
                        id_property= 'OBJECTID';
                        value_clicked_feature_id = clicked_feature.properties.OBJECTID;
                        break;
                    case 'layer_aspern_roads':
                        id_property= 'OBJECTID';
                        value_clicked_feature_id = clicked_feature.properties.OBJECTID;
                        break;
                    case 'layer_aspern_publiclines':
                        id_property= 'OBJECTID';
                        value_clicked_feature_id = clicked_feature.properties.OBJECTID;
                        break;
                    case 'layer_aspern_trees':
                        id_property= 'BAUM_ID';
                        value_clicked_feature_id = clicked_feature.properties.BAUM_ID;
                        break;
                    case 'layer_aspern_publicstops':
                        id_property= 'OBJECTID';
                        value_clicked_feature_id = clicked_feature.properties.OBJECTID;
                        break;
                    case 'layer_shops':
                        id_property= 'osm_id';
                        value_clicked_feature_id = clicked_feature.properties.osm_id;
                        break;
                }
                console.log('clicked feature id: ', value_clicked_feature_id);

                properties = clicked_feature.properties; // store the feature's properties
                properties_keys = Object.keys(properties); // store the properties keys of the feature
                properties_values = Object.values(properties); // store the properties values of the feature
                console.log('prop keys: ', properties_keys);
                console.log('prop values: ', properties_values);
                console.log('prop len: ', properties_values.length);


                const popup = new mapboxgl.Popup()
                  .setLngLat(e.lngLat)
                  .addTo(map);

                // for the height property, we put a range form when changing its value
                range_property_list = ['height'];

                // creating the list of properties can can be changed directly
                function create_dynamic_prop_canvas(){

                    console.log('properties values in create dynamic func: ', properties_values)

                    const ul = document.createElement('ul');
                    ul.className = "list-group list-group-flush"
                    ul.id = 'off-canvas';

                    // check if we have a list for the clicked feature with the properties that we want to show
                      try{
                          imp_prop = eval('properties_'+check_id);
                      } catch (err){ // if not, we show all properties of the clicked feature
                          imp_prop =properties_keys;
                      }

                  console.log('type imp prop: ',  imp_prop)

                    for (let i=0; i< properties_keys.length; i++){
                        // have the important properties only shown
                        if (imp_prop.includes(properties_keys[i])){
                            // change properties stored names with user-friendly names
                            let li_prop_user = properties_keys[i];
                            switch(properties_keys[i]){
                                case 'area_green_rel':
                                    li_prop_user = 'share of green space';
                                    break;
                                case 'OSR':
                                    li_prop_user= 'open space ratio';
                                    break;
                                case 'max_height':
                                    li_prop_user = 'maximum building height';
                                    break;
                                case 'count_trees':
                                    li_prop_user= 'stock of trees';
                                    break;
                                case 'count_shops':
                                    li_prop_user= 'number of shops';
                                    break;
                                case 'main_cover':
                                    li_prop_user= 'land cover';
                                    break;
                                case 'use_lvl1':
                                    li_prop_user= 'generalized land use';
                                    break;
                                case 'use_lvl2':
                                    li_prop_user= 'land use category';
                                    break;
                                case 'use_lvl3':
                                    li_prop_user= 'detailed land use category';
                                    break;
                                case 'form':
                                    li_prop_user= 'construction form of the section';
                                    break;
                                case 'line_type':
                                    li_prop_user= 'means of transport';
                                    break;
                                case 'year':
                                    li_prop_user= 'year of planting';
                                    break;
                                case 'stop_name':
                                    li_prop_user= 'name of stop';
                                    break;
                                case 'shop':
                                    li_prop_user= 'type of shop/service';
                                    break;
                                case 'landuse':
                                    li_prop_user= 'landuse category';
                                    break;
                            }


                            const li = document.createElement('li');
                            li.id = 'p'+ i.toString();
                            li.className = 'list-group-item';
                            li.innerHTML = '<b style="">'+li_prop_user+'</b>: '+'<span style="width: auto" ></span>';
                            ul.appendChild(li);

                            // save the property name and its value
                            li_prop = properties_keys[i];
                            span_text = properties_values[i];

                            // putting the range for certain properties that have number values
                            // if the property is one of the above and its value is not null
                            if (range_property_list.includes(li_prop) && span_text!='null'){
                                // we define the range stop number
                                if (Number(span_text)<10){
                                    max_range_nr ='100'
                                }
                                else if (Number(span_text)>1000){
                                    max_range_nr = String(Number(span_text)*3)
                                }
                                else if (Number(span_text)>10000){
                                    max_range_nr = String(Number(span_text)*2)
                                }
                                else{
                                    max_range_nr = String(Math.pow(Number(span_text),2));
                                }

                                li.getElementsByTagName('span')[0].innerHTML = '\n        <form action="#" style="width:130px; font-size: 14px">\n            <p class="range-field">\n                <input type="range" id="test5" min="0" max="'+max_range_nr+'"  value="'+span_text+'"><span class="thumb"><span class="value"></span></span>\n            </p>\n        </form>\n    '


                            }else
                            // putting the dropdown for landuse property
                            // we have the dropdown available only when the tool button is clicked
                            if(properties_keys[i]== 'landuse' && landuse_tool_but.checked){
                                console.log('span text: ', span_text)
                                li.getElementsByTagName('span')[0].innerHTML =
                                    '<form action="#" style="width:150px; font-size: 14px;" id="select_form">\n'+
                                    '<select name="level2" id="level2" style="display: block;  height: 35px">\n' +
                                    '  <option value="recreation & leisure facilities">recreation & leisure facilities</option>\n' +
                                    '  <option value="water">water</option>\n' +
                                    '  <option value="agriculture">agriculture</option>\n' +
                                    '  <option value="natural area">natural area</option>\n' +
                                    '  <option value="business uses">business uses</option>\n' +
                                    '  <option value="industrial & commercial uses">industrial & commercial uses</option>\n' +
                                    '  <option value="social infrastructure">social infrastructure</option>\n' +
                                    '  <option value="technical infrastructure">technical infrastructure</option>\n' +
                                    '  <option value="residential use">residential use</option>\n' +
                                    '  <option value="road space">road space</option>\n' +
                                    '  <option value="other transportation uses">other transportation uses</option>\n' +
                                    '</select>\n'+
                                    '</form>'

                                // show the current landuse value
                                li.getElementsByTagName('select')[0].value = span_text;

                            } else {
                                // the values are just plain text
                                li.getElementsByTagName('span')[0].innerHTML= properties_values[i];

                            }

                            //when the user changes a property's value
                           li.getElementsByTagName('span')[0].onchange = function(e){
                                console.log('e: ', e);
                                console.log('on change this: ', this);
                                let new_value =e.target.value; // store the new value

                               // save the new value in the layer's data dictionary
                                if (check_id == 'aspern_landuse' && landuse_tool_but.checked){
                                    // we store the changes of landuse in the main blocks layer
                                    save_dict_property(li, new_value, 'aspern_blocks');
                                }
                                else{
                                    save_dict_property(li, new_value, check_id);
                                }

                            }

                            ul.appendChild(li);

                        }
                        popup.setDOMContent(ul);


                    }
                }
                create_dynamic_prop_canvas();

                // function for saving the changes into the dictionary
                function save_dict_property(li, new_value, data_check_id){
                    console.log('save the data into the dict');

                    console.log('data check id: ', data_check_id)


                    for (f of eval('data_'+data_check_id).features){
                        // f is the clicked feature from the dictionary
                        // we find the feature in the dictionary that has been changed (we look for the same id)
                        if ( f['properties'][id_property] == value_clicked_feature_id){
                            console.log('found: ', f);

                            console.log('li in save dict: ', li);

                            dict_key = li.getElementsByTagName('b')[0].innerHTML;


                            // user-friendly prop names changed back to initial names
                            // because we get the property from the form and check it in the dictionary
                            switch(dict_key){
                                case 'share of green space':
                                    dict_key = 'area_green_rel';
                                    break;
                                case 'open space ratio':
                                    dict_key= 'OSR';
                                    break;
                                case 'maximum building height':
                                    dict_key = 'max_height';
                                    break;
                                case 'stock of trees':
                                    dict_key= 'count_trees';
                                    break;
                                case 'number of shops':
                                    dict_key= 'count_shops';
                                    break;
                                case 'land cover':
                                    dict_key= 'main_cover';
                                    break;
                                case 'generalized land use':
                                    dict_key= 'use_lvl1';
                                    break;
                                case 'land use category':
                                    dict_key= 'use_lvl2';
                                    break;
                                case 'detailed land use category':
                                    dict_key= 'use_lvl3';
                                    break;
                                case 'construction form of the section':
                                    dict_key= 'form';
                                    break;
                                case 'means of transport':
                                    dict_key= 'line_type';
                                    break;
                                case 'year of planting':
                                    dict_key= 'year';
                                    break;
                                case 'name of stop':
                                    dict_key= 'stop_name';
                                    break;
                                case 'type of shop/service':
                                    dict_key= 'shop';
                                    break;
                                case 'landuse category':
                                    dict_key= 'landuse';
                                    break;
                            }



                            console.log(li.getElementsByTagName('b'));
                            console.log('dict key from li: ', dict_key);
                            console.log('f prop: ', f['properties']);
                            //change the current value to the updated one
                            f['properties'][dict_key] = new_value;

                            console.log('clicked layer in save in dict: ', clickedLayer)

                            //update layer's data
                            map.getSource(clickedLayer).setData(eval('data_'+data_check_id));
                            console.log('data after: ', f);
                            feature = JSON.parse(JSON.stringify(f));

                            return feature
                        }

                    }
                }

            });
        }
    }

});
