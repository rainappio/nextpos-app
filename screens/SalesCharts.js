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
  TextInput,
  Dimensions,
  FlatList,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { LineChart } from 'react-native-chart-kit'
import { getRangedSalesReport } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import BackendErrorScreen from "./BackendErrorScreen"

class SalesCharts extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        salesDashboardTitle: 'Sales Dashboard',
        todaySales: "Today's Sales",
        product: 'Product',
        quantity: 'Quantity',
        amount: 'Amount',
        percentage: 'Percentage',
        noSalesData: 'No sales data'
      },
      zh: {
        salesDashboardTitle: '銷售總覽',
        todaySales: '今日營業額',
        product: '產品',
        quantity: '總數量',
        amount: '金額',
        percentage: '比例',
        noSalesData: '目前沒有銷售資料'
      }
    })

    this.state = {
      t: context.t,
      dataArr: []
    }
  }

  componentDidMount() {
    this.props.getRangedSalesReport()
  }

  render() {
    const { getrangedSalesReport, isLoading, haveData, haveError } = this.props
    const { t } = this.state

    let data = {}
    data.labels = []
    data.datasets = []
    let innerObj = {}
    innerObj.data = []

    const containSalesData =
      haveData &&
      getrangedSalesReport.salesByRange !== undefined &&
      getrangedSalesReport.salesByRange.length > 0

    if (containSalesData) {
      for (var i = 0; i < getrangedSalesReport.salesByRange.length; i++) {
        data.labels.push(getrangedSalesReport.salesByRange[i].formattedDate)
        innerObj.data.push(getrangedSalesReport.salesByRange[i].total)
      }
    }
    data.datasets.push(innerObj)

    const screenWidth = Dimensions.get('window').width
    const chartConfig = {
      backgroundColor: '#e26a00',
      backgroundGradientFrom: '#fb8c00',
      backgroundGradientTo: '#ffa726',
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: '6',
        strokeWidth: '2',
        stroke: '#ffa726'
      }
    }

    Item = ({ salesByPrdData }) => {
      return (
        <View
          style={[styles.flex_dir_row, styles.paddingTopBtn8]}
          key={salesByPrdData.id}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text style={[styles.paddingTopBtn8]}>
              {salesByPrdData.productName}
            </Text>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text>{salesByPrdData.salesQuantity}</Text>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text>&nbsp;&nbsp;{salesByPrdData.productSales}</Text>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <Text>{salesByPrdData.percentage}&nbsp;%</Text>
          </View>
        </View>
      )
    }

    if (isLoading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc"/>
        </View>
      )
    } else if (haveError) {
      return (<BackendErrorScreen/>)

    } else if (!containSalesData) {
      return (
        <View style={[styles.container, styles.nomgrBottom]}>
          <View style={{ flex: 1 }}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {t('salesDashboardTitle')}
            </Text>
          </View>
          <Text style={{ flex: 3, alignSelf: 'center' }}>
            {t('noSalesData')}
          </Text>
        </View>
      )
    }

    return (
      <ScrollView>
        <View style={[styles.container, styles.nomgrBottom]}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            {t('salesDashboardTitle')}
          </Text>

          <View style={[styles.flex_dir_row, styles.paddingTopBtn8]}>
            <View style={{ width: '80%' }}>
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textBold,
                  styles.paddingTopBtn8,
                  { fontSize: 14 }
                ]}
              >
                {t('todaySales')} - ${getrangedSalesReport.todayTotal}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.orange_color,
                  styles.toRight,
                  {
                    borderWidth: 1,
                    borderColor: '#f18d1a',
                    padding: 6,
                    marginLeft: 8
                  }
                ]}
                onPress={() => {
                  this.props.navigation.navigate('Orders')
                }}
              >
                Details
              </Text>
            </View>
          </View>
        </View>

        {data.labels.length !== 0 && (
          <LineChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            onDataPointClick={({ value, dataset, getColor, ix }) =>
              alert(value)
            }
          />
        )}

        <View
          style={[
            styles.orange_bg,
            styles.flex_dir_row,
            styles.mgrtotop20,
            styles.paddingTopBtn8
          ]}
        >
          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={[styles.paddingTopBtn8]}>{t('product')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text style={{ marginLeft: -20 }}>{t('quantity')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text>{t('amount')}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quarter_width, styles.jc_alignIem_center]}>
            <TouchableOpacity>
              <Text>{t('percentage')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={getrangedSalesReport.salesByProducts}
          renderItem={({ item }) => {
            return <Item salesByPrdData={item} />
          }}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  chkS: state,
  getrangedSalesReport: state.getrangedsalesreport.data,
  haveData: state.getrangedsalesreport.haveData,
  haveError: state.getrangedsalesreport.haveError,
  isLoading: state.getrangedsalesreport.loading
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getRangedSalesReport: () => dispatch(getRangedSalesReport())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesCharts)
