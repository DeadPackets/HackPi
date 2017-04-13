import React, { Component, Children } from 'react';
import {
  AppRegistry,
  View,
  StatusBar
} from 'react-native';

import io from 'socket.io-client';

import App from './screens/app';
import SocketLoader from './screens/socketLoader';

const SERVER_CONFIG = {
  HOST: '10.8.0.1:1337' //this should be dynamic, or fixed to the HackPi's default IP, aka 192.168.69.1 and the port is 443 FOR NOW
}

const socket = io.connect(SERVER_CONFIG.HOST, { secure: false, jsonp: false, reconnectionDelay: 5000, transports: ['websocket'], upgrade: false, debug: true })

export default class HackPi extends Component {
  constructor() {
    super()
    this.state = {
      connected: false
    }
  }
  componentDidMount() {
    var that = this;
    socket.on('connect', ()=>{
      that.setState({
        connected: true
      })
    })

    socket.on('disconnect', ()=>{
      that.setState({
        connected: false
      })
    })
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar
          barStyle="light-content"
        />
        <SocketLoader socket={socket} connected={this.state.connected} config={SERVER_CONFIG} />
        <App socket={socket} connected={this.state.connected} />
      </View>
    )
  }
}

AppRegistry.registerComponent('HackPi', () => HackPi);
