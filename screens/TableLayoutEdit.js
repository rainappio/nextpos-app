import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {clearTableLayout, getTableLayout, getTableLayouts} from '../actions'
import TableLayoutForm from './TableLayoutForm'
import {api, dispatchFetchRequest} from '../constants/Backend'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import AddBtn from "../components/AddBtn";
import LoadingScreen from "./LoadingScreen";
import {ThemeScrollView} from "../components/ThemeScrollView";

class TableLayoutEdit extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount() {
    this.props.getTableLayout(this.props.navigation.state.params.layoutId)
  }

  handleEditCancel = () => {
    this.props.clearTableLayout(this.props.navigation.state.params.layoutId)
    this.props.navigation.navigate('TableLayouts')
  }

  handleSubmit = values => {
    dispatchFetchRequest(api.tablelayout.update(values.id), {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(values)
    }, response => {
      this.props.navigation.navigate('TableLayouts')
      this.props.getTableLayouts()
    }).then()
  }

  handleDeleteLayout = (layoutId) => {
    dispatchFetchRequest(api.tablelayout.delete(layoutId), {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {},
    }, response => {
      this.props.navigation.navigate('TableLayouts')
    }).then()
  }

  render() {
    const {
      navigation,
      tablelayout,
      haveData,
      haveError,
      isLoading
    } = this.props
    const { t } = this.context

    if (isLoading) {
      return (
        <LoadingScreen/>
      )
    }
    return (
    	<ThemeScrollView>
        <View style={[styles.fullWidthScreen]}>
          <ScreenHeader title={t('editTableLayoutTitle')}
                        parentFullScreen={true}
                        rightComponent={
                          <AddBtn
                            onPress={() =>
                              this.props.navigation.navigate('TableAdd', {
                                layoutId: tablelayout.id
                              })
                            }
                          />
                        }
          />

          <TableLayoutForm
            onSubmit={this.handleSubmit}
            handleDeleteLayout={this.handleDeleteLayout}
            initialValues={tablelayout}
            isEdit={true}
            navigation={navigation}
            handleEditCancel={this.handleEditCancel}
          />
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  tablelayout: state.tablelayout.data,
  haveData: state.tablelayout.haveData,
  haveError: state.tablelayout.haveError,
  isLoading: state.tablelayout.loading
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts()),
  getTableLayout: id => dispatch(getTableLayout(id)),
  clearTableLayout: id => dispatch(clearTableLayout(id))
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableLayoutEdit)
