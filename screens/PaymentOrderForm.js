import React, {useState} from 'react'
import {connect} from 'react-redux'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View, Alert} from 'react-native'
import {formatCurrency} from '../actions'
import InputText from '../components/InputText'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import SegmentedControl from '../components/SegmentedControl'
import DropDown from '../components/DropDown'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import Icon from 'react-native-vector-icons/FontAwesome';
import {ScanView} from '../components/scanView'
import {api, dispatchFetchRequestWithOption, successMessage} from '../constants/Backend'
import Modal from 'react-native-modal';
import {isRequired, isCarrierType} from '../validators'
import {RadioLineItemObjPick} from '../components/RadioItemObjPick'

class PaymentOrderForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        paymentMethodTitle: 'Payment Method',
        enterCash: 'Enter Cash',
        taxIDNumber: 'Tax ID Number',
        enterTaxIDNumber: 'Enter Tax ID Number',
        charge: 'Charge',
        paymentMethod: 'Payment Method',
        chooseCardType: 'Choose Card Type',
        CardNo: 'Last 4 Digits',
        enterCardNo: 'Last 4 Digits',
        charged: 'Payment charged'
      },
      zh: {
        paymentMethodTitle: '付費方式',
        enterCash: '輸入現金',
        taxIDNumber: '統一編號',
        enterTaxIDNumber: '輸入統一編號',
        charge: '結帳',
        paymentMethod: '付費方式',
        chooseCardType: '選擇信用卡種類',
        CardNo: '卡號末四碼',
        enterCardNo: '卡號末四碼',
        charged: '付款成功'
      }
    })

    this.state = {
      openScanView: false,
      modalVisible: false,
    }
  }

  handleCreateMember = (values, orderId) => {
    let request = {
      name: values?.name,
      phoneNumber: values?.phoneNumber,
    }
    dispatchFetchRequestWithOption(api.membership.creat, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    }, {
      defaultMessage: false
    }, response => {
      response.json().then(data => {
        dispatchFetchRequestWithOption(api.membership.updateOrderMembership(orderId), {
          method: 'POST',
          withCredentials: true,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({membershipId: data?.id})
        }, {
          defaultMessage: false
        }, response => {
          Alert.alert(
            ``,
            `${data?.phoneNumber} ${this.context.t(`membership.bindSuccessMsg`)}`,
            [
              {
                text: `${this.context.t('action.yes')}`,
                onPress: () => {
                  this.setState({modalVisible: false})

                }
              },

            ]
          )
        }).then()
      })
    }).then()
  }

  handleScanSuccess = (data) => {
    this.props?.change(`carrierId`, data)
    this.setState({openScanView: false})
  }

  handleSearchAccount = (acc, orderId) => {
    if (acc === '') {
      Alert.alert(
        ``,
        `${this.context.t(`membership.searchNullMsg`)}`,
        [
          {
            text: `${this.context.t('action.yes')}`,
            onPress: () => {
              this.setState({modalVisible: true})
            }
          },
          {
            text: `${this.context.t('action.no')}`,
            onPress: () => {},
            style: 'cancel'
          }
        ]
      )
    }
    else {
      dispatchFetchRequestWithOption(api.membership.getByPhone(acc), {
        method: 'GET',
        withCredentials: true,
        credentials: 'include',
        headers: {},
      }, {
        defaultMessage: false
      }, response => {
        response.json().then(data => {
          if (data?.results?.length > 0) {
            dispatchFetchRequestWithOption(api.membership.updateOrderMembership(orderId), {
              method: 'POST',
              withCredentials: true,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({membershipId: data?.results[0]?.id})
            }, {
              defaultMessage: false
            }, response => {
              response.json().then(data2 => {
                Alert.alert(
                  ``,
                  `${data?.results[0]?.phoneNumber} ${this.context.t(`membership.bindSuccessMsg`)}`,
                  [
                    {
                      text: `${this.context.t('action.yes')}`,
                      onPress: () => {}
                    },

                  ]
                )

              })
            }).then()

          } else {
            Alert.alert(
              ``,
              `${this.context.t(`membership.searchNullMsg`)}`,
              [
                {
                  text: `${this.context.t('action.yes')}`,
                  onPress: () => {
                    this.props?.change(`phoneNumber`, acc)
                    this.setState({modalVisible: true})
                  }
                },
                {
                  text: `${this.context.t('action.no')}`,
                  onPress: () => {},
                  style: 'cancel'
                }
              ]
            )
          }
        })
      }).then()
    }

  }

  render() {
    const moneyAmts = [
      {
        label: '100',
        value: 100
      },
      {
        label: '500',
        value: 500
      },
      {
        label: '1000',
        value: 1000
      },
      {
        label: '2000',
        value: 2000
      }
    ]

    const {
      handleSubmit,
      order,
      addNum,
      resetTotal,
      client
    } = this.props

    const {t, appType, customMainThemeColor, customBackgroundColor} = this.context
    const {paymentsTypes, selectedPaymentType, paymentsTypeslbl, handlePaymentTypeSelection} = this.props
    const totalAmount = this.props?.isSplitByHeadCount ? this.props?.splitAmount : order.orderTotal

    const mobilePayList = client?.paymentMethods.filter((item) => item.paymentKey !== 'CARD' && item.paymentKey !== 'CASH')
    mobilePayList.sort((a, b) => {
      let sort = ["LINE_PAY", "JKO", "UBER_EATS", "FOOD_PANDA", "GOV_VOUCHER"];
      return sort.indexOf(a.paymentKey) - sort.indexOf(b.paymentKey);
    })


    const TaxInputAndBottomBtns = (props) => {
      return (
        <View >
          <View style={styles.bottom}>
            <TouchableOpacity onPress={() => props.handleSubmit()}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                {t('charge')}
              </Text>
            </TouchableOpacity>

            <View>
              <TouchableOpacity
                onPress={() => props.navigation.goBack()}
              >
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }

    return (
      <ThemeKeyboardAwareScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            title={t('paymentMethodTitle')}
          />

          <Modal
            isVisible={this.state.modalVisible}
            backdropOpacity={0.7}
            useNativeDriver
            hideModalContentWhileAnimating
          >

            <View style={{
              borderRadius: 10,
              width: '80%',
              paddingTop: 20,
              paddingHorizontal: 20,
              minHeight: 236,
              borderWidth: 5,
              borderColor: customMainThemeColor,
              backgroundColor: customBackgroundColor,
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
              <View style={{flex: 1}}>
                <View style={{flex: 1}}>
                  <StyledText style={[styles.screenSubTitle(customMainThemeColor)]}>
                    {t(`membership.newMembership`)}
                  </StyledText>
                </View>
                <View style={{flex: 1, }}>
                  <Field
                    name="name"
                    component={InputText}
                    placeholder={t(`membership.name`)}
                    secureTextEntry={false}
                    validate={isRequired}
                  />
                </View>
                <View style={{flex: 1, }}>
                  <Field
                    name="phoneNumber"
                    component={InputText}
                    placeholder={t(`membership.phoneNumber`)}
                    secureTextEntry={false}
                    validate={isRequired}
                  />
                </View>
                <View style={[{flexDirection: 'row', alignSelf: 'flex-end', flex: 1, justifyContent: 'flex-end', alignItems: 'space-between', marginBottom: 8}]}>
                  <View style={{flex: 1, marginHorizontal: 0}}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({modalVisible: false})
                      }}
                    >
                      <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('action.cancel')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{flex: 1, marginLeft: 8}}>
                    <TouchableOpacity
                      onPress={handleSubmit(data => {

                        this.handleCreateMember(data, order?.orderId)
                      })}
                    >
                      <Text style={[[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]]}>
                        {t('action.save')}
                      </Text>
                    </TouchableOpacity>
                  </View>


                </View>
              </View>


            </View>
          </Modal>

          {this.props?.isSplitByHeadCount || <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.subtotal')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(order?.total?.amountWithTax)}
              </StyledText>
            </View>
          </View>}

          {this.props?.isSplitByHeadCount || <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.discount')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(order.discount)}
              </StyledText>
            </View>
          </View>}

          {this.props?.isSplitByHeadCount || (appType === 'store') && <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.serviceCharge')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(order.serviceCharge)}
              </StyledText>
            </View>
          </View>}

          <View style={[styles.tableRowContainerWithBorder, styles.verticalPadding]}>
            <View style={[styles.tableCellView, {flex: 1}]}>
              <StyledText>{t('order.total')}</StyledText>
            </View>

            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
              <StyledText style={styles.tableCellText}>
                {formatCurrency(totalAmount)}
              </StyledText>
            </View>
          </View>

          <View style={[styles.sectionContainer, styles.horizontalMargin]}>
            <View style={[styles.sectionContent]}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('paymentMethod')}</StyledText>
              </View>
              <View>
                <View>
                  <Field
                    name="paymentMethod"
                    component={SegmentedControl}
                    selectedIndex={selectedPaymentType}
                    values={paymentsTypeslbl}
                    onChange={handlePaymentTypeSelection}
                    normalize={value => {
                      return paymentsTypes[value].value
                    }}
                  />
                </View>
              </View>
            </View>

            {
              selectedPaymentType === 0 &&
              <View>
                <View style={[styles.fieldContainer]}>
                  <View style={{flex: 2}}>
                    <StyledText style={styles.fieldTitle}>{t('payment.cashPayment')}</StyledText>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="cash"
                      component={InputText}
                      placeholder={t('enterCash')}
                      keyboardType={'numeric'}
                      onFocus={() => resetTotal()}
                      extraStyle={{textAlign: 'left'}}
                    />
                  </View>
                </View>

                <View style={[styles.fieldContainer, {justifyContent: 'space-between'}]}>
                  {moneyAmts.map((moneyAmt, ix) => (
                    <TouchableOpacity
                      onPress={() => {
                        addNum(moneyAmt.value)
                      }}
                      key={moneyAmt.value}
                    >
                      <View
                        style={{
                          width: 70,
                          height: 50,
                          borderWidth: 2,
                          borderColor: customMainThemeColor,
                          justifyContent: 'center'
                        }}
                      >
                        <Text
                          style={[
                            styles?.primaryText(customMainThemeColor),
                            styles.centerText
                          ]}
                        >
                          {moneyAmt.label}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }

            {
              selectedPaymentType === 1 &&
              <View>
                <View style={styles.fieldContainer}>
                  <View style={{flex: 2}}>
                    <StyledText style={styles.fieldTitle}>{t('CardNo')}</StyledText>
                  </View>
                  <View style={{flex: 3}}>
                    <Field
                      name="cardNumber"
                      component={InputText}
                      placeholder={t('enterCardNo')}
                      keyboardType={'numeric'}
                      alignLeft={true}
                    />
                  </View>
                </View>

                <View style={styles.fieldContainer}>
                  <Field
                    name="cardType"
                    component={DropDown}
                    placeholder={{value: null, label: t('chooseCardType')}}
                    options={[
                      {label: 'Visa', value: 'VISA'},
                      {label: 'MasterCard', value: 'MASTER'},
                      {label: 'Other', value: 'OTHER'}
                    ]}
                  />
                </View>
              </View>
            }
            {
              selectedPaymentType === 2 &&
              <View>
                <View style={styles.sectionContainer}>
                  {!!mobilePayList && mobilePayList?.map((item, index) => (
                    <View style={[{flex: 1}]}
                      key={item.id + index}>
                      <Field
                        name="mobilePayType"
                        component={RadioLineItemObjPick}
                        customValueOrder={item.paymentKey}
                        optionName={t(`settings.paymentMethods.${item.paymentKey}`)}
                        onCheck={(currentVal, fieldVal) => {
                          return fieldVal !== undefined && currentVal === fieldVal
                        }}
                      />
                    </View>
                  ))}
                  {!mobilePayList.length &&
                    <View style={[styles.fieldContainer, styles.jc_alignIem_center]}>
                      <StyledText style={[{color: customMainThemeColor, fontSize: 18}]}>
                        {t('payment.mobilePaymentNoSet')}
                      </StyledText>
                    </View>
                  }
                </View>
              </View>
            }

            <View style={styles.fieldContainer}>
              <View style={{flex: 2}}>
                <StyledText style={styles.fieldTitle}>{t('taxIDNumber')}</StyledText>
              </View>
              <View style={{flex: 3}}>
                <Field
                  name="taxIdNumber"
                  component={InputText}
                  placeholder={t('enterTaxIDNumber')}
                  keyboardType={'numeric'}
                  extraStyle={{textAlign: 'left'}}
                  secureTextEntry={false}
                />
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{flex: 2}}>
                <StyledText style={styles.fieldTitle}>{t('payment.carrierId')}</StyledText>
              </View>
              <View style={{flex: 2}}>
                <Field
                  name="carrierId"
                  component={InputText}
                  placeholder={t('payment.carrierId')}
                  extraStyle={{textAlign: 'left'}}
                  validate={[isCarrierType]}
                  format={(value, name) => {
                    return value != null ? String(value).toUpperCase() : ''
                  }}
                />
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity style={{alignItems: 'center', }}
                  onPress={() => {
                    this.setState({openScanView: !this.state?.openScanView})
                  }}
                >
                  <Icon style={{marginLeft: 10}} name="camera" size={24} color={customMainThemeColor} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <View style={{flex: 2}}>
                <StyledText style={styles.fieldTitle}>{t('payment.npoBan')}</StyledText>
              </View>
              <View style={{flex: 3}}>
                <Field
                  name="npoBan"
                  component={InputText}
                  placeholder={t('payment.npoBan')}
                  extraStyle={{textAlign: 'left'}}
                />
              </View>

            </View>
            {this.state?.openScanView && <View style={{flexDirection: 'column'}}>
              <ScanView successCallback={(data) => {this.handleScanSuccess(data)}} style={{height: 320, width: '100%'}} />
            </View>}


            <View style={styles.fieldContainer}>
              <View style={{flex: 2}}>
                <StyledText style={styles.fieldTitle}>{t(`membership.membershipAccount`)}</StyledText>
              </View>
              <View style={{flex: 2}}>
                <Field
                  name="phoneNumber"
                  component={InputText}
                  placeholder={t(`membership.membershipAccount`)}
                  extraStyle={{textAlign: 'left'}}

                />
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity style={{alignItems: 'center', }}
                  onPress={() => {
                    this.props?.change(`phoneNumber`, (fieldValue) => {
                      this.handleSearchAccount(fieldValue, this.props?.order?.orderId)
                      return fieldValue
                    })
                  }}
                >
                  <Icon style={{marginLeft: 10}} name="search" size={24} color={customMainThemeColor} />
                </TouchableOpacity>
              </View>
            </View>

            <TaxInputAndBottomBtns
              handleSubmit={handleSubmit}
              navigation={this.props.navigation}
              change={this.props?.change}
              order={order}
            />

          </View>
        </View>
      </ThemeKeyboardAwareScrollView>
    )
  }
}

const mapStateToProps = (state, props) => ({
  initialValues: {
    cash: '' + props.dynamicTotal,
    paymentMethod: props.selectedPaymentType === 0 ? 'CASH' :
      props.selectedPaymentType === 1 ? 'CARD' : 'MOBILE',
    phoneNumber: props?.order?.membership?.phoneNumber ?? undefined
  }
})

export default connect(
  mapStateToProps,
  null
)(
  reduxForm({
    form: 'paymentorderForm',
    enableReinitialize: true
  })(PaymentOrderForm)
)
