import React from 'react'
import { Field, reduxForm, FieldArray } from 'redux-form'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { DismissKeyboard } from '../components/DismissKeyboard'
import BackBtn from '../components/BackBtn'
import DeleteBtn from '../components/DeleteBtn'
import InputText from '../components/InputText'
import RenderPureCheckBox from '../components/rn-elements/PureCheckBox'
import { isRequired } from '../validators'
import styles from '../styles'
import {LocaleContext} from "../locales/LocaleContext";

class AnnouncementsForm extends React.Component {
  static navigationOptions = {
    header: null
  }
  static contextType = LocaleContext

  componentDidMount() {
    this.context.localize({
      en: {
        newAnnouncementTitle: 'New Announcement',
        editAnnouncementTitle: 'Edit Announcement',
        announcementTitle: 'Title',
        markdownContent: 'Markdown Content'
      },
      zh: {
        newAnnouncementTitle: '新公告',
        editAnnouncementTitle: '編輯公告',
        announcementTitle: '標題',
        markdownContent: 'Markdown內容'
      }
    })
  }

  render() {
    const {
      handleSubmit,
      isEdit,
      handleEditCancel,
      handleDelete,
      initialValues
    } = this.props

    const { t } = this.context

    var iconsArr = [
      { label: 'ios-attach', value: 'ios-attach' },
      { label: 'ios-paper', value: 'ios-paper' },
      { label: 'ios-notifications', value: 'ios-notifications' },
      { label: 'md-text', value: 'md-text' },
      { label: 'md-today', value: 'md-today' }
    ]
    return (
      <View>
        <Field
          component={InputText}
          name="title"
          placeholder={t('announcementTitle')}
          validate={isRequired}
        />

        <View style={styles.textAreaContainer}>
          <Field
            style={[styles.textArea, styles.grayBg]}
            component={InputText}
            name="markdownContent"
            placeholder={t('markdownContent')}
            validate={isRequired}
            numberOfLines={10}
            multiline={true}
            height={80}
            underlineColorAndroid="transparent"
          />
        </View>

        {iconsArr.map((icon, ix) => (
          <View
            style={[styles.borderBottomLine, styles.paddingTopBtn8]}
            key={ix}
          >
            <Field
              name="titleIcon"
              component={RenderPureCheckBox}
              customValue={icon.value}
              optionName={icon.label}
              validate={isRequired}
            />
          </View>
        ))}

        <View style={styles.bottom}>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={[styles.bottomActionButton, styles.actionButton]}>
              {t('action.save')}
            </Text>
          </TouchableOpacity>

          {isEdit ? (
            <TouchableOpacity onPress={handleEditCancel}>
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Announcements')}
            >
              <Text style={[styles.bottomActionButton, styles.cancelButton]}>
                {t('action.cancel')}
              </Text>
            </TouchableOpacity>
          )}

          {initialValues !== undefined && initialValues.id != null && (
            <DeleteBtn
              handleDeleteAction={handleDelete}
              params={{ id: initialValues.id }}
            />
          )}
        </View>
      </View>
    )
  }
}

AnnouncementsForm = reduxForm({
  form: 'announce_add_form'
})(AnnouncementsForm)

export default AnnouncementsForm
