import React from 'react'
import {Text, View} from 'react-native'
import {connect} from 'react-redux'
import {getCustomerCountReport, getCustomerTrafficReport} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import BackendErrorScreen from './BackendErrorScreen'
import moment from "moment-timezone";
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import SvgBarChart from "../components/SvgBarChart";
import MonthPicker from "../components/MonthPicker"
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {formatCurrency} from "../actions";
import OrderFilterFormII from "./OrderFilterFormII";
import TimeZoneService from "../helpers/TimeZoneService";

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
      selectedRangeType: 'WEEK',
      selectedRangeTypeIndex: 2,
      searchFromDate: new Date()
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

  handleFilterSalesChart = values => {
    const timezone = TimeZoneService.getTimeZone();
    const searchFromDate = moment.tz(values.fromDate, timezone).format("YYYY-MM-DDTHH:mm:ss")
    const searchToDate = moment.tz(values.toDate, timezone).format("YYYY-MM-DDTHH:mm:ss")

    this.setState({selectedRangeTypeIndex: values.dateRange, searchFromDate: searchFromDate})

    const rangeTypeMapping = ['SHIFT', 'TODAY', 'RANGE', 'RANGE', 'RANGE']
    this.props.getCustomerTrafficReport(rangeTypeMapping[values.dateRange], searchFromDate, searchToDate)
    this.props.getCustomerCountReport(rangeTypeMapping[values.dateRange], searchFromDate, searchToDate)
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
    const {t, isTablet, customMainThemeColor} = this.context
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


    if (isTablet) {
      return (
        <ThemeScrollView>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader backNavigation={true}
              parentFullScreen={true}
              title={t('customerStatsTitle')}
            />

            <View>
              <OrderFilterFormII
                onSubmit={this.handleFilterSalesChart}
                initialValues={{
                  dateRange: this.state.selectedRangeTypeIndex,
                  fromDate: new Date(customerTrafficReport?.dateRange?.zonedFromDate ?? new Date()),
                  toDate: new Date(customerTrafficReport?.dateRange?.zonedToDate ?? new Date())
                }} />
            </View>


            {totalCount !== null && totalCount.orderCount === 0 && (
              <View>
                <StyledText style={styles.messageBlock}>{t('noData')}</StyledText>
              </View>
            )}

            {totalCount !== null && totalCount.orderCount > 0 && (
              <View>
                <View>
                  <Text style={styles?.screenSubTitle(customMainThemeColor)}>
                    {t('orderTraffic')}
                  </Text>
                  <SvgBarChart data={filteredCustomerTrafficData} legend='Order Count' round={maxValue} />
                </View>

                <View style={[styles.verticalPadding, {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}]}>
                  <View style={{width: 480, borderColor: customMainThemeColor, borderWidth: 1, marginVertical: 10}}>
                    <View style={[styles.tableRowContainerWithBorder, {borderColor: customMainThemeColor}]}>
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('orderType')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
                      </View>
                    </View>

                    {
                      ordersByType !== null && ordersByType.map(order => (
                        order.orderType === 'ONLINE' ? null : <View
                          key={order.id}
                          style={styles.tableRowContainer}
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
                  </View>
                  <View style={{width: 480, borderColor: customMainThemeColor, borderWidth: 1, marginVertical: 10}}>
                    <View style={[styles.tableRowContainerWithBorder, {borderColor: customMainThemeColor}]}>
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('ageGroup')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
                      </View>
                    </View>

                    {
                      ordersByAgeGroup !== null && ordersByAgeGroup.map(order => (
                        <View
                          key={order.id}
                          style={styles.tableRowContainer}
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
                  </View>
                  <View style={{width: 480, borderColor: customMainThemeColor, borderWidth: 1, marginVertical: 10}}>
                    <View style={[styles.tableRowContainerWithBorder, {borderColor: customMainThemeColor}]}>
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('visitFrequency')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
                      </View>
                    </View>

                    {
                      ordersByVisitFrequency !== null && ordersByVisitFrequency.map(order => (
                        <View
                          key={order.id}
                          style={styles.tableRowContainer}
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
                  </View>
                  <View style={{width: 480, borderColor: customMainThemeColor, borderWidth: 1, marginVertical: 10}}>
                    <View style={[styles.tableRowContainerWithBorder, {borderColor: customMainThemeColor}]}>
                      <View style={{flex: 1}}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('customerCountHeading')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
                      </View>
                    </View>

                    <View>
                      <View style={styles.tableRowContainer}>
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
                      <View style={styles.tableRowContainer}>
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
                      <View style={styles.tableRowContainer}>
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
                      <View style={styles.tableRowContainer}>
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
                  </View>
                  <View style={{width: 480, borderColor: customMainThemeColor, borderWidth: 1, marginVertical: 10}}>
                    <View style={[styles.tableRowContainerWithBorder, {borderBottomWidth: 0}]}>
                      <View style={{flex: 1}}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('averageSpendingTitle')}</Text>
                      </View>

                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text style={styles?.sectionBarText(customMainThemeColor)}>{formatCurrency(customercountReport?.customerStatsThisMonth?.[0]?.averageSpending ?? 0)}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={{width: 480, marginVertical: 10}}>

                  </View>
                </View>
              </View>
            )}
          </View>
        </ThemeScrollView>
      )
    } else {
      return (
        <ThemeScrollView>
          <View style={[styles.fullWidthScreen]}>
            <ScreenHeader backNavigation={true}
              parentFullScreen={true}
              title={t('customerStatsTitle')}
            />

            <View>
              <OrderFilterFormII
                onSubmit={this.handleFilterSalesChart}
                initialValues={{
                  dateRange: this.state.selectedRangeTypeIndex,
                  fromDate: new Date(customerTrafficReport?.dateRange?.zonedFromDate ?? new Date()),
                  toDate: new Date(customerTrafficReport?.dateRange?.zonedToDate ?? new Date())
                }} />
            </View>


            {totalCount !== null && totalCount.orderCount === 0 && (
              <View>
                <StyledText style={styles.messageBlock}>{t('noData')}</StyledText>
              </View>
            )}

            {totalCount !== null && totalCount.orderCount > 0 && (
              <View>
                <View>
                  <Text style={styles?.screenSubTitle(customMainThemeColor)}>
                    {t('orderTraffic')}
                  </Text>
                  <SvgBarChart data={filteredCustomerTrafficData} legend='Order Count' round={maxValue} />
                </View>

                <View style={styles.verticalPadding}>
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('orderType')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
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
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('ageGroup')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
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
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('visitFrequency')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
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
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('customerCountHeading')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('total')}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('percentage')}</Text>
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

                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={{flex: 1}}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{t('averageSpendingTitle')}</Text>
                    </View>

                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text style={styles?.sectionBarText(customMainThemeColor)}>{formatCurrency(customercountReport?.customerStatsThisMonth?.[0]?.averageSpending ?? 0)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </ThemeScrollView>
      )
    }

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
  getCustomerTrafficReport: (rangeType, fromDate, toDate) => dispatch(getCustomerTrafficReport(rangeType, fromDate, toDate)),
  getCustomerCountReport: (rangeType, fromDate, toDate) => dispatch(getCustomerCountReport(rangeType, fromDate, toDate))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerStats)
