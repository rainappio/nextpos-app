import React from 'react'
import { Field, reduxForm } from 'redux-form'
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView
} from 'react-native'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import { isEmail, isRequired } from '../validators'
import InputText from '../components/InputText'
import InputNumber from '../components/InputNumber'
import { DismissKeyboard } from '../components/DismissKeyboard'
import AddBtn from '../components/AddBtn'
import styles from '../styles'
import { LocaleContext } from '../locales/LocaleContext'
import DeleteBtn from "../components/DeleteBtn";

class TableLayoutForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        addTableLayoutTitle: 'Add Table Layout',
        editTableLayoutTitle: 'Edit Table Layout',
        layoutName: 'Layout Name',
        totalCapacity: 'Total Floor Capacity',
        tables: 'Tables',
        manageVisualLayout: 'Manage Visual Layout'
      },
      zh: {
        addTableLayoutTitle: '新增樓面',
        editTableLayoutTitle: '編輯樓面',
        layoutName: '樓面名稱',
        totalCapacity: '桌位總數',
        tables: '桌位',
        manageVisualLayout: '管理桌位位置'
      }
    })
  }

  render() {
    const {
      handleSubmit,
      isEdit,
      initialValues,
      handleDeleteLayout
    } = this.props
    const { t } = this.context

    Item = ({ table, layoutId }) => {
      return (
        <View
          style={styles.tableRowContainerWithBorder}
        >
          <View style={styles.tableCellView}>
            <Text>{table.tableName}</Text>
          </View>
          <View style={[styles.tableCellView, styles.justifyRight]}>
            <AntDesignIcon
              name="ellipsis1"
              size={25}
              color="black"
              onPress={() => {
                this.props.navigation.navigate('TableEdit', {
                  tableId: table.tableId,
                  layoutId: layoutId
                })
              }}
            />
          </View>
        </View>
      )
    }

    return (
      <View style={styles.contentContainer}>
        <View style={styles.tableRowContainerWithBorder}>
          <View style={[styles.tableCellView, styles.flex(1)]}>
            <Text style={styles.fieldTitle}>{t('layoutName')}</Text>
          </View>
          <View style={[styles.tableCellView, styles.justifyRight]}>
            <Field
              name="layoutName"
              component={InputText}
              validate={isRequired}
              placeholder={t('layoutName')}
              autoCapitalize="none"
            />
          </View>
        </View>

        {isEdit && (
          <View>
            <View style={styles.tableRowContainerWithBorder}>
              <View style={[styles.tableCellView, styles.flex(1)]}>
                <Text style={styles.fieldTitle}>{t('totalCapacity')}</Text>
              </View>
              <View style={[styles.tableCellView, styles.justifyRight]}>
                <Text style={styles.fieldTitle}>
                  {isEdit && initialValues.totalCapacity}
                </Text>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitleText}>{t('tables')}</Text>
              </View>
              <FlatList
                data={initialValues.tables}
                renderItem={({ item }) => (
                  <Item table={item} layoutId={initialValues.id} />
                )}
                keyExtractor={item => item.tableId}
              />
            </View>
          </View>
        )}

        <View style={[styles.bottom, styles.horizontalMargin]}>
          {isEdit ? (
            <View>
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('action.update')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('ManageVisualSceen', {
                tables: initialValues.tables,
                layoutId: initialValues.id
              })}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('manageVisualLayout')}
              </Text>
              </TouchableOpacity>
            </View>
          ) : (
              <TouchableOpacity onPress={handleSubmit}>
                <Text style={[styles.bottomActionButton, styles.actionButton]}>
                  {t('action.save')}
                </Text>
              </TouchableOpacity>
            )}
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('TableLayouts')}
          >
            <Text style={[styles.bottomActionButton, styles.cancelButton]}>
              {t('action.cancel')}
            </Text>
          </TouchableOpacity>
          {isEdit && (
            <DeleteBtn
              handleDeleteAction={() => handleDeleteLayout(initialValues.id)}
            />
          )}
        </View>
      </View>
    )
  }
}

TableLayoutForm = reduxForm({
  form: 'tableLayoutForm'
})(TableLayoutForm)

export default TableLayoutForm
