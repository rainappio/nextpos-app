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
import {api, errorAlert, makeFetchRequest, successMessage} from '../constants/Backend'
import styles from '../styles'

class WorkingAreaEdit extends React.Component {
  static navigationOptions = {
    header: null
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
    const { t } = this.props.screenProps

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
    } else if (Object.keys(workingarea).length == 0) {
      return (
        <View style={[styles.container]}>
          <Text>no workingarea ...</Text>
        </View>
      )
    }
    return (
      <ScrollView>
        <DismissKeyboard>
          <View style={styles.container}>
            <BackBtnCustom onPress={() => this.handleEditCancel()} />
            <Text
              style={[
                styles.welcomeText,
                styles.orange_color,
                styles.textMedium,
                styles.textBold
              ]}
            >
              {t('settings.workingArea')}
            </Text>

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
      </ScrollView>
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
