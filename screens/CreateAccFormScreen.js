import React from 'react';
import { Field, reduxForm } from 'redux-form';
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
  Button
} from 'react-native';
import { PropTypes } from 'prop-types';
import { isRequired, isEmail } from '../validators';
import InputText from '../components/InputText';


class CreateAccFormScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
  	const { valid, handleSubmit } = this.props;
    return (    	
      <View style={styles.container}>
        <View style={[{ position: 'absolute', top: 0 }]}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/logo.png')
                : require('../assets/images/logo.png')
            }
            style={styles.welcomeImage}
          />
        </View>

        <Text style={styles.welcomeText}>Let's Get Started</Text>

        <Field
					name="clientName"
					component={InputText}
					validate={isRequired}
					placeholder="Client Name"
        />

        <Field
					name="username"
					component={InputText}
					validate={isEmail}
					placeholder="Email Address"
        />

        <Field
					name="username"
					component={InputText}
					validate={isEmail}
					placeholder="Confirm Email Address"
        />

        <Field
					name="Password"
					component={InputText}
					placeholder="Password"
					validate={isRequired}
					type="password"
        />

        <Text style={styles.text}>Accept Seller Agreement and Privacy Policy</Text>
        <Text style={styles.textSmall}>View Seller Agreement and Privacy Policy</Text>
        
        {/*<View style={[{ width: "100%", backgroundColor: "#F39F86", position: 'absolute', bottom: 0, borderRadius: 4, color: "red!important" }]}>
  				<TouchableHighlight onPress={handleSubmit} disabled={!valid}>
          	<Text style = {styles.gsText}>
            	Sign Upp
            </Text>
        	</TouchableHighlight>
				</View>	*/}   

				<Button
					title="Sign Up"
					onPress={handleSubmit}
					//disabled={submitting || (submitFailed && !valid)} 
					disabled={!valid}
					type="submit"
				/>

      </View>    
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 60,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  welcomeText: {
  	textAlign: 'center',
  	textTransform: 'uppercase',
  	fontSize: 20,
   	letterSpacing: 2,
  	lineHeight: 35,
  	marginBottom: 16,
  },
  gsText: {
  	padding: 14,
  	textAlign: 'center',
  	color: '#fff',
  	fontSize: 16,
  },
  text: {
  	fontWeight: 'bold',
  	marginTop: 22,
  	marginBottom: 6,
  },
  textSmall: {
  	fontSize: 12,
  }
});

CreateAccFormScreen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
};

CreateAccFormScreen = reduxForm({
  form: 'createAccForm',
})(CreateAccFormScreen);

export default CreateAccFormScreen;
