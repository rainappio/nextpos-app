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

    context.localize({
      en: {
        salesDashboardTitle: 'Sales Dashboard',
        todaySales: "Today's Sales",
        rangedSalesTitle: 'Weekly Sales',
        customerCountTitle: 'Customer Count',
        averageSpendingTitle: 'Average Customer Spending',
        salesDistributionTitle: 'Sales by Month',
        product: 'Product',
        quantity: 'Quantity',
        amount: 'Amount',
        percentage: 'Percentage',
        noSalesData: 'No sales data'
      },
      zh: {
        salesDashboardTitle: '銷售總覽',
        todaySales: '今日營業額',
        rangedSalesTitle: '一週銷售圖',
        customerCountTitle: '來客數量圖',
        averageSpendingTitle: '客單數圖',
        salesDistributionTitle: '年度銷售圖',
        product: '產品',
        quantity: '總數量',
        amount: '金額',
        percentage: '比例',
        noSalesData: '目前沒有銷售資料'
      }
    })
  }

  componentDidMount() {
    this.props.getRangedSalesReport()
    this.props.getSalesDistributionReport()
    this.props.getCustomerCountReport()
  }

  generateRangedSalesChart = (rangedSalesReport) => {

    let rangedSalesDataObj = {
      color: 'orange',
      seriesName: 'rangedSales',
      data: []
    }

    rangedSalesReport.salesByRange.map(stats => {
      rangedSalesDataObj.data.push({
        x: stats.formattedDate,
        y: stats.total
      })
    })

    return [ rangedSalesDataObj ]
  }

  generateCustomerStatsChart = (customerStatsReport) => {

    let customerCountDataObj = {
      color: 'orange',
      seriesName: 'customerCount',
      data: []
    }

    let customerAvgSpendingDataObj = {
      color: 'orange',
      seriesName: 'averageSpending',
      data: []
    }

    let customerCountLastYearDataObj = {
      color: 'gray',
      seriesName: 'customerCountLastYr',
      data: []
    }

    let customerAvgSpendingLastYearDataObj = {
      color: 'gray',
      seriesName: 'averageSpendingLastYr',
      data: []
    }

    customerStatsReport.customerStatsThisMonth.map(stats => {
      customerCountDataObj.data.push({
        x: stats.date,
        y: stats.customerCount
      })

      customerAvgSpendingDataObj.data.push({
        x: stats.date,
        y: stats.averageSpending
      })
    })

    customerStatsReport.customerStatsThisMonthLastYear.map(stats => {
      customerCountLastYearDataObj.data.push({
        x: stats.date,
        y: stats.customerCount
      })

      customerAvgSpendingLastYearDataObj.data.push({
        x: stats.date,
        y: stats.averageSpending
      })
    })

    const customerCountData = [customerCountDataObj, customerCountLastYearDataObj]
    const customerAvgSpendingData = [customerAvgSpendingDataObj, customerCountLastYearDataObj]

    return { countData: customerCountData, avgSpendingData: customerAvgSpendingData }
  }

  generateSalesDistribution = (salesDistributionReport) => {

    let yearlySalesDataObj = {
      color: 'orange',
      seriesName: 'salesByMonth',
      data: []
    }

    let yearlySalesLastYearDataObj = {
      color: 'gray',
      seriesName: 'salesByMonthLastYr',
      data: []
    }

    salesDistributionReport.salesByMonth.map(sales => {
      yearlySalesDataObj.data.push({
        x: sales.month,
        y: sales.total
      })
    })

    salesDistributionReport.salesByMonthLastYear.map(sales => {
      yearlySalesLastYearDataObj.data.push({
        x: sales.month,
        y: sales.total
      })
    })

    return [ yearlySalesDataObj, yearlySalesLastYearDataObj ]
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
    const { t } = this.context

    const containSalesData = haveData && getrangedSalesReport.salesByRange !== undefined

    // ranged sales
    let rangedSalesData = []

    if (containSalesData) {
      rangedSalesData = this.generateRangedSalesChart(getrangedSalesReport);
    }

    // customer stats
    let custCountData = [], custAvgSpendingData = []

    if (this.props.haveCCData) {
      const { countData, avgSpendingData } = this.generateCustomerStatsChart(customercountReport);
      custCountData = countData
      custAvgSpendingData = avgSpendingData
    }

    // sales distribution
    let salesDistributionData = []

    if (haveSDData) {
      salesDistributionData = this.generateSalesDistribution(salesdistributionReport)
    }

    const Item = ({ salesByPrdData }) => {
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
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
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
              {t('rangedSalesTitle')}
            </Text>
            <PureChart data={rangedSalesData} type="bar" width={'100%'} />
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
              {t('customerCountTitle')}
            </Text>
            {
            	this.props.haveCCData && (
              <PureChart
                data={custCountData}
                type="bar"
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
              {t('averageSpendingTitle')}
            </Text>
            {
            	this.props.haveCCData && (
            		<PureChart
            			data={custAvgSpendingData}
            			type='bar'
            			width={'100%'}
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
              {t('salesDistributionTitle')}
            </Text>
            {haveSDData && (
              <PureChart data={salesDistributionData} type="bar" width={'100%'} />
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
