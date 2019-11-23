import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { ScrollView, Text, View } from 'react-native'
import { connect } from 'react-redux'
import InputText from '../components/InputText'
import BackBtn from '../components/BackBtn'
import AddBtn from '../components/AddBtn'
import { getLables } from '../actions'
import styles from '../styles'

class CategoryListScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentWillMount() {
    this.props.getLables()
  }

  render() {
    const { labels } = this.props

    var Labels =
      labels !== undefined &&
      labels.map(lbl => {
        return (
          <View key={lbl.id}>
            <Text
              style={{
                borderBottomWidth: 1,
                marginTop: 8,
                marginBottom: 8,
                paddingTop: 12,
                paddingBottom: 12,
                borderBottomColor: '#f1f1f1',
                position: 'relative'
              }}
            >
              {lbl.label}
            </Text>
          </View>
        )
      })
    return (
      <ScrollView>
        <View style={[styles.container]}>
          <BackBtn />
          <Text
            style={[
              styles.welcomeText,
              styles.orange_color,
              styles.textMedium,
              styles.textBold
            ]}
          >
            Categories
          </Text>
          <AddBtn toRoute="Category" />

          <Field
            name="product_search"
            component={InputText}
            placeholder="Search"
            secureTextEntry={false}
            isgrayBg={true}
          />

          {Labels}
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  labels: state.labels.data.labels
})

const mapDispatchToProps = dispatch => ({
  getLables: () => dispatch(getLables())
})

CategoryListScreen = reduxForm({
  form: 'categorylist_searchform'
})(CategoryListScreen)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryListScreen)
