import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight
} from 'react-native';
import { WebBrowser } from 'expo';
import HomeScreen from './HomeScreen';
import CreateAccScreen from './CreateAccScreen';
import { MonoText } from '../components/StyledText';

export default class IntroAppScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
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
        <Text style={styles.welcomeText}>Simplify</Text>
        <Text style={styles.welcomeText}>Your</Text>
        <Text style={styles.welcomeText}>Selling</Text>

        <View style={[{ width: "100%", backgroundColor: "#F39F86", position: 'absolute', bottom: 56, borderRadius: 4, }]}>
  				<TouchableHighlight onPress={() => this.props.navigation.navigate('CreateAcc')}>
          	<Text style = {styles.gsText}>
            	Create Account
          	</Text>
        	</TouchableHighlight>
				</View>	   

				<View style={[{ width: "100%", position: 'absolute', bottom: 0, borderRadius: 4,borderWidth: 1, borderColor: '#F39F86', }]}>
					<TouchableHighlight onPress={() => this.props.navigation.navigate('Login')}>
          	<Text style = {styles.signInText}>
            	Sign In
          	</Text>
        	</TouchableHighlight>
        </View>

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
   	letterSpacing: 4,
  	lineHeight: 35,
  },
  gsText: {
  	padding: 14,
  	textAlign: 'center',
  	color: '#fff',
  	fontSize: 16,
  },
  signInText: {
  	color: '#F39F86',
  	padding: 14,
  	textAlign: 'center',
  	fontSize: 16,
  }
});
