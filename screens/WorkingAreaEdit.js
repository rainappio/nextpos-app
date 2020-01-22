import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtnCustom from '../components/BackBtnCustom'
import AddBtn from '../components/AddBtn'
import WorkingAreaForm from './WorkingAreaForm'
import {
  getWorkingArea,
  getWorkingAreas,
  getPrinters,
  clearWorkingArea
} from '../actions'
import {
  api,
  errorAlert,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class WorkingAreaEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      t: context.t
    }
  }

  componentDidMount() {
    this.props.getWorkingArea(this.props.navigation.state.params.id)
  }

  handleUpdate = values => {
    var id = values.id
    makeFetchRequest(token => {
      fetch(api.workingarea.update + `${id}`, {
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
            this.props.getPrinters()
            this.props.clearWorkingArea()
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleEditCancel = () => {
    this.props.clearWorkingArea()
    this.props.getPrinters()
    this.props.getWorkingAreas()
    this.props.navigation.navigate('PrinternKDS')
  }

  render() {
    const { navigation, workingarea, loading, haveError, haveData } = this.props
    const { t } = this.state

    if (loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    } else if (haveError) {
      return (
        <View style={[styles.container]}>
          <Text>Err during loading, check internet conn...</Text>
        </View>
      )
    }

    return (
      <DismissKeyboard>
        <View style={styles.container_nocenterCnt}>
          <BackBtnCustom onPress={() => this.handleEditCancel()} />
          <Text style={styles.screenTitle}>{t('editWorkingAreaTitle')}</Text>
          <WorkingAreaForm
            onSubmit={this.handleUpdate}
            navigation={navigation}
            initialValues={workingarea}
            isEdit={true}
            dataArr={this.props.navigation.state.params.printers}
            handleEditCancel={this.handleEditCancel}
          />
        </View>
      </DismissKeyboard>
    )
  }
}

const mapStateToProps = state => ({
  workingarea: state.workingarea.data,
  haveData: state.workingarea.haveData,
  haveError: state.workingarea.haveError,
  loading: state.workingarea.loading
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getWorkingArea: () =>
    dispatch(getWorkingArea(props.navigation.state.params.id)),
  getPrinters: () => dispatch(getPrinters()),
  getWorkingAreas: () => dispatch(getWorkingAreas()),
  clearWorkingArea: () => dispatch(clearWorkingArea())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingAreaEdit)
