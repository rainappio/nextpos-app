import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {Animated, Alert, Text, TouchableOpacity, View} from 'react-native'
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

class RetailStartOrderForm extends Component {
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)

        this.context.localize({
            en: {
                newOrderTitle: 'New Order',
                orderType: 'Order Type',
                ageGroup: 'Age Group',
                visitFrequency: 'Visit Frequency',
                peopleCount: 'People Count',
                openOrder: 'Save Order'
            },
            zh: {
                newOrderTitle: '新訂單',
                orderType: '訂單種類',
                ageGroup: '來客年齡層',
                visitFrequency: '造訪次數',
                peopleCount: '來客數',
                openOrder: '儲存訂單'
            }
        })

        this.state = {
            selectedOrderType: 1,
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
            rightFormSize: new Animated.Value(0),
            isAnimating: false
        }
    }

    componentDidMount() {
        const initialValues = this.props.initialValues;
        const orderType = initialValues.orderType

        if (orderType != null) {

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

        const layoutList = Object.keys(tablesMap)

        if (this?.state?.isTablet) {
            return (
                <ThemeContainer>
                    <View style={styles.fullWidthScreen}>
                        <ScreenHeader backNavigation={true}
                            parentFullScreen={true}
                            title={t('newOrderTitle')}
                        />
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <Animated.View style={{flex: 1}}>



                                {/* <View style={[styles.sectionContent, styles.horizontalMargin]}>
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
                                </View> */}

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


                            </Animated.View>
                            {(this.state.rightFormSize._value === 0 && !this.state.isAnimating) || <Animated.View style={[{flex: this.state.rightFormSize, overflow: "hidden"}]}>
                                <ThemeScrollView>
                                    <View style={{paddingHorizontal: 16}}>
                                        <View style={styles.sectionTitleContainer}>
                                            <StyledText style={styles.sectionTitleText}>{t('table')}</StyledText>
                                        </View>
                                        {noAvailableTables && (
                                            <View style={styles.sectionContent}>
                                                <StyledText>{t('noAvailableTables')}</StyledText>
                                            </View>
                                        )}

                                        {noAvailableTables ||
                                            layoutList?.map((layout) => {
                                                return (
                                                    <View>
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
                                                    `${t('noAvailableTables')}`,
                                                    [
                                                        {
                                                            text: `${t('action.ok')}`,
                                                        }
                                                    ])
                                            }
                                        }}
                                    >
                                        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
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
                <ThemeScrollView>
                    <View style={styles.fullWidthScreen}>
                        <ScreenHeader backNavigation={true}
                            parentFullScreen={true}
                            title={t('newOrderTitle')}
                        />



                        {this.state.selectedOrderType === 0 && Object.keys(tablesMap).length > 0 && (
                            <View style={styles.sectionContent}>
                                <View style={{paddingHorizontal: 16}}>
                                    <View style={styles.sectionTitleContainer}>
                                        <StyledText style={styles.sectionTitleText}>{t('table')}</StyledText>
                                    </View>
                                    {noAvailableTables && (
                                        <View style={styles.sectionContent}>
                                            <StyledText>{t('noAvailableTables')}</StyledText>
                                        </View>
                                    )}

                                    {noAvailableTables ||
                                        layoutList?.map((layout) => {
                                            return (
                                                <View>
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
                                <StyledText>{t('noAvailableTables')}</StyledText>
                            </View>
                        )}


                        {/* <View style={[styles.sectionContent, styles.horizontalMargin]}>
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
                        </View> */}

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
                                        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
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
                                        <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>{t('action.cancel')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </ThemeScrollView>
            )
        }

    }
}

RetailStartOrderForm = reduxForm({
    form: 'neworderForm'
})(RetailStartOrderForm)

export default RetailStartOrderForm
