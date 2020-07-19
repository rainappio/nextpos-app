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
import {
  api, dispatchFetchRequest,
  errorAlert,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {ThemeContainer} from "../components/ThemeContainer";

class PrinterEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getPrinter(
      this.props.navigation.state.params.customId === undefined
        ? this.props.navigation.state.params.id
        : this.props.navigation.state.params.customId
    )
  }

  handleUpdate = values => {
    dispatchFetchRequest(api.printer.update(values.id), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate('PrinternKDS')
      this.props.getWorkingAreas()
      this.props.getPrinters()
    }).then()
  }

  handleEditCancel = () => {
    this.props.clearPrinter()
    this.props.getWorkingAreas()
    this.props.navigation.navigate('PrinternKDS')
  }

  render() {
    const { navigation, printer, loading, haveData, haveError } = this.props
    const { t } = this.context

    if (loading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen/>
      )
    }

    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader title={t('editPrinterTitle')}
                        parentFullScreen={true}/>

          <PrinterForm
            navigation={navigation}
            onSubmit={this.handleUpdate}
            isEdit={true}
            initialValues={printer}
            handleEditCancel={this.handleEditCancel}
          />
        </View>
      </ThemeContainer>
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
