import React from 'react'
import {connect} from 'react-redux'
import {getClientUsrs} from '../actions'
import StaffListScreen from './StaffListScreen'

class StaffsOverview extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    this.props.getClientUsrs()
  }

  render() {
    const {
      clientusers = [],
      navigation,
      haveData,
      haveError,
      isLoading
    } = this.props

    return (
      <StaffListScreen
        clientusers={clientusers}
        navigation={navigation}
        haveData={haveData}
        haveError={haveError}
        isLoading={isLoading}
      />
    )
  }
}

const mapStateToProps = state => ({
  clientusers: state.clientusers.data.users,
  haveData: state.clientusers.haveData,
  haveError: state.clientusers.haveError,
  isLoading: state.clientusers.loading
})

const mapDispatchToProps = dispatch => ({
  getClientUsrs: () => dispatch(getClientUsrs())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffsOverview)
