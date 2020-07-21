import React from 'react'
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";

class StaffRow extends React.Component {
  static navigationOptions = {
    header: null
  }

  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)
  }

  componentDidMount = async () => {
    this.context.localize({
      en: {
        staffListTitle: 'Staffs List',
        noStaff: 'No Staff'
      },
      zh: {
        staffListTitle: '員工列表',
        noStaff: '沒有資料'
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

    const { t } = this.context

    const clientusersOnly = clientusers.filter(function(el) {
      return el.defaultUser === false
    })

    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
          <View>
            <View style={styles.container}>
              <ScreenHeader title={t('staffListTitle')}
                            rightComponent={
                              <AddBtn onPress={() => this.props.navigation.navigate('Staff')} />
                            }
              />

            </View>

            <View style={styles.childContainer}>
              {clientusersOnly.length === 0 && (
                <View>
                  <Text style={styles.messageBlock}>{t('noStaff')}</Text>
                </View>
              )}
              <SwipeListView
                data={clientusersOnly}
                renderItem={(data, rowMap) => (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('StaffEdit', {
                        staffname: data.item.username
                      })
                    }
                  >
                    <View style={styles.rowFront}>
                      <Text key={rowMap} style={styles.rowFrontText}>
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
