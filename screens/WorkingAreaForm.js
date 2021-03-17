import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Text, TouchableOpacity, View} from 'react-native'
import {isRequired} from '../validators'
import InputText from '../components/InputText'
import RenderCheckboxGroup from '../components/CheckBoxGroup'
import styles from '../styles'
import {LocaleContext} from '../locales/LocaleContext'
import {StyledText} from "../components/StyledText";
import DeleteBtn from '../components/DeleteBtn'
import DropDown from '../components/DropDown'

class WorkingAreaForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  constructor(props, context) {
    super(props, context)

    context.localize({
      en: {
        editWorkingAreaTitle: 'Edit Working Area',
        addWorkingAreaTitle: 'Add Working Area',
        workingAreaName: 'Name',
        noOfPrintCopies: 'No. of Print Copies',
        linkedPrinters: 'Linked Printer(s)',
        visibilityOption: 'Visibility',
        showAll: 'Show All',
        showInRoster: 'Show in Roster Screen',
        showInProduct: 'Show in Product Screen',
      },
      zh: {
        editWorkingAreaTitle: '編輯工作區',
        addWorkingAreaTitle: '新增工作區',
        workingAreaName: '名稱',
        noOfPrintCopies: '預設出單張數',
        linkedPrinters: '連結出單機設定',
        visibilityOption: '顯示範圍設定',
        showAll: '全部顯示',
        showInRoster: '顯示於排班',
        showInProduct: '顯示於產品管理',
      }
    })
  }

  render() {
    const {handleSubmit, isEdit, handleEditCancel, navigation} = this.props
    const {t, customMainThemeColor} = this.context

    return (
      <View style={styles.flex(1)}>
        <View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, styles.flex(1)]}>
              <StyledText style={styles.fieldTitle}>{t('workingAreaName')}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <Field
                name="name"
                component={InputText}
                type="text"
                validate={[isRequired]}
                placeholder={t('workingAreaName')}
              />
            </View>
          </View>

          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, styles.flex(1)]}>
              <StyledText style={styles.fieldTitle}>{t('noOfPrintCopies')}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <Field
                name="noOfPrintCopies"
                component={InputText}
                validate={isRequired}
                placeholder={t('noOfPrintCopies')}
                keyboardType="numeric"
                defaultvalue="1"
                format={(value, name) => {
                  return value !== undefined && value !== null
                    ? String(value)
                    : ''
                }}
              />
            </View>
          </View>
          <View style={styles.tableRowContainerWithBorder}>
            <View style={[styles.tableCellView, styles.flex(1)]}>
              <StyledText style={styles.fieldTitle}>{t('visibilityOption')}</StyledText>
            </View>
            <View style={[styles.tableCellView, styles.justifyRight]}>
              <Field
                name="visibility"
                component={DropDown}
                options={[{value: 'ALL', label: t('showAll')}, {value: 'ROSTER', label: t('showInRoster')}, {value: 'PRODUCT', label: t('showInProduct')}]}
                search
                selection
                fluid
                defaultValue={isEdit ? null : {value: 'ALL', label: t('showAll')}}
              />
            </View>
          </View>

          <View style={[styles.sectionTitleContainer]}>
            <StyledText style={styles.sectionTitleText}>{t('linkedPrinters')}</StyledText>
          </View>

          <Field
            name="printerIds"
            component={RenderCheckboxGroup}
            customarr={
              isEdit
                ? this.props.dataArr
                : this.props.navigation.state.params.dataArr
            }
            navigation={navigation}
            customRoute={'PrinterEdit'}
          />
        </View>

        <View style={[styles.bottom, styles.horizontalMargin]}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.actionButton(customMainThemeColor)]}>
              {isEdit ? t('action.update') : t('action.save')}
            </Text>
          </TouchableOpacity>
          {isEdit ? (
            <>
              <TouchableOpacity onPress={handleEditCancel}>
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
              <DeleteBtn handleDeleteAction={handleSubmit(data => {
                this.props?.handleDelete(data)
              })} />
            </>
          ) : (
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('PrinternKDS')}
              >
                <Text style={[styles?.bottomActionButton(customMainThemeColor), styles?.secondActionButton(this.context)]}>
                  {t('action.cancel')}
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
    )
  }
}

WorkingAreaForm = reduxForm({
  form: 'workingAreaForm'
})(WorkingAreaForm)

export default WorkingAreaForm
