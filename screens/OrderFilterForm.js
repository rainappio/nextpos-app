import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {Field, reduxForm} from 'redux-form'
import RenderDateTimePicker from '../components/DateTimePicker'
import DropDown from '../components/DropDown'
import {LocaleContext} from '../locales/LocaleContext'
import styles, {mainThemeColor} from '../styles'
import {StyledText} from "../components/StyledText";
import SegmentedControl from "../components/SegmentedControl";
import InputText from '../components/InputText'
import Icon from 'react-native-vector-icons/Ionicons'

class OrderFilterForm extends React.Component {
  static contextType = LocaleContext
  state = {
    readonly: this.props?.initialValues?.dateRange !== 'RANGE',
    showFromDate: false,
    showToDate: false,
    searchType: [this.context.t('orderFilterForm.searchByDateAndTable'), this.context.t('orderFilterForm.searchByInvoice')],
    searchTypeIndex: this.props?.initialValues?.searchTypeIndex ?? 0,
    isFilterOpen: false,
  }

  // todo: shared between OrdersScreen and SalesChart that caused transitioning from SalesChart to OrdersScreen an form rendering issue.
  componentDidMount() {
    this.context.localize({
      en: {
        dateRange: {
          SHIFT: 'Shift Duration',
          TODAY: 'Today',
          WEEK: 'This Week',
          MONTH: 'This Month',
          RANGE: 'Date Range'
        }
      },
      zh: {
        dateRange: {
          SHIFT: '開帳期間',
          TODAY: '今日',
          WEEK: '本週',
          MONTH: '本月',
          RANGE: '自訂日期'
        }
      }
    })
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
    const {handleSubmit, handlegetDate} = this.props
    const {t, isTablet} = this.context

    return (
      <View>
        <View style={[styles.tableRowContainer]}>
          <View style={[{flex: 7}]}>
            <Field
              name="searchTypeIndex"
              component={SegmentedControl}
              onChange={(val) => this.setState({searchTypeIndex: val, isFilterOpen: true})}
              values={this.state?.searchType}
            />

          </View>
          <TouchableOpacity
            onPress={() => this.setState({isFilterOpen: !this.state.isFilterOpen})}
            style={{width: 72, marginLeft: 10, borderColor: mainThemeColor, borderWidth: 1, borderRadius: 5, alignItems: 'center'}}>
            <Icon name={this.state.isFilterOpen ? 'caret-up' : 'caret-down'} size={24} color={mainThemeColor} style={{flex: 1, padding: 0, margin: 0}} />
          </TouchableOpacity>
        </View>

        {this.state?.searchTypeIndex === 0 && this.state.isFilterOpen && <><View style={[styles.tableRowContainer]}>
          {isTablet && <View style={[styles.tableCellView, {flex: 2, marginRight: 5}]}>
            <Field
              name="dateRange"
              component={DropDown}
              options={[
                {label: t('dateRange.RANGE'), value: 'RANGE'},
                {label: t('dateRange.SHIFT'), value: 'SHIFT'},
                {label: t('dateRange.TODAY'), value: 'TODAY'},
                {label: t('dateRange.WEEK'), value: 'WEEK'},
                {label: t('dateRange.MONTH'), value: 'MONTH'}
              ]}
              onChange={(value) => {
                this.setState({
                  readonly: value !== 'RANGE'
                })
              }}
            />
          </View>}
          <View style={[styles.tableCellView, {flex: 3}]}>
            <Field
              name="fromDate"
              component={RenderDateTimePicker}
              onChange={this.handlegetDate}
              placeholder={t('order.fromDate')}
              isShow={this.state.showFromDate}
              showDatepicker={this.showFromDatepicker}
              readonly={this.state.readonly}
            />
          </View>
          <View style={[styles.tableCellView, {flex: 0.2, justifyContent: 'center'}]}>
            <StyledText>-</StyledText>
          </View>
          <View style={[styles.tableCellView, {flex: 3}]}>
            <Field
              name="toDate"
              component={RenderDateTimePicker}
              onChange={this.handlegetDate}
              placeholder={t('order.toDate')}
              isShow={this.state.showToDate}
              showDatepicker={this.showToDatepicker}
              readonly={this.state.readonly}
            />
          </View>
        </View>

          <View style={[styles.tableRowContainer, {paddingTop: 0}]}>
            {!isTablet && <View style={[styles.tableCellView, {flex: 2, marginRight: 5}]}>
              <Field
                name="dateRange"
                component={DropDown}
                options={[
                  {label: t('dateRange.RANGE'), value: 'RANGE'},
                  {label: t('dateRange.SHIFT'), value: 'SHIFT'},
                  {label: t('dateRange.TODAY'), value: 'TODAY'},
                  {label: t('dateRange.WEEK'), value: 'WEEK'},
                  {label: t('dateRange.MONTH'), value: 'MONTH'}
                ]}
                onChange={(value) => {
                  this.setState({
                    readonly: value !== 'RANGE'
                  })
                }}
              />
            </View>}
            <View style={[styles.tableCellView, {flex: 2, marginRight: 5}]}>
              <Field
                name="tableName"
                component={InputText}
                defaultValue={t('orderFilterForm.tablePlaceholder')}
              />
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => handleSubmit()}>
                <Text
                  style={[
                    styles.searchButton
                  ]}
                >
                  {t('action.search')}
                </Text>
              </TouchableOpacity>
            </View>
          </View></>}

        {this.state?.searchTypeIndex === 1 && this.state.isFilterOpen && <>
          <View style={[styles.tableRowContainer]}>
            <View style={[styles.tableCellView, {flex: 3, marginRight: 5}]}>
              <Field
                name="invoiceNumber"
                component={InputText}
              />
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => handleSubmit()}>
                <Text
                  style={[
                    styles.searchButton
                  ]}
                >
                  {t('action.search')}
                </Text>
              </TouchableOpacity>
            </View>
          </View></>}
      </View>
    )
  }
}

OrderFilterForm = reduxForm({
  form: 'orderfilterForm'
})(OrderFilterForm)

export default OrderFilterForm
