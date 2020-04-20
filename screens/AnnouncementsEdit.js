import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import {
  getAnnouncement,
  getAnnouncements,
  clearAnnouncement
} from '../actions'
import {
  api,
  errorAlert,
  dispatchFetchRequest,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import AnnouncementsForm from './AnnouncementsForm'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";
import ScreenHeader from "../components/ScreenHeader";

class AnnouncementsEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  handleUpdate = values => {
    const announcementId = this.props.navigation.state.params.announcementId

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
      this.props.navigation.state.params.announcementId
    )
    this.props.getAnnouncements()
    this.props.navigation.navigate('Announcements')
  }

  handleDelete = id => {
    const announcementId = this.props.navigation.state.params.announcementId
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
    const { navigation } = this.props
    const { t } = this.context

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
          <View style={styles.container}>
            <ScreenHeader title={t('editAnnouncementTitle')}/>

            <AnnouncementsForm
              isEdit={true}
              initialValues={this.props.navigation.state.params.initialValues}
              onSubmit={this.handleUpdate}
              handleEditCancel={this.handleEditCancel}
              handleDelete={this.handleDelete}
              navigation={navigation}
            />
          </View>
        </DismissKeyboard>
      </ScrollView>
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
