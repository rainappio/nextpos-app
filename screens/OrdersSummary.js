import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableHighlight,
  TextInput,
  RefreshControl,
  AsyncStorage,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  FlatList
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import {
  Accordion,
  List,
  SwipeListView,
  SwipeRow,
  SwipeAction
} from '@ant-design/react-native'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import { getProducts, getLables, getOrder, readableDateFormat } from '../actions'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import styles from '../styles'

class OrdersSummary extends React.Component {

  componentDidMount() {
    this.props.getLables()
    this.props.getProducts()
    this.props.getOrder()
  }

  static navigationOptions = {
    header: null
  }

  constructor() {
    super(...arguments)
    this.state = {
      activeSections: [2, 0],
      selectedProducts: [],
      refreshing: false,
      status: '',
      labelId: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  render() {
    const {
      products = [],
      labels = [],
      navigation,
      haveData,
      haveError,
      isLoading,
      label,
      order
    } = this.props
console.log(this.props)
    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveError) {
      return (
        <View style={[styles.container]}>
          <Text>Err during loading, check internet conn...</Text>
        </View>
      )
    } else if (products !== undefined && products.length === 0) {
      return (
        <View style={[styles.container]}>
          <Text>no products ...</Text>
        </View>
      )
    }

    return (
      <ScrollView>
        <View
          style={{
            marginTop: 62,
            marginLeft: 35,
            marginRight: 35,
            marginBottom: 30
          }}
        >
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Order Summary
          </Text>

          <View style={[styles.flex_dir_row]}>
            <View style={[styles.quarter_width]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <View>
                  <Text
                    style={[
                      styles.paddingTopBtn8,
                      styles.textBig,
                      styles.orange_color
                    ]}
                  >
                    {order.tableInfo.tableName !== undefined ? order.tableInfo.tableName : null }

                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <View>
                  <FontAwesomeIcon
                    name="user"
                    size={25}
                    color="#f18d1a"
                    style={[styles.centerText]}
                  >
                    <Text style={[styles.textBig, styles.orange_color]}>
                      &nbsp;{order.demographicData.male + order.demographicData.female + order.demographicData.kid}
                    </Text>
                  </FontAwesomeIcon>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.fullhalf_width]}>
              <TouchableOpacity
              >
                <View>
                  <Text style={styles.toRight}>Staff - {order.servedBy}</Text>
                  <Text style={styles.toRight}>{readableDateFormat(order.createdDate)}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.shoppingBar,
            styles.paddLeft20,
            styles.paddRight20,
            styles.top40,
            styles.mgrbtn80
          ]}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
            //onPress={() => this.props.navigation.navigate('Orders')}
            >
              <Text style={[styles.paddingTopBtn8, styles.whiteColor]}>
                Product
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
            //onPress={() => this.props.navigation.navigate('Orders')}
            >
              <Text style={[styles.whiteColor]}>&nbsp;&nbsp;QTY</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OrdersSummary')}
            >
              <Text style={styles.whiteColor}>U/P</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('OrdersSummary')}
            >
              <Text style={styles.whiteColor}>Subtotal</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/*					<View style={{marginLeft: 35,
    marginRight: 35,position: 'relative'}}>*/}

        <View style={styles.container}>
          <View style={styles.flex_dir_row}>
            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <Text style={{ textAlign: 'left', marginLeft: -28 }}>
                  Black
                </Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <TouchableOpacity
              //onPress={() => this.props.navigation.navigate('Orders')}
              >
                <Text>&nbsp;&nbsp;1</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OrdersSummary')}
              >
                <Text>$3</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OrdersSummary')}
              >
                <Text style={{ marginRight: -24 }}>4500 TX</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.flex_dir_row,
              styles.mgrtotop20,
              styles.grayBg,
              styles.paddingTopBtn8
            ]}
          >
            <View style={[styles.half_width]}>
              <Text>Total</Text>
            </View>

            <View style={[styles.half_width]}>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OrdersSummary')}
              >
                <Text style={{ textAlign: 'right', marginRight: -26 }}>
                  {order.orderTotal} TX
                </Text>
              </TouchableOpacity>
            </View>
          </View>


          {
						(order.state === 'OPEN' || order.state === 'IN_PROCESS' || order.state === 'DELIVERED')
						? 
							<View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86',
                backgroundColor: '#F39F86',
                marginRight: '2%',
                marginBottom: 8,
                marginTop: 22
              }}
            >
              <TouchableOpacity
                onPress={(order) => {
                  this.props.navigation.navigate('Tables')
                  //this.props.navigation.state.params.onSubmit()
                }}
              >
                <Text style={[styles.signInText, styles.whiteColor]}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
						:
						null
					}           

					
            <View
              style={{
                width: '100%',
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86'
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.goBack()
                }}
              >
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
       
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels,
  subproducts: state.label.data.subLabels,
  products: state.products.data.results,
  haveData: state.products.haveData,
  haveError: state.products.haveError,
  isLoading: state.products.loading,
  order: state.order.data,
  initialValues: state.order.data
})

const mapDispatchToProps = (dispatch,props) => ({
  dispatch,
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts()),
  getOrder: () => dispatch(getOrder(props.navigation.state.params.orderId))
})

OrdersSummary = reduxForm({
  form: 'ordersummaryForm'
})(OrdersSummary)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrdersSummary)
