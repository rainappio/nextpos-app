import React from 'react'
import { ScrollView, Text, View, RefreshControl, TouchableOpacity } from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'

class StaffRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      refreshing: false,
      t: context.t
    }
  }

  componentDidMount = async () => {
    this.context.localize({
      en: {
        staffListTitle: 'Staffs List'
      },
      zh: {
        staffListTitle: '員工列表'
      }
    })
  }

  render() {
    const {
      clientusers = [],
      labels,
      navigation,
      haveData,
      haveError,
      isLoading
    } = this.props

    const { t } = this.state

    var clientusersOnly = clientusers.filter(function(el) {
      return el.defaultUser === false
    })

    return (
      <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} />}
      >
        <DismissKeyboard>
          <View>
            <View style={styles.container}>
              <BackBtn/>
              <Text
                style={[
                  styles.welcomeText,
                  styles.orange_color,
                  styles.textMedium,
                  styles.textBold
                ]}
              >
                {t('staffListTitle')}
              </Text>
              <AddBtn onPress={() => this.props.navigation.navigate('Staff')}/>
            </View>

            <View style={styles.childContainer}>
              <SwipeListView
                data={clientusersOnly}
                renderItem={(data, rowMap) => (
                  <TouchableOpacity onPress={() =>
                    this.props.navigation.navigate('StaffEdit', {
                      staffname: data.item.username
                    })
                  }>
                    <View style={styles.rowFront}>
                      <Text
                        key={rowMap}
                        style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 20}}
                      >
                        {data.item.username}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(data, rowMap) => rowMap.toString()}
              />
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

export default StaffRow
