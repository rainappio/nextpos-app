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
  getSalesDistributionReport, formatDate, formatDateObj
} from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import BackendErrorScreen from './BackendErrorScreen'
import { Tooltip } from 'react-native-elements'
import PureChart from 'react-native-pure-chart'
import Chart from "../components/Chart";
import moment from "moment";
import ScreenHeader from "../components/ScreenHeader";
import SalesChartsFilterForm from './SalesChartsFilterForm'
import { api, dispatchFetchRequest, errorAlert, warningMessage } from '../constants/Backend'
import RenderTable from '../components/RenderTable'
import CustomerCountFilterForm from './CustomerCountFilterForm'
import { Chevron } from 'react-native-shapes'
import LoadingScreen from "./LoadingScreen";

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
        rangedSalesTitle: 'Ranged Sales',
        todaySales: 'Sales Total',
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
        rangedSalesTitle: '銷售圖表',
        todaySales: '總營業額',
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
      test: {},
      filteredWeeklySalesReport: [],
      filteredCustomerCountReport: []
    }
  }

  componentDidMount() {
    this.props.getRangedSalesReport()
    this.props.getSalesDistributionReport()
    this.props.getCustomerCountReport()
  }

  generateRangedSalesChart = (rangedSalesReport) => {

    const fromDate = formatDateObj(new Date(rangedSalesReport.dateRange.zonedFromDate))
    const toDate = formatDateObj(new Date(rangedSalesReport.dateRange.zonedToDate))

    let rangedSalesData = {
      legend: [`${fromDate} - ${toDate}`],
      labels: [],
      data: []
    }
    rangedSalesReport.salesByRange.map(stats => {
      const date = moment(stats.date).format('MM/DD')
      rangedSalesData.labels.push(date)
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
      const date = moment(stats.date).format('MM/DD')
      customerCountData.labels.push(date)
      customerCountData.data.push(stats.customerCount)

      customerAverageSpendingData.labels.push(date)
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
      const month = moment(sales.date).format('MMM')
      yearlySalesData.labels.push(month)
      yearlySalesData.data.push(sales.total)
    })

    salesDistributionReport.salesByMonthLastYear.map(sales => {
      yearlySalesData.data2.push(sales.total)
    })

    return yearlySalesData
  }

  handleFilterSalesChart = values => {
    const searchFromDate = moment(values.fromDate).format("YYYY-MM-DDTHH:mm:ss")
    const searchToDate = moment(values.toDate).format("YYYY-MM-DDTHH:mm:ss")
    console.log(`Ranged sales selected dates - from: ${searchFromDate} to: ${searchToDate}`)

    this.props.getRangedSalesReport('CUSTOM', searchFromDate, searchToDate)
  }

  handleFilterCCChart = values => {
  	const month = values.month;
  	const year = values.year;

  	if (!month || !year) {
      warningMessage('Please Choose Both Year and Month')
      return
    }

    dispatchFetchRequest(
      api.report.getcustomerStatsReportByDateMonth(year, month),
      {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {}
      },
      response => {
        response.json().then(data => {
          this.setState({
          	filteredCustomerCountReport: data
          })
        })
      }
    ).then()
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
    const { t, theme } = this.context
    const { filteredWeeklySalesReport, filteredCustomerCountReport } = this.state
    const containSalesData = haveData && getrangedSalesReport.salesByRange !== undefined

    // ranged sales
    let rangedSalesData = {}

    if (containSalesData) {
      rangedSalesData = this.generateRangedSalesChart(getrangedSalesReport);
    }

    const filteredcontainSalesData =
      filteredWeeklySalesReport.length !== 0 && filteredWeeklySalesReport.salesByRange !== undefined

    // filtered ranged sales
    let filteredRangedSalesData = {}

    if (filteredcontainSalesData) {
      filteredRangedSalesData = this.generateRangedSalesChart(filteredWeeklySalesReport)
    }

    // customer stats
    let custCountData = {}, custAvgSpendingData = {}, filteredCustCountData = {}, filteredAvgSpendingData = {}

    if (this.props.haveCCData) {
      const { countData, avgSpendingData } = this.generateCustomerStatsChart(customercountReport);
      custCountData = countData
      custAvgSpendingData = avgSpendingData
    }

     const filteredCustomerCountData =
      filteredCustomerCountReport.length !== 0 && filteredCustomerCountReport.customerStatsThisMonth !== undefined

      if (filteredCustomerCountData) {
      	const { countData, avgSpendingData } = this.generateCustomerStatsChart(filteredCustomerCountReport);
      	filteredCustCountData = countData
      	filteredAvgSpendingData = avgSpendingData
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
            <Text style={theme}>{salesByPrdData.productName}</Text>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
            <Text style={theme}>{salesByPrdData.salesQuantity}</Text>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
            <Text style={theme}>{salesByPrdData.productSales}</Text>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
            <Text style={theme}>{salesByPrdData.percentage}%</Text>
          </View>
        </View>
      )
    }

    if (isLoading) {
      return (
        <LoadingScreen/>
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
      <ScrollView scrollIndicatorInsets={{ right: 1 }} style={[styles.fullWidthScreen, theme]}>
          <ScreenHeader backNavigation={true}
                        parentFullScreen={true}
                        title={t('salesDashboardTitle')}
          />

        <View>
          <SalesChartsFilterForm
          	onSubmit={this.handleFilterSalesChart}
            initialValues={{
              fromDate: new Date(getrangedSalesReport.dateRange.zonedFromDate),
              toDate: new Date(getrangedSalesReport.dateRange.zonedToDate)
            }}
            theme={theme}
          	/>

          <View>
            <Text style={styles.screenSubTitle}>
              {t('todaySales')} - ${getrangedSalesReport.todayTotal}
            </Text>
          </View>

          <Chart
            data={Object.keys(filteredRangedSalesData).length !== 0 ? filteredRangedSalesData : rangedSalesData}
            width={Dimensions.get('window').width * 2}
            props={{
              yAxisLabel: '$'
            }}
          />

					<RenderTable reportData={rangedSalesData}/>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.screenSubTitle}>
              {t('salesRankingTitle')}
            </Text>
          </View>
          <View style={{marginBottom: 20}}>
            <View style={styles.sectionBar}>
              <View style={[styles.quarter_width, styles.tableCellView]}>
                <Text style={[styles.sectionBarTextSmall]}>{t('product')}</Text>
              </View>

              <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                <Text style={styles.sectionBarTextSmall}>{t('quantity')}</Text>
              </View>

              <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                <Text style={styles.sectionBarTextSmall}>{t('amount')}</Text>
              </View>

              <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
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
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.screenSubTitle}>
            {t('customerCountTitle')}
          </Text>
          <CustomerCountFilterForm onSubmit={this.handleFilterCCChart}/>
          {
            this.props.haveCCData && (
            <View>
            	<View style={styles.mgrbtn12}>
                <Chart
                  data={Object.keys(filteredCustCountData).length !== 0 ? filteredCustCountData : custCountData}
                  width={Dimensions.get('window').width * 3}
                  props={{
                    verticalLabelRotation: 45
                  }}
                />
              </View>
              <RenderTable reportData={Object.keys(filteredCustCountData).length !== 0 ? filteredCustCountData : custCountData}/>
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.screenSubTitle}>
            {t('averageSpendingTitle')}
          </Text>
          {
            this.props.haveCCData && (
            	<View>
                <Chart
                  data={Object.keys(filteredAvgSpendingData).length !== 0 ? filteredAvgSpendingData : custAvgSpendingData}
                  width={Dimensions.get('window').width * 3}
                  props={{
                    yAxisLabel: '$',
                    verticalLabelRotation: 45
                  }}
                />
                <RenderTable reportData={Object.keys(filteredAvgSpendingData).length !== 0 ? filteredAvgSpendingData : custAvgSpendingData}/>
              </View>
            )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.screenSubTitle}>
            {t('salesDistributionTitle')}
          </Text>
          {haveSDData && (
            <View>
              <Chart
                data={salesDistributionData}
                width={Dimensions.get('window').width * 2}
                props={{
                  yAxisLabel: '$',
                  verticalLabelRotation: 45,
                }}
              />
              <RenderTable reportData={salesDistributionData}/>
            </View>
          )}
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
  getRangedSalesReport: (rangeType, fromDate, toDate) => dispatch(getRangedSalesReport(rangeType, fromDate, toDate)),
  getCustomerCountReport: () => dispatch(getCustomerCountReport()),
  getSalesDistributionReport: () => dispatch(getSalesDistributionReport())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesCharts)
