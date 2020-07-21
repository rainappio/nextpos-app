import React from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import { Accordion, List } from '@ant-design/react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import { getPrinters, getWorkingAreas } from '../actions'
import PopUp from '../components/PopUp'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import BackendErrorScreen from "./BackendErrorScreen";

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
        noPrinter: 'No Printer',
        noWorkingArea: 'No Working Area'
      },
      zh: {
        printerTitle: '出單機',
        workingAreaTitle: '工作區',
        noPrinter: '沒有資料',
        noWorkingArea: '沒有資料'
      }
    })

    this.state = {
      activeSections: []
    }

    this.onChange = activeSections => {
      this.setState({ activeSections })
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
    const { t } = this.context

    if (loading) {
      return (
        <LoadingScreen/>
      )
    } else if (haveError) {
      return (
        <BackendErrorScreen/>
      )
    }
    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <DismissKeyboard>
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
              <View style={[styles.no_mgrTop, styles.mgrbtn20]}>
                {printers.length === 0 && (
                  <View>
                    <Text style={styles.messageBlock}>{t('noPrinter')}</Text>
                  </View>
                )}

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
                        <Text key={rowMap} style={styles.rowFrontText}>
                          {data.item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
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
                {workingareas.length === 0 && (
                  <View>
                    <Text style={styles.messageBlock}>
                      {t('noWorkingArea')}
                    </Text>
                  </View>
                )}

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
                        <Text key={rowMap} style={styles.rowFrontText}>
                          {data.item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(data, rowMap) => rowMap.toString()}
                  leftOpenValue={0}
                  rightOpenValue={-80}
                />
              </View>
            </View>
          </View>
        </DismissKeyboard>
      </ScrollView>
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
