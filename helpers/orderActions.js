import {api, dispatchFetchRequestWithOption, successMessage, warningMessage, dispatchFetchRequest} from "../constants/Backend";
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
import {MaterialIcons} from '@expo/vector-icons';

export const renderOrderState = (state, customMainThemeColor) => {
  switch (state) {
    case 'OPEN':
      return (
        <Icon
          name={'md-list'}
          size={25}
          style={styles?.iconStyle(customMainThemeColor)} />
      )
    case 'IN_PROCESS':
      return <Image
        source={images.process}
        style={[{width: 30, height: 20}, {tintColor: customMainThemeColor}]}
      />
    case 'DELIVERED':
      return <MCIcon
        name={'silverware-fork-knife'}
        size={23}
        style={styles?.iconStyle(customMainThemeColor)}
      />
    case 'SETTLED':
      return <Image
        source={images.settled}
        style={[{width: 28, height: 20}, {tintColor: customMainThemeColor}]}
      />
    case 'COMPLETED':
      return <Icon
        name={'md-checkmark-circle-outline'}
        size={25}
        style={styles?.iconStyle(customMainThemeColor)}
      />
    case 'DELETED':
      return <MCIcon
        name={'delete'}
        size={25}
        style={styles?.iconStyle(customMainThemeColor)}
      />
    case 'CANCELLED':
      return <MCIcon
        name={'file-cancel'}
        size={25}
        style={styles?.iconStyle(customMainThemeColor)}
      />
    case 'PAYMENT_IN_PROCESS':
      return <MaterialIcons name="attach-money" size={25}
        style={styles?.iconStyle(customMainThemeColor)} />
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

export const handlePrintWorkingOrder = (orderId) => {
  dispatchFetchRequestWithOption(
    api.order.printWorkingOrder(orderId),
    {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, {
    defaultMessage: false
  }, response => {
    response.json().then(data => {
      data.map((printerInstructions) => {
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
    }).catch((e) => console.log(e))
  }).then()
}

export const handlePrintOrderDetails = (orderId) => {
  dispatchFetchRequestWithOption(
    api.order.printOrderDetails(orderId),
    {
      method: 'GET',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }, {
    defaultMessage: false
  }, response => {
    response.json().then(printerInstructions => {
      console.log('handlePrintOrderDetails', printerInstructions)
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

    }).catch((e) => console.log(e))
  }).then()
}

export const handleQuickCheckout = async (order, print) => {
  const formData = new FormData()
  formData.append('print', print)

  dispatchFetchRequestWithOption(
    api.order.quickCheckout(order?.orderId),
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
          if (print) {
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
          }
          successMessage(i18n.t('order.submitted'))
          handleOrderAction(order?.orderId, 'ENTER_PAYMENT', () => NavigationService.navigate('Payment', {
            order: order
          }))

        }
      })
    }
  ).then()
}

export const handleRetailCheckout = async (order) => {
  const formData = new FormData()
  formData.append('print', false)

  dispatchFetchRequestWithOption(
    api.order.quickCheckout(order?.orderId),
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

          successMessage(i18n.t('order.submitted'))
          handleOrderAction(order?.orderId, 'ENTER_PAYMENT', () => NavigationService.navigate('RetailPayment', {
            order: order
          }))

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

export const handleCancelInvoice = (id, callback) => {
  console.log(id, callback)
  dispatchFetchRequestWithOption(
    api.order.cancelInvoice(id),
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    }, {
    defaultMessage: false
  },
    response => {
      successMessage(i18n.t('invoiceStatus.CANCELLED'))
      if (callback != null) {
        callback()
      }
    }
  ).then()
}

export const revertSplitOrder = async (sourceOrderId, splitOrderId) => {
  const formData = new FormData()
  formData.append('sourceOrderId', sourceOrderId)
  await dispatchFetchRequestWithOption(api.splitOrder.revert(splitOrderId), {
    method: 'POST',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
  }, {
    defaultMessage: false
  }, response => {

  }).then()
}

export const handleCreateOrderSet = async (orderIds) => {

  dispatchFetchRequest(api.order.getAllOrderSets, {
    method: 'POST',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({orderIds: orderIds})
  },
    response => {

    }).then()
}

export const handleDeleteOrderSet = async (setId) => {

  dispatchFetchRequest(api.order.deleteOrderSet(setId), {
    method: 'DELETE',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  },
    response => {

    }).then()
}

export const handleOrderAction = (id, action, successCallback = null) => {
  const formData = new FormData()
  formData.append('action', action)

  dispatchFetchRequestWithOption(
    api.order.process(id),
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {

        'x-suppress-error': true
      },
      body: formData
    }, {
    defaultMessage: false
  },
    response => {
      !!successCallback ? successCallback() : console.log('no successCallback')
    }, response => {
      !!successCallback ? successCallback() : console.log('no successCallback')
    }
  ).then()
}

export const getTableDisplayName = (order) => {
  return order?.orderType === 'IN_STORE' ? (!!order?.tables ? order?.tables?.map((table) => table?.displayName)?.join(',') : 'ERR') : i18n.t('order.takeOut')
}