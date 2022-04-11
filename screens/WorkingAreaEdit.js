import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import WorkingAreaForm from './WorkingAreaForm'
import {clearWorkingArea, getPrinters, getWorkingArea, getWorkingAreas} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {ThemeContainer} from "../components/ThemeContainer";

class WorkingAreaEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getWorkingArea(this.props.route.params.id)
  }

  handleUpdate = values => {
    console.log('values', values)
    dispatchFetchRequest(api.workingarea.update(values.id), {
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

  handleDelete = (values) => {

    dispatchFetchRequest(api.workingarea.delete(values.id), {
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
    const {navigation, route, workingarea, loading, haveError, haveData} = this.props
    console.log('workingarea', JSON.stringify(workingarea))
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
      <ThemeContainer>
        <View style={[styles.fullWidthScreen, isTablet && styles.horizontalPaddingScreen]}>
          <ScreenHeader backNavigation={true}
            parentFullScreen={true}
            backAction={() => this.handleEditCancel()}
            title={t('workingAreaScreen.editWorkingAreaTitle')} />

          <WorkingAreaForm
            onSubmit={this.handleUpdate}
            handleDelete={this.handleDelete}
            navigation={navigation}
            route={route}
            initialValues={workingarea}
            isEdit={true}
            dataArr={this.props.route.params.printers}
            handleEditCancel={this.handleEditCancel}
          />
        </View>
      </ThemeContainer>
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
  getWorkingArea: () => dispatch(getWorkingArea(props.route.params.id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkingAreaEdit)
