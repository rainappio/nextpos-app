import React, {useState, useContext, useEffect} from 'react';
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
import TimePeriodPicker from "../components/TimePeriodPicker";
import moment from "moment";
import Modal from 'react-native-modal';
import {Octicons} from '@expo/vector-icons';

/*
   Date   : 2021-01-20
   Author : GGGODLIN
   Content: props
    toggleModal={()=>{}}
    isShowModal={boolen}
                

*/
export const OptionModal = (props) => {
    const localeContext = useContext(LocaleContext);


    useEffect(() => {

    }, [])




    return (
        <>
            <TouchableOpacity
                onPress={() => props?.toggleModal(true)}
            >
                {props?.icon ?? <Octicons name="kebab-horizontal" size={32} color={mainThemeColor} />}
            </TouchableOpacity>
            <Modal
                isVisible={props?.isShowModal ?? false}
                useNativeDriver
                hideModalContentWhileAnimating
                animationIn='fadeInDown'
                animationOut='fadeOutUp'
                onBackdropPress={() => props?.toggleModal(false)}
                style={{
                    margin: 0, flex: 1, justifyContent: 'flex-start'
                }}
            >
                {(localeContext?.isTablet || !!props?.tabletView) ? <View style={[{marginTop: 100, marginRight: 15, alignSelf: 'flex-end'}]}>

                    <View style={[localeContext?.themeStyle, {flexDirection: 'column', borderRadius: 10, padding: 20}]}>
                        {props?.children}
                    </View>
                </View>
                    : <View style={[{width: '100%', alignSelf: 'flex-end'}]}>
                        <View style={[localeContext?.themeStyle, {flexDirection: 'column', paddingBottom: 10, paddingTop: 50, borderBottomRightRadius: 10, borderBottomLeftRadius: 10}]}>
                            {props?.children}
                        </View>
                    </View>}

            </Modal>
        </>
    );
}

