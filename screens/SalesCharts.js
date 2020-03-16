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
import Chart from "../components/Chart";
import moment from "moment";
import ScreenHeader from "../components/ScreenHeader";

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
        salesRankingTitle: 'Sales Ranking By Product',
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
        salesRankingTitle: '產品銷售排行榜',
        product: '產品',
        quantity: '總數量',
        amount: '金額',
        percentage: '比例',
        noSalesData: '目前沒有銷售資料'
      }
    })

    this.state = {
      test: {}
    }
  }

  componentDidMount() {
    this.props.getRangedSalesReport()
    this.props.getSalesDistributionReport()
    this.props.getCustomerCountReport()
  }

  generateRangedSalesChart = (rangedSalesReport) => {

    let rangedSalesData = {
      legend: ['This week'],
      labels: [],
      data: []
    }
    rangedSalesReport.salesByRange.map(stats => {
      rangedSalesData.labels.push(stats.date)
      rangedSalesData.data.push(stats.total)
    })

    return rangedSalesData
  }

  generateCustomerStatsChart = (customerStatsReport) => {

    const customerCountData = {
      legend: ['This year', 'Last year'],
      labels: [],
      data: [],
      data2: []
    }

    const customerAverageSpendingData = {
      legend: ['This year', 'Last year'],
      labels: [],
      data: [],
      data2: []
    }

    customerStatsReport.customerStatsThisMonth.map(stats => {
      customerCountData.labels.push(stats.date)
      customerCountData.data.push(stats.customerCount)

      customerAverageSpendingData.labels.push(stats.date)
      customerAverageSpendingData.data.push(stats.averageSpending)
    })

    customerStatsReport.customerStatsThisMonthLastYear.map(stats => {
      customerCountData.data2.push(stats.customerCount)
      customerAverageSpendingData.data2.push(stats.averageSpending)
    })

    return { countData: customerCountData, avgSpendingData: customerAverageSpendingData }
  }

  generateSalesDistribution = (salesDistributionReport) => {

    const yearlySalesData = {
      legend: ['This year', 'Last year'],
      labels: [],
      data: [],
      data2: []
    }

    salesDistributionReport.salesByMonth.map(sales => {
      yearlySalesData.labels.push(sales.date)
      yearlySalesData.data.push(sales.total)
    })

    salesDistributionReport.salesByMonthLastYear.map(sales => {
      yearlySalesData.data2.push(sales.total)
    })

    return yearlySalesData
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
    let rangedSalesData = {}

    if (containSalesData) {
      rangedSalesData = this.generateRangedSalesChart(getrangedSalesReport);
    }

    // customer stats
    let custCountData = {}, custAvgSpendingData = {}

    if (this.props.haveCCData) {
      const { countData, avgSpendingData } = this.generateCustomerStatsChart(customercountReport);
      custCountData = countData
      custAvgSpendingData = avgSpendingData
    }

    // sales distribution
    let salesDistributionData = {}

    if (haveSDData) {
      salesDistributionData = this.generateSalesDistribution(salesdistributionReport)
    }

    const Item = ({ salesByPrdData }) => {
      return (
        <View
          style={[styles.tableRowContainer]}
          key={salesByPrdData.id}
        >
          <View style={[styles.quarter_width, styles.tableCellView]}>
            <Text>{salesByPrdData.productName}</Text>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView]}>
            <Text>{salesByPrdData.salesQuantity}</Text>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView]}>
            <Text>{salesByPrdData.productSales}</Text>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView]}>
            <Text>{salesByPrdData.percentage}%</Text>
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
        <View style={[styles.container]}>
          <View style={{ flex: 1 }}>
            <ScreenHeader backNavigation={true}
                          title={t('salesDashboardTitle')}
            />
          </View>
          <Text style={{ flex: 3, alignSelf: 'center' }}>
            {t('noSalesData')}
          </Text>
        </View>
      )
    }

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <View style={[styles.container]}>
          <ScreenHeader backNavigation={true}
                        title={t('salesDashboardTitle')}
          />

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
          </View>
        </View>

        <View>
          <View style={styles.mgrbtn20}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                { fontSize: 14 }
              ]}
            >
              {t('rangedSalesTitle')}
            </Text>
            <Chart
              data={rangedSalesData}
              width={Dimensions.get('window').width}
              props={{
                yAxisLabel: '$',
                yAxisSuffix: 'k',
                formatYLabel: (value) => {
                  return value / 1000
                },
                formatXLabel: (value) => {
                  return moment(value, 'YYYY-MM-DD').format('MM/DD')
                }
              }}
            />
          </View>


          <View style={styles.paddingTopBtn20}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                { fontSize: 14 }
              ]}
            >
              {t('customerCountTitle')}
            </Text>
            {
            	this.props.haveCCData && (
                <Chart
                  data={custCountData}
                  width={Dimensions.get('window').width * 3}
                  props={{
                    verticalLabelRotation: 45,
                    formatXLabel: (value) => {
                      return moment(value, 'YYYY-MM-DD').format('MM/DD')
                    }
                  }}
                />
            )}
          </View>

          <View style={styles.paddingTopBtn20}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                { fontSize: 14 }
              ]}
            >
              {t('averageSpendingTitle')}
            </Text>
            {
            	this.props.haveCCData && (
                <Chart
                  data={custAvgSpendingData}
                  width={Dimensions.get('window').width * 3}
                  props={{
                    yAxisLabel: '$',
                    yAxisSuffix: 'k',
                    verticalLabelRotation: 45,
                    formatYLabel: (value) => {
                      return value / 1000
                    },
                    formatXLabel: (value) => {
                      return moment(value, 'YYYY-MM-DD').format('MM/DD')
                    }
                  }}
                />
              )}
          </View>

          <View style={styles.paddingTopBtn20}>
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textBold,
                { fontSize: 14 }
              ]}
            >
              {t('salesDistributionTitle')}
            </Text>
            {haveSDData && (
              <Chart
                data={salesDistributionData}
                width={Dimensions.get('window').width * 2}
                props={{
                  yAxisLabel: '$',
                  yAxisSuffix: 'k',
                  verticalLabelRotation: 45,
                  formatYLabel: (value) => {
                    return value / 1000
                  },
                  formatXLabel: (value) => {
                    return moment(value, 'YYYY-MM-DD').format('MMM')
                  }
                }}
              />
            )}
          </View>
        </View>

        <View style={styles.paddingTopBtn20}>
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textBold,
              { fontSize: 14 }
            ]}
          >
            {t('salesRankingTitle')}
          </Text>
        </View>

        <View style={{marginBottom: 20}}>
          <View style={styles.sectionBar}>
            <View style={[styles.quarter_width, styles.tableCellView]}>
              <Text style={[styles.sectionBarTextSmall]}>{t('product')}</Text>
            </View>

            <View style={[styles.quarter_width, styles.tableCellView]}>
              <Text style={styles.sectionBarTextSmall}>{t('quantity')}</Text>
            </View>

            <View style={[styles.quarter_width, styles.tableCellView]}>
              <Text style={styles.sectionBarTextSmall}>{t('amount')}</Text>
            </View>

            <View style={[styles.quarter_width, styles.tableCellView]}>
              <Text style={styles.sectionBarTextSmall}>{t('percentage')}</Text>
            </View>
          </View>
          <FlatList
            data={getrangedSalesReport.salesByProducts}
            renderItem={({item}) => {
              return <Item salesByPrdData={item}/>
            }}
            keyExtractor={item => item.id}
          />
        </View>
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
