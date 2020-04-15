import React, { Component } from "react";
import { connect } from 'react-redux'
import { StyleSheet, View, Text, PanResponder, Animated, ScrollView, DismissKeyboard, FlatList } from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import {
  successMessage,
  api,
  makeFetchRequest,
  errorAlert, dispatchFetchRequest
} from '../constants/Backend'
import { getTableLayout } from '../actions'
import styles from '../styles'

class ManageVisualSceen extends Component {
	static navigationOptions = {
    header: null
  }

  render() {
  	var layoutId = this.props.navigation.state.params.layoutId !== false && this.props.navigation.state.params.layoutId;
		var tables = this.props.navigation.state.params.tables !== undefined && this.props.navigation.state.params.tables;

    return (
      <View style={[styles.container_nocenterCnt]}>
    		<ScreenHeader title={"Table Layout Position"}/>
    		<View style={{flex:1}}>
        	<View style={styles.ballContainer}/>     
        	<View style={[styles.col, {
        		width: 80, 
        		position: 'absolute'
        	}]}>
          	{
          		tables.map(table =>
								<Draggable table={table} key={table.tableId} layoutId={layoutId} getTableLayout={this.props.getTableLayout}/>
          		)
          	}
        	</View>
        </View>
      </View>    
    );
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getTableLayout: (id) => dispatch(getTableLayout(id))
})

export default connect(
  null,
  mapDispatchToProps
)(ManageVisualSceen)

class Draggable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDraggable: true,
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }

  // componentDidMount(){
  // 	setTimeout(() => {
  //     this.refs.self.measure((fx, fy, width, height, px, py) => {
  //       console.log('Component width is: ' + width)
  //       console.log('Component height is: ' + height)
  //       console.log('X offset to frame: ' + fx)
  //       console.log('Y offset to frame: ' + fy)
  //       this.offset = { fx, fy, width, height }
  //     })
  //   }, 0)
  // }

  UNSAFE_componentWillMount() {
    this._val = { x:0, y:0 }
    this.state.pan.addListener((value) => this._val = value);

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          // x: this._val.x,
          // y:this._val.y
          x: this.state.pan.x._value,
          y: this.state.pan.y._value
        })
        this.state.pan.setValue({ x:0, y:0})
      },
      onPanResponderMove: Animated.event([ 
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gesture) => {      	
        if (this.isDropArea(e,gesture)) {
          Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 1000
          }).start(() =>
            this.setState({
              showDraggable: false
            })
          );
        } 
      }
    });
  }

	componentWillUnmount() {
    this.state.pan.x.removeAllListeners();  
    this.state.pan.y.removeAllListeners();
  }

  isDropArea(e,gesture) {  
  	var layoutId = this.props.layoutId;
  	var tableId = this.props.table.tableId;	
  	console.log(this.state.pan)
  	console.log(e.nativeEvent.locationX.toFixed(2))
  	console.log(e.nativeEvent.locationY.toFixed(2))
  	console.log("isDropArea fun hit")

  	//return;
  
  		dispatchFetchRequest(api.tablelayout.updateTablePosition(layoutId, tableId), {
      	method: 'POST',
      	withCredentials: true,
      	credentials: 'include',
      	headers: {
        	'Content-Type': 'application/json',
      	},
      	body: JSON.stringify({x: e.nativeEvent.locationX.toFixed(2), y: e.nativeEvent.locationY.toFixed(2)})
    	}, response => {
    		successMessage('Saved')      
      	this.props.getTableLayout(layoutId)
    	}).then()		 
      
    return gesture.moveY < 200;
  } 
	
	renderDraggable(table) {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }   
  	var x = table.position !== null && parseInt(table.position.x)
  	var y = table.position !== null && parseInt(table.position.y)

  	return (  		
  		<View>  	 
  		{
  			table.position !== null
  			?
  				<Animated.View
      			{...this.panResponder.panHandlers}        	
      			style={[panStyle, styles.circle,{position: 'absolute', marginLeft: x, marginTop: y}]}        	
    			>
      			<Text style={{color: '#fff', textAlign: 'center', marginTop: 15}} >{table.tableName}</Text>
    			</Animated.View>   
    		:
    			<Animated.View
      			{...this.panResponder.panHandlers}        	
      			style={[panStyle, styles.circle]}        	
    			>
      			<Text style={{color: '#fff', textAlign: 'center', marginTop: 15}} >{table.tableName}</Text>
    			</Animated.View>   		
  			}
  		</View>  		
  	);
  }

  render() {
  	const { table } = this.props;
  	
    return (
      <View style={{alignItems: "flex-start", marginBottom: 8}} ref='self'>
      {this.renderDraggable(table)}   			
      </View>
    );
  }  
}
//https://snack.expo.io/@yoobidev/draggable-component