import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import PrinterForm from '../screens/PrinterForm'
import {clearPrinter, getPrinter, getPrinters, getTableLayouts, getWorkingAreas} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {ThemeContainer} from "../components/ThemeContainer";
import {ThemeScrollView} from "../components/ThemeScrollView";

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
      this.props.route.params.customId === undefined
        ? this.props.route.params.id
        : this.props.route.params.customId
    )
    this.props.getTableLayouts()
  }

  handleUpdate = values => {
    dispatchFetchRequest(api.printer.update(values.id), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...values, serviceTypes: [...values?.serviceTypes]})
    }, response => {
      this.props.navigation.navigate('PrinternKDS')
    }).then()
  }

  handleDelete = (values) => {

    dispatchFetchRequest(api.printer.delete(values.id), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, response => {
      this.props.navigation.navigate('PrinternKDS')
    }).then()
  }

  handleEditCancel = () => {
    this.props.navigation.navigate('PrinternKDS')
  }

  render() {
    const {navigation, route, printer, loading, haveData, haveError, tableLayouts} = this.props
    const {t, isTablet} = this.context

    if (loading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen />
      )
    }

    return (
      <ThemeScrollView>
        <View style={[styles.fullWidthScreen, isTablet && styles.horizontalPaddingScreen]}>
          <ScreenHeader title={t('printer.editPrinterTitle')}
            parentFullScreen={true} />

          <PrinterForm
            navigation={navigation}
            route={route}
            onSubmit={this.handleUpdate}
            handleDelete={this.handleDelete}
            isEdit={true}
            initialValues={printer}
            handleEditCancel={this.handleEditCancel}
            tableLayouts={tableLayouts}
          />
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  printer: state.printer.data,
  haveData: state.printer.haveData,
  haveError: state.printer.haveError,
  loading: state.printer.loading,
  tableLayouts: state.tablelayouts.data.tableLayouts
})
const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getPrinter: id => dispatch(getPrinter(id)),
  getTableLayouts: () => dispatch(getTableLayouts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrinterEdit)
