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
import { MonoText } from '../components/StyledText';
import { InputText } from '../components/InputText';

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
        <Text style={styles.welcomeText}>Let's Get Started</Text>
        <InputText placeholder="Email Address"/>
        <InputText placeholder="Confirm Email Address"/>
        <InputText placeholder="Password" secureTextEntry={true}/>

        <Text style={styles.text}>Accept Seller Agreement and Privacy Policy</Text>
        <Text style={styles.textSmall}>View Seller Agreement and Privacy Policy</Text>
        
        <View style={[{ width: "100%", backgroundColor: "#F39F86", position: 'absolute', bottom: 0, borderRadius: 4, color: "red!important" }]}>
  				<TouchableHighlight onPress={() => this.props.navigation.navigate('Home')}>
          	<Text style = {styles.gsText}>
            	Sign Upp
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
