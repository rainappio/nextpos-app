import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import PrinterForm from '../screens/PrinterForm'
import {getPrinters, getWorkingAreas} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";

class PrinterAdd extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  handleSubmit = values => {
    dispatchFetchRequest(api.printer.create, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate('PrinternKDS')
      this.props.getWorkingAreas()
      this.props.getPrinters()
    }).then()
  }

  render() {
    const {navigation} = this.props
    const {t} = this.context

    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader title={t('printer.addPrinterTitle')}
            parentFullScreen={true} />

          <PrinterForm navigation={navigation} onSubmit={this.handleSubmit} />
        </View>
      </ThemeContainer>
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
)(PrinterAdd)
