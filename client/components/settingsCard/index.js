import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Text,
	Dimensions,
	Switch,
	TextInput
} from 'react-native'

const {width, height} = Dimensions.get('window')

export class SwitchSetting extends Component {
	constructor() {
		super()
		this.state = {
			value: true
		}
	}
	render() {
		return(
			<View style={styles.card}>
				<Text style={styles.setting}>{this.props.setting.title}</Text>
				<Switch tintColor="#094B81" onTintColor="#094B81" value={this.state.value} onChange={(e)=>{this.setState({value: !this.state.value})}}/>
			</View>
		)
	}
}

export class TextSetting extends Component {
	constructor() {
		super()
		this.state = {
			value: ''
		}
	}
	render() {
		return(
			<View style={styles.card}>
				<Text style={styles.setting}>{this.props.setting.title}</Text>
				<TextInput style={styles.textInput} placeholder={this.props.setting.placeholder || ""} value={this.state.value} onChangeText={(t)=>{this.setState({value: t})}} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	card: {
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop: 10,
		paddingBottom: 15,
		backgroundColor: '#01223E',
		justifyContent: 'space-between',
		alignItems: 'center',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#00111F',
		width: width-30,
		height: 65
	},
	textInput: {
		height: 40,
		borderColor: '#094B81',
		borderWidth: 1,
		width: width-150,
		backgroundColor: '#094B81'
	},
	setting: {
		fontSize: 20,
		color: '#094B81'
	},
	switch: {}
})