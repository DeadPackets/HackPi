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
    this.listen = this.listen.bind(this)
  }
  componentWillMount() {
    AsyncStorage.getItem('@HackPi:IP', (err, result)=>{
      if(err) {
        console.log(err)
        this.setState({
          error: true
        })
      } else {
        console.log(result)
        if(result){
          this.socket = io.connect(result, { secure: false, jsonp: false, reconnectionDelay: 5000, transports: ['websocket'], upgrade: false, debug: true })
          this.listen()
        } else {
          this.socket = io.connect("192.168.69.1:1337", { secure: false, jsonp: false, reconnectionDelay: 5000, transports: ['websocket'], upgrade: false, debug: true })
          this.listen()
        }
        this.setState(this.state)
      }
    })
    
  }
  listen() {
    var that = this;
    this.socket.on('connect', ()=>{
      that.setState({
        connected: true
      })
    })
    this.socket.on('connect_error', ()=>{
      that.setState({
        connected: false
      })
    })
    this.socket.on('error', ()=>{
      that.setState({
        connected: false
      })
    })
    this.socket.on('disconnect', ()=>{
      that.setState({
        connected: false
      })
    })    
  }
  render() {
    console.log(!this.state.error && this.socket)
    if(!this.state.error && this.socket)
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />
          <SocketLoader socket={this.socket} connected={this.state.connected} />
          <App socket={this.socket} connected={this.state.connected} />
        </View>
      )
    else
      return null
  }
}

AppRegistry.registerComponent('HackPi', () => HackPi);
