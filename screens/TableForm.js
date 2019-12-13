import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  FlatList
} from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { isEmail, isRequired } from '../validators'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import { DismissKeyboard } from '../components/DismissKeyboard'
import AddBtn from '../components/AddBtn'
import styles from '../styles'

class TableForm extends React.Component {
  static navigationOptions = {
    header: null
  }

  render() {
    const {
      navigation,
      handleSubmit,
      t,
      isEdit,
      initialValues,
      tables = [],
      handleEditCancel
    } = this.props

    return (
      <DismissKeyboard>
        <KeyboardAvoidingView>
          <View
            style={[
              styles.jc_alignIem_center,
              styles.flex_dir_row,
              styles.mgrbtn20
            ]}
          >
            <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
              <Text>Table Name</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="tableName"
                component={InputText}
                validate={isRequired}
                //placeholder={t('email')}
                placeholder="Table Name"
                autoFocus={true}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View
            style={[
              styles.jc_alignIem_center,
              styles.flex_dir_row,
              styles.mgrbtn20
            ]}
          >
            <View style={[styles.onethirdWidth]}>
              <Text>Location X</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              {isEdit ? (
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    width: 125,
                    fontSize: 19,
                    color: '#888',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 25
                  }}
                >
                  {isEdit && initialValues.xcoordinate}
                </Text>
              ) : (
                <Field
                  name="coordinateX"
                  component={InputNumber}
                  type="up-down"
                  // placeholder={t('password')}
                  placeholder="Location X"
                  minValue={0}
                  customVal={isEdit && initialValues.xcoordinate}
                />
              )}
            </View>
          </View>

          <View
            style={[
              styles.jc_alignIem_center,
              styles.flex_dir_row,
              styles.mgrbtn20
            ]}
          >
            <View style={[styles.onethirdWidth]}>
              <Text>Location Y</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              {isEdit ? (
                <Text
                  style={{
                    borderWidth: 1,
                    borderColor: '#ddd',
                    width: 125,
                    fontSize: 19,
                    color: '#888',
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 25
                  }}
                >
                  {isEdit && initialValues.ycoordinate}
                </Text>
              ) : (
                <Field
                  name="coordinateY"
                  component={InputNumber}
                  type="up-down"
                  // placeholder={t('password')}
                  placeholder="Location Y"
                  minValue={0}
                  customVal={isEdit && initialValues.ycoordinate}
                />
              )}
            </View>
          </View>

          <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
            <View style={[styles.onethirdWidth]}>
              <Text>Table Capactity</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="capacity"
                component={InputNumber}
                type="up-down"
                // placeholder={t('password')}
                placeholder="Total Capactity"
                minValue={0}
                customVal={isEdit && initialValues.capacity}
              />
            </View>
          </View>

          <View
            style={[
              {
                width: '100%',
                backgroundColor: '#F39F86',
                marginTop: 40,
                borderRadius: 4
              }
            ]}
          >
            {isEdit ? (
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.gsText}>{t('action.update')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.gsText}>{t('action.save')}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View
            style={[
              {
                width: '100%',
                marginTop: 8,
                borderRadius: 4,
                backgroundColor: '#F39F86'
              }
            ]}
          >
            {isEdit ? (
              <TouchableOpacity onPress={() => handleEditCancel()}>
                <Text style={styles.gsText}>{t('action.cancel')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('TableLayoutEdit')}
              >
                <Text style={styles.gsText}>{t('action.cancel')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </DismissKeyboard>
    )
  }
}

TableForm = reduxForm({
  form: 'tableForm'
})(TableForm)

export default TableForm
