import React, {useState, useEffect, Component, useContext} from "react";
import {Field, reduxForm, formValues} from 'redux-form'
import {Alert, StyleSheet, Text, TouchableHighlight, View, TouchableOpacity} from "react-native";
import RenderStepper from '../components/RenderStepper'
import {isRequired} from '../validators'
import styles, {mainThemeColor} from '../styles'
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
import {Accordion, List} from '@ant-design/react-native'
import {CheckBox} from 'react-native-elements'
import {ListItem} from "react-native-elements";

let UserSelectModal = (props) => {
    //console.log('UserSelectModal', props?.eventData, props?.data)
    const localeContext = useContext(LocaleContext);
    const [modalVisible, setModalVisible] = useState(props?.modalVisible ?? false)
    const [activeSections, setActiveSections] = useState([])
    const [labels, setLabels] = useState(props?.labels?.map((label) => {return ({labelName: label?.name, resources: props?.data?.map((user) => {return {...user, isSelected: props?.eventData?.eventResources?.[`${label?.name}`]?.find((eventResource) => eventResource?.resourceId === user?.username)}})})}))




    useEffect(() => {
        setLabels(props?.labels?.map((label) => {return ({labelName: label?.name, resources: props?.data?.map((user) => {return {...user, isSelected: props?.eventData?.eventResources?.[`${label?.name}`]?.find((eventResource) => eventResource?.resourceId === user?.username)}})})}))
    }, [props?.labels]);

    useEffect(() => {
        setModalVisible(props?.modalVisible ?? false);
    }, [props?.modalVisible]);



    const handleSubmit = () => {
        let request = {
            workingAreaToUsernames: {

            }
        }
        labels.forEach((label) => {
            let users = label?.resources?.filter((user, userIndex) => user?.isSelected)

            if (users?.length > 0) {
                request.workingAreaToUsernames.[`${label?.labelName}`] = users?.map((item) => {return item?.username})
            }
        })
        props?.submitOrder(request)

    }
    return (

        <Modal
            isVisible={modalVisible}
            backdropOpacity={0.7}
            onBackdropPress={() => {props.closeModal()}}
            useNativeDriver
            hideModalContentWhileAnimating
            style={{maxWidth: 640, alignSelf: 'center'}}
        >

            {/* <OrderForm
                onSubmit={handleSubmit}
                initialValues={{
                    users: initUsers
                }}
                goBack={props.closeModal}
                data={props?.data}
                eventData={props?.eventData}
            /> */}
            <ThemeContainer >
                <View style={{
                    alignSelf: 'center',
                    flex: 1
                }}>
                    <ScreenHeader backNavigation={true}
                        parentFullScreen={true}
                        title={localeContext.t('calendarEvent.assign')}
                        backAction={() => props.closeModal()}
                    />
                    <ThemeScrollView style={{flex: 1}}>
                        <Accordion
                            onChange={setActiveSections}
                            activeSections={activeSections}
                            expandMultiple
                        //duration={300}
                        >
                            {labels.map((label, labelIndex) => {
                                return (
                                    <Accordion.Panel

                                        header={
                                            <View style={[styles.listPanel]}>
                                                <View style={[styles.tableCellView, styles.flex(1)]}>
                                                    <StyledText style={[{color: mainThemeColor, fontWeight: 'bold'}, styles.listPanelText]}>{label?.labelName} ({label?.resources?.filter((item) => item?.isSelected).length})</StyledText>
                                                </View>

                                            </View>
                                        }
                                    >

                                        <List>
                                            {label?.resources?.map((user, userIndex) => (
                                                <ListItem
                                                    title={
                                                        <View style={[styles.tableRowContainer]}>
                                                            <View style={[styles.tableCellView]}>
                                                                <CheckBox
                                                                    containerStyle={{margin: 0, padding: 0}}
                                                                    checkedIcon={'check-circle'}
                                                                    uncheckedIcon={'circle'}
                                                                    checked={user?.isSelected}
                                                                    onPress={() => {
                                                                        let tempLabels = [...labels]
                                                                        tempLabels[labelIndex].resources[userIndex].isSelected = !tempLabels[labelIndex].resources[userIndex].isSelected
                                                                        setLabels(tempLabels)
                                                                    }}
                                                                >
                                                                </CheckBox>
                                                            </View>
                                                            <View style={[styles.tableCellView]}>
                                                                <StyledText>{user?.username}</StyledText>
                                                            </View>

                                                        </View>
                                                    }
                                                    onPress={() => {
                                                        let tempLabels = [...labels]
                                                        tempLabels[labelIndex].resources[userIndex].isSelected = !tempLabels[labelIndex].resources[userIndex].isSelected
                                                        setLabels(tempLabels)
                                                    }}
                                                    bottomDivider
                                                    containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: localeContext.themeStyle.backgroundColor},]}
                                                />
                                            ))}
                                            {label?.resources?.length === 0 && (
                                                <ListItem
                                                    title={
                                                        <View style={[styles.tableRowContainer]}>
                                                            <View style={[styles.tableCellView]}>
                                                                <StyledText>({localeContext.t('empty')})</StyledText>
                                                            </View>
                                                        </View>
                                                    }
                                                    onPress={() => {

                                                    }}
                                                    bottomDivider
                                                    containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: localeContext.themeStyle.backgroundColor},]}
                                                />
                                            )}
                                        </List>

                                    </Accordion.Panel>
                                )
                            })}
                        </Accordion>
                    </ThemeScrollView>
                </View>
                <View style={[{flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'flex-end', alignItems: 'flex-end'}]}>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                        <TouchableOpacity
                            onPress={() => props.closeModal()}
                        >
                            <Text style={[styles.bottomActionButton, styles.cancelButton]}>{localeContext.t('action.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 1, marginHorizontal: 5}}>
                        <TouchableOpacity
                            onPress={() => handleSubmit()}
                        >
                            <Text style={[[styles.bottomActionButton, styles.actionButton]]}>
                                {localeContext.t('action.save')}
                            </Text>
                        </TouchableOpacity>
                    </View>


                </View>
            </ThemeContainer>


        </Modal>




    );
};

export default UserSelectModal;