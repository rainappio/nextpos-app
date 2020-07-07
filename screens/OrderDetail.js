import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import images from '../assets/images'
import { getOrdersByDateRange, getOrder, formatDate, formatTime } from '../actions'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import {handleDelete, renderOptionsAndOffer, renderOrderState} from "../helpers/orderActions";
import filterSupportedProps from "react-native-web/dist/exports/View/filterSupportedProps";
import ScreenHeader from "../components/ScreenHeader";
import OrderTopInfo from "./OrderTopInfo";
import LoadingScreen from "./LoadingScreen";
import {api, dispatchFetchRequestWithOption, successMessage} from "../constants/Backend";
import DeleteBtn from "../components/DeleteBtn";
import {NavigationEvents} from "react-navigation";

class OrderDetail extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  state = {
    	ageGroups: [
				{label: '20-29', value: 'TWENTIES'},
				{label: '30-39', value: 'THIRTIES'},
				{label: '40-49', value: 'FORTIES'},
				{label: '50-59', value: 'FIFTIES_AND_ABOVE'}
    	],
    	visitFrequencies: [
        {label: '1', value: 'FIRST_TIME'},
        {label: '2 - 3', value: 'TWO_TO_THREE'},
        {label: '4+', value: 'MORE_THAN_THREE'}
      ]
    }

  componentDidMount() {
    this.props.getOrder(this.props.navigation.state.params.orderId)
  }

  handleCopyOrder(order) {
    dispatchFetchRequestWithOption(api.order.copyOrder(order.orderId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
    }, {
      defaultMessage: false
    }, response => {
      response.json().then(copiedOrder => {
        successMessage('order.copied')
        this.props.navigation.navigate('OrdersSummary', {
          orderId: copiedOrder.orderId
        })

      })
    }).then()
  }

  render() {
    const { order, isLoading, haveData } = this.props
    const { t, theme } = this.context

    Item = ({ orderDetail, lineItemDate }) => {
      return (
        <View>
          <View style={[styles.tableRowContainer]}>
            <View style={{flex: 2.5}}>
              <Text style={this.context.theme}>
                {formatTime(lineItemDate)}
              </Text>
            </View>

            <View style={{flex: 1.7}}>
              <Text style={this.context.theme}>
                {orderDetail.productName}
              </Text>
            </View>

            <View style={{flex: 0.8}}>
              <Text style={this.context.theme}>
                {orderDetail.quantity}
              </Text>
            </View>

            <View style={{flex: 1.2}}>
              <Text style={[{textAlign: 'right'}, theme]}>
                {orderDetail.lineItemSubTotal}
              </Text>
            </View>
          </View>
          <View style={styles.tableRowContainer}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <Text style={this.context.theme}>{renderOptionsAndOffer(orderDetail)}</Text>
            </View>
          </View>
        </View>
      )
    }

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveData) {
    	const filteredageGroup = this.state.ageGroups.find( ageGroup => {
				return ageGroup.value === order.demographicData.ageGroup
			})

			const filteredvisitFrequency = this.state.visitFrequencies.find( visitFreq => {
				return visitFreq.value === order.demographicData.visitFrequency
			})

      const orderDuration = order.orderDuration !== null ? order.orderDuration : {}

      return (
      	<ScrollView scrollIndicatorInsets={{ right: 1 }} style={theme}>
          <NavigationEvents
            onWillFocus={() => {
              this.props.getOrder()
            }}
          />
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader parentFullScreen={true}
                          title={t('order.orderDetailsTitle')}/>

            <OrderTopInfo order={order}/>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.ageGroup')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
									{filteredageGroup !== undefined ? filteredageGroup.label : t('order.notFilledIn')}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.visitedFrequency')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
                  {filteredvisitFrequency !== undefined ? filteredvisitFrequency.label : t('order.notFilledIn')}
                </Text>
              </View>
            </View>

            {order.orderPreparationTime != null && (
              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <Text style={theme}>{t('order.preparationDuration')}</Text>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <Text style={theme}>
                    {order.orderPreparationTime.durationHours} {t('timecard.hours')} {order.orderPreparationTime.durationMinutes} {t('timecard.minutes')}
                  </Text>
                </View>
              </View>
            )}

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.orderStartDate')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
                  {formatTime(order.createdDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.endDate')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
                  {formatTime(order.modifiedDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.duration')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
                  {orderDuration.durationHours} {t('timecard.hours')} {orderDuration.durationMinutes} {t('timecard.minutes')}
                </Text>
              </View>
            </View>

            <View style={[styles.sectionBar, theme]}>
            	<View style={{flex: 2.5}}>
                	<Text style={[styles.sectionBarTextSmall, theme]}>
                  	{t('order.lineItemCreatedDate')}
                	</Text>
            	</View>

            	<View style={{flex: 1.7}}>
              	<TouchableOpacity>
                	<Text style={[styles.sectionBarTextSmall, theme]}>
                  	{t('order.product')}
                	</Text>
              	</TouchableOpacity>
            	</View>

            	<View style={{flex: 0.8}}>
              	<TouchableOpacity>
                	<Text style={[styles.sectionBarTextSmall, theme]}>
                  	{t('order.quantity')}
                	</Text>
              	</TouchableOpacity>
            	</View>

            	<View style={{flex: 1.3}}>
               	<Text style={[styles.sectionBarTextSmall,{textAlign: 'right'}]}>{t('order.subTotal')}</Text>
            	</View>
          	</View>

          	<FlatList
              style={{marginBottom: 20}}
              data={order.lineItems}
              renderItem={({item, index}) => (
                <Item
                	orderDetail={item}
                  lineItemDate={item.modifiedDate}
                	/>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.serviceCharge')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
                  ${order.serviceCharge}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.discount')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
                  ${order.discount}
                </Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.total')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text style={theme}>
                  ${order.total.amount}
                </Text>
              </View>
            </View>

            <FlatList
              data={order.transactions}
              renderItem={({item, index}) => (
                <View style={styles.tableRowContainerWithBorder}>
              		<View style={[styles.tableCellView, {flex: 1}]}>
                		<Text style={theme}>{t('order.paymentMethod')}</Text>
              		</View>
              		<View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                		<Text style={theme}>{item.paymentMethod}</Text>
              		</View>
            		</View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

             <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.serveBy')}</Text>
              </View>
               <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                 <Text style={theme}>
                   {order.servedBy}
                 </Text>
               </View>
             </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text style={theme}>{t('order.orderStatus')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                {renderOrderState(order.state)}
              </View>
            </View>

            <View style={styles.sectionTitleContainer}>
              <Text style={[styles.sectionTitleText, theme]}>Order Log</Text>
            </View>

            {order.orderLogs != null && order.orderLogs.map((log, idx) => {
              return (
                <View key={idx}>
                  <View style={[styles.tableRowContainerWithBorder, theme]}>
                    <View style={[styles.tableCellView, {flex: 2}]}>
                      <Text style={theme}>{formatTime(log.logDate)} ({log.who})</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text style={theme}>{t(`orderLog.${log.action}`)}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableRowContainerWithBorder]}>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                      {log.entries != null && log.entries.map((entry, eIdx) => {
                        const entryValue = entry.from != null ? `${entry.from} -> ${entry.to}` : entry.to

                        return (
                          <View key={`entry-${eIdx}`}>
                            <Text style={theme}>{entry.name}: {entryValue}</Text>
                          </View>
                        )
                      })}
                    </View>
                  </View>
                </View>
              )
            })}

            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity
                onPress={() => this.handleCopyOrder(order)}
              >
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('order.copyOrder')}
                </Text>
              </TouchableOpacity>
              <DeleteBtn
                handleDeleteAction={() => handleDelete(order.orderId, () => this.props.getOrder())}
              />
            </View>
          </View>
        </ScrollView>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  order: state.order.data,
  haveData: state.order.haveData,
  haveError: state.order.haveError,
  isLoading: state.order.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetail)
