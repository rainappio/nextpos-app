import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import PrinterForm from '../screens/PrinterForm'
import {getPrinters, getTableLayouts, getWorkingAreas} from '../actions'
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

  componentDidMount() {
    this.props.getTableLayouts()
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
    }).then()
  }

  render() {
    const {navigation, route, tableLayouts} = this.props
    const {t, isTablet} = this.context

    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen, isTablet && styles.horizontalPaddingScreen]}>
          <ScreenHeader title={t('printer.addPrinterTitle')}
            parentFullScreen={true} />

          <PrinterForm navigation={navigation}
                       route={route}
                       onSubmit={this.handleSubmit}
                       tableLayouts={tableLayouts}
          />
        </View>
      </ThemeContainer>
    )
  }
}

const mapStateToProps = state => ({
  tableLayouts: state.tablelayouts.data.tableLayouts
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrinterAdd)
