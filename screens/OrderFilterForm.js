import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {Field, reduxForm} from 'redux-form'
import RenderDateTimePicker from '../components/DateTimePicker'
import DropDown from '../components/DropDown'
import {LocaleContext} from '../locales/LocaleContext'
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import SegmentedControl from "../components/SegmentedControl";
import InputText from '../components/InputText'
import Icon from 'react-native-vector-icons/Ionicons'
import TimePeriodPicker from "../components/TimePeriodPicker";
import moment from "moment";
import Modal from 'react-native-modal';
import {CheckBox} from 'react-native-elements'
import {renderOrderState} from "../helpers/orderActions";

class OrderFilterForm extends React.Component {
  static contextType = LocaleContext
  state = {
    readonly: this.props?.initialValues?.dateRange !== 'RANGE',
    dateRange: this.props?.initialValues?.dateRange ?? 0,
    showFromDate: false,
    showToDate: false,
    searchType: [this.context.t('orderFilterForm.searchByDateAndTable'), this.context.t('orderFilterForm.searchByInvoice')],
    searchTypeIndex: this.props?.initialValues?.searchTypeIndex ?? 0,
    isFilterOpen: false,
    currentDate: this.props?.initialValues?.fromDate ?? new Date(),
    needSearch: false,
    statusOptions: ['OPEN', 'IN_PROCESS', 'DELIVERED', 'SETTLED', 'COMPLETED', 'DELETED', 'CANCELLED', 'PAYMENT_IN_PROCESS'],
    selectedStatusOptions: this.props?.initialValues?.selectedStatusOptions ?? new Set(),
  }



  handlegetDate = (event, selectedDate) => {
    console.log(`selected date: ${selectedDate}`)
  }

  showFromDatepicker = () => {
    this.setState({
      showFromDate: !this.state.showFromDate
    })
  };

  showToDatepicker = () => {
    this.setState({
      showToDate: !this.state.showToDate
    })
  };

  render() {
    const {handleSubmit, handlegetDate, change, isShow, closeModal} = this.props
    const {t, isTablet, themeStyle, appType, customMainThemeColor, customBackgroundColor} = this.context

    if (isTablet) {
      return (
        <Modal
          isVisible={isShow}
          useNativeDriver
          hideModalContentWhileAnimating
          animationIn='fadeInDown'
          animationOut='fadeOutUp'
          onBackdropPress={() => closeModal()}
          onModalHide={() => this.state?.needSearch && handleSubmit()}
          onModalWillShow={() => this.setState({needSearch: false})}
          style={{
            margin: 0, flex: 1, justifyContent: 'flex-start'
          }}
        >
          <View style={[{marginTop: 100, marginRight: 15, width: '50%', alignSelf: 'flex-end'}]}>
            <View style={[themeStyle, {flexDirection: 'column', borderRadius: 10}, styles?.customBorderAndBackgroundColor(this.context)]}>
              <View style={[styles.tableRowContainer]}>
                <TouchableOpacity
                  onPress={() => {
                    change('searchTypeIndex', 0)
                    this.setState({searchTypeIndex: 0})
                  }}
                  style={[{flex: 1, borderWidth: 1, borderColor: customMainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginRight: 5}, (this.state?.searchTypeIndex === 0 && {backgroundColor: customMainThemeColor})]}>
                  <StyledText style={this.state?.searchTypeIndex === 0 && {color: customBackgroundColor}}>{this.state?.searchType[0]}</StyledText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    change('searchTypeIndex', 1)
                    this.setState({searchTypeIndex: 1})
                  }}
                  style={[{flex: 1, borderWidth: 1, borderColor: customMainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginLeft: 5}, (this.state?.searchTypeIndex === 1 && {backgroundColor: customMainThemeColor})]}>
                  <StyledText style={this.state?.searchTypeIndex === 1 && {color: customBackgroundColor}}>{this.state?.searchType[1]}</StyledText>
                </TouchableOpacity>

              </View>
              {this.state?.searchTypeIndex === 0 && <View style={{justifyContent: 'space-between'}}>
                <View style={[styles.tableRowContainer]}>
                  <View style={[styles.tableCellView, {flex: 3, marginRight: 5, flexDirection: 'column', justifyContent: 'center'}]}>
                    <Field
                      name="dateRange"
                      component={SegmentedControl}
                      onChange={(val) => {this.setState({dateRange: val})}}
                      values={[t('dateRange.SHIFT'), t('dateRange.TODAY'), t('dateRange.WEEK'), t('dateRange.MONTH'), t('dateRange.RANGE')]}
                    />
                  </View>

                </View>

                {this.state.dateRange === 4 && <View style={[styles.tableRowContainer, {paddingTop: 0}]}>
                  <View style={[styles.tableCellView, {flex: 2}]}>
                    <Field
                      name="fromDate"
                      component={RenderDateTimePicker}
                      onChange={this.handlegetDate}
                      placeholder={t('order.fromDate')}
                      isShow={this.state.showFromDate}
                      showDatepicker={this.showFromDatepicker}
                    />
                  </View>
                  <View style={[styles.tableCellView, {flex: 0.2, justifyContent: 'center'}]}>
                    <StyledText>-</StyledText>
                  </View>
                  <View style={[styles.tableCellView, {flex: 2}]}>
                    <Field
                      name="toDate"
                      component={RenderDateTimePicker}
                      onChange={this.handlegetDate}
                      placeholder={t('order.toDate')}
                      isShow={this.state.showToDate}
                      showDatepicker={this.showToDatepicker}
                    />
                  </View>
                </View>}
                {this.state.dateRange === 3 && <TimePeriodPicker
                  currentDate={this.state.currentDate}
                  selectedFilter='months'
                  handleDateChange={(date) => {
                    this.setState({currentDate: date})
                    change('fromDate', new Date(moment().year(date.year()).month(date.month()).date(1)))
                    change('toDate', new Date(moment().year(date.year()).month(date.month() + 1).date(0)))

                  }}
                />}
                {this.state.dateRange === 2 && <TimePeriodPicker
                  currentDate={this.state.currentDate}
                  selectedFilter='weeks'
                  handleDateChange={(date) => {
                    this.setState({currentDate: date})
                    change('fromDate', new Date(moment(date).isoWeekday(1)))
                    change('toDate', new Date(moment(date).isoWeekday(7)))

                  }}
                />}
                <View style={[styles.tableRowContainer, {paddingTop: 0}]}>
                  <View style={[styles.tableCellView, {flex: 3, marginRight: 5}]}>
                    <Field
                      name="tableName"
                      component={InputText}
                      defaultValue={t('orderFilterForm.tablePlaceholder')}
                      extraStyle={{borderRadius: 10}}
                    />
                  </View>
                  <View style={[styles.tableCellView, styles.justifyRight]}>
                    <TouchableOpacity
                      style={{flex: 1, marginLeft: 20}}
                      onPress={() => {
                        this.setState({needSearch: true})
                        closeModal()
                      }}>
                      <Text
                        style={[
                          styles?.searchButton(customMainThemeColor)
                        ]}
                      >
                        {t('action.search')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {appType === 'store' ? <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <View style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    alignItems: 'center',
                    width: '100%'
                  }}>
                    <View>
                      <CheckBox
                        checkedIcon={'check-circle'}
                        uncheckedIcon={'circle'}
                        checked={this.state?.selectedStatusOptions?.size === this.state?.statusOptions?.length}
                        containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                        onPress={() => {
                          let tempSet = new Set()
                          if (this.state?.selectedStatusOptions?.size === this.state?.statusOptions?.length) {
                            tempSet = new Set()
                          } else {
                            let labelsArr = [...this.state?.statusOptions]
                            tempSet = new Set([...labelsArr])
                          }
                          this.setState({selectedStatusOptions: tempSet})
                          this.props?.getSelectedStatus(tempSet)
                        }}
                      >
                      </CheckBox>
                    </View>
                    <StyledText>{t('allSelected')}</StyledText>
                  </View>
                  {this.state?.statusOptions?.map((status, index) => {
                    return (
                      <View key={index} style={{
                        flexDirection: 'row',
                        paddingVertical: 8,
                        alignItems: 'center',
                        width: '50%'
                      }}>

                        <View>
                          <CheckBox
                            checkedIcon={'check-circle'}
                            uncheckedIcon={'circle'}
                            checked={this.state?.selectedStatusOptions?.has(status)}
                            containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                            onPress={() => {
                              let tempSet = new Set(this.state?.selectedStatusOptions)
                              if (this.state?.selectedStatusOptions?.has(status)) {
                                tempSet.delete(status)
                              } else {
                                tempSet.add(status)
                              }
                              this.setState({selectedStatusOptions: tempSet})
                              this.props?.getSelectedStatus(tempSet)
                            }}
                          >
                          </CheckBox>
                        </View>
                        <View style={{marginRight: 10}}>
                          {renderOrderState(status, customMainThemeColor)}
                        </View>
                        <StyledText>{t(`orderState.${status}`)}</StyledText>

                      </View>
                    )
                  })}
                </View> :
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    <View style={{
                      flexDirection: 'row',
                      paddingVertical: 8,
                      alignItems: 'center',
                      width: '50%'
                    }}>
                      <View>
                        <CheckBox
                          checkedIcon={'check-circle'}
                          uncheckedIcon={'circle'}
                          checked={this.state?.selectedStatusOptions.has('OPEN') && this.state?.selectedStatusOptions.has('IN_PROCESS') && this.state?.selectedStatusOptions.has('DELIVERED') && this.state?.selectedStatusOptions.has('SETTLED') && this.state?.selectedStatusOptions.has('PAYMENT_IN_PROCESS')}
                          containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                          onPress={() => {
                            let tempSet = new Set(this.state?.selectedStatusOptions)
                            let changeSet = new Set(['OPEN', 'IN_PROCESS', 'DELIVERED', 'SETTLED', 'PAYMENT_IN_PROCESS'])
                            if (this.state?.selectedStatusOptions.has('OPEN') && this.state?.selectedStatusOptions.has('IN_PROCESS') && this.state?.selectedStatusOptions.has('DELIVERED') && this.state?.selectedStatusOptions.has('SETTLED') && this.state?.selectedStatusOptions.has('PAYMENT_IN_PROCESS')) {
                              changeSet.forEach((item) => tempSet.delete(item))
                            } else {
                              changeSet.forEach((item) => tempSet.add(item))
                            }
                            this.setState({selectedStatusOptions: tempSet})
                            this.props?.getSelectedStatus(tempSet)
                          }}
                        >
                        </CheckBox>
                      </View>
                      <StyledText>{t('selectUnCompletedOrder')}</StyledText>
                    </View>
                    <View style={{
                      flexDirection: 'row',
                      paddingVertical: 8,
                      alignItems: 'center',
                      width: '50%'
                    }}>
                      <View>
                        <CheckBox
                          checkedIcon={'check-circle'}
                          uncheckedIcon={'circle'}
                          checked={this.state?.selectedStatusOptions.has('COMPLETED') && this.state?.selectedStatusOptions.has('DELETED') && this.state?.selectedStatusOptions.has('CANCELLED')}
                          containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                          onPress={() => {
                            let tempSet = new Set(this.state?.selectedStatusOptions)
                            let changeSet = new Set(['COMPLETED', 'DELETED', 'CANCELLED'])
                            if (this.state?.selectedStatusOptions.has('COMPLETED') && this.state?.selectedStatusOptions.has('DELETED') && this.state?.selectedStatusOptions.has('CANCELLED')) {
                              changeSet.forEach((item) => tempSet.delete(item))
                            } else {
                              changeSet.forEach((item) => tempSet.add(item))
                            }
                            this.setState({selectedStatusOptions: tempSet})
                            this.props?.getSelectedStatus(tempSet)
                          }}
                        >
                        </CheckBox>
                      </View>
                      <StyledText>{t('selectCompletedOrder')}</StyledText>
                    </View>
                  </View>
                }
              </View>}
              {this.state?.searchTypeIndex === 1 &&
                <View style={{justifyContent: 'space-between'}}>
                  <View style={[styles.tableRowContainer]}>
                    <View style={[styles.tableCellView, {flex: 3, marginRight: 5}]}>
                      <Field
                        name="invoiceNumber"
                        component={InputText}
                        defaultValue={t('orderFilterForm.searchByInvoice')}
                        extraStyle={{borderRadius: 10}}
                      />
                    </View>

                  </View>
                  <View style={[styles.tableRowContainer]}>

                    <View style={[styles.tableCellView, {flex: 1, marginHorizontal: '25%'}]}>
                      <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                          this.setState({needSearch: true})
                          closeModal()
                        }}>
                        <Text
                          style={[
                            styles?.searchButton(customMainThemeColor)
                          ]}
                        >
                          {t('action.search')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>}
            </View>
          </View>
        </Modal>
      )
    }

    return (
      <Modal
        isVisible={isShow}
        useNativeDriver
        hideModalContentWhileAnimating
        animationIn='fadeInDown'
        animationOut='fadeOutUp'
        onBackdropPress={() => closeModal()}
        onModalHide={() => this.state?.needSearch && handleSubmit()}
        onModalWillShow={() => this.setState({needSearch: false})}
        style={{
          margin: 0, flex: 1, justifyContent: 'flex-start'
        }}
      >
        <View style={[{height: 300, width: '100%', alignSelf: 'flex-end'}]}>
          <View style={[themeStyle, {flexDirection: 'column', paddingTop: 50, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}, styles?.customBorderAndBackgroundColor(this.context)]}>
            <View style={[styles.tableRowContainer]}>
              <TouchableOpacity
                onPress={() => {
                  change('searchTypeIndex', 0)
                  this.setState({searchTypeIndex: 0})
                }}
                style={[{flex: 1, borderWidth: 1, borderColor: customMainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginRight: 5}, (this.state?.searchTypeIndex === 0 && {backgroundColor: customMainThemeColor})]}>
                <StyledText style={this.state?.searchTypeIndex === 0 && {color: customBackgroundColor}}>{this.state?.searchType[0]}</StyledText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  change('searchTypeIndex', 1)
                  this.setState({searchTypeIndex: 1})
                }}
                style={[{flex: 1, borderWidth: 1, borderColor: customMainThemeColor, borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 10, marginLeft: 5}, (this.state?.searchTypeIndex === 1 && {backgroundColor: customMainThemeColor})]}>
                <StyledText style={this.state?.searchTypeIndex === 1 && {color: customBackgroundColor}}>{this.state?.searchType[1]}</StyledText>
              </TouchableOpacity>

            </View>
            {this.state?.searchTypeIndex === 0 && <View >
              <View style={[styles.tableRowContainer]}>
                <View style={[styles.tableCellView, {flex: 3, marginRight: 5, flexDirection: 'column', justifyContent: 'center'}]}>
                  <Field
                    name="dateRange"
                    component={SegmentedControl}
                    onChange={(val) => {this.setState({dateRange: val})}}
                    values={[t('dateRange.SHIFT'), t('dateRange.TODAY'), t('dateRange.WEEK'), t('dateRange.MONTH'), t('dateRange.RANGE')]}
                  />
                </View>

              </View>

              {this.state.dateRange === 4 && <View style={[styles.tableRowContainer, {paddingTop: 0}]}>
                <View style={[styles.tableCellView, {flex: 2}]}>
                  <Field
                    name="fromDate"
                    component={RenderDateTimePicker}
                    onChange={this.handlegetDate}
                    placeholder={t('order.fromDate')}
                    isShow={this.state.showFromDate}
                    showDatepicker={this.showFromDatepicker}
                  />
                </View>
                <View style={[styles.tableCellView, {flex: 0.2, justifyContent: 'center'}]}>
                  <StyledText>-</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 2}]}>
                  <Field
                    name="toDate"
                    component={RenderDateTimePicker}
                    onChange={this.handlegetDate}
                    placeholder={t('order.toDate')}
                    isShow={this.state.showToDate}
                    showDatepicker={this.showToDatepicker}
                  />
                </View>
              </View>}
              {this.state.dateRange === 3 && <TimePeriodPicker
                currentDate={this.state.currentDate}
                selectedFilter='months'
                handleDateChange={(date) => {
                  this.setState({currentDate: date})
                  change('fromDate', new Date(moment().year(date.year()).month(date.month()).date(1)))
                  change('toDate', new Date(moment().year(date.year()).month(date.month() + 1).date(0)))

                }}
              />}
              {this.state.dateRange === 2 && <TimePeriodPicker
                currentDate={this.state.currentDate}
                selectedFilter='weeks'
                handleDateChange={(date) => {
                  this.setState({currentDate: date})
                  change('fromDate', new Date(moment(date).isoWeekday(1)))
                  change('toDate', new Date(moment(date).isoWeekday(7)))

                }}
              />}
              <View style={[styles.tableRowContainer, {paddingTop: 0}]}>
                <View style={[styles.tableCellView, {flex: 3, marginRight: 5}]}>
                  <Field
                    name="tableName"
                    component={InputText}
                    defaultValue={t('orderFilterForm.tablePlaceholder')}
                    extraStyle={{borderRadius: 10}}
                  />
                </View>
                <View style={[styles.tableCellView, styles.justifyRight]}>
                  <TouchableOpacity
                    style={{flex: 1, marginLeft: 20}}
                    onPress={() => {
                      this.setState({needSearch: true})
                      closeModal()
                    }}>
                    <Text
                      style={[
                        styles?.searchButton(customMainThemeColor)
                      ]}
                    >
                      {t('action.search')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {appType === 'store' ? <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                <View style={{
                  flexDirection: 'row',
                  paddingVertical: 8,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <View>
                    <CheckBox
                      checkedIcon={'check-circle'}
                      uncheckedIcon={'circle'}
                      checked={this.state?.selectedStatusOptions?.size === this.state?.statusOptions?.length}
                      containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                      onPress={() => {
                        let tempSet = new Set()
                        if (this.state?.selectedStatusOptions?.size === this.state?.statusOptions?.length) {
                          tempSet = new Set()
                        } else {
                          let labelsArr = [...this.state?.statusOptions]
                          tempSet = new Set([...labelsArr])
                        }
                        this.setState({selectedStatusOptions: tempSet})
                        this.props?.getSelectedStatus(tempSet)
                      }}
                    >
                    </CheckBox>
                  </View>
                  <StyledText>{t('allSelected')}</StyledText>
                </View>
                {this.state?.statusOptions?.map((status, index) => {
                  return (
                    <View key={index} style={{
                      flexDirection: 'row',
                      paddingVertical: 8,
                      alignItems: 'center',
                      width: '50%'
                    }}>

                      <View>
                        <CheckBox
                          checkedIcon={'check-circle'}
                          uncheckedIcon={'circle'}
                          checked={this.state?.selectedStatusOptions?.has(status)}
                          containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                          onPress={() => {
                            let tempSet = new Set(this.state?.selectedStatusOptions)
                            if (this.state?.selectedStatusOptions?.has(status)) {
                              tempSet.delete(status)
                            } else {
                              tempSet.add(status)
                            }
                            this.setState({selectedStatusOptions: tempSet})
                            this.props?.getSelectedStatus(tempSet)
                          }}
                        >
                        </CheckBox>
                      </View>
                      <View style={{marginRight: 10}}>
                        {renderOrderState(status, customMainThemeColor)}
                      </View>
                      <StyledText>{t(`orderState.${status}`)}</StyledText>

                    </View>
                  )
                })}
              </View> :
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <View style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    alignItems: 'center',
                    width: '50%'
                  }}>
                    <View>
                      <CheckBox
                        checkedIcon={'check-circle'}
                        uncheckedIcon={'circle'}
                        checked={this.state?.selectedStatusOptions.has('OPEN') && this.state?.selectedStatusOptions.has('IN_PROCESS') && this.state?.selectedStatusOptions.has('DELIVERED') && this.state?.selectedStatusOptions.has('SETTLED') && this.state?.selectedStatusOptions.has('PAYMENT_IN_PROCESS')}
                        containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                        onPress={() => {
                          let tempSet = new Set(this.state?.selectedStatusOptions)
                          let changeSet = new Set(['OPEN', 'IN_PROCESS', 'DELIVERED', 'SETTLED', 'PAYMENT_IN_PROCESS'])
                          if (this.state?.selectedStatusOptions.has('OPEN') && this.state?.selectedStatusOptions.has('IN_PROCESS') && this.state?.selectedStatusOptions.has('DELIVERED') && this.state?.selectedStatusOptions.has('SETTLED') && this.state?.selectedStatusOptions.has('PAYMENT_IN_PROCESS')) {
                            changeSet.forEach((item) => tempSet.delete(item))
                          } else {
                            changeSet.forEach((item) => tempSet.add(item))
                          }
                          this.setState({selectedStatusOptions: tempSet})
                          this.props?.getSelectedStatus(tempSet)
                        }}
                      >
                      </CheckBox>
                    </View>
                    <StyledText>{t('selectUnCompletedOrder')}</StyledText>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    alignItems: 'center',
                    width: '50%'
                  }}>
                    <View>
                      <CheckBox
                        checkedIcon={'check-circle'}
                        uncheckedIcon={'circle'}
                        checked={this.state?.selectedStatusOptions.has('COMPLETED') && this.state?.selectedStatusOptions.has('DELETED') && this.state?.selectedStatusOptions.has('CANCELLED')}
                        containerStyle={{margin: 0, padding: 0, minWidth: 0}}
                        onPress={() => {
                          let tempSet = new Set(this.state?.selectedStatusOptions)
                          let changeSet = new Set(['COMPLETED', 'DELETED', 'CANCELLED'])
                          if (this.state?.selectedStatusOptions.has('COMPLETED') && this.state?.selectedStatusOptions.has('DELETED') && this.state?.selectedStatusOptions.has('CANCELLED')) {
                            changeSet.forEach((item) => tempSet.delete(item))
                          } else {
                            changeSet.forEach((item) => tempSet.add(item))
                          }
                          this.setState({selectedStatusOptions: tempSet})
                          this.props?.getSelectedStatus(tempSet)
                        }}
                      >
                      </CheckBox>
                    </View>
                    <StyledText>{t('selectCompletedOrder')}</StyledText>
                  </View>
                </View>
              }
            </View>}
            {this.state?.searchTypeIndex === 1 &&
              <View style={{justifyContent: 'space-between'}}>
                <View style={[styles.tableRowContainer]}>
                  <View style={[styles.tableCellView, {flex: 3, marginRight: 5}]}>
                    <Field
                      name="invoiceNumber"
                      component={InputText}
                      defaultValue={t('orderFilterForm.searchByInvoice')}
                      extraStyle={{borderRadius: 10}}
                    />
                  </View>

                </View>
                <View style={[styles.tableRowContainer]}>

                  <View style={[styles.tableCellView, {flex: 1, marginHorizontal: '25%'}]}>
                    <TouchableOpacity
                      style={{flex: 1}}
                      onPress={() => {
                        this.setState({needSearch: true})
                        closeModal()
                      }}>
                      <Text
                        style={[
                          styles?.searchButton(customMainThemeColor)
                        ]}
                      >
                        {t('action.search')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>}
          </View>
        </View>
      </Modal>
    )
  }
}

OrderFilterForm = reduxForm({
  form: 'orderfilterForm'
})(OrderFilterForm)

export default OrderFilterForm
