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
				{label: '50-59', value: 'FIFTIES'}
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
        startDate: 'Start Date', 
        endDate: 'End Date',
        duration: 'Total Duration',
        product: 'Product',
        quantity: 'Qty',
        subTotal: 'Subtotal',
        startDate: 'Start Date',
        serveBy: 'Serve By'
      },
      zh: {
        serviceCharge: '服務費',
        discount: '折扣',
        total: '總金額',
        paymentMethod: '付款方式',
        staff: '員工',
        ageGroup: 'Age Group-CH', 
        visitedFrequency: 'Visited Frequency-CH', 
        startDate: 'Start Date-CH', 
        endDate: 'End Date-CH',
        duration: 'Total Duration-CH',
        product: '產品',
        quantity: '數量',
        subTotal: '小計',
        startDate: 'Start Date CH',
        serveBy: 'Serve By CH'
      }
    })  
  }

  render() {
    const { order, isLoading, haveData } = this.props
    const { t } = this.context

    Item = ({ orderDetail, createdDate }) => {
      return (
       	<View style={[{marginBottom: 10}]}>
          <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
            <View style={{flex: 2.5}}>
              <Text>
              	{formatTime(createdDate)}
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
    	var filteredageGroup = this.state.ageGroups.filter( ageGroup => {
				return ageGroup.value == order.demographicData.ageGroup && ageGroup.label
			})

			var filteredvisitFrequency = this.state.visitFrequencies.filter( visitFreq => {
				return visitFreq.value == order.demographicData.visitFrequency && visitFreq.label
			})

      return (
      	<ScrollView>
        <View style={[styles.container, styles.nomgrBottom]}>
        	
          {/*<View style={[styles.whiteBg, styles.boxShadow, styles.popUpLayout,{paddingLeft: 4, paddingRight: 4, paddingTop: 20, paddingBottom: 10}]}>*/}
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
									{filteredageGroup[0] !== undefined && filteredageGroup[0].label}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('visitedFrequency')}</Text>
              </View>
              <View style={{flex: 5}}>
                <Text style={{ textAlign: 'right' }}>
                  {filteredvisitFrequency[0] !== undefined && filteredvisitFrequency[0].label}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('startDate')}</Text>
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
                  {formatTime(order.modifiedDate)}
                </Text>
              </View>
            </View>

            <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{flex: 5}}>
                <Text style={styles.orange_color}>{t('duration')}</Text>
              </View>
              <View style={{flex: 5}}>
                <Text style={{ textAlign: 'right'}}>
                  {0}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.paddingTopBtn8,
                styles.orange_color,
                styles.textBold
              ]}
            >
            Line Items
            </Text>
            <View style={styles.sectionBar}>
            	<View style={{flex: 2.5}}>
                	<Text style={styles.sectionBarTextSmall}>
                  	{t('startDate')}
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
              data={order.lineItems}
              renderItem={({item, index}) => (
                <Item
                	orderDetail={item}
                	createdDate={order.createdDate}                	
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
              		<View style={{ flex: 9 }}>
                		<Text style={styles.orange_color}>{t('paymentMethod')}</Text>
              		</View>
              		<View>           		
                		<Text>{item.paymentMethod}</Text>   
              		</View>
            		</View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />

             <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
              <View style={{ width: '90%' }}>
                <Text style={styles.orange_color}>{t('serveBy')}</Text>
              </View>
              <Text>
                {order.servedBy}
              </Text>
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
        {/*  </View>*/}
        
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
