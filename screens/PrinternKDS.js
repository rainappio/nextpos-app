import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'
import Icon from 'react-native-vector-icons/Ionicons'
import { Accordion, List } from '@ant-design/react-native';
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import { getPrinters, getWorkingAreas } from '../actions'
import PopUp from '../components/PopUp'
import styles from '../styles'

class PrinternKDS extends React.Component {
	constructor() {
    super(...arguments);
    this.state = {
      activeSections: [2, 0],
    };
    this.onChange = activeSections => {
      this.setState({ activeSections });
    };
  }

  static navigationOptions = {
    header: null
  }

  componentDidMount(){
  	this.props.getPrinters()
  	this.props.getWorkingAreas()
  }

  render() {
  	const { printers=[], workingareas=[], loading, navigation, haveError, haveData } = this.props  	
		const { t } = this.props.screenProps

  	if(loading){
  		return (
      	<View style={[styles.container]}>
        	<ActivityIndicator size="large" color="#ccc" />
      	</View>
    	)
  	} else if (haveError) {
    return (
      <View style={[styles.container]}>
        <Text>Err during loading, check internet conn...</Text>
      </View>
    )
  	} else if (workingareas.length === 0) {
    return (
      <View style={[styles.container]}>
        <Text>no workingareas ...</Text>
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
              {t('settings.workingArea')}
            </Text>
    
            <PopUp 
            	navigation={navigation}             	
            	toRoute1={'PrinterAdd'}
            	toRoute2={'WorkingAreaAdd'}            	
            	textForRoute1={'Printer'}
            	textForRoute2={'Working Area'}
            	dataArr={printers}
            />
          </View>

          <View>
          	<Text
              style={[
                styles.orange_bg,
                styles.whiteColor,
                styles.paddingTopBtn8,
                styles.centerText,
                styles.textBig,
                styles.mgrtotop20
              ]}
            >
              Printers
            </Text>
          	<View style={[styles.container, styles.no_mgrTop, styles.mgrbtn20]}>        		
          		<SwipeListView
                data={printers}
                renderItem={(data, rowMap) => (
                  <View style={styles.rowFront}>
                    <Text
                      key={rowMap}
                      style={{ paddingTop: 20, paddingBottom: 20 }}
                    >
                      {data.item.name}
                    </Text>
                  </View>
                )}
                keyExtractor={(data, rowMap) => rowMap.toString()}
                renderHiddenItem={(data, rowMap) => (
                  <View style={styles.rowBack} key={rowMap}>
                    <View style={styles.editIconII}>
                      <Icon
                        name="md-create"
                        size={25}
                        color="#fff"
                        onPress={() =>
                          this.props.navigation.navigate('PrinterEdit', {
                            id: data.item.id
                          })
                        }
                      />
                    </View>
                  </View>
                )}
                leftOpenValue={0}
                rightOpenValue={-80}
              />
          	</View>

            <Text
              style={[
                styles.orange_bg,
                styles.whiteColor,
                styles.paddingTopBtn8,
                styles.centerText,
                styles.textBig
              ]}
            >
              Working Area
            </Text>

            <View style={[styles.container, styles.no_mgrTop]}>
              <SwipeListView
                data={workingareas}
                renderItem={(data, rowMap) => (
                  <View style={styles.rowFront}>
                    <Text
                      key={rowMap}
                      style={{ paddingTop: 20, paddingBottom: 20 }}
                    >
                      {data.item.name}
                    </Text>
                  </View>
                )}
                keyExtractor={(data, rowMap) => rowMap.toString()}
                renderHiddenItem={(data, rowMap) => (
                  <View style={styles.rowBack} key={rowMap}>
                    <View style={styles.editIconII}>
                      <Icon
                        name="md-create"
                        size={25}
                        color="#fff"
                        onPress={() =>
                          this.props.navigation.navigate('WorkingAreaEdit', {
                            id: data.item.id,
                            printers: printers
                          })
                        }
                      />
                    </View>
                  </View>
                )}
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
	cks: state,
	printers: state.printers.data.printers,
	workingareas: state.workingareas.data.workingAreas,
	loading: state.workingareas.loading,
	haveError: state.workingareas.haveError,
	haveData: state.workingareas.haveData
})
const mapDispatchToProps = (dispatch) => ({
	dispatch,
	getPrinters: () => dispatch(getPrinters()),
	getWorkingAreas: () => dispatch(getWorkingAreas())
})
export default connect(mapStateToProps, mapDispatchToProps)(PrinternKDS)
