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
import {renderOrderState} from "../helpers/orderActions";
import filterSupportedProps from "react-native-web/dist/exports/View/filterSupportedProps";
import ScreenHeader from "../components/ScreenHeader";
import OrderTopInfo from "./OrderTopInfo";

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

  render() {
    const { order, isLoading, haveData } = this.props
    const { t } = this.context

    Item = ({ orderDetail, lineItemDate }) => {
      return (
       	<View style={[styles.tableRowContainer]}>
            <View style={{flex: 2.5}}>
              <Text>
              	{formatTime(lineItemDate)}
              </Text>
            </View>

            <View style={{flex: 1.7}}>
              <Text>
              	{orderDetail.productName}
              </Text>
            </View>

            <View style={{flex: 0.8}}>
              <Text>
              	{orderDetail.quantity}
              </Text>
            </View>

            <View style={{flex: 1.2}}>
              <Text style={{textAlign: 'right'}}>
              	{orderDetail.subTotal.amount}
              </Text>
            </View>
        </View>
      )
    }

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
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
      	<ScrollView scrollIndicatorInsets={{ right: 1 }}>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader parentFullScreen={true}
                          title={t('order.orderDetailsTitle')}/>

            <OrderTopInfo order={order}/>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.ageGroup')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
									{filteredageGroup !== undefined ? filteredageGroup.label : t('order.notFilledIn')}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.visitedFrequency')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
                  {filteredvisitFrequency !== undefined ? filteredvisitFrequency.label : t('order.notFilledIn')}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.orderStartDate')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
                  {formatTime(order.createdDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.endDate')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
                  {formatTime(orderDuration.orderSettledDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.duration')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
                  {orderDuration.durationHours} {t('timecard.hours')} {orderDuration.durationMinutes} {t('timecard.minutes')}
                </Text>
              </View>
            </View>

            <View style={styles.sectionBar}>
            	<View style={{flex: 2.5}}>
                	<Text style={styles.sectionBarTextSmall}>
                  	{t('order.lineItemCreatedDate')}
                	</Text>
            	</View>

            	<View style={{flex: 1.7}}>
              	<TouchableOpacity>
                	<Text style={styles.sectionBarTextSmall}>
                  	{t('order.product')}
                	</Text>
              	</TouchableOpacity>
            	</View>

            	<View style={{flex: 0.8}}>
              	<TouchableOpacity>
                	<Text style={styles.sectionBarTextSmall}>
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
                <Text>{t('order.serviceCharge')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
                  ${order.serviceCharge}
                </Text>
              </View>
            </View>

            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.discount')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
                  ${order.discount}
                </Text>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.total')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                <Text>
                  ${order.total.amount}
                </Text>
              </View>
            </View>

            <FlatList
              data={order.transactions}
              renderItem={({item, index}) => (
                <View style={styles.tableRowContainerWithBorder}>
              		<View style={[styles.tableCellView, {flex: 1}]}>
                		<Text>{t('order.paymentMethod')}</Text>
              		</View>
              		<View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                		<Text>{item.paymentMethod}</Text>
              		</View>
            		</View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

             <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.serveBy')}</Text>
              </View>
               <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                 <Text>
                   {order.servedBy}
                 </Text>
               </View>
             </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, {flex: 1}]}>
                <Text>{t('order.orderStatus')}</Text>
              </View>
              <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                {renderOrderState(order.state)}
              </View>
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
