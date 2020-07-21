import React from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { Accordion, List } from '@ant-design/react-native'
import { getTableLayouts } from '../actions'
import AddBtn from '../components/AddBtn'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {NavigationEvents} from "react-navigation";
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";

class TableLayouts extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      activeSections: [0]
    }

    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
  }

  componentDidMount() {
    this.props.getTableLayouts()

    this.context.localize({
      en: {
        noTableLayout: 'No table layout'
      },
      zh: {
        noTableLayout: '沒有資料'
      }
    })
  }

  PanelHeader = (layoutName, layoutId) => {
    return (
      <View style={[styles.listPanel]}>
        <Text style={[styles.listPanelText, { flex: 9 }]}>{layoutName}</Text>
        <MaterialIcon
          name="edit"
          size={22}
          style={styles.listPanelIcon}
          onPress={() => {
            this.props.navigation.navigate('TableLayoutEdit', {
              layoutId: layoutId
            })
          }}
        />
      </View>
    )
  }

  render() {
    const { navigation, tablelayouts = [], loading } = this.props
    const { t } = this.context

    if (loading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <ScrollView scrollIndicatorInsets={{ right: 1 }}>
        <NavigationEvents
          onWillFocus={() => {
            this.props.getTableLayouts()
          }}
        />
        <DismissKeyboard>
          <View>
            <View style={[styles.container]}>
              <ScreenHeader backNavigation={true}
                            title={t('settings.tableLayouts')}
                            rightComponent={
                              <AddBtn
                                onPress={() => this.props.navigation.navigate('TableLayoutAdd')}
                              />
                            }
              />
            </View>

            {tablelayouts.length === 0 && (
              <View>
                <Text style={styles.messageBlock}>{t('noTableLayout')}</Text>
              </View>
            )}

            <Accordion
              onChange={this.onChange}
              activeSections={this.state.activeSections}
              duration={300}
              style={styles.childContainer}
            >
              {tablelayouts.map(tblLayout => (
                <Accordion.Panel
                  header={this.PanelHeader(tblLayout.layoutName, tblLayout.id)}
                  key={tblLayout.id}
                >
                  <List>
                    {tblLayout.tables.map(tbl => (
                      <List.Item
                        key={tbl.tableId}
                        style={{
                          backgroundColor: '#f1f1f1'
                        }}
                        onPress={() => {
                          this.props.navigation.navigate('TableEdit', {
                            tableId: tbl.tableId,
                            layoutId: tblLayout.id
                          })
                        }}
                      >
                        {tbl.tableName}
                      </List.Item>
                    ))}
                  </List>
                </Accordion.Panel>
              ))}
            </Accordion>
          </View>
        </DismissKeyboard>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  tablelayouts: state.tablelayouts.data.tableLayouts,
  haveData: state.tablelayouts.haveData,
  haveError: state.tablelayouts.haveError,
  loading: state.tablelayouts.loading
})
const mapDispatchToProps = dispatch => ({
  dispatch,
  getTableLayouts: () => dispatch(getTableLayouts())
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableLayouts)
