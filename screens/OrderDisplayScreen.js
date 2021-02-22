import {StyledText} from "../components/StyledText";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import styles, {mainThemeColor} from '../styles'
import ScreenHeader from "../components/ScreenHeader";
import SockJsClient from 'react-stomp';
import {connect} from "react-redux";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {ThemeContainer} from "../components/ThemeContainer";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {api, apiRoot, dispatchFetchRequest} from "../constants/Backend";
import {LocaleContext} from "../locales/LocaleContext";
import {playSound} from "../helpers/playSoundHelper";
import DraggableFlatList from "react-native-draggable-flatlist";
import {normalizeTimeString} from '../actions'
import {OptionModal} from "../components/OptionModal";
import {CheckBox} from 'react-native-elements'
import Icon from 'react-native-vector-icons/Ionicons'
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {ScrollView} from "react-native-gesture-handler";
import {Pages} from 'react-native-pages'
import ViewPager from '@react-native-community/viewpager';

class OrderDisplayScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      socketConnected: false,
      receiving: false,
      orders: [],
      firstTimeConnect: true,
      isShowModal: false,
      labels: [],
      selectedLabels: new Set(),
      isDragStart: false,
      selectedLabelIndex: 0
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        receivingText: 'Receiving',
        totalOrders: 'Total Pending Orders',
        tablesName: 'Table Name',
      },
      zh: {
        receivingText: '接收訂單中',
        totalOrders: '等待處理訂單',
        tablesName: '桌位',
      }
    })
    this.getLabels()
  }

  getLabels = () => {
    dispatchFetchRequest(`${api.workingarea.getAll}?visibility=PRODUCT`, {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, response => {
      response.json().then(data => {
        let labelsArr = data?.workingAreas?.map((item) => item?.name)
        labelsArr.push('noWorkingArea')
        this.setState({labels: data?.workingAreas?.map((item) => item?.name), selectedLabels: new Set([...labelsArr])})

      })
    }).then()
  }

  prepareLineItem = (orderId, lineItemId) => {

    dispatchFetchRequest(api.order.prepareLineItem(orderId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({lineItemIds: [lineItemId]})
    }, response => {

    }).then()
  }

  handleLineItemOrdering = (data) => {
    let request = {
      lineItemOrderings: data.map((item) => {
        return {
          orderId: item?.orderId,
          lineItemId: item?.lineItemId,
        }
      })
    }

    dispatchFetchRequest(api.order.lineItemOrdering, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    }, response => {

    }).then()
  }

  render() {
    const {client, locale} = this.props
    const t = locale.t

    const webSocketHost = `${apiRoot}/ws`
    console.log('labels', this.state?.labels, this.state?.selectedLabels)

    const renderWorkingAreas = Object.keys(this.state.orders)?.filter((workingArea) => this.state?.selectedLabels.has(workingArea))

    return (
      <ThemeContainer>
        <SockJsClient url={webSocketHost} topics={[`/dest/realtimeOrders/${client?.id}`]}
          onMessage={(data) => {
            if (data?.needAlert) {
              playSound()
            }
            this.setState({receiving: true, orders: data?.results, needAlert: data?.needAlert, firstTimeConnect: false})
          }}
          ref={(client) => {
            this.clientRef = client
          }}
          onConnect={() => {
            if (this.state?.firstTimeConnect) {
              this.clientRef.sendMessage(`/async/realtimeOrders/${client?.id}`);
            }
            this.setState({socketConnected: true})
          }}
          onDisconnect={() => {
            this.setState({socketConnected: false})
          }}
          debug={false}
        />
        <View style={styles.fullWidthScreen}>
          <ScreenHeader parentFullScreen={true}
            title={t('menu.orderDisplay')}
            rightComponent={
              <View style={{flexDirection: 'row'}}>
                <View style={{marginRight: 8}}>
                  <OptionModal
                    tabletView
                    icon={<MaterialCommunityIcons name="filter-variant" size={32} color={mainThemeColor} />}
                    toggleModal={(flag) => this.setState({isShowModal: flag})}
                    isShowModal={this.state?.isShowModal}>
                    <View >
                      <View style={{
                        flexDirection: 'row',
                        paddingVertical: 8,
                        alignItems: 'center'
                      }}>
                        <Text style={{marginLeft: 10, color: mainThemeColor, fontSize: 16, fontWeight: 'bold'}}>{t('selectWorkingArea')}</Text>
                      </View>
                      <View style={{
                        flexDirection: 'row',
                        paddingVertical: 8,
                        alignItems: 'center'
                      }}>
                        <View>
                          <CheckBox
                            checkedIcon={'check-circle'}
                            uncheckedIcon={'circle'}
                            checked={this.state?.selectedLabels?.size === this.state?.labels?.length + 1}
                            containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                            onPress={() => {
                              let tempSet = new Set()
                              if (this.state?.selectedLabels?.size === this.state?.labels?.length + 1) {
                                tempSet = new Set()
                              } else {
                                let labelsArr = [...this.state?.labels]
                                labelsArr.push('noWorkingArea')
                                tempSet = new Set([...labelsArr])
                              }
                              this.setState({selectedLabels: tempSet})
                            }}
                          >
                          </CheckBox>
                        </View>
                        <StyledText>{t('allSelected')}</StyledText>
                      </View>
                      {this.state?.labels?.map((workingArea) => {
                        return (
                          <View style={{
                            flexDirection: 'row',
                            paddingVertical: 8,
                            alignItems: 'center'
                          }}>
                            <View>
                              <CheckBox
                                checkedIcon={'check-circle'}
                                uncheckedIcon={'circle'}
                                checked={this.state?.selectedLabels?.has(workingArea)}
                                containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                                onPress={() => {
                                  let tempSet = new Set(this.state?.selectedLabels)
                                  if (this.state?.selectedLabels?.has(workingArea)) {
                                    tempSet.delete(workingArea)
                                  } else {
                                    tempSet.add(workingArea)
                                  }
                                  this.setState({selectedLabels: tempSet})
                                }}
                              >
                              </CheckBox>
                            </View>
                            <StyledText>{workingArea}</StyledText>
                          </View>
                        )
                      })}
                      <View style={{
                        flexDirection: 'row',
                        paddingVertical: 8,
                        alignItems: 'center'
                      }}>
                        <View>
                          <CheckBox
                            checkedIcon={'check-circle'}
                            uncheckedIcon={'circle'}
                            checked={this.state?.selectedLabels?.has('noWorkingArea')}
                            containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                            onPress={() => {
                              let tempSet = new Set(this.state?.selectedLabels)
                              if (this.state?.selectedLabels?.has('noWorkingArea')) {
                                tempSet.delete('noWorkingArea')
                              } else {
                                tempSet.add('noWorkingArea')
                              }
                              this.setState({selectedLabels: tempSet})
                            }}
                          >
                          </CheckBox>
                        </View>
                        <StyledText>{t('noWorkingArea')}</StyledText>
                      </View>
                    </View>
                  </OptionModal>
                </View>
              </View>
            }
          />

          <View style={styles.sectionTitleContainer}>
            <StyledText style={styles.sectionTitleText}>{t('totalOrders')}: {Object.keys(this.state.orders).reduce((accumulator, currentValue, currentIndex, array) => {return (accumulator + (this.state?.selectedLabels.has(currentValue) ? this.state.orders[`${currentValue}`]?.length : 0))}, 0)}</StyledText>
          </View>
          <View style={{borderBottomWidth: 1, borderColor: mainThemeColor, paddingBottom: 10, flexDirection: 'row'}}>
            {renderWorkingAreas.map((workingArea, index) => {
              let isSelected = index === this.state?.selectedLabelIndex
              return (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({selectedLabelIndex: index})
                    this.viewPagerRef.setPage(index)
                  }}
                  style={[{padding: 10, borderRadius: 20, marginHorizontal: 5}, isSelected ? {backgroundColor: mainThemeColor, } : {borderColor: mainThemeColor, borderWidth: 1}]}
                >
                  <Text style={[styles.sectionBarText, isSelected ? {color: '#fff'} : {color: mainThemeColor}]}>{workingArea === 'noWorkingArea' ? t('noWorkingArea') : workingArea}</Text>
                </TouchableOpacity>
              )

            })}


          </View>
          <View style={{flex: 1}}>
            <ViewPager
              ref={(ref) => {
                this.viewPagerRef = ref
              }}
              style={{flex: 1}}
              initialPage={0}
              onPageSelected={(e) => this.setState({selectedLabelIndex: e?.nativeEvent?.position})}
            >
              {renderWorkingAreas.map((workingArea) => {
                return (
                  <View style={{flex: 1}}>

                    <DraggableFlatList
                      activationDistance={5}
                      data={this.state.orders[`${workingArea}`]}
                      dragItemOverflow
                      renderItem={({item, index, drag, isActive}) => {


                        return (
                          <TouchableOpacity style={[styles.sectionContainerWithBorder, {flexDirection: 'row', marginBottom: 5, paddingHorizontal: 10, alignItems: 'center'}]}
                            onLongPress={drag}
                          >
                            <View style={{flex: 2, minWidth: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                              <Text
                                numberOfLines={1}
                                style={{fontSize: 28, fontWeight: 'bold', color: '#f75336', paddingRight: 5}}>{item?.tables?.length > 0 ? item?.tables?.map((table) => table?.displayName).join(', ') : t('order.takeOut')}</Text>
                            </View>
                            <View style={{flex: 4}}>
                              <View style={[styles.tableCellView, {paddingBottom: 8}]}>

                                <View style={{flex: 1, flexDirection: 'row', }}>
                                  <StyledText>{item?.serialId} </StyledText>

                                </View>

                              </View>
                              <View style={styles.tableCellView}>
                                <View style={[styles.tableCellView, styles.flex(2)]}>
                                  <StyledText style={{fontSize: 20}}>{item.displayName}</StyledText>
                                </View>



                              </View>
                            </View>

                            <View style={{flex: 1}}>
                              <View style={[styles.tableCellView, styles.flex(1)]}>
                                <StyledText style={[{fontSize: 24, fontWeight: 'bold', color: item.quantity > 1 ? '#f75336' : undefined}]}>{item.quantity}</StyledText>
                              </View>
                            </View>

                            <View style={{flex: 7}}>

                              <View style={styles.tableCellView}>

                                <View style={[styles.tableCellView, styles.flex(3)]}>
                                  <StyledText>{item.options}</StyledText>
                                </View>
                                <View>
                                  <View style={{marginBottom: 5, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                                    <View style={{width: 16, height: 16, borderRadius: 16, marginRight: 8, backgroundColor: (new Date() - new Date(item?.modifiedDate ?? new Date())) > 1800000 ? 'red' : '#86bf20'}}></View>
                                    <StyledText>{normalizeTimeString(item?.modifiedDate ?? new Date(), 'HH:mm:ss')}</StyledText>
                                  </View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      this.prepareLineItem(item.orderId, item.lineItemId)
                                    }}
                                  >
                                    <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.prepare')}</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      }}
                      keyExtractor={(item, index) => `draggable-item-${item.lineItemId}`}
                      onDragEnd={({data}) => {
                        let oldOrders = {...this.state?.orders}
                        oldOrders[`${workingArea}`] = [...data]
                        this.setState({orders: oldOrders, isDragStart: false})
                        this.handleLineItemOrdering(data)

                      }}
                      onDragBegin={(index) => {
                        this.setState({isDragStart: true})
                      }}
                      layoutInvalidationKey={this.state.isDragStart}
                    />
                  </View>
                )

              })}


            </ViewPager>
          </View>

        </View>

      </ThemeContainer>
    )

  }
}

const mapStateToProps = state => ({
  client: state.client.data
})

const enhance = compose(
  connect(mapStateToProps, null),
  withContext
)

export default enhance(OrderDisplayScreen)

const getContentCount = (all, selected) => {
  let count = 0
  all.forEach((item) => {
    if (selected.has(item)) {
      count++
    }
  })
  return count === 0 ? 1 : count
}
