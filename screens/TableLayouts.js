import React from 'react'
import { connect } from 'react-redux'
import {
  AsyncStorage,
  View,
  Text,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import { Accordion, List, SwipeAction } from '@ant-design/react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { getTableLayouts } from '../actions'
import AddBtn from '../components/AddBtn'
import BackBtn from '../components/BackBtn'
import { DismissKeyboard } from '../components/DismissKeyboard'
import styles from '../styles'

class TableLayouts extends React.Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      activeSections: [],
      tableId: null
    }
    this.onChange = activeSections => {
      this.setState({ activeSections })
    }
    this.props.getTableLayouts()
  }

  PanelHeader = (layoutName, layoutId) => {
    return (
      <View
        style={{
          width: '100%',
          paddingTop: 15,
          paddingBottom: 15
        }}
      >
        <Text style={[styles.whiteColor, styles.centerText, styles.textMedium]}>
          {layoutName}
        </Text>
        <AntDesignIcon
          name="ellipsis1"
          size={25}
          color="black"
          style={{ position: 'absolute', right: 0, top: 15 }}
          onPress={() => {
            this.props.navigation.navigate('TableLayoutEdit', {
              layoutId: layoutId
            })
          }}
        />
      </View>
    )
  }

  onOpenNP = tableId => {
    this.setState({
      tableId: tableId
    })
  }

  render() {
    const { navigation, tablelayouts = [], loading } = this.props
    const { t } = this.props.screenProps

    if (loading) {
      return (
        <View style={[styles.container]}>
          <ActivityIndicator size="large" color="#ccc" />
        </View>
      )
    }
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
                Table Layouts
              </Text>

              <AddBtn
                onPress={() => this.props.navigation.navigate('TableLayoutAdd')}
              />
            </View>

            <View>
              <Accordion
                onChange={this.onChange}
                activeSections={this.state.activeSections}
                duration={300}
              >
                {tablelayouts.map(tblLayout => (
                  <Accordion.Panel
                    header={this.PanelHeader(
                      tblLayout.layoutName,
                      tblLayout.id
                    )}
                    key={tblLayout.id}
                    style={{ backgroundColor: '#f18d1a', marginBottom: 2 }}
                  >
                    <List>
                      {tblLayout.tables.map(tbl => (
                        <SwipeAction
                          autoClose={true}
                          onOpen={() => this.onOpenNP(tbl.tableId)}
                          onClose={() => {}}
                          key={tbl.tableId}
                        >
                          <List.Item
                            style={{
                              backgroundColor: '#f1f1f1'
                            }}
                          >
                            {tbl.tableName}
                          </List.Item>
                        </SwipeAction>
                      ))}
                    </List>
                  </Accordion.Panel>
                ))}
              </Accordion>
            </View>
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
