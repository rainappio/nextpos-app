import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {DismissKeyboard} from '../components/DismissKeyboard'
import {getAnnouncements} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import AnnouncementsForm from './AnnouncementsForm'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";
import {backAction} from '../helpers/backActions'

class AnnouncementsAdd extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  handleSubmit = values => {
    dispatchFetchRequest(
      api.announcements.create,
      {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      },
      response => {
        this.props.navigation.navigate('Announcements')
        this.props.getAnnouncements()
      }
    ).then()
  }

  render() {
    const {navigation} = this.props
    const {t} = this.context

    return (
      <ThemeContainer>
        <DismissKeyboard>
          <View style={{...styles.fullWidthScreen, marginLeft: 15, marginRight: 15, }}>
            <ScreenHeader title={t('newAnnouncementTitle')}
              backAction={() => backAction(this.props.navigation)} />

            <AnnouncementsForm
              onSubmit={this.handleSubmit}
              navigation={navigation}
            />
          </View>
        </DismissKeyboard>
      </ThemeContainer>
    )
  }
}

const mapStateToProps = state => ({
  /* printers: state.printers.data.printers,
  workingareas: state.workingareas.data.workingAreas*/
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getAnnouncements: () => dispatch(getAnnouncements())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsAdd)

// export default AnnouncementsAdd
