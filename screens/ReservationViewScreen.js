import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {Keyboard, Text, TouchableOpacity, View, FlatList, Dimensions, Alert, Animated, RefreshControl} from 'react-native'
import {connect} from 'react-redux'
import {compose} from "redux";
import {withContext} from "../helpers/contextHelper";
import {getTableLayouts, getReservation} from '../actions'
import {getInitialTablePosition, getTablePosition, getSetPosition} from "../helpers/tableAction";
import {api, dispatchFetchRequest, dispatchFetchRequestWithOption} from '../constants/Backend'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {NavigationEvents} from "react-navigation";
import LoadingScreen from "./LoadingScreen";
import TimeZoneService from "../helpers/TimeZoneService";
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeScrollView} from "../components/ThemeScrollView";
import moment from 'moment-timezone'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";


class ReservationViewForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      windowWidth: Dimensions.get('window').width - 30,
      windowHeight: Dimensions.get('window').height - 76,
      scaleMultiple: (Dimensions.get('window').width - 30) / 300,
      tableWidth: null,
      tableHeight: null,
      isTablet: context?.isTablet,
      tableIndex: 0,
      selectedTableIds: [],
      selectedTableNames: [],
      activeTableLayout: [],
    }
  }

  componentDidMount() {

    this.props.getTableLayouts()
    this.props.getReservation()

  }

  handleSendNotification = (reservation) => {
    Alert.alert(
      ``,
      `${this.context.t('reservation.sendActionContext', {phoneNumber: reservation.phoneNumber})}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {

            dispatchFetchRequestWithOption(
              api.reservation.sendNotification(reservation.id),
              {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                  'Content-Type': 'application/json'
                },
              }, {defaultMessage: false},
              response => {
                this.handleReset()
                this.props.navigation.navigate('ReservationCalendarScreen')
              }
            ).then()
          }
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => console.log('Cancelled'),
          style: 'cancel'
        }
      ]
    )
  }

  handleDeleteReservation = () => {
    Alert.alert(
      ``,
      `${this.context.t('reservation.deleteActionContext')}`,
      [
        {
          text: `${this.context.t('action.yes')}`,
          onPress: () => {
            dispatchFetchRequestWithOption(
              api.reservation.update(this.props.navigation?.state?.params?.id),
              {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {},
              }, {defaultMessage: true},
              response => {
                this.handleReset()
                this.props.navigation.navigate('ReservationCalendarScreen')

              }
            ).then()
          }
        },
        {
          text: `${this.context.t('action.no')}`,
          onPress: () => console.log('Cancelled'),
          style: 'cancel'
        }
      ]
    )
  }

  handleChooseLayout = (value) => {
    let arr = this.state.activeTableLayout

    if (arr.length !== 0 && arr.includes(value)) {
      arr.push(value)
    } else {
      arr.splice(arr.indexOf(value), 1)
    }
    this.setState({activeTableLayout: arr})
  }


  render() {
    const {
      navigation,
      isLoading,
      tablelayouts,
      reservation,
    } = this.props

    const {t, customMainThemeColor, customBackgroundColor} = this.context


    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else {

      const floorCapacity = {}
      const tablesMap = {}

      tablelayouts && tablelayouts.forEach((layout, idx) => {

        let seatCount = 0
        let tableCount = 0

        tablesMap[layout.layoutName] = tablelayouts?.[idx]?.tables

        tablelayouts?.[idx]?.tables.forEach((table, idx2) => {
          seatCount += table.capacity
          tableCount += 1
        })

        floorCapacity[layout.id] = {}
        floorCapacity[layout.id].seatCount = seatCount
        floorCapacity[layout.id].tableCount = tableCount
      })


      if (!!this?.state?.isTablet) {
        return (
          <ThemeScrollView>
            <View style={styles.fullWidthScreen}>
              <NavigationEvents
                onWillFocus={() => {
                  this.props.getReservation()
                }}
              />
              <ScreenHeader
                backNavigation={true}
                backAction={() => {
                  navigation.navigate('ReservationCalendarScreen')
                }}
                title={t('reservation.reservationViewTitle')}
                parentFullScreen={true} />
              <View style={[styles.fieldContainer, styles.flex(1), {flexDirection: 'row-reverse'}]}>

                <View style={[styles.flex(2), {marginHorizontal: 20}]}>
                  <View style={[{flexDirection: 'row', width: '100%', minHeight: 80}]}>
                    {tablelayouts?.map((tblLayout, index) => {
                      return (<TouchableOpacity
                        key={index}
                        style={{
                          borderColor: customMainThemeColor,
                          borderWidth: 2,
                          borderBottomWidth: 0,
                          borderLeftWidth: index === 0 ? 2 : 0,
                          padding: 4,
                          width: 120,
                          backgroundColor: this.state?.tableIndex === index ? customMainThemeColor : null,
                        }}
                        onPress={() => {this.setState({tableIndex: index})}}>
                        <StyledText style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                          {tblLayout.layoutName}
                        </StyledText>
                        {floorCapacity[tblLayout.id] !== undefined && (
                          <>
                            <Text style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                              {t('tableVisual.tableCapacity')} {tblLayout.totalTables}
                            </Text>
                            <Text style={[this.state?.tableIndex === index ? styles?.sectionBarText(customBackgroundColor) : (styles?.sectionBarText(customMainThemeColor)), {flex: 4, textAlign: 'center', marginRight: 4}]}>
                              {t('tableVisual.availableTables')} {floorCapacity[tblLayout.id].tableCount}
                            </Text>
                          </>
                        )}

                      </TouchableOpacity>)
                    })}

                  </View>
                  {this.state.tableIndex >= 0 &&
                    <View style={[styles?.ballContainer(customMainThemeColor), {flex: 6}]}>
                      <View onLayout={(event) => {
                        let {x, y, width, height} = event.nativeEvent.layout;
                        this.setState({
                          tableWidth: width,
                          tableHeight: height,
                        })
                      }}
                        pointerEvents={'none'}
                        style={[{width: '100%', height: '100%', alignSelf: 'center', flexWrap: 'wrap'}, {opacity: 0.7, backgroundColor: '#BFBFBF'}]}>

                        {(this.state?.tableWidth && !isLoading) || <View style={{flex: 1, width: '100%'}}><LoadingScreen /></View>}

                        {
                          tablelayouts[this.state.tableIndex]?.tables?.map((table, index) => {
                            let positionArr = tablelayouts[this.state.tableIndex]?.tables?.map((table, index) => {
                              if (table.position != null) {
                                return {...getTablePosition(table, this.state?.tableWidth ?? this.state?.windowWidth, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                              } else {
                                return {...getInitialTablePosition(index, this.state?.tableHeight ?? this.state?.windowHeight), tableId: table?.tableId, tableData: table}
                              }
                            })
                            return (
                              (this.state?.tableWidth && !isLoading && reservation) && <TableMap
                                borderColor={'#BFBFBF'}
                                t={t}
                                table={table}
                                key={table.tableId}
                                layoutId={tablelayouts[this.state.tableIndex]?.id}
                                index={index}
                                reservation={reservation}
                                tableWidth={this.state?.tableWidth ?? this.state?.windowWidth}
                                tableHeight={this.state?.tableHeight ?? this.state?.windowHeight}
                                positionArr={positionArr}
                              />
                            )
                          })
                        }
                      </View>
                    </View>}
                </View>

                <View style={[styles.flex(1), {marginLeft: 20, justifyContent: 'flex-start', }]}>
                  {!!reservation &&
                    <>
                      <View style={[styles.tableRowContainerWithBorder, {marginTop: 72}]}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.date')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{moment(reservation?.reservationStartDate).format('YYYY-MM-DD')}</StyledText>
                        </View>
                      </View>
                      <View style={[styles.tableRowContainerWithBorder]}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.time')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{moment(reservation?.reservationStartDate).format('HH:mm')}</StyledText>
                        </View>
                      </View>

                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.name')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{reservation?.name}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.phone')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{reservation.phoneNumber}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.peopleCount')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{t('reservation.adult')}: {reservation.people ?? 0}, {t('reservation.kid')}: {reservation.kid ?? 0}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.otherNote')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, styles.justifyRight]}>
                          <StyledText style={[styles.reservationFormContainer]}>{reservation?.note}</StyledText>
                        </View>
                      </View>
                      <View style={styles.tableRowContainerWithBorder}>
                        <View style={[styles.tableCellView, styles.flex(1)]}>
                          <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.table')}</StyledText>
                        </View>
                        <View style={[styles.tableCellView, {flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', }]}>
                          {!!reservation.tables ? reservation.tables.map((table, index) => (
                            <StyledText key={index} style={[styles.reservationFormContainer, {marginBottom: 4}]}>{table.tableName} </StyledText>
                          ))
                            :
                            <StyledText style={[styles.reservationFormContainer]}>{t('reservation.noTable')}</StyledText>
                          }
                        </View>
                      </View>

                      <View style={[styles.bottom, styles.horizontalMargin]}>
                        <TouchableOpacity onPress={() => {
                          navigation.navigate('ReservationEditScreen', {reservationId: reservation.id})
                        }}>
                          <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                            {t('action.edit')}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                          this.handleSendNotification(reservation)
                        }}>
                          <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                            {t('reservation.sendNotification')}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                          this.handleDeleteReservation()
                        }}>
                          <Text
                            style={[styles?.bottomActionButton(customMainThemeColor), styles.deleteButton]}
                          >
                            {t('action.cancel')}
                          </Text>
                        </TouchableOpacity>

                      </View>
                    </>
                  }

                </View>


              </View>
            </View>
          </ThemeScrollView >
        )
      } else {
        return (
          <ThemeContainer>
            <View style={styles.fullWidthScreen}>
              <NavigationEvents
                onWillFocus={() => {
                  this.props.getReservation()
                }}
              />
              <ScreenHeader
                backNavigation={true}
                backAction={() => {
                  navigation.navigate('ReservationCalendarScreen')
                }}
                title={t('reservation.reservationViewTitle')}
                parentFullScreen={true} />

              <ThemeKeyboardAwareScrollView>
                {!!reservation &&
                  <>
                    <View style={[styles.tableRowContainerWithBorder, {marginTop: 72}]}>
                      <View style={[styles.tableCellView, styles.flex(1)]}>
                        <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.date')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight]}>
                        <StyledText style={[styles.reservationFormContainer]}>{moment(reservation?.reservationStartDate).format('YYYY-MM-DD')}</StyledText>
                      </View>
                    </View>
                    <View style={[styles.tableRowContainerWithBorder]}>
                      <View style={[styles.tableCellView, styles.flex(1)]}>
                        <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.time')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight]}>
                        <StyledText style={[styles.reservationFormContainer]}>{moment(reservation?.reservationStartDate).format('HH:mm')}</StyledText>
                      </View>
                    </View>

                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, styles.flex(1)]}>
                        <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.name')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight]}>
                        <StyledText style={[styles.reservationFormContainer]}>{reservation?.name}</StyledText>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, styles.flex(1)]}>
                        <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.phone')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight]}>
                        <StyledText style={[styles.reservationFormContainer]}>{reservation?.phoneNumber}</StyledText>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, styles.flex(1)]}>
                        <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.peopleCount')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight]}>
                        <StyledText style={[styles.reservationFormContainer]}>{t('reservation.adult')}: {reservation?.people ?? 0}, {t('reservation.kid')}: {reservation?.kid ?? 0}</StyledText>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, styles.flex(1)]}>
                        <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.otherNote')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, styles.justifyRight]}>
                        <StyledText style={[styles.reservationFormContainer]}>{reservation?.note}</StyledText>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, styles.flex(1)]}>
                        <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.table')}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', }]}>
                        {!!reservation.tables ? reservation.tables.map((table, index) => (
                          <StyledText key={index} style={[styles.reservationFormContainer, {marginBottom: 4}]}>{table.tableName} </StyledText>
                        ))
                          :
                          <StyledText style={[styles.reservationFormContainer]}>{t('reservation.noTable')}</StyledText>
                        }
                      </View>
                    </View>

                    <View style={[styles.bottom, styles.horizontalMargin]}>
                      {(reservation.status == 'BOOKED' || reservation.status == 'WAITING') && <TouchableOpacity onPress={() => {
                        navigation.navigate('ReservationEditScreen', {reservationId: reservation.id})
                      }}>
                        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                          {t('action.edit')}
                        </Text>
                      </TouchableOpacity>}

                      <TouchableOpacity onPress={() => {
                        this.handleSendNotification(reservation)
                      }}>
                        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                          {t('reservation.sendNotification')}
                        </Text>
                      </TouchableOpacity>

                      {(reservation.status == 'BOOKED' || reservation.status == 'WAITING') &&
                        <TouchableOpacity onPress={() => {
                          this.handleDeleteReservation()
                        }}>
                          <Text
                            style={[styles?.bottomActionButton(customMainThemeColor), styles.deleteButton]}
                          >
                            {t('reservation.cancelReservation')}
                          </Text>
                        </TouchableOpacity>
                      }

                    </View>
                  </>
                }
              </ThemeKeyboardAwareScrollView>

            </View>
          </ThemeContainer>
        )
      }

    }
  }
}

const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  haveData: state.reservation.haveData || state.tablelayouts.haveData,
  haveError: state.reservation.haveError || state.tablelayouts.haveError,
  isLoading: state.reservation.loading || state.tablelayouts.loading,
  reservation: state.reservation.data,
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts()),
  getReservation: () => dispatch(getReservation(props.navigation?.state?.params?.reservationId)),
})

ReservationViewForm = reduxForm({
  form: 'reservationViewForm'
})(ReservationViewForm)


const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)
export default enhance(ReservationViewForm)


class TableMapBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pan: new Animated.ValueXY(),
      panUnder: new Animated.ValueXY(),
      opacity: new Animated.Value(1),
      isSelected: false,
    };
  }

  componentDidMount() {
    this.initPosition()
  }

  initPosition = () => {
    const windowWidth = this.props.tableWidth;
    const windowHeight = this.props.tableHeight;
    if (this.props.table.position != null) {
      this.state.pan.setValue(getTablePosition(this.props.table, windowWidth, windowHeight))
      this.state.panUnder.setValue(getTablePosition(this.props.table, windowWidth, windowHeight))
    } else {
      this.state.pan.setValue(getInitialTablePosition(this.props.index, windowHeight))
      this.state.panUnder.setValue(getInitialTablePosition(this.props.index, windowHeight))
    }
  }

  renderTableMap(layoutId, table, index, borderColor, positionArr, customMainThemeColor, customSecondThemeColor, customBackgroundColor, t) {

    const panStyle = {
      transform: this.state.pan.getTranslateTransform()
    }
    const panStyleUnder = {
      transform: this.state.panUnder.getTranslateTransform()
    }

    const selectedStyle = {
      backgroundColor: customMainThemeColor
    }

    const tableSize = 72
    let selectedTableIds = this.props?.reservation.tables && this.props?.reservation?.tables.map((item) => item.tableId)
    const isSelected = !!selectedTableIds && (selectedTableIds.indexOf(table.tableId) > -1)

    return (
      <View >
        {
          table.position !== null
            ?
            <Animated.View style={{opacity: this.state.opacity}}>
              <TouchableOpacity

                onPress={() => {}}
                style={[panStyle, {zIndex: 1000, position: 'absolute', alignItems: 'center', justifyContent: 'space-around', width: tableSize, height: tableSize, borderRadius: 50}, {backgroundColor: '#e7e7e7'}, isSelected && selectedStyle]}>

                <Text style={{color: '#222', textAlign: 'center'}, isSelected && {color: customBackgroundColor}}>{table.tableName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name={'ios-people'} color={isSelected ? customBackgroundColor : '#222'} size={20} />
                  <Text style={{color: '#222', textAlign: 'center', }, isSelected && {color: customBackgroundColor}}>{` ${0}(${table.capacity})`}</Text>
                </View>
              </TouchableOpacity>

            </Animated.View>

            :
            <Animated.View style={{opacity: this.state.opacity}}>

              <TouchableOpacity
                onPress={() => {
                }}
                style={[panStyle, {zIndex: 1000, position: 'absolute', alignItems: 'center', justifyContent: 'space-around', width: tableSize, height: tableSize, borderRadius: 50}, {backgroundColor: '#e7e7e7'}, isSelected && selectedStyle]}>

                <Text style={{color: '#222', textAlign: 'center'}, isSelected && {color: customBackgroundColor}}>{table.tableName}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name={'ios-people'} color={isSelected ? customBackgroundColor : '#222'} size={20} />
                  <Text style={{color: '#222', textAlign: 'center', }, isSelected && {color: customBackgroundColor}}>{` ${0}(${table.capacity})`}</Text>
                </View>
              </TouchableOpacity>

            </Animated.View>
        }
      </View>
    );
  }

  render() {
    const {table, layoutId, index, borderColor, positionArr, locale: {customMainThemeColor, customSecondThemeColor, customBackgroundColor}} = this.props
    return (
      <View style={{alignItems: "flex-start", borderWidth: 0, marginBottom: 0}} ref='self'>
        {this.renderTableMap(layoutId, table, index, borderColor, positionArr, customMainThemeColor, customSecondThemeColor, customBackgroundColor)}
      </View>
    );
  }
}

const TableMap = withContext(TableMapBase)