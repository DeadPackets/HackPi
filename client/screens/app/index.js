import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TabBarIOS,
  ScrollView,
  WebView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import StatusCard from '../../components/statusCard';
import {
  SwitchSetting,
  TextSetting
} from '../../components/settingsCard';

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      currentTab: 'status',
      status: {
        temp: {
          title: 'Temperature',
          unit: 'deg',
          data: [],
          type: 'line'
        },
        memory: {
          title: 'Memory Usage',
          unit: '%',
          data: [],
          type: 'line'
        },
        cpu: {
          title: 'CPU Usage',
          unit: '%',
          data: [],
          type: 'line'
        }
      }
    }
    this.getSystemUpdates = this.getSystemUpdates.bind(this)
  }
  componentDidMount() {
    setInterval(this.getSystemUpdates, 1000)
  }
  getSystemUpdates() {
    var socket = this.props.socket;
    var that = this;
    socket.emit('get system info', (data)=>{
      if(data && typeof data === 'object') {
        that.setState({
          status: {
            ...this.state.status,
            temp: {
              ...this.state.status.temp,
              data: [...this.state.status.temp.data, data.cpu.temp.max]
            },
            memory: {
              ...this.state.status.memory,
              data: [...this.state.status.memory.data, (data.mem.used / data.mem.total) * 100]
            },
            cpu: {
              ...this.state.status.cpu,
              data: [...this.state.status.cpu.data, data.cpu.load.currentload]
            }
          }
        })
      }
    })
    Object.keys(this.state.status).every((i)=>{
      if(this.state.status[i].data.length > 30) {
        console.log(this.state.status[i].data.length)
        var reverse=this.state.status[i].data.slice(0).reverse();
        reverse.length = 30;
        var complete = reverse.slice(0).reverse();
        var newStatus = { 
          ...this.state.status 
        }
        newStatus[i] = {
          ...this.state.status[i],
          data: complete
        }
        this.setState({
          status: {
            ...this.state.status,
            ...newStatus
          }
        })
      }
    })
  }
  render() {
    var data = Object.keys(this.state.status).map((i)=>{
      return <StatusCard status={this.state.status[i]} key={i} />
    })
    return (
      <View style={[styles.container, (this.props.connected ? null : {display: 'none'})]}>
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
              <ScrollView showsVerticalScrollIndicator={false}>
                {data}
              </ScrollView>
            </View>

          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            iconName={'ios-git-network'}
            selectedIconName={'ios-git-network'}
            title={"Node Map"}
            selected={this.state.currentTab === 'node map'}
            onPress={()=>{ this.setState({ currentTab: 'node map' }) }}>
            <WebView 
              source={{uri: "http://104.236.177.57:1337"}} 
              scrollEnable={false} 
              style={styles.web} 
              onMessage={(e)=>{
                console.log(JSON.parse(e.nativeEvent.data))
              }}
            />
          </Icon.TabBarItemIOS>
          <Icon.TabBarItemIOS
            iconName={'ios-settings-outline'}
            selectedIconName={'ios-settings'}
            title={"Settings"}
            selected={this.state.currentTab === 'settings'}
            onPress={()=>{ this.setState({ currentTab: 'settings' }) }}>

            <View style={styles.tab}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <SwitchSetting setting={{ title: 'A', value: false }} />
                <SwitchSetting setting={{ title: 'Bunch', value: false }} />
                <SwitchSetting setting={{ title: 'Of', value: false }} />
                <TextSetting setting={{ title: 'Options', value: 'test' }} />
              </ScrollView>
            </View>

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
    marginTop: 10,
    flex: 1,
    alignItems: 'center'
  },
  web: {
    flex: 1
  }
})
