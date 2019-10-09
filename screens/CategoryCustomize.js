import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, View, Text, ActivityIndicator } from 'react-native'
import CategoryCustomizeScreen from './CategoryCustomizeScreen'
import {
  getProducts,
  getLables,
  getProductOptions,
  getWorkingAreas,
  getLabel,
  clearLabel
} from '../actions'
import styles from '../styles'

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
    var prdlabelId = this.props.navigation.state.params.labelId
    AsyncStorage.getItem('token', (err, value) => {
      if (err) {
        console.log(err)
      } else {
        JSON.parse(value)
      }
    }).then(val => {
      var tokenObj = JSON.parse(val)
      fetch(`http://35.234.63.193/labels/${prdlabelId}`, {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': tokenObj.clientId,
          Authorization: 'Bearer ' + tokenObj.access_token
        },
        body: JSON.stringify(values)
      })
        .then(response => {
          if (response.status === 200) {
           this.props.clearLabel();
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
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  handleEditCancel = () => {
    this.props.clearLabel()
    this.props.navigation.navigate('ProductsOverview')
  }

  render() {
    const { navigation, prodctoptions, workingareas, label, isLoading, haveData, haveError } = this.props
    const { refreshing } = this.state

  if (isLoading) {
    return (
      <View style={[styles.container]}>
        <ActivityIndicator size="large" color="#ccc" />
      </View>
    )
  } else if (haveError) {m
    return (
      <View style={[styles.container]}>
        <Text>Err during loading, check internet conn...</Text>
      </View>
    )
  } else if (label !== undefined && Object.entries(label).length === 0) {
    return (
      <View style={[styles.container]}>
        <Text>no label ...</Text>
      </View>
    )
  }
    return (
      <CategoryCustomizeScreen
        onSubmit={this.handleSubmit}
        navigation={navigation}
        refreshing={refreshing}
        labelName={navigation.state.params.labelName}
        initialValues={label}
        prodctoptions={prodctoptions}
        workingareas={workingareas}
        onCancel={this.handleEditCancel}
        haveData={haveData}
        isLoading={isLoading}
        haveError={haveError}
      />
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
