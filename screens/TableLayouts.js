import React from 'react'
import {connect} from 'react-redux'
import {View, TouchableOpacity} from 'react-native'
import {Accordion, List} from '@ant-design/react-native'
import {getTableLayouts} from '../actions'
import {MainActionButton} from '../components/ActionButtons'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {ListItem} from "react-native-elements";
import {Octicons} from '@expo/vector-icons';
import {OptionModal} from "../components/OptionModal";

class TableLayouts extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    this.state = {
      activeSections: [0],
      isShowModal: false
    }

    this.onChange = activeSections => {
      this.setState({activeSections})
    }
  }

  componentDidMount() {
    this.props.getTableLayouts()

    this.context.localize({
      en: {
        noTableLayout: 'No table layout',
        tableLayouts: {
          addTableLayout: 'Add Table Layout',
          manageVisualLayoutTitle: 'Manage Visual Layout',
        }
      },
      zh: {
        noTableLayout: '沒有資料',
        tableLayouts: {
          addTableLayout: '新增樓面',
          manageVisualLayoutTitle: '管理桌位位置',
        }
      }
    })
    this._getTableLayouts = this.props.navigation.addListener('focus', () => {
      this.props.getTableLayouts()
    })
  }
  componentWillUnmount() {
    this._getTableLayouts()
  }

  PanelHeader = (layoutName, layoutId) => {
    return (
      <View style={[styles.listPanel]}>
        <View style={[styles.tableCellView, styles.flex(1)]}>
          <StyledText style={[styles.listPanelText]}>{layoutName}</StyledText>
        </View>
        <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
          <MaterialIcon
            name="edit"
            size={22}
            style={[{color: this.context?.customMainThemeColor}]}
            onPress={() => {
              this.props.navigation.navigate('TableLayoutEdit', {
                layoutId: layoutId
              })
            }}
          />
        </View>
      </View>
    )
  }

  render() {
    const {navigation, tablelayouts = [], loading, themeStyle} = this.props
    const {t, isTablet, customBackgroundColor} = this.context

    if (loading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <ThemeScrollView>
        <View>
          <View style={[styles.container]}>
            <ScreenHeader backNavigation={true}
              title={t('settings.tableLayouts')}
              rightComponent={
                isTablet ?
                  <OptionModal
                    toggleModal={(flag) => this.setState({isShowModal: flag})}
                    isShowModal={this.state?.isShowModal}>
                    <View style={{marginBottom: 20, width: 240}}>
                      <MainActionButton title={t('tableLayouts.addTableLayout')}
                        onPress={() => {
                          this.setState({isShowModal: false})
                          this.props.navigation.navigate('TableLayoutAdd')
                        }} />
                    </View>
                    <View>
                      <MainActionButton title={t('tableLayouts.manageVisualLayoutTitle')} onPress={() => {
                        this.setState({isShowModal: false})
                        this.props.navigation.navigate('ManageVisualScreen')
                      }} />
                    </View>
                  </OptionModal>
                  : <AddBtn
                    onPress={() => this.props.navigation.navigate('TableLayoutAdd')}
                  />
              }
            />
          </View>

          {tablelayouts.length === 0 && (
            <View>
              <StyledText style={styles.messageBlock}>{t('noTableLayout')}</StyledText>
            </View>
          )}

          <Accordion
            onChange={this.onChange}
            activeSections={this.state.activeSections}
            //duration={300}
            style={styles.childContainer}
          >
            {tablelayouts.map(tblLayout => (
              <Accordion.Panel
                header={this.PanelHeader(tblLayout.layoutName, tblLayout.id)}
                key={tblLayout.id}
              >
                <List>
                  {tblLayout.tables.map(tbl => (
                    <ListItem
                      key={tbl.tableId}
                      onPress={() => {
                        this.props.navigation.navigate('TableEdit', {
                          tableId: tbl.tableId,
                          layoutId: tblLayout.id
                        })
                      }}
                      bottomDivider
                      containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                    >
                      <View style={[styles.tableRowContainer]}>
                        <View style={[styles.tableCellView]}>
                          <StyledText>{tbl.tableName}</StyledText>
                        </View>
                      </View>
                    </ListItem>
                  ))}
                  {tblLayout.tables.length === 0 && (
                    <ListItem
                      onPress={() => {

                      }}
                      bottomDivider
                      containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: customBackgroundColor},]}
                    >
                      <View style={[styles.tableRowContainer]}>
                        <View style={[styles.tableCellView]}>
                          <StyledText>({t('empty')})</StyledText>
                        </View>
                      </View>
                    </ListItem>
                  )}
                </List>
              </Accordion.Panel>
            ))}
          </Accordion>
        </View>
      </ThemeScrollView>
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

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withContext
)

export default enhance(TableLayouts)
