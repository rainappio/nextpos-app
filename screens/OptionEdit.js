import React from 'react'
import {connect} from 'react-redux'
import OptionFormScreen from './OptionFormScreen'
import {getProductOption} from '../actions'
import {api, dispatchFetchRequest} from '../constants/Backend'
import LoadingScreen from "./LoadingScreen";

class OptionEdit extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getProductOption(this.props.navigation.state.params.customId)
  }

  handleSubmit = values => {
    values.multipleChoice === true
      ? (values.optionType = 'MULTIPLE_CHOICE')
      : (values.optionType = 'ONE_CHOICE')

    dispatchFetchRequest(api.productOption.update(values.id), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate(this.props.navigation.state.params.customRoute)
    }).then()
  }

  handleDeleteOption = values => {

    dispatchFetchRequest(api.productOption.deleteById(values.id), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, response => {
      this.props.navigation.navigate(this.props.navigation.state.params.customRoute)
    }).then()
  }

  render() {
    const {navigation, productOption, loading, haveData} = this.props
    console.log('productOption', productOption)

    const mappedOption = {
      id: productOption.id,
      optionName: productOption.optionName,
      optionType: productOption.optionType,
      multipleChoice: productOption.multipleChoice,
      required: productOption.required,
      optionValues: productOption.optionValues,
      usedByProductLabels: productOption.usedByProductLabels,
      usedByProducts: productOption.usedByProducts,
    }

    if (loading) {
      return (
        <LoadingScreen />
      )
    } else if (haveData) {
      return (
        <OptionFormScreen
          initialValues={mappedOption}
          onSubmit={this.handleSubmit}
          handleDeleteOption={this.handleDeleteOption}
          navigation={navigation}
        />
      )
    } else {
      return null
    }
  }
}

const mapStateToProps = state => ({
  productOption: state.productoption.data,
  loading: state.productoption.loading,
  haveData: state.productoption.haveData
})

const mapDispatchToProps = dispatch => ({
  dispatch,
  getProductOption: id => dispatch(getProductOption(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionEdit)
