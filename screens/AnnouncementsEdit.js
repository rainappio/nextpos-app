import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {DismissKeyboard} from '../components/DismissKeyboard'
import {clearAnnouncement, getAnnouncements} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import AnnouncementsForm from './AnnouncementsForm'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {backAction} from '../helpers/backActions'

class AnnouncementsEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  handleUpdate = values => {
    const announcementId = this.props.route.params.announcementId

    dispatchFetchRequest(
      api.announcements.update(announcementId),
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
        this.props.getAnnouncements(announcementId)
      }
    ).then()
  }

  handleEditCancel = () => {
    this.props.clearAnnouncement(
      this.props.route.params.announcementId
    )
    this.props.getAnnouncements()
    this.props.navigation.navigate('Announcements')
  }

  handleDelete = id => {
    const announcementId = this.props.route.params.announcementId
    dispatchFetchRequest(api.announcements.delete(announcementId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, response => {
      this.props.navigation.navigate('Announcements')
      this.props.getAnnouncements()
      this.props.clearAnnouncement(announcementId)
    }).then()
  }

  render() {
    const {navigation, route} = this.props
    const {t, isTablet} = this.context

    return (
      <ThemeScrollView>
        <DismissKeyboard>
          <View style={[styles.container, isTablet && styles.horizontalPaddingScreen]}>
            <ScreenHeader title={t('editAnnouncementTitle')}
              backAction={() => backAction(this.props.navigation)}
            />

            <AnnouncementsForm
              isEdit={true}
              initialValues={this.props.route.params.initialValues}
              onSubmit={this.handleUpdate}
              handleEditCancel={this.handleEditCancel}
              handleDelete={this.handleDelete}
              navigation={navigation}
              route={route}
            />
          </View>
        </DismissKeyboard>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  announcement: state.announcement.data
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getAnnouncements: () => dispatch(getAnnouncements()),
  clearAnnouncement: () => dispatch(clearAnnouncement())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsEdit)
