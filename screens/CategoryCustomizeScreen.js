import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput,
  AsyncStorage
} from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import { getLables, getProductOption, getWorkingAreas, getLabel } from '../actions'
import RNSwitch from '../components/RNSwitch'
import { Grid } from '@ant-design/react-native'
import RenderRadioBtn from '../components/RadioItem'
import RenderRadioBtns from '../components/RadioItems'
import styles from '../styles'

class CategoryCustomizeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount(){
 		this.props.getProductOption();
  	this.props.getWorkingAreas();
  }

  render() {
    const { labels, prodctsoptions, workingareas, handleSubmit, labelName} = this.props
    return (
    	 <ScrollView>
        <View style={[styles.container_nocenterCnt]}>       
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Customize Category
          </Text>

          <Text style={[styles.textBig,styles.centerText]}>{labelName}</Text>

          <View style={[styles.borderBottomLine, styles.paddBottom_20]}>
            <Text>Option</Text>            
            <AddBtn customTop={-6} onPress={() => this.props.navigation.navigate('Option')}/>
          </View> 
  
          <View style={[ styles.borderBottomLine, styles.paddingTopBtn20 ]}>
            <Field
							name="productOptionIds"
							component={RenderRadioBtns}
							customValue={prodctsoptions.id}
							optionName={prodctsoptions.optionName}
            />
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row, styles.paddingTopBtn20, styles.borderBottomLine]}>
            <View>
              <Text>Apply To Product</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="appliesToProducts"
                component={RNSwitch}
                isChecked={true}
              />
            </View>
          </View>

          <View>
          	<View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
            	<Text>Working Area</Text>
          	</View>
          	{
							workingareas !== undefined && workingareas.map(workarea => 
							<View style={[ styles.borderBottomLine, styles.paddingTopBtn20 ]} key={workarea.id}>
            		<Field
									name="workingAreaId"
									component={RenderRadioBtn}
									customValue={workarea.id}
									optionName={workarea.name}
            		/>
          		</View>
          	)}
          </View> 

					<View
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                borderRadius: 4,
                marginBottom: 8
              }
            ]}
          >
          <TouchableHighlight onPress={handleSubmit}>
            <Text style={styles.gsText}>Save</Text>
          </TouchableHighlight>
        </View>



<View
            style={[
              {
                width: '100%',
                bottom: 0,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: '#F39F86'
              }
            ]}
          >
              <TouchableHighlight
                onPress={() => this.props.navigation.navigate('StaffsOverview')}
              >
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableHighlight>
</View>

        </View>
        </ScrollView>
    )
  }
}

const mapStateToProps = (state,props) => ({
	gggs: props,
  labels: state.labels.data.labels,
  prodctsoptions: state.productoption.data,
  workingareas: state.workingareas.data.workingAreas,
  initialValues: {
  	label: props.labelName,
    appliesToProducts: false
  }
})

const mapDispatchToProps = dispatch => ({
  getWorkingAreas: () => dispatch(getWorkingAreas()),
  getProductOption: () => dispatch(getProductOption()),
})

CategoryCustomizeScreen = reduxForm({
  form: 'categorylist_searchform'
})(CategoryCustomizeScreen)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryCustomizeScreen)