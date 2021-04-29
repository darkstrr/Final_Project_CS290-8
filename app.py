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

load_dotenv(find_dotenv())  # This is to load your API keys from .env

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
import models

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


@socketio.on('start')
def on_start():
    """function starts when the start game button is pressed"""
    tracks = MusicFetch()
    socketio.emit('tracks', tracks, broadcast=True)


@socketio.on('timeup')
def on_time(data):
    """Function for when the quesiton time runs out"""
    socketio.emit('time', data, broadcast=True)
    print("Time up")


@socketio.on('nextquestion')
def next_question():
    """When the next quesiton appears"""
    socketio.emit('nextquestion')


@socketio.on('gameend')
def game_end():
    """When the game ends"""
    socketio.emit('gameend')


@socketio.on('login')
def logged(data):
    """add user to database"""
    people = models.Person(username=data, password='default')
    #db.session.add(people)
    #db.session.commit()
    if (addUser(data, 'default')):
        print('success!')


def addUser(user, room):
    newPlayer = {
        user: {
            "name": user,
            "score": 0,
        }
    }
    #add user if room already exists
    if room in roomScore.keys():
        roomScore[room]["players"].update(newPlayer)
    #if room does not exist, create a new room with the user
    else:
        d1 = {
            room: {
                "roomName": room,
                "players": {
                    user: {
                        "name": user,
                        "score": 0,
                    }
                }
            },
        }
        roomScore.update(d1)
    return True

# When a client emits the event 'chat' to the server, this function is run
# 'chat' is a custom event name that we just decided
@socketio.on('chat')
def on_chat(data):
    ''' data is whatever arg you pass in your emit call on client'''
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    socketio.emit('chat', data, broadcast=True, include_self=False)

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
    from models import Person
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8080)),
    )
