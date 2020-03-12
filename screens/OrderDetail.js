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

    this.context.localize({
      en: {
        serviceCharge: 'Service Charge',
        discount: 'Discount',
        total: 'Total',
        paymentMethod: 'Payment Method',
        staff: 'Staff',
        ageGroup: 'Age Group',
        visitedFrequency: 'Visited Frequency',
        notFilledIn: 'Not Filled',
        orderStartDate: 'Start Date',
        lineItemCreatedDate: 'Start Date',
        endDate: 'End Date',
        duration: 'Total Duration',
        product: 'Product',
        quantity: 'Qty',
        subTotal: 'Subtotal',
        serveBy: 'Serve By'
      },
      zh: {
        serviceCharge: '服務費',
        discount: '折扣',
        total: '總金額',
        paymentMethod: '付款方式',
        staff: '員工',
        ageGroup: '來客年齡層',
        visitedFrequency: '造訪次數',
        notFilledIn: '未填',
        orderStartDate: '開單日期',
        lineItemCreatedDate: '開單日期',
        endDate: '結帳日期',
        duration: '共計',
        product: '產品',
        quantity: '數量',
        subTotal: '小計',
        serveBy: '結帳人員'
      }
    })
  }

  render() {
    const { order, isLoading, haveData } = this.props
    const { t } = this.context

    Item = ({ orderDetail, lineItemDate }) => {
      return (
       	<View style={[{marginBottom: 10}]}>
          <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
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
        <View style={[styles.container, styles.nomgrBottom]}>
            <Text style={[styles.screenTitle]}>
              Order Id - {order.serialId}
            </Text>

            <View style={[styles.flex_dir_row, {alignItems: 'center'}]}>
              <View style={{width: '35%'}}>
                <View>
                  <Text
                    style={[
                      styles.paddingTopBtn8,
                      styles.textBig,
                      styles.orange_color
                    ]}
                  >
                    {order.orderType === 'IN_STORE' ? order.tableDisplayName : t('order.takeOut')}
                  </Text>
                </View>
              </View>

              <View style={[{width: '15%'}, styles.jc_alignIem_center]}>
                <View>
                  <FontAwesomeIcon
                    name="user"
                    size={25}
                    color="#f18d1a"
                    style={[styles.centerText]}
                  >
                    <Text style={[styles.textBig, styles.orange_color]}>
                      &nbsp;
                      {!this.props.navigation.state.params.customerCount
                        ? order.demographicData.male +
                        order.demographicData.female +
                        order.demographicData.kid
                        : this.props.navigation.state.params.customerCount}
                    </Text>
                  </FontAwesomeIcon>
                </View>
              </View>

              <View style={[{width: '50%'}]}>
                <View>
                  <Text style={[styles.toRight]}>
                    {t('staff')} - {order.servedBy}
                  </Text>
                  <Text style={[styles.toRight]}>
                    {formatDate(order.createdDate)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('ageGroup')}</Text>
              </View>
              <View style={{flex: 5}}>
                <Text style={{ textAlign: 'right'}}>
									{filteredageGroup !== undefined ? filteredageGroup.label : t('notFilledIn')}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('visitedFrequency')}</Text>
              </View>
              <View style={{flex: 5}}>
                <Text style={{ textAlign: 'right' }}>
                  {filteredvisitFrequency !== undefined ? filteredvisitFrequency.label : t('notFilledIn')}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('orderStartDate')}</Text>
              </View>
              <View style={{flex: 5}}>
                <Text style={{ textAlign: 'right'}}>
                  {formatTime(order.createdDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('endDate')}</Text>
              </View>
              <View style={{flex: 5}}>
                <Text style={{ textAlign: 'right'}}>
                  {formatTime(orderDuration.orderSettledDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('duration')}</Text>
              </View>
              <View style={{flex: 5}}>
                <Text style={{ textAlign: 'right'}}>
                  {orderDuration.durationHours} {t('timecard.hours')} {orderDuration.durationMinutes} {t('timecard.minutes')}
                </Text>
              </View>
            </View>

            <View style={styles.sectionBar}>
            	<View style={{flex: 2.5}}>
                	<Text style={styles.sectionBarTextSmall}>
                  	{t('lineItemCreatedDate')}
                	</Text>
            	</View>

            	<View style={{flex: 1.7}}>
              	<TouchableOpacity>
                	<Text style={styles.sectionBarTextSmall}>
                  	{t('product')}
                	</Text>
              	</TouchableOpacity>
            	</View>

            	<View style={{flex: 0.8}}>
              	<TouchableOpacity>
                	<Text style={styles.sectionBarTextSmall}>
                  	{t('quantity')}
                	</Text>
              	</TouchableOpacity>
            	</View>

            	<View style={{flex: 1.3}}>
               	<Text style={[styles.sectionBarTextSmall,{textAlign: 'right'}]}>{t('subTotal')}</Text>
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

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8, styles.grayBg]}>
              <View style={{flex: 1}}>
                <Text style={styles.orange_color}>{t('serviceCharge')}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{ textAlign: 'right' }}>
                  ${order.serviceCharge}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8, styles.grayBg]}>
              <View style={{flex: 1}}>
                <Text style={styles.orange_color}>{t('discount')}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{ textAlign: 'right' }}>
                  ${order.discount}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8, styles.grayBg]}>
              <View style={{flex: 1}}>
                <Text style={styles.orange_color}>{t('total')}</Text>
              </View>
              <View style={{flex: 1}}>
                <Text style={{ textAlign: 'right' }}>
                  ${order.total.amount}
                </Text>
              </View>
            </View>

            <FlatList
              data={order.transactions}
              renderItem={({item, index}) => (
                <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              		<View style={{flex: 1, alignItems: 'flex-start'}}>
                		<Text style={styles.orange_color}>{t('paymentMethod')}</Text>
              		</View>
              		<View style={{flex: 1, alignItems: 'flex-end'}}>
                		<Text>{item.paymentMethod}</Text>
              		</View>
            		</View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

             <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={styles.orange_color}>{t('serveBy')}</Text>
              </View>
               <View style={{flex: 1, alignItems: 'flex-end'}}>
                 <Text>
                   {order.servedBy}
                 </Text>
               </View>
             </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <Text style={styles.orange_color}>{t('orderStatus')}</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                {renderOrderState(order.state)}
              </View>
            </View>

            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Orders')}
            >
              <Text
                style={[
                  styles.bottomActionButton,
                  styles.cancelButton,
                  styles.mgrtotop20,
                  { alignSelf: 'center', justifyContent: 'center', width: 120 }
                ]}
              >
                {t('action.ok')}
              </Text>
            </TouchableOpacity>
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
