import React, { Component, Children } from 'react';
import {
  AppRegistry,
  View,
  StatusBar,
  AsyncStorage
} from 'react-native';

import io from 'socket.io-client';

import App from './screens/app';
import SocketLoader from './screens/socketLoader';

export default class HackPi extends Component {
  constructor() {
    super()
    this.state = {
      connected: false
    }
    this.socket = null;
  }
  componentWillMount() {
    AsyncStorage.getItem('@HackPi:IP', (err, result)=>{
      if(err) {
        //console.log(err)
        this.setState({
          error: true
        })
      } else {
        //console.log(result)
        if(result){
          this.socket = io.connect(result, { secure: false, jsonp: false, reconnectionDelay: 5000, transports: ['websocket'], upgrade: false, debug: true })
        } else {
          this.socket = io.connect("192.168.69.1:1337", { secure: false, jsonp: false, reconnectionDelay: 5000, transports: ['websocket'], upgrade: false, debug: true })
        }
        this.setState(this.state)
      }
    })

  }
  render() {
    //console.log(!this.state.error && this.socket)
    if(!this.state.error && this.socket){
    //will implement Navigator soon
    var appropriateScreen;
    if(this.socket.connected == true) {
      appropriateScreen = <App socket={this.socket} />
    } else {
      appropriateScreen = <SocketLoader socket={this.socket} />
    }
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />
          {appropriateScreen}
        </View>
      )
    } else {
      return null
    }
  }
}

AppRegistry.registerComponent('HackPi', () => HackPi);
