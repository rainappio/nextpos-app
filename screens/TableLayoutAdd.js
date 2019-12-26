import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { Accordion, List, SwipeAction } from '@ant-design/react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import TableLayoutForm from './TableLayoutForm'
import { api, makeFetchRequest, errorAlert } from '../constants/Backend'
import { getTableLayouts } from '../actions'
import styles from '../styles'

class TableLayoutAdd extends React.Component {
  static navigationOptions = {
    header: null
  }

  handleSubmit = values => {
    console.log(JSON.stringify(values))

    makeFetchRequest(token => {
      fetch(api.tablelayout.create, {
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
            this.props.navigation.navigate('TableLayouts')
            this.props.getTableLayouts()
          } else {
            errorAlert(response)
          }
        })
        .catch(error => {
          console.error(error)
        })
    })
  }

  render() {
    const { navigation } = this.props
    const { t } = this.props.screenProps

    return (
      <ScrollView>
        <DismissKeyboard>
          <View>
            <View style={[styles.container, styles.nomgrBottom]}>
              <BackBtn />
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                {/* {t('settings.workingArea')}*/}
                Add Table Layout
              </Text>
            </View>

            <View>
              <TableLayoutForm
                onSubmit={this.handleSubmit}
                t={t}
                navigation={navigation}
              />
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts())
})
export default connect(
  null,
  mapDispatchToProps
)(TableLayoutAdd)
