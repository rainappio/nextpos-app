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
import {
  getRangedSalesReport,
  getCustomerCountReport,
  getSalesDistributionReport
} from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import BackendErrorScreen from './BackendErrorScreen'
import { Tooltip } from 'react-native-elements'
import PureChart from 'react-native-pure-chart'

class SalesCharts extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.tooltipRef = React.createRef(null)

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
    this.props.getSalesDistributionReport()
    this.props.getCustomerCountReport()
  }

  render() {
    const {
      getrangedSalesReport,
      salesdistributionReport,
      customercountReport,
      isLoading,
      haveData,
      haveError,
      haveSDData
    } = this.props
    const { t } = this.state

    let data = {}
    data.labels = ['']
    data.datasets = []
    let innerObj = {}
    innerObj.data = [0]

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

    //# react ative chart kit*/

    // react native pure chart
    let weeklySales = []
    let weeklySalesObj = { color: 'orange', seriesName: 'weeklySales' }
    weeklySalesObj.data = []

    let lineColors = ['orange', 'dark blue']
    let series = ['series1', 'series2', 'series3', 'series4']
    if (containSalesData) {
      for (var i = 0; i < getrangedSalesReport.salesByRange.length; i++) {
        weeklySalesObj.data[0] = {
          x: getrangedSalesReport.salesByRange[0].formattedDate,
          y: 0
        }

        weeklySalesObj.data.push({
          x: getrangedSalesReport.salesByRange[i].formattedDate,
          y: getrangedSalesReport.salesByRange[i].total
        })
      }
    }
    weeklySales.push(weeklySalesObj)

    //=============================================

    // react native pure chart for (Monthly Customer Count)

    let dblLinesChartCustomerCountData = []
    let dblLinesChartCustomerCountDataObj = {
      color: 'orange',
      seriesName: 'customerCount'
    }
    dblLinesChartCustomerCountDataObj.data = []

    let dblLinesChartCustomerCountLastYearDataObj = {
      color: 'dark blue',
      seriesName: 'customerCountLastYr'
    }
    dblLinesChartCustomerCountLastYearDataObj.data = []

    if (this.props.haveCCData) {
      customercountReport.customerCountThisMonth.map(thismonthData => {
        dblLinesChartCustomerCountDataObj.data[0] = {
          x: thismonthData.date,
          y: 0
        }

        dblLinesChartCustomerCountDataObj.data.push({
          x: thismonthData.date,
          y: thismonthData.customerCount
        })

        if (customercountReport.customerCountThisMonthLastYear.length == 0) {
          dblLinesChartCustomerCountLastYearDataObj.data.push({
            x: thismonthData.date,
            y: 0
          })
        }
      })

      customercountReport.customerCountThisMonthLastYear.map(
        thismonthLastYearData => {
          dblLinesChartCustomerCountLastYearDataObj.data[0] = {
            x: thismonthLastYearData.date,
            y: 0
          }

          dblLinesChartCustomerCountLastYearDataObj.data.push({
            x: thismonthLastYearData.date,
            y: thismonthLastYearData.customerCount
          })
        }
      )
    }
    dblLinesChartCustomerCountData.push(dblLinesChartCustomerCountDataObj)
    dblLinesChartCustomerCountData.push(
      dblLinesChartCustomerCountLastYearDataObj
    )

    //#double line chart

    // react native pure chart for (Yearly Sales By Month)
    let yearlySalesByMonth = []
    let yearlySalesByMonthObj = { color: 'orange', seriesName: 'salesByMonth' }
    yearlySalesByMonthObj.data = []

    let yearlySalesByMonthLastYearObj = {
      color: 'dark blue',
      seriesName: 'salesByMonthLastYr'
    }
    yearlySalesByMonthLastYearObj.data = []

    if (haveSDData) {
      salesdistributionReport.salesByMonth.map(thismonthData => {
        yearlySalesByMonthObj.data[0] = {
          x: thismonthData.month,
          y: 0
        }

        yearlySalesByMonthObj.data.push({
          x: thismonthData.month,
          y: thismonthData.total
        })

        if (salesdistributionReport.salesByMonthLastYear.length == 0) {
          yearlySalesByMonthLastYearObj.data.push({
            x: thismonthData.month,
            y: 0
          })
        }
      })

      salesdistributionReport.salesByMonthLastYear.map(
        thismonthLastYearData => {
          yearlySalesByMonthLastYearObj.data[0] = {
            x: thismonthLastYearData.month,
            y: 0
          }

          yearlySalesByMonthLastYearObj.data.push({
            x: thismonthLastYearData.month,
            y: thismonthLastYearData.total
          })
        }
      )
    }
    yearlySalesByMonth.push(yearlySalesByMonthObj)
    yearlySalesByMonth.push(yearlySalesByMonthLastYearObj)

    //#double line chart

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
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveError) {
      return <BackendErrorScreen />
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

        <View style={{ position: 'relative' }}>
          <View style={styles.mgrbtn20}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                styles.paddingTopBtn8,
                { fontSize: 14 }
              ]}
            >
              Weekly Sales
            </Text>
            <PureChart data={weeklySales} type="line" width={'100%'} />
          </View>

          <View style={(styles.paddingTopBtn20, { marginLeft: -15 })}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                styles.paddingTopBtn8,
                { fontSize: 14 }
              ]}
            >
              Monthly Customer Count
            </Text>
            {this.props.haveCCData && (
              <PureChart
                data={dblLinesChartCustomerCountData}
                type="line"
                height={120}
                width={'95%'}
                style={{ backgroundColor: 'gold' }}
              />
            )}
          </View>

          <View style={styles.paddingTopBtn20}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                styles.paddingTopBtn8,
                { fontSize: 14 }
              ]}
            >
              Average Customer Spending
            </Text>
            {/*<PureChart 
							data={doubleLinesChartData} 
							//data={dblLinesChartData}
							type='line'
							width={'100%'}
    					/>*/}
          </View>

          <View style={styles.paddingTopBtn20}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                styles.paddingTopBtn8,
                { fontSize: 14 }
              ]}
            >
              Yearly Sales By Months
            </Text>
            {haveSDData && (
              <PureChart data={yearlySalesByMonth} type="line" width={'100%'} />
            )}
          </View>
        </View>

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
  checkS: state,
  getrangedSalesReport: state.getrangedsalesreport.data,
  salesdistributionReport: state.salesdistributionreport.data,
  customercountReport: state.customercountreport.data,
  haveData: state.getrangedsalesreport.haveData,
  haveError: state.getrangedsalesreport.haveError,
  isLoading: state.getrangedsalesreport.loading,
  haveCCData: state.customercountreport.haveData,
  haveSDData: state.salesdistributionreport.haveData
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getRangedSalesReport: () => dispatch(getRangedSalesReport()),
  getCustomerCountReport: () => dispatch(getCustomerCountReport()),
  getSalesDistributionReport: () => dispatch(getSalesDistributionReport())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesCharts)
