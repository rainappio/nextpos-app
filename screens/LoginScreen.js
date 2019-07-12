import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  TextInput
} from 'react-native';
import { WebBrowser } from 'expo';
import HomeScreen from './HomeScreen';
import { MonoText } from '../components/StyledText';
import { InputText } from '../components/InputText';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
  	email: '',
  	token: '',
  	password: ''
  }

  getValue(text,field){
  	alert("hii")
  }

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
        <Text style={styles.welcomeText}>Welcome l</Text>
        <TextInput placeholder="Email Address" onChangeText={(text)=> this.getValue(text,'email')}/>
        <TextInput placeholder="Password" secureTextEntry={true} onChangeText={(text)=> this.getValue(text,'password')}/>

        <View style={[{ width: "100%", backgroundColor: "#F39F86", position: 'absolute', bottom: 80, borderRadius: 4, }]}>
  				<TouchableHighlight onPress={() => this.props.navigation.navigate('Home')}>
          	<Text style={styles.gsText}>
            	Log In
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
