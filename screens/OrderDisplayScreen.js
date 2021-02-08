import {StyledText} from "../components/StyledText";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import styles, {mainThemeColor} from '../styles'
import ScreenHeader from "../components/ScreenHeader";
import SockJsClient from 'react-stomp';
import {connect} from "react-redux";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {api, apiRoot, dispatchFetchRequest} from "../constants/Backend";
import {LocaleContext} from "../locales/LocaleContext";
import {playSound} from "../helpers/playSoundHelper";
import DraggableFlatList from "react-native-draggable-flatlist";
import {normalizeTimeString} from '../actions'

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
      firstTimeConnect: true
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        receivingText: 'Receiving',
        totalOrders: 'Total Pending Orders',
        tablesName: 'Table Name',
        noWorkingArea: 'No Working Area'
      },
      zh: {
        receivingText: '接收訂單中',
        totalOrders: '等待處理訂單',
        tablesName: '桌位',
        noWorkingArea: '無指定工作區'
      }
    })
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

    return (
      <ThemeScrollView>
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
          />

          <View style={styles.sectionTitleContainer}>
            <StyledText style={styles.sectionTitleText}>{t('totalOrders')}: {Object.keys(this.state.orders).reduce((accumulator, currentValue, currentIndex, array) => {return (accumulator + this.state.orders[`${currentValue}`]?.length)}, 0)}</StyledText>
          </View>

          <View style={{paddingHorizontal: 30}}>
            {Object.keys(this.state.orders)?.map((workingArea) => {
              return (
                <>
                  <View style={{borderBottomWidth: 1, borderColor: mainThemeColor, paddingBottom: 10}}>
                    <Text style={styles.sectionBarText}>{workingArea === 'noWorkingArea' ? t('noWorkingArea') : workingArea}</Text>
                  </View>
                  <DraggableFlatList
                    data={this.state.orders[`${workingArea}`]}
                    renderItem={({item, index, drag, isActive}) => {


                      return (
                        <TouchableOpacity style={[styles.sectionContainerWithBorder, {paddingHorizontal: 10}]}
                          onLongPress={drag}
                        >
                          <View style={[styles.tableCellView, {paddingBottom: 8}]}>
                            <View style={{flex: 1, flexDirection: 'row', }}>
                              <StyledText>{item?.serialId} </StyledText>
                              <StyledText>({item?.tables?.length > 0 ? item?.tables?.map((table) => table?.displayName).join(', ') : t('order.takeOut')})</StyledText>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
                              <View style={{width: 16, height: 16, borderRadius: 16, marginRight: 8, backgroundColor: (new Date() - new Date(item?.modifiedDate ?? new Date())) > 1800000 ? 'red' : '#86bf20'}}></View>
                              <StyledText>{normalizeTimeString(item?.modifiedDate ?? new Date(), 'HH:mm:ss')}</StyledText>
                            </View>
                          </View>
                          <View style={styles.tableCellView}>
                            <View style={[styles.tableCellView, styles.flex(2)]}>
                              <StyledText>{item.displayName}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText>{item.quantity}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, styles.flex(3)]}>
                              <StyledText>{item.options}</StyledText>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this.prepareLineItem(item.orderId, item.lineItemId)
                              }}
                            >
                              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.prepare')}</Text>
                            </TouchableOpacity>
                          </View>
                        </TouchableOpacity>
                      )
                    }}
                    keyExtractor={(item, index) => `draggable-item-${item.lineItemId}`}
                    onDragEnd={({data}) => {
                      let oldOrders = {...this.state?.orders}
                      oldOrders[`${workingArea}`] = [...data]
                      this.setState({orders: oldOrders})
                      this.handleLineItemOrdering(data)

                    }}
                  />
                </>
              )
            })}
            {/* <FlatList
              data={this.state.orders}
              renderItem={({item}) => {

                const hasItemsToPrepare = item.orderLineItems.filter(li => {
                  return ['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(li.state)
                }).length

                if (!hasItemsToPrepare) {
                  return null
                }

                return (
                  <View key={item.id} style={styles.sectionContainerWithBorder}>
                    <View style={styles.tableCellView}>
                      <StyledText>{item.serialId}</StyledText>
                    </View>
                    <View style={styles.tableCellView}>
                      <StyledText>{item.orderType === 'IN_STORE' ? item.tableDisplayName : t('order.takeOut')}</StyledText>
                    </View>
                    {item.orderLineItems.map(li => {
                      if (['IN_PROCESS', 'ALREADY_IN_PROCESS'].includes(li.state)) {
                        return (
                          <View key={li.id} style={styles.tableRowContainer}>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText>{li.productSnapshot.name}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText>{li.quantity}</StyledText>
                            </View>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText>{li.productOptions}</StyledText>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this.prepareLineItem(item.id, li.id)
                              }}
                            >
                              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.prepare')}</Text>
                            </TouchableOpacity>
                          </View>
                        )
                      } else {
                        return null
                      }
                    })}
                  </View>
                )
              }}
              ListEmptyComponent={
                <View>
                  <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                </View>
              }
            /> */}
          </View>

        </View>

      </ThemeScrollView>
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
