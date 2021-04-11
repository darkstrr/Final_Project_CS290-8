'''
Flask is working in the backend and communicate with server-client using socket.io library.
'''
# pylint: disable=invalid-name
import os
from flask import Flask, send_from_directory, json, request
from flask_socketio import SocketIO, join_room, leave_room
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy


from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv()) # This is to load your API keys from .env

#Dictionary of users in the format: socketid[username,roomname]
users = {}

#Function to get users in room, very inefficent, have to find a better way but this will work for now.
def get_users(room): #Room name is passed in.
    returnList = [] #List that will be returned
    for x in users.values(): #Get all the values from the userlist
        if x[1] == room: #Check if the current user is in the specified room (This is an awful way of doing this...)
            returnList.append(x[0]) #If so, add it to our return list
            
    return returnList


#Flask app name
app = Flask(__name__, static_folder='./build/static')

# Point SQLAlchemy to your Heroku database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

# Gets rid of a warning
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#database instance db
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
    print('User disconnected!' + request.sid)
    #Try/except in case user is not in a room
    try: 
        uid = request.sid #Get the client ID
        room = users[uid][1] #Find the client's room
        users.pop(request.sid, None) #Remove them from the userlist
        socketio.emit('users',get_users(room), to=room) #Tell clients to update their userlist
    except (KeyError, IndexError):
        pass
    
@socketio.on('login')
def on_login(data):
    """function that handles logging in user to room"""
    #When the user logs in, add their ID to the users dictionary along with their username and room
    users[str(request.sid)] = [data['userName'],data['userRoom']]
    #Join this user to the room
    join_room(data['userRoom'])
    #Emit to other users in the room the current list
    socketio.emit('users',get_users(data['userRoom']), to=data['userRoom'])

@socketio.on("logout")
def on_logout():
    """Function that handles when user logs out"""
    try:
        uid = request.sid #Get the client ID
        room = users[uid][1] #Find the client's room
        users.pop(request.sid, None) #Remove them from the userlist
        socketio.emit('users',get_users(room), to=room) #Tell clients to update their userlist
    except (KeyError, IndexError):
        pass
# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call socketio.run with app arg
  
    socketio.run(
        app,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )

