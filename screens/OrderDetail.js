import React from 'react'
import {FlatList, Text, TouchableOpacity, View} from 'react-native'
import {connect} from 'react-redux'
import {formatCurrency, formatTime, getOrder} from '../actions'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import {handleDelete, renderOptionsAndOffer, renderOrderState, handleCancelInvoice} from "../helpers/orderActions";
import ScreenHeader from "../components/ScreenHeader";
import OrderTopInfo from "./OrderTopInfo";
import LoadingScreen from "./LoadingScreen";
import {api, dispatchFetchRequestWithOption, successMessage} from "../constants/Backend";
import DeleteBtn from "../components/DeleteBtn";
import {NavigationEvents} from "react-navigation";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {ThemeContainer} from "../components/ThemeContainer";

class OrderDetail extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  state = {
    ageGroups: [
      {label: '20-29', value: 'TWENTIES'},
      {label: '30-39', value: 'THIRTIES'},
      {label: '40-49', value: 'FORTIES'},
      {label: '50-59', value: 'FIFTIES_AND_ABOVE'}
    ],
    visitFrequencies: [
      {label: '1', value: 'FIRST_TIME'},
      {label: '2 - 3', value: 'TWO_TO_THREE'},
      {label: '4+', value: 'MORE_THAN_THREE'}
    ]
  }

  componentDidMount() {
    this.props.getOrder(this.props?.navigation?.state?.params?.orderId ?? this.props?.orderId)
  }

  handleCopyOrder(order) {
    dispatchFetchRequestWithOption(api.order.copyOrder(order.orderId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
    }, {
      defaultMessage: false
    }, response => {
      response.json().then(copiedOrder => {
        successMessage(this.context.t('order.copied'))
        this.props.navigation.navigate('OrdersSummary', {
          orderId: copiedOrder.orderId
        })

      })
    }).then()
  }

  render() {
    const {order, isLoading, haveData, complexTheme} = this.props
    const {t, customMainThemeColor} = this.context

    Item = ({orderDetail, lineItemDate}) => {
      return (
        <View>
          <View style={[styles.tableRowContainer]}>
            <View style={{flex: 2.5}}>
              <StyledText>
                {formatTime(lineItemDate)}
              </StyledText>
            </View>

            <View style={{flex: 1.7}}>
              <StyledText>
                {orderDetail.productName}
              </StyledText>
            </View>

            <View style={{flex: 0.8}}>
              <StyledText>
                {orderDetail.quantity}
              </StyledText>
            </View>

            <View style={{flex: 1.2}}>
              <StyledText style={{textAlign: 'right'}}>
                {orderDetail.lineItemSubTotal}
              </StyledText>
            </View>
          </View>
          <View style={styles.tableRowContainer}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{renderOptionsAndOffer(orderDetail)}</StyledText>
            </View>
          </View>
        </View>
      )
    }

    if (isLoading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      const filteredageGroup = this.state.ageGroups.find(ageGroup => {
        return ageGroup.value === order.demographicData.ageGroup
      })

      const filteredvisitFrequency = this.state.visitFrequencies.find(visitFreq => {
        return visitFreq.value === order.demographicData.visitFrequency
      })

      const orderDuration = order.orderDuration !== null ? order.orderDuration : {}

      return (

        <ThemeContainer>
          <View style={[styles.fullWidthScreen, (!!this.props?.orderId && {marginTop: 0})]}>
            <ScreenHeader parentFullScreen={true}
              backAction={() => !!this.props?.orderId ? this.props?.closeModal() : this.props.navigation.goBack()}
              title={t('order.orderDetailsTitle')} />
            <NavigationEvents
              onWillFocus={() => {
                this.props.getOrder()
              }}
              onWillBlur={() => {
                !!this.props?.orderId && this.props?.closeModal()
              }}
            />
            <ThemeScrollView>
              <OrderTopInfo order={order} />

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.ageGroup')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {filteredageGroup !== undefined ? filteredageGroup.label : t('order.notFilledIn')}
                  </StyledText>
                </View>
              </View>

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.visitedFrequency')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {filteredvisitFrequency !== undefined ? filteredvisitFrequency.label : t('order.notFilledIn')}
                  </StyledText>
                </View>
              </View>

              {order.orderPreparationTime != null && (
                <View style={[styles.tableRowContainerWithBorder]}>
                  <View style={[styles.tableCellView, {flex: 1}]}>
                    <StyledText>{t('order.preparationDuration')}</StyledText>
                  </View>
                  <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                    <StyledText>
                      {order.orderPreparationTime.durationHours} {t('timecard.hours')} {order.orderPreparationTime.durationMinutes} {t('timecard.minutes')}
                    </StyledText>
                  </View>
                </View>
              )}

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.orderStartDate')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {formatTime(order.createdDate)}
                  </StyledText>
                </View>
              </View>

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.endDate')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {formatTime(order.modifiedDate)}
                  </StyledText>
                </View>
              </View>

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.duration')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {orderDuration.durationHours} {t('timecard.hours')} {orderDuration.durationMinutes} {t('timecard.minutes')}
                  </StyledText>
                </View>
              </View>

              <View style={styles.sectionBar}>
                <View style={{flex: 2.5}}>
                  <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>
                    {t('order.lineItemCreatedDate')}
                  </Text>
                </View>

                <View style={{flex: 1.7}}>
                  <TouchableOpacity>
                    <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>
                      {t('order.product')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{flex: 0.8}}>
                  <TouchableOpacity>
                    <Text style={styles?.sectionBarTextSmall(customMainThemeColor)}>
                      {t('order.quantity')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{flex: 1.3}}>
                  <Text style={[styles?.sectionBarTextSmall(customMainThemeColor), {textAlign: 'right'}]}>{t('order.subtotal')}</Text>
                </View>
              </View>

              <FlatList
                style={{marginBottom: 20}}
                data={order.lineItems}
                renderItem={({item, index}) => (
                  <Item
                    orderDetail={item}
                    lineItemDate={item.modifiedDate}
                  />
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <View style={styles.tableRowContainerWithBorder}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.serviceCharge')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {formatCurrency(order.serviceCharge)}
                  </StyledText>
                </View>
              </View>

              <View style={[styles.tableRowContainerWithBorder]}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.discount')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {formatCurrency(order.discount)}
                  </StyledText>
                </View>
              </View>

              <View style={styles.tableRowContainerWithBorder}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.total')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {formatCurrency(order.orderTotal)}
                  </StyledText>
                </View>
              </View>

              <FlatList
                data={order.transactions}
                renderItem={({item, index}) => (
                  <View style={styles.tableRowContainerWithBorder}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText>{t('order.paymentMethod')}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <StyledText>{item.paymentMethod}</StyledText>
                    </View>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <View style={styles.tableRowContainerWithBorder}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.serveBy')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <StyledText>
                    {order.servedBy}
                  </StyledText>
                </View>
              </View>

              <View style={styles.tableRowContainerWithBorder}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText>{t('order.orderStatus')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  {renderOrderState(order.state, customMainThemeColor)}
                </View>
              </View>
              {order?.transactions?.map((item, index) => {
                return (
                  item?.invoiceStatus && <View style={styles.tableRowContainerWithBorder} key={index}>
                    <View style={[styles.tableCellView, {flex: 1}]}>
                      <StyledText>{t('invoiceStatus.invoiceStatus')}</StyledText>
                    </View>
                    <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                      <StyledText>{t(`invoiceStatus.${item?.invoiceStatus}`)}</StyledText>
                    </View>
                  </View>
                )
              })}

              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('orderLog.title')}</StyledText>
              </View>

              {order.orderLogs != null && order.orderLogs.map((log, idx) => {
                return (
                  <View key={idx}>
                    <View style={[styles.tableRowContainerWithBorder, complexTheme.shade]}>
                      <View style={[styles.tableCellView, {flex: 2}]}>
                        <StyledText>{formatTime(log.logDate)} ({log.who})</StyledText>
                      </View>
                      <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                        <StyledText>{t(`orderLog.${log.action}`)}</StyledText>
                      </View>
                    </View>
                    <View style={styles.tableRowContainerWithBorder}>
                      <View style={[{flex: 1, alignItems: 'flex-end'}]}>
                        {log.entries != null && log.entries.map((entry, eIdx) => {
                          const entryValue = entry.from != null ? `${entry.from} -> ${entry.to}` : entry.to

                          return (
                            <View key={`entry-${eIdx}`}>
                              <StyledText>{entry.name}: {entryValue}</StyledText>
                            </View>
                          )
                        })}
                      </View>
                    </View>
                  </View>
                )
              })}

              {!!this.props?.orderId || <View style={[styles.bottom, styles.horizontalMargin]}>
                <TouchableOpacity
                  onPress={() => this.handleCopyOrder(order)}
                >
                  <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                    {t('order.copyOrder')}
                  </Text>
                </TouchableOpacity>
                <DeleteBtn
                  handleDeleteAction={() => handleDelete(order.orderId, () => this.props.getOrder())}
                />
                {order?.transactions?.[0]?.invoiceStatus === 'PROCESSED' && <DeleteBtn
                  text={t('invoiceStatus.cancelInvoice')}
                  handleDeleteAction={() => handleCancelInvoice(order?.transactions?.[0]?.transactionId, () => this.props.getOrder())}
                />}
              </View>}
            </ThemeScrollView>
          </View>
        </ThemeContainer>
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  order: state.order.data,
  haveData: state.order.haveData,
  haveError: state.order.haveError,
  isLoading: state.order.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getOrder: () => dispatch(getOrder(props?.navigation?.state?.params?.orderId ?? props?.orderId)),
  orderId: props?.orderId,
  closeModal: props?.closeModal,
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)

export default enhance(OrderDetail)
