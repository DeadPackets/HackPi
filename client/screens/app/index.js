import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TabBarIOS,
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import StatusCard from '../statusCard';

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      currentTab: 'status',
      status: {
        temp: {
          title: 'Temperature',
          unit: 'deg',
          data: [9,10,10,12,10,12,13,12,13,15,16,18,22,23,24,26,29],
          type: 'line'
        },
        memory: {
          title: 'Memory Usage',
          unit: 'B',
          data: [2400, 4500, 450000, 456000, 500123, 612123, 522172, 988122],
          type: 'line'
        },
        cpu: {
          title: 'CPU Usage',
          unit: '%',
          data: [70, 23, 52, 91],
          type: 'bar'
        },
        network: {
          title: 'Network Activity',
          unit: 'B',
          data: [400000, 432981, 1000000, 23000000, 23617281, 24617283, 25726183, 24736183, 26738476, 28172635],
          type: 'line'
        }
      }
    }
  }
  componentDidMount() {
    var socket = this.props.socket;
    socket.emit('get status', (data)=>{
      if(data && typeof data === 'object') {
        this.setState({
          status: {
            temp: {
              ...this.state.temp,
              data: data.temperatureArray
            },
            memory: {
              ...this.state.memory,
              data: data.memoryUsageArray
            }
          }
        })
      }
    })
  }
  render() {
    var keys = Object.keys(this.state.status).map((i)=>{
      console.log(Object.keys(this.state.status), i)
      return <StatusCard status={this.state.status[i]} key={i} />
    })
    return (
      <View style={[styles.container, (this.props.socket.connected==false ? null : {display: 'none'})]}>
        <TabBarIOS
          barTintColor={"#063964"}
          tintColor={"#01223E"}
          unselectedItemTintColor={"#17619F"}>
          <Icon.TabBarItemIOS
            iconName={'ios-pie-outline'}
            selectedIconName={'ios-pie'}
            title={"Status"}
            selected={this.state.currentTab === 'status'}
            onPress={()=>{ this.setState({ currentTab: 'status' }) }}>

            <View style={styles.tab}>
              <ScrollView>
                {keys}
              </ScrollView>
            </View>

          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            iconName={'ios-git-network'}
            selectedIconName={'ios-git-network'}
            title={"Node Map"}
            selected={this.state.currentTab === 'node map'}
            onPress={()=>{ this.setState({ currentTab: 'node map' }) }}>
            <Text style={styles.text}>Tab Two</Text>
          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            iconName={'ios-settings-outline'}
            selectedIconName={'ios-settings'}
            title={"Settings"}
            selected={this.state.currentTab === 'settings'}
            onPress={()=>{ this.setState({ currentTab: 'settings' }) }}>
            <Text style={styles.text}>Tab Three</Text>
          </Icon.TabBarItemIOS>
        </TabBarIOS>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00111F'
  },
  text: {
    color: '#4D6C47',
    fontSize: 20
  },
  tab: {
    flex: 1,
    alignItems: 'center'
  }
})
