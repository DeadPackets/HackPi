import React, { Component } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StockLine, Bar } from 'react-native-pathjs-charts';

const {width, height} = Dimensions.get('window')
const add = (a,b)=>{return a+b}

export default class StatusCard extends Component {
  constructor() {
    super()
    this.format = this.format.bind(this)
  }
  format(number) {
    if(this.props.status.type == 'bar' && this.props.status.data.length > 0){
      var number = (this.props.status.data.reduce(add, 0)) / this.props.status.data.length;
    }
    if(number / 1e+9 > 1) {
      return parseInt(number / 1e+9) + 'G'
    } else if (number / 1000000 > 1) {
      return parseInt(number / 1000000) + 'M'
    } else if (number / 1000 > 1) {
      return parseInt(number / 1000) + 'K'
    } else {
      return parseInt(number)
    }
  }
  getLineGraphData() {
    if(this.props.status.data.length > 0){
      var graphData = this.props.status.data.map((i, j) => {
        return { "x":j, "y":i }
      })
    } else {
      var graphData = [{"x": 0, "y": 0}]
    }

    var data = [
      graphData
    ]
    var options = {
      width: width - 70,
      height: 80,
      max: 100,
      min: 0,
      color: '#094B81',
      margin: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      gutter: 20,
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      axisX: {
        showAxis: false,
        showLines: false,
        showLabels: false,
        showTicks: false,
        zeroAxis: false,
        orient: 'bottom',
        label: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: true,
          fill: '#34495E'
        }
      },
      axisY: {
        showAxis: false,
        showLines: false,
        showLabels: false,
        showTicks: false,
        zeroAxis: false,
        orient: 'left',
        label: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: true,
          fill: '#34495E'
        }
      }
    }

    return [options, data]
  }
  getBarGraphData() {
    if(this.props.status.data.length > 0)
      var graphData = this.props.status.data.map((i, j) => {
        return {"name": "cpu"+(j+1), "v": i}
      })
    else
      var graphData = [{"name": "cpu1", "v": 0},{"name": "cpu2", "v": 0},{"name": "cpu3", "v": 0},{"name": "cpu4", "v": 0}]
    var data = [
      graphData
    ]
    var options = {
      width: width - 70,
      height: 80,
      color: '#094B81',
      margin: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      },
      gutter: 20,
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      axisX: {
        showAxis: false,
        showLines: false,
        showLabels: false,
        showTicks: false,
        zeroAxis: false,
        orient: 'bottom',
        label: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: true,
          fill: '#34495E'
        }
      },
      axisY: {
        min: 0,
        max: 100,
        showAxis: false,
        showLines: false,
        showLabels: false,
        showTicks: false,
        zeroAxis: false,
        orient: 'left',
        label: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: true,
          fill: '#34495E'
        }
      }
    }
    return [options, data]
  }
  render() {
    if(this.props.status.type == 'bar') { 
      var timeline = "Live" 
    } else { 
      var timeline = "30s" 
    }
    if(this.props.status.type == 'line')
      var graphData = this.getLineGraphData()
    else if (this.props.status.type == 'bar')
      var graphData = this.getBarGraphData()
    else
      var graphData = null;

    if(this.props.status.type == 'line'){
      var graph = <StockLine data={graphData[1]} options={graphData[0]} xKey='x' yKey='y' style={styles.chart} />
    } else if (this.props.status.type == 'bar'){
      var graph = <Bar data={graphData[1]} options={graphData[0]} accessorKey='v' />
    }
    return (
      <View style={styles.card}>
        <View style={styles.statusBar}>
          <Text style={styles.status}>{timeline}</Text>
          <Text style={styles.status}>{this.props.status.title}</Text>
          <Text style={styles.status}>{this.format(this.props.status.data[this.props.status.data.length-1] || 0)}{this.props.status.unit}</Text>
        </View>
        <View style={styles.chart}>
          {graph}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor: '#01223E',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'column'
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width-70,
    marginBottom: 2
  },
  chart: {
    borderWidth: 1,
    borderColor: '#094B81'
  },
  status: {
    fontSize: 10,
    color: '#094B81'
  }
})
