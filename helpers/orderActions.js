import {api, dispatchFetchRequest, successMessage} from "../constants/Backend";
import NavigationService from "../navigation/NavigationService";
import {Image, View} from "react-native";
import images from "../assets/images";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/Ionicons";
import React from "react";

export const renderOrderState = state => {
  switch (state) {
    case 'OPEN':
      return <Image
        source={images.order}
        style={{width: 15, height: 20}}
      />
    case 'IN_PROCESS':
      return <Image
        source={images.process}
        style={{width: 30, height: 20}}
      />
    case 'DELIVERED':
      return <MCIcon
        name={'silverware-fork-knife'}
        size={23}
        style={{
          fontWeight: 'bold'
        }}
        color="#f18d1a"
      />
    case 'SETTLED':
      return <Image
        source={images.settled}
        style={{width: 28, height: 20, flex: 1}}
      />
    case 'COMPLETED':
      return <Icon
        name={'md-checkmark-circle-outline'}
        color="#f18d1a"
        size={25}
        style={{
          fontWeight: 'bold'
        }}
      />
    case 'DELETED':
      return <MCIcon
        name={'delete'}
        size={25}
        style={{
          fontWeight: 'bold'
        }}
        color="#f18d1a"
      />
  }
}

export const handleOrderSubmit = id => {
  const formData = new FormData()
  formData.append('action', 'SUBMIT')

  dispatchFetchRequest(
    api.order.process(id),
    {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {},
      body: formData
    },
    response => {
      response.json().then(data => {
        if (data.hasOwnProperty('orderId')) {
          successMessage('Order submitted')
          NavigationService.navigate('TablesSrc')
        }
      })
    }
  ).then()
}

export const handleDelete = id => {
  dispatchFetchRequest(
    api.order.delete(id),
    {
      method: 'DELETE',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    response => {
      successMessage('Deleted')
      NavigationService.navigate('TablesSrc')
    }
  ).then()
}
