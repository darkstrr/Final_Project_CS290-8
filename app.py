'''
Flask server is working in the backend and communicate with server-client using socket.io library.
'''
# pylint: disable=invalid-name
import os
import random
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from music_fetch import MusicFetch

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())  # This is to load your API keys from .env

connected_users = {}

rooms = {}

roomScore = {
    "players": {},
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
    try: 
        uid = request.sid #Get the client ID
        room = connected_users[uid] #Find the client's room
        connected_users.pop(uid, None) #Remove them from the userlist
        rooms[room]["players"] -= 1
        if rooms[room]["players"] == 0:
            rooms[room]["gameState"] = False
            
    except (KeyError, IndexError):
        pass
    


@socketio.on('start')
def on_start():
    """function starts when the start game button is pressed"""
    uid = request.sid
    room = connected_users[uid]
    rooms[room]["gameState"] = True
    tracks = MusicFetch()
    socketio.emit('tracks', tracks, broadcast=True, to=room)


@socketio.on('timeup')
def on_time(data):
    """Function for when the quesiton time runs out"""
    uid = request.sid
    room = connected_users[uid]
    socketio.emit('time', data, broadcast=True, to=room)


@socketio.on('nextquestion')
def next_question(data):
    """When the next quesiton appears"""
    uid = request.sid
    room = connected_users[uid]
    socketio.emit('nextquestion', data, broadcast=True, to=room)


@socketio.on('gameend')
def game_end():
    """When the game ends"""
    uid = request.sid
    room = connected_users[uid]
    socketio.emit('gameend', to=room)


@socketio.on('join')
def on_join(data):
    """When user joins a room"""
    room_name = data['roomName']
    if room_name not in rooms.keys():
        rooms[room_name] = {"gameState": False, "players": 1}
        connected_users[request.sid] = room_name
        join_room(room_name)
    elif rooms[room_name]["gameState"] == False :
        connected_users[request.sid] = room_name
        rooms[room_name]["players"] += 1
        join_room(room_name)
    else:
        socketio.emit('inprogress', to=request.sid)


@socketio.on('login')
def logged(data):
    """add user to database"""
    print(data)
    print(data)
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
            "room": room,
        }
    }
    roomScore['players'].update(newPlayer)
    return True


@socketio.on('Leaderboard')
def update_leaderboard(data):
    print(type(data))
    print(str(data))
    player = roomScore['players'][data['name']]
    player['score'] = player['score'] + data['score']
    print(player)
    print(player['score'])
    players = get_players()
    socketio.emit('Leaderboard', players, broadcast=True, include_self=True)


def get_players():
    topPlayers = []
    for key in roomScore['players']:
        newPlayer = {}
        newPlayer['username'] = key
        #print(type(newPlayer['username']))
        print(roomScore['players'][key])
        newPlayer['points'] = roomScore['players'][key]['score']
        topPlayers.append(newPlayer)
    print(topPlayers)
    return topPlayers


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
