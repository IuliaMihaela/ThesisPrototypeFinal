import requests
import pandas as pd
import geopandas

def get_city_data(city):
    '''
    :param city:
    :return: list of dictionaries with information about the requested city
    '''

    city_bike_networks = requests.get("http://api.citybik.es/v2/networks").json()

    list_of_dicts = []
    for city_bike_dict in city_bike_networks['networks']:
      new_city = city_bike_dict['location']['city']
      if new_city.lower() == city.lower():
          list_of_dicts.append(city_bike_dict)

    return list_of_dicts



def get_stations_info(city):
    '''
    :param city:
    :return: the city's list of stations’ info
    '''

    station_dict = get_city_data(city)
    if not station_dict:
        print("Error: No bike company found for {}".format(city))
        return None

    network_address = station_dict[0]['href']
    url = "http://api.citybik.es/{}".format(network_address)
    return requests.get(url).json()['network']['stations']



def get_available_stations(city = "Wien"):
    '''
    :param city:
    :return: a pandas dataframe containing information about the city
    Default city name is Wien
    '''

    station_info = get_stations_info(city)

    station_list = []
    for info in station_info:

        a_dict = {
            'Station Name': info['name'],
            'empty_slots' : info['empty_slots'],
            'free_bikes' : info['free_bikes'],
            'latitude' : info['latitude'],
            'longitude' : info['longitude'],
            'timestamp' : info['timestamp'],
            'Unique ID': info['extra']['uid'],
        }
        station_list.append(a_dict)

    return pd.DataFrame(station_list)


def df_to_gdf(data_pd):
    '''

    :param pd:
    :return: a geodataframe with all available stations
    '''

    data_pd['timestamp'] = pd.to_datetime(data_pd['timestamp'][0]).strftime('%a %d %B, %Y at %H:%M')

    gdf = geopandas.GeoDataFrame(
        data_pd, geometry=geopandas.points_from_xy(data_pd.longitude, data_pd.latitude))
    return gdf

available_stations = get_available_stations('Wien')
available_stations_gdf = df_to_gdf(available_stations)

# available_stations_gdf.to_file('bike_stations.geojson', driver='GeoJSON')