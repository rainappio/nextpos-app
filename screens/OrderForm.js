import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {Alert, Text, TouchableOpacity, View} from 'react-native'
import RenderStepper from '../components/RenderStepper'
import {isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import PickerInput from "../components/PickerInput";
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";

class OrderForm extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.context.localize({
      en: {
        newOrderTitle: 'New Order',
        orderType: 'Order Type',
        table: 'Table',
        selectTable: 'Select a table',
        noAvailableTables: 'There is no available table.',
        ageGroup: 'Age Group',
        visitFrequency: 'Visit Frequency',
        peopleCount: 'People Count',
        openOrder: 'Save Order'
      },
      zh: {
        newOrderTitle: '新訂單',
        orderType: '訂單種類',
        table: '桌位',
        selectTable: '選擇桌位',
        noAvailableTables: '目前沒有空桌.',
        ageGroup: '來客年齡層',
        visitFrequency: '造訪次數',
        peopleCount: '來客數',
        openOrder: '儲存訂單'
      }
    })

    this.state = {
      selectedTableId: null,
      selectedOrderType: null,
      orderTypes: {
        0: {label: context.t('order.inStore'), value: 'IN_STORE'},
        1: {label: context.t('order.takeOut'), value: 'TAKE_OUT'}
      },
      selectedAgeGroup: null,
      ageGroups: {
        0: {label: '20-29', value: 'TWENTIES'},
        1: {label: '30-39', value: 'THIRTIES'},
        2: {label: '40-49', value: 'FORTIES'},
        3: {label: '50-59', value: 'FIFTIES_AND_ABOVE'}
      },
      selectedVisitFrequency: null,
      visitFrequencies: {
        0: {label: '1', value: 'FIRST_TIME'},
        1: {label: '2 - 3', value: 'TWO_TO_THREE'},
        2: {label: '4+', value: 'MORE_THAN_THREE'}
      }
    }
  }

  componentDidMount() {
    const initialValues = this.props.initialValues;
    const orderType = initialValues.orderType

    if (orderType != null) {
      this.handleOrderTypeSelection(orderType === 'IN_STORE' ? 0 : 1)
      this.setState({selectedTableId: initialValues.tableId})

      let selectedAgeGroup = null

      switch (initialValues.ageGroup) {
        case 'TWENTIES':
          selectedAgeGroup = 0
          break
        case 'THIRTIES':
          selectedAgeGroup = 1
          break
        case 'FORTIES':
          selectedAgeGroup = 2
          break
        case 'FIFTIES_AND_ABOVE':
          selectedAgeGroup = 3
          break
      }

      this.handleAgeGroupSelection(selectedAgeGroup)

      let selectedVisitFrequency = null

      switch (initialValues.visitFrequency) {
        case 'FIRST_TIME':
          selectedVisitFrequency = 0
          break
        case 'TWO_TO_THREE':
          selectedVisitFrequency = 1
          break
        case 'MORE_THAN_THREE':
          selectedVisitFrequency = 2
          break
      }

      this.handleVisitFrequencySelection(selectedVisitFrequency)
    }
  }

  handleOrderTypeSelection = (index) => {
    const selectedIndex = this.selectedOrderType === index ? null : index
    this.setState({selectedOrderType: selectedIndex})
  }

  handleAgeGroupSelection = (index) => {
    const selectedIndex = this.selectedAgeGroup === index ? null : index
    this.setState({selectedAgeGroup: selectedIndex})
  }

  handleVisitFrequencySelection = (index) => {
    const selectedIndex = this.selectedVisitFrequency === index ? null : index
    this.setState({selectedVisitFrequency: selectedIndex})
  }

  render() {
    const {tablesMap} = this.props
    const {t} = this.context

    const orderTypes = Object.keys(this.state.orderTypes).map(key => this.state.orderTypes[key].label)
    const ageGroups = Object.keys(this.state.ageGroups).map(key => this.state.ageGroups[key].label)
    const visitFrequencies = Object.keys(this.state.visitFrequencies).map(key => this.state.visitFrequencies[key].label)
    const noAvailableTables = this.state.selectedOrderType === 0 && Object.keys(tablesMap).length === 0

    const people = [
      {
        label: 'Male',
        value: 'male'
      },
      {
        label: 'Female',
        value: 'female'
      },
      {
        label: 'Kid',
        value: 'kid'
      }
    ]

    return (
      <ThemeScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader backNavigation={true}
                        parentFullScreen={true}
                        title={t('newOrderTitle')}
          />

          <View style={[styles.sectionContent, styles.horizontalMargin]}>
            <View style={styles.sectionTitleContainer}>
              <StyledText style={styles.sectionTitleText}>{t('orderType')}</StyledText>
            </View>
            <View style={[styles.fieldContainer]}>
              <View style={{flex: 1}}>
                <Field
                  name="orderType"
                  component={SegmentedControl}
                  selectedIndex={this.state.selectedOrderType}
                  onChange={this.handleOrderTypeSelection}
                  values={orderTypes}
                  normalize={value => {
                    return this.state.orderTypes[value].value
                  }}
                />
              </View>
            </View>
          </View>

          {this.state.selectedOrderType === 0 && Object.keys(tablesMap).length > 0 && (
            <View style={styles.sectionContent}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('table')}</StyledText>
              </View>
              <Field
                component={PickerInput}
                name="tableId"
                values={tablesMap}
                selectedValue={this.state.selectedTableId}
                validate={isRequired}
                onChange={(itemValue, itemIndex) => {
                  this.setState({selectedTableId: itemValue})
                }}
              />
            </View>
          )}

          {noAvailableTables && (
            <View style={styles.sectionContent}>
              <StyledText>{t('noAvailableTables')}</StyledText>
            </View>
          )}


          <View style={[styles.sectionContent, styles.horizontalMargin]}>
            <View style={styles.sectionTitleContainer}>
              <StyledText style={styles.sectionTitleText}>{t('ageGroup')}</StyledText>
            </View>
            <View style={[styles.fieldContainer]}>
              <View style={{flex: 1}}>
                <Field
                  name="ageGroup"
                  component={SegmentedControl}
                  selectedIndex={this.state.selectedAgeGroup}
                  onChange={this.handleAgeGroupSelection}
                  values={ageGroups}
                  normalize={value => {
                    return this.state.ageGroups[value].value
                  }}
                />
              </View>
            </View>
          </View>

          <View style={[styles.sectionContent, styles.horizontalMargin]}>
            <View style={styles.sectionTitleContainer}>
              <StyledText style={styles.sectionTitleText}>{t('visitFrequency')}</StyledText>
            </View>
            <View style={[styles.fieldContainer]}>
              <View style={{flex: 1}}>
                <Field
                  name="visitFrequency"
                  component={SegmentedControl}
                  selectedIndex={this.state.selectedVisitFrequency}
                  onChange={this.handleVisitFrequencySelection}
                  values={visitFrequencies}
                  normalize={value => {
                    return this.state.visitFrequencies[value].value
                  }}
                />
              </View>
            </View>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.sectionTitleContainer}>
              <StyledText style={styles.sectionTitleText}>{t('peopleCount')}</StyledText>
            </View>
            <View>
              {people.map((people, ix) => (
                <View
                  style={[styles.tableRowContainerWithBorder]}
                  key={ix}
                >
                  <Field
                    name={people.value}
                    component={RenderStepper}
                    optionName={people.label}
                  />
                </View>
              ))}
            </View>
          </View>

          {this.state.selectedOrderType != null && (
            <View
              style={[
                styles.bottom,
                styles.flexRow,
                styles.horizontalMargin
              ]}
            >
              <View style={{flex: 1, marginHorizontal: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    if (!noAvailableTables) {
                      this.props.handleSubmit()
                    } else {
                      Alert.alert(
                        '',
                        `${t('noAvailableTables')}`,
                        [
                          {
                            text: `${t('action.ok')}`,
                          }
                        ])
                    }
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.actionButton]}>
                    {t('openOrder')}
                  </Text>
                </TouchableOpacity>
              </ View>

              <View style={{flex: 1, marginHorizontal: 5}}>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.goBack()
                  }}
                >
                  <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ThemeScrollView>
    )
  }
}

OrderForm = reduxForm({
  form: 'neworderForm'
})(OrderForm)

export default OrderForm
