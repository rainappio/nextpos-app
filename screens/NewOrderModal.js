import React, {useState, useEffect, Component} from "react";
import {Field, reduxForm} from 'redux-form'
import {Alert, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity} from "react-native";
import RenderStepper from '../components/RenderStepper'
import {isRequired} from '../validators'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import PickerInput from "../components/PickerInput";
import SegmentedControl from "../components/SegmentedControl";
import ScreenHeader from "../components/ScreenHeader";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {api, dispatchFetchRequest} from '../constants/Backend';
import Modal from 'react-native-modal';

const NewOrderModal = (props) => {

    const [modalVisible, setModalVisible] = useState(props?.modalVisible ?? false);

    useEffect(() => {
        setModalVisible(props?.modalVisible ?? false);
        console.log("NewOrderModal", JSON.stringify(props?.data));
    }, [props?.modalVisible]);

    const handleSubmit = values => {
        const createOrder = {}
        createOrder.orderType = 'IN_STORE'
        createOrder.tableIds = [props?.data?.table?.tableId]
        createOrder.demographicData = {
            male: values.male,
            female: values.female,
            kid: values.kid,
            ageGroup: values.ageGroup,
            visitFrequency: values.visitFrequency
        }

        dispatchFetchRequest(api.order.new, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(createOrder)
        },
            response => {
                response.json().then(data => {
                    props?.submitOrder(data.orderId)
                })
            }).then()
    }
    return (

        <Modal
            isVisible={modalVisible}
            backdropOpacity={0.7}
            onBackdropPress={() => {props.closeModal()}}
            useNativeDriver
            hideModalContentWhileAnimating
        >

            <OrderForm
                onSubmit={handleSubmit}
                initialValues={{
                    male: 0,
                    female: 0,
                    kid: 0,
                    data: props.data
                }}
                goBack={props.closeModal}
            />



        </Modal>




    );
};

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
        const {t} = this.context

        const orderTypes = Object.keys(this.state.orderTypes).map(key => this.state.orderTypes[key].label)
        const ageGroups = Object.keys(this.state.ageGroups).map(key => this.state.ageGroups[key].label)
        const visitFrequencies = Object.keys(this.state.visitFrequencies).map(key => this.state.visitFrequencies[key].label)

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
            <View style={{
                borderRadius: 10,
                width: '80%',
                height: '90%',
                backgroundColor: '#808080',
                marginTop: 53,
                justifyContent: 'center',
                marginBottom: 53,
                alignSelf: 'center',
                alignItems: 'center'
            }}>
                <ThemeScrollView >
                    <View style={{
                        alignSelf: 'center',

                    }}>
                        <ScreenHeader backNavigation={true}
                            parentFullScreen={true}
                            title={t('newOrderTitle')}
                            backAction={() => {this.props.goBack()}}
                        />

                        <View style={[styles.sectionContent, styles.horizontalMargin]}>
                            <View style={styles.sectionTitleContainer}>
                                <StyledText style={styles.sectionTitleText}>{this.props?.initialValues?.data?.table?.tableName}</StyledText>
                            </View>

                        </View>






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
                                        this.props.goBack()
                                    }}
                                >
                                    <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1, marginHorizontal: 5}}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.props.handleSubmit()

                                    }}
                                >
                                    <Text style={[styles.bottomActionButton, styles.actionButton]}>
                                        {t('openOrder')}
                                    </Text>
                                </TouchableOpacity>
                            </ View>


                        </View>

                    </View>
                </ThemeScrollView>
            </View>
        )
    }
}

OrderForm = reduxForm({
    form: 'neworderForm'
})(OrderForm)




export default NewOrderModal;