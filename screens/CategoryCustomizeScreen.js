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
<<<<<<< HEAD
import {
  getLables,
  getProductOption,
  getWorkingAreas,
  getLabel
} from '../actions'
=======
import { getLables, getProductOption, getWorkingAreas, getLabel } from '../actions'
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
import RNSwitch from '../components/RNSwitch'
import { Grid } from '@ant-design/react-native'
import RenderRadioBtn from '../components/RadioItem'
import RenderRadioBtns from '../components/RadioItems'
import styles from '../styles'

class CategoryCustomizeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

<<<<<<< HEAD
  componentDidMount() {
    this.props.getProductOption()
    this.props.getWorkingAreas()
  }

  render() {
    const {
      labels,
      prodctsoptions,
      workingareas,
      handleSubmit,
      labelName
    } = this.props
    return (
      <ScrollView>
        <View style={[styles.container_nocenterCnt]}>
=======
  componentDidMount(){
 		this.props.getProductOption();
  	this.props.getWorkingAreas();
  }

  render() {
    const { labels, prodctsoptions, workingareas, handleSubmit, labelName} = this.props
    return (
    	 <ScrollView>
        <View style={[styles.container_nocenterCnt]}>       
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
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

<<<<<<< HEAD
          <Text style={[styles.textBig, styles.centerText]}>{labelName}</Text>

          <View style={[styles.borderBottomLine, styles.paddBottom_20]}>
            <Text>Option</Text>
            <AddBtn
              customTop={-6}
              onPress={() => this.props.navigation.navigate('Option')}
            />
          </View>

          <View style={[styles.borderBottomLine, styles.paddingTopBtn20]}>
            <Field
              name="productOptionIds"
              component={RenderRadioBtns}
              customValue={prodctsoptions.id}
              optionName={prodctsoptions.optionName}
            />
          </View>

          <View
            style={[
              styles.jc_alignIem_center,
              styles.flex_dir_row,
              styles.paddingTopBtn20,
              styles.borderBottomLine
            ]}
          >
=======
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
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
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
<<<<<<< HEAD
            <View style={[styles.paddingTopBtn20, styles.borderBottomLine]}>
              <Text>Working Area</Text>
            </View>
            {workingareas !== undefined &&
              workingareas.map(workarea => (
                <View
                  style={[styles.borderBottomLine, styles.paddingTopBtn20]}
                  key={workarea.id}
                >
                  <Field
                    name="workingAreaId"
                    component={RenderRadioBtn}
                    customValue={workarea.id}
                    optionName={workarea.name}
                  />
                </View>
              ))}
          </View>

          <View
=======
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
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                borderRadius: 4,
                marginBottom: 8
              }
            ]}
          >
<<<<<<< HEAD
            <TouchableHighlight onPress={handleSubmit}>
              <Text style={styles.gsText}>Save</Text>
            </TouchableHighlight>
          </View>

          <View
=======
          <TouchableHighlight onPress={handleSubmit}>
            <Text style={styles.gsText}>Save</Text>
          </TouchableHighlight>
        </View>



<View
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
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
<<<<<<< HEAD
            <TouchableHighlight
              onPress={() => this.props.navigation.navigate('StaffsOverview')}
            >
              <Text style={styles.signInText}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
=======
              <TouchableHighlight
                onPress={() => this.props.navigation.navigate('StaffsOverview')}
              >
                <Text style={styles.signInText}>Cancel</Text>
              </TouchableHighlight>
</View>

        </View>
        </ScrollView>
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
    )
  }
}

<<<<<<< HEAD
const mapStateToProps = (state, props) => ({
  gggs: props,
=======
const mapStateToProps = (state,props) => ({
	gggs: props,
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
  labels: state.labels.data.labels,
  prodctsoptions: state.productoption.data,
  workingareas: state.workingareas.data.workingAreas,
  initialValues: {
<<<<<<< HEAD
    label: props.labelName,
=======
  	label: props.labelName,
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
    appliesToProducts: false
  }
})

const mapDispatchToProps = dispatch => ({
  getWorkingAreas: () => dispatch(getWorkingAreas()),
<<<<<<< HEAD
  getProductOption: () => dispatch(getProductOption())
=======
  getProductOption: () => dispatch(getProductOption()),
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
})

CategoryCustomizeScreen = reduxForm({
  form: 'categorylist_searchform'
})(CategoryCustomizeScreen)

export default connect(
  mapStateToProps,
  mapDispatchToProps
<<<<<<< HEAD
)(CategoryCustomizeScreen)
=======
)(CategoryCustomizeScreen)
>>>>>>> 356370b1a8be35e14e6b6e4e81bedf7a988bad18
