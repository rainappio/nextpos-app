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
import CheckBoxGroupObjPick from '../components/CheckBoxGroupObjPick'
import {ThemeContainer} from "../components/ThemeContainer";

const UserSelectModal = (props) => {

    const [modalVisible, setModalVisible] = useState(props?.modalVisible ?? false);

    let initUsersArr = props?.data?.filter((user) => {
        return (
            props?.eventData?.eventResources?.find((item) => user?.username === item?.resourceId)
        )
    })
    const [initUsers, setInitUsers] = useState(initUsersArr.map((user, x) => {
        return {
            optionName: user?.displayName,
            optionValue: user?.username,
            id: x,
            ...user
        }
    }));

    useEffect(() => {
        setModalVisible(props?.modalVisible ?? false);
    }, [props?.modalVisible]);

    useEffect(() => {
        let initUsersArr = props?.data?.filter((user) => {
            return (
                props?.eventData?.eventResources?.find((item) => user?.username === item?.resourceId)
            )
        })
        setInitUsers(initUsersArr.map((user, x) => {
            return {
                optionName: user?.displayName,
                optionValue: user?.username,
                id: x,
                ...user
            }
        }))

    }, [props?.data, props?.eventData]);

    const handleSubmit = values => {
        props?.submitOrder(values?.users?.map((user) => user?.username))

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
                    users: initUsers
                }}
                goBack={props.closeModal}
                data={props?.data}
                eventData={props?.eventData}
            />



        </Modal>




    );
};

class OrderForm extends Component {
    static contextType = LocaleContext

    constructor(props, context) {
        super(props, context)



        this.state = {
        }
    }


    render() {
        const {t} = this.context
        let arrForTrueState = []
        this.props?.data?.map((user, x) => {
            arrForTrueState.push({
                optionName: user?.displayName,
                optionValue: user?.username,
                id: x,
                ...user
            })
        })
        console.log(this.props?.data)


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
                <ThemeContainer >
                    <View style={{
                        alignSelf: 'center',

                    }}>
                        <ScreenHeader backNavigation={true}
                            parentFullScreen={true}
                            title={t('calendarEvent.assign')}
                            backAction={() => {this.props.goBack()}}
                        />

                        <ThemeScrollView style={{flex: 1}}>
                            <Field
                                name={`users`}
                                component={CheckBoxGroupObjPick}
                                customarr={arrForTrueState}
                            />
                        </ThemeScrollView >
                        <View style={[{flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end'}]}>
                            <View style={{flex: 1, marginHorizontal: 5}}>
                                <TouchableOpacity
                                    onPress={() => {this.props.goBack()}}
                                >
                                    <Text style={[styles.bottomActionButton, styles.cancelButton]}>{t('action.cancel')}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{flex: 1, marginHorizontal: 5}}>
                                <TouchableOpacity
                                    onPress={() => this.props.handleSubmit()}
                                >
                                    <Text style={[[styles.bottomActionButton, styles.actionButton]]}>
                                        {t('action.save')}
                                    </Text>
                                </TouchableOpacity>
                            </View>


                        </View>

                    </View>
                </ThemeContainer>
            </View>
        )
    }
}

OrderForm = reduxForm({
    form: 'userSelectModalForm'
})(OrderForm)




export default UserSelectModal;