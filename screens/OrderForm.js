import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {Animated, Alert, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import RenderStepper from '../components/RenderStepper'
import {isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import PickerInput from "../components/PickerInput";
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";
import TableRenderCheckboxGroup from '../components/TableRenderCheckboxGroup'
import {ThemeContainer} from "../components/ThemeContainer";

class OrderForm extends Component {
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
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
      },
      isTablet: context?.isTablet,
      rightFormSize: new Animated.Value(1),
      isAnimating: false
    }
  }

  componentDidMount() {
    const initialValues = this.props.initialValues;
    const orderType = initialValues.orderType

    if (orderType != null) {
      this.handleOrderTypeSelection(orderType === 'IN_STORE' ? 0 : 1)

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
    const selectedIndex = this.state.selectedOrderType === index ? null : index
    if (selectedIndex === 0) {
      this.formReSize(1)
    } else if (selectedIndex === 1 && this.state.selectedOrderType !== null) {
      this.formReSize(0)
    }
    this.setState({selectedOrderType: selectedIndex})
  }

  formReSize = (to) => {
    if (this.state.isTablet) {
      this.setState({isAnimating: true})
      console.log('resize')
      Animated.timing(this.state.rightFormSize, {
        toValue: to,
        duration: 500,
        useNativeDriver: false
      }).start((done) => {
        if (done.finished) {
          this.setState({isAnimating: false})
        }
      })
    }
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
    const {t, complexTheme, customMainThemeColor} = this.context

    const orderTypes = Object.keys(this.state.orderTypes).map(key => this.state.orderTypes[key].label)
    const ageGroups = Object.keys(this.state.ageGroups).map(key => this.state.ageGroups[key].label)
    const visitFrequencies = Object.keys(this.state.visitFrequencies).map(key => this.state.visitFrequencies[key].label)
    const noAvailableTables = this.state.selectedOrderType === 0 && Object.keys(tablesMap).length === 0

    const people = [
      {
        label: t('newOrder.male'),
        value: 'male'
      },
      {
        label: t('newOrder.female'),
        value: 'female'
      },
      {
        label: t('newOrder.kid'),
        value: 'kid'
      }
    ]

    const layoutList = Object.keys(tablesMap)

    if (this?.state?.isTablet) {
      return (
        <ThemeContainer>
          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={true}
              backAction={() => {
                if (this.props?.route?.params?.route) {
                  this.props.navigation.navigate(`${this.props?.route?.params.route}`)
                } else {
                  this.props.navigation.goBack()
                }
              }}
              parentFullScreen={true}
              title={t('newOrder.newOrderTitle')}
            />
            <View style={{flexDirection: 'row', flex: 1}}>
              <Animated.ScrollView style={{flex: 1}}>
                <View style={[styles.sectionContent, styles.horizontalMargin]}>
                  <View style={styles.sectionTitleContainer}>
                    <StyledText style={styles.sectionTitleText}>{t('newOrder.orderType')}</StyledText>
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


                {/* <View style={[styles.sectionContent, styles.horizontalMargin]}>
                  <View style={styles.sectionTitleContainer}>
                    <StyledText style={styles.sectionTitleText}>{t('newOrder.ageGroup')}</StyledText>
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
                </View> */}

                {/* <View style={[styles.sectionContent, styles.horizontalMargin]}>
                  <View style={styles.sectionTitleContainer}>
                    <StyledText style={styles.sectionTitleText}>{t('newOrder.visitFrequency')}</StyledText>
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
                </View> */}

                {this.props?.initialValues?.membership && <View style={[styles.dynamicHorizontalPadding(16), styles.withBottomBorder, {paddingBottom: 12}]}>
                  <View style={styles.sectionTitleContainer}>
                    <StyledText style={styles.sectionTitleText}>{t('newOrder.membership.title')}</StyledText>
                  </View>
                  <View style={[styles.fieldContainer, {justifyContent: 'space-between'}]}>
                    <View style={[styles.flexButtonSecondAction(this.context)]}>
                      <StyledText style={[{color: customMainThemeColor, }]}>
                        {t('newOrder.membership.name')}
                      </StyledText>
                    </View>
                    <View style={[styles.flex(2), {alignItems: 'flex-end'}]}>
                      <StyledText>
                        {this.props?.initialValues?.membership.name}
                      </StyledText>
                    </View>
                  </View>
                  <View style={[styles.fieldContainer, {justifyContent: 'space-between'}]}>
                    <View style={[styles.flexButtonSecondAction(this.context)]}>
                      <StyledText style={[{color: customMainThemeColor, }]}>
                        {t('newOrder.membership.phone')}
                      </StyledText>
                    </View>
                    <View style={[styles.flex(2), {alignItems: 'flex-end'}]}>
                      <StyledText>
                        {this.props?.initialValues?.membership.phoneNumber}
                      </StyledText>
                    </View>
                  </View>
                </View>}

                <View style={styles.sectionContent}>
                  <View style={styles.sectionTitleContainer}>
                    <StyledText style={styles.sectionTitleText}>{t('newOrder.peopleCount')}</StyledText>
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
                          totalWidth={180}
                        />
                      </View>
                    ))}
                  </View>
                </View>


              </Animated.ScrollView>
              {(this.state.rightFormSize._value === 0 && !this.state.isAnimating) || <Animated.View style={[{flex: this.state.rightFormSize, overflow: "hidden"}]}>
                <ThemeScrollView>
                  <View style={{paddingHorizontal: 16}}>
                    <View style={styles.sectionTitleContainer}>
                      <StyledText style={styles.sectionTitleText}>{t('newOrder.table')}</StyledText>
                    </View>
                    {noAvailableTables && (
                      <View style={styles.sectionContent}>
                        <StyledText>{t('newOrder.noAvailableTables')}</StyledText>
                      </View>
                    )}

                    {noAvailableTables ||
                      layoutList?.map((layout, index) => {
                        return (
                          <View key={index}>
                            <View style={[complexTheme.shade, {flex: 1, marginTop: 12, height: 36, alignItems: 'center', justifyContent: 'center'}]}>
                              <StyledText style={{fontSize: 18, }}>{layout}</StyledText>
                            </View>
                            <Field
                              name={`tableIds`}
                              component={TableRenderCheckboxGroup}
                              customarr={tablesMap?.[layout]}
                            />
                          </View>
                        )
                      })
                    }


                  </View>
                </ThemeScrollView>
              </Animated.View>}
            </View>

          </View>
          {
            this.state.selectedOrderType != null && (
              <View
                style={[
                  styles.bottom,
                  styles.flexRow,
                  styles.horizontalMargin,
                  {flex: 0}
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
                          `${t('newOrder.noAvailableTables')}`,
                          [
                            {
                              text: `${t('action.ok')}`,
                            }
                          ])
                      }
                    }}
                  >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                      {t('newOrder.openOrder')}
                    </Text>
                  </TouchableOpacity>
                </ View>

                <View style={{flex: 1, marginHorizontal: 5}}>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.props?.route?.params?.route) {
                        this.props.navigation.navigate(`${this.props?.route?.params.route}`)
                      } else {
                        this.props.navigation.goBack()
                      }
                    }}
                  >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('action.cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }
        </ThemeContainer >
      )
    } else {
      return (
        <ThemeContainer>
          <View style={styles.fullWidthScreen}>
            <ScreenHeader backNavigation={true}
              backAction={() => {
                if (this.props?.route?.params?.route) {
                  this.props.navigation.navigate(`${this.props?.route?.params.route}`)
                } else {
                  this.props.navigation.goBack()
                }
              }}
              parentFullScreen={true}
              title={t('newOrder.newOrderTitle')}
            />
            <ThemeScrollView style={{height: '100%'}}>
              <View style={[styles.sectionContent, styles.horizontalMargin]}>
                <View style={styles.sectionTitleContainer}>
                  <StyledText style={styles.sectionTitleText}>{t('newOrder.orderType')}</StyledText>
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


              {this.props?.initialValues?.membership && <View style={[styles.dynamicHorizontalPadding(16), styles.withBottomBorder, {paddingBottom: 12}]}>
                <View style={styles.sectionTitleContainer}>
                  <StyledText style={styles.sectionTitleText}>{t('newOrder.membership.title')}</StyledText>
                </View>
                <View style={[styles.fieldContainer, {justifyContent: 'space-between'}]}>
                  <View style={[styles.flexButtonSecondAction(this.context)]}>
                    <StyledText style={[{color: customMainThemeColor, paddingVertical: 2}]}>
                      {t('newOrder.membership.name')}
                    </StyledText>
                  </View>
                  <View style={[styles.flex(2), {alignItems: 'flex-end'}]}>
                    <StyledText>
                      {this.props?.initialValues?.membership.name}
                    </StyledText>
                  </View>
                </View>
                <View style={[styles.fieldContainer, {justifyContent: 'space-between'}]}>
                  <View style={[styles.flexButtonSecondAction(this.context)]}>
                    <StyledText style={[{color: customMainThemeColor, paddingVertical: 2}]}>
                      {t('newOrder.membership.phone')}
                    </StyledText>
                  </View>
                  <View style={[styles.flex(2), {alignItems: 'flex-end'}]}>
                    <StyledText>
                      {this.props?.initialValues?.membership.phoneNumber}
                    </StyledText>
                  </View>
                </View>
              </View>}

              {this.state.selectedOrderType === 0 && Object.keys(tablesMap).length > 0 && (
                <View style={styles.sectionContent}>
                  <View style={{paddingHorizontal: 16}}>
                    <View style={styles.sectionTitleContainer}>
                      <StyledText style={styles.sectionTitleText}>{t('newOrder.table')}</StyledText>
                    </View>
                    {noAvailableTables && (
                      <View style={styles.sectionContent}>
                        <StyledText>{t('newOrder.noAvailableTables')}</StyledText>
                      </View>
                    )}

                    {noAvailableTables ||
                      layoutList?.map((layout, index) => {
                        return (
                          <View key={index}>
                            <View style={[complexTheme.shade, {flex: 1, marginTop: 12, height: 36, alignItems: 'center', justifyContent: 'center'}]}>
                              <StyledText style={{fontSize: 18, }}>{layout}</StyledText>
                            </View>
                            <Field
                              name={`tableIds`}
                              component={TableRenderCheckboxGroup}
                              customarr={tablesMap?.[layout]}
                            />
                          </View>
                        )
                      })
                    }


                  </View>
                </View>
              )}

              {noAvailableTables && (
                <View style={styles.sectionContent}>
                  <StyledText>{t('newOrder.noAvailableTables')}</StyledText>
                </View>
              )}


              {/* <View style={[styles.sectionContent, styles.horizontalMargin]}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('newOrder.ageGroup')}</StyledText>
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
            </View> */}

              {/* <View style={[styles.sectionContent, styles.horizontalMargin]}>
              <View style={styles.sectionTitleContainer}>
                <StyledText style={styles.sectionTitleText}>{t('newOrder.visitFrequency')}</StyledText>
              </View>
              <View style={[styles.fieldContainer]}>
                <View style={{flex: 1}}>
                  <Field
                    name="newOrder.visitFrequency"
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
            </View> */}

              <View style={styles.sectionContent}>
                <View style={styles.sectionTitleContainer}>
                  <StyledText style={styles.sectionTitleText}>{t('newOrder.peopleCount')}</StyledText>
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

            </ThemeScrollView>

          </View>
          {this.state.selectedOrderType != null && (
            <View style={[{position: 'relative', bottom: 0, maxHeight: 100}]}>
              <View style={[styles.tableRowContainerWithBorder, {borderBottomWidth: 0}]}>
                <View style={[{flex: 1, marginHorizontal: 5}]}>

                  <TouchableOpacity
                    onPress={() => {
                      if (!noAvailableTables) {
                        this.props.handleSubmit()
                      } else {
                        Alert.alert(
                          '',
                          `${t('newOrder.noAvailableTables')}`,
                          [
                            {
                              text: `${t('action.ok')}`,
                            }
                          ])
                      }
                    }}
                  >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                      {t('newOrder.openOrder')}
                    </Text>
                  </TouchableOpacity>
                </ View>

                <View style={[{flex: 1, marginHorizontal: 5}]}>
                  <TouchableOpacity
                    onPress={() => {
                      if (this.props?.route?.params?.route) {
                        this.props.navigation.navigate(`${this.props?.route?.params.route}`)
                      } else {
                        this.props.navigation.goBack()
                      }
                    }}
                  >
                    <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('action.cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </ThemeContainer>
      )
    }

  }
}

OrderForm = reduxForm({
  form: 'neworderForm'
})(OrderForm)

export default OrderForm
