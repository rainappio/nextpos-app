import React from 'react'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {Accordion, List} from '@ant-design/react-native'
import {getTableLayouts} from '../actions'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import {NavigationEvents} from "react-navigation";
import ScreenHeader from "../components/ScreenHeader";
import LoadingScreen from "./LoadingScreen";
import {ThemeScrollView} from "../components/ThemeScrollView";
import {StyledText} from "../components/StyledText";
import {withContext} from "../helpers/contextHelper";
import {compose} from "redux";
import {ListItem} from "react-native-elements";

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
      this.setState({activeSections})
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
        <View style={[styles.tableCellView, styles.flex(1)]}>
          <StyledText style={[styles.listPanelText]}>{layoutName}</StyledText>
        </View>
        <View style={[styles.tableCellView, styles.flex(1), styles.justifyRight]}>
          <MaterialIcon
            name="edit"
            size={22}
            style={[styles.listPanelIcon]}
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
    const {t} = this.context

    if (loading) {
      return (
        <LoadingScreen />
      )
    }
    return (
      <ThemeScrollView>
        <NavigationEvents
          onWillFocus={() => {
            this.props.getTableLayouts()
          }}
        />
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
                      title={
                        <View style={[styles.tableRowContainer]}>
                          <View style={[styles.tableCellView]}>
                            <StyledText>{tbl.tableName}</StyledText>
                          </View>
                        </View>
                      }
                      onPress={() => {
                        this.props.navigation.navigate('TableEdit', {
                          tableId: tbl.tableId,
                          layoutId: tblLayout.id
                        })
                      }}
                      bottomDivider
                      containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: themeStyle.backgroundColor},]}
                    />
                  ))}
                  {tblLayout.tables.length === 0 && (
                    <ListItem
                      title={
                        <View style={[styles.tableRowContainer]}>
                          <View style={[styles.tableCellView]}>
                            <StyledText>({t('empty')})</StyledText>
                          </View>
                        </View>
                      }
                      onPress={() => {

                      }}
                      bottomDivider
                      containerStyle={[styles.dynamicVerticalPadding(10), {backgroundColor: themeStyle.backgroundColor},]}
                    />
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
