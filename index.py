from flask import Flask, render_template, request
from os.path import join
import json
import geopandas as gpd
from analysis.bike_live_stations import get_available_stations, df_to_gdf
from analysis.model_route_click import call
from analysis.graphs import graphs_calc
import numpy as np



app = Flask(__name__)


@app.route("/", methods=['GET'])
def home():
    return render_template('main3.html')
    # return render_template('design6.html')



@app.route("/bike_services/", methods=['GET'])
def bike_services():
    with open(join('data', 'bikeServices.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/lit_score/", methods=['GET'])
def lit_score():
    with open(join('data', 'litScore.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/paved_score/", methods=['GET'])
def paved_score():
    with open(join('data', 'pavedScore.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/safety_score/", methods=['GET'])
def safety_score():
    with open(join('data', 'safetyScore.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/veg_score/", methods=['GET'])
def veg_score():
    with open(join('data', 'vegScore.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/wind_score/", methods=['GET'])
def wind_score():
    with open(join('data', 'windScore.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/streets/", methods=['GET'])
def streets():
    with open(join('data', 'streets_proj_WGS84.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/bike_facilities/", methods=['GET'])
def bike_facilities():
    with open(join('data', 'bikeFacilities.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/bike_live_stations/", methods=['GET'])
def bike_live_stations():
    with open(join('data', 'bikeLiveStations.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/bike_all_stations/", methods=['GET'])
def bike_all_stations():
    with open(join('data', 'bikeAllStations.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/bike_count_stations/", methods=['GET'])
def bike_count_stations():
    with open(join('data', 'bikeCountStations.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/district_bike_paths/", methods=['GET'])
def district_bike_paths():
    with open(join('data', 'DistrictBikePathPercentage.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/tourism/", methods=['GET'])
def tourism():
    with open(join('data', 'tourism.geojson'), encoding='utf-8') as f:
        return f.read()

@app.route("/public_transport_stops/", methods=['GET'])
def public_transport_stops():
    with open(join('data', 'public_transport_stops.geojson'), encoding='utf-8') as f:
        return f.read()



# data analysis
@app.route('/get_bike_live_stations/', methods=['GET'])
def get_bike_live_stations():
    print('get_bike_live_stations route')

    available_stations_pd = get_available_stations('Wien')
    available_stations_gdf = df_to_gdf(available_stations_pd)

    return available_stations_gdf.to_json()


@app.route('/get_bike_score_routing/', methods=['POST'])
def get_bike_score_routing():
    print('get_bike_score_routing route')

    dict = json.loads((request.data).decode())
    print('response dict: ', dict)
    safetyPref = dict['safetyPref']
    litPref = dict['litPref']
    surfacePref = dict['surfacePref']
    vegPref = dict['vegPref']
    windPref = dict['windPref']
    lengthPref = dict['lengthPref']
    source_click = dict['source_click']
    target_click = dict['target_click']

    route = call(safetyPref, litPref, surfacePref, vegPref, windPref, lengthPref, source_click, target_click)
    print('route: ', route)

    return route


@app.route('/graph/', methods=['POST'])
def post_calculated_graph_data():
    print('graph route')
    dict = json.loads((request.data).decode())
    df = gpd.GeoDataFrame.from_features(dict['data'], crs="EPSG:4326")
    print('df', df)
    print('prop', dict['prop'])

    result = graphs_calc(df, dict['prop'])
    print('graph data: ', result)
    print(type(result))

    class Int64Encoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, np.int64):
                return int(obj)
            return json.JSONEncoder.default(self, obj)



    return json.dumps(result, cls=Int64Encoder)








if __name__ == "__main__":
    app.run(debug=True, port=8000)