import React, { useState } from 'react';
import '../style.css'
import Leaderboard from 'react-native-leaderboard';
// npm install --save react-native-leaderboard


function Leader(props) {
    //props is a list of names and scores of a room, in a list [ {name:"Joe ",score: 52 }]
    const data = props;
    this.state = data;
    
        return (
            <Leaderboard
                data={this.state.data}
                sortBy='score'
                labelBy='name'/>);
}
    
export default Leader;
    