from spotify_client import SpotifyAPI
from dotenv import load_dotenv, find_dotenv
import os


def MusicFetch():
    """function fetching music for the game"""
    load_dotenv(find_dotenv())
    client = SpotifyAPI(os.getenv('client_id'),os.getenv('client_secret'))
    client.get_access_token()
    print(client.get_list_of_track_info('4tZwfgrHOc3mvqYlEYSvVi'))


