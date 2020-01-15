import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import WorkingAreaForm from './WorkingAreaForm'
import {
  api,
  errorAlert,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import { getWorkingAreas, getPrinters } from '../actions'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";

class WorkingAreaAdd extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props);

    this.state = {
      t: context.t
    }
  }

  handleSubmit = values => {
    makeFetchRequest(token => {
      fetch(api.workingarea.create, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            successMessage('Saved')
            this.props.navigation.navigate('PrinternKDS')
            this.props.getWorkingAreas()
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
    const { t } = this.state

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <BackBtn/>
          <Text style={styles.screenTitle}>
            {t('addWorkingAreaTitle')}
          </Text>
          <WorkingAreaForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
          />
        </View>
      </DismissKeyboard>
    )
  }
}

const mapStateToProps = state => ({
  printers: state.printers.data.printers,
  workingareas: state.workingareas.data.workingAreas
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getPrinters: () => dispatch(getPrinters()),
  getWorkingAreas: () => dispatch(getWorkingAreas())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingAreaAdd)
