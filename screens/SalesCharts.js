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
import OrderFilterFormII from "./OrderFilterFormII";
import TimeZoneService from "../helpers/TimeZoneService";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import Icon from 'react-native-vector-icons/Ionicons'

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
        cancelledTotal: 'Cancelled Total',
        salesDistributionTitle: 'Sales by Month',
        salesRankingTitle: 'Product Sales Ranking',
        quantity: 'Quantity',
        amount: 'Amount',
        percentage: 'Percentage',
        noSalesData: 'No sales data',
        rankingFilter: {
          product: 'Product',
          label: 'Category',
          count: {
            title: 'Count',
            all: 'All',
            '10': '10',
            '25': '25',
          }
        },
      },
      zh: {
        salesDashboardTitle: '銷售報表',
        rangedSalesTitle: '銷售表',
        salesTotal: '總營業額',
        serviceChargeTotal: '總服務費',
        discountTotal: '總折扣',
        cancelledTotal: '總作廢額',
        salesDistributionTitle: '年度銷售',
        salesRankingTitle: '產品銷售排行榜',
        quantity: '總數量',
        amount: '金額',
        percentage: '百分比',
        noSalesData: '目前沒有銷售資料',
        rankingFilter: {
          product: '產品',
          label: '分類',
          count: {
            title: '顯示數量',
            all: '全部顯示',
            '10': '10',
            '25': '25',
          }
        },
      }
    })

    this.state = {
      selectedRankingFilter: 0,
      showProductsRanking: false,
      selectedRangeType: 'WEEK',
      selectedRangeTypeIndex: 2,
      selectedRankingCount: 0,
      isCountRankDown: true
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
      data: [],
      orderCount: [],
    }
    rangedSalesReport.salesByRange.map(stats => {
      const date = moment(stats.date).format('MM/DD')
      rangedSalesData.labels.push(date)
      rangedSalesData.data.push(stats.total)
      rangedSalesData.orderCount.push(stats.orderCount)
    })

    return rangedSalesData
  }



  handleFilterSalesChart = values => {
    const timezone = TimeZoneService.getTimeZone();
    const searchFromDate = moment.tz(values.fromDate, timezone).format("YYYY-MM-DDTHH:mm:ss")
    const searchToDate = moment.tz(values.toDate, timezone).format("YYYY-MM-DDTHH:mm:ss")

    this.setState({selectedRangeTypeIndex: values.dateRange})

    const rangeTypeMapping = ['SHIFT', 'TODAY', 'RANGE', 'RANGE', 'RANGE']
    this.props.getRangedSalesReport(rangeTypeMapping[values.dateRange], searchFromDate, searchToDate)
  }

  handleRankingFilterChange = idx => {
    this.setState({
      selectedRankingFilter: idx,
    })
  }

  handleRankingCountChange = idx => {
    this.setState({
      selectedRankingCount: idx
    })
  }

  handleRangeTypeIndexChange = idx => {
    this.setState({
      selectedRankingCount: idx
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
    const {t, isTablet} = this.context
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
        this.state.isCountRankDown || rankingData?.reverse()
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
        this.state.isCountRankDown || rankingData?.reverse()
      }
    }

    let salesDistributionData = {}


    const Item = ({salesData, index}) => {
      const isHide = this.state?.selectedRankingCount !== 0 && ((this.state?.selectedRankingCount === 1 && index >= 10) || (this.state?.selectedRankingCount === 2 && index >= 25))
      if (isHide) {
        return null
      }
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
            <StyledText>{formatCurrency(salesData?.total ?? 0)}</StyledText>
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
    } else if (isTablet) {
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
              <OrderFilterFormII
                onSubmit={this.handleFilterSalesChart}
                initialValues={{
                  dateRange: this.state.selectedRangeTypeIndex,
                  fromDate: new Date(getrangedSalesReport.dateRange.zonedFromDate ?? new Date()),
                  toDate: new Date(getrangedSalesReport.dateRange.zonedToDate)
                }} />
            </View>

            <View style={[styles.tableRowContainer, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
              <StyledText style={styles.screenSubTitle}>{moment(getrangedSalesReport.dateRange.zonedFromDate).format('YYYY-MM-DD')}</StyledText>
              <StyledText style={[styles.screenSubTitle, {marginHorizontal: 0}]}>~</StyledText>
              <StyledText style={styles.screenSubTitle}>{moment(getrangedSalesReport.dateRange.zonedToDate).format('YYYY-MM-DD')}</StyledText>
            </View>

            <View style={{flexDirection: 'row', marginTop: 16}}>
              <View style={{flex: 1}}>
                <View style={styles.tableRowContainer}>
                  <View style={styles.tableCellView}>
                    <StyledText style={styles.tableCellText}>{t('salesTotal')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.totalSales?.salesTotal ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={styles.tableRowContainer}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CASH')?.orderTotal ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CARD')?.orderTotal ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={styles.tableRowContainer}>
                  <View style={styles.tableCellView}>
                    <StyledText style={styles.tableCellText}>{t('serviceChargeTotal')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.totalSales?.serviceChargeTotal ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={styles.tableRowContainer}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CASH')?.serviceCharge ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CARD')?.serviceCharge ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={styles.tableRowContainer}>
                  <View style={[styles.tableCellView]}>
                    <StyledText style={styles.tableCellText}>{t('discountTotal')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.totalSales?.discountTotal ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={styles.tableRowContainer}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CASH')?.discount ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CARD')?.discount ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={styles.tableRowContainer}>
                  <View style={[styles.tableCellView]}>
                    <StyledText style={styles.tableCellText}>{t('cancelledTotal')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency((getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CARD')?.orderTotal ?? 0) + (getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CASH')?.orderTotal ?? 0))}</StyledText>
                  </View>
                </View>

                <View style={styles.tableRowContainer}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CASH')?.orderTotal ?? 0)}</StyledText>
                  </View>
                </View>

                <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
                  <View style={styles.tableCellView}>
                    <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CARD')?.orderTotal ?? 0)}</StyledText>
                  </View>
                </View>

              </View>
              <View style={{paddingHorizontal: 8, flex: 1}}>
                <RenderTable reportData={rangedSalesData} isCurrency={true} type='card' />
              </View>

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

              <View style={[{flexDirection: 'row', maxWidth: 300, alignItems: 'center'}]}>
                <StyledText style={{paddingHorizontal: 10}}>{t('rankingFilter.count.title')}</StyledText>
                <View style={{flexDirection: 'column', flex: 1}}>
                  <SegmentedControl
                    selectedIndex={this.state.selectedRankingCount}
                    input={{
                      onChange: this.handleRankingCountChange
                    }}
                    values={[t('rankingFilter.count.all'), t('rankingFilter.count.10'), t('rankingFilter.count.25')]}
                  />
                </View>
              </View>

              <View style={{marginBottom: 20}}>
                <View style={styles.sectionBar}>
                  <View style={[styles.quarter_width, styles.tableCellView]}>
                    <Text style={[styles.sectionBarTextSmall]}>{t('order.product')}</Text>
                  </View>

                  <TouchableOpacity style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}
                    onPress={() => this.setState({isCountRankDown: !this.state.isCountRankDown})}
                  >
                    <Text style={styles.sectionBarTextSmall}>{t('quantity')}</Text>
                    <Icon name={this.state.isCountRankDown ? 'caret-down' : 'caret-up'} size={24} color={mainThemeColor} style={{padding: 0, margin: 0}} />
                  </TouchableOpacity>

                  <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                    <Text style={styles.sectionBarTextSmall}>{t('amount')}</Text>
                  </View>

                  <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                    <Text style={styles.sectionBarTextSmall}>{t('percentage')}</Text>
                  </View>
                </View>
                <FlatList
                  data={rankingData}
                  renderItem={({item, index}) => {
                    return <Item salesData={item} index={index} />
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


          </View>
        </ThemeScrollView>
      )
    }
    //phone render
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
            <OrderFilterFormII
              onSubmit={this.handleFilterSalesChart}
              initialValues={{
                dateRange: this.state.selectedRangeTypeIndex,
                fromDate: new Date(getrangedSalesReport.dateRange.zonedFromDate),
                toDate: new Date(getrangedSalesReport.dateRange.zonedToDate)
              }} />
          </View>
          <View style={[styles.tableRowContainer, {flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}]}>
            <StyledText style={styles.screenSubTitle}>{moment(getrangedSalesReport.dateRange.zonedFromDate).format('YYYY-MM-DD')}</StyledText>
            <StyledText style={[styles.screenSubTitle, {marginHorizontal: 0}]}>~</StyledText>
            <StyledText style={styles.screenSubTitle}>{moment(getrangedSalesReport.dateRange.zonedToDate).format('YYYY-MM-DD')}</StyledText>
          </View>


          <View style={{flex: 1}}>
            <View style={styles.tableRowContainer}>
              <View style={styles.tableCellView}>
                <StyledText style={styles.tableCellText}>{t('salesTotal')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.totalSales?.salesTotal ?? 0)}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CASH')?.orderTotal ?? 0)}</StyledText>
              </View>
            </View>

            <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CARD')?.orderTotal ?? 0)}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={styles.tableCellView}>
                <StyledText style={styles.tableCellText}>{t('serviceChargeTotal')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.totalSales?.serviceChargeTotal ?? 0)}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CASH')?.serviceCharge ?? 0)}</StyledText>
              </View>
            </View>

            <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CARD')?.serviceCharge ?? 0)}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCellView]}>
                <StyledText style={styles.tableCellText}>{t('discountTotal')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.totalSales?.discountTotal ?? 0)}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CASH')?.discount ?? 0)}</StyledText>
              </View>
            </View>

            <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CREATED' && item?.paymentMethod === 'CARD')?.discount ?? 0)}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={[styles.tableCellView]}>
                <StyledText style={styles.tableCellText}>{t('cancelledTotal')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency((getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CARD')?.orderTotal ?? 0) + (getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CASH')?.orderTotal ?? 0))}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainer}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cashSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CASH')?.orderTotal ?? 0)}</StyledText>
              </View>
            </View>

            <View style={[styles.tableRowContainer, styles.withBottomBorder]}>
              <View style={styles.tableCellView}>
                <StyledText style={[styles.tableCellText, {marginLeft: 16}]}>{t('shift.cardSection')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={styles.tableCellText}>{formatCurrency(getrangedSalesReport?.salesByPaymentMethods?.find((item) => item?.id?.status === 'CANCELLED' && item?.paymentMethod === 'CARD')?.orderTotal ?? 0)}</StyledText>
              </View>
            </View>

          </View>

          <View style={styles.sectionContainer}>
            <RenderTable reportData={rangedSalesData} isCurrency={true} type='card' />
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

            <View style={[{flexDirection: 'row', maxWidth: 300, alignItems: 'center'}]}>
              <StyledText style={{paddingHorizontal: 10}}>{t('rankingFilter.count.title')}</StyledText>
              <View style={{flexDirection: 'column', flex: 1}}>
                <SegmentedControl
                  selectedIndex={this.state.selectedRankingCount}
                  input={{
                    onChange: this.handleRankingCountChange
                  }}
                  values={[t('rankingFilter.count.all'), t('rankingFilter.count.10'), t('rankingFilter.count.25')]}
                />
              </View>
            </View>

            <View style={{marginBottom: 20}}>
              <View style={styles.sectionBar}>
                <View style={[styles.quarter_width, styles.tableCellView]}>
                  <Text style={[styles.sectionBarTextSmall]}>{t('order.product')}</Text>
                </View>

                <TouchableOpacity style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}
                  onPress={() => this.setState({isCountRankDown: !this.state.isCountRankDown})}
                >
                  <Text style={styles.sectionBarTextSmall}>{t('quantity')}</Text>
                  <Icon name={this.state.isCountRankDown ? 'caret-down' : 'caret-up'} size={24} color={mainThemeColor} style={{padding: 0, margin: 0}} />
                </TouchableOpacity>

                <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.sectionBarTextSmall}>{t('amount')}</Text>
                </View>

                <View style={[styles.quarter_width, styles.tableCellView, {justifyContent: 'flex-end'}]}>
                  <Text style={styles.sectionBarTextSmall}>{t('percentage')}</Text>
                </View>
              </View>
              <FlatList
                data={rankingData}
                renderItem={({item, index}) => {
                  return <Item salesData={item} index={index} />
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
                renderItem={({item, index}) => {
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
                        <Text style={styles.tableCellWhiteText}>{formatCurrency(salesData?.productSales ?? 0)}</Text>
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



