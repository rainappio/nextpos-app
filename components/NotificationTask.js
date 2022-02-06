import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Platform, TouchableOpacity} from 'react-native';
import {api, dispatchFetchRequestWithOption, dispatchFetchRequest} from '../constants/Backend'
import {normalizeTimeString} from '../actions'
import {StyledText} from "./StyledText";


/*Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});*/

export default function NotificationTask(props) {

  /*const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();


  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);

    };
  }, []);*/


  return (
    <TouchableOpacity style={[...props?.buttonStyles]}
      onPress={props?.onPress ?? (() => console.warn('no onPress'))}
    >
      {props?.isStyledText ?
        <StyledText style={[...props?.textStyles]}>
          {props?.buttonText}
        </StyledText>
        :
        <Text style={[...props?.textStyles]}>
          {props?.buttonText}
        </Text>
      }
    </TouchableOpacity>
  );
}

export async function schedulePushNotification(reservation, t, flag) {

  /*const tokenArray = []
  dispatchFetchRequestWithOption(api.notification.get, {
    method: 'GET',
    withCredentials: true,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
  }, {
    defaultMessage: false
  }, response => {
    response.json().then((data) => {

      if (flag == 'CREATE') {
        data.tokens.forEach((token) => tokenArray.push({
          to: token,
          title: `${t('reservation.createNotificationContext')}`,
          body: `${reservation.name}: ${normalizeTimeString(reservation.reservationDate)}`,
        }))
      } else {
        data.tokens.forEach((token) => tokenArray.push({
          to: token,
          title: `${t('reservation.cancelNotificationContext')}`,
          body: `${reservation.name}: ${normalizeTimeString(reservation.reservationStartDate)}`,
        }))
      }

      fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenArray),
      });
    })
  }).then()*/
}

export async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const {status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    dispatchFetchRequestWithOption(api.notification.update, {
      method: 'POST',
      withCredentials: true,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'token': token})
    }, {
      defaultMessage: false
    }, response => {
    }).then()

  } else {
    // alert('Must use physical device for Push Notifications');
    return;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
