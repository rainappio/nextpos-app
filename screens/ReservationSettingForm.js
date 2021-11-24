import React from 'react'
import {ScrollView, View, Alert, TouchableOpacity, Text, Share} from 'react-native'
import {Accordion, List} from '@ant-design/react-native'
import {Field, reduxForm} from 'redux-form'
import {connect} from 'react-redux'
import {ListItem, CheckBox} from "react-native-elements";
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeKeyboardAwareScrollView} from "../components/ThemeKeyboardAwareScrollView";
import styles from '../styles'
import {StyledText} from "../components/StyledText";
import {isRequired} from '../validators'
import InputText from '../components/InputText'
import * as Linking from 'expo-linking';
import Icon from 'react-native-vector-icons/Ionicons'


class ReservationSettingForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      nonReservableTables: this.props.initialValues?.nonReservableTables ?? [],
      activeTableLayout: null
    }
  }


  handleReservationLink = (url) => {
    Linking.openURL(url);
    this.props.onPress && this.props.onPress();
  };

  handleChooseTable = (id) => {
    let selectedTables = this.state.nonReservableTables

    if (selectedTables && selectedTables.length !== 0 && (selectedTables.indexOf(id) > -1)) {
      selectedTables.splice(selectedTables.indexOf(id), 1)
      this.props.change(`nonReservableTables`, selectedTables)
      this.setState({nonReservableTables: selectedTables})
    } else {
      this.props.change(`nonReservableTables`, [...selectedTables, id])
      this.setState({nonReservableTables: [...selectedTables, id]})
    }
  }
  handleShareLink = async (link) => {
    try {
      const result = await Share.share({
        title: `${this.context.t(`reservationSetting.webLink`)}`,
        message: link,
      });

      if (result.action === Share.sharedAction) {
        Alert.alert(
          ``,
          `${this.context.t(`reservationSetting.linkShareSuccess`)}`,
          [
            {text: `${this.context.t(`action.confirm`)}`, }
          ]
        )
      } else if (result.action === Share.dismissedAction) {
        Alert.alert(
          ``,
          `${this.context.t(`reservationSetting.linkShareFailed`)}`,
          [
            {text: `${this.context.t(`action.confirm`)}`, }
          ]
        )
      }
    } catch (error) {

      Alert.alert(
        ``,
        `${this.context.t(`action.cancel`)}`,
        [
          {text: `${error.message}`, }
        ]
      )

    }

  }


  render() {
    const {
      handleSubmit,
      initialValues,
      availableTables,
      tablelayouts,
      statusHeight,
      shiftStatus
    } = this.props
    const {t, isTablet, customMainThemeColor, customBackgroundColor} = this.context

    const tablesMap = {}
    let defaultLayouts = []

    if (shiftStatus === 'ACTIVE') {
      availableTables && tablelayouts && tablelayouts.forEach((layout, idx) => {
        const availableTablesOfLayout = availableTables[layout.id]

        if (availableTablesOfLayout !== undefined) {
          tablesMap[layout.layoutName] = tablelayouts?.[idx]?.tables
          defaultLayouts.push(idx)
        }
      })
    } else {
      tablelayouts && tablelayouts.forEach((layout, idx) => {
        tablesMap[layout.layoutName] = tablelayouts?.[idx]?.tables
        defaultLayouts.push(idx)
      })
    }

    const layoutList = Object.keys(tablesMap)
    const noAvailableTables = Object.keys(tablesMap).length === 0


    return (
      <ThemeContainer>
        <View style={[styles.container, {marginTop: 53 - statusHeight}, isTablet && styles.horizontalPaddingScreen]}>
          <ScreenHeader title={t('reservationSetting.reservationSettingTitle')}
            backNavigation={false}
            parentFullScreen={true}
            leftMenuIcon={!isTablet}
          />
          <View style={[styles.flex(4), {marginTop: 20}]}>
            <ThemeKeyboardAwareScrollView>

              <View style={styles.fieldContainer}>
                <View style={[styles.tableCellView, {flex: 2}]}>
                  <StyledText style={styles.fieldTitle}>{t('reservationSetting.webLink')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 2, justifyContent: 'flex-end'}]}>

                  <TouchableOpacity style={[styles.tableCellView, {justifyContent: 'flex-end'}]}
                    onPress={() => this.handleReservationLink(initialValues.reservationLink)}>
                    <View>

                      <StyledText style={{color: customMainThemeColor}}>
                        {initialValues.reservationLink}
                      </StyledText>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.tableCellView, {justifyContent: 'flex-end'}]} onPress={() => this.handleShareLink(initialValues.reservationLink)}>
                    <View style={{marginLeft: 8}}>
                      <Icon name="share-outline" size={24} color={customMainThemeColor} />

                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.fieldContainer}>
                <View style={[styles.tableCellView, {flex: 1}]}>
                  <StyledText style={styles.fieldTitle}>{t('reservationSetting.durationMinutes')}</StyledText>
                </View>
                <View style={[styles.tableCellView, {flex: 1, justifyContent: 'flex-end'}]}>
                  <Field
                    name="durationMinutes"
                    component={InputText}
                    validate={isRequired}
                    placeholder={t('reservationSetting.durationMinutes')}
                  />
                </View>
              </View>

              <View style={[styles.fieldContainer, {marginTop: 12}]}>
                <View style={[styles.tableCellView, {flex: 2}]}>
                  <StyledText style={styles.fieldTitle}>{t('reservationSetting.nonReservableTables')}</StyledText>
                </View>

              </View>
              <View>
                {noAvailableTables && (
                  <View style={[styles.sectionContent]}>
                    <View style={[styles.jc_alignIem_center]}>
                      <StyledText>({t('empty')})</StyledText>
                    </View>
                  </View>
                )}
                <Accordion
                  onChange={(activeSections) => {
                    this.setState({activeTableLayout: activeSections})
                  }}
                  activeSections={this.state?.activeTableLayout ?? defaultLayouts}
                  expandMultiple
                >
                  {layoutList.map((layout, layoutIndex) => {
                    return (
                      <Accordion.Panel
                        key={layoutIndex}
                        header={
                          <View style={[styles.listPanel]}>
                            <View style={[styles.tableCellView, styles.flex(1)]}>
                              <StyledText style={[{color: customMainThemeColor, fontWeight: 'bold'}, styles.listPanelText]}>{layout}
                              </StyledText>
                            </View>
                          </View>
                        }
                      >
                        <List>
                          {tablesMap?.[layout].map((table) => {

                            let isSelected = this.state.nonReservableTables.includes(table.tableId)
                            return (
                              <ListItem
                                key={table?.tableId}
                                onPress={() => {
                                  this.handleChooseTable(table.tableId)
                                }}
                                bottomDivider
                                containerStyle={[styles.dynamicVerticalPadding(5), {backgroundColor: customBackgroundColor},]}
                              >
                                <View style={[styles.tableRowContainer]}>
                                  <View style={[styles.tableCellView]}>
                                    <CheckBox
                                      containerStyle={{margin: 0, padding: 0}}
                                      checkedIcon={'check-circle'}
                                      uncheckedIcon={'circle'}
                                      checked={isSelected}
                                      onPress={() => {
                                        this.handleChooseTable(table.tableId)
                                      }}
                                    >
                                    </CheckBox>
                                  </View>
                                  <View style={[styles.tableCellView]}>
                                    <StyledText>{table?.tableName}</StyledText>
                                  </View>
                                </View>
                              </ListItem>
                            )


                          })}
                          {tablesMap?.[layout].length == 0 && (
                            <ListItem
                              onPress={() => {
                              }}
                              bottomDivider
                              containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                            >
                              <View style={[styles.tableRowContainer]}>
                                <View style={[styles.tableCellView]}>
                                  <StyledText>({t('empty')})</StyledText>
                                </View>
                              </View>
                            </ListItem>
                          )}
                        </List>
                      </Accordion.Panel>
                    )
                  })}
                </Accordion>
              </View>
            </ThemeKeyboardAwareScrollView>
          </View>

          <View style={[styles.bottom, {maxHeight: 120}]}>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                {t('action.save')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() =>
              this.props.navigation.navigate('ReservationUpcomingScreen')
            }>
              <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ThemeContainer >
    )
  }
}

const mapStateToProps = state => ({
})


ReservationSettingForm = reduxForm({
  form: 'reservationSettingForm',
})(
  connect(mapStateToProps)(ReservationSettingForm)
)

export default connect(mapStateToProps, null)(ReservationSettingForm)
