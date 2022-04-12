import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import WorkingAreaForm from './WorkingAreaForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import {getPrinters, getWorkingAreas} from '../actions'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeContainer} from "../components/ThemeContainer";

class WorkingAreaAdd extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props)
  }

  handleSubmit = values => {
    dispatchFetchRequest(api.workingarea.create, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate('PrinternKDS')
    }).then()
  }

  render() {
    const {navigation, route} = this.props
    const {t, isTablet} = this.context

    return (
      <ThemeContainer>
        <View style={[styles.fullWidthScreen, isTablet && styles.horizontalPaddingScreen]}>
          <ScreenHeader title={t('workingAreaScreen.addWorkingAreaTitle')}
            parentFullScreen={true} />

          <WorkingAreaForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
            route={route}
          />
        </View>
      </ThemeContainer>
    )
  }
}

const mapStateToProps = state => ({

})
const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingAreaAdd)
