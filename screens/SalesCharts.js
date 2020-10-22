import React from 'react'
import {FlatList, Modal, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {formatCurrency, formatDateObj, getRangedSalesReport, getSalesDistributionReport, getSalesRankingReport} from '../actions'
import styles, {mainThemeColor} from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import BackendErrorScreen from './BackendErrorScreen'
import moment from "moment-timezone";
import ScreenHeader from "../components/ScreenHeader";
import RenderTable from '../components/RenderTable'
import LoadingScreen from "./LoadingScreen";
import SegmentedControl from "../components/SegmentedControl";
import OrderFilterForm from "./OrderFilterForm";
import TimeZoneService from "../helpers/TimeZoneService";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";

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
        salesTotal: 'Sales Total',
        serviceChargeTotal: 'Service Charge Total',
        discountTotal: 'Discount Total',
        salesDistributionTitle: 'Sales by Month',
        salesRankingTitle: 'Product Sales Ranking',
        quantity: 'Quantity',
        amount: 'Amount',
        percentage: 'Percentage',
        noSalesData: 'No sales data',
        rankingFilter: {
          product: 'Product',
          label: 'Category'
        }
      },
      zh: {
        salesDashboardTitle: '銷售總覽',
        rangedSalesTitle: '銷售表',
        salesTotal: '總營業額',
        serviceChargeTotal: '總服務費',
        discountTotal: '總折扣',
        salesDistributionTitle: '年度銷售',
        salesRankingTitle: '產品銷售排行榜',
        quantity: '總數量',
        amount: '金額',
        percentage: '百分比',
        noSalesData: '目前沒有銷售資料',
        rankingFilter: {
          product: '產品',
          label: '分類'
        }
      }
    })

    this.state = {
      selectedRankingFilter: 0,
      showProductsRanking: false,
      selectedRangeType: 'WEEK'
    }
  }

  componentDidMount() {
    this.props.getRangedSalesReport()
    this.props.getSalesDistributionReport()
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
    console.log(values)
    console.log(typeof values.fromDate)
    const timezone = TimeZoneService.getTimeZone();
    const searchFromDate = moment.tz(values.fromDate, timezone).format("YYYY-MM-DDTHH:mm:ss")
    const searchToDate = moment.tz(values.toDate, timezone).format("YYYY-MM-DDTHH:mm:ss")
    console.log(`Ranged sales selected dates - from: ${searchFromDate} to: ${searchToDate}`)

    this.setState({selectedRangeType: values.dateRange})
    this.props.getRangedSalesReport(values.dateRange, searchFromDate, searchToDate)
  }

  handleRankingFilterChange = idx => {
    this.setState({
      selectedRankingFilter: idx
    })
  }

  toggleProductsRankingModal = () => {
    this.setState({
      showProductsRanking: false
    })
  }

  render() {
    const {
      getrangedSalesReport,
      salesRankingReport,
      salesdistributionReport,
      isLoading,
      haveData,
      haveError,
      haveSDData
    } = this.props
    const {t} = this.context
    const containSalesData = haveData && getrangedSalesReport.salesByRange !== undefined

    let rangedSalesData = {}
    let rankingData

    if (containSalesData) {
      rangedSalesData = this.generateRangedSalesChart(getrangedSalesReport);

      if (this.state.selectedRankingFilter === 0) {
        rankingData = this.props.getrangedSalesReport.salesByProducts.map((data, index) => {
          return {
            type: 'product',
            id: data.id,
            name: data.productName,
            quantity: data.salesQuantity,
            total: data.productSales,
            percentage: data.percentage
          }
        })
      } else {
        rankingData = this.props.getrangedSalesReport.salesByLabels.map((data, index) => {
          return {
            type: 'label',
            id: data.id,
            name: data.productLabel,
            quantity: data.salesQuantity,
            total: data.productSales,
            percentage: data.percentage
          }
        })
      }
    }

    let salesDistributionData = {}

    if (haveSDData) {
      salesDistributionData = this.generateSalesDistribution(salesdistributionReport)
    }

    const Item = ({salesData}) => {
      return (
        <View
          style={[styles.tableRowContainer]}
          key={salesData.id}
        >
          <View style={[styles.quarter_width, styles.tableCellView]}>
            {salesData.type === 'label' ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.getSalesRankingReport(
                    this.state.selectedRangeType,
                    getrangedSalesReport.dateRange.fromLocalDateTime,
                    getrangedSalesReport.dateRange.toLocalDateTime,
                    salesData.id
                  )

                  this.setState({showProductsRanking: true})
                }}
              >
                <StyledText>{salesData.name}</StyledText>
              </TouchableOpacity>
            ) : (
                <StyledText>{salesData.name}</StyledText>
              )}
          </View>

          <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
            <StyledText>{salesData.quantity}</StyledText>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
            <StyledText>{formatCurrency(salesData.total)}</StyledText>
          </View>

          <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
            <StyledText>{salesData.percentage}%</StyledText>
          </View>
        </View>
      )
    }

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return <BackendErrorScreen />

    } else if (!containSalesData) {
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
        <View style={styles.fullWidthScreen}>
          <ProductsRanking
            isShow={this.state.showProductsRanking}
            toggleProductsRanking={this.toggleProductsRankingModal}
            filteredRankingData={salesRankingReport.salesByProducts}
          />

          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            title={t('salesDashboardTitle')}
          />

          <View>
            <OrderFilterForm
              onSubmit={this.handleFilterSalesChart}
              initialValues={{
                dateRange: this.state.selectedRangeType,
                fromDate: new Date(getrangedSalesReport.dateRange.zonedFromDate),
                toDate: new Date(getrangedSalesReport.dateRange.zonedToDate)
              }} />
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={styles.tableCellView}>
              <StyledText style={styles.tableCellText}>{t('salesTotal')}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport.totalSales.salesTotal)}</StyledText>
            </View>
            {/*<Chart
            data={Object.keys(filteredRangedSalesData).length !== 0 ? filteredRangedSalesData : rangedSalesData}
            width={Dimensions.get('window').width * 2}
            props={{
              yAxisLabel: '$'
            }}
          />*/}
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={styles.tableCellView}>
              <StyledText style={styles.tableCellText}>{t('serviceChargeTotal')}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport.totalSales.serviceChargeTotal)}</StyledText>
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView]}>
              <StyledText style={styles.tableCellText}>{t('discountTotal')}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport.totalSales.discountTotal)}</StyledText>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <RenderTable reportData={rangedSalesData} isCurrency={true} />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.screenSubTitle}>
                {t('salesRankingTitle')}
              </Text>
            </View>
            <View style={[styles.sectionContainer, styles.dynamicHorizontalPadding(10)]}>
              <SegmentedControl
                selectedIndex={this.state.selectedRankingFilter}
                input={{
                  onChange: this.handleRankingFilterChange
                }}
                values={[t('rankingFilter.product'), t('rankingFilter.label')]}
              />
            </View>

            <View style={{marginBottom: 20}}>
              <View style={styles.sectionBar}>
                <View style={[styles.quarter_width, styles.tableCellView]}>
                  <Text style={[styles.sectionBarTextSmall]}>{t('order.product')}</Text>
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
                data={rankingData}
                renderItem={({item}) => {
                  return <Item salesData={item} />
                }}
                ListEmptyComponent={() => {
                  return (
                    <Text style={[styles.messageBlock, styles.orange_color]}>{t('noSalesData')}</Text>
                  )
                }}
                keyExtractor={item => item.id}
              />
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.screenSubTitle}>
              {t('salesDistributionTitle')}
            </Text>
            {haveSDData && (
              <View>
                <RenderTable
                  reportData={salesDistributionData}
                  isCurrency={true}
                />
              </View>
            )}
          </View>
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  getrangedSalesReport: state.getrangedsalesreport.data,
  salesRankingReport: state.salesrankingreport.data,
  salesdistributionReport: state.salesdistributionreport.data,
  haveData: state.getrangedsalesreport.haveData,
  haveError: state.getrangedsalesreport.haveError,
  isLoading: state.getrangedsalesreport.loading,
  haveSDData: state.salesdistributionreport.haveData
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getRangedSalesReport: (rangeType, fromDate, toDate) => dispatch(getRangedSalesReport(rangeType, fromDate, toDate)),
  getSalesRankingReport: (rangeType, fromDate, toDate, labelId) => dispatch(getSalesRankingReport(rangeType, fromDate, toDate, labelId)),
  getSalesDistributionReport: () => dispatch(getSalesDistributionReport())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SalesCharts)

class ProductsRanking extends React.Component {

  static contextType = LocaleContext

  render() {
    const {isShow, toggleProductsRanking, filteredRankingData} = this.props
    const {t} = this.context

    return (
      <View>
        <Modal transparent={true}
          visible={isShow}
        >
          <View style={[styles.container, {flex: 1, backgroundColor: mainThemeColor, borderColor: 'red', borderRadius: 20, opacity: 0.95}]}>
            <View style={[styles.sectionContainer, {flex: 1}]}>
              <Text style={[styles.screenTitle, {color: '#fff'}]}>{t('salesRankingTitle')}</Text>
            </View>

            <View style={{flex: 4}}>
              <View style={styles.tableRowContainerWithBorder}>
                <View style={[styles.quarter_width, styles.tableCellView]}>
                  <Text style={styles.tableCellWhiteText}>{t('order.product')}</Text>
                </View>

                <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.tableCellWhiteText}>{t('quantity')}</Text>
                </View>

                <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.tableCellWhiteText}>{t('amount')}</Text>
                </View>

                <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.tableCellWhiteText}>{t('percentage')}</Text>
                </View>
              </View>
              <FlatList
                data={filteredRankingData}
                renderItem={({item}) => {
                  const salesData = item

                  return (
                    <View
                      style={[styles.tableRowContainer]}
                      key={salesData.id}
                    >
                      <View style={[styles.quarter_width, styles.tableCellView]}>
                        <Text style={styles.tableCellWhiteText}>{salesData.productName}</Text>
                      </View>

                      <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                        <Text style={styles.tableCellWhiteText}>{salesData.salesQuantity}</Text>
                      </View>

                      <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                        <Text style={styles.tableCellWhiteText}>{formatCurrency(salesData.productSales)}</Text>
                      </View>

                      <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                        <Text style={styles.tableCellWhiteText}>{salesData.percentage}%</Text>
                      </View>
                    </View>

                  )
                }}
                ListEmptyComponent={() => {
                  return (
                    <Text style={[styles.messageBlock, styles.orange_color]}>{t('noSalesData')}</Text>
                  )
                }}
                keyExtractor={item => item.id}
              />
            </View>

            <View style={styles.bottom}>
              <TouchableOpacity
                onPress={() => {
                  toggleProductsRanking();
                }}
              >
                <Text style={[styles.bottomActionButton, styles.actionButton]}>{t('action.done')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

}
