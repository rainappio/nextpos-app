import React, { Component } from "react";
import { connect } from 'react-redux'
import { StyleSheet, View, Text, PanResponder, Animated, ScrollView, DismissKeyboard, Dimensions } from "react-native";
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

  componentDidMount() {
	  this.props.getTableLayout(this.props.navigation.state.params.layoutId)
  }

  render() {
	  const { tablelayout } = this.props
  	const layoutId = this.props.navigation.state.params.layoutId !== false && this.props.navigation.state.params.layoutId;

    return (
      <View style={[styles.container_nocenterCnt]}>
    		<ScreenHeader title={"Table Layout Position"}/>
        <View style={{flex: 1}}>
          <View style={styles.ballContainer}>
            <View>
              {
                tablelayout.tables.map(table => {
                    return (<Draggable table={table} key={table.tableId} layoutId={layoutId} getTableLayout={this.props.getTableLayout}/>)
                  }
                )
              }
            </View>

          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  tablelayout: state.tablelayout.data,
  haveData: state.tablelayout.haveData,
  haveError: state.tablelayout.haveError,
  isLoading: state.tablelayout.loading
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getTableLayout: (id) => dispatch(getTableLayout(id))
})

export default connect(
  mapStateToProps,
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

  componentDidMount() {
    if (this.props.table.position != null) {
      this.state.pan.setValue({x: Number(this.props.table.position.x), y: Number(this.props.table.position.y)})
    } else {
      this.state.pan.setValue({ x:0, y:0})
    }
  }

  UNSAFE_componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gesture) => {
        this.state.pan.setOffset({
          x: this.state.pan.x._value,
          y: this.state.pan.y._value
        })
        //this.state.pan.setValue({ x:0, y:0})
      },
      onPanResponderMove: Animated.event([
        null, { dx: this.state.pan.x, dy: this.state.pan.y }
      ]),
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        console.log(`on release: ${JSON.stringify(this.state.pan)}`)

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
    // this.state.pan.x.removeAllListeners();
    // this.state.pan.y.removeAllListeners();
  }

  isDropArea(e,gesture) {
  	const layoutId = this.props.layoutId;
  	const tableId = this.props.table.tableId;
    console.debug(`event: ${e.nativeEvent.locationX} ${e.nativeEvent.locationY} ${e.nativeEvent.pageX} ${e.nativeEvent.pageY}`)
  	console.debug(`gesture: ${JSON.stringify(gesture)}`)
  	console.debug(this.state.pan)

    dispatchFetchRequest(api.tablelayout.updateTablePosition(layoutId, tableId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({x: JSON.stringify(this.state.pan.x), y: JSON.stringify(this.state.pan.y)})
    }, response => {
      successMessage('Saved')
      this.props.getTableLayout(layoutId)
    }).then()

    return true
  }

	renderDraggable(table) {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }

  	return (
  		<View>
        <Animated.View
          {...this.panResponder.panHandlers}
          style={[panStyle, styles.circle, {position: 'absolute'}]}
        >
          <Text style={{color: '#fff', textAlign: 'center', marginTop: 15}} >{table.tableName}</Text>
        </Animated.View>
  		</View>
  	);
  }

  render() {
  	const { table } = this.props

    return (
      <View style={{alignItems: "flex-start", borderWidth: 0, marginBottom: 0}} ref='self'>
        {this.renderDraggable(table)}
      </View>
    );
  }
}
//https://snack.expo.io/@yoobidev/draggable-component
