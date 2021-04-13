from spotify_client import SpotifyAPI
from dotenv import load_dotenv, find_dotenv
import os
from random import randint, shuffle

def MusicFetch():
    return_list=[]
    selected_tracks = []
    """function fetching music for the game"""
    load_dotenv(find_dotenv())
    client = SpotifyAPI(os.getenv('client_id'),os.getenv('client_secret'))
    client.get_access_token()
    tracks = client.get_list_of_track_info('4tZwfgrHOc3mvqYlEYSvVi')
    for x in range(0,4):
        track = randint(0,(len(tracks) - 1))
        selected_tracks.append(tracks[track])
        tracks.pop(track)
    return_list.append(
        {
            "questionText": selected_tracks[0]['song_preview_url'],
            "answerOptions": [
                    { "answerText": selected_tracks[0]["song_name"], "isCorrect": True }
                ]
                }
        )
    selected_tracks.pop(0)    
    for x in range (0,3):
        return_list[0]['answerOptions'].append({"answerText": selected_tracks[x]["song_name"], "isCorrect": False})
    
    shuffle(return_list[0]["answerOptions"])    
        
    print(return_list)    
    return return_list
        
    
