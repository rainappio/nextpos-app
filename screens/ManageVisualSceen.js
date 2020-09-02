import React, {Component} from "react";
import {connect} from 'react-redux'
import {Animated, PanResponder, Text, TouchableOpacity, View, Dimensions} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import {api, dispatchFetchRequest} from '../constants/Backend'
import {getTableLayout} from '../actions'
import styles from '../styles'
import LoadingScreen from "./LoadingScreen";
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";

class ManageVisualSceen extends Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context);
    const windowWidth = Dimensions.get('window').width - 30;
    const windowHeight = Dimensions.get('window').height - 76;
    console.log("SCREEN SIZE", context?.isTablet);

    this.state = {
      windowWidth: Dimensions.get('window').width - 30,
      windowHeight: Dimensions.get('window').height - 76,
    }

    context.localize({
      en: {
        manageVisualLayoutTitle: 'Manage Visual Layout'
      },
      zh: {
        manageVisualLayoutTitle: '管理桌位位置'
      }
    })
  }

  componentDidMount() {
    this.props.getTableLayout(this.props.navigation.state.params.layoutId)
  }

  render() {
    const {tablelayout, isLoading} = this.props
    const {t} = this.context
    const layoutId = this.props.navigation.state.params.layoutId !== false && this.props.navigation.state.params.layoutId;


    if (isLoading) {
      return (
        <LoadingScreen />
      )
    }

    return (
      <ThemeContainer>
        <View style={[styles.container]}>
          <ScreenHeader title={t('manageVisualLayoutTitle')} />
          {/* <Text onPress={() => this.forceRefresh()} style={{ borderWidth: 1, width: 120, textAlign: 'center', padding: 8, borderRadius: 2 }}>Reset Positions</Text> */}
          <View style={{flex: 1}}>
            <View onLayout={(event) => {
              let {x, y, width, height} = event.nativeEvent.layout;
              this.setState({
                tableWidth: width,
                tableHeight: height,
              })
            }} style={[styles.ballContainer, {paddingLeft: 8, height: '100%', marginTop: 22}]}>
              <View>
                {
                  tablelayout.tables.map(table => {
                    return (this.state?.tableWidth && <Draggable
                      table={table}
                      key={table.tableId}
                      layoutId={layoutId}
                      getTableLayout={this.props.getTableLayout}
                      tableWidth={this.state?.tableWidth ?? this.state?.windowWidth}
                      tableHeight={this.state?.tableHeight ?? this.state?.windowHeight}

                    />)
                  })
                }
              </View>
            </View>
          </View>
        </View>
      </ThemeContainer>
    );
  }
}

const mapStateToProps = state => ({
  tablelayout: state.tablelayout.data,
  haveData: state.tablelayout.haveData,
  haveError: state.tablelayout.haveError,
  isLoading: state.tablelayout.loading
})

const mapDispatchToProps = (dispatch) => ({
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
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      opacity: new Animated.Value(1)
    };
  }

  componentDidMount() {
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    if (this.props.table.position != null) {
      this.state.pan.setValue({x: Number(this.props.table.position.x * windowWidth), y: Number(this.props.table.position.y * windowHeight)})
    } else {
      this.state.pan.setValue({x: 0, y: 0})
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
        null, {dx: this.state.pan.x, dy: this.state.pan.y}
      ]),
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        console.log(`on release: ${JSON.stringify(this.state.pan)}`)

        if (this.isDropArea(e, gesture)) {
          Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 1000
          }).start();
        }
      }
    });
  }

  isDropArea(e, gesture) {
    const layoutId = this.props.layoutId;
    const tableId = this.props.table.tableId;
    console.debug(`event: ${e.nativeEvent.locationX} ${e.nativeEvent.locationY} ${e.nativeEvent.pageX} ${e.nativeEvent.pageY}`)
    console.debug(`gesture: ${JSON.stringify(gesture)}`)
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    const numberX = {...this.state.pan.x};
    const numberY = {...this.state.pan.y};
    console.debug(this.state.pan, windowWidth, typeof numberX, numberX._value * 6 / windowWidth)

    dispatchFetchRequest(api.tablelayout.updateTablePosition(layoutId, tableId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({x: numberX._value / windowWidth, y: numberY._value / windowHeight})
    }, response => {
      this.props.getTableLayout(layoutId)
    }).then()

    return true
  }

  handleReset = (layoutId, tableId) => {
    dispatchFetchRequest(api.tablelayout.updateTablePosition(layoutId, tableId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    }, response => {
      this.props.getTableLayout(layoutId)
    }).then()
    return true
  }

  renderDraggable(layoutId, table) {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }

    return (
      <View style={{padding: 4}}>
        {
          table.position !== null
            ?
            <View>
              <TouchableOpacity key={table.tableId}
                onPress={() => this.handleReset(layoutId, table.tableId)}>
                <StyledText style={{
                  borderWidth: 0.5,
                  textAlign: 'center',
                  padding: 4,
                  fontSize: 12,
                  borderRadius: 4,
                  width: 60
                }}>Reset-{table.tableName}
                </StyledText>
              </TouchableOpacity>
              <Animated.View
                {...this.panResponder.panHandlers}
                style={[panStyle, styles.circle, {position: 'absolute'}]}
              >
                <Text style={{color: '#fff', textAlign: 'center', marginTop: 15}}>{table.tableName}</Text>
              </Animated.View>
            </View>
            :
            <Animated.View
              {...this.panResponder.panHandlers}
              style={[panStyle, styles.circle, {marginTop: 8}]}
            >
              <Text style={{color: '#fff', textAlign: 'center', marginTop: 15}}>{table.tableName}</Text>
            </Animated.View>
        }
      </View>
    );
  }

  render() {
    const {table, layoutId} = this.props
    return (
      <View style={{alignItems: "flex-start", borderWidth: 0, marginBottom: 0}} ref='self'>
        {this.renderDraggable(layoutId, table)}
      </View>
    );
  }
}

//https://snack.expo.io/@yoobidev/draggable-component
