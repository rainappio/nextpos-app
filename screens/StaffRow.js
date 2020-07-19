import React from 'react'
import {
  ScrollView,
  Text,
  View,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import {DismissKeyboard} from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {withContext} from "../helpers/contextHelper";
import {StyledText} from "../components/StyledText";

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
      clientusers = []
    } = this.props

    const {t} = this.context

    const clientusersOnly = clientusers.filter(function (el) {
      return el.defaultUser === false
    })

    return (
      <ThemeScrollView>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader title={t('staffListTitle')}
                        parentFullScreen={true}
                        rightComponent={
                          <AddBtn onPress={() => this.props.navigation.navigate('Staff')}/>
                        }
          />

          <View style={styles.childContainer}>
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
                    <StyledText id={data.item.username} style={styles.rowFrontText}>
                      {data.item.username}
                    </StyledText>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View>
                  <StyledText style={styles.messageBlock}>{t('noStaff')}</StyledText>
                </View>
              }
              keyExtractor={(data, rowMap) => rowMap.toString()}
            />
          </View>
        </View>
      </ThemeScrollView>
    )
  }
}

export default StaffRow
