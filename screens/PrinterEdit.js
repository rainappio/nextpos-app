import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import PrinterForm from '../screens/PrinterForm'
import {
  getWorkingAreas,
  getPrinters,
  getPrinter,
  clearPrinter
} from '../actions'
import { api, makeFetchRequest } from '../constants/Backend'
import styles from '../styles'

class PrinterEdit extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getPrinter(
      this.props.navigation.state.params.customId == undefined
        ? this.props.navigation.state.params.id
        : this.props.navigation.state.params.customId
    )
  }

  handleUpdate = values => {
    var id = values.id
    makeFetchRequest(token => {
      fetch(api.printer.update + `${id}`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': token.application_client_id,
          Authorization: 'Bearer ' + token.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
            this.props.navigation.navigate('PrinternKDS')
            this.props.getWorkingAreas()
            this.props.getPrinters()
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleEditCancel = () => {
    this.props.clearPrinter()
    this.props.getWorkingAreas()
    this.props.navigation.navigate('PrinternKDS')
  }

  render() {
    const { navigation, printer, loading, haveData, haveError } = this.props
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
    } else if (Object.keys(printer).length == 0) {
      return (
        <View style={[styles.container]}>
          <Text>no printer ...</Text>
        </View>
      )
    }
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
              {t('settings.workingArea')}
            </Text>
            <PrinterForm
              navigation={navigation}
              onSubmit={this.handleUpdate}
              isEdit={true}
              initialValues={printer}
              handleEditCancel={this.handleEditCancel}
            />
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  css: state,
  printer: state.printer.data,
  haveData: state.printer.haveData,
  haveError: state.printer.haveError,
  loading: state.printer.loading
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getPrinters: () => dispatch(getPrinters()),
  getWorkingAreas: () => dispatch(getWorkingAreas()),
  getPrinter: id => dispatch(getPrinter(id)),
  clearPrinter: () => dispatch(clearPrinter())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrinterEdit)
