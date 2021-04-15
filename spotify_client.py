import requests
import os
from dotenv import load_dotenv, find_dotenv # finds .env file in work environement

class SpotifyAPI():

    def __init__(self, client_id, client_secret): # Constructor which accepts client_id and client_secret
        self.client_id = client_id # When SpotifyAPI object is made in app.py, pass in client_id and client_secret as parameters
        self.client_secret = client_secret
        self.token_url = "https://accounts.spotify.com/api/token" # token url needed for post request
        self.access_token = None
    
    def get_access_token(self): # Token value is processed
        token_url = self.token_url
        params = {
            "grant_type" : "client_credentials",
            "client_id" : self.client_id,
            "client_secret" : self.client_secret,
        }
        
        r = requests.post(token_url, data=params) # Post request to authenticate client creds
        data = r.json() # JSON object has access token
        access_token = data['access_token'] # Access token retrieved. The key value in the dictionary is 'access_token'
        self.access_token = access_token
        return self.access_token
    
    ######################################## BELOW ARE SPECIFIC FUNCTIONS THAT WILL BE ACTUALLY CALLED IN app.py ###################################
    
    def get_list_of_track_info(self, _id):
        endpoint = f"https://api.spotify.com/v1/artists/{_id}/top-tracks?market=US"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}" # Format to pass in information into the headers param
        }
        r = requests.get(endpoint, headers=headers)
        
        top_tracks = r.json()
        list_of_tracks = top_tracks["tracks"] # returns list of tracks that is not filtered (REALLY MESSY! NEED TO PARSE)
        filtered_tracks = [] # tracks with filtered information
        
        for track in list_of_tracks:
            song_name = track['name']
            song_image_url = track['album']['images'][0]['url']
            song_artist = track['artists'][0]['name']
            song_preview_url = track['preview_url']
            info = {
                'song_name' : song_name,
                'song_image_url' : song_image_url,
                'song_artist' : song_artist,
                'song_preview_url': song_preview_url
            }
            
            filtered_tracks.append(info)

        return filtered_tracks
        
    def get_artist_name(self, _id):
        endpoint = f"https://api.spotify.com/v1/artists/{_id}"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}" # Format to pass in information into the headers param
        }
        r = requests.get(endpoint, headers=headers)
        
        artist_info = r.json()
        artist_name = artist_info['name']

        return artist_name
        
    def get_artist_followers(self, _id):
        endpoint = f"https://api.spotify.com/v1/artists/{_id}"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}" # Format to pass in information into the headers param
        }
        r = requests.get(endpoint, headers=headers)
        
        artist_info = r.json()
        followers = artist_info['followers']['total']
        return followers
    
    def get_artist_popularity(self, _id):
        endpoint = f"https://api.spotify.com/v1/artists/{_id}"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}" # Format to pass in information into the headers param
        }
        r = requests.get(endpoint, headers=headers)
        
        artist_info = r.json()
        popularity = artist_info['popularity']
        return popularity
        
    def get_artist_image_url(self, _id):
        endpoint = f"https://api.spotify.com/v1/artists/{_id}"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}" # Format to pass in information into the headers param
        }
        r = requests.get(endpoint, headers=headers)
        
        artist_info = r.json()
        artist_image = artist_info['images'][0]['url']

        return artist_image
    
    def get_artist_spotify_url(self, _id):
        endpoint = f"https://api.spotify.com/v1/artists/{_id}"
        access_token = self.get_access_token()
        headers = {
            "Authorization": f"Bearer {access_token}" # Format to pass in information into the headers param
        }
        r = requests.get(endpoint, headers=headers)
        
        artist_info = r.json()
        spotify_url = artist_info['external_urls']['spotify']
        return spotify_url
    
    def get_lyrics(self, song_name):
        '''
        Gets lyrics of a song (song name needed as param)
        '''
        load_dotenv(find_dotenv())
        url = f"https://api.genius.com/search?q={song_name}"
        headers = {
            'Authorization': f"Bearer {os.getenv('GENIUS_TOKEN')}"
        }
        
        song_lyrics = requests.get(
            url=url,
            headers=headers,
            )
    
        theReponse = song_lyrics.json()['response']
        first_hit = theReponse['hits'][0]
        lyrics_url = first_hit['result']['url']
        return lyrics_url
    
    def check_preview_url(self, song_preview_url):
        '''
        Checks if song has a preview url
        '''
        if (song_preview_url == None):
            return False
        else:
            return True