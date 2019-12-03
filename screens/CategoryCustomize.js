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
  api,
  errorAlert,
  makeFetchRequest,
  successMessage
} from '../constants/Backend'
import { NavigationEvents } from 'react-navigation'

class CategoryCustomize extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    refreshing: false
  }

  componentDidMount() {
    this.props.getProductOptions()
    this.props.getWorkingAreas()
    this.props.getLabel()
  }

  handleSubmit = values => {
    const labelId = this.props.navigation.state.params.labelId

    makeFetchRequest(token => {
      fetch(api.productLabel.getById(labelId), {
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

            this.props.clearLabel()
            this.props.getLables()
            this.props.navigation.navigate('ProductsOverview')
            this.setState({
              refreshing: true
            })
            this.props.getProducts() !== undefined &&
              this.props.getProducts().then(() => {
                this.setState({
                  refreshing: false
                })
              })
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
    const { refreshing } = this.state

    if (isLoading) {
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
    } else if (label !== undefined && Object.entries(label).length === 0) {
      return (
        <View style={[styles.container]}>
          <Text>fetching label ...</Text>
        </View>
      )
    }
    return (
      <View>
        <NavigationEvents
          onWillFocus={() => {
            console.log(
              'React to navigation event: get the latest product options list'
            )
            this.props.getProductOptions()
          }}
        />
        <CategoryCustomizeScreen
          onSubmit={this.handleSubmit}
          navigation={navigation}
          refreshing={refreshing}
          labelName={navigation.state.params.labelName}
          initialValues={label}
          prodctoptions={prodctoptions}
          workingareas={workingareas}
          onCancel={this.handleEditCancel}
          screenProps={this.props.screenProps}
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
