import React from 'react'
import {
  AsyncStorage,
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl
} from 'react-native'
import styles from '../styles'

class ClientUsers extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const { clientusers, refreshing } = this.props

    return (
      <View
        style={[styles.container]}
        refreshControl={<RefreshControl refreshing={refreshing} />}
      >
        <View style={[{ position: 'absolute', top: 10 }]}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/logo.png')
                : require('../assets/images/logo.png')
            }
            style={styles.welcomeImage}
          />
        </View>

        <View>
          <FlatList
            data={clientusers}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  margin: 1,
                  marginBottom: 30
                }}
              >
                <Text
                  style={{
                    backgroundColor: '#f1f1f1',
                    width: 44,
                    height: 44,
                    borderRadius: 44,
                    textAlign: 'center',
                    lineHeight: 44
                  }}
                  onPress={() =>
                    this.props.navigation.navigate('ClientUserLogin', {
                      clientusersName: item.username
                    })
                  }
                >
                  {item.username[0].toUpperCase()}
                </Text>
                <Text style={{ marginLeft: 60, marginTop: -30 }}>
                  {item.username}
                </Text>
              </View>
            )}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    )
  }
}

export default ClientUsers
