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

class AnnouncementsEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext
  
  state={
		refreshing: false
  }

  handleUpdate = values => {
    const announcementId = this.props.navigation.state.params.announcementId
    this.setState({
    	refreshing: true
    })

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
        successMessage('Saved')
        this.setState({
    			refreshing: false
    		})
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
    makeFetchRequest(token => {
      fetch(api.announcements.delete(announcementId), {
        method: 'DELETE',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        }
      })
        .then(response => {
          if (response.status === 204) {
            successMessage('Deleted')
            this.props.navigation.navigate('Announcements')
            this.props.getAnnouncements()
            this.props.clearAnnouncement(announcementId)
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const { navigation } = this.props
    const { t } = this.context

    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtn />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {t('editAnnouncementTitle')}
            </Text>
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
