import React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator, Text, View } from 'react-native'
import CategoryCustomizeScreen from './CategoryCustomizeScreen'
import {
  clearLabel,
  getLabel,
  getLables,
  getProductOptions,
  getProducts,
  getWorkingAreas
} from '../actions'
import styles from '../styles'
import {
  api, dispatchFetchRequest,
  errorAlert,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import { NavigationEvents } from 'react-navigation'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";

class CategoryCustomize extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getProductOptions()
    this.props.getWorkingAreas()
    this.props.getLabel()
  }

  handleSubmit = values => {
    const labelId = this.props.navigation.state.params.labelId

    dispatchFetchRequest(api.productLabel.getById(labelId), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.clearLabel()
      this.props.getLables()
      this.props.navigation.navigate('ProductsOverview')
      this.props.getProducts()
    }).then()

  }

  handleEditCancel = () => {
    this.props.clearLabel()
    this.props.getProducts()
    this.props.navigation.navigate('ProductsOverview')
  }

  render() {
    const {
      navigation,
      prodctoptions,
      workingareas,
      label,
      isLoading,
      haveData,
      haveError
    } = this.props

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen/>
      )
    } else if (label !== undefined && Object.entries(label).length === 0) {
      return (
        <View style={[styles.container]}>
          <Text>fetching label ...</Text>
        </View>
      )
    }
    return (
      <View style={{flex: 1}}>
        <NavigationEvents
          onWillFocus={() => {
            this.props.getProductOptions()
          }}
        />
        <CategoryCustomizeScreen
          isEditForm={true}
          onSubmit={this.handleSubmit}
          navigation={navigation}
          labelName={navigation.state.params.labelName}
          initialValues={label}
          prodctoptions={prodctoptions}
          workingareas={workingareas}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, props) => ({
  label: state.label.data,
  labels: state.labels.data.labels,
  prodctoptions: state.prodctsoptions.data.results,
  workingareas: state.workingareas.data.workingAreas,
  isLoading: state.label.loading,
  haveData: state.label.haveData,
  haveError: state.label.haveError
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getWorkingAreas: () => dispatch(getWorkingAreas()),
  getProductOptions: () => dispatch(getProductOptions()),
  clearLabel: () => dispatch(clearLabel()),
  getLabel: () => dispatch(getLabel(props.navigation.state.params.labelId)),
  getLables: () => dispatch(getLables()),
  getProducts: () => dispatch(getProducts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryCustomize)
