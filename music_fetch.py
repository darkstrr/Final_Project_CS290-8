from spotify_client import SpotifyAPI
from dotenv import load_dotenv, find_dotenv
import os
from random import randint, shuffle


def MusicFetch():
    artists = [
        '4tZwfgrHOc3mvqYlEYSvVi', '4YRxDV8wJFPHPTeXepOstw',
        '3xU8YsNNkmWSPewlB18NUz', '5f4QpKfy7ptCHwTqspnSJI',
        '6vWDO969PvNqNYHIOW5v0m', '7jefIIksOi1EazgRTfW2Pk',
        '0oSGxfWSnnOXhD2fKuz2Gy', '4gzpq5DPGxSnKTe4SA8HAU',
        '6eUKZXaKkcviH0Ku9w2n3V'
    ]
    return_list = []
    selected_tracks = []
    """function fetching music for the game"""
    load_dotenv(find_dotenv())
    client = SpotifyAPI(os.getenv('CLIENT_ID'), os.getenv('CLIENT_SECRET'))
    client.get_access_token()
    # Run 5 times for 5 questions
    for y in range(0, 5):
        #Pull random tracks from a random artist
        tracks = client.get_list_of_track_info(artists[randint(
            0, (len(artists) - 1))])
        
        for x in range(0, 4):
            print(len(tracks))
            track = randint(0, (len(tracks) - 1))
            select = False
            while not select:
                if tracks[track]['song_preview_url']:
                    selected_tracks.append(tracks[track])
                    select = True
                tracks.pop(track)
        return_list.append({
            "questionText":
            selected_tracks[0]['song_preview_url'],
            "answerOptions": [{
                "answerText": selected_tracks[0]["song_name"],
                "isCorrect": True
            }]
        })
        selected_tracks.pop(0)
        for x in range(0, 3):
            return_list[y]['answerOptions'].append({
                "answerText":
                selected_tracks[x]["song_name"],
                "isCorrect":
                False
            })

        shuffle(return_list[y]["answerOptions"])
        selected_tracks.clear()

    print(return_list)
    return return_list
