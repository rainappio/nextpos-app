import React, {useContext} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {Tooltip} from 'react-native-elements'
import {LocaleContext} from '../locales/LocaleContext'
import {StyledText} from "./StyledText";
import styles from '../styles'


export const OfferTooltip = ({offer, t, discount, style}) => {

  const localeContext = useContext(LocaleContext);
  const {customMainThemeColor} = localeContext

  const passedStyles = Array.isArray(style) ? style : [style]

  renderOfferToolTip = () => {
    if (!!offer && !!offer.offerName) {
      return (
        <View>
          <StyledText style={[styles.inverseText(localeContext), styles.borderBottomLine, styles.textBold, {marginBottom: 4}]}>
            {t('order.activeOffer')} :
          </StyledText>
          <StyledText style={[styles.inverseText(localeContext)]}>
            {offer.offerName}
          </StyledText>
        </View>
      )
    } else {
      return (
        <View>
          <StyledText style={[styles.inverseText(localeContext)]}>
            {t('order.noActiveOffer')}
          </StyledText>
        </View>
      )
    }
  }

  return (
    <Tooltip
      height={60} width={160} backgroundColor={customMainThemeColor}
      popover={renderOfferToolTip()}
    >
      <StyledText style={[...passedStyles]}>${discount}</StyledText>
    </Tooltip>
  )
}
