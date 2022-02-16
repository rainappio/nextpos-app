import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {SwipeListView} from 'react-native-swipe-list-view'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {ThemeContainer} from "../components/ThemeContainer";

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
      <ThemeContainer>
        <View style={styles.fullWidthScreen}>
          <ScreenHeader title={t('staffListTitle')}
            parentFullScreen={true}
            rightComponent={
              <AddBtn onPress={() => this.props.navigation.navigate('Staff')} />
            }
          />

          <View style={styles.childContainer}>
            <SwipeListView
              data={clientusersOnly}
              renderItem={(data, rowMap) => (
                <TouchableOpacity
                  disabled={this.props?.isStaff ?? false}
                  onPress={() =>
                    this.props.navigation.navigate('StaffEdit', {
                      staffname: data.item.username
                    })
                  }
                >
                  <View style={styles.rowFront}>
                    <StyledText id={data.item.username} style={styles.rowFrontText}>
                      {data?.item?.displayName}
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
      </ThemeContainer>
    )
  }
}

export default StaffRow
