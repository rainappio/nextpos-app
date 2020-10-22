import React from 'react'
import {connect} from 'react-redux'
import {Text, TouchableOpacity, View} from 'react-native'
import {SwipeListView} from 'react-native-swipe-list-view'
import {getPrinters, getWorkingAreas} from '../actions'
import {PopUp} from '../components/PopUp'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";

class PrinternKDS extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        printerTitle: 'Printer',
        workingAreaTitle: 'Working Area',
      },
      zh: {
        printerTitle: '出單機',
        workingAreaTitle: '工作區',
      }
    })

    this.state = {
      activeSections: []
    }

    this.onChange = activeSections => {
      this.setState({activeSections})
    }
  }

  componentDidMount() {
    this.props.getPrinters()
    this.props.getWorkingAreas()
  }

  render() {
    const {
      printers = [],
      workingareas = [],
      loading,
      navigation,
      haveError,
      haveData
    } = this.props
    const {t} = this.context

    if (loading) {
      return (
        <LoadingScreen />
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen />
      )
    }
    return (
      <ThemeScrollView>
        <View>
          <View style={[styles.container]}>
            <ScreenHeader title={t('settings.workingArea')}
              rightComponent={
                <PopUp
                  navigation={navigation}
                  toRoute1={'PrinterAdd'}
                  toRoute2={'WorkingAreaAdd'}
                  textForRoute1={t('newItem.printer')}
                  textForRoute2={t('newItem.workingArea')}
                  dataArr={printers}
                />
              }
            />
          </View>

          <View>
            <View style={styles.sectionBar}>
              <Text style={styles.sectionBarText}>
                {t('printerTitle')}
              </Text>

            </View>
            <View style={[styles.mgrbtn20]}>
              <SwipeListView
                data={printers}
                renderItem={(data, rowMap) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('PrinterEdit', {
                        id: data.item.id
                      })
                    }}
                  >
                    <View style={styles.rowFront}>
                      <StyledText key={rowMap} style={styles.rowFrontText}>
                        {data.item.name}
                      </StyledText>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View>
                    <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                  </View>
                }
                keyExtractor={(data, rowMap) => rowMap.toString()}
                leftOpenValue={0}
                rightOpenValue={-80}
              />
            </View>

            <View style={styles.sectionBar}>
              <Text style={styles.sectionBarText}>
                {t('workingAreaTitle')}
              </Text>
            </View>

            <View style={[styles.no_mgrTop, styles.mgrbtn20]}>
              <SwipeListView
                data={workingareas}
                renderItem={(data, rowMap) => (
                  <TouchableOpacity
                    onPress={() => {
                      this.props.navigation.navigate('WorkingAreaEdit', {
                        id: data.item.id,
                        printers: printers
                      })
                    }}
                  >
                    <View style={styles.rowFront}>
                      <StyledText key={rowMap} style={styles.rowFrontText}>
                        {data.item.name}
                      </StyledText>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View>
                    <StyledText style={styles.messageBlock}>{t('general.noData')}</StyledText>
                  </View>
                }
                keyExtractor={(data, rowMap) => rowMap.toString()}
                leftOpenValue={0}
                rightOpenValue={-80}
              />
            </View>
          </View>
        </View>
      </ThemeScrollView>
    )
  }
}

const mapStateToProps = state => ({
  printers: state.printers.data.printers,
  workingareas: state.workingareas.data.workingAreas,
  loading: state.workingareas.loading,
  haveError: state.workingareas.haveError,
  haveData: state.workingareas.haveData
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getPrinters: () => dispatch(getPrinters()),
  getWorkingAreas: () => dispatch(getWorkingAreas())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PrinternKDS)
