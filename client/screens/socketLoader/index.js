import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AlertIOS,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default class SocketLoader extends Component {
  constructor() {
    super()
    this.state = {
      status: 'CONNECTING',
      red: false
    }
  }

  componentDidMount() {
    var socket = this.props.socket;
    console.log(socket)
    socket.on('connect_error', (data)=>{
      this.setState({ status: data.toString().toUpperCase(), red: true })
    })
    socket.on('reconnect_attempt', ()=>{
      this.setState({ status: 'RETRYING', red: false })
    })

  }
  formatIP(uri) {
    return uri.replace('http://', '')
  }
  getNewIP() {
    AlertIOS.prompt(
      'New IP',
      'This will be used to make the socket connection.',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: ip => {
          AsyncStorage.setItem('@HackPi:IP', ip)
        }},
      ],
      'plain-text'
    );
  }
  render() {
    let status = this.state.red ? styles.red : styles.green;
    return (
      <View style={[styles.container, (this.props.connected ? {display: 'none'} : null)]}>
        <Text style={styles.text}>HackPi</Text>
        <TouchableOpacity style={styles.ip} onPress={this.getNewIP}>
          <Text style={styles.info}>{this.formatIP(this.props.socket.io.uri)}</Text>
          <Icon name="ios-create-outline" style={styles.edit} />
        </TouchableOpacity>
        <Text style={[styles.status, status]}>{this.state.status}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D211D',
  },
  ip: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  edit: {
    color: '#4D6C47',
    fontSize: 25,
    marginLeft: 5
  },
  text: {
    fontSize: 100,
    textAlign: 'center',
    color: '#4D6C47',
    fontWeight: "100"
  },
  info: {
    textAlign: 'center',
    fontSize: 30,
    color: '#4D6C47',
    fontWeight: "100"
  },
  status: {
    textAlign: 'center',
    fontSize: 30,
    color: '#4D6C47',
    fontWeight: "100"
  },
  red: {
    color: '#AB5042'
  },
  image: {
    height: 100,
    width: 100,
    margin: 20
  }
});
