import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { ExpoLinksView } from '@expo/samples'
import styles from '../styles'

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    title: 'Links'
  }

  render() {
    return (
      <ScrollView style={styles.mainContainer}>
        {/* Go ahead and delete ExpoLinksView and replace it with your
         * content, we just wanted to provide you with some helpful links */}
        <ExpoLinksView />
      </ScrollView>
    )
  }
}
