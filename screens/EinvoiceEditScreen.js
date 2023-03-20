import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {Text, TouchableOpacity, View} from 'react-native'
import {isNDigitsNumber, isRequired, isTwoBigWords} from '../validators'
import InputText from '../components/InputText'
import styles from '../styles'
import Icon from 'react-native-vector-icons/AntDesign'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import DropDown from "../components/DropDown";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import {StyledText} from "../components/StyledText";
import {api, dispatchFetchRequest} from '../constants/Backend'
import DeleteBtn from '../components/DeleteBtn'
import CustomDropDown from "../components/CustomDropDown";

class EinvoiceEditScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)


        this.state = {
            data: props.route?.params?.data ?? null,
            numberRanges: props.route?.params?.data?.numberRanges ?? [{
                prefix: null,
                rangeFrom: null,
                rangeTo: null,
                remainingInvoiceNumbers: null,
            }],
            numberRangesLength: !!props.route?.params?.data?.numberRanges ? props.route?.params?.data?.numberRanges?.length : 0,
            selectedYear: [
                {label: String(new Date().getFullYear() - 1911), value: String(new Date().getFullYear() - 1911)},
                {label: String(new Date().getFullYear() - 1910), value: String(new Date().getFullYear() - 1910)},
            ],
            selectedMonth: [
                {label: context.t('monthPicker.monthRange1to2'), value: '0102'},
                {label: context.t('monthPicker.monthRange3to4'), value: '0304'},
                {label: context.t('monthPicker.monthRange5to6'), value: '0506'},
                {label: context.t('monthPicker.monthRange7to8'), value: '0708'},
                {label: context.t('monthPicker.monthRange9to10'), value: '0910'},
                {label: context.t('monthPicker.monthRange11to12'), value: '1112'},
            ]
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state;
    }



    handleSubmit = async (values, isEdit) => {
        if (!isEdit) {
            dispatchFetchRequest(api.eInvoice.create, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "ubn": this.props?.client?.attributes?.UBN ?? '',
                    "rangeIdentifier": `${values?.selectedYear ?? ''}${values?.selectedMonth ?? ''}`,
                    "numberRange": {
                        "prefix": values?.prefix ?? '',
                        "rangeFrom": values?.rangeFrom ?? '',
                        "rangeTo": values?.rangeTo ?? ''
                    }
                })
            }, response => {
                response.json().then(data => {
                    this.props.route?.params?.refreshScreen()
                    this.props.navigation.goBack()
                })
            }).then()
        } else {
            let numberRangeArr = []
            this.state.numberRanges.forEach((item, index) => {
                if (item !== undefined && index >= this.state.numberRangesLength) {
                    numberRangeArr.push({
                        "prefix": values[`prefix${index}`] ?? '',
                        "rangeFrom": values[`rangeFrom${index}`] ?? '',
                        "rangeTo": values[`rangeTo${index}`] ?? ''
                    })
                }
            })

            for (let i = 0; i < numberRangeArr.length; i++) {
                const item = numberRangeArr[i]

                await dispatchFetchRequest(api.eInvoice.add(this.state.data?.ubn, this.state.data?.rangeIdentifier), {
                    method: 'POST',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "prefix": item?.prefix ?? '',
                        "rangeFrom": item?.rangeFrom ?? '',
                        "rangeTo": item?.rangeTo ?? '',
                    })
                }, response => {
                    response.json().then(data => {

                    })
                }).then()
            }

            this.props.route?.params?.refreshScreen()
            this.props.navigation.goBack()

        }

    }
    handleDelete = async () => {
        await dispatchFetchRequest(
            api.eInvoice.delete(this.state.data?.ubn, this.state.data?.rangeIdentifier),
            {
                method: 'DELETE',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            },
            response => {

            }
        ).then()
        await this.props.route?.params?.refreshScreen()
        await this.props.navigation.goBack()
    }

    addForm = () => {

        let arr = [...this.state.numberRanges]
        arr.push({
            prefix: null,
            rangeFrom: null,
            rangeTo: null,
            remainingInvoiceNumbers: null,
        })
        this.setState({
            numberRanges: arr
        })

    }

    deleteForm = (index) => {
        if (index < this.state.numberRangesLength) {
            dispatchFetchRequest(
                api.eInvoice.delete(this.state.data?.ubn, this.state.data?.rangeIdentifier, this.state.data?.numberRanges[index]?.rangeFrom),
                {
                    method: 'DELETE',
                    withCredentials: true,
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                },
                response => {
                    let arr = [...this.state.numberRanges]
                    delete arr[index]
                    this.setState({
                        numberRanges: arr
                    })
                }
            ).then()
        } else {
            let arr = [...this.state.numberRanges]
            delete arr[index]
            this.setState({
                numberRanges: arr
            })
        }


    }

    render() {
        const {t, isTablet, customMainThemeColor} = this.context
        const {handleSubmit} = this.props


        return (

            <ThemeKeyboardAwareScrollView>
                <View style={[styles.container, isTablet && styles.horizontalPaddingScreen]}>
                    <View style={{flex: 7}}>
                        <ScreenHeader title={t('eInvoice.eInvoiceTitle')} />
                        {!this.state.data && <View style={{height: 100}}><View style={[{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 2,
                            marginBottom: 5,
                            flex: 1
                        }]}>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                                <StyledText style={styles.fieldTitle}>{t('eInvoice.prefixYear')}</StyledText>
                            </View>
                            <View style={[styles.justifyRight]}>
                                <Field
                                    name="selectedYear"
                                    component={CustomDropDown}
                                    options={this.state.selectedYear}
                                    placeholder={t('eInvoice.prefixYear')}
                                    //defaultValue={this.state.selectedYear[0]}
                                />
                            </View>
                        </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginTop: 2,
                                marginBottom: 5,
                                flex: 1
                            }}>
                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                    <StyledText style={styles.fieldTitle}>{t('eInvoice.prefixMonth')}</StyledText>
                                </View>
                                <View style={[styles.justifyRight]}>
                                    <Field
                                        name="selectedMonth"
                                        component={CustomDropDown}
                                        options={this.state.selectedMonth}
                                        placeholder={t('eInvoice.prefixMonth')}
                                          //defaultValue={this.state.selectedMonth[0]}
                                    />
                                </View>
                            </View></View>}
                        {!!this.state.data && <>
                            <View style={{
                                paddingVertical: 12,
                                paddingHorizontal: 10,
                                flexDirection: 'row'
                            }}>
                                <StyledText style={{flex: 1, textAlign: 'left'}}>{t('eInvoice.rangeIdentifier')}</StyledText>
                                <StyledText style={{flex: 1, textAlign: 'right'}}>{this.state?.data?.rangeIdentifier}</StyledText>
                            </View>
                        </>}
                        {!!this.state.data && <View style={{flexDirection: 'row', alignSelf: 'center', justifyContent: 'space-between', width: 74, marginVertical: 10}}>
                            <Icon
                                name="pluscircleo"
                                size={32}
                                color={'gray'}
                                onPress={() => {
                                    this.addForm()
                                }}
                            />
                        </View>}
                        <View>
                            {!this.state.data &&

                                <View style={{flex: 15, flexDirection: 'column'}}>
                                    <View style={styles.fieldContainer}>
                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                            <StyledText style={styles.fieldTitle}>{t('eInvoice.prefix')}</StyledText>
                                        </View>
                                        <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                            <Field
                                                name={`prefix`}
                                                component={InputText}
                                                validate={[isRequired, isTwoBigWords]}
                                            //editable={false}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                            <StyledText style={styles.fieldTitle}>{t('eInvoice.rangeFrom')}</StyledText>
                                        </View>
                                        <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                            <Field
                                                name={`rangeFrom`}
                                                component={InputText}
                                                validate={[isRequired, isNDigitsNumber(8)]}
                                            //editable={false}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.fieldContainer}>
                                        <View style={[styles.tableCellView, {flex: 1}]}>
                                            <StyledText style={styles.fieldTitle}>{t('eInvoice.rangeTo')}</StyledText>
                                        </View>
                                        <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                            <Field
                                                name={`rangeTo`}
                                                component={InputText}
                                                validate={[isRequired, isNDigitsNumber(8)]}
                                            //editable={false}
                                            />
                                        </View>
                                    </View>


                                </View>}
                            {!!this.state.data && this.state.numberRanges?.map((item, index) => {
                                if (item === undefined)
                                    return null
                                return (<View style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 10,
                                    borderColor: '#e7e7e7',
                                    borderBottomWidth: 1,
                                    flexDirection: 'row'
                                }}>

                                    <View style={{flex: 15, flexDirection: 'column'}}>
                                        <View style={styles.fieldContainer}>
                                            <View style={[styles.tableCellView, {flex: 1}]}>
                                                <StyledText style={styles.fieldTitle}>{t('eInvoice.prefix')}</StyledText>
                                            </View>
                                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                                <Field
                                                    name={`prefix${index}`}
                                                    component={InputText}
                                                    validate={index <= this.state.numberRangesLength - 1 ? undefined : [isRequired, isTwoBigWords]}
                                                    defaultValue={item?.prefix ?? null}
                                                    editable={index <= this.state.numberRangesLength - 1 ? false : true}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.fieldContainer}>
                                            <View style={[styles.tableCellView, {flex: 1}]}>
                                                <StyledText style={styles.fieldTitle}>{t('eInvoice.rangeFrom')}</StyledText>
                                            </View>
                                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                                <Field
                                                    name={`rangeFrom${index}`}
                                                    component={InputText}
                                                    validate={index <= this.state.numberRangesLength - 1 ? undefined : [isRequired, isNDigitsNumber(8)]}
                                                    defaultValue={item?.rangeFrom ?? null}
                                                    editable={index <= this.state.numberRangesLength - 1 ? false : true}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.fieldContainer}>
                                            <View style={[styles.tableCellView, {flex: 1}]}>
                                                <StyledText style={styles.fieldTitle}>{t('eInvoice.rangeTo')}</StyledText>
                                            </View>
                                            <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                                                <Field
                                                    name={`rangeTo${index}`}
                                                    component={InputText}
                                                    validate={index <= this.state.numberRangesLength - 1 ? undefined : [isRequired, isNDigitsNumber(8)]}
                                                    defaultValue={item?.rangeTo ?? null}
                                                    editable={index <= this.state.numberRangesLength - 1 ? false : true}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{marginLeft: 10, alignItems: 'center', justifyContent: 'center'}}>
                                        <Icon
                                            name="minuscircleo"
                                            size={32}
                                            color={'gray'}
                                            onPress={() => {
                                                this.deleteForm(index)
                                            }}
                                        />
                                    </View>
                                </View>)
                            })}


                        </View>

                    </View>









                    <View style={[styles.bottom, {marginTop: 30, justifyContent: 'flex-end', flex: 1}]}>
                        <TouchableOpacity onPress={handleSubmit(data => {
                            this.handleSubmit(data, !!this.state.data)
                        })}>
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                                {t('action.save')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                                {t('action.cancel')}
                            </Text>
                        </TouchableOpacity>
                        {!!this.state.data && <DeleteBtn handleDeleteAction={() => this.handleDelete()} />}
                    </View>
                </View>
            </ThemeKeyboardAwareScrollView>

        )
    }
}

const mapStateToProps = state => ({
    isLoading: state.offers.loading,
    client: state.client.data,
})

const mapDispatchToProps = dispatch => ({
    dispatch,
    getCurrentClient: () => dispatch(getCurrentClient())
})

EinvoiceEditScreen = reduxForm({
    form: 'eInvoiceForm'
})(EinvoiceEditScreen)

export default connect(mapStateToProps, mapDispatchToProps)(EinvoiceEditScreen)
