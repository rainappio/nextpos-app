import React from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {getCustomerTrafficReport} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import BackendErrorScreen from './BackendErrorScreen'
import moment from "moment";
import ScreenHeader from "../components/ScreenHeader";
import {api, dispatchFetchRequest} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";
import SvgBarChart from "../components/SvgBarChart";
import SegmentedControl from "../components/SegmentedControl";
import Icon from "react-native-vector-icons/Ionicons";
import MonthPicker from "../components/MonthPicker";

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
        kidCount: 'Kid'

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
        kidCount: '小孩'
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
  }

  generateCustomerTrafficChart = (customerTrafficReport) => {

    let customerTrafficData = []

    customerTrafficReport.customerTraffics.map(stats => {
      customerTrafficData.push({label: stats.hourOfDay, value: stats.orderCount})
      //customerTrafficData.push({label: stats.hourOfDay, value: (Math.random() * 200).toFixed(0)})
    })

    return customerTrafficData
  }

  render() {
    const {
      customerTrafficReport,
      isLoading,
      haveData,
      haveError,
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

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveError) {
      return <BackendErrorScreen/>

    } else if (!haveData) {
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
      <ScrollView scrollIndicatorInsets={{right: 1}}>
        <View style={[styles.fullWidthScreen, styles.nomgrBottom]}>
          <ScreenHeader backNavigation={true}
                        parentFullScreen={true}
                        title={t('customerStatsTitle')}
          />
        </View>

        <MonthPicker
          currentDate={this.state.currentDate}
          selectedFilter={this.state.selectedFilter}
          handleMonthChange={(date, selectedFilter) => {
            this.setState({currentDate: date, selectedFilter: selectedFilter})

            this.props.getCustomerTrafficReport(date.year(), date.month() + 1)
          }}
        />

        {totalCount !== null && totalCount.orderCount === 0 && (
          <View>
            <Text style={styles.messageBlock}>{t('noData')}</Text>
          </View>
        )}

        {totalCount !== null && totalCount.orderCount > 0 && (
          <View>
            <View>
              <Text style={styles.screenSubTitle}>
                {t('orderTraffic')}
              </Text>
              <SvgBarChart data={filteredCustomerTrafficData} legend='Order Count' round={maxValue}/>
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
                  <View
                    key={order.id}
                    style={styles.tableRowContainerWithBorder}
                  >
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <Text>{t(`order.${order.orderType}`)}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <Text>{order.orderCount}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text>{order.percentage}</Text>
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
                      <Text>{t(`age.${order.ageGroup}`)}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <Text>{order.orderCount}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text>{order.percentage}</Text>
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
                      <Text>{t(`visit.${order.visitFrequency}`)}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                      <Text>{order.orderCount}</Text>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <Text>{order.percentage}</Text>
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

              {
                totalCount !== null && (
                  <View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <Text>{t('customerCount')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text>{totalCount.customerCount}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text>-</Text>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <Text>{t('maleCount')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text>{totalCount.maleCount}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text>{totalCount.malePercentage}</Text>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <Text>{t('femaleCount')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text>{totalCount.femaleCount}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text>{totalCount.femalePercentage}</Text>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[styles.tableCellView, {flex: 1}]}>
                        <Text>{t('kidCount')}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'center'}]}>
                        <Text>{totalCount.kidCount}</Text>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <Text>{totalCount.kidPercentage}</Text>
                      </View>
                    </View>
                  </View>
                )
              }
            </View>
          </View>
        )}

      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  customerTrafficReport: state.customertrafficreport.data,
  haveData: state.customertrafficreport.haveData,
  haveError: state.customertrafficreport.haveError,
  isLoading: state.customertrafficreport.loading,
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getCustomerTrafficReport: (year, month) => dispatch(getCustomerTrafficReport(year, month))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerStats)
