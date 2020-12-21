import React from 'react'
import {Text, View} from 'react-native'
import {connect} from 'react-redux'
import {getCustomerCountReport, getCustomerTrafficReport} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import BackendErrorScreen from './BackendErrorScreen'
import moment from "moment";
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import SvgBarChart from "../components/SvgBarChart";
import MonthPicker from "../components/MonthPicker";
import RenderTable from "../components/RenderTable";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";

class CustomerStats extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        customerStatsTitle: 'Customer Statistics',
        orderTraffic: 'Order Traffic',
        noData: 'There is no data in the specified month.',
        orderType: 'Order Type',
        ageGroup: 'Age Group',
        visitFrequency: 'Visit Frequency',
        customerCountHeading: 'Customer Count',
        total: 'Total',
        percentage: 'Percentage',
        age: {
          TWENTIES: '20 - 29',
          THIRTIES: '30 - 39',
          FORTIES: '40 - 49',
          FIFTIES_AND_ABOVE: '50+',
          NOT_ENTERED: 'Not Entered'
        },
        visit: {
          FIRST_TIME: '1',
          TWO_TO_THREE: '2 - 3',
          MORE_THAN_THREE: '4+',
          NOT_ENTERED: 'Not Entered'
        },
        customerCount: 'Customer Count',
        maleCount: 'Male',
        femaleCount: 'Female',
        kidCount: 'Kid',
        customerCountTitle: 'Customer Count',
        averageSpendingTitle: 'Average Customer Spending'

      },
      zh: {
        customerStatsTitle: '來客總覽',
        orderTraffic: '訂單流量',
        noData: '你選擇的月份沒有銷售資料.',
        orderType: '訂單類別',
        ageGroup: '來客年齡層',
        visitFrequency: '造訪次數',
        customerCountHeading: '來客數統計',
        total: '總數量',
        percentage: '百分比',
        age: {
          TWENTIES: '20 - 29',
          THIRTIES: '30 - 39',
          FORTIES: '40 - 49',
          FIFTIES_AND_ABOVE: '50+',
          NOT_ENTERED: '未輸入'
        },
        visit: {
          FIRST_TIME: '1',
          TWO_TO_THREE: '2 - 3',
          MORE_THAN_THREE: '4+',
          NOT_ENTERED: '未輸入'
        },
        customerCount: '總共',
        maleCount: '男生',
        femaleCount: '女生',
        kidCount: '小孩',
        customerCountTitle: '來客數量',
        averageSpendingTitle: '客單價',

      }
    })

    this.state = {
      currentDate: moment(new Date()),
      selectedFilter: 0,
      filteredWeeklySalesReport: [],
    }
  }

  componentDidMount() {
    this.props.getCustomerTrafficReport()
    this.props.getCustomerCountReport()
  }

  generateCustomerTrafficChart = (customerTrafficReport) => {

    let customerTrafficData = []

    customerTrafficReport.customerTraffics.map(stats => {
      customerTrafficData.push({label: stats.hourOfDay, value: stats.orderCount})
    })

    return customerTrafficData
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

    return {countData: customerCountData, avgSpendingData: customerAverageSpendingData}
  }

  render() {
    const {
      customerTrafficReport,
      customercountReport,
      isLoading,
      haveData,
      haveError,
      haveCCData,
    } = this.props
    const {t} = this.context
    const containSalesData = haveData && customerTrafficReport.totalCount !== undefined && customerTrafficReport.totalCount.orderCount > 0

    // ranged sales
    let customerTrafficData = {}
    let maxValue = 0

    if (containSalesData) {
      customerTrafficData = this.generateCustomerTrafficChart(customerTrafficReport);
      maxValue = Math.max(...customerTrafficReport.customerTraffics.map(stats => stats.orderCount));
    }

    const filteredCustomerTrafficData = customerTrafficData

    const ordersByType = customerTrafficReport.ordersByType
    const ordersByAgeGroup = customerTrafficReport.ordersByAgeGroup
    const ordersByVisitFrequency = customerTrafficReport.ordersByVisitFrequency
    const totalCount = customerTrafficReport.totalCount

    // customer stats
    let custCountData = {}
    let custAvgSpendingData = {}

    if (haveCCData) {
      const {countData, avgSpendingData} = this.generateCustomerStatsChart(customercountReport);
      custCountData = countData
      custAvgSpendingData = avgSpendingData
    }

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return <BackendErrorScreen />

    } else if (!haveData && !haveCCData) {
      return (
        <View style={[styles.container]}>
          <View style={{flex: 1}}>
            <ScreenHeader backNavigation={true}
              title={t('salesDashboardTitle')}
            />
          </View>
          <Text style={{flex: 3, alignSelf: 'center'}}>
            {t('noSalesData')}
          </Text>
        </View>
      )
    }

    return (
      <ThemeScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            title={t('customerStatsTitle')}
          />


          <MonthPicker
            currentDate={this.state.currentDate}
            selectedFilter={this.state.selectedFilter}
            handleMonthChange={(date, selectedFilter) => {
              this.setState({currentDate: date, selectedFilter: selectedFilter})

              this.props.getCustomerTrafficReport(date.year(), date.month() + 1)
              this.props.getCustomerCountReport(date.year(), date.month() + 1)
            }}
          />

          {totalCount !== null && totalCount.orderCount === 0 && (
            <View>
              <StyledText style={styles.messageBlock}>{t('noData')}</StyledText>
            </View>
          )}

          {totalCount !== null && totalCount.orderCount > 0 && (
            <View>
              <View>
                <Text style={styles.screenSubTitle}>
                  {t('orderTraffic')}
                </Text>
                <SvgBarChart data={filteredCustomerTrafficData} legend='Order Count' round={maxValue} />
              </View>

              <View style={styles.verticalPadding}>
                <View style={styles.tableRowContainerWithBorder}>
                  <View style={[styles.tableCellView, {flex: 1}]}>
                    <Text style={styles.sectionBarText}>{t('orderType')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                    <Text style={styles.sectionBarText}>{t('total')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                    <Text style={styles.sectionBarText}>{t('percentage')}</Text>
                  </View>
                </View>

                {
                  ordersByType !== null && ordersByType.map(order => (
                    order.orderType === 'ONLINE' ? null : <View
                      key={order.id}
                      style={styles.tableRowContainerWithBorder}
                    >
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <StyledText>{t(`order.${order.orderType}`)}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <StyledText>{order.orderCount}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText>{order.percentage}</StyledText>
                      </View>
                    </View>
                  ))
                }

                <View style={styles.tableRowContainerWithBorder}>
                  <View style={[styles.tableCellView, {flex: 1}]}>
                    <Text style={styles.sectionBarText}>{t('ageGroup')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                    <Text style={styles.sectionBarText}>{t('total')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                    <Text style={styles.sectionBarText}>{t('percentage')}</Text>
                  </View>
                </View>

                {
                  ordersByAgeGroup !== null && ordersByAgeGroup.map(order => (
                    <View
                      key={order.id}
                      style={styles.tableRowContainerWithBorder}
                    >
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <StyledText>{t(`age.${order.ageGroup}`)}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <StyledText>{order.orderCount}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText>{order.percentage}</StyledText>
                      </View>
                    </View>
                  ))
                }

                <View style={styles.tableRowContainerWithBorder}>
                  <View style={[styles.tableCellView, {flex: 1}]}>
                    <Text style={styles.sectionBarText}>{t('visitFrequency')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                    <Text style={styles.sectionBarText}>{t('total')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                    <Text style={styles.sectionBarText}>{t('percentage')}</Text>
                  </View>
                </View>

                {
                  ordersByVisitFrequency !== null && ordersByVisitFrequency.map(order => (
                    <View
                      key={order.id}
                      style={styles.tableRowContainerWithBorder}
                    >
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <StyledText>{t(`visit.${order.visitFrequency}`)}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <StyledText>{order.orderCount}</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText>{order.percentage}</StyledText>
                      </View>
                    </View>
                  ))
                }

                <View style={styles.tableRowContainerWithBorder}>
                  <View style={{flex: 1}}>
                    <Text style={styles.sectionBarText}>{t('customerCountHeading')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                    <Text style={styles.sectionBarText}>{t('total')}</Text>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                    <Text style={styles.sectionBarText}>{t('percentage')}</Text>
                  </View>
                </View>

                <View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText>{t('customerCount')}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <StyledText>{totalCount.customerCount}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <StyledText>-</StyledText>
                    </View>
                  </View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText>{t('maleCount')}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <StyledText>{totalCount.maleCount}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <StyledText>{totalCount.malePercentage}</StyledText>
                    </View>
                  </View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText>{t('femaleCount')}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <StyledText>{totalCount.femaleCount}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <StyledText>{totalCount.femalePercentage}</StyledText>
                    </View>
                  </View>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText>{t('kidCount')}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <StyledText>{totalCount.kidCount}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <StyledText>{totalCount.kidPercentage}</StyledText>
                    </View>
                  </View>
                </View>

                {haveCCData && (
                  <View>
                    <View style={styles.sectionContainer}>
                      <Text style={styles.screenSubTitle}>
                        {t('customerCountTitle')}
                      </Text>
                      <RenderTable
                        reportData={custCountData}
                      />
                    </View>
                    <View style={styles.sectionContainer}>
                      <Text style={styles.screenSubTitle}>
                        {t('averageSpendingTitle')}
                      </Text>
                      <View>

                        <RenderTable
                          reportData={custAvgSpendingData}
                          isCurrency={true}
                        />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  customerTrafficReport: state.customertrafficreport.data,
  haveData: state.customertrafficreport.haveData,
  haveError: state.customertrafficreport.haveError || state.customercountreport.haveError,
  isLoading: state.customertrafficreport.loading || state.customercountreport.loading,
  customercountReport: state.customercountreport.data,
  haveCCData: state.customercountreport.haveData
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCustomerTrafficReport: (year, month) => dispatch(getCustomerTrafficReport(year, month)),
  getCustomerCountReport: (year, month) => dispatch(getCustomerCountReport(year, month))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerStats)
