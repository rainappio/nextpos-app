import React from 'react'
import {ScrollView, View, Alert, TouchableOpacity, Text} from 'react-native'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import {ThemeContainer} from "../components/ThemeContainer";
import {StyledText} from "../components/StyledText";
import {ThemeScrollView} from "../components/ThemeScrollView";
import ScreenHeader from "../components/ScreenHeader";
import {connect} from 'react-redux'


class ReservationConfirmScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext
  constructor(props, context) {
    super(props, context)
  }

  render() {

    const {t, customMainThemeColor, customBackgroundColor} = this.context


    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader
            backNavigation={true}
            title={t('reservation.reservationTitle')}
            backAction={() => {
              if (this.props.route?.params?.isEdit) {
                this.props.navigation.navigate('ReservationEditScreen')
              } else {
                this.props.navigation.navigate('ReservationScreen')
              }
            }}
            parentFullScreen={true} />
          <ThemeScrollView>
            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.date')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={[styles.reservationFormContainer]}>{this.props.route?.params?.reservationDate}</StyledText>
              </View>
            </View>
            <View style={[styles.tableRowContainerWithBorder]}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.time')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={[styles.reservationFormContainer]}>{this.props.route?.params?.initialValues?.hour}:{this.props.route?.params?.initialValues?.minutes}</StyledText>
              </View>
            </View>

            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.name')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={[styles.reservationFormContainer]}>{this.props.route?.params?.initialValues?.name}</StyledText>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.phone')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={[styles.reservationFormContainer]}>{this.props.route?.params?.initialValues?.phoneNumber}</StyledText>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.peopleCount')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={[styles.reservationFormContainer]}>{t('reservation.adult')}: {this.props.route.params?.initialValues?.people ?? 0}, {t('reservation.kid')}: {this.props.route?.params?.initialValues?.kid ?? 0}</StyledText>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.otherNote')}</StyledText>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <StyledText style={[styles.reservationFormContainer]}>{this.props.route?.params?.initialValues?.note}</StyledText>
              </View>
            </View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <StyledText style={[styles.reservationFormTitle(customMainThemeColor)]}>{t('reservation.table')}</StyledText>
              </View>
              <View style={[styles.tableCellView, {flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', }]}>
                {!!this.props.route.params?.tableNames.length ? (this.props.route.params?.tableNames).map((name, index) => (
                  <StyledText key={index} style={[styles.reservationFormContainer, {marginBottom: 4}]}>{name} </StyledText>
                )
                )
                  :
                  <StyledText style={[styles.reservationFormContainer]}>{t('reservation.noTable')}</StyledText>
                }
              </View>
            </View>

            <View style={[styles.bottom, styles.horizontalMargin]}>
              <TouchableOpacity onPress={() => {
                this.props.route.params?.handleSaveReservation(this.props.route.params?.isEdit)
              }}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>


              <TouchableOpacity onPress={() => {
                this.props.route.params?.handleCancel()
              }}>
                <Text
                  style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}
                >
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
            </View>

          </ThemeScrollView>
        </View>
      </ThemeContainer>
    )
  }
}


const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  dispatch,
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReservationConfirmScreen)

