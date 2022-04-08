import React, {useState, useContext, useEffect} from 'react';
import {Text, TouchableOpacity, View, StyleSheet} from 'react-native'
import {StyledText} from "./StyledText";
import {LocaleContext} from '../locales/LocaleContext'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements';
import {api, dispatchFetchRequestWithOption} from '../constants/Backend'
import {ThemeScrollView} from "../components/ThemeScrollView";


/*
   Date   : 2020-09-15
   Author : GGGODLIN
   Content: props
                initialValue={number}
                getResult={(result)=>{}}
                okPress={()=>{}}
                value={number}

*/
export const MoneyKeyboard = (props) => {
    const localeContext = useContext(LocaleContext);
    const {customMainThemeColor, customSecondThemeColor, customBackgroundColor} = localeContext

    const [Output, setOutput] = useState(props?.initialValue ?? 0);

    useEffect(() => {
        setOutput(props?.value)

    }, [props?.value ?? null])

    const numberOutput = (result) => {
        !!props?.getResult ? props?.getResult(result) : console.warn("need getResult()")
    }
    const handlePaperPress = (number) => {
        setOutput(Output + number);
        numberOutput(Output + number);
    }
    const handleNumberPress = (number) => {
        if (number === 100) {
            setOutput(Output * 100);
            numberOutput(Output * 100);
        } else {
            setOutput(Output * 10 + number);
            numberOutput(Output * 10 + number);
        }
    }
    const handleCleanPress = () => {
        setOutput(0);
        numberOutput(0);
    }
    const handleDeletePress = () => {
        setOutput(Math.floor(Output / 10));
        numberOutput(Math.floor(Output / 10));
    }
    const handleOkPress = () => {
        !!props?.okPress ? props?.okPress() : console.warn("need okPress()")
    }


    return (
        <View style={{
            backgroundColor: customBackgroundColor,
            margin: '5%',
            borderRadius: 10,
            flex: 1,

            alignItems: 'center'
        }}>
            <View style={styles.keyboardRowContainer}>
                <TouchableOpacity onPress={() => handlePaperPress(100)} style={styles.paperMoney('#ffc0cb')}>
                    <Text style={{color: '#ffc0cb'}}>100</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePaperPress(500)} style={styles.paperMoney('#D59A9B')}>
                    <Text style={{color: '#D59A9B'}}>500</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handlePaperPress(1000)} style={styles.paperMoney('#96CCD9')}>
                    <Text style={{color: '#96CCD9'}}>1000</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 3, width: '100%', justifyContent: 'space-between'}}>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(1)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(2)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(3)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>3</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(4)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(5)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(6)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>6</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(7)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(8)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(9)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>9</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(0)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(100)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>00</Text>
                    </TouchableOpacity>
                    <View style={{width: '25%', }}></View>
                </View>
            </View>
            <View style={styles.keyboardRowContainer}>
                <TouchableOpacity onPress={() => handleCleanPress()} style={styles.buttomButton}>
                    <Text style={styles.secondColorButton(customSecondThemeColor)}>{localeContext.t('keyboardAction.clean')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeletePress()} style={styles.buttomButton}>
                    <Icon name="backspace" size={48} color={customSecondThemeColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleOkPress()} style={styles.buttomButton}>
                    <Text style={styles.secondColorButton(customSecondThemeColor)}>{localeContext.t('keyboardAction.ok')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/*
   Date   : 2020-09-18
   Author : GGGODLIN
   Content: props
                initialValue={number}
                okPress={()=>{}}
                title={""}
                globalorderoffers
                order

*/
export const DiscountKeyboard = (props) => {
    const localeContext = useContext(LocaleContext);
    const {customMainThemeColor, customSecondThemeColor, customBackgroundColor} = localeContext
    const [Output, setOutput] = useState(props?.initialValue ?? 0);
    const [KeyboardStatus, setKeyboardStatus] = useState(1);
    const [SelectedLabel, setSelectedLabel] = useState('');
    const [DiscountObj, setDiscountObj] = useState({
        offerId: 'NO_DISCOUNT',
        orderDiscount: 'NO_DISCOUNT',
        discount: -1,
    });

    const handleBackPress = () => {
        setKeyboardStatus(1)
        setSelectedLabel('')
        setDiscountObj({
            offerId: 'NO_DISCOUNT',
            orderDiscount: 'NO_DISCOUNT',
            discount: -1,
        })
        setOutput(0)
    }
    const handleNumberPress = (number) => {
        if (number === 100) {
            setOutput(Output * 100);
        } else {
            setOutput(Output * 10 + number);
        }
    }
    const handleCleanPress = () => {
        setOutput(0);
    }
    const handleDeletePress = () => {
        setOutput(Math.floor(Output / 10));
    }
    const handleOkPress = async () => {
        const url = api.order.applyDiscount(props?.order?.orderId)
        await dispatchFetchRequestWithOption(url, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...DiscountObj, discount: Output, })

        }, {
            defaultMessage: false
        }, response => {
        }).then(() => {
            !!props?.okPress ? props?.okPress() : console.warn("need okPress()")
        })
    }
    const handleLabelPress = async (name, label) => {
        console.log('label', JSON.stringify(label))

        const labelName = label?.discountValue <= 0 ? localeContext.t(`offer.${label?.offerId}`) : label?.offerName
        setSelectedLabel(labelName);

        if (name === "NO_DISCOUNT") {
            const url = api.order.removeDiscount(props?.order?.orderId)

            await dispatchFetchRequestWithOption(url, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(-1)

            }, {
                defaultMessage: false
            }, response => {
            }).then(() => {
                !!props?.okPress ? props?.okPress() : console.warn("need okPress()")
            })
        } else if (name === 'FULL_DISCOUNT') {
          const url = api.order.applyFullDiscount(props?.order?.orderId)

          await dispatchFetchRequestWithOption(url, {
            method: 'POST',
            withCredentials: true,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          }, {
            defaultMessage: false
          }, response => {
          }).then(() => {
            !!props?.okPress ? props?.okPress() : console.warn("need okPress()")
          })
        } else if (label?.discountValue === 0) {

            setDiscountObj({
                offerId: label.offerId,
                orderDiscount: label.offerId,
                discount: 0,
            })
            setOutput(0)
            setKeyboardStatus(2)
        } else {
            const url = api.order.applyDiscount(props?.order?.orderId)
            await dispatchFetchRequestWithOption(url, {
                method: 'POST',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    offerId: label.offerId,
                    orderDiscount: label.offerId,
                    discount: label.discountValue
                })

            }, {
                defaultMessage: false
            }, response => {
            }).then(() => {
                !!props?.okPress ? props?.okPress() : console.warn("need okPress()")
            })
        }
    }

    if (KeyboardStatus === 1) {
        return (
            <View style={{
                backgroundColor: customBackgroundColor,
                flex: 1,
                alignItems: 'center'
            }}>
                {props?.title && <Text style={{fontSize: 28, fontWeight: 'bold'}}>{props?.title}</Text>}
                <ThemeScrollView style={{flex: 1}}>
                    {props?.globalorderoffers?.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            backgroundColor: customBackgroundColor,
                            flex: 1,
                            justifyContent: 'center',
                            marginVertical: '2%'
                          }}>
                            <Button
                                title={item?.discountValue <= 0 ? localeContext.t(`offer.${item?.offerId}`) : item?.offerName}
                                raised
                                containerStyle={{
                                  justifyContent: 'center',
                                  borderRadius: 10,
                                  width: '100%',
                                }}
                                buttonStyle={{
                                  flex: 1,
                                  width: '100%',
                                  margin: 0,
                                  borderRadius: 10,
                                  backgroundColor: customMainThemeColor,
                                  paddingVertical: '10%'
                                }}
                                onPress={() => {
                                    handleLabelPress(item?.offerId, item)
                                }}

                            />
                        </View>
                    )
                    )}

                </ThemeScrollView>
            </View>
        );
    }
    if (KeyboardStatus === 2) {
        return (
            <View style={{
                backgroundColor: customBackgroundColor,
                margin: '5%',
                borderRadius: 10,
                flex: 1,

                alignItems: 'center'
            }}>
                <View style={styles.keyboardRowContainer}>
                    <Text>{`${SelectedLabel} : ${Output}`}</Text>
                </View>
                <View style={{flex: 3, width: '100%', justifyContent: 'space-between'}}>
                    <View style={styles.numberRowContainer}>
                        <TouchableOpacity onPress={() => handleNumberPress(1)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>1</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNumberPress(2)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNumberPress(3)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>3</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.numberRowContainer}>
                        <TouchableOpacity onPress={() => handleNumberPress(4)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>4</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNumberPress(5)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>5</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNumberPress(6)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>6</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.numberRowContainer}>
                        <TouchableOpacity onPress={() => handleNumberPress(7)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>7</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNumberPress(8)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>8</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNumberPress(9)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>9</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.numberRowContainer}>
                        <TouchableOpacity onPress={() => handleNumberPress(0)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>0</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleNumberPress(100)} style={styles.numderButton(customMainThemeColor)}>
                            <Text style={styles.cardNumberText(customMainThemeColor)}>00</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleCleanPress()} style={styles.buttomButton}>
                            <Text style={styles.secondColorButton(customSecondThemeColor)}>{localeContext.t('keyboardAction.clean')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.keyboardRowContainer}>
                    <TouchableOpacity onPress={() => handleBackPress()} style={styles.buttomButton}>
                        <Text style={styles.secondColorButton(customSecondThemeColor)}>{localeContext.t('keyboardAction.back')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress()} style={styles.buttomButton}>
                        <Icon name="backspace" size={48} color={customSecondThemeColor} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleOkPress()} style={styles.buttomButton}>
                        <Text style={styles.secondColorButton(customSecondThemeColor)}>{localeContext.t('keyboardAction.ok')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

}

/*
   Date   : 2020-09-16
   Author : GGGODLIN
   Content: props
                initialValue={array[4]}
                getResult={(result)=>{}}
                okPress={(result)=>{}}
                value={array[4]}

*/
export const CardFourNumberKeyboard = (props) => {
    const localeContext = useContext(LocaleContext);
    const {customMainThemeColor, customSecondThemeColor, customBackgroundColor} = localeContext
    const [Output, setOutput] = useState(props?.initialValue ?? ['', '', '', '']);
    const [Index, setIndex] = useState(0);

    useEffect(() => {
        setOutput(props?.value)
        if (props?.value?.length === 0)
            setIndex(props?.value?.length)
    }, [props?.value ?? null])

    const numberOutput = (result) => {
        !!props?.getResult ? props?.getResult(result) : console.warn("need getResult()")
    }

    const handleNumberPress = (number) => {
        if (Index < 4) {
            let array = [...Output]
            array[Index] = number;
            setOutput(array);
            setIndex(Index + 1);
            numberOutput(array);
        }

    }
    const handleCleanPress = () => {
        setOutput(['', '', '', '']);
        setIndex(0);
        numberOutput(['', '', '', '']);
    }
    const handleDeletePress = () => {
        if (Index > 0) {
            let array = [...Output]
            array[Index - 1] = '';
            setOutput(array);
            setIndex(Index > 0 ? (Index - 1) : 0);
            numberOutput(array);
        }

    }
    const handleOkPress = () => {
        !!props?.okPress ? props?.okPress() : console.warn("need okPress()")
    }


    return (
        <View style={[{
            backgroundColor: customBackgroundColor,
            margin: '5%',
            borderRadius: 10,
            flex: 1,
            borderWidth: 1,
            alignItems: 'center'
        }]}>
            <View style={styles.cardKeyboardRowContainer}>
                <TouchableOpacity onPress={() => {setIndex(0)}} style={styles.cardNumberInput(Index === 0, customMainThemeColor)}>
                    <Text >{Output[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setIndex(1)}} style={styles.cardNumberInput(Index === 1, customMainThemeColor)}>
                    <Text >{Output[1]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setIndex(2)}} style={styles.cardNumberInput(Index === 2, customMainThemeColor)}>
                    <Text >{Output[2]}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {setIndex(3)}} style={styles.cardNumberInput(Index === 3, customMainThemeColor)}>
                    <Text >{Output[3]}</Text>
                </TouchableOpacity>
            </View>
            <View style={{flex: 4, width: '100%', justifyContent: 'space-evenly'}}>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(1)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(2)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(3)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>3</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(4)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(5)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(6)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>6</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(7)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(8)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(9)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>9</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleCleanPress()} style={styles.buttomButton}>
                        <Text style={styles.secondColorButton(customSecondThemeColor)}>{localeContext.t('keyboardAction.clean')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(0)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress()} style={styles.buttomButton}>
                        <Icon name="backspace" size={48} color={customSecondThemeColor} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

/*
   Date   : 2020-09-16
   Author : GGGODLIN
   Content: props
                title={""}
                digit={number}
                initialValue={array[digit]}
                getResult={(result)=>{}}
                okPress={(result)=>{}}
                value={array[digit]}

*/
export const CustomTitleAndDigitKeyboard = (props) => {
    const localeContext = useContext(LocaleContext);
    const {customMainThemeColor, customSecondThemeColor, customBackgroundColor} = localeContext

    const [Output, setOutput] = useState(props?.initialValue ?? ['', '', '', '']);
    const [Index, setIndex] = useState(props?.value ? props?.value?.length : 0);
    const [Digit, setDigit] = useState(props?.digit ?? 8);

    useEffect(() => {
        setOutput(props?.value)

    }, [props?.value ?? null])

    const numberOutput = (result) => {
        !!props?.getResult ? props?.getResult(result) : console.warn("need getResult()")
    }

    const handleNumberPress = (number) => {
        if (Index < Digit) {
            let array = [...Output]
            array[Index] = number;
            setOutput(array);
            setIndex(Index + 1);
            numberOutput(array);
        }

    }
    const handleCleanPress = () => {
        setOutput(new Array(Digit));
        setIndex(0);
        numberOutput(new Array(Digit));
    }
    const handleDeletePress = () => {
        if (Index > 0) {
            let array = [...Output]
            array[Index - 1] = '';
            setOutput(array);
            setIndex(Index > 0 ? (Index - 1) : 0);
            numberOutput(array);
        }

    }
    const handleOkPress = () => {
        !!props?.okPress ? props?.okPress() : console.warn("need okPress()")
    }


    return (
        <View style={{
            backgroundColor: customBackgroundColor,
            margin: '5%',
            borderRadius: 10,
            flex: 1,

            alignItems: 'center'
        }}>
            <View style={styles.cardKeyboardRowContainer}>
                <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{fontSize: 28, fontWeight: 'bold'}}>{props?.title ?? 'title'}</Text>
                </View>
            </View>
            <View style={{flex: 4, width: '100%', justifyContent: 'space-evenly'}}>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(1)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(2)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>2</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(3)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>3</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(4)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(5)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>5</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(6)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>6</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleNumberPress(7)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>7</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(8)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>8</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(9)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>9</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.numberRowContainer}>
                    <TouchableOpacity onPress={() => handleCleanPress()} style={styles.buttomButton}>
                        <Text style={styles.secondColorButton(customSecondThemeColor)}>{localeContext.t('keyboardAction.clean')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleNumberPress(0)} style={styles.numderButton(customMainThemeColor)}>
                        <Text style={styles.cardNumberText(customMainThemeColor)}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeletePress()} style={styles.buttomButton}>
                        <Icon name="backspace" size={48} color={customSecondThemeColor} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16
    },
    keyboardRowContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '15%',
    },
    cardKeyboardRowContainer: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: '15%',
    },
    numberRowContainer: {

        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '15%',
    },
    numderButton: (color = '#000') => ({
        width: '25%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 1000,
        borderColor: color
    }),
    paperMoney: color => {
        return {
            width: '25%',
            aspectRatio: 1.618,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 3,
            borderColor: color,
            borderRadius: 3
        }
    },
    buttomButton: {
        width: '25%',
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardNumberInput: (isFocus, color = '#000') => {
        if (isFocus) {
            return {
                width: '20%',
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomWidth: 2,
                borderColor: color
            }
        } else {
            return {
                width: '20%',
                aspectRatio: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderBottomWidth: 1,
                borderColor: 'gray'
            }
        }
    },
    cardNumberText: (color = '#000') => ({
        color: color
    }),
    secondColorButton: (color = '#000') => ({
        color: color,
        fontSize: 20,
    })
});


/*
   Date   : 2021-05-24
   Author : Loxi
   Content: props
                initialValue={null}
                getResult={()=>{}}
                title={""}
                client

*/
export const MobilePayKeyboard = (props) => {
    const localeContext = useContext(LocaleContext);
    const {t, customMainThemeColor, customBackgroundColor} = localeContext

    const mobilePayList = props?.client.paymentMethods.filter((item) => item.paymentKey !== 'CARD' && item.paymentKey !== 'CASH')
    mobilePayList.sort((a, b) => {
        let sort = ["LINE_PAY", "JKO", "UBER_EATS", "FOOD_PANDA", "GOV_VOUCHER"];
        return sort.indexOf(a.paymentKey) - sort.indexOf(b.paymentKey);
    })

    const labelNameOutput = (result) => {
        !!props?.getResult ? props?.getResult(result) : console.warn("need getResult()")
    }

    return (
        <View style={{
            backgroundColor: customBackgroundColor,
            margin: '5%',
            borderRadius: 10,
            flex: 1,

            paddingVertical: '10%',
            alignItems: 'center'
        }}>
            {props?.title && <Text style={{fontSize: 28, fontWeight: 'bold'}}>{props?.title}</Text>}

            {!!mobilePayList.length ?
                <>
                    {mobilePayList.map((item) => (

                        <Button
                            key={item?.id}
                            title={t(`settings.paymentMethods.${item?.paymentKey}`)}
                            raised
                            containerStyle={{
                                marginVertical: '5%',
                                padding: 0,
                                justifyContent: 'center',
                                height: '10%',
                                flexDirection: 'row'
                            }}
                            buttonStyle={{
                                flex: 1,
                                width: '100%',
                                margin: 0,
                                borderRadius: 10,
                                backgroundColor: customMainThemeColor,
                            }}
                            onPress={() => {
                                labelNameOutput(item?.paymentKey)
                            }}

                        />
                    )
                    )
                    }
                </>
                :
                <View style={[{marginTop: 28}]}>
                    <StyledText style={[{color: customMainThemeColor, fontSize: 24}]}>
                        {t('payment.mobilePaymentNoSet')}

                    </StyledText>
                </View>
            }
        </View>
    )

}
