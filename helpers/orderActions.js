import {api, dispatchFetchRequestWithOption, successMessage, warningMessage} from "../constants/Backend";
import NavigationService from "../navigation/NavigationService";
import {Image} from "react-native";
import images from "../assets/images";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";
import styles from "../styles"
import i18n from 'i18n-js'
import {StyledText} from "../components/StyledText";
import {printMessage} from "./printerActions";

export const renderOrderState = state => {
  switch (state) {
    case 'OPEN':
      return (
        <Icon
          name={'md-list'}
          size={25}
          style={styles.iconStyle} />
      )
    case 'IN_PROCESS':
      return <Image
        source={images.process}
        style={[{width: 30, height: 20}]}
      />
    case 'DELIVERED':
      return <MCIcon
        name={'silverware-fork-knife'}
        size={23}
        style={styles.iconStyle}
      />
    case 'SETTLED':
      return <Image
        source={images.settled}
        style={[{width: 28, height: 20}]}
      />
    case 'COMPLETED':
      return <Icon
        name={'md-checkmark-circle-outline'}
        size={25}
        style={styles.iconStyle}
      />
    case 'DELETED':
      return <MCIcon
        name={'delete'}
        size={25}
        style={styles.iconStyle}
      />
  }
}

export const renderChildProducts = lineItem => {

  return lineItem.childProducts != null && lineItem.childProducts.map(cp => {
    return (
      <StyledText key={cp.id}>- {cp.productName}</StyledText>
    )
  })
}

export const renderOptionsAndOffer = lineItem => {

  let text = lineItem.options ? lineItem.options + ' ' : ''
  const appliedOfferInfo = lineItem.appliedOfferInfo

  if (appliedOfferInfo != null) {
    text += `${appliedOfferInfo.offerName} (${appliedOfferInfo.overrideDiscount})`
  }

  return (
    <StyledText>{text}</StyledText>
  )
}

export const handleOrderSubmit = id => {
  const formData = new FormData()
  formData.append('action', 'SUBMIT')

  dispatchFetchRequestWithOption(
    api.order.process(id),
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
      body: formData
    }, {
    defaultMessage: false
  },
    response => {
      response.json().then(data => {
        if (data.hasOwnProperty('orderId')) {
          console.log('handleOrderSubmit', data)
          data?.printerInstructions?.map((printerInstructions) => {
            printerInstructions?.ipAddresses?.map((ipAddresses) => {
              for (let i = 0; i < printerInstructions.noOfPrintCopies; i++) {
                printMessage(printerInstructions.printInstruction, ipAddresses, () => {
                  successMessage(i18n.t('printerSuccess'))

                }, () => {
                  warningMessage(i18n.t('printerWarning'))
                }
                )
              }
            })
          })
          successMessage(i18n.t('order.submitted'))
          NavigationService.navigate('TablesSrc')
        }
      })
    }
  ).then()
}

export const handleDelete = (id, callback) => {
  dispatchFetchRequestWithOption(
    api.order.delete(id),
    {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
    defaultMessage: false
  },
    response => {
      successMessage(i18n.t('order.deleted'))

      if (callback != null) {
        callback()
      }
    }
  ).then()
}

