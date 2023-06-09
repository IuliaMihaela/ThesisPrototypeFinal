import pandas as pd
import numpy as np
import osmnx as ox
import geopandas as gpd
from shapely import wkt
from shapely.geometry import Point
from shapely.geometry import LineString
import requests
from os.path import join


gpd.options.use_pygeos = True


def call(safetyPref, litPref, surfacePref, vegPref, windPref, lengthPref, source_click, target_click):

    # get preprocessed data for edges
    scoredEdges = pd.read_csv(join('data', 'finalScoredEdges.csv'))
    # get preprocessed data for nodes
    nodes_df = pd.read_csv(join('data', 'nodes.csv'))

    # convert string to shapely linestring
    scoredEdges['geometry'] = scoredEdges['geometry'].apply(wkt.loads)

    # convert edges to gdf
    scoredEdges_gdf = gpd.GeoDataFrame(scoredEdges, crs='EPSG:4326', geometry=scoredEdges['geometry'])

    # clean edge data and set appropriate index
    scoredEdges_gdf = scoredEdges_gdf.drop(columns=['Unnamed: 0', 'index'])
    scoredEdges_gdf = scoredEdges_gdf.set_index(['u', 'v', 'key'])
    scoredEdges_gdf.to_file('scoredEdges.geojson', driver='GeoJSON')

    # wind speed and diretion

    api_key = '7a6f6f362439a9a7edf6c0a939cad36d'
    city = 'Vienna'
    country_code = 'AT'
    url = f'http://api.openweathermap.org/data/2.5/weather?q={city},{country_code}&appid={api_key}'

    response = requests.get(url)

    data = response.json()
    print("data: ", data)
    windSpeed = data['wind']['speed']
    windDirection = data['wind']['deg']
    print(f"Wind Speed: {windSpeed} m/s")
    print(f"Wind Direction: {windDirection} degrees")


    # check which wind column direction to use
    if windDirection > 337.5 and windDirection < 22.5:
        wCol = 'w1'
    elif windDirection > 22.5 and windDirection < 67.5:
        wCol = 'w2'
    elif windDirection > 67.5 and windDirection < 112.5:
        wCol = 'w3'
    elif windDirection > 112.5 and windDirection < 157.5:
        wCol = 'w4'
    elif windDirection > 157.5 and windDirection < 202.5:
        wCol = 'w5'
    elif windDirection > 202.5 and windDirection < 247.5:
        wCol = 'w6'
    elif windDirection > 247.5 and windDirection < 292.5:
        wCol = 'w7'
    else:
        wCol = 'w8'

    print("wcol: ", wCol)

    # create wind scores
    windSpeedList = scoredEdges[wCol] * windSpeed
    print("windSpeerList: ", windSpeedList)
    windScore = []
    for i in range(len(windSpeedList)):
        if windSpeedList[i] < 1.8:
            windScore.append(0)
        elif windSpeedList[i] > 1.8 and windSpeedList[i] < 3.6:
            windScore.append(0.25)
        elif windSpeedList[i] > 3.6 and windSpeedList[i] < 5.3:
            windScore.append(0.50)
        elif windSpeedList[i] > 5.3 and windSpeedList[i] < 7.6:
            windScore.append(0.75)
        elif windSpeedList[i] > 7.6:
            windScore.append(1)
        else:
            windScore.append(0.25)

    print("windscore: ", windScore)

    # add wind score to dataframe
    print(scoredEdges_gdf.columns)
    scoredEdges_gdf['windScore'] = windScore
    print("scoredEdges_gdf['windScore']: ", scoredEdges_gdf['windScore'])

    # combineing all scores

    # preferences:  0, 1 to 5,  0: don't include in weight, 1: weight the least, 5: weight the most
    combinedScore = np.array(safetyPref * scoredEdges['safetyScore']) + np.array(
        litPref * scoredEdges['litScore']) + np.array(surfacePref * scoredEdges['pavedScore']) + np.array(
        lengthPref * scoredEdges['lengthMod']) + np.array(
        vegPref * scoredEdges['vegScore'] + np.array(windPref * scoredEdges_gdf['windScore']))
    print("combinedScore: ", combinedScore)
    scoredEdges_gdf['combinedScore'] = combinedScore

    # convert node csv to df to gdf
    node_df = pd.DataFrame(
        {'y': list(nodes_df['y']),
         'x': list(nodes_df['x'])})

    node_gdf = gpd.GeoDataFrame(node_df, geometry=gpd.points_from_xy(node_df.x, node_df.y))
    node_gdf['osmid'] = list(nodes_df['osmid'])
    node_gdf = node_gdf.set_index('osmid')
    print("node_gdf: ", node_gdf)

    # make graph
    G_weighted = ox.graph_from_gdfs(node_gdf, scoredEdges_gdf)
    print("G_weighted: ", G_weighted)

    # Find node closest to start and end points
    source_point = Point(source_click['long'], source_click['lat'])
    print("source_point: ", source_point)
    target_point = Point(target_click['long'], target_click['lat'])
    print("target_point: ", target_point)

    # Get index of nearest nodes in the graph for the source and target locations
    source_index = node_gdf.sindex.nearest(source_point, return_all=False)
    target_index = node_gdf.sindex.nearest(target_point, return_all=False)
    print("source_index: ", source_index)
    print("target_index: ", target_index)

    # get osmid of nearest node
    source_node = list(node_gdf.iloc[[source_index[1][0]]].index)[0]
    target_node = list(node_gdf.iloc[[target_index[1][0]]].index)[0]
    print("source_node: ", source_node)
    print("target_node: ", target_node)

    # Calculate best route
    route = ox.distance.shortest_path(G_weighted, source_node, target_node, weight='combinedScore')
    print("route: ", route)

    # route node osmid to geometry to json
    lat_list = list(node_gdf.loc[route].x)
    long_list = list(node_gdf.loc[route].y)
    print("lat_list: ", lat_list)
    print("long_list: ", long_list)

    route_geom = LineString(zip(lat_list, long_list))
    print("route_geom ", route_geom)
    route_geojson = gpd.GeoSeries([route_geom]).to_json()
    print("route_geojson: ", route_geojson)

    return route_geojson


# print(call(1, 0, 1, 1, 1, 1500, {'long': 16.376654189593864, "lat": 48.21175079742062},
#            {'long': 16.334993968745636, "lat": 48.24487015417128}))
#
