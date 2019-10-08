import React from 'react'
import { connect } from 'react-redux'
import { AsyncStorage, View, Text } from 'react-native'
import CategoryCustomizeScreen from './CategoryCustomizeScreen'
import {
  getProducts,
  getLables,
  getProductOptions,
  getWorkingAreas,
  getLabel
} from '../actions'

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
    // this.props.getProducts()
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
            alert('Success')
            // this.props.navigation.navigate('CategoryCustomize')
            this.setState({
              refreshing: true
            })
            // this.props.getProducts() !== undefined &&
            //   this.props.getProducts().then(() => {
            //     this.setState({
            //       refreshing: false
            //     })
            //   })
          } else {
            alert('pls try again')
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const { navigation, prodctoptions, workingareas, label } = this.props
    const { refreshing } = this.state

		//your get label API need to return value like this to show checked status on category customize screen
    var labelInitial ={
    "id": "2ca9bb47-0e03-41b9-a0cc-a63b0ca959a9",
    "appliesToProducts": true,
    "productOptionIds": ['c3752b32-6e08-44d9-b7a7-fb19bfb7bb6b'],
    "value": "2ca9bb47-0e03-41b9-a0cc-a63b0ca959a9",
    "label": "Cate edited",
    "workingAreaId": 'fe2153f2-7a91-4402-b0da-f1447c018164',//  change this to workingAreaId
    //"workingAreaId": 'c27aa52d-6a05-4ddb-abe9-0ea5e873cb17',
    "productOptions": [], // change this to productOptionIds
    "subLabels": [],
    "appliedProducts": [], // change this to appliesToProducts: true , not []
}

    return (
      <CategoryCustomizeScreen
        onSubmit={this.handleSubmit}
        navigation={navigation}
        refreshing={refreshing}
        labelName={navigation.state.params.labelName}
        initialValues={labelInitial}
        prodctoptions={prodctoptions}
        workingareas={workingareas}
      />
    )
  }
}

const mapStateToProps = (state, props) => ({
  label: state.label.data,
  labels: state.labels.data.labels,
  prodctoptions: state.prodctsoptions.data.results,
  workingareas: state.workingareas.data.workingAreas
})

const mapDispatchToProps = (dispatch, props) => ({
  dispatch,
  getWorkingAreas: () => dispatch(getWorkingAreas()),
  getProductOptions: () => dispatch(getProductOptions()),
  // getProducts: () => dispatch(getProducts()),
  getLabel: () => dispatch(getLabel(props.navigation.state.params.labelId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryCustomize)
