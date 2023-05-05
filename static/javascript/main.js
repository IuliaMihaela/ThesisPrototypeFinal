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
let data_tourism;
let data_public_transport_stops;


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
                '#EBDCFF'};
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
                '#CEFFA7'};
let colors_wind_score= '#22B4CE'
// let colors_wind_score = {'#027C93':
//                 '#027C93',
//
//                 '#03323E':
//                 '#03323E',
//
//                 '#0C505E':
//                 '#0C505E',
//
//                 '#22B4CE':
//                 '#22B4CE',
//
//                 '#37DFFF':
//                 '#37DFFF',
//
//                 '#CFF8FF':
//                 '#CFF8FF',
//
//                 '#FFFFFF':
//                 '#FFFFFF',};
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
let colors_bike_live_stations='#f6cacc';

let colors_bike_count_stations= '#880606';
let colors_tourism={
    'Apartment':
        '#3399cc',
    'Archive':
        '#990066',
    'Railway station':
        '#cc3399',
    'Bar':
        '#ff6600',
    'Authority':
        '#ff9900',
    'Educational institution':
        '#ffcc00',
    'Embassy':
        '#eb5e28',
    'Bus parking':
        '#006699',
    'Club & Disco':
        '#f3c053',
    'Boarding and disembarking points for buses':
        '#7b4618',
    'Ice cream parlor':
        '#3e4c22',
    'Venue':
        '#9b9c9b',
    'Fitness-Center':
        '#C5C6C633',
    'Gallery & Art Trade':
        '#d6ab7d',
    'Tavern & Pub':
        '#8b2fc9',
    'Memorial & Monument':
        '#dc97ff',
    'Port & Pier':
        '#b81702',
    'Award winning Restaurant':
        '#ff595e',
    'Winery':
        '#ffcab1',
    'Hotel':
        '#519872',
    'Snack & Fast Food':
        '#3b5249',
    'Information point':
        '#a1fcdf',
    'Coffeehouse':
        '#7fd8be',
    'Cinema':
        '#98421f',
    'Church & Chapel':
        '#441d0e',
    'Small Stage':
        '#d49d96',
    'Climb':
        '#9e2b25',
    'Conference centre':
        '#0c285e',
    'Concert hall':
        '#485265',
    'Hospital':
        '#edabce',
    'Art space':
        '#ffdf00',
    'Museum':
        '#eaaa34',
    'Official Tourist Information Office':
        '#cb8b15',
    'Opera':
        '#722e9a',
    'Park & Garden':
        '#669900',
    'Pension':
        '#ff4f84',
    'Restaurant':
        '#fc9f5b',
    'Seasonal Hotel':
        '#360000',
    'Castle & Palace':
        '#52b788',
    'Swimming pool':
        '#5e503f',
    'Attraction':
        '#faf2dc',
    'Other':
        '#FFFFFFAF',
    'Playground':
        '#e7a39f',
    'Sports facilities':
        '#2c005d',
    'Language school':
        '#ffdb8f',
    'Stadium':
        '#706103',
    'Dance':
        '#6d9b6f',
    'Dancing school':
        '#00fff7',
    'Theater':
        '#00ff75',
    'Tours & Guides':
        '#ec5800',
    'Rental':
        '#ff00ec',
    'Wine bar':
        '#f55d67',
    'Wellness':
        '#6a79a9',
    'Yoga- & Pilates-Studio':
        '#ccee66',
}
let colors_public_transport_stops={
    '13'://'Astax Day of the Week':
    '#CC0000',
    '3'://'Regional bus':
    '#FF8000',
    '2'://'Bus':
    '#FFFF00',
    '5'://'S-Bahn an Regional Trains':
    '#00FF00',
    '9'://'Astax Day Line':
    '#00FFFF',
    '10'://'Night Bus Weekend':
    '#0000FF',
    '11'://'Night bus weekday':
    '#FF33FF',
    '4'://'Subway':
    '#6e00a2',
    '1'://'Tram':
    '#62392f',
    '6'://'Badner Bahn':
    '#ffffff',
    '12'://'Astax Weekend':
    'rgba(167,167,194,0.6)'
}


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
let properties_tourism=['NAME', 'STREET','CATEGORY_NAME', 'SUBCATEGORY_NAME'];
let properties_public_transport_stops=['HTXTK', 'HLINIEN']

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
let graph_data_tourism;
let graph_data_public_transport_stops;

let help_iso="<p>Drag around the marker with the mouse to show the accessible areas " +
    "by bicycle within the timeframe on right top of the screen</p>";
let help_routing="<p>Click on the map or enter locations on right top of the screen. " +
    "Modify the destination and source by either dragging the markers around and adapt and " +
    "routes by dragging the point on the line to where you want to deviate.</p>";
let help_scored_routing="<p>Drag around the markers (pink for source; green for destination) " +
    "and choose the ideal parameters on right top of the screen(numbers from 0 to 5; 0-not included; 1-least; 5-most). " +
    "Route is calculated after clicking 'Show Route' button.</p>";


// const file_path = ["../data/final/aspern_blocks_final.geojson", "../data/final/aspern_landcover_final.geojson", "../data/final/aspern_bkmBlocks.geojson",  "../data/final/aspern_roads.geojson", "../data/final/aspern_publiclines.geojson", "../data/final/aspern_trees_blocks.geojson", "../data/final/aspern_publicstops.geojson", "../data/final/shops.geojson"]
const file_path = ["bike_services", "lit_score", "paved_score",  "safety_score", "veg_score", "wind_score", "streets", "bike_facilities", "bike_all_stations", "bike_count_stations", "district_bike_paths", "tourism", "public_transport_stops"]


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
                 case 'tourism':
                    data_tourism = json_response;
                    load_layer_tourism()
                    console.log(data_tourism)
                    graph_data_tourism = await getGraphData(data_tourism, 'SUBCATEGORY_NAME');

                    break;
                 case 'public_transport_stops':
                    data_public_transport_stops = json_response;
                    load_layer_public_transport_stops()
                    console.log(data_public_transport_stops)
                    graph_data_public_transport_stops=await getGraphData(data_public_transport_stops, 'LTYP');

                    //remove spinner from info window with the map loading
                    document.getElementById('load_map_info').innerHTML='The map is ready.';

                     break




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



function load_layer_bike_services(){
    // map.addLayer(
    // {
    //     'id': 'layer_bike_services',
    //     'source': {
    //         type: 'geojson',
    //         data: data_bike_services
    //         },
    //     'type': 'circle',
    //     'paint': {
    //         'circle-color': [
    //
    //             'match',
    //             ['to-string', ['get', 'name']],
    //             'Pumpe',
    //             '#FF2337',
    //             'Werkzeug',
    //             //tools
    //             '#218a8a',
    //             'Schlauchautomat',
    //             // Mașină cu furtun
    //             '#dc8b18',
    //
    //             '#000000' // any other store type
    //         ],
    //     },
    //     'layout': {
    //             'visibility': 'none'
    //     },
    // });

    map.loadImage('https://cdn0.iconfinder.com/data/icons/motorcycle-motorbike-man-daredevil/230/motorcyclist-action-007-512.png', (error, image) => {
          if (error) throw error;
          map.addImage('bike_services-icon', image, { 'sdf': true });

          map.addLayer({
            'id': 'layer_bike_services',
            // 'type': 'circle',
            'type': 'symbol',
            'source': {
                type: 'geojson',
                data: data_bike_services
                },
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

      // map.addLayer({
      //   'id': 'layer_bike_services',
      //   // 'type': 'circle',
      //   'type': 'symbol',
      //   'source': {
      //       type: 'geojson',
      //       data: data_bike_services
      //       },
      //   'paint': {
      //       'icon-color': [
      //       'match',
      //       ['to-string', ['get', 'name']],
      //       'Air pumps',
      //       '#FF2337',
      //       'Tools',
      //       //tools
      //       '#218a8a',
      //       'Automatic hose machines',
      //       // Mașină cu furtun
      //       '#dc8b18',
      //
      //       '#000000' // any other store type
      //   ],
      //   },
      //   'layout': {
      //           'visibility': 'none',
      //           // 'icon-image': 'bike_services-icon',
      //           'icon-image': 'bicycle-15',
      //
      //           'icon-size': 0.08
      //   },
      //
      //   });

}

function load_layer_lit_score(){
     map.addLayer(
      {
        'id': 'layer_lit_score',
        'type': 'fill',
        'source': {
            type: 'geojson',
            data: data_lit_score
            },
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
}

function load_layer_paved_score(){
      map.addLayer(
      {
        'id': 'layer_paved_score',
        'type': 'line',
        'source': {
            type: 'geojson',
            data: data_paved_score
            },
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
}

function load_layer_safety_score(){
    map.addLayer(
      {
        'id': 'layer_safety_score',
        'type': 'line',
        'source': {
            type: 'geojson',
            data: data_safety_score
            },
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
}

function load_layer_veg_score(){
    map.addLayer(
      {
        'id': 'layer_veg_score',
        'type': 'line',
        'source': {
            type: 'geojson',
            data: data_veg_score
            },
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
}

function load_layer_wind_score(){
    map.addLayer(
      {
        'id': 'layer_wind_score',
        'type': 'line',
        'source': {
            type: 'geojson',
            data: data_wind_score
            },
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
}

function load_layer_streets(){
  map.addLayer(
      {
        'id': 'layer_streets',
        'type': 'line',
        'source': {
            type: 'geojson',
            data: data_streets
            },
        'paint': {
            'line-color': '#000005'
        },
        'layout': {
                'visibility': 'none'
        },
      });
}

function load_layer_bike_network(){
    map.addLayer(
    {
        'id': 'layer_bike_network',
        'source': {
            type: 'geojson',
            data: data_bike_network
            },
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
}

function load_layer_bike_all_stations(){
    map.loadImage('https://cdn0.iconfinder.com/data/icons/car-parking-3/512/car-park-parking-07-512.png', (error, image) => {
          if (error) throw error;
          map.addImage('bike_all_stations-icon', image, { 'sdf': true });

          map.addLayer({
            'id': 'layer_bike_all_stations',
            // 'type': 'circle',
            'type': 'symbol',
            'source': {
                type: 'geojson',
                data: data_bike_all_stations
                },
            'paint': {
                'icon-color': '#ffffff',
                //     [
                //
                //     'match',
                //     ['to-string', ['get', 'height_code']],
                //     '0',
                //     '#99FF99',
                //     '1',
                //     '#66FF66',
                //     '2',
                //     '#33FF33',
                //     '3',
                //     '#00CC00',
                //     '4',
                //     '#00CC00',
                //     '5',
                //     '#009900',
                //
                //     '#000000' // any other store type
                // ],
            },
            'layout': {
                    'visibility': 'none',
                    'icon-image': 'bike_all_stations-icon',
                    'icon-size': 0.08
            },

            });
         });
}

function load_layer_bike_count_stations_hover(){ //for the traffic hover
    map.addLayer({
        'id': 'layer_bike_count_stations',
        'type': 'circle',
        'source': {
            type: 'geojson',
            data: data_bike_count_stations
            },
        'paint': {
            // The feature-state dependent circle-radius expression will render
            // the radius size according to its traffic when
            // a feature's hover state is set to true
            'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            [
            'interpolate',
            ['linear'],
            ['get', 'traffic1'],
            20,
            8,
            60,
            10,
            100,
            12,
            130,
            14,
            200,
            16,
            300,
            18,
            400,
            20,
            500,
            22,
            600,
            24,
            800,
            26,
            900,
            30
            ],
            5
            ],
            'circle-stroke-color': '#000',
            'circle-stroke-width': 1,
            // The feature-state dependent circle-color expression will render
            // the color according to its magnitude when
            // a feature's hover state is set to true
            'circle-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            [
            'interpolate',
            ['linear'],
            ['get', 'traffic1'],
            20,
            '#fff7ec',
            60,
            '#fee8c8',
            100,
            '#fdd49e',
            130,
            '#fdbb84',
            200,
            '#fc8d59',
            300,
            '#ef6548',
            400,
            '#d7301f',
            500,
            '#b30000',
            600,
            '#7f0000',
            800,
            '#4f0000',
            900,
            '#250000'
            ],
            '#000'
            ]
        },
        'layout': {
            'visibility': 'none',
            },
        });


    let bikeID = null;

    map.on('mousemove', 'layer_bike_count_stations', (event) => {
        console.log(event.features)
        map.getCanvas().style.cursor = 'pointer';

        if (event.features.length === 0) return;

        // When the mouse moves over the earthquakes-viz layer, update the
        // feature state for the feature under the mouse
        if (bikeID) {
            map.removeFeatureState({
            source: 'layer_bike_count_stations',
            id: bikeID
            });
        }
        bikeID = event.features[0].properties.id;

        map.setFeatureState(
            {
            source: 'layer_bike_count_stations',
            id: bikeID
            },
            {
            hover: true
            }
        );
    });

    map.on('mouseleave', 'layer_bike_count_stations', () => {
        if (bikeID) {
            map.setFeatureState(
            {
                source: 'layer_bike_count_stations',
                id: bikeID
            },
            {
                hover: false
            }
            );
        }
        bikeID = null;
        // Reset the cursor style
        map.getCanvas().style.cursor = '';
    });

}

function load_layer_bike_count_stations_heatmap(){
    // map.addLayer(
    // {
    // 'id': 'layer_bike_count_stations',
    // 'type': 'heatmap',
    // 'source': {
    //         type: 'geojson',
    //         data: data_bike_count_stations
    //         },
    // 'maxzoom': 15,
    // 'paint': {
    //     // increase weight as diameter breast height increases
    //     'heatmap-weight': {
    //         'property': 'traffic1',
    //         'type': 'exponential',
    //         'stops': [
    //         [1, 0],
    //         [62, 1]
    //         ]
    //     },
    //     // increase intensity as zoom level increases
    //     'heatmap-intensity': {
    //         'stops': [
    //         [11, 1],
    //         [15, 3]
    //         ]
    //     },
    //     // use sequential color palette to use exponentially as the weight increases
    //     'heatmap-color': [
    //         'interpolate',
    //         ['linear'],
    //         ['heatmap-density'],
    //         0,
    //         'rgba(236,222,239,0)',
    //         0.2,
    //         'rgb(208,209,230)',
    //         0.4,
    //         'rgb(166,189,219)',
    //         0.6,
    //         'rgb(103,169,207)',
    //         0.8,
    //         'rgb(28,144,153)'
    //     ],
    //     // increase radius as zoom increases
    //     'heatmap-radius': {
    //         'stops': [
    //         [11, 15],
    //         [15, 20]
    //         ]
    //     },
    //     // decrease opacity to transition into the circle layer
    //     'heatmap-opacity': {
    //         'default': 1,
    //         'stops': [
    //         [14, 1],
    //         [15, 0]
    //         ]
    //     }
    // },
    //     'layout': {
    //         'visibility': 'none',
    //         },
    // },
    // );

     map.addLayer(
    {
    'id': 'layer_bike_count_stations',
    'type': 'circle',
    'source': {
            type: 'geojson',
            data: data_bike_count_stations
            },
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
}

function load_layer_district_bike_paths(){
    map.addLayer(
      {
        'id': 'layer_district_bike_paths',
        'type': 'fill',
        'source': {
            type: 'geojson',
            data: data_district_bike_paths
            },
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
                  '#ff0003',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 20],
                  '#d2383c',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 30],
                  '#f6cacc',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 40],
                  '#7ed031',
                  ['<=', ['to-number',  ['get', 'free_bikes']], 50],
                  '#255901',

                  '#000005'
              ]
        },
      });
}

function load_layer_tourism() {
    // https://cdn2.iconfinder.com/data/icons/tourism-and-travel-2/64/TOURIST_GUIDE-512.png

    map.loadImage('https://cdn3.iconfinder.com/data/icons/local-tourism/512/tourism-travel-11-512.png', (error, image) => {
          if (error) throw error;
          map.addImage('tourism-icon', image, { 'sdf': true });

          map.addLayer({
            'id': 'layer_tourism',
            // 'type': 'circle',
            'type': 'symbol',
            'source': {
                type: 'geojson',
                data: data_tourism
                },
            'paint': {
                'icon-color': [
                'match',
                ['to-string', ['get', 'SUBCATEGORY_NAME']],

                'Apartment',
                    '#3399cc',
                'Archive',
                    '#990066',
                'Railway station',
                    '#cc3399',
                'Bar',
                    '#ff6600',
                'Authority',
                    '#ff9900',
                'Educational institution',
                    '#ffcc00',
                'Embassy',
                    '#eb5e28',
                'Bus parking',
                    '#006699',
                'Club & Disco',
                    '#f3c053',
                'Boarding and disembarking points for buses',
                    '#7b4618',
                'Ice cream parlor',
                    '#3e4c22',
                'Venue',
                    '#9b9c9b',
                'Fitness-Center',
                    'rgba(197,198,198,0.2)',
                'Gallery & Art Trade',
                    '#d6ab7d',
                'Tavern & Pub',
                    '#8b2fc9',
                'Memorial & Monument',
                    '#dc97ff',
                'Port & Pier',
                    '#b81702',
                'Award winning Restaurant',
                    '#ff595e',
                'Winery',
                    '#ffcab1',
                'Hotel',
                    '#519872',
                'Snack & Fast Food',
                    '#3b5249',
                'Information point',
                    '#a1fcdf',
                'Coffeehouse',
                    '#7fd8be',
                'Cinema',
                    '#98421f',
                'Church & Chapel',
                    '#441d0e',
                'Small Stage',
                    '#d49d96',
                'Climb',
                    '#9e2b25',
                'Conference centre',
                    '#0c285e',
                'Concert hall',
                    '#485265',
                'Hospital',
                    '#edabce',
                'Art space',
                    '#ffdf00',
                'Museum',
                    '#eaaa34',
                'Official Tourist Information Office',
                    '#cb8b15',
                'Opera',
                    '#722e9a',
                'Park & Garden',
                    '#669900',
                'Pension',
                    '#ff4f84',
                'Restaurant',
                    '#fc9f5b',
                'Seasonal Hotel',
                    '#360000',
                'Castle & Palace',
                    '#52b788',
                'Swimming pool',
                    '#5e503f',
                'Attraction',
                    '#faf2dc',
                'Other',
                    'rgba(255,255,255,0.69)',
                'Playground',
                    '#e7a39f',
                'Sports facilities',
                    '#2c005d',
                'Language school',
                    '#ffdb8f',
                'Stadium',
                    '#706103',
                'Dance',
                    '#6d9b6f',
                'Dancing school',
                    '#00fff7',
                'Theater',
                    '#00ff75',
                'Tours & Guides',
                    '#ec5800',
                'Rental',
                    '#ff00ec',
                'Wine bar',
                    '#f55d67',
                'Wellness',
                    '#6a79a9',
                'Yoga- & Pilates-Studio',
                    '#ccee66',


                '#131315' // any other store type
            ],
            },
            'layout': {
                    'visibility': 'none',
                    'icon-image': 'tourism-icon',
                    'icon-size': 0.08
            },

            });
         });
}

function load_layer_public_transport_stops() {
    // https://cdn2.iconfinder.com/data/icons/tourism-and-travel-2/64/TOURIST_GUIDE-512.png
    //https://th.bing.com/th/id/R.fbe5245113e80e948c59feca2dcdc0c4?rik=quuxor4UfuyXhw&riu=http%3a%2f%2fgetdrawings.com%2ffree-icon-bw%2fbus-station-icon-18.png&ehk=t6qBsIA8ZxgwEnQhUeCGf%2f1gvuCsfUHCnj0Fd1FB4Q0%3d&risl=&pid=ImgRaw&r=0
    //url='https://cdn3.iconfinder.com/data/icons/public-services-7/64/Bus-stop-station-public-transport-512.png'
    url='https://cdn3.iconfinder.com/data/icons/city-lifestyle-linear-black/2048/6464_-_Bus_Stop-512.png'
    map.loadImage(url, (error, image) => {
          if (error) throw error;
          map.addImage('public_transport_stops-icon', image, { 'sdf': true });

          map.addLayer({
            'id': 'layer_public_transport_stops',
            'type': 'symbol',
            'source': {
                type: 'geojson',
                data: data_public_transport_stops
                },
            'paint': {
                'icon-color': [
                'match',
                ['to-string', ['get', 'LTYP']],

                '13', //Astax Day of the Week
                '#CC0000',
                '3', //Regional bus
                '#FF8000',
                '2', //Bus
                '#FFFF00',
                '5', //S-Bahn an Regional Trains
                '#00FF00',
                '9', //Astax Day Line
                '#00FFFF',
                '10', //Night Bus Weekend
                '#0000FF',
                '11', //Night bus weekday
                '#FF33FF',
                '4', //subway
                '#6e00a2',
                '1',  //Tram
                '#62392f',
                '6', //Badner Bahn
                '#ffffff',
                '12',  //Astax Weekend
                'rgba(167,167,194,0.6)',


                '#131315' // any other store type
            ],
            },
            'layout': {
                    'visibility': 'none',
                    'icon-image': 'public_transport_stops-icon',
                    'icon-size': 0.08
            },

            });
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
        title: {
            text: layer_id,
            font: {
              color: 'rgb(255 255 255 / 75%)'
            }
          },
        xaxis: {
            color: 'rgb(255 255 255 / 75%)'
          },
        plot_bgcolor: 'rgb(0 0 0 / 44%)',
        paper_bgcolor: 'rgb(0 0 0 / 44%)',

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
            if (layer_id == 'public_transport_stops')
            {
                var grdata = [
                  {
                    y: y,
                    x: x,
                    type: "bar",
                      marker: mar,
                  }]
            }else{
                var grdata = [
                  {
                    histfunc: "sum",
                    y: y,
                    x: x,
                    type: "histogram",
                      marker: mar,
                  }]
            }

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
    getXml() // load the local geojson files






    // left canvas ...............
    const canvas_layers = document.getElementsByClassName('offcanvas-start');
    const btn_open_left_canvas = document.getElementById('btn-open-layers')
    btn_open_left_canvas.onclick = (function(){
        console.log(canvas_layers);
        //make visible the canvas
        canvas_layers[0].className = 'show '+ canvas_layers[0].className;
        //hide the button that opens the canvas
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

    // info element ...............
    const info_el = document.getElementById('info_el');
    const btn_open_info = document.getElementById('btn-open-info')
    btn_open_info.onclick = (function(){
        info_el.style.visibility='visible';

    });
    const btn_close_info =document.getElementById('btn-close-info');
    btn_close_info.onclick = (function(){
        info_el.style.visibility = 'hidden';
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

          //how instructions
          document.getElementById('help_nav').innerHTML=help_iso;

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

              //hide instructions
              document.getElementById('help_nav').innerHTML='';

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
      //https://stackoverflow.com/questions/68212266/mapbox-gl-directions-plugin-how-to-change-marker-a-and-b
      const style = [
          {
        'id': 'directions-route-line-alt',
          'type': 'line',
          'source': 'directions',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#bbb',
            'line-width': 4
          },
          'filter': [
            'all',
            ['in', '$type', 'LineString'],
            ['in', 'route', 'alternate']
          ]
        }, {
          'id': 'directions-route-line-casing',
          'type': 'line',
          'source': 'directions',
          'layout': {
            'line-cap': 'round',
            'line-join': 'round'
          },
          'paint': {
            'line-color': '#2d5f99',
            'line-width': 10
          },
          'filter': [
            'all',
            ['in', '$type', 'LineString'],
            ['in', 'route', 'selected']
          ]
        }, {
          'id': 'directions-route-line',
          'type': 'line',
          'source': 'directions',
          'layout': {
            'line-cap': 'butt',
            'line-join': 'round'
          },
          'paint': {
            'line-color': {
              'property': 'congestion',
              'type': 'categorical',
              'default': '#4882c5',
              'stops': [
                ['unknown', '#4882c5'],
                ['low', '#4882c5'],
                ['moderate', '#f09a46'],
                ['heavy', '#e34341'],
                ['severe', '#8b2342']
              ]
            },
            'line-width': 7
          },
          'filter': [
            'all',
            ['in', '$type', 'LineString'],
            ['in', 'route', 'selected']
          ]
        }, {
          'id': 'directions-hover-point-casing',
          'type': 'circle',
          'source': 'directions',
          'paint': {
            'circle-radius': 8,
            'circle-color': '#fff'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'id', 'hover']
          ]
        }, {
          'id': 'directions-hover-point',
          'type': 'circle',
          'source': 'directions',
          'paint': {
            'circle-radius': 6,
            'circle-color': '#3bb2d0'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'id', 'hover']
          ]
        }, {
          'id': 'directions-waypoint-point-casing',
          'type': 'circle',
          'source': 'directions',
          'paint': {
            'circle-radius': 8,
            'circle-color': '#fff'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'id', 'waypoint']
          ]
        }, {
          'id': 'directions-waypoint-point',
          'type': 'circle',
          'source': 'directions',
          'paint': {
            'circle-radius': 6,
            'circle-color': '#8a8bc9'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'id', 'waypoint']
          ]
        }, {
          'id': 'directions-origin-point',
          'type': 'circle',
          'source': 'directions',
          'paint': {
            'circle-radius': 18,
            'circle-color': '#e7a39f'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', 'A']
          ]
        }, {
          'id': 'directions-origin-label',
          'type': 'symbol',
          'source': 'directions',
          'layout': {
            'text-field': 'A',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          'paint': {
            'text-color': '#fff'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', 'A']
          ]
        }, {
          'id': 'directions-destination-point',
          'type': 'circle',
          'source': 'directions',
          'paint': {
            'circle-radius': 18,
            'circle-color': '#009f08'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', 'B']
          ]
        }, {
          'id': 'directions-destination-label',
          'type': 'symbol',
          'source': 'directions',
          'layout': {
            'text-field': 'B',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12
          },
          'paint': {
            'text-color': '#fff'
          },
          'filter': [
            'all',
            ['in', '$type', 'Point'],
            ['in', 'marker-symbol', 'B']
          ]
        }
        ];

      const directions = new MapboxDirections({
          accessToken: mapboxgl.accessToken,
          unit: 'metric',
          profile: 'mapbox/cycling',
          alternatives: false,
          geometries: 'geojson',
          controls: { instructions: true },
          flyTo: false,
          styles: style,
      });

      $('#bike_routing')[0].onclick = function(e){

          if(this.checked){
              //if we click on the layer

              map.addControl(directions, 'top-right');

              //show instructions
              document.getElementById('help_nav').innerHTML = help_routing;

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

              //hide instructions
              document.getElementById('help_nav').innerHTML = '';

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


              //show instructions
              document.getElementById('help_nav').innerHTML = help_scored_routing;


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

                //the spinner on the button
                $('#bike_score_routing').siblings('label')[0].innerHTML= 'Bike score routing  <div class="spinner-border spinner-border-sm" role="status" style="display: inline-block;">\n      ' +
                    '<span class="visually-hidden">Loading...</span>\n    </div>';

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
                                'line-color': '#2d5f99'
                            }
                        });
                    }

                    //delete spinner
                    $('#bike_score_routing').siblings('label')[0].innerHTML= 'Bike score routing';

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

               //hide parameters
               $('#score_routing_div')[0].style.visibility = 'hidden';


              //hide instructions
              document.getElementById('help_nav').innerHTML = '';


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


            //..... dealing with the layers .....//
            //unclicking the layer
            if(!(layer_input.checked)){
                console.log('unclicked the layer')

                //hide button for legend and graph when there is no layer being displayed
                document.getElementById('btn-open-legend').style.visibility='hidden';


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

                //hide button for legend and graph when there is no layer being displayed
                document.getElementById('btn-open-legend').style.visibility='hidden';

            }
            //if we click a layer
            else
            {

                console.log('clicked the layer')

                //show button for legend and graph
                if(clickedLayer!='layer_bike_all_stations' && clickedLayer!='layer_streets'){
                    document.getElementById('btn-open-legend').style.visibility='visible';
                }


                //.....calculate the graph.....//
                try{
                    console.log('creating graph path')
                    create_graph(eval('graph_data_'+check_id), check_id, eval('colors_'+check_id));

                }
                catch(error){
                    console.log(error);



                }

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
                //if the canvas right is not showing
                if(clickedLayer!='layer_bike_all_stations' && clickedLayer!='layer_streets'){
                    if (!(canvas_legend[0].classList.contains("show"))){
                        //we click on its open button
                        btn_open_right_canvas.click()
                }}



                if(clickedLayer == 'layer_bike_live_stations'){
                    get_bike_live_stations();
                }


                //show its legend and graph if they are
                //if we have a legend for the layer
                 try{
                     legend_div_id = '#legend_'+check_id;
                     //if we have an active legend from previous clicked layer
                    try{
                        //we remove the active legend
                        $('#legend_carousel .carousel-item.active')[0].classList.remove('active');
                    }
                    //if there is no active legend
                    catch(err){
                        console.log(err)
                    }

                    //add the current legend as active
                     $(legend_div_id)[0].classList.add('active');
                     console.log("show legend");
                 //if we do not have a legend for the current layer
                } catch (err){
                    console.log(err);
                    console.log('No legend active');
                }
                //if we have a graph for the clicked layer
                try{
                     graph_div_id = '#graph_'+check_id;
                     //if we have an actibe graph from previous layer
                     try{
                         $('#graph_carousel .carousel-item.active')[0].classList.remove('active');
                     }
                     //if we do not have an active graph
                     catch (err){
                         console.log(err)
                     }
                     $(graph_div_id)[0].classList.add('active');
                     console.log("show graph");
                //if we do not have a graph for the current layer
                } catch (err){
                    console.log(err);
                    console.log('No graph active');
                    //make active the item that shows no available graph
                    console.log($('#no_graph')[0].classList.add('active'));
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
                map.flyTo({center: e.lngLat, zoom:13});

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
