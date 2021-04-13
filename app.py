'''
Flask server is working in the backend and communicate with server-client using socket.io library.
'''
# pylint: disable=invalid-name
import os
import random
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from music_fetch import MusicFetch

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) # This is to load your API keys from .env

roomScore = {
    "default": {
      "roomName": "",
      "players": {
          "player1": {
            "name": "",
            "score": 0,
          }
      }
    },
}
#Flask app name
app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)



cors = CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

@app.route('/', defaults={"filename": "index.html"})
@app.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)
    
# When a client connects from this Socket connection, this function is run
@socketio.on('connect')
def on_connect():
    """function print message into console when connetion is ON"""
    print('User connected!')

# When a client disconnects from this Socket connection, this function is run
@socketio.on('disconnect')
def on_disconnect():
    """function print message into console when disconnected is ON"""
    print('User disconnected!')

@socketio.on('login')
def on_start(data):
    #data is a dictionary with room and username
    newName = data["name"]
    newPlayer = {
        newName: {
            "name": newName,
            "score": 0,
        }
    }
    room = data["room"]
    #add user if room already exists
    if room in roomScore.keys():
        roomScore[room]["players"].update(newPlayer)
    #if room does not exist, create a new room with the user
    else:
        d1 = {
            room: {
                "roomName": room,
                "players": {
                    newName: {
                        "name": newName,
                        "score": 0,
                    }
                }
            },
        }
        roomScore.update(d1)
    """function starts the game when user is logged in"""
    
    MusicFetch()
@socketio.on('scoring')

def scoring(data):
    # data will be a dictionary (first key-value pair is room and room name)
    # with names as key, and correct as value
    tempList = list(data.keys())
    room = tempList[0]
    playerList = list(roomScore[room]["players"].keys())
    for player in playerList:
        if data[player] is True:
            roomScore[room]["players"][player]["score"] += 1
    socketio.emit('scoring', roomScore, broadcast=True, include_self=True)
    
    
# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    from models import Person
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8080)),
    )

