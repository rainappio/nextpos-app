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
import { LocaleContext } from '../locales/LocaleContext'

class TableLayoutForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        layoutName: 'Layout Name',
        totalCapacity: 'Total Floor Capacity',
        tables: 'Tables'
      },
      zh: {
        layoutName: '樓面名稱',
        totalCapacity: '桌位總數',
        tables: '桌位'
      }
    })

    this.state = {
      t: context.t
    }
  }
  render() {
    const {
      handleSubmit,
      isEdit,
      initialValues,
      tables = [],
      handleEditCancel
    } = this.props
    const { t } = this.state

    Item = ({ table, layoutId }) => {
      return (
        <View
          style={{
            width: '100%',
            paddingTop: 15,
            paddingBottom: 15
          }}
        >
          <Text>{table.tableName}</Text>
          <AntDesignIcon
            name="ellipsis1"
            size={25}
            color="black"
            style={{ position: 'absolute', right: 0, top: 15 }}
            onPress={() => {
              this.props.navigation.navigate('TableEdit', {
                tableId: table.tableId,
                layoutId: layoutId
              })
            }}
          />
        </View>
      )
    }

    return (
      <DismissKeyboard>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View
            style={[
              styles.jc_alignIem_center,
              styles.flex_dir_row,
              styles.mgrbtn20
            ]}
          >
            <View style={[styles.onethirdWidth, styles.mgrtotop8]}>
              <Text>{t('layoutName')}</Text>
            </View>
            <View style={[styles.onesixthWidth]}>
              <Field
                name="layoutName"
                component={InputText}
                validate={isRequired}
                placeholder="Layout Name"
                autoCapitalize="none"
              />
            </View>
          </View>

          {isEdit ? (
            <View>
              <View style={[styles.jc_alignIem_center, styles.flex_dir_row]}>
                <View style={[styles.onethirdWidth]}>
                  <Text>{t('totalCapacity')}</Text>
                </View>
                <View style={[styles.onesixthWidth]}>
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
                    {isEdit && initialValues.totalCapacity}
                  </Text>
                </View>
              </View>

              <View style={styles.mgrtotop20}>
                <Text
                  style={[
                    styles.orange_color,
                    styles.textBold,
                    styles.textMedium
                  ]}
                >
                  {t('tables')}
                </Text>
                <AddBtn
                  onPress={() =>
                    this.props.navigation.navigate('TableAdd', {
                      layoutId: initialValues.id
                    })
                  }
                />
              </View>
              <FlatList
                data={initialValues.tables}
                renderItem={({ item }) => (
                  <Item table={item} layoutId={initialValues.id} />
                )}
                keyExtractor={item => item.tableId}
              />
            </View>
          ) : null}

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
                onPress={() => this.props.navigation.navigate('TableLayouts')}
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

TableLayoutForm = reduxForm({
  form: 'tableLayoutForm'
})(TableLayoutForm)

export default TableLayoutForm
