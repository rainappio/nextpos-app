import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import WorkingAreaForm from './WorkingAreaForm'
import {
  api, dispatchFetchRequest,
  errorAlert,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import { getWorkingAreas, getPrinters } from '../actions'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
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
      this.props.getWorkingAreas()
    }).then()
  }

  render() {
    const { navigation } = this.props
    const { t } = this.context

    return (
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader title={t('addWorkingAreaTitle')}
                        parentFullScreen={true}/>

          <WorkingAreaForm
            onSubmit={this.handleSubmit}
            navigation={navigation}
          />
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
)(WorkingAreaAdd)
