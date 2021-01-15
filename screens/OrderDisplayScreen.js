import {StyledText} from "../components/StyledText";
import {FlatList, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import styles from '../styles'
import ScreenHeader from "../components/ScreenHeader";
import SockJsClient from 'react-stomp';
import {connect} from "react-redux";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {api, apiRoot, dispatchFetchRequest} from "../constants/Backend";
import {LocaleContext} from "../locales/LocaleContext";

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
      orders: []
    }
  }

  componentDidMount() {
    this.context.localize({
      en: {
        receivingText: 'Receiving',
        totalOrders: 'Total Pending Orders'
      },
      zh: {
        receivingText: '接收訂單中',
        totalOrders: '等待處理訂單'
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

  render() {
    const {client, locale} = this.props
    const t = locale.t

    const webSocketHost = `${apiRoot}/ws`

    return (
      <ThemeScrollView>
        <SockJsClient url={webSocketHost} topics={[`/dest/realtimeOrders/${client?.id}`]}
          onMessage={(data) => {
            this.setState({receiving: true, orders: data})
          }}
          ref={(client) => {
            this.clientRef = client
          }}
          onConnect={() => {
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
            <StyledText style={styles.sectionTitleText}>{t('receivingText')}: {this.state.receiving ? 'Yes' : 'No'}</StyledText>
            <StyledText style={styles.sectionTitleText}>{t('totalOrders')}: {this.state.orders.length}</StyledText>
          </View>

          <View>
            <FlatList
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
            />
          </View>
          <View style={[styles.bottom, styles.horizontalMargin]}>
            <TouchableOpacity
              onPress={() => {
                this.clientRef.sendMessage(`/async/realtimeOrders/${client?.id}`);
              }}
            >
              <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('order.liveOrders')}</Text>
            </TouchableOpacity>
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
