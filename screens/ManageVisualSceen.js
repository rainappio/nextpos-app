import React, {Component} from "react";
import {connect} from 'react-redux'
import {Animated, PanResponder, Text, TouchableOpacity, View, Dimensions} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {getTableLayout, getTableLayouts} from '../actions'
import styles, {mainThemeColor} from '../styles'
import LoadingScreen from "./LoadingScreen";
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {getInitialTablePosition, getTablePosition, getModNum} from "../helpers/tableAction";
import AddBtn from '../components/AddBtn'
import Modal from 'react-native-modal';
import TableAddModal from './TableAddModal';

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
      modalVisible: false,
      tableIndex: 0,
      isLoading: false
    }

    context.localize({
      en: {
        manageVisualLayoutTitle: 'Manage Visual Layout',
        resetTables: 'Reset'
      },
      zh: {
        manageVisualLayoutTitle: '管理桌位位置',
        resetTables: '復原'
      }
    })
  }

  componentDidMount() {
    this.props.getTableLayouts()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps?.isLoading !== this.props?.isLoading && !this.props?.isLoading) {
      this.setState({isLoading: false})
    }
  }
  handleReset = async (layoutId, tableId) => {
    await dispatchFetchRequestWithOption(api.tablelayout.updateTablePosition(layoutId, tableId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    }, {
      defaultMessage: false
    }, response => {

    }).then()
    return true
  }
  render() {
    const {tablelayouts} = this.props
    const {t, themeStyle} = this.context
    if (this.state?.isLoading) {
      return (
        <LoadingScreen />
      )
    }

    return (
      <ThemeContainer>
        <View style={[styles.container]}>
          <ScreenHeader title={t('manageVisualLayoutTitle')}
            rightComponent={
              <AddBtn
                onPress={() => this.setState({modalVisible: true})}
              />
            } />
          <Modal
            isVisible={this.state.modalVisible}
            backdropOpacity={0.7}
            onBackdropPress={() => this.setState({modalVisible: false})}
            useNativeDriver
            hideModalContentWhileAnimating
            animationIn='bounceIn'
            animationOut='bounceOut'
            style={{alignSelf: 'center', maxWidth: 640}}
          >
            <TableAddModal layoutId={tablelayouts[this.state.tableIndex]?.id} closeModal={() => {
              this.setState({modalVisible: false})
            }}
              setLoading={() => this.setState({isLoading: true})}
            />
          </Modal>


          <View style={{flexDirection: 'row', width: '100%', minHeight: 80}}>
            {tablelayouts?.map((tblLayout, index) => {
              return (<TouchableOpacity
                disabled={this.state?.screenMode === 'joinTable'}
                style={{
                  borderColor: mainThemeColor,
                  borderWidth: 0.5,
                  borderBottomWidth: 0,
                  padding: 4,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  width: 120,
                  backgroundColor: this.state?.tableIndex === index ? themeStyle.color : null,
                }}
                onPress={() => {this.setState({tableIndex: index})}}>
                <StyledText style={[styles.sectionBarText, {flex: 4, textAlign: 'center', marginRight: 4}]}>
                  {tblLayout?.layoutName}
                </StyledText>



              </TouchableOpacity>)
            })}
            <View style={{alignSelf: 'center', right: 0, position: 'absolute'}}>
              <TouchableOpacity
                style={{width: 60}}
                onPress={async () => {

                  this.setState({isLoading: true})
                  for (let i = 0; i < tablelayouts[this.state.tableIndex]?.tables?.length; i++) {
                    await this.handleReset(tablelayouts[this.state.tableIndex]?.id, tablelayouts[this.state.tableIndex]?.tables?.[i]?.tableId)
                  }
                  this.props.getTableLayouts()
                }}>
                <StyledText style={{
                  borderWidth: 0.5,
                  textAlign: 'center',
                  padding: 4,
                  fontSize: 12,
                  borderRadius: 4,
                  width: 60
                }}>{t('resetTables')}
                </StyledText>
              </TouchableOpacity>
            </View>


          </View>
          <View style={{flex: 1}}>
            <View onLayout={(event) => {
              let {x, y, width, height} = event.nativeEvent.layout;
              this.setState({
                tableWidth: width,
                tableHeight: height,
              })
            }} style={[styles.ballContainer, {height: '100%'}]}>
              <View style={{flexWrap: 'wrap'}}>
                {
                  tablelayouts[this.state.tableIndex]?.tables.map((table, index) => {
                    let positionArr = tablelayouts[this.state.tableIndex]?.tables?.map((table, index) => {
                      if (table.position != null) {
                        return {...getTablePosition(table, this.state?.tableWidth ?? this.state?.windowWidth, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                      } else {
                        return {...getInitialTablePosition(index, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                      }
                    })
                    console.log('positionArr', JSON.stringify(positionArr))
                    return (this.state?.tableWidth && <Draggable
                      table={table}
                      key={table.tableId}
                      index={index}
                      layoutId={tablelayouts[this.state.tableIndex]?.id}
                      getTableLayouts={this.props.getTableLayouts}
                      tableWidth={this.state?.tableWidth ?? this.state?.windowWidth}
                      tableHeight={this.state?.tableHeight ?? this.state?.windowHeight}
                      positionArr={positionArr}
                    />)
                  })
                }
              </View>
            </View>
          </View>

          <View style={{...styles.bottomButtonContainerWithoutFlex, marginTop: 0, flexDirection: 'row', minHeight: 48}}>

          </View>
        </View>
      </ThemeContainer>
    );
  }
}

const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  haveData: state.tablelayouts.haveData,
  haveError: state.tablelayouts.haveError,
  isLoading: state.tablelayouts.loading
})

const mapDispatchToProps = (dispatch) => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts()),
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
      opacity: new Animated.Value(1),
      isInit: false
    };
  }

  componentDidMount() {
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    if (this.props.table.position != null) {
      this.state.pan.setValue(getTablePosition(this.props.table, windowWidth, windowHeight))
    } else {
      this.state.pan.setValue(getInitialTablePosition(this.props.index, windowHeight))
      const layoutId = this.props.layoutId;
      const tableId = this.props.table.tableId;
      const numberX = getInitialTablePosition(this.props.index, windowHeight).x;
      const numberY = getInitialTablePosition(this.props.index, windowHeight).y;

      dispatchFetchRequestWithOption(api.tablelayout.updateTablePosition(layoutId, tableId), {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({x: numberX / windowWidth, y: numberY / windowHeight})
      }, {
        defaultMessage: false
      }, response => {
        this.props.getTableLayouts()
      }).then()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    if (prevProps?.table !== this.props?.table) {
      if (this.props.table.position != null) {
        this.state.pan.setValue(getTablePosition(this.props.table, windowWidth, windowHeight))
      } else {
        this.state.pan.setValue(getInitialTablePosition(this.props.index, windowHeight))
      }
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
        this.state.pan.setValue({x: 0, y: 0})
      },
      onPanResponderMove: Animated.event([
        null, {dx: this.state.pan.x, dy: this.state.pan.y}
      ]),
      onPanResponderRelease: (e, gesture) => {
        this.state.pan.flattenOffset();
        console.log(`on release: ${JSON.stringify(this.state.pan)}`)

        if (this.handleDragEnd(this.state.pan)) {
          this.isDropArea(e, gesture)
        } else {
          const windowWidth = this.props.tableWidth;
          const windowHeight = this.props.tableHeight;
          if (this.props.table.position != null) {
            this.state.pan.setValue(getTablePosition(this.props.table, windowWidth, windowHeight))
          } else {
            this.state.pan.setValue(getInitialTablePosition(this.props.index, windowHeight))
          }
        }
      }
    });
  }

  handleDragEnd = (pan) => {
    let positionArr = this.props.positionArr
    console.log('positionArr', positionArr)
    let flag = true
    positionArr?.forEach((table) => {
      let dx = Math.abs(getModNum(pan.x?._value, 10) - table?.x)
      let dy = Math.abs(getModNum(pan.y?._value, 10) - table?.y)
      let dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
      if (dis < 90 && this.props?.table?.tableId !== table?.tableId) {
        flag = false
      }
    })
    return flag

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

    dispatchFetchRequest(api.tablelayout.updateTablePosition(layoutId, tableId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({x: getModNum(numberX._value, 10) / windowWidth, y: getModNum(numberY._value, 10) / windowHeight})
    }, response => {
      this.props.getTableLayouts()
    }).then()

    return true
  }



  renderDraggable(layoutId, table, index) {
    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }

    return (
      <View >
        {
          table.position !== null
            ?
            <View>
              <Animated.View
                {...this.panResponder.panHandlers}
                style={[panStyle, styles.circle, {position: 'absolute', borderWidth: 3, borderColor: '#BFBFBF'}]}
              >
                <Text style={{color: '#fff', textAlign: 'center', marginTop: 15}}>{table.tableName}</Text>
              </Animated.View>
            </View>
            :
            <View>
              <Animated.View
                {...this.panResponder.panHandlers}
                style={[panStyle, styles.circle, {position: 'absolute', borderWidth: 3, borderColor: '#BFBFBF'}]}
              >
                <Text style={{color: '#fff', textAlign: 'center', marginTop: 15}}>{table.tableName}</Text>
              </Animated.View>
            </View>
        }
      </View>
    );
  }

  render() {
    const {table, layoutId, index} = this.props
    return (
      <View style={{alignItems: "flex-start", borderWidth: 0, marginBottom: 0}} ref='self'>
        {this.renderDraggable(layoutId, table, index)}
      </View>
    );
  }
}

//https://snack.expo.io/@yoobidev/draggable-component
